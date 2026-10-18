import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
  }

  const section = req.nextUrl.searchParams.get("section") || "store";
  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({ ok: true, configured: false, rows: [], note: "Supabase not configured" });
  }

  if (section === "store") {
    const [listings, developers, orders] = await Promise.all([
      sb.from("store_listings").select("*").order("created_at", { ascending: false }).limit(80),
      sb.from("store_developers").select("id, display_name, email, created_at").order("created_at", { ascending: false }).limit(50),
      sb.from("store_orders").select("*").order("created_at", { ascending: false }).limit(80),
    ]);
    return NextResponse.json({
      ok: true,
      listings: listings.data || [],
      developers: developers.data || [],
      orders: orders.data || [],
      errors: {
        listings: listings.error?.message || null,
        developers: developers.error?.message || null,
        orders: orders.error?.message || null,
      },
    });
  }

  if (section === "orders") {
    const { data, error } = await sb
      .from("store_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(150);
    return NextResponse.json({ ok: true, orders: data || [], error: error?.message || null });
  }

  if (section === "ops") {
    const { data, error } = await sb
      .from("ops_workspaces")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(80);
    return NextResponse.json({ ok: true, workspaces: data || [], error: error?.message || null });
  }

  return NextResponse.json({ error: "Unknown section" }, { status: 400 });
}
