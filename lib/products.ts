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
    id: "ember-returns-credit-kit",
    name: "Ember Returns, Swap & Credit Note Kit",
    description:
      "7-day return policy, swap scripts, store-credit notes, and a Sheets log so Ember volume does not turn into a cash-refund queue.",
    priceUsd: "$16",
    priceNgn: "₦12,000",
    amountKobo: 1200000,
    type: "one-time",
    badge: "New today",
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
    demandNote:
      "Ember multiplies parcels and arguments — SMEs need swap/credit rules before 1 October.",
    addedAt: "2026-09-22",
  },
  {
    id: "ember-dispatch-recovery-kit",
    name: "Ember Dispatch & Failed-Delivery Recovery Kit",
    description:
      "Prepaid vs POD rules, rider briefs, failed-drop WhatsApp scripts, and a Sheets dispatch log so Ember parcels actually arrive — and retries stay profitable.",
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
    demandNote:
      "Ember profit dies on failed POD drops and silent riders — SMEs need rules before 1 October.",
    addedAt: "2026-09-21",
  },
  {
    id: "independence-week-preorder-kit",
    name: "Independence Week Pre-Order Kit",
    description:
      "WhatsApp scripts, deposit math, 25 Sep–7 Oct capacity calendar, and a Sheets tracker so SMEs take paid pre-orders before 1 October — not unpaid holds.",
    priceUsd: "$14",
    priceNgn: "₦10,500",
    amountKobo: 1050000,
    type: "one-time",
    badge: "Independence",
    features: [
      "Open / confirm / chase / sold-out scripts",
      "30–50% deposit math that keeps margin",
      "Independence Week capacity calendar",
      "Sheets pre-order tracker CSV",
      "10 Status captions for 1 Oct + Ember",
      "Sunday 20-minute restock checklist",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/independence-week-preorder-kit.md",
    downloadPaths: [
      "/digital-products/independence-week-preorder-kit.md",
      "/digital-products/csv/preorders.csv",
    ],
    demandNote:
      "SMEs lose Ember stock to free reservations; paid pre-orders before Independence Day convert.",
    addedAt: "2026-09-20",
  },
  {
    id: "review-referral-harvest-kit",
    name: "Review & Referral Harvest Kit",
    description:
      "WhatsApp scripts to collect real reviews after delivery, a 4-line testimonial template, referral asks that protect margin, and a Sheets tracker for Ember social proof.",
    priceUsd: "$12",
    priceNgn: "₦9,500",
    amountKobo: 950000,
    type: "one-time",
    badge: "Social proof",
    features: [
      "Day-1 and Day-3 review scripts",
      "Referral asks + thank-you offer math",
      "4-line testimonial + Status wrap",
      "Sheets harvest tracker CSV",
      "20-minute Sunday checklist",
      "Permission-to-post hygiene",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/review-referral-harvest-kit.md",
    downloadPaths: [
      "/digital-products/review-referral-harvest-kit.md",
      "/digital-products/csv/reviews-referrals.csv",
    ],
    demandNote:
      "SMEs heading into Ember need proof and warm intros more than more ads.",
    addedAt: "2026-09-19",
  },
  {
    id: "gs-sheets-starter-bundle",
    name: "Sheets Starter Bundle (All 6 Templates)",
    description:
      "All six Etsy-style Google Sheets packs — budget, CRM, content calendar, habits, bookkeeping, and project tracker — plus import-ready CSVs. Save vs buying separately.",
    priceUsd: "$49",
    priceNgn: "₦45,000",
    amountKobo: 4500000,
    type: "one-time",
    badge: "Bundle · Best value",
    features: [
      "All 6 Sheets setup guides",
      "Import-ready CSV starters",
      "Works in Google Sheets & Excel",
      "Save vs ₦74,000 separate",
      "Lifetime download access",
    ],
    delivery: "Instant download of all guides + CSVs after Paystack",
    downloadPath: "/digital-products/gs-sheets-bundle-readme.md",
    downloadPaths: [
      "/digital-products/gs-sheets-bundle-readme.md",
      "/digital-products/gs-monthly-budget-dashboard.md",
      "/digital-products/gs-client-crm-tracker.md",
      "/digital-products/gs-content-calendar.md",
      "/digital-products/gs-habit-goal-tracker.md",
      "/digital-products/gs-freelancer-bookkeeping.md",
      "/digital-products/gs-project-task-tracker.md",
      "/digital-products/csv/budget-income.csv",
      "/digital-products/csv/budget-expenses.csv",
      "/digital-products/csv/budget-categories.csv",
      "/digital-products/csv/crm-pipeline.csv",
      "/digital-products/csv/crm-contacts.csv",
      "/digital-products/csv/content-calendar.csv",
      "/digital-products/csv/habits-definitions.csv",
      "/digital-products/csv/bookkeeping-income.csv",
      "/digital-products/csv/bookkeeping-expenses.csv",
      "/digital-products/csv/bookkeeping-invoices.csv",
      "/digital-products/csv/tasks.csv",
      "/digital-products/csv/projects.csv",
    ],
    demandNote: "Bundle of top Etsy spreadsheet niches at a discount.",
    addedAt: "2026-09-18",
  },
  {
    id: "gs-monthly-budget-dashboard",
    name: "Monthly Budget Dashboard (Google Sheets)",
    description:
      "Etsy-style personal finance sheet: income, expenses, category limits, bills, savings goals, and a one-screen dashboard with formulas.",
    priceUsd: "$16",
    priceNgn: "₦12,500",
    amountKobo: 1250000,
    type: "one-time",
    badge: "Sheets · Top seller",
    features: [
      "Dashboard + Income + Expenses tabs",
      "Category limits with overspend flags",
      "Bills & savings goals sheets",
      "Copy-paste formulas for Google Sheets",
      "CSV starters for fast import",
    ],
    delivery: "Instant download — guide + CSVs",
    downloadPath: "/digital-products/gs-monthly-budget-dashboard.md",
    downloadPaths: [
      "/digital-products/gs-monthly-budget-dashboard.md",
      "/digital-products/csv/budget-income.csv",
      "/digital-products/csv/budget-expenses.csv",
      "/digital-products/csv/budget-categories.csv",
    ],
    demandNote: "Budget planners are the #1 Google Sheets niche on Etsy.",
    addedAt: "2026-09-18",
  },
  {
    id: "gs-client-crm-tracker",
    name: "Client CRM & Lead Tracker (Google Sheets)",
    description:
      "Lightweight CRM: pipeline stages, contacts, activity log, tasks, and follow-up dates — for freelancers who outgrew a notebook.",
    priceUsd: "$19",
    priceNgn: "₦14,500",
    amountKobo: 1450000,
    type: "one-time",
    badge: "Sheets · Hot",
    features: [
      "Pipeline stages Lead → Paid",
      "Contacts + activity log",
      "Tasks with due dates",
      "WhatsApp link helper formula",
      "CSV pipeline + contacts starters",
    ],
    delivery: "Instant download — guide + CSVs",
    downloadPath: "/digital-products/gs-client-crm-tracker.md",
    downloadPaths: [
      "/digital-products/gs-client-crm-tracker.md",
      "/digital-products/csv/crm-pipeline.csv",
      "/digital-products/csv/crm-contacts.csv",
    ],
    demandNote: "Client tracker / CRM sheets are top sellers for small business on Etsy.",
    addedAt: "2026-09-18",
  },
  {
    id: "gs-content-calendar",
    name: "Content Calendar Spreadsheet (Google Sheets)",
    description:
      "Plan WhatsApp Status, IG, TikTok, LinkedIn & YouTube in one calendar — hooks library, ideas bank, monthly themes.",
    priceUsd: "$15",
    priceNgn: "₦11,500",
    amountKobo: 1150000,
    type: "one-time",
    badge: "Sheets · Creator",
    features: [
      "Multi-platform content calendar",
      "12 ready hooks for SME/tech offers",
      "Ideas bank + monthly themes",
      "Status workflow: Idea → Posted",
      "CSV calendar starter",
    ],
    delivery: "Instant download — guide + CSV",
    downloadPath: "/digital-products/gs-content-calendar.md",
    downloadPaths: [
      "/digital-products/gs-content-calendar.md",
      "/digital-products/csv/content-calendar.csv",
    ],
    demandNote: "Content calendars rank among top business spreadsheet niches.",
    addedAt: "2026-09-18",
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
  return DIGITAL_PRODUCTS.find((p) => p.id === p.id);
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
