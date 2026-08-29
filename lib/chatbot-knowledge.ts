export type ChatIntent = {
  id: string;
  keywords: string[];
  answer: string;
};

export const WHATSAPP_NUMBER = "2348085343926";
export const WHATSAPP_LINK =
  "https://wa.me/2348085343926?text=" +
  encodeURIComponent("Hi DoyinTech, I was chatting on the website and need help.");

export const INTENTS: ChatIntent[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],
    answer:
      "Hello! I am the DoyinTech assistant. I can help with services, pricing, timelines, portfolio, and how to start a project. What do you need?",
  },
  {
    id: "services",
    keywords: ["service", "services", "what do you do", "offer", "build"],
    answer:
      "DoyinTech builds production software:\n• Backend engineering (Laravel, PHP, Node, MySQL)\n• APIs & system design\n• Flutter mobile apps\n• Web platforms (Next.js)\n• AI automation for business workflows\n\nWhich of these are you interested in?",
  },
  {
    id: "pricing",
    keywords: ["price", "pricing", "cost", "how much", "budget", "rate", "₦", "naira"],
    answer:
      "Pricing depends on scope. Typical ranges:\n• API / module work — from ₦300k\n• Backend MVP — often ₦800k–₦2.5m+\n• Flutter MVP — often ₦1.2m–₦4m+\n• AI automation pilot — from ₦250k\n\nShare your idea and we will give a clearer quote. Want me to connect you on WhatsApp?",
  },
  {
    id: "timeline",
    keywords: ["timeline", "how long", "duration", "when", "deadline", "weeks"],
    answer:
      "Typical timelines:\n• Discovery — 3–5 days\n• Focused backend/API work — 2–6 weeks\n• Mobile MVP — 4–10 weeks\n\nWe confirm a schedule after a short discovery call.",
  },
  {
    id: "location",
    keywords: ["where", "location", "jos", "nigeria", "based", "office"],
    answer:
      "We are based in Jos, Nigeria, and work with clients locally and internationally. Remote delivery is standard.",
  },
  {
    id: "contact",
    keywords: ["contact", "email", "phone", "call", "reach", "whatsapp"],
    answer:
      "You can reach DoyinTech at:\n• WhatsApp / Phone: +234 808 534 3926\n• Email: doyintechnology@outlook.com\n\nI can also open a WhatsApp chat with a summary of this conversation.",
  },
  {
    id: "portfolio",
    keywords: ["portfolio", "work", "projects", "case study", "clients", "examples"],
    answer:
      "Selected work includes Imperial Villa (property portals), DoyinMart, LegacyPlay, JennyGlams, and Arqademy CBT. Browse the Portfolio page or ask about a specific industry.",
  },
  {
    id: "tech",
    keywords: ["tech", "stack", "laravel", "flutter", "node", "php", "mysql", "next"],
    answer:
      "Core stack: Laravel, PHP, Node.js, MySQL/PostgreSQL, Flutter, Next.js, and practical AI automation. We choose tools based on your product and team — not hype.",
  },
  {
    id: "start",
    keywords: ["start", "begin", "hire", "quote", "proposal", "project"],
    answer:
      "To start: tell us what you want to build, your timeline, and budget range. You can use the Contact form or continue on WhatsApp for a faster reply. Shall I hand you over to WhatsApp?",
  },
  {
    id: "founder",
    keywords: ["founder", "silas", "who", "owner", "ceo"],
    answer:
      "DoyinTech is founded by Silas Doyin Jonathan — backend, APIs, Flutter, and automation focused on production-ready systems for real businesses.",
  },
];

export function matchIntent(message: string): ChatIntent | null {
  const q = message.toLowerCase().trim();
  if (!q) return null;

  let best: ChatIntent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (q.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  return bestScore > 0 ? best : null;
}

export function defaultReply(): string {
  return (
    "Thanks for your message. I can help with services, pricing, timelines, portfolio, and contact details.\n\n" +
    "For a custom project discussion, continue on WhatsApp or leave your name and email and we will follow up.\n\n" +
    "Type a topic (e.g. pricing, Flutter, Laravel) or say human to talk to the team."
  );
}
