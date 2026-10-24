import { NextRequest, NextResponse } from "next/server";
import { createPendingCard } from "@/lib/giftcards/server";
import { GIFT_MAX_KOBO, GIFT_MIN_KOBO, naira } from "@/lib/giftcards/shared";
import { limitRequest } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Starts a gift card purchase. The card activates (and is emailed) when Paystack confirms payment. */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "gift-buy", 10, 60_000);
  if (limited) return limited;
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  if (!secret) return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const amountKobo = Math.round(Number(body.amountKobo) || 0);
  const purchaserEmail = String(body.purchaserEmail || "").trim().toLowerCase();
  const recipientEmail = String(body.recipientEmail || "").trim().toLowerCase() || null;
  if (amountKobo < GIFT_MIN_KOBO || amountKobo > GIFT_MAX_KOBO || amountKobo % 100 !== 0) {
    return NextResponse.json({ error: `Choose an amount between ${naira(GIFT_MIN_KOBO)} and ${naira(GIFT_MAX_KOBO)}.` }, { status: 400 });
  }
  if (!EMAIL_RE.test(purchaserEmail)) return NextResponse.json({ error: "Enter your email for the receipt." }, { status: 400 });
  if (recipientEmail && !EMAIL_RE.test(recipientEmail)) return NextResponse.json({ error: "Enter a valid email for the recipient." }, { status: 400 });

  const clip = (v: unknown, n: number) => String(v || "").trim().slice(0, n) || null;
  let reference: string;
  try {
    ({ reference } = await createPendingCard({
      amountKobo,
      design: String(body.design || "classic"),
      purchaserEmail,
      purchaserName: clip(body.purchaserName, 80),
      recipientName: clip(body.recipientName, 80),
      recipientEmail,
      message: clip(body.message, 200),
    }));
  } catch (e) {
    console.error("gift create", e);
    return NextResponse.json({ error: "Could not start the purchase. Try again shortly." }, { status: 500 });
  }

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: purchaserEmail,
      amount: amountKobo,
      currency: "NGN",
      reference,
      callback_url: `${SITE_URL}/gift-cards/success?reference=${reference}`,
      metadata: { kind: "gift_card", product_name: `DoyinTech gift card ${naira(amountKobo)}` },
    }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.status) return NextResponse.json({ error: data?.message || "Could not start payment." }, { status: 502 });
  return NextResponse.json({ ok: true, authorization_url: data.data.authorization_url, reference });
}
