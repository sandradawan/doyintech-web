/** Central config — edit WhatsApp, email, Academy URL, brand here */
export const TOOLS_CONFIG = {
  brand: "DoyinTech",
  siteUrl: "https://www.doyintech.com",
  academyUrl: "https://doyintechacademy.vercel.app",
  email: "doyintechnology@outlook.com",
  whatsappNumber: "2348085343926",
  phoneDisplay: "+234 808 534 3926",
  currency: "NGN" as const,
  currencySymbol: "NGN",
} as const;

export function whatsappUrl(message: string) {
  return `https://wa.me/${TOOLS_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export type ToolMeta = {
  slug: string;
  href: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  category:
    | "core"
    | "business"
    | "career"
    | "ai"
    | "utility"
    | "security"
    | "paid"
    | "markets";
  paid?: boolean;
  priceNgn?: number;
  badge?: string;
};

export const TOOLS_META: ToolMeta[] = [
  { slug: "paye-calculator-nigeria", href: "/tools/paye-calculator-nigeria", title: "PAYE Calculator Nigeria 2026", short: "New tax bands", description: "Monthly PAYE and take-home pay under the Nigeria Tax Act 2025, with rent relief and pension.", icon: "calculator", category: "business", badge: "New 2026" },
  { slug: "solar-vs-generator-calculator", href: "/tools/solar-vs-generator-calculator", title: "Solar vs Generator Calculator", short: "Cut fuel costs", description: "Your monthly generator cost, the solar system to replace it, payback and 5-year savings.", icon: "calculator", category: "business", badge: "New" },
  { slug: "cash-flow-forecast", href: "/tools/cash-flow-forecast", title: "13-Week Cash Flow Forecast", short: "See cash gaps early", description: "Weekly cash in, cash out and closing balance for 13 weeks; spot the week cash runs out.", icon: "calculator", category: "business", badge: "New" },
  { slug: "import-duty-calculator-nigeria", href: "/tools/import-duty-calculator-nigeria", title: "Import Duty Calculator Nigeria", short: "Landed cost", description: "Customs duty, surcharge, ETLS, CISS, VAT and landed cost per unit for your imports.", icon: "calculator", category: "business", badge: "New" },
  { slug: "employee-cost-calculator-nigeria", href: "/tools/employee-cost-calculator-nigeria", title: "True Cost of an Employee", short: "Pension, NSITF, ITF", description: "Full yearly cost of a hire: salary, 13th month, pension, NSITF, ITF, HMO and group life.", icon: "calculator", category: "business", badge: "New" },
  { slug: "compliance-calendar-nigeria", href: "/tools/compliance-calendar-nigeria", title: "Compliance Calendar Nigeria", short: "PAYE, VAT, CAC dates", description: "Your PAYE, pension, VAT, WHT, CIT, ITF and CAC deadlines for 12 months; add to Google Calendar.", icon: "check", category: "business", badge: "New" },
  { slug: "bid-evaluation-tool", href: "/tools/bid-evaluation-tool", title: "Bid Evaluation Tool", short: "Tender scoring", description: "Score tenders with weighted criteria, pass mark and QCBS; download a signed evaluation report.", icon: "check", category: "business", badge: "New" },
  { slug: "invoice-generator-nigeria", href: "/tools/invoice-generator-nigeria", title: "Invoice Generator", short: "Free invoice PDF", description: "Naira invoices with VAT, bank details and due date. Free PDF; branded upgrade.", icon: "invoice", category: "core", badge: "Popular" },
  { slug: "receipt-generator-nigeria", href: "/tools/receipt-generator-nigeria", title: "Receipt Generator", short: "Payment receipts", description: "Payment receipts in naira for sales, services, rent and fees. Free PDF.", icon: "invoice", category: "core" },
  { slug: "freelancer-tax-calculator-nigeria", href: "/tools/freelancer-tax-calculator-nigeria", title: "Freelancer Tax Calculator", short: "2027 filing", description: "Income tax on freelance and self-employed income, with the 31 March deadline countdown.", icon: "calculator", category: "business", badge: "New 2026" },
  { slug: "small-company-tax-checker", href: "/tools/small-company-tax-checker", title: "Small Company Tax Checker 2026", short: "0% company tax?", description: "Check if your company qualifies as a small company under the Nigeria Tax Act 2025.", icon: "calculator", category: "business", badge: "New 2026" },
  { slug: "quotation-generator-nigeria", href: "/tools/quotation-generator-nigeria", title: "Quotation Generator", short: "Price quotes PDF", description: "Naira quotations with VAT and validity date. Free PDF; converts to an invoice.", icon: "invoice", category: "core", badge: "New" },
  { slug: "proforma-invoice-generator-nigeria", href: "/tools/proforma-invoice-generator-nigeria", title: "Proforma Invoice Generator", short: "Advance payment", description: "Proforma invoices for advance payment, approvals and import paperwork. Free PDF.", icon: "invoice", category: "core", badge: "New" },
  { slug: "cgpa-calculator", href: "/tools/cgpa-calculator", title: "CGPA Calculator Nigeria", short: "5.0 and 4.0 scale", description: "GPA, CGPA and degree class for universities and polytechnics, plus the GPA you need.", icon: "calculator", category: "utility", badge: "New" },
  { slug: "letter-generator", href: "/tools/letter-generator", title: "Letter Generator", short: "Formal letters PDF", description: "Job application, resignation, leave and SIWES letters in the Nigerian format.", icon: "text", category: "core", badge: "New" },
  { slug: "payslip-generator-nigeria", href: "/tools/payslip-generator-nigeria", title: "Payslip Generator", short: "PAYE + pension", description: "Staff payslips with 2026 PAYE, pension, NHF and loan deductions. Free PDF.", icon: "invoice", category: "business", badge: "New" },
  { slug: "purchase-order-generator", href: "/tools/purchase-order-generator", title: "Purchase Order Generator", short: "Supplier POs", description: "Purchase orders with items, VAT and delivery date for suppliers. Free PDF.", icon: "invoice", category: "core", badge: "New" },
  { slug: "business-plan-generator", href: "/tools/business-plan-generator", title: "Business Plan Generator", short: "Plan + financials", description: "Business plan for loans and grants with start-up costs, break-even and payback.", icon: "proposal", category: "business", badge: "New" },
  { slug: "meeting-minutes-generator", href: "/tools/meeting-minutes-generator", title: "Meeting Minutes Generator", short: "Board & team minutes", description: "Formal or simple minutes with resolutions, action items and signature lines.", icon: "text", category: "core", badge: "New" },
  { slug: "certificate-generator", href: "/tools/certificate-generator", title: "Certificate Generator", short: "Bulk certificates", description: "Completion, participation and award certificates; paste names to print one each.", icon: "check", category: "core", badge: "New" },
  { slug: "id-card-generator", href: "/tools/id-card-generator", title: "ID Card Generator", short: "Staff & student IDs", description: "Staff, student and member ID cards with photo, eight per A4 sheet.", icon: "cv", category: "core", badge: "New" },
  { slug: "timesheet-calculator", href: "/tools/timesheet-calculator", title: "Timesheet Calculator", short: "Hours + overtime", description: "Weekly hours worked, overtime and pay, with a printable signed timesheet.", icon: "calculator", category: "business", badge: "New" },
  { slug: "aggregate-score-calculator", href: "/tools/aggregate-score-calculator", title: "Aggregate Score Calculator", short: "JAMB + Post-UTME", description: "Admission aggregate from JAMB, Post-UTME and O'level grades.", icon: "calculator", category: "utility", badge: "New" },
  { slug: "study-timetable-planner", href: "/tools/study-timetable-planner", title: "Study Timetable Planner", short: "Reading timetable", description: "Weekly reading timetable weighted by course difficulty and exam dates.", icon: "check", category: "utility", badge: "New" },
  { slug: "qr-generator", href: "/tools/qr-generator", title: "QR Code Generator", short: "WhatsApp, Wi-Fi, logo", description: "QR codes for links, WhatsApp, Wi-Fi and contact cards. PNG and SVG; add your logo.", icon: "qr", category: "core", badge: "Popular" },
  { slug: "password-generator", href: "/tools/password-generator", title: "Password Generator", short: "Strong passwords", description: "Generate strong random passwords in your browser.", icon: "shield", category: "utility" },
  { slug: "pomodoro-timer", href: "/tools/pomodoro-timer", title: "Pomodoro Focus Timer", short: "Focus + streak", description: "Focus sessions with a daily streak saved on this device.", icon: "calculator", category: "utility", badge: "Daily" },
  { slug: "daily-checklist", href: "/tools/daily-checklist", title: "Daily Checklist", short: "Tasks today", description: "Checklist saved in your browser — come back anytime.", icon: "check", category: "utility", badge: "Daily" },
  { slug: "savings-goal-tracker", href: "/tools/savings-goal-tracker", title: "Savings Goal Tracker", short: "Track savings", description: "Savings goal progress saved in your browser.", icon: "calculator", category: "business", badge: "Daily" },
  { slug: "note-pad", href: "/tools/note-pad", title: "Note Pad", short: "Local notes", description: "Browser notepad that auto-saves on this device.", icon: "text", category: "utility" },
  { slug: "countdown-timer", href: "/tools/countdown-timer", title: "Countdown Timer", short: "Event clock", description: "Countdown to a launch or deadline — saved locally.", icon: "calculator", category: "utility" },
  { slug: "business-name-generator", href: "/tools/business-name-generator", title: "Business Name Generator", short: "Name ideas", description: "Generate brandable business names from a keyword.", icon: "proposal", category: "business", badge: "Popular" },
  { slug: "meeting-cost-calculator", href: "/tools/meeting-cost-calculator", title: "Meeting Cost Calculator", short: "Meeting cost", description: "Estimate meeting cost from people, rate, and time.", icon: "calculator", category: "business" },
  { slug: "random-picker", href: "/tools/random-picker", title: "Random Decision Picker", short: "Spin a choice", description: "List options and pick one at random.", icon: "ideas", category: "utility" },
  { slug: "cv-builder", href: "/tools/cv-builder", title: "CV Builder", short: "Build your CV", description: "Create a clean curriculum vitae step by step.", icon: "cv", category: "career" },
  { slug: "salary-calculator", href: "/tools/salary-calculator", title: "Salary Calculator", short: "Naira salary estimate", description: "Estimate take-home and role salary ranges.", icon: "calculator", category: "career" },
  { slug: "website-calculator", href: "/tools/website-calculator", title: "Website Cost Calculator", short: "Project estimates", description: "Estimate website cost by pages and features.", icon: "calculator", category: "core" },
  { slug: "digital-readiness", href: "/tools/digital-readiness", title: "Digital Readiness Score", short: "SME online score", description: "Score how ready your business is to sell online.", icon: "readiness", category: "core" },
  { slug: "whatsapp-link-generator", href: "/tools/whatsapp-link-generator", title: "WhatsApp Link Generator", short: "wa.me links", description: "Create WhatsApp click-to-chat links with a pre-filled message.", icon: "wa", category: "utility", badge: "Popular" },
  { slug: "hourly-to-salary-calculator", href: "/tools/hourly-to-salary-calculator", title: "Hourly to Salary Calculator", short: "Hourly, monthly, yearly", description: "Convert hourly pay to a yearly salary and back, in any currency and working pattern.", icon: "calculator", category: "business", badge: "New" },
  { slug: "freelance-rate-calculator", href: "/tools/freelance-rate-calculator", title: "Freelance Rate Calculator", short: "What to charge", description: "The hourly and day rate you need after tax, costs and time off.", icon: "calculator", category: "business", badge: "New" },
  { slug: "discount-calculator", href: "/tools/discount-calculator", title: "Discount Calculator", short: "Sale price and savings", description: "Sale price from percent off, stacked discounts, or the original price from a sale price.", icon: "calculator", category: "business", badge: "New" },
  { slug: "late-payment-interest-calculator", href: "/tools/late-payment-interest-calculator", title: "Late Payment Interest Calculator", short: "Interest on unpaid invoices", description: "Interest and compensation on an overdue invoice: UK statutory rate or your contract rate.", icon: "invoice", category: "business", badge: "New" },
  { slug: "profit-margin-calculator", href: "/tools/profit-margin-calculator", title: "Profit Margin Calculator", short: "Margin and markup", description: "Margin and markup from cost and price, or the price for a target margin. Any currency.", icon: "calculator", category: "business", badge: "Popular" },
  { slug: "nigeria-vat-calculator", href: "/tools/nigeria-vat-calculator", title: "Nigeria VAT Calculator", short: "7.5% VAT", description: "Add or extract 7.5% Nigeria VAT from any amount.", icon: "calculator", category: "business", badge: "Popular" },
  { slug: "word-counter", href: "/tools/word-counter", title: "Word Counter", short: "Words and characters", description: "Count words, characters, sentences, and reading time.", icon: "text", category: "utility", badge: "Popular" },
  { slug: "meta-tag-generator", href: "/tools/meta-tag-generator", title: "SEO Meta Tag Generator", short: "Title and description", description: "Write SEO titles and meta descriptions with Google-style preview.", icon: "seo", category: "utility", badge: "SEO" },
  { slug: "loan-emi-calculator", href: "/tools/loan-emi-calculator", title: "Loan Repayment Calculator", short: "Monthly repayment", description: "Monthly payment, total interest and yearly balance for any loan, in any currency.", icon: "calculator", category: "business" },
  { slug: "break-even-calculator", href: "/tools/break-even-calculator", title: "Break-Even Calculator", short: "Units to profit", description: "Units and sales needed to cover costs or hit a profit target. Any currency.", icon: "calculator", category: "business" },
  { slug: "percentage-calculator", href: "/tools/percentage-calculator", title: "Percentage Calculator", short: "% of / change", description: "What is X% of Y, percent of, and percent change.", icon: "calculator", category: "utility" },
  { slug: "case-converter", href: "/tools/case-converter", title: "Case Converter", short: "UPPER / lower", description: "Convert text to uppercase, lowercase, title, or sentence case.", icon: "text", category: "utility" },
  { slug: "url-encoder", href: "/tools/url-encoder", title: "URL Encoder / Decoder", short: "Encode URLs", description: "Encode or decode URL strings for links and APIs.", icon: "text", category: "utility" },
  { slug: "business-audit", href: "/tools/business-audit", title: "Business Audit", short: "Growth gaps", description: "Structured audit for marketing, ops, and digital presence.", icon: "audit", category: "business" },
  { slug: "proposal-builder", href: "/tools/proposal-builder", title: "Proposal Builder", short: "Client proposals", description: "Draft professional project proposals fast.", icon: "proposal", category: "business" },
  { slug: "roi-calculator", href: "/tools/roi-calculator", title: "ROI Calculator", short: "Return on spend", description: "Estimate return on marketing or project investment.", icon: "calculator", category: "business" },
  { slug: "whatsapp-scripts", href: "/tools/whatsapp-scripts", title: "WhatsApp Scripts", short: "Reply templates", description: "Ready scripts for customer chats.", icon: "wa", category: "business" },
  { slug: "email-signature", href: "/tools/email-signature", title: "Email Signature Generator", short: "HTML signature", description: "Build a simple professional email signature.", icon: "email", category: "business" },
  { slug: "project-brief", href: "/tools/project-brief", title: "Project Brief Builder", short: "Scope brief", description: "Capture client brief before you quote.", icon: "proposal", category: "business" },
  { slug: "cover-letter", href: "/tools/cover-letter", title: "Cover Letter Generator", short: "Job applications", description: "Draft a cover letter for your target role.", icon: "cv", category: "career" },
  { slug: "interview-practice", href: "/tools/interview-practice", title: "Interview Practice", short: "Tech questions", description: "Practice common interview questions.", icon: "interview", category: "career" },
  { slug: "skill-gap", href: "/tools/skill-gap", title: "Skill Gap Checker", short: "Learn path", description: "See skills to learn for a target role.", icon: "skill", category: "career" },
  { slug: "security-scanner", href: "/tools/security-scanner", title: "Security Scanner", short: "Website checks", description: "Passive security checks for your site.", icon: "shield", category: "security" },
  { slug: "ssl-checker", href: "/tools/ssl-checker", title: "SSL Checker", short: "HTTPS status", description: "Check SSL/HTTPS configuration guidance.", icon: "shield", category: "security" },
  { slug: "sme-security-checklist", href: "/tools/sme-security-checklist", title: "SME Security Checklist", short: "Business hygiene", description: "Practical security checklist for small teams.", icon: "shield", category: "security" },
  { slug: "pixel-audit", href: "/tools/pixel-audit", title: "Meta Pixel Audit", short: "Pixel scan", description: "Audit a public URL for Meta Pixel signals.", icon: "seo", category: "security" },
  { slug: "text-cleaner", href: "/tools/text-cleaner", title: "Text Cleaner", short: "Clean messy text", description: "Trim spaces and normalize text for WhatsApp and email.", icon: "text", category: "utility" },
  { slug: "ai-copy", href: "/tools/ai-copy", title: "AI Business Copy Suite", short: "Ads WhatsApp email", description: "Generate business copy packs with AI. One-time unlock.", icon: "ai", category: "ai", paid: true, priceNgn: 4500, badge: "AI" },
  { slug: "ai-sop-writer", href: "/tools/ai-sop-writer", title: "AI SOP Writer", short: "Process documents", description: "Generate standard operating procedures with AI.", icon: "ai", category: "ai", paid: true, priceNgn: 5000, badge: "AI" },
  { slug: "ai-social-calendar", href: "/tools/ai-social-calendar", title: "AI Social Calendar", short: "Content plan", description: "AI-planned content calendar for Status and social.", icon: "ai", category: "ai", paid: true, priceNgn: 5500, badge: "AI" },
  { slug: "ai-product-copy", href: "/tools/ai-product-copy", title: "AI Product Copy", short: "Landing and ads", description: "Product descriptions and pitches via AI.", icon: "ai", category: "ai", paid: true, priceNgn: 4500, badge: "AI" },
  { slug: "ai-job-desc", href: "/tools/ai-job-desc", title: "AI Job Descriptions", short: "Hiring JDs", description: "Write clear job descriptions with AI.", icon: "ai", category: "ai", paid: true, priceNgn: 4000, badge: "AI" },
  { slug: "ai-meeting-actions", href: "/tools/ai-meeting-actions", title: "AI Meeting Actions", short: "Notes to tasks", description: "Turn meeting notes into action items.", icon: "ai", category: "ai", paid: true, priceNgn: 4500, badge: "AI" },
  { slug: "ai-faq-pack", href: "/tools/ai-faq-pack", title: "AI FAQ Pack", short: "Sales answers", description: "FAQ and objection handlers with AI.", icon: "ai", category: "ai", paid: true, priceNgn: 4000, badge: "AI" },
  { slug: "ai-content-repurpose", href: "/tools/ai-content-repurpose", title: "AI Content Repurposer", short: "One to many", description: "Repurpose long content into posts and scripts.", icon: "ai", category: "ai", paid: true, priceNgn: 5000, badge: "AI" },
  { slug: "pdf-studio", href: "/tools/pdf-studio", title: "PDF Studio", short: "Letters and reports", description: "Letters, quotes, reports to PDF — one-time unlock.", icon: "invoice", category: "paid", paid: true, priceNgn: 5000 },
  { slug: "whatsapp-builder", href: "/tools/whatsapp-builder", title: "WhatsApp Auto-Reply Builder", short: "Scripts and flows", description: "Build WhatsApp auto-reply scripts. Pay to unlock full pack.", icon: "wa", category: "paid", paid: true, priceNgn: 5000 },
  { slug: "seo-audit", href: "/tools/seo-audit", title: "SEO Meta Audit", short: "SEO report", description: "SEO checklist report — pay to export.", icon: "seo", category: "paid", paid: true, priceNgn: 5000 },
];

export const TOOL_CATEGORIES: { id: ToolMeta["category"]; label: string }[] = [
  { id: "core", label: "Core tools" },
  { id: "business", label: "Business" },
  { id: "career", label: "Career" },
  { id: "ai", label: "AI" },
  { id: "security", label: "Security" },
  { id: "utility", label: "Quick utilities" },
  { id: "paid", label: "Paid tools" },
  { id: "markets", label: "Markets" },
];

export const TOOLS_PER_PAGE = 12;

/** Who a tool is for; drives the "For business / students / offices / organisations" filter on /tools (?for=). */
export const TOOL_AUDIENCES: { id: string; label: string; slugs: string[] }[] = [
  {
    id: "business",
    label: "For business owners",
    slugs: ["cash-flow-forecast", "solar-vs-generator-calculator", "import-duty-calculator-nigeria", "employee-cost-calculator-nigeria", "compliance-calendar-nigeria", "invoice-generator-nigeria", "receipt-generator-nigeria", "quotation-generator-nigeria", "proforma-invoice-generator-nigeria", "purchase-order-generator", "business-plan-generator", "nigeria-vat-calculator", "profit-margin-calculator", "break-even-calculator", "small-company-tax-checker", "freelancer-tax-calculator-nigeria", "business-name-generator", "whatsapp-link-generator", "qr-generator", "roi-calculator", "loan-emi-calculator"],
  },
  {
    id: "students",
    label: "For students",
    slugs: ["cgpa-calculator", "aggregate-score-calculator", "study-timetable-planner", "letter-generator", "cv-builder", "cover-letter", "pomodoro-timer", "word-counter", "interview-practice", "skill-gap", "percentage-calculator", "note-pad"],
  },
  {
    id: "office",
    label: "For offices & HR",
    slugs: ["payslip-generator-nigeria", "paye-calculator-nigeria", "employee-cost-calculator-nigeria", "compliance-calendar-nigeria", "timesheet-calculator", "meeting-minutes-generator", "letter-generator", "id-card-generator", "offer-letter", "salary-calculator", "meeting-cost-calculator", "email-signature", "pdf-studio", "ai-job-desc", "ai-meeting-actions", "ai-sop-writer"],
  },
  {
    id: "organisations",
    label: "For schools, churches & NGOs",
    slugs: ["certificate-generator", "id-card-generator", "meeting-minutes-generator", "bid-evaluation-tool", "cash-flow-forecast", "solar-vs-generator-calculator", "dues-receipt", "receipt-generator-nigeria", "business-plan-generator", "qr-generator", "countdown-timer", "random-picker", "email-signature"],
  },
  {
    id: "government",
    label: "For government & procurement",
    slugs: ["bid-evaluation-tool", "compliance-calendar-nigeria", "meeting-minutes-generator", "purchase-order-generator", "solar-vs-generator-calculator", "cash-flow-forecast", "employee-cost-calculator-nigeria", "letter-generator", "certificate-generator", "id-card-generator", "payslip-generator-nigeria"],
  },
];
