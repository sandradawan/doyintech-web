/**
 * Website price calculator engine.
 * Edit BASE / FEATURE / multipliers here — UI stays unchanged.
 */

export const BUSINESS_TYPES = [
  "Restaurant",
  "Hotel",
  "Real Estate",
  "School",
  "Church/Organization",
  "E-commerce",
  "Portfolio",
  "Agency",
  "Professional service",
  "Blog/News",
  "Other",
] as const;

export const WEBSITE_TYPES = [
  { id: "landing", label: "Landing page", baseMin: 120_000, baseMax: 280_000, weeks: [1, 2] as [number, number] },
  { id: "business", label: "Business website", baseMin: 250_000, baseMax: 650_000, weeks: [2, 5] as [number, number] },
  { id: "ecommerce", label: "E-commerce website", baseMin: 450_000, baseMax: 1_400_000, weeks: [4, 10] as [number, number] },
  { id: "booking", label: "Booking platform", baseMin: 500_000, baseMax: 1_600_000, weeks: [4, 12] as [number, number] },
  { id: "school", label: "School portal", baseMin: 600_000, baseMax: 2_000_000, weeks: [6, 14] as [number, number] },
  { id: "realestate", label: "Real estate platform", baseMin: 550_000, baseMax: 1_800_000, weeks: [5, 12] as [number, number] },
  { id: "membership", label: "Membership platform", baseMin: 500_000, baseMax: 1_500_000, weeks: [4, 11] as [number, number] },
  { id: "custom", label: "Custom web application", baseMin: 800_000, baseMax: 3_500_000, weeks: [8, 20] as [number, number] },
] as const;

export const FEATURES = [
  { id: "responsive", label: "Responsive design", min: 0, max: 0 },
  { id: "contact", label: "Contact form", min: 15_000, max: 40_000 },
  { id: "whatsapp", label: "WhatsApp integration", min: 10_000, max: 35_000 },
  { id: "maps", label: "Google Maps", min: 10_000, max: 30_000 },
  { id: "seo", label: "SEO setup", min: 40_000, max: 120_000 },
  { id: "blog", label: "Blog", min: 50_000, max: 150_000 },
  { id: "cms", label: "CMS", min: 80_000, max: 250_000 },
  { id: "auth", label: "Authentication", min: 80_000, max: 220_000 },
  { id: "userDash", label: "User dashboard", min: 120_000, max: 350_000 },
  { id: "adminDash", label: "Admin dashboard", min: 150_000, max: 400_000 },
  { id: "payment", label: "Payment integration", min: 100_000, max: 300_000 },
  { id: "booking", label: "Booking system", min: 120_000, max: 350_000 },
  { id: "ecommerce", label: "E-commerce features", min: 150_000, max: 450_000 },
  { id: "database", label: "Database design", min: 60_000, max: 200_000 },
  { id: "api", label: "API integration", min: 80_000, max: 280_000 },
  { id: "chatbot", label: "AI chatbot", min: 100_000, max: 350_000 },
  { id: "automation", label: "AI automation", min: 120_000, max: 400_000 },
  { id: "sms", label: "SMS integration", min: 40_000, max: 120_000 },
  { id: "email", label: "Email notifications", min: 30_000, max: 90_000 },
  { id: "analytics", label: "Analytics", min: 20_000, max: 60_000 },
  { id: "security", label: "Security features", min: 50_000, max: 180_000 },
  { id: "custom", label: "Custom functionality", min: 100_000, max: 500_000 },
] as const;

export type CalculatorInput = {
  businessType: string;
  websiteTypeId: string;
  featureIds: string[];
  pages: number;
  needsMobileApp: boolean;
  needsMaintenance: boolean;
  needsHosting: boolean;
  expectedUsers: "low" | "medium" | "high";
  timeline: "standard" | "rush" | "flexible";
};

export type CalculatorResult = {
  min: number;
  max: number;
  weeksMin: number;
  weeksMax: number;
  packageName: string;
  features: string[];
  notes: string[];
};

function pageMultiplier(pages: number) {
  if (pages <= 5) return 1;
  if (pages <= 12) return 1.15;
  if (pages <= 25) return 1.35;
  return 1.55;
}

function userMultiplier(u: CalculatorInput["expectedUsers"]) {
  if (u === "high") return 1.25;
  if (u === "medium") return 1.1;
  return 1;
}

function timelineMultiplier(t: CalculatorInput["timeline"]) {
  if (t === "rush") return 1.2;
  if (t === "flexible") return 0.95;
  return 1;
}

export function calculateWebsitePrice(input: CalculatorInput): CalculatorResult {
  const wt =
    WEBSITE_TYPES.find((w) => w.id === input.websiteTypeId) || WEBSITE_TYPES[1];

  // Explicit number so multipliers can reassign (const object literals narrow otherwise)
  let min: number = wt.baseMin;
  let max: number = wt.baseMax;
  const featureLabels: string[] = [];

  for (const id of input.featureIds) {
    const f = FEATURES.find((x) => x.id === id);
    if (!f) continue;
    min += f.min;
    max += f.max;
    featureLabels.push(f.label);
  }

  const mult =
    pageMultiplier(input.pages) *
    userMultiplier(input.expectedUsers) *
    timelineMultiplier(input.timeline);

  min = Math.round(min * mult);
  max = Math.round(max * mult);

  const notes: string[] = [];

  if (input.needsMobileApp) {
    min += 400_000;
    max += 1_800_000;
    notes.push("Includes Flutter mobile app allowance");
  }
  if (input.needsMaintenance) {
    notes.push("Ongoing maintenance typically ₦40k–₦150k/month depending on scope");
  }
  if (input.needsHosting) {
    min += 25_000;
    max += 120_000;
    notes.push("Hosting/domain setup included in range (first year estimate)");
  }

  let weeksMin: number = wt.weeks[0];
  let weeksMax: number = wt.weeks[1];
  if (input.timeline === "rush") {
    weeksMin = Math.max(1, Math.round(weeksMin * 0.7));
    weeksMax = Math.max(weeksMin + 1, Math.round(weeksMax * 0.75));
  }
  if (input.featureIds.length > 8) {
    weeksMin += 1;
    weeksMax += 3;
  }
  if (input.needsMobileApp) {
    weeksMin += 3;
    weeksMax += 8;
  }

  let packageName = "Starter Web";
  if (max >= 2_000_000 || wt.id === "custom") packageName = "Enterprise / Custom";
  else if (max >= 900_000 || wt.id === "ecommerce" || wt.id === "school")
    packageName = "Growth Platform";
  else if (max >= 450_000) packageName = "Business Standard";

  return {
    min,
    max,
    weeksMin,
    weeksMax,
    packageName,
    features: featureLabels,
    notes,
  };
}

export function formatNgn(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}
