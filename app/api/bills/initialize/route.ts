import { NextResponse } from "next/server";
import { NETWORKS, DATA_PLANS, normalizeNgPhone } from "@/lib/bills/catalog";

export const runtime = "nodejs";

type Body = {
  kind: "airtime" | "data";
  network: string;
  phone: string;
  amount?: number;
  variation_code?: string;
  email?: string;
};

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Paystack is not configured. Add PAYSTACK_SECRET_KEY." },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const phone = normalizeNgPhone(body.phone || "");
  if (!phone) {
    return NextResponse.json({ error: "Enter a valid Nigerian phone number." }, { status: 400 });
  }

  const net = NETWORKS.find((n) => n.id === body.network || n.serviceID === body.network);
  if (!net) {
    return NextResponse.json({ error: "Select a network." }, { status: 400 });
  }

  let amount = 0;
  let label = "";
  let variation_code = body.variation_code || "";

  if (body.kind === "airtime") {
    amount = Math.floor(Number(body.amount) || 0);
    if (amount < 50 || amount > 50000) {
      return NextResponse.json(
        { error: "Airtime amount must be between ₦50 and ₦50,000." },
        { status: 400 }
      );
    }
    label = `${net.label} airtime ₦${amount.toLocaleString()} → ${phone}`;
  } else if (body.kind === "data") {
    const plan = DATA_PLANS.find(
      (p) => p.network === net.id && p.variation_code === body.variation_code
    );
    if (!plan) {
      return NextResponse.json({ error: "Select a valid data plan." }, { status: 400 });
    }
    amount = plan.amount;
    variation_code = plan.variation_code;
    label = `${plan.name} → ${phone}`;
  } else {
    return NextResponse.json({ error: "Invalid product kind." }, { status: 400 });
  }

  const email =
    (body.email || "").trim() || `bills+${phone.slice(-8)}@doyintech.vercel.app`;

  const reference = `BILL_${body.kind}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
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
      callback_url: `${origin}/bills?paid=1&ref=${encodeURIComponent(reference)}`,
      metadata: {
        kind: body.kind,
        network: net.id,
        serviceID: net.serviceID,
        phone,
        amount,
        variation_code,
        label,
        source: "doyintech-bills",
      },
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.data?.authorization_url) {
    return NextResponse.json(
      { error: data?.message || "Could not start Paystack payment." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    access_code: data.data.access_code,
    reference,
    amount,
    label,
  });
}
