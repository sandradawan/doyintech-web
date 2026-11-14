/**
 * Recurring plans billed through Paystack Subscriptions. Client-safe (no secrets).
 * Prices are the source of truth: Paystack plans are created from these on first checkout
 * (see lib/subscriptions/server.ts), or pinned with PAYSTACK_PLAN_<ID> env vars.
 */
export type PlanFamily = "pro" | "care" | "store" | "ops";
export type PlanInterval = "monthly" | "annually";

export type SubscriptionPlan = {
  id: string;
  family: PlanFamily;
  name: string;
  tagline: string;
  amountNgn: number;
  interval: PlanInterval;
  features: string[];
  badge?: string;
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "pro-monthly",
    family: "pro",
    name: "DoyinTech Pro",
    tagline: "Every premium tool, on every device.",
    amountNgn: 5_000,
    interval: "monthly",
    features: [
      "All premium tools unlocked (PDF Studio, contracts, invoices, CV, proposals and more)",
      "Unlocks follow your account, not one browser",
      "DoyinOps cloud backup & sync for your clients, deals and invoices",
      "New premium tools included as they launch",
      "Cancel any time from your account page",
    ],
  },
  {
    id: "pro-annual",
    family: "pro",
    name: "DoyinTech Pro — Annual",
    tagline: "Two months free versus monthly.",
    amountNgn: 50_000,
    interval: "annually",
    badge: "Best value",
    features: [
      "Everything in Pro monthly",
      "Pay once a year — two months free",
      "Cancel renewal any time",
    ],
  },
  {
    id: "store-monthly",
    family: "store",
    name: "DoyinTech Store",
    tagline: "Sell online with checkout — no website needed.",
    amountNgn: 3_500,
    interval: "monthly",
    features: [
      "Unlimited products (free plan: 5)",
      "No fee on online payments (free plan: 1.5% per order)",
      "Discount codes for sales and loyal customers",
      "Orders on WhatsApp and in your dashboard",
      "No “Powered by DoyinTech” badge",
      "Cancel any time",
    ],
  },
  {
    id: "store-annual",
    family: "store",
    name: "DoyinTech Store — Annual",
    tagline: "Two months free versus monthly.",
    amountNgn: 35_000,
    interval: "annually",
    badge: "Best value",
    features: ["Everything in Store monthly", "Pay once a year — two months free"],
  },
  {
    id: "care-essential",
    family: "care",
    name: "Care Essential",
    tagline: "Keep your site online, secure and backed up.",
    amountNgn: 50_000,
    interval: "monthly",
    features: [
      "Security updates and weekly backups",
      "Uptime monitoring with downtime alerts",
      "Up to 1 hour of content changes per month",
      "Monthly health report (speed, uptime, SSL)",
    ],
  },
  {
    id: "care-growth",
    family: "care",
    name: "Care Growth",
    tagline: "Maintenance plus steady improvements that bring enquiries.",
    amountNgn: 90_000,
    interval: "monthly",
    badge: "Most popular",
    features: [
      "Everything in Essential",
      "Up to 3 hours of changes per month",
      "Google Business Profile and on-page SEO upkeep",
      "Quarterly speed and conversion tune-up",
      "Priority WhatsApp support",
    ],
  },
  {
    id: "care-pro",
    family: "care",
    name: "Care Pro",
    tagline: "A part-time web team for growing businesses.",
    amountNgn: 150_000,
    interval: "monthly",
    features: [
      "Everything in Growth",
      "Up to 6 hours of changes per month",
      "One new landing page or campaign page each month",
      "Monthly conversion review with recommendations",
      "Same-business-day support",
    ],
  },
];

/** DoyinOps paid plans: every tier syncs the workspace; Professional and Business include all of Pro. */
export const OPS_PLANS: SubscriptionPlan[] = [
  {
    id: "ops-starter",
    family: "ops",
    name: "DoyinOps Starter",
    tagline: "Your workspace backed up and on every device.",
    amountNgn: 7_500,
    interval: "monthly",
    features: [
      "Cloud backup and sync for clients, deals, invoices and tasks",
      "Use it on your phone and laptop",
      "Email support",
      "Cancel any time",
    ],
  },
  {
    id: "ops-professional",
    family: "ops",
    name: "DoyinOps Professional",
    tagline: "For growing businesses that live in DoyinOps.",
    amountNgn: 15_000,
    interval: "monthly",
    badge: "Most popular",
    features: [
      "Everything in Starter",
      "Every DoyinTech Pro premium tool included",
      "Setup call: we import your existing clients and invoices",
      "Priority WhatsApp support",
    ],
  },
  {
    id: "ops-business",
    family: "ops",
    name: "DoyinOps Business",
    tagline: "Set up and adjusted for you by our team.",
    amountNgn: 35_000,
    interval: "monthly",
    features: [
      "Everything in Professional",
      "Up to 2 hours a month of custom setup: invoice templates, fields and reports",
      "Monthly check-in call",
      "Same-business-day support",
    ],
  },
];
/** Yearly DoyinOps plans: pay for 10 months, get 12 (the same deal as Pro). */
export const OPS_ANNUAL_PLANS: SubscriptionPlan[] = OPS_PLANS.map((p) => ({
  ...p,
  id: `${p.id}-annual`,
  name: `${p.name} — Annual`,
  tagline: "Two months free versus monthly.",
  amountNgn: p.amountNgn * 10,
  interval: "annually" as const,
  badge: undefined,
  features: [`Everything in ${p.name}`, "Pay once a year — two months free", "Cancel renewal any time"],
}));
SUBSCRIPTION_PLANS.push(...OPS_PLANS, ...OPS_ANNUAL_PLANS);

/** Plans that unlock the Pro premium tools. */
export function grantsPro(planId: string): boolean {
  const plan = getPlan(planId);
  return plan?.family === "pro" || /^ops-(professional|business)(-annual)?$/.test(planId);
}

/** Plans that include DoyinOps cloud sync. */
export function grantsOpsSync(planId: string): boolean {
  const family = getPlan(planId)?.family;
  return family === "pro" || family === "ops";
}

export function getPlan(id: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id);
}

export function plansInFamily(family: PlanFamily): SubscriptionPlan[] {
  return SUBSCRIPTION_PLANS.filter((p) => p.family === family);
}

export function intervalLabel(interval: PlanInterval): string {
  return interval === "annually" ? "year" : "month";
}
