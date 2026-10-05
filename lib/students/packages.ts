/** Student research project packages — priced in NGN, displayed in USD. */

import { formatUsdFromNgn, ngnToKobo, priceLabelFromNgn } from "@/lib/currency";

export type StudentPackage = {
  id: string;
  name: string;
  priceNgn: number;
  amountKobo: number;
  depositPercent: number;
  blurb: string;
  includes: string[];
  badge?: string;
};

export const STUDENT_PACKAGES: StudentPackage[] = [
  {
    id: "student-proposal",
    name: "Proposal & outline",
    priceNgn: 15_000,
    amountKobo: ngnToKobo(15_000),
    depositPercent: 50,
    blurb: "Topic refinement, proposal structure, and chapter outline.",
    includes: [
      "Topic review & sharpening",
      "Proposal structure",
      "Chapter outline",
      "Request ID tracking",
      "50% start · 50% before download",
    ],
    badge: "From " + formatUsdFromNgn(15_000),
  },
  {
    id: "student-stats",
    name: "Statistical project",
    priceNgn: 25_000,
    amountKobo: ngnToKobo(25_000),
    depositPercent: 50,
    blurb: "Questionnaire analysis, tables, and results write-up support.",
    includes: [
      "Data cleaning guidance",
      "Descriptive statistics & tables",
      "Results narrative draft",
      "Revisions via feedback box",
      "50% start · 50% before download",
    ],
    badge: formatUsdFromNgn(25_000),
  },
  {
    id: "student-full",
    name: "Design & implement (full project)",
    priceNgn: 30_000,
    amountKobo: ngnToKobo(30_000),
    depositPercent: 50,
    blurb: "End-to-end research project writing with stage tracking.",
    includes: [
      "Full chapter workflow",
      "Methodology & literature support",
      "Results & discussion support",
      "Formatting & revision rounds",
      "50% start · 50% before download",
    ],
    badge: formatUsdFromNgn(30_000),
  },
];

export function getStudentPackage(id: string): StudentPackage | undefined {
  return STUDENT_PACKAGES.find((p) => p.id === id);
}

export function depositNgn(pkg: StudentPackage): number {
  return Math.round((pkg.priceNgn * pkg.depositPercent) / 100);
}

export function balanceNgn(pkg: StudentPackage): number {
  return pkg.priceNgn - depositNgn(pkg);
}

export function depositKobo(pkg: StudentPackage): number {
  return ngnToKobo(depositNgn(pkg));
}

export function balanceKobo(pkg: StudentPackage): number {
  return ngnToKobo(balanceNgn(pkg));
}

export function packagePriceLabel(pkg: StudentPackage): string {
  return priceLabelFromNgn(pkg.priceNgn);
}

export function depositPriceLabel(pkg: StudentPackage): string {
  return priceLabelFromNgn(depositNgn(pkg));
}

export const PROJECT_STAGES = [
  { code: "received", label: "Request received" },
  { code: "topic_review", label: "Topic review" },
  { code: "outline", label: "Outline / chapter plan" },
  { code: "drafting", label: "Drafting in progress" },
  { code: "first_draft", label: "First draft ready" },
  { code: "revisions", label: "Revisions from your feedback" },
  { code: "delivered", label: "Ready — pay balance to unlock" },
  { code: "completed", label: "Completed & unlocked" },
] as const;

export type ProjectStageCode = (typeof PROJECT_STAGES)[number]["code"];

export function stageLabel(code: string): string {
  return PROJECT_STAGES.find((s) => s.code === code)?.label || code;
}

export const PROJECT_STATUSES = [
  "pending_payment",
  "deposit_paid",
  "in_progress",
  "awaiting_balance",
  "fully_paid",
  "completed",
  "cancelled",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
