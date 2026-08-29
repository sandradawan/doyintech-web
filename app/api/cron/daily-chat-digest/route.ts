import { Resend } from "resend";
import { WHATSAPP_NUMBER } from "@/lib/chatbot-knowledge";

/**
 * Daily reminder digest.
 * Vercel Cron: 0 18 * * * (6pm UTC ≈ evening WAT next hour)
 *
 * Instant chat leads already email you + optional CallMeBot WhatsApp.
 * This job sends a daily nudge so you review leads.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (secret && auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const text =
    `DoyinTech daily chat check-in\n\n` +
    `Review any new website chat leads in your email inbox today.\n` +
    `Chat leads also appear when visitors request a human or submit contact details.\n` +
    `WhatsApp: +${WHATSAPP_NUMBER}\n` +
    `Site: https://doyintech.vercel.app`;

  // Email digest
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const toEmail =
        process.env.CONTACT_TO_EMAIL || "doyintechnology@outlook.com";
      const fromEmail =
        process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

      await resend.emails.send({
        from: `DoyinTech Digest <${fromEmail}>`,
        to: toEmail,
        subject: "Daily chat leads reminder — DoyinTech",
        text,
      });
    }
  } catch (e) {
    console.warn("Daily email failed", e);
  }

  // WhatsApp via CallMeBot if configured
  try {
    const apiKey = process.env.CALLMEBOT_API_KEY;
    if (apiKey) {
      const phone = process.env.CALLMEBOT_PHONE || WHATSAPP_NUMBER;
      const url =
        `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
        `&text=${encodeURIComponent(text)}` +
        `&apikey=${encodeURIComponent(apiKey)}`;
      await fetch(url);
    }
  } catch (e) {
    console.warn("Daily WhatsApp failed", e);
  }

  return Response.json({ ok: true });
}
