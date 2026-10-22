/**
 * Recurring plans billed through Paystack Subscriptions. Client-safe (no secrets).
 * Prices are the source of truth: Paystack plans are created from these on first checkout
 * (see lib/subscriptions/server.ts), or pinned with PAYSTACK_PLAN_<ID> env vars.
 */
export type PlanFamily = "pro" | "care" | "store";
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
      "Paystack checkout — card, transfer and USSD, paid straight to your bank",
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

export function getPlan(id: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id);
}

export function plansInFamily(family: PlanFamily): SubscriptionPlan[] {
  return SUBSCRIPTION_PLANS.filter((p) => p.family === family);
}

export function intervalLabel(interval: PlanInterval): string {
  return interval === "annually" ? "year" : "month";
}
