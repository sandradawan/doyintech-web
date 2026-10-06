import { formatUsdFromNgn } from "@/lib/currency";

/**
 * Website price calculator engine.
 * Edit BASE / FEATURE / multipliers here — UI stays unchanged.
 */

export const BUSINESS_TYPES = [
  "Restaurant / Cafe",
  "Salon / Spa",
  "Clinic / Hospital",
  "Real estate",
  "School / Training",
  "Church / NGO",
  "Ecommerce / Retail",
  "Logistics / Delivery",
  "Professional services",
  "Other",
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

export type CalculatorInput = {
  businessType: BusinessType | string;
  pages: number;
  needsBooking: boolean;
  needsPayments: boolean;
  needsBlog: boolean;
  needsMultilang: boolean;
  needsCustomDesign: boolean;
  urgency: "normal" | "fast" | "rush";
};

export type CalculatorResult = {
  min: number;
  max: number;
  packageName: string;
  breakdown: { label: string; amount: number }[];
  notes: string[];
};

const BASE = {
  landing: 100_000,
  business: 250_000,
  growth: 450_000,
};

const FEATURE = {
  booking: 80_000,
  payments: 60_000,
  blog: 40_000,
  multilang: 70_000,
  customDesign: 100_000,
};

const URGENCY = {
  normal: 1,
  fast: 1.15,
  rush: 1.3,
};

export function estimateWebsitePrice(input: CalculatorInput): CalculatorResult {
  const pages = Math.max(1, Math.min(30, Number(input.pages) || 1));
  let packageName = "Landing Page Starter";
  let base = BASE.landing;

  if (pages >= 8 || input.needsBlog) {
    packageName = "Growth Website";
    base = BASE.growth;
  } else if (pages >= 3 || input.needsBooking) {
    packageName = "Local Business Website";
    base = BASE.business;
  }

  const breakdown: { label: string; amount: number }[] = [
    { label: `${packageName} base`, amount: base },
  ];

  if (input.needsBooking) breakdown.push({ label: "Booking system", amount: FEATURE.booking });
  if (input.needsPayments) breakdown.push({ label: "Payments integration", amount: FEATURE.payments });
  if (input.needsBlog) breakdown.push({ label: "Blog setup", amount: FEATURE.blog });
  if (input.needsMultilang) breakdown.push({ label: "Multi-language", amount: FEATURE.multilang });
  if (input.needsCustomDesign) breakdown.push({ label: "Custom design", amount: FEATURE.customDesign });

  const subtotal = breakdown.reduce((s, b) => s + b.amount, 0);
  const mult = URGENCY[input.urgency] || 1;
  const total = Math.round(subtotal * mult);
  const min = Math.round(total * 0.9);
  const max = Math.round(total * 1.15);

  const notes: string[] = [];
  if (mult > 1) notes.push("Faster delivery increases the estimate");
  notes.push("50% deposit to start · balance before launch");
  notes.push("Prices shown in USD; checkout processes securely via Paystack");

  return { min, max, packageName, breakdown, notes };
}

/** Display in USD (underlying estimate stays NGN units for Paystack). */
export function formatNgn(n: number) {
  return formatUsdFromNgn(Number(n) || 0);
}
