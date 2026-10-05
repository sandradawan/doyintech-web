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
      "id, request_id, package_name, stage, status, name, email, phone, topic, amount_ngn, deposit_ngn, balance_ngn, amount_paid_ngn, delivery_url, delivery_unlocked, school, level, deadline, notes, admin_notes, created_at"
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
    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (body.stage) {
      const ok = PROJECT_STAGES.some((s) => s.code === body.stage);
      if (!ok) {
        return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
      }
      patch.stage = body.stage;
      // When marked delivered, open balance payment
      if (body.stage === "delivered") {
        patch.status = "awaiting_balance";
      }
      if (body.stage === "completed") {
        // completed without full pay should still not unlock — only webhook unlocks
        // admin can force unlock only via delivery_unlocked + delivery_url
      }
    }
    if (body.status) {
      patch.status = String(body.status);
    }
    if (body.admin_notes != null) {
      patch.admin_notes = String(body.admin_notes).slice(0, 4000);
    }
    if (body.delivery_url != null) {
      const url = String(body.delivery_url).trim().slice(0, 2000);
      patch.delivery_url = url || null;
    }
    // Force unlock only if already fully paid (safety)
    if (body.delivery_unlocked === true) {
      const { data: row } = await sb
        .from("student_projects")
        .select("status, delivery_unlocked")
        .eq("id", id)
        .maybeSingle();
      if (
        row &&
        (row.status === "fully_paid" ||
          row.status === "completed" ||
          row.delivery_unlocked)
      ) {
        patch.delivery_unlocked = true;
      }
    }

    const { data, error } = await sb
      .from("student_projects")
      .update(patch)
      .eq("id", id)
      .select(
        "id, request_id, stage, status, delivery_url, delivery_unlocked"
      )
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (body.stage && data) {
      await sb.from("student_project_events").insert({
        project_id: data.id,
        request_id: data.request_id,
        stage: body.stage,
        note:
          body.stage === "delivered"
            ? "Marked ready — student can pay final 50% to unlock download"
            : "Stage updated by admin",
      });
    }

    return NextResponse.json({ ok: true, project: data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
