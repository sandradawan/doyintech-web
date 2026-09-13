export type DigitalProduct = {
  id: string;
  name: string;
  description: string;
  priceUsd: string;
  priceNgn: string;
  /** Amount in kobo for Paystack (NGN only) */
  amountKobo: number;
  type: "one-time" | "subscription" | "waitlist";
  badge?: string;
  features: string[];
  delivery: string;
};

/** Things that can sell with little daily work once set up. */
export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "business-website-starter-kit",
    name: "Business Website Starter Kit",
    description:
      "Ready-to-customize Next.js business site template — sections, contact, WhatsApp CTA, SEO basics.",
    priceUsd: "$49",
    priceNgn: "₦35,000",
    amountKobo: 3500000,
    type: "one-time",
    badge: "Digital download",
    features: [
      "Next.js + Tailwind starter",
      "5 core page layouts",
      "WhatsApp & contact form wiring",
      "Setup PDF included",
    ],
    delivery: "GitHub access + PDF within 24 hours after payment",
  },
  {
    id: "flutter-app-boilerplate",
    name: "Flutter App Boilerplate",
    description:
      "Clean Flutter starter with auth screens, API client pattern, and production folder structure.",
    priceUsd: "$79",
    priceNgn: "₦55,000",
    amountKobo: 5500000,
    type: "one-time",
    features: [
      "Auth UI screens",
      "API service pattern",
      "Theme + routing setup",
      "README handover",
    ],
    delivery: "Private repo invite within 24 hours after payment",
  },
  {
    id: "sme-ops-checklist",
    name: "SME Digital Ops Checklist",
    description:
      "PDF checklist for Nigerian SMEs: website, WhatsApp, payments, backups, and security basics.",
    priceUsd: "$9",
    priceNgn: "₦5,000",
    amountKobo: 500000,
    type: "one-time",
    badge: "Low ticket",
    features: [
      "Printable PDF",
      "Priority checklist",
      "Tool recommendations",
      "Delivered after payment confirm",
    ],
    delivery: "PDF via email/WhatsApp after payment",
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
    priceUsd: "$35/mo",
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
