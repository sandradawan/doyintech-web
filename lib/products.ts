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
  /** Store shelf; products without one are filed by productCategory(). */
  category?: ProductCategory;
  /** Who it's for, shown on the product page. */
  audience?: string;
  /** What's inside, file by file, for the product page. */
  contents?: string[];
};

export const PRODUCT_CATEGORIES = ["Business", "Office & HR", "Students", "Schools & organisations", "Marketing & sales"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export function productCategory(p: DigitalProduct): ProductCategory {
  if (p.category) return p.category;
  return /whatsapp|status|review|referral|hamper|party|caption|marketing/i.test(p.id) ? "Marketing & sales" : "Business";
}

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "hr-staff-policy-starter-pack",
    name: "HR & Staff Policy Starter Pack",
    description:
      "Employee handbook, offer, query, warning, confirmation and termination letters, leave policy, appraisal form and staff register: everything to hire and manage staff properly.",
    priceUsd: "$19",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    badge: "New",
    category: "Office & HR",
    audience: "Business owners, HR officers and admin managers with 3–50 staff",
    features: [
      "Employee handbook template (10 sections)",
      "6 HR letters ready for your letterhead",
      "Leave policy and application form",
      "Performance appraisal form",
      "Staff file checklist",
      "Staff register and leave tracker sheets",
    ],
    contents: [
      "HR & Staff Policy guide (PDF + editable Markdown)",
      "staff-register.csv",
      "leave-tracker.csv",
    ],
    delivery: "Instant download after Paystack: PDF guide + spreadsheets",
    downloadPath: "/digital-products/hr-staff-policy-starter-pack.md",
    downloadPaths: [
      "/digital-products/hr-staff-policy-starter-pack.md",
      "/digital-products/csv/staff-register.csv",
      "/digital-products/csv/leave-tracker.csv",
    ],
    demandNote:
      "Small companies hire without written policies, then struggle with lateness, queries and exits.",
    addedAt: "2026-10-31",
  },
  {
    id: "sme-payroll-paye-sheet",
    name: "SME Payroll & PAYE Sheet (2026)",
    description:
      "Payroll spreadsheet with 2026 PAYE bands, pension, NHF, rent relief and net pay for every employee, plus the monthly remittance summary and payroll calendar.",
    priceUsd: "$16",
    priceNgn: "₦12,500",
    amountKobo: 1250000,
    type: "one-time",
    badge: "2026 tax",
    category: "Office & HR",
    audience: "Employers, accountants and HR running payroll for 2–100 staff",
    features: [
      "Copy-paste formulas for Sheets and Excel",
      "PAYE under the Nigeria Tax Act 2025",
      "Pension, NHF and rent relief built in",
      "Remittance summary with due dates",
      "Payroll calendar and controls",
      "Worked examples checked against our PAYE calculator",
    ],
    contents: [
      "Payroll guide with formulas (PDF + Markdown)",
      "payroll.csv with three worked sample employees",
    ],
    delivery: "Instant download after Paystack: PDF guide + spreadsheets",
    downloadPath: "/digital-products/sme-payroll-paye-sheet.md",
    downloadPaths: [
      "/digital-products/sme-payroll-paye-sheet.md",
      "/digital-products/csv/payroll.csv",
    ],
    demandNote:
      "The 2026 tax bands changed PAYE for every employer; most SME payroll sheets still use the old relief.",
    addedAt: "2026-10-31",
  },
  {
    id: "office-admin-templates-bundle",
    name: "Office Admin Templates Bundle",
    description:
      "Memo, meeting notice, minutes, purchase requisition, petty cash voucher, visitor log, asset register, stores note, vehicle log, handover note and official letter layout.",
    priceUsd: "$12",
    priceNgn: "₦9,500",
    amountKobo: 950000,
    type: "one-time",
    badge: "New",
    category: "Office & HR",
    audience: "Office managers, admin officers, secretaries and front desk staff",
    features: [
      "12 office templates",
      "Petty cash imprest rules",
      "Asset register with tagging system",
      "Visitor log and opening/closing checklist",
      "Nigerian official letter layout",
      "3 ready spreadsheets",
    ],
    contents: [
      "Office templates guide (PDF + Markdown)",
      "asset-register.csv",
      "petty-cash.csv",
      "visitor-log.csv",
    ],
    delivery: "Instant download after Paystack: PDF guide + spreadsheets",
    downloadPath: "/digital-products/office-admin-templates-bundle.md",
    downloadPaths: [
      "/digital-products/office-admin-templates-bundle.md",
      "/digital-products/csv/asset-register.csv",
      "/digital-products/csv/petty-cash.csv",
      "/digital-products/csv/visitor-log.csv",
    ],
    demandNote:
      "Admin officers rebuild the same memos, vouchers and registers in every new job.",
    addedAt: "2026-10-31",
  },
  {
    id: "business-plan-pitch-kit",
    name: "Business Plan & Pitch Deck Kit",
    description:
      "Business plan template with guidance for each section, a 12-month projection sheet, a 10-slide pitch deck outline and the documents checklist funders ask for.",
    priceUsd: "$15",
    priceNgn: "₦12,000",
    amountKobo: 1200000,
    type: "one-time",
    badge: "Grants & loans",
    category: "Business",
    audience: "Founders applying for loans, grants or investment",
    features: [
      "12-section business plan template",
      "How reviewers read your plan",
      "12-month projection spreadsheet",
      "10-slide pitch deck outline",
      "Funder documents checklist",
      "Pre-submission checklist",
    ],
    contents: [
      "Business plan and pitch guide (PDF + Markdown)",
      "12-month-projection.csv",
    ],
    delivery: "Instant download after Paystack: PDF guide + spreadsheets",
    downloadPath: "/digital-products/business-plan-pitch-kit.md",
    downloadPaths: [
      "/digital-products/business-plan-pitch-kit.md",
      "/digital-products/csv/12-month-projection.csv",
    ],
    demandNote:
      "Grant and loan applications are rejected for vague customers and numbers that don't add up.",
    addedAt: "2026-10-31",
  },
  {
    id: "school-admin-fees-kit",
    name: "School Admin & Fees Tracker Kit",
    description:
      "Fees tracker with balances and status, fee reminder messages, payment plan agreement, admission form and letter, score sheet with grades and positions, and report card comments.",
    priceUsd: "$15",
    priceNgn: "₦12,000",
    amountKobo: 1200000,
    type: "one-time",
    badge: "For schools",
    category: "Schools & organisations",
    audience: "Proprietors, head teachers and bursars of private schools",
    features: [
      "Fees tracker with balance formulas",
      "Polite and firm fee reminder messages",
      "Admission form and letter",
      "Score sheet with grade and position formulas",
      "Report card comment bank",
      "Termly calendar and PTA agenda",
    ],
    contents: [
      "School admin guide (PDF + Markdown)",
      "fees-tracker.csv",
      "score-sheet.csv",
    ],
    delivery: "Instant download after Paystack: PDF guide + spreadsheets",
    downloadPath: "/digital-products/school-admin-fees-kit.md",
    downloadPaths: [
      "/digital-products/school-admin-fees-kit.md",
      "/digital-products/csv/fees-tracker.csv",
      "/digital-products/csv/score-sheet.csv",
    ],
    demandNote:
      "Unpaid fees are the biggest cash problem for private schools, and many still track them in exercise books.",
    addedAt: "2026-10-31",
  },
  {
    id: "ngo-church-admin-finance-kit",
    name: "NGO & Church Admin and Finance Kit",
    description:
      "Cash count sheet, payment voucher, donation receipts, annual budget, monthly finance report, grant tracking, membership register, annual report outline and governance policies.",
    priceUsd: "$13",
    priceNgn: "₦10,000",
    amountKobo: 1000000,
    type: "one-time",
    badge: "For organisations",
    category: "Schools & organisations",
    audience: "Treasurers, secretaries and leaders of churches, mosques, NGOs and associations",
    features: [
      "Five money rules that prevent fraud",
      "Cash count sheet and payment voucher",
      "Annual budget with quarterly actuals",
      "One-page monthly finance report",
      "Annual report outline for AGMs and donors",
      "Donations log spreadsheet",
    ],
    contents: [
      "Organisation admin and finance guide (PDF + Markdown)",
      "donations-log.csv",
      "org-budget.csv",
    ],
    delivery: "Instant download after Paystack: PDF guide + spreadsheets",
    downloadPath: "/digital-products/ngo-church-admin-finance-kit.md",
    downloadPaths: [
      "/digital-products/ngo-church-admin-finance-kit.md",
      "/digital-products/csv/donations-log.csv",
      "/digital-products/csv/org-budget.csv",
    ],
    demandNote:
      "Members and donors give more when they can see clear records of where money went.",
    addedAt: "2026-10-31",
  },
  {
    id: "final-year-project-starter-kit",
    name: "Final Year Project Starter Kit",
    description:
      "Topic formula, proposal template, Chapters 1–5 templates, questionnaire template, APA referencing, formatting checklist, defence questions and a 16-week timeline.",
    priceUsd: "$7",
    priceNgn: "₦5,000",
    amountKobo: 500000,
    type: "one-time",
    badge: "Students",
    category: "Students",
    audience: "University and polytechnic final year students",
    features: [
      "Topic formula with examples",
      "Proposal and Chapters 1–5 templates",
      "System design outline for computing projects",
      "Questionnaire template",
      "Formatting checklist",
      "Defence questions panels always ask",
    ],
    contents: [
      "Project guide (PDF + Markdown)",
      "project-timeline.csv",
    ],
    delivery: "Instant download after Paystack: PDF guide + spreadsheets",
    downloadPath: "/digital-products/final-year-project-starter-kit.md",
    downloadPaths: [
      "/digital-products/final-year-project-starter-kit.md",
      "/digital-products/csv/project-timeline.csv",
    ],
    demandNote:
      "Final year students lose weeks on structure and formatting before they start the actual research.",
    addedAt: "2026-10-31",
  },
  {
    id: "diaspora-ember-gift-order-kit",
    name: "Diaspora Ember Gift & Family Order Kit",
    description:
      "Take Oct–Dec orders from family abroad: payer vs receiver scripts, 5% FX buffer rules, 3-tier gift menu, Sheets log, and proof-of-delivery captions.",
    priceUsd: "$15",
    priceNgn: "₦12,000",
    amountKobo: 1200000,
    type: "one-time",
    badge: "New today",
    features: [
      "Local shopper + abroad payer scripts",
      "Pin-able Paystack / FX / proof rules",
      "3-tier gift menu you can price",
      "Sheets diaspora order CSV",
      "8 Status captions for UK/US/Canada payers",
      "Sunday 20-minute FX + proof review",
    ],
    delivery: "Instant download after Paystack",
    downloadPath: "/digital-products/diaspora-ember-gift-order-kit.md",
    downloadPaths: [
      "/digital-products/diaspora-ember-gift-order-kit.md",
      "/digital-products/csv/diaspora-orders.csv",
    ],
    demandNote:
      "Ember gift money from the diaspora lands now; SMEs lose orders to FX confusion and fake payment screenshots.",
    addedAt: "2026-09-27",
  },
  {
    id: "ember-supplier-prepay-kit",
    name: "Ember Supplier Prepay & Restock Float Kit",
    description:
      "Lock October–December stock without emptying your float: supplier scripts, 30–50% prepay math, arrival calendar, Sheets restock log, and Status “restocking” captions.",
    priceUsd: "$16",
    priceNgn: "₦12,500",
    amountKobo: 1250000,
    type: "one-time",
    badge: "Float",
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
