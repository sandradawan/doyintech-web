import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/** Reports which store DB env vars are present (no secrets) + a lightweight query. */
export async function GET() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const hasServiceRole = Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  );
  const hasAnon = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  const sb = getSupabaseAdmin();
  let dbOk = false;
  let listingCount: number | null = null;
  let error: string | null = null;

  if (sb) {
    const { count, error: qErr } = await sb
      .from("store_listings")
      .select("id", { count: "exact", head: true });
    if (qErr) {
      error = qErr.message;
    } else {
      dbOk = true;
      listingCount = count ?? 0;
    }
  } else {
    error = "getSupabaseAdmin() returned null — missing URL or service role key";
  }

  return NextResponse.json({
    ok: dbOk,
    env: {
      hasUrl: Boolean(url),
      urlHost: url
        ? (() => {
            try {
              return new URL(url).host;
            } catch {
              return "invalid";
            }
          })()
        : null,
      hasServiceRole,
      hasAnon,
    },
    listingCount,
    error,
  });
}
