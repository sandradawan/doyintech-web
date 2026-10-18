/** DoyinTech AI Report Studio — product catalogue (NGN settlement). */

import { formatUsdFromNgn, ngnToKobo, priceLabelFromNgn } from "@/lib/currency";

export type ReportPackage = {
  id: string;
  name: string;
  priceNgn: number;
  amountKobo: number;
  reportType: "instagram_audit" | "business_profile" | "cv_report" | "property_report";
  blurb: string;
  includes: string[];
  badge?: string;
  recommended?: boolean;
};

export const REPORT_PACKAGES: ReportPackage[] = [
  {
    id: "ig-basic",
    name: "Basic Instagram Audit",
    priceNgn: 3_000,
    amountKobo: ngnToKobo(3_000),
    reportType: "instagram_audit",
    blurb: "Profile review and five practical recommendations.",
    includes: [
      "Public profile overview",
      "5 prioritised recommendations",
      "Branded PDF-ready report",
      "Email delivery",
    ],
    badge: "Start here",
  },
  {
    id: "ig-pro",
    name: "Professional Instagram Audit",
    priceNgn: 10_000,
    amountKobo: ngnToKobo(10_000),
    reportType: "instagram_audit",
    blurb: "Detailed analysis, branding, and content recommendations.",
    includes: [
      "Brand identity assessment",
      "Bio & conversion review",
      "Content opportunity analysis",
      "Prioritised action list",
      "Branded professional report",
    ],
    badge: "Most popular",
    recommended: true,
  },
  {
    id: "ig-growth",
    name: "Growth Strategy Report",
    priceNgn: 25_000,
    amountKobo: ngnToKobo(25_000),
    reportType: "instagram_audit",
    blurb: "Full audit plus a practical 30-day content action plan.",
    includes: [
      "Everything in Professional",
      "30-day week-by-week plan",
      "Content theme suggestions",
      "Conversion checklist",
      "Priority ranking",
    ],
  },
  {
    id: "biz-profile",
    name: "AI Business Profile Report",
    priceNgn: 15_000,
    amountKobo: ngnToKobo(15_000),
    reportType: "business_profile",
    blurb: "Website + social presence + digital readiness for SMEs.",
    includes: [
      "Online presence overview",
      "Branding consistency notes",
      "Customer acquisition opportunities",
      "Tool & system recommendations",
      "Clear next steps",
    ],
  },
  {
    id: "cv-improve",
    name: "CV Improvement Report",
    priceNgn: 5_000,
    amountKobo: ngnToKobo(5_000),
    reportType: "cv_report",
    blurb: "Structured feedback to strengthen your CV for a target role.",
    includes: [
      "Structure & clarity review",
      "Impact wording suggestions",
      "Gaps vs target role",
      "Rewrite priorities",
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
