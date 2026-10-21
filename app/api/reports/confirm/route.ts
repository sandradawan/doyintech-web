import { NextRequest, NextResponse, after } from "next/server";
import { fetchPaystackTransaction } from "@/lib/payments/purchase";
import { confirmReportPayment, processReportOrder } from "@/lib/reports/fulfill";
import { limitRequest } from "@/lib/rate-limit";

export const maxDuration = 60;

/**
 * Called by /reports/success after Paystack redirects back. Verifies the reference with
 * Paystack (never trusting the browser), marks the order paid, and starts generation.
 * The webhook does the same; whichever arrives first wins and the other is a no-op.
 */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "report-confirm", 20, 60_000);
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  const orderId = String(body.orderId || "").trim();
  const reference = String(body.reference || "").trim();
  if (!orderId || !reference) {
    return NextResponse.json({ error: "orderId and reference required" }, { status: 400 });
  }

  const tx = await fetchPaystackTransaction(reference);
  if (!tx) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  const confirmed = await confirmReportPayment(orderId, tx);
  if (!confirmed.ok) {
    return NextResponse.json({ error: confirmed.error }, { status: confirmed.status });
  }

  after(async () => {
    await processReportOrder(orderId);
  });

  return NextResponse.json({ ok: true });
}
