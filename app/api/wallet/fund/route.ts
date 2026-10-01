import { NextResponse } from "next/server";
import { getUserFromRequest, ensureProfileWallet } from "@/lib/bills/session";

export const runtime = "nodejs";

const MIN_NAIRA = 100;
const MAX_NAIRA = 500_000;

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 503 });
  }

  let body: { amount_naira?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const amount = Math.floor(Number(body.amount_naira) || 0);
  if (amount < MIN_NAIRA || amount > MAX_NAIRA) {
    return NextResponse.json(
      { error: `Fund between ₦${MIN_NAIRA} and ₦${MAX_NAIRA.toLocaleString()}` },
      { status: 400 }
    );
  }

  await ensureProfileWallet(user.id, user.email);

  const email =
    (user.email || "").trim() || `wallet+${user.id.slice(0, 8)}@doyintech.vercel.app`;
  const reference = `WFUND_${user.id.replace(/-/g, "").slice(0, 12)}_${Date.now()}`;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://doyintech.vercel.app";

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amount * 100,
      currency: "NGN",
      reference,
      callback_url: `${origin}/wallet?funded=1&ref=${encodeURIComponent(reference)}`,
      metadata: {
        source: "wallet_fund",
        user_id: user.id,
        amount_naira: amount,
        kind: "wallet_fund",
      },
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.data?.authorization_url) {
    return NextResponse.json(
      { error: data?.message || "Could not start funding" },
      { status: 502 }
    );
  }

  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    reference,
    amount_naira: amount,
  });
}
