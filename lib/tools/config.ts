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
    slug: "proposal-builder",
    href: "/tools/proposal-builder",
    title: "Proposal Builder",
    short: "Client proposals",
    description: "Draft professional proposals fast.",
    icon: "proposal",
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
    slug: "ai-copy",
    href: "/tools/ai-copy",
    title: "AI Business Copy Suite",
    short: "Ads · WhatsApp · email",
    description: "Generate full business copy packs with AI. One-time unlock.",
    icon: "ai",
    category: "ai",
    paid: true,
    priceNgn: 4500,
    badge: "AI",
  },
  {
    slug: "ai-sop-writer",
    href: "/tools/ai-sop-writer",
    title: "AI SOP Writer",
    short: "Process documents",
    description: "Generate standard operating procedures with AI.",
    icon: "ai",
    category: "ai",
    paid: true,
    priceNgn: 5000,
    badge: "AI",
  },
  {
    slug: "ai-social-calendar",
    href: "/tools/ai-social-calendar",
    title: "AI Social Calendar",
    short: "Content plan",
    description: "AI-planned content calendar for Status and social.",
    icon: "ai",
    category: "ai",
    paid: true,
    priceNgn: 5500,
    badge: "AI",
  },
  {
    slug: "ai-product-copy",
    href: "/tools/ai-product-copy",
    title: "AI Product Copy",
    short: "Landing & ads",
    description: "Product descriptions, ads, and WhatsApp pitches via AI.",
    icon: "ai",
    category: "ai",
    paid: true,
    priceNgn: 4500,
    badge: "AI",
  },
  {
    slug: "ai-job-desc",
    href: "/tools/ai-job-desc",
    title: "AI Job Descriptions",
    short: "Hiring JDs",
    description: "Write clear job descriptions with AI.",
    icon: "ai",
    category: "ai",
    paid: true,
    priceNgn: 4000,
    badge: "AI",
  },
  {
    slug: "ai-meeting-actions",
    href: "/tools/ai-meeting-actions",
    title: "AI Meeting Actions",
    short: "Notes → tasks",
    description: "Turn meeting notes into decisions and action items.",
    icon: "ai",
    category: "ai",
    paid: true,
    priceNgn: 4500,
    badge: "AI",
  },
  {
    slug: "ai-faq-pack",
    href: "/tools/ai-faq-pack",
    title: "AI FAQ Pack",
    short: "Sales answers",
    description: "FAQ and objection handlers generated with AI.",
    icon: "ai",
    category: "ai",
    paid: true,
    priceNgn: 4000,
    badge: "AI",
  },
  {
    slug: "ai-content-repurpose",
    href: "/tools/ai-content-repurpose",
    title: "AI Content Repurposer",
    short: "One → many",
    description: "Repurpose long content into posts, email, and scripts.",
    icon: "ai",
    category: "ai",
    paid: true,
    priceNgn: 5000,
    badge: "AI",
  },
  {
    slug: "pdf-studio",
    href: "/tools/pdf-studio",
    title: "PDF Studio",
    short: "Paid unlock",
    description: "Letters, quotes, reports to PDF — one-time unlock.",
    icon: "invoice",
    category: "paid",
    paid: true,
    priceNgn: 5000,
  },
];

/** Category chips only (\"All\" is handled separately in the UI). */
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
