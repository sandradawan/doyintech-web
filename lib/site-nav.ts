/**
 * The site's link structure, shared by the navbar mega menus and the footer so the two
 * never drift. Each menu is split into short, labelled sections.
 */

export type NavLink = { name: string; href: string; desc?: string };
export type NavSection = { title: string; links: NavLink[] };
export type NavGroup = { label: string; href: string; intro: string; cta: string; sections: NavSection[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Websites",
    href: "/hire",
    intro: "Fixed-price websites and systems that bring in enquiries, live in 1–2 weeks.",
    cta: "See packages",
    sections: [
      {
        title: "Get a website",
        links: [
          { name: "Packages & pricing", href: "/hire", desc: "Fixed price · 50% deposit" },
          { name: "Websites by industry", href: "/websites", desc: "Schools, clinics, churches, hotels" },
          { name: "Ecommerce websites", href: "/ecommerce-website-nigeria", desc: "Sell online with Paystack" },
          { name: "School management software", href: "/school-management-software-nigeria", desc: "Results, fees, parents portal" },
          { name: "Hotel booking websites", href: "/hotel-booking-website-nigeria", desc: "Rooms, payments, WhatsApp" },
        ],
      },
      {
        title: "Grow your business",
        links: [
          { name: "Website care plans", href: "/care-plans", desc: "Monthly security & updates" },
          { name: "Free website audit", href: "/free-audit", desc: "2–3 fixes in your inbox" },
          { name: "Get on Google Maps", href: "/google-business-profile-setup", desc: "Business profile setup" },
          { name: "Domain & business email", href: "/business-email-domain-nigeria", desc: "you@yourbusiness.com" },
          { name: "CAC business name registration", href: "/business-name-registration-nigeria", desc: "Register without the stress" },
        ],
      },
      {
        title: "Learn more",
        links: [
          { name: "Our work", href: "/case-studies", desc: "Case studies & results" },
          { name: "What a website costs", href: "/website-cost-nigeria", desc: "2026 price guide" },
          { name: "Services", href: "/services", desc: "Backend, mobile, AI automation" },
          { name: "Web design Lagos", href: "/web-design-lagos" },
          { name: "White-label for agencies", href: "/white-label" },
        ],
      },
    ],
  },
  {
    label: "Shop",
    href: "/shops",
    intro: "Buy from small businesses, or open your own free shop and get paid online.",
    cta: "Browse shops",
    sections: [
      {
        title: "Buy",
        links: [
          { name: "Browse shops", href: "/shops", desc: "Buy from small businesses" },
          { name: "Templates & kits", href: "/products", desc: "HR, payroll, office, school packs" },
          { name: "Ebooks", href: "/ebooks", desc: "Business, Excel, bookkeeping" },
          { name: "Gift cards", href: "/gift-cards", desc: "Give tools, templates or a website" },
          { name: "Report Studio", href: "/reports", desc: "Social & brand presence reports" },
        ],
      },
      {
        title: "Sell",
        links: [
          { name: "Free online shop", href: "/stores", desc: "Sell on WhatsApp with one link" },
          { name: "Get paid online", href: "/get-paid", desc: "Payment links + reminders" },
          { name: "Feature your shop", href: "/get-featured", desc: "Be seen by more buyers" },
        ],
      },
      {
        title: "For developers",
        links: [
          { name: "UI components", href: "/components", desc: "Next.js + Tailwind blocks" },
          { name: "Page templates", href: "/templates", desc: "Ready-made landing pages" },
        ],
      },
    ],
  },
  {
    label: "Tools",
    href: "/tools",
    intro: "Free invoicing, tax, payroll and planning tools for businesses everywhere.",
    cta: "All free tools",
    sections: [
      {
        title: "Invoicing & payments",
        links: [
          { name: "Invoice generator (₦)", href: "/tools/invoice-generator-nigeria", desc: "Free naira invoices as PDF" },
          { name: "Invoice generator (any currency)", href: "/tools/invoice-generator", desc: "73 currencies with VAT/GST" },
          { name: "Receipt generator", href: "/tools/receipt-generator-nigeria" },
          { name: "VAT & GST calculators", href: "/vat-calculator", desc: "Rates for 90+ countries" },
          { name: "Get paid online", href: "/get-paid", desc: "Payment links on invoices" },
          { name: "Late payment interest", href: "/tools/late-payment-interest-calculator", desc: "Interest on overdue invoices" },
        ],
      },
      {
        title: "Tax & payroll",
        links: [
          { name: "PAYE calculator 2026", href: "/tools/paye-calculator-nigeria", desc: "New tax bands & take-home pay" },
          { name: "Salary calculators", href: "/salary-calculator", desc: "Take-home pay: UK, US, India, more" },
          { name: "Hourly to salary", href: "/tools/hourly-to-salary-calculator" },
          { name: "Payslip generator", href: "/tools/payslip-generator-nigeria" },
          { name: "Small company tax checker", href: "/tools/small-company-tax-checker" },
          { name: "Compliance calendar", href: "/tools/compliance-calendar-nigeria", desc: "PAYE, VAT, CAC deadlines" },
          { name: "E-invoicing deadlines", href: "/e-invoicing-nigeria" },
        ],
      },
      {
        title: "Plan & run",
        links: [
          { name: "Business problem solver", href: "/business-solutions", desc: "Power, cash flow, procurement" },
          { name: "Freelance rate calculator", href: "/tools/freelance-rate-calculator", desc: "What to charge per hour or day" },
          { name: "Profit margin calculator", href: "/tools/profit-margin-calculator", desc: "Margin, markup and pricing" },
          { name: "Break-even calculator", href: "/tools/break-even-calculator" },
          { name: "Loan repayment calculator", href: "/tools/loan-emi-calculator" },
          { name: "Discount calculator", href: "/tools/discount-calculator" },
          { name: "Cash flow forecast", href: "/tools/cash-flow-forecast" },
          { name: "Solar vs generator", href: "/tools/solar-vs-generator-calculator" },
          { name: "Import duty calculator", href: "/tools/import-duty-calculator-nigeria" },
          { name: "Bid evaluation tool", href: "/tools/bid-evaluation-tool" },
          { name: "Business plan generator", href: "/tools/business-plan-generator" },
        ],
      },
      {
        title: "Workspace",
        links: [
          { name: "Daily Money Quiz", href: "/daily-quiz", desc: "5 questions a day, keep your streak" },
          { name: "All free tools", href: "/tools", desc: "Business & website tools" },
          { name: "Office & HR tools", href: "/tools?for=office", desc: "Minutes, ID cards, timesheets" },
          { name: "DoyinTech Pro", href: "/pro", desc: "Every premium tool, one membership" },
          { name: "DoyinOps", href: "/ops", desc: "Clients, deals & invoices" },
        ],
      },
    ],
  },
  {
    label: "Students",
    href: "/students",
    intro: "Calculators, project templates and study tools for university students.",
    cta: "Student tools",
    sections: [
      {
        title: "Calculators",
        links: [
          { name: "CGPA calculator", href: "/tools/cgpa-calculator", desc: "5.0 and 4.0 scale" },
          { name: "JAMB aggregate calculator", href: "/tools/aggregate-score-calculator", desc: "JAMB + Post-UTME score" },
        ],
      },
      {
        title: "Projects & study",
        links: [
          { name: "Student tools", href: "/students", desc: "Outlines, citations, analysis" },
          { name: "Final year project kit", href: "/products/final-year-project-starter-kit", desc: "Chapters 1–5 templates" },
          { name: "Project support", href: "/students/projects", desc: "Guided research support" },
        ],
      },
    ],
  },
  {
    label: "Play",
    href: "/kids",
    intro: "Free games, daily puzzles and podcasts for the whole family: kids, teens and adults.",
    cta: "Open the Kids zone",
    sections: [
      {
        title: "Kids (ages 5–13)",
        links: [
          { name: "Daily challenge", href: "/kids/daily-challenge", desc: "New maths and word puzzles daily" },
          { name: "Times tables race", href: "/kids/times-tables", desc: "60-second multiplication game" },
          { name: "Memory match", href: "/kids/memory-game", desc: "Find the pairs" },
        ],
      },
      {
        title: "For everyone",
        links: [
          { name: "Community", href: "/community", desc: "Ask questions, share what you know" },
          { name: "Listen to podcasts", href: "/listen", desc: "Business, tech, ideas and kids' stories" },
          { name: "Daily trivia", href: "/trivia", desc: "10 questions a day, beat the clock" },
          { name: "Family quiz night", href: "/trivia/family-quiz-night", desc: "Pass-the-phone game for 2–6" },
          { name: "Daily Money Quiz", href: "/daily-quiz", desc: "5 questions on money and business" },
          { name: "Quiz Night Host Pack", href: "/products/quiz-night-host-pack", desc: "Printable rounds for events" },
        ],
      },
      {
        title: "For parents",
        links: [
          { name: "Printable maths worksheets", href: "/kids/maths-worksheets", desc: "Free, with answers" },
          { name: "Maths practice workbook", href: "/products/primary-maths-practice-workbook", desc: "40 sheets, ages 5–11" },
          { name: "Routine & reward chart pack", href: "/products/kids-routine-reward-holiday-pack", desc: "Charts and holiday plan" },
        ],
      },
    ],
  },
];

/** Footer-only section: company, help and legal pages that don't need menu space. */
export const COMPANY_SECTION: NavSection = {
  title: "Company",
  links: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "Reviews", href: "/reviews" },
    { name: "Refer & earn", href: "/refer" },
    { name: "Support", href: "/support" },
    { name: "Your account", href: "/account" },
  ],
};

export const LEGAL_LINKS: NavLink[] = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "All pages", href: "/all-pages" },
];
