import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({
      ok: true,
      database: "memory",
      message: "Supabase not configured — using in-memory fallback.",
    });
  }
  try {
    const { error } = await sb.from("store_listings").select("id").limit(1);
    if (error) {
      return NextResponse.json({
        ok: false,
        database: "supabase",
        error: error.message,
      });
    }
    return NextResponse.json({ ok: true, database: "supabase" });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      database: "supabase",
      error: e instanceof Error ? e.message : "Unknown",
    });
  }
}
