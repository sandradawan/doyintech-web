import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { generateReportContent } from "@/lib/reports/generate";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = String(body.orderId || "").trim();
    const secret =
      req.headers.get("x-admin-secret") ||
      req.headers.get("x-internal-secret") ||
      "";
    const expected =
      process.env.ADMIN_LEADS_SECRET ||
      process.env.LEADS_ADMIN_SECRET ||
      process.env.ADMIN_SECRET ||
      process.env.CRON_SECRET ||
      "";

    const internalOk =
      (expected && secret === expected) ||
      body.source === "paystack_webhook" ||
      body.source === "verify";

    if (!internalOk) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const sb = getSupabaseAdmin();
    if (!sb) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
    }

    const { data: order, error } = await sb
      .from("report_orders")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "completed" || order.status === "delivered") {
      return NextResponse.json({
        ok: true,
        already: true,
        viewUrl: `/reports/view/${order.delivery_token}`,
      });
    }

    if (
      !["paid", "queued", "processing", "failed"].includes(order.status)
    ) {
      return NextResponse.json(
        { error: `Cannot process status: ${order.status}` },
        { status: 400 }
      );
    }

    await sb
      .from("report_orders")
      .update({ status: "processing", updated_at: new Date().toISOString() })
      .eq("id", order.id);

    await sb.from("report_events").insert({
      order_uuid: order.id,
      order_id: orderId,
      status: "processing",
      note: "Report generation started",
    });

    const content = await generateReportContent({
      productId: order.product_id,
      productName: order.product_name,
      reportType: order.product_id.startsWith("ig-")
        ? "instagram_audit"
        : order.product_id.startsWith("cv")
          ? "cv_report"
          : "business_profile",
      name: order.name,
      email: order.email,
      profileUrl: order.profile_url,
      businessCategory: order.business_category,
      businessObjective: order.business_objective,
      targetAudience: order.target_audience,
      notes: order.notes,
    });

    const { error: upErr } = await sb
      .from("report_orders")
      .update({
        status: "completed",
        report_content: content,
        delivered_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (upErr) {
      await sb
        .from("report_orders")
        .update({
          status: "failed",
          error_message: upErr.message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    await sb.from("report_events").insert({
      order_uuid: order.id,
      order_id: orderId,
      status: "completed",
      note: "Report ready",
    });

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || "https://doyintech.vercel.app";
    const viewUrl = `${origin}/reports/view/${order.delivery_token}`;
    await sendReportReadyEmail({
      to: order.email,
      name: order.name,
      productName: order.product_name,
      orderId,
      viewUrl,
    });

    await sb
      .from("report_orders")
      .update({ status: "delivered", updated_at: new Date().toISOString() })
      .eq("id", order.id);

    return NextResponse.json({
      ok: true,
      orderId,
      viewUrl: `/reports/view/${order.delivery_token}`,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "process failed";
    console.error("reports/process", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function sendReportReadyEmail(opts: {
  to: string;
  name: string;
  productName: string;
  orderId: string;
  viewUrl: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(
      JSON.stringify({
        event: "report_email_skipped",
        orderId: opts.orderId,
      })
    );
    return;
  }
  const from =
    process.env.DELIVERY_FROM_EMAIL ||
    process.env.RESEND_FROM ||
    "DoyinTech <onboarding@resend.dev>";
  const safeName = opts.name.replace(/</g, "");
  const resend = new Resend(key);
  try {
    await resend.emails.send({
      from,
      to: opts.to,
      subject: `Your ${opts.productName} is ready — ${opts.orderId}`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto"><h1>Your report is ready</h1><p>Hi ${safeName},</p><p>Your <strong>${opts.productName}</strong> (${opts.orderId}) is ready.</p><p><a href="${opts.viewUrl}" style="background:#ff8c14;color:#000;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">Open report</a></p><p>Use Print → Save as PDF to download.</p><p>— DoyinTech Report Studio</p></div>`,
      text: `Hi ${opts.name},\n\nYour ${opts.productName} (${opts.orderId}) is ready:\n${opts.viewUrl}\n\n— DoyinTech Report Studio`,
    });
  } catch (e) {
    console.error("report email", e);
  }
}
