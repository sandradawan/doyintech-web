export type ReadinessAnswer = "yes" | "partial" | "no";

export type ReadinessQuestion = {
  id: string;
  category: string;
  label: string;
  weight: number;
};

export const READINESS_QUESTIONS: ReadinessQuestion[] = [
  // Online Presence
  { id: "website", category: "Online Presence", label: "We have a live website", weight: 5 },
  { id: "domain", category: "Online Presence", label: "We own a professional domain name", weight: 3 },
  { id: "gbp", category: "Online Presence", label: "We manage a Google Business Profile", weight: 4 },
  { id: "social", category: "Online Presence", label: "We are active on social media relevant to customers", weight: 3 },
  // Customer Experience
  { id: "whatsapp", category: "Customer Experience", label: "Customers can reach us on WhatsApp Business", weight: 4 },
  { id: "booking", category: "Customer Experience", label: "Customers can book or order online", weight: 5 },
  { id: "support", category: "Customer Experience", label: "We have a defined online support process", weight: 3 },
  // Payments
  { id: "onlinePay", category: "Payments", label: "We accept online payments", weight: 5 },
  { id: "gateway", category: "Payments", label: "We use a payment gateway", weight: 3 },
  { id: "invoices", category: "Payments", label: "We issue digital invoices/receipts", weight: 2 },
  // Marketing
  { id: "seo", category: "Marketing", label: "We invest in SEO or local search", weight: 4 },
  { id: "content", category: "Marketing", label: "We publish useful content for customers", weight: 3 },
  { id: "emailMkt", category: "Marketing", label: "We use email or SMS marketing", weight: 2 },
  { id: "analytics", category: "Marketing", label: "We track website/app analytics", weight: 4 },
  { id: "ads", category: "Marketing", label: "We run online ads when needed", weight: 2 },
  // Operations
  { id: "records", category: "Operations", label: "Business records are digital (not only paper)", weight: 4 },
  { id: "crm", category: "Operations", label: "We track customers/leads in a system", weight: 4 },
  { id: "inventory", category: "Operations", label: "Inventory or service capacity is tracked digitally", weight: 3 },
  { id: "cloud", category: "Operations", label: "Team uses cloud tools for collaboration", weight: 3 },
  // Security
  { id: "https", category: "Security", label: "Website uses HTTPS", weight: 3 },
  { id: "backups", category: "Security", label: "We keep regular data backups", weight: 4 },
  { id: "auth", category: "Security", label: "Staff accounts use strong authentication", weight: 3 },
  { id: "access", category: "Security", label: "Access to systems is role-based", weight: 3 },
  { id: "privacy", category: "Security", label: "We follow basic data protection practices", weight: 3 },
];

function pts(a: ReadinessAnswer) {
  if (a === "yes") return 1;
  if (a === "partial") return 0.5;
  return 0;
}

export function classifyReadiness(score: number) {
  if (score <= 20) return "Digital Beginner";
  if (score <= 40) return "Getting Started";
  if (score <= 60) return "Developing";
  if (score <= 80) return "Digitally Mature";
  return "Digital Leader";
}

export type ReadinessResult = {
  score: number;
  level: string;
  categoryScores: { category: string; score: number }[];
  strengths: string[];
  weaknesses: string[];
  quickWins: string[];
  mediumTerm: string[];
  longTerm: string[];
  services: string[];
};

export function runReadinessAssessment(
  answers: Record<string, ReadinessAnswer>,
): ReadinessResult {
  const byCat: Record<string, { e: number; t: number }> = {};
  let earned = 0;
  let total = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const q of READINESS_QUESTIONS) {
    total += q.weight;
    const a = answers[q.id] || "no";
    const p = pts(a) * q.weight;
    earned += p;
    if (!byCat[q.category]) byCat[q.category] = { e: 0, t: 0 };
    byCat[q.category].e += p;
    byCat[q.category].t += q.weight;
    if (pts(a) >= 0.9) strengths.push(q.label);
    if (pts(a) === 0) weaknesses.push(q.label);
  }

  const score = Math.round((earned / total) * 100);
  const categoryScores = Object.entries(byCat).map(([category, v]) => ({
    category,
    score: Math.round((v.e / v.t) * 100),
  }));

  const quickWins: string[] = [];
  const mediumTerm: string[] = [];
  const longTerm: string[] = [];
  const services: string[] = [];

  if ((answers.https || "no") !== "yes") quickWins.push("Enable HTTPS on your website");
  if ((answers.whatsapp || "no") !== "yes")
    quickWins.push("Set up WhatsApp Business with a clear welcome message");
  if ((answers.analytics || "no") !== "yes")
    quickWins.push("Install basic website analytics");
  if ((answers.gbp || "no") !== "yes")
    quickWins.push("Claim and complete your Google Business Profile");

  if ((answers.onlinePay || "no") !== "yes") {
    mediumTerm.push("Add online payments via Paystack or Flutterwave");
    services.push("Payment integration");
  }
  if ((answers.booking || "no") !== "yes") {
    mediumTerm.push("Launch online booking or ordering");
    services.push("Booking / commerce system");
  }
  if ((answers.seo || "no") !== "yes") {
    mediumTerm.push("Improve SEO and local search visibility");
    services.push("SEO & website modernization");
  }
  if ((answers.crm || "no") !== "yes") {
    mediumTerm.push("Centralize leads and customers in a simple CRM");
    services.push("CRM / automation setup");
  }

  if ((answers.backups || "no") !== "yes")
    longTerm.push("Automate backups and access control");
  if (score < 60)
    longTerm.push("Plan a phased digital transformation roadmap with clear ROI");
  else longTerm.push("Optimize conversion, automation, and staff digital skills");

  if ((answers.website || "no") !== "yes") services.push("Website development");
  if (services.length === 0) services.push("Digital growth consultation");

  return {
    score,
    level: classifyReadiness(score),
    categoryScores,
    strengths: strengths.slice(0, 6),
    weaknesses: weaknesses.slice(0, 6),
    quickWins: quickWins.slice(0, 4),
    mediumTerm: mediumTerm.slice(0, 4),
    longTerm: longTerm.slice(0, 3),
    services: [...new Set(services)].slice(0, 4),
  };
}
