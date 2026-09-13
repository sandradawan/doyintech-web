/** Central config — edit WhatsApp, email, Academy URL, brand here */
export const TOOLS_CONFIG = {
  brand: "DoyinTech",
  siteUrl: "https://doyintech.vercel.app",
  academyUrl: "https://doyintechacademy.vercel.app",
  email: "doyintechnology@outlook.com",
  whatsappNumber: "2348085343926",
  phoneDisplay: "+234 808 534 3926",
  currency: "NGN" as const,
  currencySymbol: "₦",
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
};

const PAID_TOOL_ENTRIES: ToolMeta[] = [
  { slug: "pdf-studio", href: "/tools/pdf-studio", title: "PDF Studio", short: "Letters, quotes & reports → PDF.", description: "Paid PDF automation.", icon: "pdf", category: "paid", paid: true },
  { slug: "whatsapp-builder", href: "/tools/whatsapp-builder", title: "WhatsApp Auto-Reply Builder", short: "Scripts & flows — pay to export.", description: "Paid WhatsApp script builder.", icon: "wa", category: "paid", paid: true },
  { slug: "branded-invoice", href: "/tools/branded-invoice", title: "Branded Invoice PDF", short: "Invoice PDF — pay to export.", description: "Paid branded invoice.", icon: "invoice", category: "paid", paid: true },
  { slug: "proposal-export", href: "/tools/proposal-export", title: "Proposal PDF Export", short: "Client proposal — pay to export.", description: "Paid proposal export.", icon: "proposal", category: "paid", paid: true },
  { slug: "contract-export", href: "/tools/contract-export", title: "Contract / NDA Export", short: "Agreement PDF — pay to export.", description: "Paid contract/NDA.", icon: "contract", category: "paid", paid: true },
  { slug: "security-report", href: "/tools/security-report", title: "Full Security PDF Report", short: "Detailed security report PDF.", description: "Paid security report.", icon: "shield", category: "paid", paid: true },
  { slug: "uptime-monitor", href: "/tools/uptime-monitor", title: "Uptime & SSL Monitor", short: "Domain monitor unlock.", description: "Paid uptime workflow.", icon: "orgsec", category: "paid", paid: true },
  { slug: "seo-audit", href: "/tools/seo-audit", title: "SEO Meta Audit Report", short: "SEO checklist export.", description: "Paid SEO audit.", icon: "audit", category: "paid", paid: true },
  { slug: "ai-copy", href: "/tools/ai-copy", title: "AI Business Copy Suite", short: "Ads & captions pack unlock.", description: "Paid AI copy suite.", icon: "ai", category: "paid", paid: true },
  { slug: "cv-premium", href: "/tools/cv-premium", title: "CV Premium Export", short: "Premium CV PDF unlock.", description: "Paid CV export.", icon: "cv", category: "paid", paid: true },
  { slug: "qr-pro", href: "/tools/qr-pro", title: "QR Pro + Landing", short: "Branded QR brief unlock.", description: "Paid QR pro.", icon: "qr", category: "paid", paid: true },
  { slug: "rent-receipt", href: "/tools/rent-receipt", title: "Rent / Fee Receipt", short: "Landlord receipt PDF.", description: "Paid rent receipt.", icon: "invoice", category: "paid", paid: true },
  { slug: "dues-receipt", href: "/tools/dues-receipt", title: "School / Church Dues Receipt", short: "Institution receipt PDF.", description: "Paid dues receipt.", icon: "invoice", category: "paid", paid: true },
  { slug: "offer-letter", href: "/tools/offer-letter", title: "Salary & Offer Letter", short: "Offer letter PDF unlock.", description: "Paid offer letter.", icon: "letter", category: "paid", paid: true },
  { slug: "hosting-export", href: "/tools/hosting-export", title: "Hosting Plan Export", short: "Hosting cost PDF unlock.", description: "Paid hosting export.", icon: "hosting", category: "paid", paid: true },
  { slug: "interview-pack", href: "/tools/interview-pack", title: "Tech Interview Pack", short: "Full question bank unlock.", description: "Paid interview pack.", icon: "interview", category: "paid", paid: true },
];

