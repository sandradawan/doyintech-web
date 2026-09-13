import type { StoreListing } from "./types";

/**
 * Seed listings (approved only show in public store).
 * Production: replace with Supabase/Postgres.
 */
export const STORE_LISTINGS: StoreListing[] = [
  {
    id: "app-demo-invoice",
    slug: "invoice-helper-android",
    kind: "app",
    title: "Invoice Helper",
    shortDescription: "Create simple invoices offline — Android APK.",
    description:
      "Lightweight invoice helper for freelancers. Works offline. This is a curated listing example pending your first developer uploads.\n\nAfter purchase (or free install), the APK downloads automatically. Android will ask you to allow install from browser — that step cannot be skipped by any website (OS security).",
    developerName: "DoyinTech",
    developerEmail: "doyintechnology@outlook.com",
    platform: "android",
    priceNgn: 0,
    amountKobo: 0,
    category: "Business",
    iconEmoji: "📄",
    version: "1.0.0",
    packageType: "apk",
    fileName: "invoice-helper.apk",
    fileSizeMb: 12,
    reviewStatus: "approved",
    virusScanStatus: "clean",
    securityNotes: "Static review passed. No network spyware patterns in declared permissions list.",
    downloads: 128,
    ratingAvg: 4.6,
    ratingCount: 14,
    features: ["Offline invoices", "Share PDF", "NGN formatting"],
    createdAt: "2026-09-13",
    publishedAt: "2026-09-13",
  },
  {
    id: "dig-sme-ops",
    slug: "sme-digital-ops-system",
    kind: "digital_product",
    title: "SME Digital Ops System — Complete",
    shortDescription: "Website kit, WhatsApp scripts, invoices, tracker — full SME pack.",
    description:
      "Full digital operations bundle for SMEs. Delivered as ZIP after payment. Same product as the main DoyinTech products page — also listed in the Store for discovery.",
    developerName: "DoyinTech",
    developerEmail: "doyintechnology@outlook.com",
    platform: "digital",
    priceNgn: 100000,
    amountKobo: 10000000,
    category: "Business",
    iconEmoji: "🚀",
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
  },
  {
    id: "app-demo-desktop",
    slug: "client-tracker-desktop",
    kind: "app",
    title: "Client Tracker Desktop",
    shortDescription: "Simple desktop CRM companion for Windows.",
    description:
      "Desktop helper for tracking clients and follow-ups. After payment, installer ZIP auto-downloads. You run the installer and confirm UAC — websites cannot silent-install desktop software.",
    developerName: "DoyinTech",
    developerEmail: "doyintechnology@outlook.com",
    platform: "windows",
    priceNgn: 15000,
    amountKobo: 1500000,
    category: "Productivity",
    iconEmoji: "💻",
    version: "1.0.0",
    packageType: "zip",
    fileName: "client-tracker-win.zip",
    fileSizeMb: 45,
    reviewStatus: "approved",
    virusScanStatus: "clean",
    downloads: 41,
    ratingAvg: 4.4,
    ratingCount: 9,
    features: ["Client list", "Follow-up dates", "Export CSV"],
    createdAt: "2026-09-13",
    publishedAt: "2026-09-13",
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

/** Security gates before an app can be published */
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
