import { Resend } from "resend";
import { clientIp, rateLimit } from "@/lib/rate-limit";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "\u0026amp;")
    .replaceAll("<", "\u0026lt;")
    .replaceAll(">", "\u0026gt;")
    .replaceAll('"', "\u0026quot;")
    .replaceAll("'", "\u0026#039;");
}

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

    await resend.emails.send({
      from: `DoyinTech Contact <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: `New Contact — ${name} (${service || "General"})`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6;">
          <h2>New Contact Message (DoyinTech)</h2>
          <p><b>Name:</b> ${escapeHtml(name)}</p>
          <p><b>Email:</b> ${escapeHtml(email)}</p>
          <p><b>Service:</b> ${escapeHtml(service || "-")}</p>
          <p><b>Budget:</b> ${escapeHtml(budget || "-")}</p>
          <hr/>
          <p style="white-space: pre-wrap;"><b>Message:</b><br/>${escapeHtml(message)}</p>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
