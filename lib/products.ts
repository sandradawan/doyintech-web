export type DigitalProduct = {
  id: string;
  name: string;
  description: string;
  priceUsd: string;
  priceNgn: string;
  /** Amount in kobo for Paystack (NGN) */
  amountKobo: number;
  type: "one-time" | "subscription" | "waitlist";
  badge?: string;
  features: string[];
  delivery: string;
};

/**
 * High-demand digital products for African SMEs, freelancers, and builders.
 * Sold via Paystack on /products.
 */
export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "whatsapp-business-pack",
    name: "WhatsApp Business Growth Pack",
    description:
      "Ready-to-use auto-replies, catalog captions, order scripts, and follow-up messages businesses actually send on WhatsApp every day.",
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
      "Editable Google Doc + PDF",
    ],
    delivery: "PDF + Doc link within 2 hours after payment",
  },
  {
    id: "nextjs-business-starter",
    name: "Next.js Business Website Kit",
    description:
      "Production-ready Next.js + Tailwind site: Home, Services, Pricing, Contact, WhatsApp CTA, SEO meta — deploy to Vercel in one afternoon.",
    priceUsd: "$49",
    priceNgn: "₦45,000",
    amountKobo: 4500000,
    type: "one-time",
    badge: "Most popular",
    features: [
      "Full Next.js App Router project",
      "5 conversion-focused pages",
      "Mobile-first responsive UI",
      "WhatsApp & contact form wired",
      "Setup guide (deploy on Vercel)",
    ],
    delivery: "Private GitHub repo access within 24 hours",
  },
  {
    id: "freelance-invoice-proposal-pack",
    name: "Freelance Invoice & Proposal Pack",
    description:
      "Win clients faster with professional proposal, invoice, contract, and receipt templates used by freelancers and small agencies.",
    priceUsd: "$19",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    badge: "Low ticket",
    features: [
      "Proposal template (Word + PDF)",
      "Invoice & receipt templates",
      "Simple service agreement",
      "Email follow-up scripts",
      "Naira & USD versions",
    ],
    delivery: "ZIP download link via email/WhatsApp after payment",
  },
  {
    id: "laravel-api-starter",
    name: "Laravel API Starter (Auth + Roles)",
    description:
      "Skip weeks of setup. Secure Laravel API with auth, roles, API keys pattern, and Postman collection — built for real products.",
    priceUsd: "$59",
    priceNgn: "₦55,000",
    amountKobo: 5500000,
    type: "one-time",
    features: [
      "Laravel API skeleton",
      "Auth (login/register/token)",
      "Roles & permissions starter",
      "Postman collection",
      "README + folder structure guide",
    ],
    delivery: "Private repo invite within 24 hours",
  },
  {
    id: "sme-client-tracker",
    name: "SME Client & Sales Tracker",
    description:
      "Simple CRM-in-a-spreadsheet for shops and service businesses: clients, pipeline, follow-ups, and monthly revenue — no complex software.",
    priceUsd: "$15",
    priceNgn: "₦12,000",
    amountKobo: 1200000,
    type: "one-time",
    badge: "For SMEs",
    features: [
      "Google Sheets template",
      "Client & deal pipeline",
      "Follow-up reminder columns",
      "Monthly sales dashboard tab",
      "1-page setup instructions",
    ],
    delivery: "Google Sheets copy link within 2 hours after payment",
  },
];

export const SAAS_PRODUCTS: DigitalProduct[] = [
  {
    id: "whatsapp-automation",
    name: "DoyinReply — WhatsApp Automation",
    description:
      "Auto-replies, FAQs, and lead capture for businesses that live on WhatsApp. Monthly subscription.",
    priceUsd: "From $25/mo",
    priceNgn: "From ₦15,000/mo",
    amountKobo: 1500000,
    type: "waitlist",
    badge: "Coming soon · Waitlist",
    features: [
      "Auto-reply outside business hours",
      "FAQ quick answers",
      "Lead capture to your inbox",
      "Simple dashboard",
    ],
    delivery: "Join waitlist — early users get founding price",
  },
  {
    id: "sme-crm",
    name: "DoyinCRM — Simple SME CRM",
    description:
      "Clients, follow-ups, and pipeline in one place. Built for small teams who hate complex CRMs.",
    priceUsd: "From $35/mo",
    priceNgn: "From ₦25,000/mo",
    amountKobo: 2500000,
    type: "waitlist",
    badge: "Waitlist",
    features: [
      "Client & deal pipeline",
      "Reminders & notes",
      "WhatsApp deep links",
      "Monthly subscription",
    ],
    delivery: "Waitlist — notify when beta opens",
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
  const text = `Hi DoyinTech, add me to the waitlist for "${productName}". My goal is recurring automation for my business.`;
  return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
}
