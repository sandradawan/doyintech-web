import { Resend } from "resend";
import {
  contactNotifyTemplate,
  contactAutoReplyTemplate,
} from "@/lib/email/templates";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`contact:${ip}`, 8, 60 * 60 * 1000);
    if (!rl.ok) {
      return Response.json(
        { error: "Too many messages. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await req.json();

    // Honeypot: if filled, silently accept (likely bot)
    if (body.company) return Response.json({ ok: true });

    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().slice(0, 200);
    const service = String(body.service || "").trim().slice(0, 80);
    const budget = String(body.budget || "").trim().slice(0, 80);
    const message = String(body.message || "").trim().slice(0, 4000);

    if (!name || !email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!email.includes("@")) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const toEmail =
      process.env.CONTACT_TO_EMAIL || "doyintechnology@outlook.com";
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

    const notify = contactNotifyTemplate({
      name,
      email,
      service: service || undefined,
      budget: budget || undefined,
      message,
    });

    await resend.emails.send({
      from: `DoyinTech Contact <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: notify.subject,
      html: notify.html,
      text: notify.text,
    });

    // Customer auto-reply (best effort)
    try {
      const auto = contactAutoReplyTemplate({ name });
      await resend.emails.send({
        from: `DoyinTech <${fromEmail}>`,
        to: email,
        subject: auto.subject,
        html: auto.html,
        text: auto.text,
      });
    } catch {
      /* non-fatal */
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
