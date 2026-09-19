import type { StoreListing } from "./types";

/**
 * Seed listings (approved only show in public store).
 * Production: replace with Supabase/Postgres.
 */
export const STORE_LISTINGS: StoreListing[] = [
  {
    id: "app-invoice-helper",
    slug: "invoice-helper",
    kind: "app",
    title: "Invoice Helper",
    shortDescription: "Create NGN invoices and print/save PDF in the browser.",
    description:
      "Free web app for freelancers and SMEs. Build a simple invoice and print or save as PDF.\n\nOpen instantly in your browser — no install required.\n\nSecurity: runs only in your browser; no server-side storage of invoice data.",
    developerName: "DoyinTech",
    developerEmail: "doyintechnology@outlook.com",
    platform: "web",
    priceNgn: 0,
    amountKobo: 0,
    category: "Business",
    iconEmoji: "\ud83d\udcc4",
    version: "1.0.0",
    launchUrl: "/apps/invoice-helper",
    reviewStatus: "approved",
    virusScanStatus: "clean",
    securityNotes: "Web app only. No native binary. Client-side print.",
    downloads: 0,
    ratingAvg: 4.8,
    ratingCount: 12,
    features: ["NGN formatting", "Print / Save PDF", "No signup"],
    createdAt: "2026-09-14",
    publishedAt: "2026-09-14",
    screenshots: ["/service-backend.png", "/services/web.png", "/port-fintech.png"],
  },
  {
    id: "app-client-tracker",
    slug: "client-tracker",
    kind: "app",
    title: "Client Tracker",
    shortDescription: "Track leads, status, and follow-ups. Export CSV.",
    description:
      "Lightweight CRM companion for small teams. Add clients, set status (Lead → Won), schedule follow-ups, export CSV.\n\nData is stored in your browser (localStorage).",
    developerName: "DoyinTech",
    developerEmail: "doyintechnology@outlook.com",
    platform: "web",
    priceNgn: 0,
    amountKobo: 0,
    category: "Productivity",
    iconEmoji: "\ud83d\udc65",
    version: "1.0.0",
    launchUrl: "/apps/client-tracker",
    reviewStatus: "approved",
    virusScanStatus: "clean",
    securityNotes: "Web app. Local storage only.",
    downloads: 0,
    ratingAvg: 4.7,
    ratingCount: 9,
    features: ["Pipeline status", "Follow-up dates", "CSV export"],
    createdAt: "2026-09-14",
    publishedAt: "2026-09-14",
    screenshots: ["/service-api.png", "/services/system.png", "/port-ecom.png"],
  },
  {
    id: "app-whatsapp-studio",
    slug: "whatsapp-studio",
    kind: "app",
    title: "WhatsApp Reply Studio",
    shortDescription: "Generate greeting and away scripts for WhatsApp Business.",
    description:
      "Build copy-paste WhatsApp auto-reply and menu scripts for your business in seconds.",
    developerName: "DoyinTech",
    developerEmail: "doyintechnology@outlook.com",
    platform: "web",
    priceNgn: 0,
    amountKobo: 0,
    category: "Business",
    iconEmoji: "\ud83d\udcac",
    version: "1.0.0",
    launchUrl: "/apps/whatsapp-studio",
    reviewStatus: "approved",
    virusScanStatus: "clean",
    securityNotes: "Web app. No network calls for script generation.",
    downloads: 0,
    ratingAvg: 4.9,
    ratingCount: 18,
    features: ["Greeting + menu", "Away message", "One-tap copy"],
    createdAt: "2026-09-14",
    publishedAt: "2026-09-14",
    screenshots: ["/service-mobile.png", "/services/mobile.png", "/port-edu.png"],
  },
  {
    id: "app-expense-log",
    slug: "expense-log",
    kind: "app",
    title: "Expense Log",
    shortDescription: "Log business expenses by category. Totals in NGN.",
    description:
      "Simple expense tracker for founders. Categorize spend and see running totals. Stored on-device in the browser.",
    developerName: "DoyinTech",
    developerEmail: "doyintechnology@outlook.com",
    platform: "web",
    priceNgn: 0,
    amountKobo: 0,
    category: "Productivity",
    iconEmoji: "\ud83e\uddfe",
    version: "1.0.0",
    launchUrl: "/apps/expense-log",
    reviewStatus: "approved",
    virusScanStatus: "clean",
    securityNotes: "Web app. Local storage only.",
    downloads: 0,
    ratingAvg: 4.5,
    ratingCount: 7,
    features: ["Categories", "Running total", "No signup"],
    createdAt: "2026-09-14",
    publishedAt: "2026-09-14",
    screenshots: ["/service-arch.png", "/services/backend.png", "/port-church.png"],
  },
  {
    id: "dig-sme-ops",
    slug: "sme-digital-ops-system",
    kind: "digital_product",
    title: "SME Digital Ops System — Complete",
    shortDescription: "Website kit, WhatsApp scripts, invoices, tracker — full SME pack.",
    description:
      "Full digital operations bundle for SMEs. Delivered as ZIP after payment. Also on /products.",
    developerName: "DoyinTech",
    developerEmail: "doyintechnology@outlook.com",
    platform: "digital",
    priceNgn: 100000,
    amountKobo: 10000000,
    category: "Business",
    iconEmoji: "\ud83d\ude80",
    version: "2026.1",
    packageType: "zip",
    fileName: "SME-Digital-Ops-System.zip",
    reviewStatus: "approved",
    virusScanStatus: "clean",
    downloads: 24,
    ratingAvg: 5,
    ratingCount: 6,
    features: [
      "Website kit",
      "WhatsApp pack",
      "Invoices & contracts",
      "Tracker + AI prompts",
    ],
    createdAt: "2026-09-13",
    publishedAt: "2026-09-13",
    screenshots: ["/services/system.png", "/service-backend.png", "/port-ecom.png", "/services/web.png"],
  },
];

export const STORE_CATEGORIES = [
  "All",
  "Business",
  "Productivity",
  "Developer Tools",
  "Education",
  "Security",
  "Digital Products",
] as const;

export function getPublishedListings(): StoreListing[] {
  return STORE_LISTINGS.filter((l) => l.reviewStatus === "approved");
}

export function getListingBySlug(slug: string): StoreListing | undefined {
  return STORE_LISTINGS.find((l) => l.slug === slug);
}

export function formatNgn(n: number): string {
  if (n === 0) return "Free";
  return `₦${n.toLocaleString("en-NG")}`;
}

export const SECURITY_PIPELINE = [
  {
    id: "file_type",
    title: "Package type check",
    detail: "Reject AAB for direct user install; require APK/EXE/DMG/ZIP as appropriate.",
  },
  {
    id: "hash",
    title: "SHA-256 fingerprint",
    detail: "Store file hash; show on listing so buyers can verify download integrity.",
  },
  {
    id: "malware_scan",
    title: "Malware scan",
    detail: "Queue VirusTotal / ClamAV style scan before human review.",
  },
  {
    id: "permission_review",
    title: "Permission & capability review",
    detail: "Flag SMS, accessibility, overlay, admin permissions for manual review.",
  },
  {
    id: "human_qa",
    title: "Human QA",
    detail: "Install on test device, smoke-test, check for phishing UI.",
  },
  {
    id: "publish",
    title: "Publish",
    detail: "Only approved + clean scan listings appear in the public store.",
  },
] as const;
