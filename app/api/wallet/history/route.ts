import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/bills/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data: orders } = await admin
    .from("bill_orders")
    .select(
      "id, kind, network, phone, amount_kobo, status, request_id, created_at, error_message"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  const { data: ledger } = await admin
    .from("wallet_ledger")
    .select(
      "id, entry_type, amount_kobo, balance_after_kobo, reason, reference, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  return NextResponse.json({ orders: orders || [], ledger: ledger || [] });
}
