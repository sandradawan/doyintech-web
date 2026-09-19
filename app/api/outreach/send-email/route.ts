import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function adminOk(req: NextRequest) {
  const secret = process.env.ADMIN_LEADS_SECRET || process.env.LEADS_ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-admin-secret") || "";
  return header === secret;
}

export async function POST(req: NextRequest) {
  try {
    // Fail closed: do not allow unauthenticated bulk email send
    if (!adminOk(req)) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. Outreach email requires x-admin-secret header (same as lead inbox).",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    // Honeypot
    if (body.website) return NextResponse.json({ ok: true });

    const to = String(body.to || "").trim().toLowerCase();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    const fromName = String(body.fromName || "Silas · DoyinTech").trim().slice(0, 80);

    if (!to || !to.includes("@") || !subject || !message) {
      return NextResponse.json(
        { error: "to, subject, and message are required" },
        { status: 400 }
      );
    }
    if (message.length > 8000 || subject.length > 200) {
      return NextResponse.json({ error: "Message or subject too long" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Email API not configured. Set RESEND_API_KEY on Vercel, or use WhatsApp / Open in mail app.",
          code: "NO_RESEND",
        },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
    const replyTo = process.env.CONTACT_TO_EMAIL || "doyintechnology@outlook.com";

    const { error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      replyTo,
      subject,
      text: message,
      html: `<div style="font-family:system-ui,sans-serif;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</div>`,
    });

    if (error) {
      return NextResponse.json({ error: error.message || "Send failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&")
    .replaceAll("<", "<")
    .replaceAll(">", ">")
    .replaceAll('"', """)
    .replaceAll("'", "&#039;");
}
