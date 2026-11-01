import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { limitRequest } from "@/lib/rate-limit";

const NO_STORE = { "Cache-Control": "private, no-store" };
const TOOL_RE = /^[a-z0-9-]{2,60}$/;
const MAX_BYTES = 250_000;
const MAX_TOOLS = 100;

/**
 * Signed-in user's saved tool data.
 * GET ?tool=<slug> → { payload, updated_at } for one tool; GET with no tool → list of saved tools.
 */
export async function GET(req: NextRequest) {
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401, headers: NO_STORE });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503, headers: NO_STORE });

  const tool = req.nextUrl.searchParams.get("tool");
  if (tool) {
    if (!TOOL_RE.test(tool)) return NextResponse.json({ error: "Bad tool" }, { status: 400, headers: NO_STORE });
    const { data } = await sb.from("tool_saves").select("payload, updated_at").eq("user_id", user.id).eq("tool", tool).maybeSingle();
    return NextResponse.json({ payload: data?.payload ?? null, updated_at: data?.updated_at ?? null }, { headers: NO_STORE });
  }
  const { data } = await sb.from("tool_saves").select("tool, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(MAX_TOOLS);
  return NextResponse.json({ tools: data || [] }, { headers: NO_STORE });
}

/** Save one tool's data. Body: { tool, payload }. */
export async function PUT(req: NextRequest) {
  const limited = limitRequest(req, "tool-saves", 60, 60_000);
  if (limited) return limited;
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const body = await req.json().catch(() => null);
  const tool = String(body?.tool || "");
  const payload = body?.payload;
  if (!TOOL_RE.test(tool)) return NextResponse.json({ error: "Bad tool" }, { status: 400 });
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return NextResponse.json({ error: "payload object required" }, { status: 400 });
  if (JSON.stringify(payload).length > MAX_BYTES) return NextResponse.json({ error: "Too large to save" }, { status: 413 });

  const { count } = await sb.from("tool_saves").select("tool", { count: "exact", head: true }).eq("user_id", user.id);
  if ((count ?? 0) >= MAX_TOOLS) {
    const { data: existing } = await sb.from("tool_saves").select("tool").eq("user_id", user.id).eq("tool", tool).maybeSingle();
    if (!existing) return NextResponse.json({ error: "Saved tool limit reached" }, { status: 400 });
  }

  const updated_at = new Date().toISOString();
  const { error } = await sb.from("tool_saves").upsert({ user_id: user.id, tool, payload, updated_at }, { onConflict: "user_id,tool" });
  if (error) return NextResponse.json({ error: "Save failed" }, { status: 500 });
  return NextResponse.json({ ok: true, updated_at });
}
