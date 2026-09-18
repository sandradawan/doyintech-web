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
  {
    id: "gs-habit-goal-tracker",
    name: "Habit & Goal Tracker 2026 (Google Sheets)",
    description:
      "Monthly habit grid, SMART goals, weekly review — ADHD-friendly limits (max 4 habits) and completion formulas.",
    priceUsd: "$12",
    priceNgn: "₦9,500",
    amountKobo: 950000,
    type: "one-time",
    badge: "Sheets · Productivity",
    features: [
      "Habit × day monthly grid",
      "SMART goals with progress %",
      "Weekly review prompts",
      "Streak-friendly formatting rules",
      "CSV habit definitions starter",
    ],
    delivery: "Instant download — guide + CSV",
    downloadPath: "/digital-products/gs-habit-goal-tracker.md",
    downloadPaths: [
      "/digital-products/gs-habit-goal-tracker.md",
      "/digital-products/csv/habits-definitions.csv",
    ],
    demandNote: "Habit and goal trackers are evergreen Etsy bestsellers.",
    addedAt: "2026-09-18",
  },
  {
    id: "gs-freelancer-bookkeeping",
    name: "Freelancer Bookkeeping Sheet (Google Sheets)",
    description:
      "Income, expenses, invoices, client roll-up, and monthly P&L — built for solopreneurs and Nigerian-friendly labels.",
    priceUsd: "$17",
    priceNgn: "₦13,500",
    amountKobo: 1350000,
    type: "one-time",
    badge: "Sheets · Business",
    features: [
      "Income & expense ledgers",
      "Invoice status tracker",
      "Monthly P&L formulas",
      "Client outstanding roll-up",
      "CSV income/expense/invoice starters",
    ],
    delivery: "Instant download — guide + CSVs",
    downloadPath: "/digital-products/gs-freelancer-bookkeeping.md",
    downloadPaths: [
      "/digital-products/gs-freelancer-bookkeeping.md",
      "/digital-products/csv/bookkeeping-income.csv",
      "/digital-products/csv/bookkeeping-expenses.csv",
      "/digital-products/csv/bookkeeping-invoices.csv",
    ],
    demandNote: "Small-business bookkeeping sheets sell year-round on Etsy.",
    addedAt: "2026-09-18",
  },
  {
    id: "gs-project-task-tracker",
    name: "Project & Task Tracker (Google Sheets)",
    description:
      "Kanban statuses, priorities, due dates, project health, workload view — Eisenhower-style urgency without another SaaS tab.",
    priceUsd: "$16",
    priceNgn: "₦12,500",
    amountKobo: 1250000,
    type: "one-time",
    badge: "Sheets · Ops",
    features: [
      "Tasks + Projects tabs",
      "Kanban status dropdowns",
      "Overdue dashboard formulas",
      "Workload by owner",
      "CSV tasks + projects starters",
    ],
    delivery: "Instant download — guide + CSVs",
    downloadPath: "/digital-products/gs-project-task-tracker.md",
    downloadPaths: [
      "/digital-products/gs-project-task-tracker.md",
      "/digital-products/csv/tasks.csv",
      "/digital-products/csv/projects.csv",
    ],
    demandNote: "Task/project trackers are high-volume Etsy spreadsheet products.",
    addedAt: "2026-09-18",
  },
  {
    id: "ember-months-sales-playbook",
    name: "Ember Months Sales Playbook 2026",
    description:
      "Oct–Dec week plan, offer math that keeps 15%+ margin, WhatsApp blast scripts, inventory/prepay tracker, and a 20-minute Ember ops checklist.",
    priceUsd: "$19",
    priceNgn: "₦14,500",
    amountKobo: 1450000,
    type: "one-time",
    badge: "New today",
    features: [
      "Oct–Dec week-by-week calendar",
      "Offer math (discount without going broke)",
      "WhatsApp Status + blast scripts",
      "Sheets inventory & supplier prepay CSV",
      "Morning/night Ember ops checklist",
      "Deposit and last-delivery-date rules",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/ember-months-sales-playbook.md",
    addedAt: "2026-09-18",
  },
  {
    id: "freelance-contract-wht-pack",
    name: "Freelance Contract & WHT Survival Pack",
    description:
      "Short service agreement, WHT invoice wording, credit-note chase scripts, change orders, and a milestone tracker for Nigerian freelancers.",
    priceUsd: "$16",
    priceNgn: "₦12,500",
    amountKobo: 1250000,
    type: "one-time",
    badge: "New",
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
