import { Resend } from "resend";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`tools-lead:${ip}`, 15, 60 * 60 * 1000);
    if (!rl.ok) {
      return Response.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await req.json();

    if (body.company_website) {
      return Response.json({ ok: true });
    }

    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().slice(0, 200);
    const phone = String(body.phone || "").trim().slice(0, 40);
    const businessName = String(body.businessName || "").trim().slice(0, 120);
    const tool = String(body.tool || "tools").trim().slice(0, 80);
    const resultSummary = String(body.resultSummary || "").trim().slice(0, 1000);
    const message = String(body.message || "").trim().slice(0, 2000);

    if (!name || !email) {
      return Response.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY missing — tools lead not emailed");
      return Response.json({ ok: true, demo: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail =
      process.env.CONTACT_TO_EMAIL || "doyintechnology@outlook.com";
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

    await resend.emails.send({
      from: `DoyinTech Tools <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: `Tools lead — ${tool} — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone/WhatsApp: ${phone || "-"}`,
        `Business: ${businessName || "-"}`,
        `Tool: ${tool}`,
        `Result: ${resultSummary || "-"}`,
        `Message: ${message || "-"}`,
      ].join("\n"),
    });

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed to submit lead" }, { status: 500 });
  }
}