const MARKET_TOOLS: ToolMeta[] = [
  {
    slug: "position-risk",
    href: "/tools/position-risk",
    title: "Position Size & Risk Calculator",
    short: "Size trades by % of equity risked.",
    description: "Educational position sizing. Not financial advice.",
    icon: "calculator",
    category: "markets",
  },
  {
    slug: "paper-journal",
    href: "/tools/paper-journal",
    title: "Paper Trading Journal",
    short: "Log simulated trades & session stats.",
    description: "Paper trading journal. No real orders.",
    icon: "brief",
    category: "markets",
  },
  {
    slug: "signal-explainer",
    href: "/tools/signal-explainer",
    title: "Signal Explainer",
    short: "Learn MA stack readings (educational).",
    description: "Textbook MA examples only.",
    icon: "audit",
    category: "markets",
  },
  {
    slug: "trade-checklist",
    href: "/tools/trade-checklist",
    title: "Pre-Trade Checklist",
    short: "Discipline checklist before you trade.",
    description: "Risk hygiene checklist.",
    icon: "checklist",
    category: "markets",
  },
];

export const TOOLS_META: ToolMeta[] = [
  ...PAID_TOOL_ENTRIES,
  ...MARKET_TOOLS,
  { slug: "website-calculator", href: "/tools/website-calculator", title: "Website Price Calculator", short: "Estimate website project cost.", description: "Cost estimator.", icon: "calculator", category: "core" },
  { slug: "business-audit", href: "/tools/business-audit", title: "Business Audit Tool", short: "Digital business audit.", description: "Free audit.", icon: "audit", category: "core" },
  { slug: "org-security", href: "/tools/org-security", title: "Organization Security Dashboard", short: "Multi-domain monitoring.", description: "Org security.", icon: "orgsec", category: "security" },
  { slug: "security-scanner", href: "/tools/security-scanner", title: "Website Security Scanner", short: "Passive security scan.", description: "Scanner.", icon: "shield", category: "security" },
  { slug: "security-headers", href: "/tools/security-headers", title: "Security Headers Checker", short: "HTTP headers score.", description: "Headers.", icon: "headers", category: "security" },
  { slug: "ssl-checker", href: "/tools/ssl-checker", title: "SSL / TLS Checker", short: "Certificate report.", description: "SSL.", icon: "ssl", category: "security" },
  { slug: "exposed-files", href: "/tools/exposed-files", title: "Exposed Files Checker", short: "Sensitive path checks.", description: "Exposed files.", icon: "exposed", category: "security" },
  { slug: "cookie-auditor", href: "/tools/cookie-auditor", title: "Cookie Security Auditor", short: "Cookie flags audit.", description: "Cookies.", icon: "cookie", category: "security" },
  { slug: "csp-generator", href: "/tools/csp-generator", title: "CSP Generator", short: "Content-Security-Policy.", description: "CSP.", icon: "csp", category: "security" },
  { slug: "robots-auditor", href: "/tools/robots-auditor", title: "robots.txt Auditor", short: "Robots & sitemap.", description: "Robots.", icon: "robots", category: "security" },
  { slug: "mixed-content", href: "/tools/mixed-content", title: "Mixed Content Finder", short: "HTTP on HTTPS pages.", description: "Mixed content.", icon: "mixed", category: "security" },
  { slug: "redirect-inspector", href: "/tools/redirect-inspector", title: "Redirect Inspector", short: "Redirect chains.", description: "Redirects.", icon: "redirect", category: "security" },
  { slug: "sme-security-checklist", href: "/tools/sme-security-checklist", title: "SME Security Checklist", short: "SME security habits.", description: "Checklist.", icon: "checklist", category: "security" },
  { slug: "golive-checklist", href: "/tools/golive-checklist", title: "Go-Live Security Checklist", short: "Pre-launch gates.", description: "Go-live.", icon: "golive", category: "security" },
  { slug: "breach-hygiene", href: "/tools/breach-hygiene", title: "Breach Hygiene Guide", short: "If passwords leak.", description: "Breach.", icon: "breach", category: "security" },
  { slug: "dependency-risk", href: "/tools/dependency-risk", title: "Dependency Risk Explainer", short: "Why updates matter.", description: "Deps.", icon: "deps", category: "security" },
  { slug: "cv-builder", href: "/tools/cv-builder", title: "CV & Portfolio Builder", short: "Free CV builder.", description: "CV free.", icon: "cv", category: "core" },
  { slug: "digital-readiness", href: "/tools/digital-readiness", title: "Digital Readiness Checker", short: "Digital readiness score.", description: "Readiness.", icon: "readiness", category: "core" },
  { slug: "project-brief", href: "/tools/project-brief", title: "Project Brief Generator", short: "Structured project brief.", description: "Brief.", icon: "brief", category: "business" },
  { slug: "proposal-builder", href: "/tools/proposal-builder", title: "Proposal Builder", short: "Free proposal draft.", description: "Proposal free.", icon: "proposal", category: "business" },
  { slug: "contract-generator", href: "/tools/contract-generator", title: "Contract Generator", short: "Free agreement draft.", description: "Contract free.", icon: "contract", category: "business" },
  { slug: "project-status", href: "/tools/project-status", title: "Project Status Page", short: "Share project progress.", description: "Status.", icon: "status", category: "business" },
  { slug: "tech-stack", href: "/tools/tech-stack", title: "Tech Stack Advisor", short: "Recommended stack.", description: "Stack.", icon: "stack", category: "business" },
  { slug: "hosting-planner", href: "/tools/hosting-planner", title: "Hosting & Domain Planner", short: "Hosting cost planner.", description: "Hosting free.", icon: "hosting", category: "business" },
  { slug: "roi-calculator", href: "/tools/roi-calculator", title: "Website ROI Calculator", short: "Website ROI estimate.", description: "ROI.", icon: "roi", category: "business" },
  { slug: "invoice-generator", href: "/tools/invoice-generator", title: "Invoice & Receipt Generator", short: "Free invoice tool.", description: "Invoice free.", icon: "invoice", category: "business" },
  { slug: "whatsapp-checklist", href: "/tools/whatsapp-checklist", title: "WhatsApp Business Checklist", short: "WhatsApp setup checklist.", description: "WA checklist.", icon: "wa", category: "business" },
  { slug: "maintenance-picker", href: "/tools/maintenance-picker", title: "Maintenance Plan Picker", short: "Care plan picker.", description: "Maintenance.", icon: "maintain", category: "business" },
  { slug: "email-signature", href: "/tools/email-signature", title: "Email Signature Generator", short: "HTML email signature.", description: "Email sig.", icon: "email", category: "business" },
  { slug: "salary-calculator", href: "/tools/salary-calculator", title: "Tech Salary & Rate Calculator", short: "NGN salary ranges.", description: "Salary.", icon: "salary", category: "career" },
  { slug: "skill-gap", href: "/tools/skill-gap", title: "Skill Gap Checker", short: "What to learn next.", description: "Skills.", icon: "skills", category: "career" },
  { slug: "cover-letter", href: "/tools/cover-letter", title: "Cover Letter Generator", short: "Cover letter draft.", description: "Cover letter.", icon: "letter", category: "career" },
  { slug: "project-ideas", href: "/tools/project-ideas", title: "Portfolio Project Ideas", short: "Portfolio ideas.", description: "Ideas.", icon: "ideas", category: "career" },
  { slug: "interview-practice", href: "/tools/interview-practice", title: "Interview Practice", short: "Free practice questions.", description: "Interview free.", icon: "interview", category: "career" },
  { slug: "ai-usecase", href: "/tools/ai-usecase", title: "AI Use-Case Finder", short: "AI ideas for business.", description: "AI use cases.", icon: "ai", category: "ai" },
  { slug: "chatbot-script", href: "/tools/chatbot-script", title: "Chatbot Script Generator", short: "Chatbot FAQ scripts.", description: "Bot scripts.", icon: "bot", category: "ai" },
  { slug: "text-cleaner", href: "/tools/text-cleaner", title: "Text Cleaner", short: "Clean messy text for WhatsApp & email.", description: "Free text cleaner.", icon: "letter", category: "utility" },
  { slug: "qr-generator", href: "/tools/qr-generator", title: "QR Code Generator", short: "Free QR codes.", description: "QR free.", icon: "qr", category: "utility" },
  { slug: "password-generator", href: "/tools/password-generator", title: "Password Generator", short: "Strong passwords.", description: "Password.", icon: "lock", category: "utility" },
];

export const TOOL_CATEGORIES: { id: ToolMeta["category"]; label: string }[] = [
  { id: "paid", label: "Paid tools" },
  { id: "markets", label: "Markets (education)" },
  { id: "core", label: "Core tools" },
  { id: "security", label: "Security tools" },
  { id: "business", label: "Business & growth" },
  { id: "career", label: "Career & learning" },
  { id: "ai", label: "AI & automation" },
  { id: "utility", label: "Quick utilities" },
];

export const TOOLS_PER_PAGE = 9;
