import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { generateReportContent } from "@/lib/reports/generate";
import { Resend } from "resend";

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

    if (!["paid", "queued", "processing", "failed"].includes(order.status)) {
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

    const source =
      order.source_data && typeof order.source_data === "object"
        ? (order.source_data as { platforms?: { platform?: string; url?: string }[] })
        : {};
    const platforms = Array.isArray(source.platforms) ? source.platforms : [];

    let reportType = "multi_platform";
    if (order.product_id === "platform-basic") reportType = "single_platform";
    else if (order.product_id === "platform-pro") reportType = "multi_platform";
    else if (order.product_id === "platform-full") reportType = "full_presence";
    else if (order.product_id === "biz-profile") reportType = "business_profile";
    else if (String(order.product_id).startsWith("cv")) reportType = "cv_report";
    else if (String(order.product_id).startsWith("ig-")) reportType = "single_platform";

    const content = await generateReportContent({
      productId: order.product_id,
      productName: order.product_name,
      reportType,
      name: order.name,
      email: order.email,
      profileUrl: order.profile_url,
      platforms: platforms.map((x) => ({
        platform: String(x.platform || "other"),
        url: String(x.url || ""),
      })),
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
    console.log(JSON.stringify({ event: "report_email_skipped", orderId: opts.orderId }));
    return;
  }
  const from =
    process.env.DELIVERY_FROM_EMAIL ||
    process.env.RESEND_FROM ||
    "DoyinTech <onboarding@resend.dev>";
  const resend = new Resend(key);
  try {
    await resend.emails.send({
      from,
      to: opts.to,
      subject: `Your ${opts.productName} is ready | ${opts.orderId}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;color:#1a1a1a">
          <div style="background:#0a0a0b;padding:28px 28px 24px;border-radius:12px 12px 0 0">
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#ff8c14">DoyinTech Report Studio</p>
            <h1 style="margin:12px 0 0;font-size:22px;font-weight:600;color:#ffffff;line-height:1.3">Your report is ready</h1>
          </div>
          <div style="padding:28px;border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px">
            <p style="margin:0 0 12px;font-size:15px;line-height:1.6">Dear ${escapeHtml(opts.name)},</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#333">
              Your <strong>${escapeHtml(opts.productName)}</strong> has been prepared and is ready to view.
              Order reference: <code style="background:#f5f5f5;padding:2px 6px;border-radius:4px;font-size:13px">${escapeHtml(opts.orderId)}</code>
            </p>
            <p style="margin:0 0 24px">
              <a href="${opts.viewUrl}" style="display:inline-block;background:#ff8c14;color:#000;padding:14px 24px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px">Open your report</a>
            </p>
            <p style="margin:0 0 8px;font-size:13px;color:#555;line-height:1.5">
              To save a PDF: open the report → use your browser’s <strong>Print</strong> → choose <strong>Save as PDF</strong>.
            </p>
            <p style="margin:0;font-size:13px;color:#555;line-height:1.5">
              Keep this link private. It is intended only for you.
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:28px 0" />
            <p style="margin:0;font-size:12px;color:#888;line-height:1.5">
              Questions? Reply to this email or WhatsApp +234 808 534 3926.<br/>
              — The DoyinTech team · Jos, Nigeria
            </p>
          </div>
        </div>
      `,
      text: `Dear ${opts.name},\n\nYour ${opts.productName} is ready.\n\nOrder: ${opts.orderId}\nView: ${opts.viewUrl}\n\nTo download a PDF, open the link and use Print → Save as PDF.\n\n— DoyinTech Report Studio\n`,
    });
  } catch (e) {
    console.error("report email", e);
  }
}
