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
  downloadPath?: string;
  downloadPaths?: string[];
};

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "ember-supplier-prepay-kit",
    name: "Ember Supplier Prepay & Restock Float Kit",
    description:
      "Lock October–December stock without emptying your float: supplier scripts, 30–50% prepay math, arrival calendar, Sheets restock log, and Status “restocking” captions.",
    priceUsd: "$16",
    priceNgn: "₦12,500",
    amountKobo: 1250000,
    type: "one-time",
    badge: "New today",
    features: [
      "Supplier first-touch + chase scripts",
      "30/50% prepay worksheet",
      "Arrival calendar (Oct–Dec weeks)",
      "Sheets restock + float CSV",
      "8 restock Status captions",
      "Sunday 20-minute float review",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/ember-supplier-prepay-kit.md",
    downloadPaths: [
      "/digital-products/ember-supplier-prepay-kit.md",
      "/digital-products/csv/supplier-restock.csv",
    ],
    demandNote:
      "SMEs prepay suppliers now for Ember goods; poor terms and missing arrival dates freeze working capital.",
    addedAt: "2026-09-26",
  },
  {
    id: "corporate-hamper-presale-kit",
    name: "Corporate Hamper & Bulk Gift Pre-Sale Kit",
    description:
      "Sell office Christmas hampers in October–November: HR outreach scripts, 3-tier menu, 50% deposit quote, Sheets order log, and Status captions — before you spend float on stock.",
    priceUsd: "$17",
    priceNgn: "₦13,000",
    amountKobo: 1300000,
    type: "one-time",
    badge: "Hampers",
    features: [
      "HR / admin first-touch + follow-ups",
      "3-tier hamper menu you can price",
      "Pin-able 50% deposit + cut-off rules",
      "Sheets corporate order log CSV",
      "10 pre-sale Status captions",
      "Sunday 20-minute pipeline review",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/corporate-hamper-presale-kit.md",
    downloadPaths: [
      "/digital-products/corporate-hamper-presale-kit.md",
      "/digital-products/csv/hamper-orders.csv",
    ],
    demandNote:
      "Offices lock staff and client gifts in Oct–Nov; unpaid December promises burn SME float.",
    addedAt: "2026-09-25",
  },
  {
    id: "party-season-booking-kit",
    name: "Party Season Booking & Deposit Kit",
    description:
      "Turn Ember “hold this date” chats into paid slots: WhatsApp booking scripts, deposit/no-show policy, slot calendar, Sheets log, and Status captions for tailors, bakers, makeup, and photographers.",
    priceUsd: "$18",
    priceNgn: "₦14,000",
    amountKobo: 1400000,
    type: "one-time",
    badge: "Party season",
    features: [
      "First-reply + deposit scripts",
      "Pin-able no-show policy",
      "Oct–Dec slot capacity table",
      "Sheets bookings CSV",
      "Status captions for open dates",
      "Sunday 20-minute capacity review",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/party-season-booking-kit.md",
    downloadPaths: [
      "/digital-products/party-season-booking-kit.md",
      "/digital-products/csv/bookings.csv",
    ],
    demandNote:
      "Service SMEs lock October–December diaries now; unpaid holds are the #1 Ember leak.",
    addedAt: "2026-09-24",
  },
  {
    id: "ember-staff-va-sop-kit",
    name: "Ember Staff & VA WhatsApp SOP Kit",
    description:
      "Hire Ember help without losing the chat or the float: roles, day-one onboarding, staff scripts, close checklist, scam escalation, and a shift log.",
    priceUsd: "$17",
    priceNgn: "₦13,500",
    amountKobo: 1350000,
    type: "one-time",
    badge: "Staff SOP",
    features: [
      "Role matrix: VA, shop, dispatch",
      "90-minute day-one onboarding",
      "Price, deposit, and last-price scripts",
      "15-minute end-of-day close",
      "Scam / OTP escalation rules",
      "Sheets shift log CSV",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/ember-staff-va-sop-kit.md",
    downloadPaths: [
      "/digital-products/ember-staff-va-sop-kit.md",
      "/digital-products/csv/staff-shift-log.csv",
    ],
    demandNote:
      "SMEs add seasonal staff before October–December and need SOPs so the phone and cash stay controlled.",
    addedAt: "2026-09-23",
  },
  {
    id: "sme-system-protector-kit",
    name: "SME System Protector Kit",
    description:
      "Phone + Windows + WhatsApp hardening checklists, staff one-pager, account-compromise playbook, and monthly 15-minute review. Honest system protector — not fake antivirus.",
    priceUsd: "$16",
    priceNgn: "₦12,500",
    amountKobo: 1250000,
    type: "one-time",
    badge: "New · Protector",
    features: [
      "Android + Windows hardening checklists",
      "WhatsApp Business security rules for staff",
      "30-minute compromised-account playbook",
      "Monthly 15-minute review table",
      "Links to free System Protector quiz",
      "Clear scope: hygiene, not virus engine",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/sme-system-protector-kit.md",
    demandNote:
      "SMEs need practical device and WhatsApp protection without fake AV claims.",
    addedAt: "2026-09-22",
  },
  {
    id: "whatsapp-followup-agent-kit",
    name: "WhatsApp Follow-up Agent Kit",
    description:
      "Turn missed quotes into paid jobs: Day-0/2/5/7 follow-up scripts, pipeline stages, AI prompt pack, and Sheets tracker.",
    priceUsd: "$19",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    badge: "AI ops",
    features: [
      "Day-0 / Day-2 / Day-5 / Day-7 follow-up scripts",
      "Quote-sent and deposit-nudge templates",
      "Pipeline stages + Sheets tracker CSV",
      "AI prompts to personalize every reply",
      "Status captions that feed the same pipeline",
      "Hand-off checklist when you hire a VA",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/whatsapp-followup-agent-kit.md",
    downloadPaths: [
      "/digital-products/whatsapp-followup-agent-kit.md",
      "/digital-products/csv/whatsapp-followup-pipeline.csv",
    ],
    addedAt: "2026-09-22",
  },
  {
    id: "ember-returns-credit-kit",
    name: "Ember Returns, Swap & Credit Note Kit",
    description:
      "7-day return policy, swap scripts, store-credit notes, and a Sheets log so Ember volume does not turn into a cash-refund queue.",
    priceUsd: "$16",
    priceNgn: "₦12,000",
    amountKobo: 1200000,
    type: "one-time",
    badge: "Ember",
    features: [
      "7-day policy you can pin",
      "Swap scripts (size/colour)",
      "30-day store credit note",
      "Refund-last WhatsApp scripts",
      "Sheets returns log CSV",
      "Sunday 20-minute review",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/ember-returns-credit-kit.md",
    downloadPaths: [
      "/digital-products/ember-returns-credit-kit.md",
      "/digital-products/csv/returns-log.csv",
    ],
    addedAt: "2026-09-22",
  },
  {
    id: "ember-dispatch-recovery-kit",
    name: "Ember Dispatch & Failed-Delivery Recovery Kit",
    description:
      "Prepaid vs POD rules, rider briefs, failed-drop WhatsApp scripts, and a Sheets dispatch log.",
    priceUsd: "$15",
    priceNgn: "₦11,500",
    amountKobo: 1150000,
    type: "one-time",
    badge: "Logistics",
    features: [
      "City cut-off + prepaid rules",
      "One-message rider brief",
      "Failed-delivery scripts",
      "COD → prepaid sequence",
      "Sheets dispatch log CSV",
      "Sunday 20-minute ops checklist",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/ember-dispatch-recovery-kit.md",
    downloadPaths: [
      "/digital-products/ember-dispatch-recovery-kit.md",
      "/digital-products/csv/dispatch-log.csv",
    ],
    addedAt: "2026-09-21",
  },
];

export const SAAS_PRODUCTS: DigitalProduct[] = [
  {
    id: "doyinshield-app",
    name: "DoyinShield — System Protector App",
    description:
      "Expo protector coach: security score, WhatsApp safe habits, scam radar, emergency playbooks. Kit available now; app on waitlist.",
    priceUsd: "From $5/mo",
    priceNgn: "From ₦3,500/mo",
    amountKobo: 350000,
    type: "waitlist",
    badge: "Waitlist · Shield",
    features: [
      "Daily/weekly protector score",
      "WhatsApp two-step + backup nudges",
      "Scam red-flag cards",
      "Emergency account recovery flow",
      "Unlocks full Kit playbooks",
    ],
    delivery: "Waitlist — buy the Kit today",
  },
  {
    id: "whatsapp-automation",
    name: "DoyinAgent — WhatsApp Ops Agent",
    description:
      "AI-assisted WhatsApp ops: suggest replies, log leads, remind follow-ups, draft Status.",
    priceUsd: "From $29/mo",
    priceNgn: "From ₦20,000/mo",
    amountKobo: 2000000,
    type: "waitlist",
    badge: "Waitlist · Agent",
    features: [
      "Reply suggestions from your scripts",
      "Lead + quote pipeline",
      "Follow-up reminders",
      "Status caption drafts",
      "Works with the Follow-up Agent Kit",
    ],
    delivery: "Waitlist — buy the Kit today while agent ships",
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
