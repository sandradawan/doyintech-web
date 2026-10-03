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
    slug: "business-name-generator",
    href: "/tools/business-name-generator",
    title: "Business Name Generator",
    short: "Brandable names for Nigeria",
    description: "Generate memorable business name ideas with domain-friendly suggestions.",
    icon: "✨",
    category: "business",
  },
  {
    slug: "invoice-generator",
    href: "/tools/invoice-generator",
    title: "Invoice Generator",
    short: "Professional PDF invoices",
    description: "Create clean invoices with tax, notes, and client details.",
    icon: "📄",
    category: "business",
  },
  {
    slug: "whatsapp-link",
    href: "/tools/whatsapp-link",
    title: "WhatsApp Link Generator",
    short: "Click-to-chat links",
    description: "Build wa.me links with pre-filled messages for your CTAs.",
    icon: "💬",
    category: "utility",
  },
  {
    slug: "qr-code",
    href: "/tools/qr-code",
    title: "QR Code Generator",
    short: "Links, WiFi, text",
    description: "Generate QR codes for URLs, contact cards, and promotions.",
    icon: "▣",
    category: "utility",
  },
  {
    slug: "password-generator",
    href: "/tools/password-generator",
    title: "Password Generator",
    short: "Strong random passwords",
    description: "Create secure passwords with length and character options.",
    icon: "🔐",
    category: "security",
  },
  {
    slug: "system-protector",
    href: "/tools/system-protector",
    title: "System Protector Checker",
    short: "Quick device hygiene",
    description: "Guided checklist to harden phones and PCs for SMEs.",
    icon: "🛡️",
    category: "security",
  },
  {
    slug: "website-calculator",
    href: "/tools/website-calculator",
    title: "Website Cost Calculator",
    short: "Naira project estimates",
    description: "Estimate website cost by pages, features, and timeline.",
    icon: "🧮",
    category: "business",
  },
  {
    slug: "digital-readiness",
    href: "/tools/digital-readiness",
    title: "Digital Readiness Score",
    short: "Score your SME online",
    description: "Quick assessment of how ready your business is to sell online.",
    icon: "📊",
    category: "business",
  },
  {
    slug: "business-audit",
    href: "/tools/business-audit",
    title: "Business Audit",
    short: "Find growth gaps",
    description: "Structured audit for marketing, ops, and digital presence.",
    icon: "🔎",
    category: "business",
  },
  {
    slug: "cv-builder",
    href: "/tools/cv-builder",
    title: "CV Builder",
    short: "Modern resume builder",
    description: "Build a clean CV for Nigerian and remote applications.",
    icon: "👤",
    category: "career",
  },
  {
    slug: "prompt-library",
    href: "/tools/prompt-library",
    title: "AI Prompt Library",
    short: "Copy-ready prompts",
    description: "Practical prompts for marketing, sales, and operations.",
    icon: "🤖",
    category: "ai",
  },
  {
    slug: "mixed-content",
    href: "/tools/mixed-content",
    title: "Mixed Content Finder",
    short: "HTTPS asset checker",
    description: "Detect http:// assets referenced from HTTPS pages.",
    icon: "🔗",
    category: "security",
  },
];

export const TOOL_CATEGORIES = [
  { id: "all", label: "All tools" },
  { id: "business", label: "Business" },
  { id: "career", label: "Career" },
  { id: "ai", label: "AI" },
  { id: "security", label: "Security" },
  { id: "utility", label: "Quick utilities" },
];

export const TOOLS_PER_PAGE = 9;
