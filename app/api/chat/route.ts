import { Resend } from "resend";
import {
  defaultReply,
  matchIntent,
  WHATSAPP_NUMBER,
} from "@/lib/chatbot-knowledge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history : [];
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const mode = String(body.mode || "reply"); // reply | handoff

    if (mode === "handoff") {
      return handleHandoff({ name, email, message, history });
    }

    if (!message) {
      return Response.json({ error: "Empty message" }, { status: 400 });
    }

    const lower = message.toLowerCase();
    if (
      lower.includes("human") ||
      lower.includes("agent") ||
      lower.includes("talk to") ||
      lower.includes("real person")
    ) {
      return Response.json({
        reply:
          "Absolutely. Click Continue on WhatsApp below, or share your name and email and we will reach out.",
        suggestWhatsApp: true,
        intent: "human",
      });
    }

    const intent = matchIntent(message);
    const reply = intent?.answer || defaultReply();

    return Response.json({
      reply,
      suggestWhatsApp: intent?.id === "contact" || intent?.id === "start",
      intent: intent?.id || "fallback",
    });
  } catch {
    return Response.json({ error: "Chat failed" }, { status: 500 });
  }
}

async function handleHandoff(opts: {
  name: string;
  email: string;
  message: string;
  history: { role?: string; content?: string }[];
}) {
  const { name, email, message, history } = opts;

  if (!name || !email) {
    return Response.json(
      { error: "Name and email are required for handoff." },
      { status: 400 },
    );
  }

  const transcript = history
    .slice(-12)
    .map((m) => `${m.role === "user" ? "Visitor" : "Bot"}: ${m.content || ""}`)
    .join("\n");

  const summary =
    `New website chat lead\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Latest: ${message || "(handoff)"}\n\n` +
    `Transcript:\n${transcript || "(none)"}`;

  // Email notify (uses existing Resend setup)
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const toEmail =
        process.env.CONTACT_TO_EMAIL || "doyintechnology@outlook.com";
      const fromEmail =
        process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

      await resend.emails.send({
        from: `DoyinTech Chat <${fromEmail}>`,
        to: toEmail,
        replyTo: email,
        subject: `Chat lead — ${name}`,
        text: summary,
      });
    }
  } catch (e) {
    console.warn("Chat email failed", e);
  }

  // Optional: CallMeBot free WhatsApp push
  // Setup: https://www.callmebot.com/blog/free-api-whatsapp-messages/
  // Env: CALLMEBOT_API_KEY=your_key
  try {
    const apiKey = process.env.CALLMEBOT_API_KEY;
    if (apiKey) {
      const phone = process.env.CALLMEBOT_PHONE || WHATSAPP_NUMBER;
      const url =
        `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
        `&text=${encodeURIComponent(summary.slice(0, 1500))}` +
        `&apikey=${encodeURIComponent(apiKey)}`;
      await fetch(url);
    }
  } catch (e) {
    console.warn("WhatsApp push failed", e);
  }

  return Response.json({
    ok: true,
    reply:
      "Thanks — your details were sent to the DoyinTech team. You can also continue instantly on WhatsApp for a faster response.",
    suggestWhatsApp: true,
  });
}
