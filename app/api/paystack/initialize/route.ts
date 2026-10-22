import { NextRequest, NextResponse, after } from "next/server";
import { recordEvent } from "@/lib/analytics/server";
import { getPayItem } from "@/lib/paystack-catalog";
import { signQuote } from "@/lib/payments/purchase";
import { SITE_URL } from "@/lib/site";
import { limitRequest } from "@/lib/rate-limit";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Always charge NGN: amounts are kobo. Sending kobo as USD cents would overcharge
    // ~1500x. International cards convert at the cardholder's bank.
    const payload = {
      email,
      amount: item.amountKobo,
      currency: "NGN",
      callback_url: `${SITE_URL}${callbackPath}`,
      metadata: {
        product_id: item.id,
        product_name: item.name,
        customer_name: name || undefined,
        delivery: item.delivery,
        kind: isServiceDeposit ? "service_deposit" : "digital",
        display_currency: "USD",
        quoted_kobo: item.amountKobo,
        quote_sig: signQuote(item.id, item.amountKobo),
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
        amount: item.amountKobo,
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
    });
  } catch {
    return NextResponse.json({ error: "Payment init failed." }, { status: 500 });
  }
}
