import { NextResponse } from "next/server";
import { buyAirtime, buyData } from "@/lib/bills/vtpass";

export const runtime = "nodejs";

async function verifyPaystack(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return null;
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` } }
  );
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.data?.status !== "success") return null;
  return data.data;
}

export async function POST(req: Request) {
  let body: { reference?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reference = (body.reference || "").trim();
  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
  }

  const tx = await verifyPaystack(reference);
  if (!tx) {
    return NextResponse.json({ error: "Payment not successful yet." }, { status: 402 });
  }

  const meta = tx.metadata || {};
  const kind = meta.kind as string;
  const phone = meta.phone as string;
  const serviceID = (meta.serviceID as string) || meta.network;
  const amount = Number(meta.amount) || Math.round((tx.amount || 0) / 100);

  if (!phone || !serviceID) {
    return NextResponse.json({ error: "Payment metadata incomplete." }, { status: 400 });
  }

  if (kind === "airtime") {
    const result = await buyAirtime({
      serviceID,
      phone,
      amount,
      request_id: reference.replace(/[^a-zA-Z0-9]/g, "").slice(0, 40),
    });
    return NextResponse.json({
      ok: true,
      kind: "airtime",
      phone,
      amount,
      demo: "demo" in result ? result.demo : false,
      provider: result,
      message:
        "demo" in result && result.demo
          ? "Payment received. Configure VTpass to auto-deliver airtime."
          : "Airtime purchase submitted.",
    });
  }

  if (kind === "data") {
    const variation_code = meta.variation_code as string;
    if (!variation_code) {
      return NextResponse.json({ error: "Missing data plan code." }, { status: 400 });
    }
    const result = await buyData({
      serviceID,
      phone,
      variation_code,
      amount,
      request_id: reference.replace(/[^a-zA-Z0-9]/g, "").slice(0, 40),
    });
    return NextResponse.json({
      ok: true,
      kind: "data",
      phone,
      amount,
      demo: "demo" in result ? result.demo : false,
      provider: result,
      message:
        "demo" in result && result.demo
          ? "Payment received. Configure VTpass to auto-deliver data."
          : "Data purchase submitted.",
    });
  }

  return NextResponse.json({ error: "Unknown bill kind on this payment." }, { status: 400 });
}
