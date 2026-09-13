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
    id: "pdf-business-pack",
    name: "Professional PDF Business Pack",
    description:
      "Letterhead, quote, and report layouts you can export to PDF — for freelancers and SMEs who need polished documents fast.",
    priceUsd: "$22",
    priceNgn: "₦18,000",
    amountKobo: 1800000,
    type: "one-time",
    badge: "New today",
    features: [
      "Letterhead template",
      "Quote / estimate layout",
      "Print-ready structure",
      "Pairs with PDF Studio tool",
    ],
    delivery: "Files within 2 hours after payment (see digital-products/06-pdf-business-pack)",
    demandNote: "PDF document kits are high-intent B2B digital products",
    addedAt: "2026-09-13",
  },
  {
    id: "pdf-studio-unlock",
    name: "PDF Studio — Full Unlock",
    description:
      "One-time unlock for DoyinTech PDF Studio: unlimited professional PDF generation in the browser (letter, quote, report).",
    priceUsd: "$9",
    priceNgn: "₦5,000",
    amountKobo: 500000,
    type: "one-time",
    badge: "Paid tool",
    features: [
      "Unlimited PDF exports",
      "Letter, quote, report templates",
      "Browser print-to-PDF",
      "No subscription",
    ],
    delivery: "Instant unlock on site after Paystack payment",
    demandNote: "Paid utilities convert when free preview is strong",
    addedAt: "2026-09-13",
  },
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
      "Auto-reply templates",
      "Order & booking flows",
      "Follow-up sequences",
    ],
    delivery: "PDF + Doc within 2 hours after payment",
    addedAt: "2026-09-13",
  },
  {
    id: "nextjs-business-starter",
    name: "Next.js Business Website Kit",
    description:
      "Production-ready Next.js site kit with pricing and WhatsApp CTA — deploy to Vercel fast.",
    priceUsd: "$49",
    priceNgn: "₦45,000",
    amountKobo: 4500000,
    type: "one-time",
    badge: "Most popular",
    features: [
      "App Router project",
      "Conversion pages",
      "WhatsApp wired",
      "Vercel setup guide",
    ],
    delivery: "Private repo within 24 hours",
    addedAt: "2026-09-13",
  },
  {
    id: "freelance-invoice-proposal-pack",
    name: "Freelance Invoice & Proposal Pack",
    description:
      "Proposal, invoice, contract, and receipt templates to get paid faster.",
    priceUsd: "$19",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    badge: "Low ticket",
    features: [
      "Proposal + invoice + receipt",
      "Service agreement",
      "Follow-up scripts",
    ],
    delivery: "ZIP after payment",
    addedAt: "2026-09-13",
  },
  {
    id: "laravel-api-starter",
    name: "Laravel API Starter (Auth + Roles)",
    description:
      "Laravel API with auth, roles, and Postman collection.",
    priceUsd: "$59",
    priceNgn: "₦55,000",
    amountKobo: 5500000,
    type: "one-time",
    features: [
      "Auth endpoints",
      "Role middleware",
      "Postman collection",
    ],
    delivery: "Private repo within 24 hours",
    addedAt: "2026-09-13",
  },
  {
    id: "sme-client-tracker",
    name: "SME Client & Sales Tracker",
    description:
      "CRM-in-a-spreadsheet for clients, pipeline, and follow-ups.",
    priceUsd: "$15",
    priceNgn: "₦12,000",
    amountKobo: 1200000,
    type: "one-time",
    badge: "For SMEs",
    features: [
      "Clients + pipeline CSV",
      "Sheets setup guide",
    ],
    delivery: "Sheet link within 2 hours",
    addedAt: "2026-09-13",
  },
  {
    id: "ai-business-prompt-pack",
    name: "AI Business Prompt Pack",
    description:
      "Prompts for sales, proposals, ads, and support — built for SMEs.",
    priceUsd: "$17",
    priceNgn: "₦12,000",
    amountKobo: 1200000,
    type: "one-time",
    badge: "Hot",
    features: ["80+ prompts", "Sales & ops", "Copy-paste ready"],
    delivery: "PDF within 2 hours",
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
