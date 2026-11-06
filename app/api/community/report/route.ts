import { NextRequest, NextResponse } from "next/server";
import { tellAdmin } from "@/lib/community/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** Anyone can report without signing in, so a report only alerts an admin: it never hides content by itself. */
export async function POST(req: NextRequest) {
  if (!rateLimit(`community-report:${clientIp(req)}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many reports. Try again later." }, { status: 429 });
  }
  const input = await req.json().catch(() => ({}));
  const kind = input.kind === "reply" ? "reply" : "post";
  const itemId = Number(input.id);
  const reason = String(input.reason ?? "").replace(/\s+/g, " ").trim().slice(0, 300);
  if (!Number.isSafeInteger(itemId) || itemId < 1 || reason.length < 3) {
    return NextResponse.json({ error: "Please say what's wrong." }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  const table = kind === "post" ? "community_posts" : "community_replies";
  const { data: item } = sb ? await sb.from(table).select("id").eq("id", itemId).eq("status", "approved").maybeSingle() : { data: null };
  if (!sb || !item) return NextResponse.json({ error: "This is no longer available." }, { status: 404 });

  const { error } = await sb.from("community_reports").insert({ kind, item_id: itemId, reason });
  if (error) return NextResponse.json({ error: "We couldn't send your report. Please try again." }, { status: 503 });

  await tellAdmin(`${kind} ${itemId} reported`, reason);
  return NextResponse.json({ ok: true });
}
