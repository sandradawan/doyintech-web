import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { emailStudentPaymentLink } from "@/lib/students/notify";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";

function adminOk(req: NextRequest) {
  const secret =
    process.env.ADMIN_LEADS_SECRET ||
    process.env.LEADS_ADMIN_SECRET ||
    process.env.ADMIN_SECRET;
  if (!secret) return false;
  return (req.headers.get("x-admin-secret") || "") === secret;
}

/**
 * POST { id } — create Paystack link for deposit or balance and email student.
 */
export async function POST(req: NextRequest) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const id = String(body.id || "").trim();
    // Optional force: "deposit" | "balance"
    const forcePhase = body.phase
      ? String(body.phase).toLowerCase()
      : null;

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const { data: project, error } = await sb
      .from("student_projects")
      .select(
        "id, request_id, name, email, package_id, package_name, topic, amount_ngn, deposit_ngn, balance_ngn, amount_paid_ngn, status, stage, delivery_unlocked"
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.email || !String(project.email).includes("@")) {
      return NextResponse.json(
        { error: "Project has no valid student email" },
        { status: 400 }
      );
    }

    if (project.delivery_unlocked || project.status === "fully_paid" || project.status === "completed") {
      return NextResponse.json(
        { error: "Already fully paid — no payment link needed" },
        { status: 400 }
      );
    }

    const total = Number(project.amount_ngn || 0);
    const depNgn =
      project.deposit_ngn != null
        ? Number(project.deposit_ngn)
        : Math.round(total / 2);
    const balNgn =
      project.balance_ngn != null
        ? Number(project.balance_ngn)
        : total - depNgn;

    // Decide phase
    let phase: "deposit" | "balance" = "deposit";
    if (forcePhase === "deposit" || forcePhase === "balance") {
      phase = forcePhase;
    } else if (project.status === "pending_payment") {
      phase = "deposit";
    } else {
      phase = "balance";
    }

    if (phase === "deposit" && project.status !== "pending_payment") {
      // Already has deposit unless still pending
      if (["deposit_paid", "in_progress", "awaiting_balance", "paid"].includes(project.status)) {
        phase = "balance";
      }
    }

    const amountNgn = phase === "deposit" ? depNgn : balNgn;
    const amountKobo = amountNgn * 100;

    if (amountKobo <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!SECRET) {
      return NextResponse.json(
        { error: "PAYSTACK_SECRET_KEY not configured" },
        { status: 503 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.doyintech.com";

    const payload = {
      email: project.email,
      amount: amountKobo,
      currency: "NGN",
      callback_url: `${origin}/students/projects/track?id=${encodeURIComponent(
        project.request_id
      )}&${phase === "deposit" ? "paid=1" : "balance=1"}`,
      metadata: {
        kind: "student_project",
        payment_phase: phase,
        request_id: project.request_id,
        package_id: project.package_id,
        product_id: project.package_id,
        product_name: project.package_name,
        customer_name: project.name,
        sent_by: "admin",
      },
    };

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.status || !data.data?.authorization_url) {
      return NextResponse.json(
        { error: data.message || "Paystack could not create payment link" },
        { status: 502 }
      );
    }

    const paystackUrl = data.data.authorization_url as string;
    const reference = data.data.reference as string;

    // Store ref
    const update: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (phase === "deposit") {
      update.paystack_ref = reference;
      update.paystack_ref_deposit = reference;
    } else {
      update.paystack_ref_balance = reference;
      if (project.status !== "awaiting_balance") {
        update.status = "awaiting_balance";
      }
    }
    await sb.from("student_projects").update(update).eq("id", project.id);

    const notify = {
      request_id: project.request_id,
      name: project.name,
      email: project.email,
      package_name: project.package_name,
      topic: project.topic || undefined,
      amount_ngn: project.amount_ngn,
      deposit_ngn: project.deposit_ngn,
      balance_ngn: project.balance_ngn,
    };

    const emailed = await emailStudentPaymentLink(notify, {
      phase,
      amountNgn,
      paystackUrl,
    });

    await sb.from("student_project_events").insert({
      project_id: project.id,
      request_id: project.request_id,
      stage: project.stage,
      note: emailed
        ? `Payment link (${phase}, ₦${amountNgn.toLocaleString()}) emailed to ${project.email}`
        : `Payment link (${phase}) created but email failed — send manually: ${paystackUrl}`,
    });

    return NextResponse.json({
      ok: true,
      phase,
      amountNgn,
      authorizationUrl: paystackUrl,
      reference,
      emailed,
      email: project.email,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
