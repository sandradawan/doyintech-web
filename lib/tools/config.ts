/** Central config — edit WhatsApp, email, Academy URL, brand here */
export const TOOLS_CONFIG = {
  brand: "DoyinTech",
  siteUrl: "https://www.doyintech.com",
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
  priceNgn?: number;
  badge?: string;
};

export const TOOLS_META: ToolMeta[] = [
  {
    slug: "invoice-generator",
    href: "/tools/invoice-generator",
    title: "Invoice Generator",
    short: "Professional PDF invoices",
    description: "Create clean invoices with tax, notes, and client details.",
    icon: "invoice",
    category: "core",
  },
  {
    slug: "website-calculator",
    href: "/tools/website-calculator",
    title: "Website Cost Calculator",
    short: "Naira project estimates",
    description: "Estimate website cost by pages, features, and timeline.",
    icon: "calculator",
    category: "core",
  },
  {
    slug: "digital-readiness",
    href: "/tools/digital-readiness",
    title: "Digital Readiness Score",
    short: "Score your SME online",
    description: "Quick assessment of how ready your business is to sell online.",
    icon: "readiness",
    category: "core",
  },
  {
    slug: "business-audit",
    href: "/tools/business-audit",
    title: "Business Audit",
    short: "Find growth gaps",
    description: "Structured audit for marketing, ops, and digital presence.",
    icon: "audit",
    category: "business",
  },
  {
    slug: "system-protector",
    href: "/tools/system-protector",
    title: "System Protector Checker",
    short: "Quick device hygiene",
    description: "Guided checklist to harden phones and PCs for SMEs.",
    icon: "shield",
    category: "security",
  },
  {
    slug: "mixed-content",
    href: "/tools/mixed-content",
    title: "Mixed Content Finder",
    short: "HTTPS asset checker",
    description: "Detect http:// assets referenced from HTTPS pages.",
    icon: "mixed",
    category: "security",
  },
  {
    slug: "cv-builder",
    href: "/tools/cv-builder",
    title: "CV Builder",
    short: "Modern resume builder",
    description: "Build a clean CV for Nigerian and remote applications.",
    icon: "cv",
    category: "career",
  },
  {
    slug: "password-generator",
    href: "/tools/password-generator",
    title: "Password Generator",
    short: "Strong random passwords",
    description: "Create secure passwords with length and character options.",
    icon: "ssl",
    category: "utility",
  },
  {
    slug: "qr-generator",
    href: "/tools/qr-generator",
    title: "QR Code Generator",
    short: "Free QR codes",
    description: "Generate QR codes for URLs and promotions.",
    icon: "qr",
    category: "utility",
  },
  {
    slug: "whatsapp-scripts",
    href: "/tools/whatsapp-scripts",
    title: "WhatsApp Scripts",
    short: "Reply templates",
    description: "Ready scripts for customer chats.",
    icon: "wa",
    category: "business",
  },
  {
    slug: "security-scanner",
    href: "/tools/security-scanner",
    title: "Security Scanner",
    short: "Website checks",
    description: "Passive security checks for your site.",
    icon: "shield",
    category: "security",
  },
  {
    slug: "proposal-builder",
    href: "/tools/proposal-builder",
    title: "Proposal Builder",
    short: "Client proposals",
    description: "Draft professional proposals fast.",
    icon: "proposal",
    category: "business",
  },
];

/** Category chips only ("All" is handled separately in the UI). */
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

export const TOOLS_PER_PAGE = 9;
