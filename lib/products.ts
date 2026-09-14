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
    id: "ai-prompt-pack-business",
    name: "ChatGPT + Claude Business Prompt Pack",
    description:
      "120+ battle-tested prompts for proposals, ads, WhatsApp scripts, SEO outlines, and client emails — what freelancers and SMEs actually paste into ChatGPT and Claude every day.",
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
      "Claude vs ChatGPT usage guide",
    ],
    delivery: "PDF + Notion-ready markdown within 2 hours after payment",
    demandNote:
      "People search ChatGPT/Claude for business writing daily — sell the prompts, not another chatbot",
    addedAt: "2026-09-14",
  },
  {
    id: "freelance-proposal-closer",
    name: "Freelance Proposal & Close Kit",
    description:
      "One-page proposal template, pricing tables, objection scripts, and follow-up sequence freelancers ask AI to write every week — ready to copy.",
    priceUsd: "$15",
    priceNgn: "₦9,500",
    amountKobo: 950000,
    type: "one-time",
    badge: "Freelancer",
    features: [
      "Proposal one-pager",
      "Scope & out-of-scope block",
      "Price justification lines",
      "Day 2 / Day 5 follow-ups",
    ],
    delivery: "DOCX + PDF after payment",
    demandNote: "High ChatGPT usage for proposals — package the output format",
    addedAt: "2026-09-14",
  },
  {
    id: "whatsapp-status-sales-calendar",
    name: "WhatsApp Status Sales Calendar (30 Days)",
    description:
      "A ready-to-post 30-day WhatsApp Status plan for Nigerian SMEs: daily hooks, product drops, social proof, and CTA copy so Status views turn into chats.",
    priceUsd: "$18",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    badge: "SME",
    features: [
      "30-day posting calendar",
      "90+ Status captions",
      "Restock and offer templates",
      "Weekly review checklist",
    ],
    delivery:
      "ZIP within 2 hours after payment (digital-products/08-whatsapp-status-sales-calendar)",
    demandNote: "WhatsApp Status is the free storefront for Nigerian sellers",
    addedAt: "2026-09-14",
  },
  {
    id: "sme-digital-ops-system",
    name: "SME Digital Ops System — Complete",
    description:
      "Website kit, WhatsApp scripts, invoices, PDF pack, client tracker, AI prompts, and 30-day launch plan — one payment.",
    priceUsd: "$120",
    priceNgn: "₦100,000",
    amountKobo: 10000000,
    type: "one-time",
    badge: "Premium",
    features: [
      "Next.js business website kit",
      "WhatsApp growth pack",
      "Invoice & contract templates",
      "AI prompt pack",
      "30-day launch checklist",
    ],
    delivery: "Full ZIP within 24 hours",
    demandNote: "Bundle converts better than single templates",
    addedAt: "2026-09-13",
  },
  {
    id: "pdf-business-pack",
    name: "Professional PDF Business Pack",
    description: "Letterhead, quote, and report layouts for freelancers and SMEs.",
    priceUsd: "$22",
    priceNgn: "₦18,000",
    amountKobo: 1800000,
    type: "one-time",
    badge: "Documents",
    features: ["Letterhead", "Quote layout", "Print-ready structure"],
    delivery: "Files within 2 hours after payment",
    addedAt: "2026-09-13",
  },
  {
    id: "pdf-studio-unlock",
    name: "PDF Studio — Full Unlock",
    description: "Unlimited professional PDF generation in the browser.",
    priceUsd: "$9",
    priceNgn: "₦5,000",
    amountKobo: 500000,
    type: "one-time",
    badge: "Paid tool",
    features: ["Unlimited exports", "Letter / quote / report", "No subscription"],
    delivery: "Instant unlock after Paystack",
    addedAt: "2026-09-13",
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
  {
    id: "freelance-invoice-proposal-pack",
    name: "Freelance Invoice & Proposal Pack",
    description: "Proposal, invoice, contract, and receipt templates.",
    priceUsd: "$19",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    badge: "Low ticket",
    features: ["Proposal + invoice", "Service agreement", "Follow-up scripts"],
    delivery: "ZIP after payment",
    addedAt: "2026-09-13",
  },
  {
    id: "laravel-api-starter",
    name: "Laravel API Starter (Auth + Roles)",
    description: "Laravel API with auth, roles, and Postman collection.",
    priceUsd: "$59",
    priceNgn: "₦55,000",
    amountKobo: 5500000,
    type: "one-time",
    features: ["Auth endpoints", "Role middleware", "Postman collection"],
    delivery: "Private repo within 24 hours",
    addedAt: "2026-09-13",
  },
];

export const SAAS_PRODUCTS: DigitalProduct[] = [
  {
    id: "whatsapp-automation",
    name: "DoyinReply — WhatsApp Automation",
    description: "Auto-replies and lead capture on WhatsApp. Monthly subscription.",
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
