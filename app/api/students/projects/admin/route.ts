import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { PROJECT_STAGES } from "@/lib/students/packages";
import {
  emailStudentBalanceDue,
  emailOpsBalanceDue,
} from "@/lib/students/notify";

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

    // Load current row for email + transition detection
    const { data: before } = await sb
      .from("student_projects")
      .select(
        "id, request_id, name, email, package_name, topic, amount_ngn, deposit_ngn, balance_ngn, stage, status, delivery_url, delivery_unlocked"
      )
      .eq("id", id)
      .maybeSingle();

    if (!before) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    let markingBalanceDue = false;

    if (body.stage) {
      const ok = PROJECT_STAGES.some((s) => s.code === body.stage);
      if (!ok) {
        return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
      }
      patch.stage = body.stage;
      if (body.stage === "delivered") {
        patch.status = "awaiting_balance";
        if (before.stage !== "delivered" && before.status !== "awaiting_balance") {
          markingBalanceDue = true;
        }
      }
    }
    if (body.status) {
      patch.status = String(body.status);
      if (
        body.status === "awaiting_balance" &&
        before.status !== "awaiting_balance"
      ) {
        markingBalanceDue = true;
      }
    }
    if (body.admin_notes != null) {
      patch.admin_notes = String(body.admin_notes).slice(0, 4000);
    }
    if (body.delivery_url != null) {
      const url = String(body.delivery_url).trim().slice(0, 2000);
      patch.delivery_url = url || null;
    }
    if (body.delivery_unlocked === true) {
      if (
        before.status === "fully_paid" ||
        before.status === "completed" ||
        before.delivery_unlocked
      ) {
        patch.delivery_unlocked = true;
      }
    }

    const { data, error } = await sb
      .from("student_projects")
      .update(patch)
      .eq("id", id)
      .select(
        "id, request_id, stage, status, delivery_url, delivery_unlocked, name, email, package_name, topic, amount_ngn, deposit_ngn, balance_ngn"
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
            ? "Marked ready — student emailed to pay final 50%"
            : "Stage updated by admin",
      });
    }

    // Auto email when project becomes ready for balance payment
    let emailed = false;
    if (markingBalanceDue && data?.email) {
      const payload = {
        request_id: data.request_id,
        name: data.name || before.name,
        email: data.email || before.email,
        package_name: data.package_name || before.package_name,
        topic: data.topic || before.topic || undefined,
        amount_ngn: data.amount_ngn ?? before.amount_ngn,
        deposit_ngn: data.deposit_ngn ?? before.deposit_ngn,
        balance_ngn: data.balance_ngn ?? before.balance_ngn,
      };
      emailed = await emailStudentBalanceDue(payload);
      await emailOpsBalanceDue(payload);
      if (emailed) {
        await sb.from("student_project_events").insert({
          project_id: data.id,
          request_id: data.request_id,
          stage: data.stage || "delivered",
          note: `Balance-due email sent to ${payload.email}`,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      project: data,
      balanceEmailSent: emailed,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
