/**
 * The site's link structure, shared by the navbar mega menus and the footer so the two
 * never drift. Each menu is split into short, labelled sections.
 */

export type NavLink = { name: string; href: string; desc?: string };
export type NavSection = { title: string; links: NavLink[] };
export type NavGroup = { label: string; href: string; intro: string; cta: string; sections: NavSection[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Solutions",
    href: "/solutions",
    intro: "Websites, business software and AI automation, built for you at a fixed price.",
    cta: "All solutions",
    sections: [
      {
        title: "Websites",
        links: [
          { name: "Packages & pricing", href: "/hire", desc: "From ₦100,000 · 50% deposit" },
          { name: "Websites by industry", href: "/websites", desc: "Schools, clinics, churches, hotels" },
          { name: "Online shops", href: "/ecommerce-website-nigeria", desc: "Sell online with Paystack" },
          { name: "What a website costs", href: "/website-cost-nigeria", desc: "2026 price guide" },
          { name: "Our work", href: "/case-studies", desc: "Case studies & results" },
        ],
      },
      {
        title: "Software & automation",
        links: [
          { name: "AI Assistant", href: "/ai-assistant", desc: "Answers customers, takes bookings" },
          { name: "Hotel & booking systems", href: "/hotel-booking-website-nigeria", desc: "Rooms, payments, WhatsApp" },
          { name: "School management software", href: "/school-management-software-nigeria", desc: "Results, fees, parents portal" },
          { name: "Property management", href: "/solutions#property", desc: "Tenants, rent, agents" },
          { name: "Custom apps & CRMs", href: "/services", desc: "Backend, mobile, APIs" },
        ],
      },
      {
        title: "Keep growing",
        links: [
          { name: "Website care plans", href: "/care-plans", desc: "From ₦50,000 a month" },
          { name: "Free website audit", href: "/free-audit", desc: "2–3 fixes in your inbox" },
          { name: "Get on Google Maps", href: "/google-business-profile-setup", desc: "Business profile setup" },
          { name: "Domain & business email", href: "/business-email-domain-nigeria", desc: "you@yourbusiness.com" },
          { name: "CAC business name registration", href: "/business-name-registration-nigeria" },
          { name: "White-label for agencies", href: "/white-label" },
        ],
      },
    ],
  },
  {
    label: "Cloud",
    href: "/cloud",
    intro: "Software you subscribe to: run your business and unlock every premium tool.",
    cta: "See Cloud",
    sections: [
      {
        title: "Subscriptions",
        links: [
          { name: "DoyinOps", href: "/ops", desc: "Clients, deals, invoices, tasks" },
          { name: "DoyinTech Pro", href: "/pro", desc: "₦5,000/month · every premium tool" },
          { name: "AI Assistant plans", href: "/ai-assistant", desc: "From ₦25,000/month" },
        ],
      },
      {
        title: "For clients",
        links: [
          { name: "Client portal", href: "/client-portal", desc: "Track your project and payments" },
          { name: "Report Studio", href: "/reports", desc: "Brand & social presence reports" },
          { name: "Your account", href: "/account" },
        ],
      },
    ],
  },
  {
    label: "Digital",
    href: "/digital",
    intro: "Templates, ebooks, code and training. Pay once and download straight away.",
    cta: "See Digital",
    sections: [
      {
        title: "Buy",
        links: [
          { name: "Templates & kits", href: "/products", desc: "HR, payroll, office, school packs" },
          { name: "Ebooks", href: "/ebooks", desc: "Business, Excel, bookkeeping" },
          { name: "Gift cards", href: "/gift-cards", desc: "Give tools, templates or a website" },
        ],
      },
      {
        title: "For developers",
        links: [
          { name: "Website templates", href: "/templates", desc: "Ready-made Next.js pages" },
          { name: "UI components", href: "/components", desc: "Next.js + Tailwind blocks" },
          { name: "Sell your code", href: "/sell", desc: "Join the Developer Market" },
          { name: "DoyinTech Academy", href: "https://doyintechacademy.vercel.app", desc: "Courses & mentorship" },
        ],
      },
      {
        title: "Sell online",
        links: [
          { name: "Free online shop", href: "/stores", desc: "Sell on WhatsApp with one link" },
          { name: "Browse shops", href: "/shops", desc: "Buy from small businesses" },
          { name: "Get paid online", href: "/get-paid", desc: "Payment links + reminders" },
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
          { name: "All free tools", href: "/tools", desc: "Business & website tools" },
          { name: "Office & HR tools", href: "/tools?for=office", desc: "Minutes, ID cards, timesheets" },
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
