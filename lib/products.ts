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
  /** Public path under /public for instant post-payment download */
  downloadPath?: string;
  /** Extra files unlocked with this product (e.g. bundles) */
  downloadPaths?: string[];
};

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "freelance-contract-wht-pack",
    name: "Freelance Contract & WHT Survival Pack",
    description:
      "Short service agreement, WHT invoice wording, credit-note chase scripts, change orders, and a milestone tracker for Nigerian freelancers.",
    priceUsd: "$16",
    priceNgn: "₦12,500",
    amountKobo: 1250000,
    type: "one-time",
    badge: "New today",
    features: [
      "Short service agreement (Docs-ready)",
      "Gross invoice + WHT notes",
      "WhatsApp credit-note chase scripts",
      "One-page change order",
      "Sheets milestone + WHT tracker",
      "Pause-work rules when paper is late",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/freelance-contract-wht-pack.md",
    addedAt: "2026-09-17",
  },
  {
    id: "sme-tax-compliance-calendar",
    name: "SME Tax & Compliance Calendar 2026",
    description:
      "Nigeria-focused VAT, PAYE, WHT, pension, and CAC reminder board plus a Sheets tracker and accountant handoff pack.",
    priceUsd: "$17",
    priceNgn: "₦13,500",
    amountKobo: 1350000,
    type: "one-time",
    badge: "New",
    features: [
      "2026 month-by-month reminder board",
      "Sheets-ready compliance tracker CSV",
      "WhatsApp nudges for your bookkeeper",
      "Monthly accountant handoff checklist",
      "Penalty-hygiene habits (not legal advice)",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/sme-tax-compliance-calendar.md",
    addedAt: "2026-09-16",
  },
  {
    id: "whatsapp-quote-last-price-kit",
    name: "WhatsApp Quote & Last-Price Kit",
    description:
      "Quote template, last-price scripts that protect margin, deposit/Paystack wording, and a Sheets-ready price list for service SMEs.",
    priceUsd: "$15",
    priceNgn: "₦11,500",
    amountKobo: 1150000,
    type: "one-time",
    badge: "New",
    features: [
      "WhatsApp quote you can send today",
      "Last-price scripts (keep 10–15% margin)",
      "Deposit + Paystack / transfer lines",
      "Price-list CSV for Sheets",
      "Scope trade vs discount rules",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/whatsapp-quote-last-price-kit.md",
    addedAt: "2026-09-16",
  },
  {
    id: "bundle-freelancer-starter",
    name: "Freelancer Starter Bundle",
    description:
      "Prompt Pack + Client Onboarding Kit + Notion Freelancer OS — quote, onboard, and run clients.",
    priceUsd: "$32",
    priceNgn: "₦25,000",
    amountKobo: 2500000,
    type: "one-time",
    badge: "Bundle",
    features: [
      "AI Business Prompt Pack",
      "Client Onboarding Kit",
      "Notion Freelancer OS",
      "Save vs buying separate",
    ],
    delivery: "Instant download of all 3 files after Paystack",
    downloadPaths: [
      "/digital-products/ai-business-prompt-pack.md",
      "/digital-products/client-onboarding-kit.md",
      "/digital-products/notion-freelancer-os.md",
    ],
    addedAt: "2026-09-15",
  },
  {
    id: "bundle-sme-launch",
    name: "SME Launch Bundle",
    description:
      "WhatsApp Status Sales Calendar + Status & Caption Pack — post daily and turn views into chats.",
    priceUsd: "$24",
    priceNgn: "₦19,500",
    amountKobo: 1950000,
    type: "one-time",
    badge: "Bundle",
    features: [
      "30-day Status calendar",
      "Caption / Status pack",
      "CTA and offer formulas",
      "Best value for local sellers",
    ],
    delivery: "Instant download after Paystack",
    downloadPaths: [
      "/digital-products/status-caption-pack.md",
      "/digital-products/whatsapp-status-sales-calendar.md",
    ],
    addedAt: "2026-09-15",
  },
  {
    id: "sme-cashflow-tracker",
    name: "SME Cashflow & Receivables Tracker",
    description:
      "Sheets-ready cash in/out, who-owes-you log, payables, Sunday review, and WhatsApp collection scripts.",
    priceUsd: "$19",
    priceNgn: "₦14,500",
    amountKobo: 1450000,
    type: "one-time",
    badge: "New",
    features: [
      "Weekly cashflow guide",
      "Receivables + payables logs",
      "15-min weekly review",
      "Polite WhatsApp chasers",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/sme-cashflow-tracker.md",
    addedAt: "2026-09-15",
  },
  {
    id: "status-caption-pack",
    name: "Status & Caption Pack (Canva-ready)",
    description:
      "120+ WhatsApp Status and Instagram captions for restocks, offers, proof, and CTAs.",
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
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/status-caption-pack.md",
    addedAt: "2026-09-14",
  },
  {
    id: "client-onboarding-kit",
    name: "Client Onboarding Kit",
    description:
      "Kickoff form questions, welcome email, asset checklist, and project rules.",
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
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/client-onboarding-kit.md",
    addedAt: "2026-09-14",
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

export function productDownloadUrls(product: DigitalProduct): string[] {
  if (product.downloadPaths?.length) return product.downloadPaths;
  if (product.downloadPath) return [product.downloadPath];
  return [];
}

export function productWhatsAppLink(productName: string, kind: string): string {
  const text = `Hi DoyinTech, I want to buy/join: "${productName}" (${kind}). Please send payment details.`;
  return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
}

export function waitlistWhatsAppLink(productName: string): string {
  const text = `Hi DoyinTech, add me to the waitlist for "${productName}".`;
  return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
}
