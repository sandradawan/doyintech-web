import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function clientFromAuthHeader(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;

  return createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET(req: NextRequest) {
  try {
    const sb = clientFromAuthHeader(req);
    if (!sb) {
      return NextResponse.json(
        { error: "Sign in required. Configure Supabase env vars." },
        { status: 401 }
      );
    }
    const {
      data: { user },
      error: userErr,
    } = await sb.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { data, error } = await sb
      .from("ops_workspaces")
      .select("payload, updated_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      payload: data?.payload ?? null,
      updated_at: data?.updated_at ?? null,
      user_id: user.id,
      email: user.email,
    });
  } catch {
    return NextResponse.json({ error: "Load failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sb = clientFromAuthHeader(req);
    if (!sb) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }
    const {
      data: { user },
      error: userErr,
    } = await sb.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await req.json();
    const payload = body.payload;
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "payload object required" }, { status: 400 });
    }

    const { error } = await sb.from("ops_workspaces").upsert(
      {
        user_id: user.id,
        payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, updated_at: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
