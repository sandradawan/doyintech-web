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

export const PRODUCT_CATEGORIES = ["Business", "Office & HR", "Students", "Schools & organisations", "Marketing & sales", "Kids & parents"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export function productCategory(p: DigitalProduct): ProductCategory {
  if (p.category) return p.category;
  return /whatsapp|status|review|referral|hamper|party|caption|marketing/i.test(p.id) ? "Marketing & sales" : "Business";
}

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "xlsx-business-spreadsheet-bundle",
    name: "Business Spreadsheet Bundle (4 Excel templates)",
    description:
      "All four DoyinTech Excel templates in one download: Monthly Budget Planner, Small Business Bookkeeping, Client CRM & Sales Pipeline and Project & Task Tracker. Ready-made formulas, dropdowns and colour alerts. Works in Excel and Google Sheets, in any currency.",
    priceUsd: "$25",
    priceNgn: "₦39,000",
    amountKobo: 3900000,
    type: "one-time",
    badge: "Save 35%",
    category: "Business",
    audience: "Freelancers, small business owners and teams anywhere in the world",
    features: [
      "4 complete .xlsx workbooks with formulas built in",
      "Budget, bookkeeping, CRM and project tracking in one pack",
      "Dropdowns, dashboards and red/amber alerts",
      "Works in Excel, Google Sheets, LibreOffice and Numbers",
      "Any currency: amounts are plain numbers",
      "Quick-start guide for each workbook (PDF)",
    ],
    contents: [
      "monthly-budget-planner.xlsx",
      "small-business-bookkeeping.xlsx",
      "client-crm-sales-pipeline.xlsx",
      "project-task-tracker.xlsx",
      "Quick-start guides (PDF + Markdown)",
    ],
    delivery: "Instant download after payment: 4 Excel workbooks + PDF guides",
    downloadPath: "/digital-products/xlsx-monthly-budget-planner.md",
    downloadPaths: [
      "/digital-products/xlsx/monthly-budget-planner.xlsx",
      "/digital-products/xlsx/small-business-bookkeeping.xlsx",
      "/digital-products/xlsx/client-crm-sales-pipeline.xlsx",
      "/digital-products/xlsx/project-task-tracker.xlsx",
      "/digital-products/xlsx-monthly-budget-planner.md",
      "/digital-products/xlsx-small-business-bookkeeping.md",
      "/digital-products/xlsx-client-crm-sales-pipeline.md",
      "/digital-products/xlsx-project-task-tracker.md",
    ],
    demandNote:
      "Spreadsheet templates for budgets, bookkeeping, CRM and projects are among the best-selling digital products worldwide. Bought together, the four cost less than three on their own.",
    addedAt: "2026-11-14",
  },
  {
    id: "xlsx-monthly-budget-planner",
    name: "Monthly Budget Planner (Excel)",
    description:
      "Log money in and out, set a budget per category and see what you kept every month. Dashboard with savings rate and running total, plus a budget-vs-actual sheet that warns you before you overspend.",
    priceUsd: "$10",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    category: "Business",
    audience: "Anyone who wants to control spending and save more: individuals, couples, freelancers",
    features: [
      "12-month dashboard: income, spending, money kept, savings rate",
      "Budget vs actual per category with amber and red warnings",
      "Category and type dropdowns for fast entry",
      "Room for 1,000 transactions a year",
      "Works in Excel, Google Sheets, LibreOffice and Numbers",
      "Any currency",
    ],
    contents: ["monthly-budget-planner.xlsx", "Quick-start guide (PDF + Markdown)"],
    delivery: "Instant download after payment: Excel workbook + PDF guide",
    downloadPath: "/digital-products/xlsx-monthly-budget-planner.md",
    downloadPaths: [
      "/digital-products/xlsx/monthly-budget-planner.xlsx",
      "/digital-products/xlsx-monthly-budget-planner.md",
    ],
    demandNote: "Budget spreadsheets are one of the fastest-growing template searches worldwide as living costs rise.",
    addedAt: "2026-11-14",
  },
  {
    id: "xlsx-small-business-bookkeeping",
    name: "Small Business & Freelancer Bookkeeping (Excel)",
    description:
      "Track invoices, income and expenses in one workbook. See monthly profit, how much to set aside for tax, who owes you money and how late they are, and where your money goes by category.",
    priceUsd: "$10",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    category: "Business",
    audience: "Freelancers, consultants and small businesses without an accountant on staff",
    features: [
      "Invoice tracker with days-overdue alerts",
      "Income and expense ledgers with category dropdowns",
      "Monthly profit, margin and tax set-aside",
      "Money-owed summary and spending by category",
      "Works in Excel, Google Sheets, LibreOffice and Numbers",
      "Any currency",
    ],
    contents: ["small-business-bookkeeping.xlsx", "Quick-start guide (PDF + Markdown)"],
    delivery: "Instant download after payment: Excel workbook + PDF guide",
    downloadPath: "/digital-products/xlsx-small-business-bookkeeping.md",
    downloadPaths: [
      "/digital-products/xlsx/small-business-bookkeeping.xlsx",
      "/digital-products/xlsx-small-business-bookkeeping.md",
    ],
    demandNote: "Small businesses and freelancers pay for simple bookkeeping they can keep up with every week.",
    addedAt: "2026-11-14",
  },
  {
    id: "xlsx-client-crm-sales-pipeline",
    name: "Client CRM & Sales Pipeline (Excel)",
    description:
      "Keep every lead, client and deal in one place. Weighted sales forecast, win rate, deals by stage and red alerts for overdue follow-ups so no deal goes cold.",
    priceUsd: "$10",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    category: "Marketing & sales",
    audience: "Freelancers, agencies, consultants and small sales teams",
    features: [
      "Contacts list with lead source and days since last contact",
      "Deals with stage, value, chance to close and weighted value",
      "Overdue follow-up alerts",
      "Pipeline summary, forecast, win rate and average deal",
      "Works in Excel, Google Sheets, LibreOffice and Numbers",
      "Any currency",
    ],
    contents: ["client-crm-sales-pipeline.xlsx", "Quick-start guide (PDF + Markdown)"],
    delivery: "Instant download after payment: Excel workbook + PDF guide",
    downloadPath: "/digital-products/xlsx-client-crm-sales-pipeline.md",
    downloadPaths: [
      "/digital-products/xlsx/client-crm-sales-pipeline.xlsx",
      "/digital-products/xlsx-client-crm-sales-pipeline.md",
    ],
    demandNote: "Small businesses want CRM without a monthly subscription. A good spreadsheet covers most of it.",
    addedAt: "2026-11-14",
  },
  {
    id: "xlsx-project-task-tracker",
    name: "Project & Task Tracker (Excel)",
    description:
      "Plan projects, give every task an owner and a due date, and see what is overdue at a glance. Overview shows progress per project and workload per person.",
    priceUsd: "$10",
    priceNgn: "₦15,000",
    amountKobo: 1500000,
    type: "one-time",
    category: "Office & HR",
    audience: "Small teams, agencies, freelancers and project managers",
    features: [
      "Tasks with owner, priority, status, dates and % done",
      "Overdue and due-soon flags in red and amber",
      "Overview: status counts, workload per person, progress per project",
      "Filters to see one person or one project",
      "Works in Excel, Google Sheets, LibreOffice and Numbers",
    ],
    contents: ["project-task-tracker.xlsx", "Quick-start guide (PDF + Markdown)"],
    delivery: "Instant download after payment: Excel workbook + PDF guide",
    downloadPath: "/digital-products/xlsx-project-task-tracker.md",
    downloadPaths: [
      "/digital-products/xlsx/project-task-tracker.xlsx",
      "/digital-products/xlsx-project-task-tracker.md",
    ],
    demandNote: "Teams that outgrow sticky notes but don't want another paid app use a tracker like this.",
    addedAt: "2026-11-14",
  },
  {
    id: "podcast-starter-kit",
    name: "Podcast Starter Kit",
    description:
      "Plan, record and publish your first podcast episodes with the phone you already own: show planner, episode scripts, guest messages, a publishing guide, launch checklist and ways to earn from your show.",
    priceUsd: "$5",
    priceNgn: "₦3,000",
    amountKobo: 300000,
    type: "one-time",
    badge: "New",
    category: "Marketing & sales",
    audience: "Business owners, coaches, churches, students and creators starting a podcast",
    features: [
      "Show planner, one-line pitch and ten-episode test",
      "Phone-first equipment guide and tips for quiet recording",
      "Solo and interview scripts, guest invite and recording consent",
      "Step-by-step publishing guide and launch checklist",
      "Six ways to earn, a sponsor message and a 30-day plan",
    ],
    contents: ["Podcast Starter Kit (PDF + editable Markdown)"],
    delivery: "Instant download after Paystack: printable PDF",
    downloadPath: "/digital-products/podcast-starter-kit.md",
    demandNote: "Business owners and creators want a podcast but don't know where to begin or what to buy.",
    addedAt: "2026-11-06",
  },
  {
    id: "quiz-night-host-pack",
    name: "Quiz Night Host Pack (230 Questions)",
    description:
      "Run a fun quiz for a church social, school event, office party or family gathering: 230 questions in 8 themed rounds, multiple-choice options, answers with fun facts, a host script, scorecard and answer sheets.",
    priceUsd: "$3",
    priceNgn: "₦2,000",
    amountKobo: 200000,
    type: "one-time",
    badge: "New",
    category: "Schools & organisations",
    audience: "Churches, schools, youth groups, offices and families hosting a quiz",
    features: [
      "230 questions in 8 rounds: Nigeria, Africa & world, science, animals, food, sport, languages, history",
      "Easy, medium and hard questions marked, so all ages can play",
      "Answer key with a fun fact for every question",
      "Word-for-word host script, tie-breaker and timing guide",
      "Printable scorecard and team answer sheets",
    ],
    contents: ["Quiz Night Host Pack (PDF + editable Markdown)"],
    delivery: "Instant download after Paystack: printable PDF",
    downloadPath: "/digital-products/quiz-night-host-pack.md",
    demandNote: "Event planners, teachers and youth leaders need ready quiz questions for socials and end-of-year parties.",
    addedAt: "2026-11-02",
  },
  {
    id: "primary-maths-practice-workbook",
    name: "Primary Maths Practice Workbook (Ages 5–11)",
    description:
      "40 printable maths worksheets that build up step by step, from number bonds to times tables, division, fractions, money in naira and word problems, with a full answer key and progress tracker.",
    priceUsd: "$5",
    priceNgn: "₦3,500",
    amountKobo: 350000,
    type: "one-time",
    badge: "New",
    category: "Kids & parents",
    audience: "Parents, home tutors and primary school teachers",
    features: [
      "40 graded worksheets (20 questions each, 10 for word problems)",
      "Number bonds, adding, taking away, times tables and division",
      "Fractions of amounts and money in naira",
      "Word problems with everyday Nigerian names and items",
      "Full answer key for quick marking",
      "Progress tracker and how-to-use guide for parents",
    ],
    contents: ["Primary Maths Practice Workbook (PDF + editable Markdown)"],
    delivery: "Instant download after Paystack: printable PDF",
    downloadPath: "/digital-products/primary-maths-practice-workbook.md",
    demandNote: "Parents want structured practice at home, especially in the holidays and before entrance exams.",
    addedAt: "2026-11-02",
  },
  {
    id: "kids-routine-reward-holiday-pack",
    name: "Kids Routine, Reward Chart & Holiday Fun Pack",
    description:
      "Morning and evening routine charts, chores by age, a star reward chart, screen time agreement, reading log, a four-week holiday plan, 50 rainy-day ideas and a pocket money tracker.",
    priceUsd: "$4",
    priceNgn: "₦2,500",
    amountKobo: 250000,
    type: "one-time",
    badge: "New",
    category: "Kids & parents",
    audience: "Parents of children aged 4–12",
    features: [
      "Morning and after-school routine charts",
      "Chores by age (4 to 12) and a weekly chore chart",
      "Star reward chart with ideas that work",
      "Screen time and online safety agreement to sign together",
      "Reading log and four-week holiday plan",
      "50 rainy-day boredom busters and a pocket money tracker",
    ],
    contents: ["Routine, reward and holiday pack (PDF + editable Markdown)"],
    delivery: "Instant download after Paystack: printable PDF",
    downloadPath: "/digital-products/kids-routine-reward-holiday-pack.md",
    demandNote: "Busy parents look for ready-made charts every school term and holiday.",
    addedAt: "2026-11-02",
  },
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
