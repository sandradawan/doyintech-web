/** DoyinTech AI Report Studio — multi-platform product catalogue (NGN). */

import { formatUsdFromNgn, ngnToKobo, priceLabelFromNgn } from "@/lib/currency";

export type PlatformId =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "whatsapp"
  | "twitter"
  | "website"
  | "other";

export const PLATFORMS: {
  id: PlatformId;
  label: string;
  placeholder: string;
}[] = [
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourbrand" },
  { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourbrand" },
  { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/you or /company/..." },
  { id: "whatsapp", label: "WhatsApp Business", placeholder: "https://wa.me/234... or Business link" },
  { id: "twitter", label: "X (Twitter)", placeholder: "https://x.com/yourhandle" },
  { id: "website", label: "Website", placeholder: "https://yourbusiness.com" },
  { id: "other", label: "Other", placeholder: "Any other public profile URL" },
];

export type ReportPackage = {
  id: string;
  name: string;
  priceNgn: number;
  amountKobo: number;
  reportType:
    | "single_platform"
    | "multi_platform"
    | "full_presence"
    | "business_profile"
    | "cv_report";
  maxPlatforms: number;
  blurb: string;
  includes: string[];
  badge?: string;
  recommended?: boolean;
};

export const REPORT_PACKAGES: ReportPackage[] = [
  {
    id: "platform-basic",
    name: "Single Platform Audit",
    priceNgn: 5_000,
    amountKobo: ngnToKobo(5_000),
    reportType: "single_platform",
    maxPlatforms: 1,
    blurb:
      "Deep review of one channel — Instagram, TikTok, YouTube, Facebook, LinkedIn, WhatsApp, or your website.",
    includes: [
      "Any one platform (IG, FB, TikTok, YT, LinkedIn, WA, site…)",
      "Clarity, branding & conversion review",
      "5 prioritised recommendations",
      "Branded PDF-ready report",
    ],
    badge: "Start here",
  },
  {
    id: "platform-pro",
    name: "Multi-Platform Audit",
    priceNgn: 15_000,
    amountKobo: ngnToKobo(15_000),
    reportType: "multi_platform",
    maxPlatforms: 4,
    blurb:
      "Compare up to 4 channels. Find gaps, inconsistent branding, and where customers drop off.",
    includes: [
      "Up to 4 platforms of your choice",
      "Cross-channel branding consistency",
      "Where to put your primary CTA",
      "Content opportunity map",
      "Prioritised action list",
    ],
    badge: "Most popular",
    recommended: true,
  },
  {
    id: "platform-full",
    name: "Full Digital Presence Report",
    priceNgn: 35_000,
    amountKobo: ngnToKobo(35_000),
    reportType: "full_presence",
    maxPlatforms: 9,
    blurb:
      "Complete map of your online presence + 30-day multi-channel action plan.",
    includes: [
      "All major platforms you use",
      "Website + social alignment",
      "Channel role recommendations",
      "30-day week-by-week plan",
      "Conversion & content priorities",
    ],
  },
  {
    id: "biz-profile",
    name: "AI Business Profile Report",
    priceNgn: 20_000,
    amountKobo: ngnToKobo(20_000),
    reportType: "business_profile",
    maxPlatforms: 6,
    blurb:
      "Website + socials + digital readiness — built for Nigerian SMEs ready to systemise.",
    includes: [
      "Online presence overview",
      "Multi-platform consistency",
      "Customer acquisition opportunities",
      "Tool & system recommendations",
      "Clear next steps (including build options)",
    ],
  },
  {
    id: "cv-improve",
    name: "CV Improvement Report",
    priceNgn: 5_000,
    amountKobo: ngnToKobo(5_000),
    reportType: "cv_report",
    maxPlatforms: 2,
    blurb: "Structured feedback to strengthen your CV (and optional LinkedIn).",
    includes: [
      "Structure & clarity review",
      "Impact wording suggestions",
      "Gaps vs target role",
      "Optional LinkedIn alignment notes",
    ],
  },
];

export function getReportPackage(id: string): ReportPackage | undefined {
  return REPORT_PACKAGES.find((p) => p.id === id);
}

export function reportPriceLabel(pkg: ReportPackage): string {
  return priceLabelFromNgn(pkg.priceNgn);
}

export function reportUsdLabel(pkg: ReportPackage): string {
  return formatUsdFromNgn(pkg.priceNgn);
}

export const REPORT_STATUSES = [
  "pending_payment",
  "paid",
  "queued",
  "processing",
  "quality_check",
  "completed",
  "delivered",
  "failed",
  "cancelled",
] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

export function reportStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending_payment: "Awaiting payment",
    paid: "Paid — queued",
    queued: "In queue",
    processing: "Generating report",
    quality_check: "Quality check",
    completed: "Ready",
    delivered: "Delivered",
    failed: "Failed — contact support",
    cancelled: "Cancelled",
  };
  return map[status] || status;
}

export type PlatformLink = {
  platform: PlatformId;
  url: string;
};

export function platformLabel(id: string): string {
  return PLATFORMS.find((p) => p.id === id)?.label || id;
}
