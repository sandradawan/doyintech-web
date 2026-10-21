import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** Public health probe. Errors are logged server-side, never echoed to callers. */
export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({ ok: true, database: "memory" });
  }
  try {
    const { error } = await sb.from("store_listings").select("id").limit(1);
    if (error) {
      console.error("store health", error.message);
      return NextResponse.json({ ok: false, database: "supabase" }, { status: 503 });
    }
    return NextResponse.json({ ok: true, database: "supabase" });
  } catch (e) {
    console.error("store health", e);
    return NextResponse.json({ ok: false, database: "supabase" }, { status: 503 });
  }
}
