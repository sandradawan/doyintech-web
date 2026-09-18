import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Honeypot
    if (body.website) return Response.json({ ok: true });

    const to = String(body.to || "").trim().toLowerCase();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    const fromName = String(body.fromName || "Silas · DoyinTech").trim();

    if (!to || !to.includes("@") || !subject || !message) {
      return Response.json({ error: "to, subject, and message are required" }, { status: 400 });
    }
    if (message.length > 8000) {
      return Response.json({ error: "Message too long" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error: "Email API not configured. Set RESEND_API_KEY on Vercel, or use WhatsApp / Open in mail app.",
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
      return Response.json({ error: error.message || "Send failed" }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
