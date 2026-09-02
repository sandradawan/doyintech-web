import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot
    if (body.company_website) {
      return Response.json({ ok: true });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const businessName = String(body.businessName || "").trim();
    const tool = String(body.tool || "tools").trim();
    const resultSummary = String(body.resultSummary || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email) {
      return Response.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      // Soft success so UX works in demo without mail configured
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
