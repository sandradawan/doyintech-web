import { NextRequest, NextResponse, after } from "next/server";
import { recordEvent } from "@/lib/analytics/server";
import { getPayItem } from "@/lib/paystack-catalog";
import { signQuote } from "@/lib/payments/purchase";
import { captureGiftHold, checkGiftCode, holdGiftCredit, newRef } from "@/lib/giftcards/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/site";
import { limitRequest } from "@/lib/rate-limit";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Paystack's smallest sensible charge; a gift card never leaves a remainder below this. */
const MIN_CHARGE_KOBO = 10_000;

/**
 * Starts checkout for a catalog product. With `giftCode`, the card pays first:
 * - card covers everything → no Paystack; the "authorization_url" is our own success page (GC_ reference)
 * - card covers part → card share is held, Paystack charges the rest with a signed quote
 */
export async function POST(req: NextRequest) {
  try {
    if (!SECRET) {
      return NextResponse.json(
        {
          error: "Paystack is not configured yet.",
          code: "NO_KEYS",
          fallback: "whatsapp",
        },
        { status: 503 }
      );
    }

    const limited = limitRequest(req, "paystack-init", 20, 60_000);
    if (limited) return limited;

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const productId = String(body.productId || "").trim();
    const name = String(body.name || "").trim().slice(0, 120);
    const giftCode = String(body.giftCode || "").trim();

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const item = await getPayItem(productId);
    if (!item || item.amountKobo <= 0) {
      return NextResponse.json({ error: "Invalid product." }, { status: 400 });
    }

    const isServiceDeposit = item.id.startsWith("service-");
    const callbackPath = isServiceDeposit
      ? `/hire/success?product=${encodeURIComponent(item.id)}`
      : `/products/success?product=${encodeURIComponent(item.id)}`;

    // ── Gift card ────────────────────────────────────────────────────────
    let giftKobo = 0;
    const reference = newRef("DT");
    // An empty or invalid card never blocks checkout: the buyer simply pays the full price.
    const card = giftCode ? await checkGiftCode(giftCode).catch(() => null) : null;
    if (card?.usable && card.balanceKobo > 0) {
      const fullRef = newRef("GC");
      const covered = card.balanceKobo >= item.amountKobo ? await holdGiftCredit(giftCode, fullRef, item.amountKobo, item.id, email) : 0;
      if (covered >= item.amountKobo && (await captureGiftHold(fullRef))) {
        after(async () => {
          const sb = getSupabaseAdmin();
          await sb
            ?.from("payment_claims")
            .insert({ reference: fullRef, kind: "gift_card", product_id: item.id, email, amount_kobo: item.amountKobo });
          await recordEvent("payment", { req, label: `${item.name} (gift card)`, valueKobo: item.amountKobo });
        });
        return NextResponse.json({
          ok: true,
          paid_with_gift_card: true,
          gift_kobo: covered,
          authorization_url: `${SITE_URL}${callbackPath}&reference=${fullRef}`,
          reference: fullRef,
        });
      }
      // Part payment (or the balance changed mid-checkout): hold what's left, keeping ≥ ₦100 for Paystack.
      if (!covered) {
        const usable = Math.min(card.balanceKobo, item.amountKobo - MIN_CHARGE_KOBO);
        if (usable > 0) giftKobo = await holdGiftCredit(giftCode, reference, usable, item.id, email);
      }
    }

    const chargeKobo = item.amountKobo - giftKobo;

    // Always charge NGN: amounts are kobo. Sending kobo as USD cents would overcharge
    // ~1500x. International cards convert at the cardholder's bank.
    const payload = {
      email,
      amount: chargeKobo,
      currency: "NGN",
      reference,
      callback_url: `${SITE_URL}${callbackPath}`,
      metadata: {
        product_id: item.id,
        product_name: item.name,
        customer_name: name || undefined,
        delivery: item.delivery,
        kind: isServiceDeposit ? "service_deposit" : "digital",
        display_currency: "USD",
        quoted_kobo: chargeKobo,
        quote_sig: signQuote(item.id, chargeKobo),
        ...(giftKobo ? { gift_hold: reference, gift_kobo: giftKobo } : {}),
      },
    };

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.status) {
      return NextResponse.json(
        { error: data.message || "Could not start payment." },
        { status: 400 }
      );
    }

    console.log(
      JSON.stringify({
        event: "paystack_initialize",
        product: item.id,
        amount: chargeKobo,
        gift_kobo: giftKobo || undefined,
        reference: data.data?.reference,
        at: new Date().toISOString(),
      })
    );

    after(() => recordEvent("checkout_start", { req, label: item.name, valueKobo: item.amountKobo }));

    return NextResponse.json({
      ok: true,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
      gift_kobo: giftKobo || undefined,
    });
  } catch {
    return NextResponse.json({ error: "Payment init failed." }, { status: 500 });
  }
}
