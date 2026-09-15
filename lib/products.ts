export type DigitalProduct = {
  id: string;
  name: string;
  description: string;
  priceUsd: string;
  priceNgn: string;
  amountKobo: number;
  type: "one-time" | "subscription" | "waitlist";
  badge?: string;
  features: string[];
  delivery: string;
  demandNote?: string;
  addedAt?: string;
};

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "sme-cashflow-tracker",
    name: "SME Cashflow & Receivables Tracker",
    description:
      "Sheets-ready cash in/out, who-owes-you log, payables, Sunday review, and WhatsApp collection scripts for Nigerian SMEs.",
    priceUsd: "$19",
    priceNgn: "₦14,500",
    amountKobo: 1450000,
    type: "one-time",
    badge: "New today",
    features: [
      "Weekly cashflow CSV",
      "Receivables + payables logs",
      "15-min weekly review",
      "Polite WhatsApp chasers",
      "Google Sheets import steps",
    ],
    delivery: "ZIP from digital-products/09-sme-cashflow-receivables-tracker after Paystack",
    addedAt: "2026-09-15",
  },
  {
    id: "status-caption-pack",
    name: "Status & Caption Pack (Canva-ready)",
    description:
      "120+ WhatsApp Status and Instagram captions for restocks, offers, proof, and CTAs. Paste into Canva or Status as-is.",
    priceUsd: "$12",
    priceNgn: "₦8,500",
    amountKobo: 850000,
    type: "one-time",
    badge: "New",
    features: [
      "40 Status hooks",
      "40 offer captions",
      "20 review/request lines",
      "Canva size notes",
    ],
    delivery: "Markdown pack after payment — also at /digital-products/status-caption-pack.md",
    addedAt: "2026-09-14",
  },
  {
    id: "client-onboarding-kit",
    name: "Client Onboarding Kit",
    description:
      "Kickoff form questions, welcome email, asset checklist, and project rules so new clients start clean.",
    priceUsd: "$14",
    priceNgn: "₦9,000",
    amountKobo: 900000,
    type: "one-time",
    badge: "New",
    features: [
      "Kickoff questionnaire",
      "Welcome email template",
      "Asset checklist",
      "Revision rules blurb",
    ],
    delivery: "Markdown kit after payment — /digital-products/client-onboarding-kit.md",
    addedAt: "2026-09-14",
  },
  {
    id: "notion-freelancer-os",
    name: "Freelancer OS (Notion blueprint)",
    description:
      "Page structure for leads, projects, invoices, and content — rebuild in Notion in under an hour.",
    priceUsd: "$16",
    priceNgn: "₦10,000",
    amountKobo: 1000000,
    type: "one-time",
    badge: "New",
    features: [
      "Database schemas",
      "Lead pipeline views",
      "Project checklist",
      "Weekly review page",
    ],
    delivery: "Blueprint markdown — /digital-products/notion-freelancer-os.md",
    addedAt: "2026-09-14",
  },
  {
    id: "ai-prompt-pack-business",
    name: "ChatGPT + Claude Business Prompt Pack",
    description:
      "Battle-tested prompts for proposals, ads, WhatsApp scripts, SEO outlines, and client emails.",
    priceUsd: "$19",
    priceNgn: "₦12,000",
    amountKobo: 1200000,
    type: "one-time",
    badge: "Hot demand",
    features: [
      "Proposal & scope prompts",
      "Ad + caption generators",
      "WhatsApp reply scripts",
      "SEO brief + blog outlines",
    ],
    delivery: "/digital-products/ai-business-prompt-pack.md after payment",
    addedAt: "2026-09-14",
  },
  {
    id: "whatsapp-status-sales-calendar",
    name: "WhatsApp Status Sales Calendar (30 Days)",
    description: "30-day Status plan with hooks, offers, and CTAs.",
    priceUsd: "$18",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    badge: "SME",
    features: ["30-day calendar", "90+ captions", "Weekly review"],
    delivery: "ZIP / WhatsApp after payment",
    addedAt: "2026-09-14",
  },
  {
    id: "whatsapp-business-pack",
    name: "WhatsApp Business Growth Pack",
    description: "Auto-replies, catalog captions, order scripts, follow-ups.",
    priceUsd: "$29",
    priceNgn: "₦25,000",
    amountKobo: 2500000,
    type: "one-time",
    badge: "Best seller",
    features: ["50+ scripts", "Auto-reply templates", "Booking flows"],
    delivery: "PDF + Doc within 2 hours",
    addedAt: "2026-09-13",
  },
  {
    id: "nextjs-business-starter",
    name: "Next.js Business Website Kit",
    description: "Production-ready Next.js site kit — deploy to Vercel fast.",
    priceUsd: "$49",
    priceNgn: "₦45,000",
    amountKobo: 4500000,
    type: "one-time",
    badge: "Most popular",
    features: ["App Router", "Conversion pages", "WhatsApp wired"],
    delivery: "Private repo within 24 hours",
    addedAt: "2026-09-13",
  },
];

export const SAAS_PRODUCTS: DigitalProduct[] = [
  {
    id: "whatsapp-automation",
    name: "DoyinReply — WhatsApp Automation",
    description: "Auto-replies and lead capture on WhatsApp.",
    priceUsd: "From $25/mo",
    priceNgn: "From ₦15,000/mo",
    amountKobo: 1500000,
    type: "waitlist",
    badge: "Waitlist",
    features: ["Auto-reply", "FAQ", "Lead capture"],
    delivery: "Waitlist",
  },
  {
    id: "sme-crm",
    name: "DoyinCRM — Simple SME CRM",
    description: "Pipeline CRM for small teams.",
    priceUsd: "From $35/mo",
    priceNgn: "From ₦25,000/mo",
    amountKobo: 2500000,
    type: "waitlist",
    badge: "Waitlist",
    features: ["Pipeline", "Reminders", "WhatsApp links"],
    delivery: "Waitlist",
  },
];

export function getDigitalProduct(id: string): DigitalProduct | undefined {
  return DIGITAL_PRODUCTS.find((p) => p.id === id);
}

export function productWhatsAppLink(productName: string, kind: string): string {
  const text = `Hi DoyinTech, I want to buy/join: "${productName}" (${kind}). Please send payment details.`;
  return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
}

export function waitlistWhatsAppLink(productName: string): string {
  const text = `Hi DoyinTech, add me to the waitlist for "${productName}".`;
  return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
}
