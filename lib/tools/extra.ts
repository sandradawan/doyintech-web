/** Logic & data for extended tools — edit recommendations here */

export function formatNgn(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

// —— Tech stack advisor ——
export type StackInput = {
  product: string;
  audience: string;
  budget: "low" | "medium" | "high";
  timeline: "fast" | "normal" | "flexible";
  team: "solo" | "small" | "agency";
  needs: string[];
};

export function adviseStack(input: StackInput) {
  const needs = new Set(input.needs);
  const recs: { name: string; why: string }[] = [];
  let primary = "Next.js + Node API";
  let mobile = "Responsive web first";
  let backend = "Node.js or Laravel";
  let db = "PostgreSQL (or MySQL)";

  if (needs.has("ecommerce") || input.product === "online-store") {
    primary = "Next.js storefront or Laravel + Blade/Livewire";
    backend = "Laravel or Node with Paystack/Flutterwave";
    recs.push({ name: "Paystack / Flutterwave", why: "Local card & transfer payments" });
  }
  if (needs.has("mobile") || input.product === "mobile-app") {
    mobile = "Flutter (one codebase for iOS + Android)";
    recs.push({ name: "Flutter", why: "Cost-effective cross-platform apps in Nigeria" });
  }
  if (needs.has("cms") && input.budget === "low") {
    primary = "WordPress (custom theme) or Next.js + headless CMS";
  }
  if (needs.has("school") || input.product === "school-portal") {
    primary = "Laravel or Next.js admin + student portal";
    backend = "Laravel (auth, roles, reports) or Node";
    db = "MySQL or PostgreSQL";
  }
  if (needs.has("ai")) {
    recs.push({ name: "OpenAI / Gemini API", why: "Chat, classification, automation" });
    backend = "Node or Python worker + your main API";
  }
  if (input.budget === "low" && input.timeline === "fast") {
    recs.push({
      name: "MVP scope",
      why: "Ship core features first; avoid overbuilding",
    });
  }

  return {
    primary,
    mobile,
    backend,
    db,
    hosting: input.budget === "low" ? "Vercel + managed DB / shared hosting" : "Vercel/Railway + managed Postgres",
    extras: recs,
    summary: `For a ${input.product.replace(/-/g, " ")} aimed at ${input.audience}, prioritise ${primary}. Mobile: ${mobile}.`,
  };
}

// —— Hosting planner ——
export function planHosting(opts: {
  traffic: "low" | "medium" | "high";
  type: "static" | "business" | "app";
  email: boolean;
  ssl: boolean;
}) {
  let domainMin = 12_000;
  let domainMax = 25_000;
  let hostMin = 15_000;
  let hostMax = 40_000;
  const notes: string[] = ["Domain prices vary by TLD (.com vs .com.ng)"];

  if (opts.type === "business") {
    hostMin = 30_000;
    hostMax = 90_000;
  }
  if (opts.type === "app") {
    hostMin = 60_000;
    hostMax = 250_000;
    notes.push("App hosting often uses Vercel/Railway + managed database");
  }
  if (opts.traffic === "high") {
    hostMin = Math.round(hostMin * 1.5);
    hostMax = Math.round(hostMax * 2);
  }
  if (opts.email) {
    hostMin += 15_000;
    hostMax += 50_000;
    notes.push("Business email (Google Workspace / Zoho) is separate from web hosting");
  }
  if (opts.ssl) notes.push("HTTPS/SSL should be included on modern hosts");

  return {
    yearlyMin: domainMin + hostMin,
    yearlyMax: domainMax + hostMax,
    domainMin,
    domainMax,
    hostMin,
    hostMax,
    notes,
  };
}

// —— ROI ——
export function calcRoi(input: {
  investment: number;
  monthlyCustomers: number;
  avgValue: number;
  conversionBoost: number; // percent
}) {
  const extraCustomers =
    input.monthlyCustomers * (input.conversionBoost / 100);
  const monthlyGain = extraCustomers * input.avgValue;
  const yearlyGain = monthlyGain * 12;
  const roi =
    input.investment > 0
      ? Math.round(((yearlyGain - input.investment) / input.investment) * 100)
      : 0;
  const payback =
    monthlyGain > 0 ? Math.ceil(input.investment / monthlyGain) : null;
  return { monthlyGain, yearlyGain, roi, paybackMonths: payback };
}

// —— Salary ——
const SALARY_TABLE: Record<
  string,
  Record<string, { min: number; max: number; dayRate: [number, number] }>
> = {
  frontend: {
    junior: { min: 80_000, max: 180_000, dayRate: [15_000, 35_000] },
    mid: { min: 180_000, max: 400_000, dayRate: [35_000, 70_000] },
    senior: { min: 400_000, max: 900_000, dayRate: [70_000, 150_000] },
  },
  backend: {
    junior: { min: 100_000, max: 220_000, dayRate: [18_000, 40_000] },
    mid: { min: 220_000, max: 500_000, dayRate: [40_000, 85_000] },
    senior: { min: 500_000, max: 1_200_000, dayRate: [85_000, 180_000] },
  },
  mobile: {
    junior: { min: 100_000, max: 220_000, dayRate: [18_000, 40_000] },
    mid: { min: 220_000, max: 480_000, dayRate: [40_000, 80_000] },
    senior: { min: 480_000, max: 1_000_000, dayRate: [80_000, 160_000] },
  },
  fullstack: {
    junior: { min: 120_000, max: 250_000, dayRate: [20_000, 45_000] },
    mid: { min: 250_000, max: 550_000, dayRate: [45_000, 90_000] },
    senior: { min: 550_000, max: 1_300_000, dayRate: [90_000, 200_000] },
  },
};

export function estimateSalary(role: string, level: string) {
  const r = SALARY_TABLE[role]?.[level] || SALARY_TABLE.fullstack.mid;
  return {
    monthlyMin: r.min,
    monthlyMax: r.max,
    dayMin: r.dayRate[0],
    dayMax: r.dayRate[1],
    disclaimer:
      "Indicative market ranges for Nigeria — actual pay varies by city, company, and skills.",
  };
}

// —— Skill gap ——
export const SKILL_TRACKS: Record<
  string,
  { must: string[]; should: string[]; nice: string[] }
> = {
  backend: {
    must: ["HTTP & REST APIs", "Databases (SQL)", "Authentication", "Git"],
    should: ["Laravel or Node", "Caching", "Testing", "Deployments"],
    nice: ["Redis", "Queues", "Docker", "System design basics"],
  },
  mobile: {
    must: ["Dart/Flutter or React Native", "UI layouts", "API integration", "Git"],
    should: ["State management", "Local storage", "App store basics"],
    nice: ["CI/CD", "Push notifications", "Offline-first"],
  },
  frontend: {
    must: ["HTML/CSS", "JavaScript", "Responsive design", "Git"],
    should: ["React or Next.js", "Accessibility", "API consumption"],
    nice: ["TypeScript", "Testing", "Performance"],
  },
  ai: {
    must: ["Python basics", "APIs", "Prompt design", "Data privacy awareness"],
    should: ["RAG concepts", "Automation workflows", "Evaluation"],
    nice: ["Vector DBs", "Fine-tuning awareness", "MLOps lite"],
  },
};

export function skillGap(track: string, known: string[]) {
  const t = SKILL_TRACKS[track] || SKILL_TRACKS.backend;
  const k = new Set(known.map((s) => s.toLowerCase()));
  const missingMust = t.must.filter((s) => ![...k].some((x) => s.toLowerCase().includes(x) || x.includes(s.toLowerCase().slice(0, 4))));
  const missingShould = t.should.filter(
    (s) => ![...k].some((x) => s.toLowerCase().includes(x) || x.includes(s.toLowerCase().slice(0, 4))),
  );
  return { track: t, missingMust, missingShould, known };
}

// —— Project ideas ——
export const PROJECT_IDEAS: Record<string, string[]> = {
  beginner: [
    "Personal portfolio with blog (Next.js)",
    "Expense tracker (Flutter + local storage)",
    "School timetable web app",
    "WhatsApp-style UI clone (UI only)",
    "QR menu for a local restaurant",
  ],
  intermediate: [
    "Multi-vendor mini marketplace with Paystack",
    "CBT exam system for a department",
    "Property listing portal with admin",
    "Inventory + sales dashboard for a shop",
    "Appointment booking system with SMS reminders",
  ],
  advanced: [
    "AI customer support chatbot with knowledge base",
    "Real-time logistics tracking dashboard",
    "SaaS subscription billing for a niche tool",
    "Offline-first field data collection app",
    "Document workflow automation for an SME",
  ],
};

// —— Interview ——
export const INTERVIEW_Q: Record<string, string[]> = {
  backend: [
    "What is the difference between authentication and authorization?",
    "How would you design a simple REST API for orders?",
    "Explain SQL indexes and when they help.",
    "How do you handle errors and logging in production?",
    "What is idempotency and why does it matter for payments?",
  ],
  mobile: [
    "StatefulWidget vs StatelessWidget (Flutter) — when to use each?",
    "How do you manage app state as features grow?",
    "How would you optimise a slow list screen?",
    "How do you secure API keys in a mobile app?",
    "Describe your approach to offline support.",
  ],
  frontend: [
    "Explain the box model and flexbox.",
    "What causes layout shift and how do you reduce it?",
    "How do you manage form state and validation?",
    "Client-side vs server-side rendering — tradeoffs?",
    "How do you improve Core Web Vitals?",
  ],
  general: [
    "Tell me about a project you are proud of.",
    "How do you debug a production issue?",
    "How do you prioritise tasks under a deadline?",
    "Describe a disagreement on a team and how you handled it.",
    "What are you learning right now and why?",
  ],
};

// —— AI use cases ——
export function aiUseCases(industry: string) {
  const common = [
    "WhatsApp FAQ auto-replies for common questions",
    "Lead qualification chatbot on your website",
    "Summarise customer emails into action items",
    "Generate product descriptions from bullet points",
  ];
  const map: Record<string, string[]> = {
    retail: ["Inventory restock suggestions", "Abandoned cart follow-up messages"],
    education: ["Quiz question generation", "Student enquiry triage"],
    services: ["Appointment reminder scripts", "Proposal draft from brief"],
    hospitality: ["Menu Q&A bot", "Review response drafts"],
    other: ["Internal knowledge search", "Report drafting from spreadsheet data"],
  };
  return [...common, ...(map[industry] || map.other)];
}

// —— WhatsApp checklist ——
export const WA_CHECKLIST = [
  "Download WhatsApp Business (not only personal WhatsApp)",
  "Use a dedicated business number if possible",
  "Set business name, category, and description",
  "Add logo and cover that match your brand",
  "Write a short welcome message",
  "Create away message with hours and alternatives",
  "Add quick replies for price, location, hours",
  "Set up labels (New lead, Paying, Done)",
  "Add catalog or price list if you sell products",
  "Pin important messages / status updates",
  "Train staff never to share OTPs or bank secrets",
  "Link your website and Google Business Profile",
];

// —— Maintenance ——
export function pickMaintenance(opts: {
  updates: "rare" | "monthly" | "weekly";
  critical: boolean;
  size: "small" | "medium" | "large";
}) {
  if (opts.critical || opts.size === "large" || opts.updates === "weekly") {
    return {
      plan: "Priority Care",
      range: "₦80,000 – ₦200,000+/month",
      includes: [
        "Priority fixes",
        "Updates & monitoring",
        "Backups",
        "Security patches",
        "Monthly report",
      ],
    };
  }
  if (opts.updates === "monthly" || opts.size === "medium") {
    return {
      plan: "Standard Care",
      range: "₦40,000 – ₦90,000/month",
      includes: ["Content help", "Updates", "Backups", "Basic monitoring"],
    };
  }
  return {
    plan: "Essentials",
    range: "₦25,000 – ₦50,000/month",
    includes: ["Backups", "Security updates", "Uptime checks"],
  };
}

// —— Password ——
export function generatePassword(length: number, symbols: boolean) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" +
    (symbols ? "!@#$%^&*-_+=" : "");
  const arr = new Uint32Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < length; i++) arr[i] = Math.floor(Math.random() * 1e9);
  }
  let out = "";
  for (let i = 0; i < length; i++) out += chars[arr[i] % chars.length];
  return out;
}
