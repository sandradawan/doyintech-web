import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isValidProjectRequestId } from "@/lib/students/project-id";
import { stageLabel } from "@/lib/students/packages";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = clientIp(req);
  const rl = rateLimit(`student-track:${ip}`, 40, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const id = String(req.nextUrl.searchParams.get("id") || "").trim().toUpperCase();
  const email = String(req.nextUrl.searchParams.get("email") || "")
    .trim()
    .toLowerCase();

  if (!isValidProjectRequestId(id)) {
    return NextResponse.json(
      { error: "Invalid Request ID. Format: DT-PRJ-YYYY-NNNN" },
      { status: 400 }
    );
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({
      ok: true,
      demo: true,
      project: {
        request_id: id,
        stage: "received",
        stage_label: stageLabel("received"),
        status: "pending_payment",
        package_name: "—",
        topic: "Connect Supabase and run docs/student-projects.sql",
        name: "",
        email: email || "",
        amount_ngn: 0,
        deposit_ngn: 0,
        balance_ngn: 0,
        amount_paid_ngn: 0,
        delivery_unlocked: false,
        delivery_url: null,
        can_pay_balance: false,
      },
      messages: [],
      events: [],
    });
  }

  const { data: project, error } = await sb
    .from("student_projects")
    .select(
      "request_id, package_id, package_name, amount_ngn, deposit_ngn, balance_ngn, amount_paid_ngn, stage, status, name, email, phone, school, level, topic, deadline, delivery_url, delivery_unlocked, created_at, updated_at"
    )
    .eq("request_id", id)
    .maybeSingle();

  if (error || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (email && project.email && email !== String(project.email).toLowerCase()) {
    return NextResponse.json(
      { error: "Email does not match this Request ID" },
      { status: 403 }
    );
  }

  const readyStages = ["first_draft", "revisions", "delivered", "completed"];
  const canPayBalance =
    !project.delivery_unlocked &&
    project.status !== "pending_payment" &&
    project.status !== "fully_paid" &&
    project.status !== "completed" &&
    (project.status === "awaiting_balance" || readyStages.includes(project.stage));

  // Only expose delivery_url when unlocked
  const deliveryUrl =
    project.delivery_unlocked && project.delivery_url
      ? project.delivery_url
      : null;

  const { data: messages } = await sb
    .from("student_project_messages")
    .select("id, author, body, created_at")
    .eq("request_id", id)
    .order("created_at", { ascending: true })
    .limit(100);

  const { data: events } = await sb
    .from("student_project_events")
    .select("stage, note, created_at")
    .eq("request_id", id)
    .order("created_at", { ascending: true })
    .limit(50);

  return NextResponse.json({
    ok: true,
    project: {
      ...project,
      stage_label: stageLabel(project.stage),
      delivery_url: deliveryUrl,
      can_pay_balance: canPayBalance,
    },
    messages: messages || [],
    events: events || [],
  });
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = rateLimit(`student-feedback:${ip}`, 20, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const requestId = String(body.requestId || "").trim().toUpperCase();
    const email = String(body.email || "").trim().toLowerCase();
    const message = String(body.message || "").trim().slice(0, 3000);

    if (!isValidProjectRequestId(requestId) || message.length < 5) {
      return NextResponse.json(
        { error: "Valid Request ID and feedback (5+ chars) required." },
        { status: 400 }
      );
    }

    const sb = getSupabaseAdmin();
    if (!sb) {
      return NextResponse.json({
        ok: true,
        demo: true,
        message: "Feedback recorded locally (Supabase not configured).",
      });
    }

    const { data: project } = await sb
      .from("student_projects")
      .select("id, email, request_id")
      .eq("request_id", requestId)
      .maybeSingle();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (email && project.email && email !== String(project.email).toLowerCase()) {
      return NextResponse.json({ error: "Email does not match" }, { status: 403 });
    }

    await sb.from("student_project_messages").insert({
      project_id: project.id,
      request_id: requestId,
      author: "student",
      body: message,
    });

    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const to = process.env.CONTACT_TO_EMAIL || "hello@doyintech.com";
        const from =
          process.env.CONTACT_FROM_EMAIL || "DoyinTech <onboarding@resend.dev>";
        await resend.emails.send({
          from,
          to: [to],
          subject: `[Student feedback] ${requestId}`,
          text: `Request ${requestId}\n\n${message}`,
        });
      }
    } catch {
      /* non-fatal */
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
