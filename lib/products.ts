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
  /** Why demand is high (research note) */
  demandNote?: string;
  addedAt?: string;
};

/**
 * Live catalog — updated from market demand research.
 * High-demand categories (2025–2026): WhatsApp business kits, templates,
 * AI prompt packs, Notion/Sheets trackers, invoice/proposal packs, onboarding kits.
 */
export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "whatsapp-business-pack",
    name: "WhatsApp Business Growth Pack",
    description:
      "Auto-replies, catalog captions, order scripts, and follow-up messages businesses send on WhatsApp every day.",
    priceUsd: "$29",
    priceNgn: "₦25,000",
    amountKobo: 2500000,
    type: "one-time",
    badge: "Best seller",
    features: [
      "50+ copy-paste WhatsApp scripts",
      "Auto-reply templates (open/closed hours)",
      "Order & booking message flows",
      "Customer follow-up sequences",
      "Editable Doc + PDF",
    ],
    delivery: "PDF + Doc link within 2 hours after payment",
    demandNote: "WhatsApp is primary sales channel for African SMEs",
    addedAt: "2026-09-13",
  },
  {
    id: "nextjs-business-starter",
    name: "Next.js Business Website Kit",
    description:
      "Production-ready Next.js + Tailwind site: Home, Services, Pricing, Contact, WhatsApp CTA — deploy to Vercel fast.",
    priceUsd: "$49",
    priceNgn: "₦45,000",
    amountKobo: 4500000,
    type: "one-time",
    badge: "Most popular",
    features: [
      "Full Next.js App Router project",
      "5 conversion-focused pages",
      "WhatsApp & contact wired",
      "Setup guide for Vercel",
    ],
    delivery: "Private GitHub repo access within 24 hours",
    demandNote: "Website kits remain top digital download for agencies",
    addedAt: "2026-09-13",
  },
  {
    id: "freelance-invoice-proposal-pack",
    name: "Freelance Invoice & Proposal Pack",
    description:
      "Proposal, invoice, contract, and receipt templates freelancers and agencies use to get paid faster.",
    priceUsd: "$19",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    badge: "Low ticket",
    features: [
      "Proposal + invoice + receipt",
      "Simple service agreement",
      "Email follow-up scripts",
      "NGN & USD friendly",
    ],
    delivery: "ZIP via email/WhatsApp after payment",
    demandNote: "Invoice/proposal templates are evergreen B2B demand",
    addedAt: "2026-09-13",
  },
  {
    id: "laravel-api-starter",
    name: "Laravel API Starter (Auth + Roles)",
    description:
      "Secure Laravel API with auth, roles, and Postman collection — skip weeks of boilerplate.",
    priceUsd: "$59",
    priceNgn: "₦55,000",
    amountKobo: 5500000,
    type: "one-time",
    features: [
      "Auth (register/login/token)",
      "Roles middleware pattern",
      "Postman collection",
      "README + structure guide",
    ],
    delivery: "Private repo invite within 24 hours",
    demandNote: "Developer boilerplates sell well on Gumroad-style markets",
    addedAt: "2026-09-13",
  },
  {
    id: "sme-client-tracker",
    name: "SME Client & Sales Tracker",
    description:
      "CRM-in-a-spreadsheet: clients, pipeline, follow-ups, monthly revenue — no complex software.",
    priceUsd: "$15",
    priceNgn: "₦12,000",
    amountKobo: 1200000,
    type: "one-time",
    badge: "For SMEs",
    features: [
      "Google Sheets template",
      "Client & deal pipeline",
      "Follow-up columns",
      "Monthly sales tab guide",
    ],
    delivery: "Google Sheets copy link within 2 hours",
    demandNote: "Spreadsheet CRMs are high-intent SME purchases",
    addedAt: "2026-09-13",
  },
  // —— Demand-validated additions (research 2026) ——
  {
    id: "ai-business-prompt-pack",
    name: "AI Business Prompt Pack",
    description:
      "ChatGPT/Claude prompts for sales emails, proposals, ads, customer support, and SOP writing — built for SMEs and freelancers.",
    priceUsd: "$17",
    priceNgn: "₦12,000",
    amountKobo: 1200000,
    type: "one-time",
    badge: "New · Hot",
    features: [
      "80+ tested business prompts",
      "Sales, support, content, ops",
      "Copy-paste ready",
      "PDF + Doc",
    ],
    delivery: "PDF within 2 hours after payment",
    demandNote: "AI prompt libraries are Tier-1 digital products in 2026",
    addedAt: "2026-09-13",
  },
  {
    id: "client-onboarding-kit",
    name: "Client Onboarding Kit",
    description:
      "Welcome pack, questionnaire, project kickoff checklist, and first-week emails — look like a premium agency from day one.",
    priceUsd: "$24",
    priceNgn: "₦18,000",
    amountKobo: 1800000,
    type: "one-time",
    badge: "New",
    features: [
      "Welcome PDF template",
      "Client questionnaire",
      "Kickoff checklist",
      "Email/WhatsApp sequences",
    ],
    delivery: "ZIP within 2 hours after payment",
    demandNote: "Client onboarding kits are top B2B toolkit sellers",
    addedAt: "2026-09-13",
  },
  {
    id: "social-content-calendar",
    name: "30-Day Social Content Calendar",
    description:
      "Ready content plan for Instagram, Facebook, and WhatsApp Status — captions, hooks, and post ideas for service businesses.",
    priceUsd: "$14",
    priceNgn: "₦10,000",
    amountKobo: 1000000,
    type: "one-time",
    badge: "New",
    features: [
      "30 days of post ideas",
      "Caption formulas",
      "WhatsApp Status ideas",
      "Editable spreadsheet",
    ],
    delivery: "Sheet + PDF within 2 hours",
    demandNote: "Content calendars & Canva-style packs dominate template sales",
    addedAt: "2026-09-13",
  },
  {
    id: "sme-budget-cashflow",
    name: "SME Budget & Cashflow Tracker",
    description:
      "Simple money tracker for Nigerian SMEs: income, expenses, cashflow, and monthly summary — Google Sheets ready.",
    priceUsd: "$12",
    priceNgn: "₦8,000",
    amountKobo: 800000,
    type: "one-time",
    badge: "New",
    features: [
      "Income & expense tabs",
      "Monthly cashflow view",
      "Category breakdown",
      "Setup instructions",
    ],
    delivery: "Google Sheets link within 2 hours",
    demandNote: "Budget/finance trackers are evergreen on Etsy & local markets",
    addedAt: "2026-09-13",
  },
  {
    id: "pitch-deck-template",
    name: "Startup Pitch Deck Template",
    description:
      "Clean 12-slide pitch structure for founders raising or pitching partners — problem, solution, market, traction, ask.",
    priceUsd: "$19",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    badge: "New",
    features: [
      "12-slide outline",
      "Speaker notes prompts",
      "Editable structure (Google Slides)",
      "Example talking points",
    ],
    delivery: "Slides link within 2 hours",
    demandNote: "Pitch decks remain high-intent founder purchases",
    addedAt: "2026-09-13",
  },
];

export const SAAS_PRODUCTS: DigitalProduct[] = [
  {
    id: "whatsapp-automation",
    name: "DoyinReply — WhatsApp Automation",
    description:
      "Auto-replies, FAQs, and lead capture for businesses on WhatsApp. Monthly subscription.",
    priceUsd: "From $25/mo",
    priceNgn: "From ₦15,000/mo",
    amountKobo: 1500000,
    type: "waitlist",
    badge: "Coming soon · Waitlist",
    features: [
      "Auto-reply outside hours",
      "FAQ answers",
      "Lead capture",
      "Simple dashboard",
    ],
    delivery: "Waitlist — founding price for early users",
  },
  {
    id: "sme-crm",
    name: "DoyinCRM — Simple SME CRM",
    description:
      "Clients, follow-ups, and pipeline for small teams who hate complex CRMs.",
    priceUsd: "From $35/mo",
    priceNgn: "From ₦25,000/mo",
    amountKobo: 2500000,
    type: "waitlist",
    badge: "Waitlist",
    features: [
      "Pipeline & notes",
      "Reminders",
      "WhatsApp deep links",
      "Monthly billing",
    ],
    delivery: "Waitlist — notify on beta",
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
