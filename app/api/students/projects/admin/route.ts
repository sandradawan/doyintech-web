import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PROJECT_STAGES } from "@/lib/students/packages";

function adminOk(req: NextRequest) {
  const secret =
    process.env.ADMIN_LEADS_SECRET ||
    process.env.LEADS_ADMIN_SECRET ||
    process.env.ADMIN_SECRET;
  if (!secret) return false;
  return (req.headers.get("x-admin-secret") || "") === secret;
}

export async function GET(req: NextRequest) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({
      projects: [],
      note: "Supabase not configured. Run docs/student-projects.sql",
    });
  }
  const { data, error } = await sb
    .from("student_projects")
    .select(
      "id, request_id, package_name, stage, status, name, email, topic, amount_ngn, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ projects: data || [] });
}

export async function PATCH(req: NextRequest) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "").trim();
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const patch: Record<string, string> = { updated_at: new Date().toISOString() };
    if (body.stage) {
      const ok = PROJECT_STAGES.some((s) => s.code === body.stage);
      if (!ok) {
        return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
      }
      patch.stage = body.stage;
    }
    if (body.status) {
      patch.status = String(body.status);
    }
    if (body.admin_notes != null) {
      patch.admin_notes = String(body.admin_notes).slice(0, 4000);
    }

    const { data, error } = await sb
      .from("student_projects")
      .update(patch)
      .eq("id", id)
      .select("id, request_id, stage, status")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (body.stage && data) {
      await sb.from("student_project_events").insert({
        project_id: data.id,
        request_id: data.request_id,
        stage: body.stage,
        note: "Stage updated by admin",
      });
    }

    return NextResponse.json({ ok: true, project: data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
