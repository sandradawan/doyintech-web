import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fetchPaystackTransaction } from "@/lib/payments/purchase";
import { markStorefrontOrderPaid } from "@/lib/storefront/orders";
import { limitRequest } from "@/lib/rate-limit";

/**
 * Order status for the customer's return page. If the webhook hasn't landed yet, verify the
 * reference with Paystack directly. Returns only what the customer already knows.
 */
export async function GET(req: NextRequest) {
  const limited = limitRequest(req, "storefront-order", 30, 60_000);
  if (limited) return limited;
  const ref = (req.nextUrl.searchParams.get("ref") || "").trim();
  const sb = getSupabaseAdmin();
  if (!sb || !/^SF_[a-z0-9]+_[a-f0-9]{8}$/.test(ref)) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { data: order } = await sb
    .from("storefront_orders")
    .select("status, amount_kobo, items")
    .eq("reference", ref)
    .maybeSingle();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  let status = order.status;
  if (status === "pending") {
    const tx = await fetchPaystackTransaction(ref);
    if (tx && (await markStorefrontOrderPaid(tx))) status = "paid";
  }
  return NextResponse.json(
    { status, amount_kobo: order.amount_kobo, items: order.items },
    { headers: { "Cache-Control": "no-store" } }
  );
}
