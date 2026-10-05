import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isValidProjectRequestId } from "@/lib/students/project-id";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";

/**
 * Start final 50% balance payment.
 * Allowed when status is awaiting_balance, or stage is delivered / first_draft+ and deposit already paid.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`student-balance:${ip}`, 15, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const requestId = String(body.requestId || "").trim().toUpperCase();
    const email = String(body.email || "").trim().toLowerCase();

    if (!isValidProjectRequestId(requestId)) {
      return NextResponse.json({ error: "Invalid Request ID" }, { status: 400 });
    }

    const sb = getSupabaseAdmin();
    if (!sb) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { data: project, error } = await sb
      .from("student_projects")
      .select(
        "id, request_id, email, name, status, stage, amount_ngn, deposit_ngn, balance_ngn, amount_paid_ngn, package_name, package_id, delivery_unlocked"
      )
      .eq("request_id", requestId)
      .maybeSingle();

    if (error || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (email && project.email && email !== String(project.email).toLowerCase()) {
      return NextResponse.json({ error: "Email does not match this Request ID" }, { status: 403 });
    }

    if (project.delivery_unlocked || project.status === "fully_paid" || project.status === "completed") {
      return NextResponse.json({
        ok: true,
        alreadyPaid: true,
        message: "Balance already paid. Delivery is unlocked.",
      });
    }

    const paidStatuses = ["deposit_paid", "in_progress", "awaiting_balance", "paid"];
    if (!paidStatuses.includes(project.status) && project.status === "pending_payment") {
      return NextResponse.json(
        { error: "Pay the 50% deposit first before the balance." },
        { status: 400 }
      );
    }

    const readyStages = ["first_draft", "revisions", "delivered", "completed"];
    const canPayBalance =
      project.status === "awaiting_balance" ||
      readyStages.includes(project.stage);

    if (!canPayBalance) {
      return NextResponse.json(
        {
          error:
            "Final payment opens when your project is ready (first draft / delivered). Check the tracker.",
        },
        { status: 400 }
      );
    }

    const balNgn =
      project.balance_ngn != null
        ? Number(project.balance_ngn)
        : Math.round(Number(project.amount_ngn || 0) / 2);
    const balKobo = balNgn * 100;

    if (balKobo <= 0) {
      return NextResponse.json({ error: "No balance due" }, { status: 400 });
    }

    if (!SECRET) {
      return NextResponse.json({
        ok: true,
        payment: null,
        balanceNgn: balNgn,
        whatsapp: `https://wa.me/2348085343926?text=${encodeURIComponent(
          `Balance payment for ${requestId}\n₦${balNgn.toLocaleString()} (50% final)`
        )}`,
      });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.doyintech.com";

    const payload = {
      email: project.email,
      amount: balKobo,
      currency: "NGN",
      callback_url: `${origin}/students/projects/track?id=${encodeURIComponent(requestId)}&balance=1`,
      metadata: {
        kind: "student_project",
        payment_phase: "balance",
        request_id: requestId,
        package_id: project.package_id,
        product_id: project.package_id,
        product_name: project.package_name,
        customer_name: project.name,
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
    if (!res.ok || !data.status) {
      return NextResponse.json(
        { error: data.message || "Could not start balance payment" },
        { status: 502 }
      );
    }

    if (data.data?.reference) {
      await sb
        .from("student_projects")
        .update({
          paystack_ref_balance: data.data.reference,
          status: "awaiting_balance",
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id);
    }

    return NextResponse.json({
      ok: true,
      balanceNgn: balNgn,
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
