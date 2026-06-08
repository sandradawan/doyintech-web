import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot: if filled, silently accept (likely bot)
    if (body.company) return Response.json({ ok: true });

    const { name, email, service, budget, message } = body;

    if (!name || !email || !message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
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

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
