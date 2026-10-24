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
  { slug: "invoice-generator-nigeria", href: "/tools/invoice-generator-nigeria", title: "Invoice Generator", short: "Free invoice PDF", description: "Naira invoices with VAT, bank details and due date. Free PDF; branded upgrade.", icon: "invoice", category: "core", badge: "Popular" },
  { slug: "receipt-generator-nigeria", href: "/tools/receipt-generator-nigeria", title: "Receipt Generator", short: "Payment receipts", description: "Payment receipts in naira for sales, services, rent and fees. Free PDF.", icon: "invoice", category: "core" },
  { slug: "freelancer-tax-calculator-nigeria", href: "/tools/freelancer-tax-calculator-nigeria", title: "Freelancer Tax Calculator", short: "2027 filing", description: "Income tax on freelance and self-employed income, with the 31 March deadline countdown.", icon: "calculator", category: "business", badge: "New 2026" },
  { slug: "small-company-tax-checker", href: "/tools/small-company-tax-checker", title: "Small Company Tax Checker 2026", short: "0% company tax?", description: "Check if your company qualifies as a small company under the Nigeria Tax Act 2025.", icon: "calculator", category: "business", badge: "New 2026" },
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
  { slug: "profit-margin-calculator", href: "/tools/profit-margin-calculator", title: "Profit Margin Calculator", short: "Margin and markup", description: "Calculate profit, margin %, and markup from cost and price.", icon: "calculator", category: "business", badge: "Popular" },
  { slug: "nigeria-vat-calculator", href: "/tools/nigeria-vat-calculator", title: "Nigeria VAT Calculator", short: "7.5% VAT", description: "Add or extract 7.5% Nigeria VAT from any amount.", icon: "calculator", category: "business", badge: "Popular" },
  { slug: "word-counter", href: "/tools/word-counter", title: "Word Counter", short: "Words and characters", description: "Count words, characters, sentences, and reading time.", icon: "text", category: "utility", badge: "Popular" },
  { slug: "meta-tag-generator", href: "/tools/meta-tag-generator", title: "SEO Meta Tag Generator", short: "Title and description", description: "Write SEO titles and meta descriptions with Google-style preview.", icon: "seo", category: "utility", badge: "SEO" },
  { slug: "loan-emi-calculator", href: "/tools/loan-emi-calculator", title: "Loan EMI Calculator", short: "Monthly repayment", description: "Estimate loan EMI from amount, rate, and tenure.", icon: "calculator", category: "business" },
  { slug: "break-even-calculator", href: "/tools/break-even-calculator", title: "Break-Even Calculator", short: "Units to profit", description: "Find how many units you must sell to cover fixed costs.", icon: "calculator", category: "business" },
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
