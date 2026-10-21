import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { processReportOrder } from "@/lib/reports/fulfill";

/**
 * Admin-only manual (re)generation, e.g. retrying a failed order.
 * Paid orders are processed automatically by the Paystack webhook / /api/reports/confirm.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const orderId = String(body.orderId || "").trim();
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const result = await processReportOrder(orderId, { allowRetry: true });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result);
}
