import { NextResponse } from "next/server";
import { buyAirtime, buyData } from "@/lib/bills/vtpass";
import { DATA_PLANS, NETWORKS, normalizeNgPhone } from "@/lib/bills/catalog";
import { fetchPaystackTransaction } from "@/lib/payments/purchase";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { limitRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Delivers airtime/data for a direct Paystack bills payment.
 * Payment metadata can be set by the payer, so the value delivered is always derived
 * from the amount Paystack actually charged, and each reference is redeemed once.
 */
export async function POST(req: Request) {
  const limited = limitRequest(req, "bills-fulfill", 10, 60_000);
  if (limited) return limited;

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

  const tx = await fetchPaystackTransaction(reference);
  if (!tx || tx.status !== "success") {
    return NextResponse.json({ error: "Payment not successful yet." }, { status: 402 });
  }

  const meta = (tx.metadata || {}) as Record<string, unknown>;
  if (meta.source !== "doyintech-bills" || (tx.currency || "NGN").toUpperCase() !== "NGN") {
    return NextResponse.json({ error: "This payment is not a bills payment." }, { status: 400 });
  }

  const kind = String(meta.kind || "");
  const phone = normalizeNgPhone(String(meta.phone || ""));
  const net = NETWORKS.find((n) => n.id === meta.network || n.serviceID === meta.serviceID);
  const paidNgn = Math.floor(tx.amount / 100);

  if (!phone || !net) {
    return NextResponse.json({ error: "Payment metadata incomplete." }, { status: 400 });
  }

  let plan: (typeof DATA_PLANS)[number] | undefined;
  if (kind === "airtime") {
    if (paidNgn < 50 || paidNgn > 50000) {
      return NextResponse.json({ error: "Airtime amount out of range." }, { status: 400 });
    }
  } else if (kind === "data") {
    plan = DATA_PLANS.find(
      (p) => p.network === net.id && p.variation_code === String(meta.variation_code || "")
    );
    if (!plan || paidNgn < plan.amount) {
      return NextResponse.json({ error: "Payment does not cover this data plan." }, { status: 402 });
    }
  } else {
    return NextResponse.json({ error: "Unknown bill kind on this payment." }, { status: 400 });
  }

  // One delivery per payment. Without the DB we fall back to VTpass's request_id dedupe.
  const admin = getSupabaseAdmin();
  if (admin) {
    const { error } = await admin
      .from("payment_claims")
      .insert({ reference, kind: "bills", product_id: kind, amount_kobo: tx.amount });
    if (error?.code === "23505") {
      return NextResponse.json({
        ok: true,
        already: true,
        kind,
        phone,
        message: "This payment has already been delivered.",
      });
    }
    if (error) console.error("bills payment_claims", error.message);
  }

  const request_id = reference.replace(/[^a-zA-Z0-9]/g, "").slice(0, 40);

  if (kind === "airtime") {
    const result = await buyAirtime({ serviceID: net.serviceID, phone, amount: paidNgn, request_id });
    const demo = "demo" in result ? Boolean(result.demo) : false;
    return NextResponse.json({
      ok: true,
      kind: "airtime",
      phone,
      amount: paidNgn,
      demo,
      message: demo
        ? "Payment received. Configure VTpass to auto-deliver airtime."
        : "Airtime purchase submitted.",
    });
  }

  const result = await buyData({
    serviceID: net.serviceID,
    phone,
    variation_code: plan!.variation_code,
    amount: plan!.amount,
    request_id,
  });
  const demo = "demo" in result ? Boolean(result.demo) : false;
  return NextResponse.json({
    ok: true,
    kind: "data",
    phone,
    amount: plan!.amount,
    demo,
    message: demo
      ? "Payment received. Configure VTpass to auto-deliver data."
      : "Data purchase submitted.",
  });
}
