export type AuditAnswer = "yes" | "partial" | "no" | "unsure";

export type AuditQuestion = {
  id: string;
  category: string;
  label: string;
  help?: string;
  weight: number;
};

/** Edit questions & weights here */
export const AUDIT_QUESTIONS: AuditQuestion[] = [
  { id: "website", category: "Online Presence", label: "Do you have a live business website?", weight: 10 },
  { id: "https", category: "Online Presence", label: "Is your website secured with HTTPS?", weight: 5 },
  { id: "mobile", category: "Online Presence", label: "Is your website mobile-friendly?", weight: 6 },
  { id: "gbp", category: "Online Presence", label: "Do you have a Google Business Profile?", weight: 6 },
  { id: "social", category: "Online Presence", label: "Are you active on relevant social media?", weight: 5 },
  { id: "whatsapp", category: "Customer Experience", label: "Do you use WhatsApp Business for customers?", weight: 6 },
  { id: "booking", category: "Customer Experience", label: "Can customers book or order online?", weight: 7 },
  { id: "support", category: "Customer Experience", label: "Do you offer structured online customer support?", weight: 4 },
  { id: "reviews", category: "Customer Experience", label: "Do you collect and respond to online reviews?", weight: 5 },
  { id: "payments", category: "Payments", label: "Do you accept online payments?", weight: 8 },
  { id: "gateway", category: "Payments", label: "Do you use a payment gateway (Paystack, Flutterwave, etc.)?", weight: 5 },
  { id: "invoices", category: "Payments", label: "Can you send digital invoices?", weight: 3 },
  { id: "seo", category: "Marketing", label: "Have you invested in SEO for your website?", weight: 7 },
  { id: "content", category: "Marketing", label: "Do you publish content regularly (blog/social)?", weight: 4 },
  { id: "emailMkt", category: "Marketing", label: "Do you use email marketing?", weight: 3 },
  { id: "analytics", category: "Marketing", label: "Do you track website analytics?", weight: 5 },
  { id: "ads", category: "Marketing", label: "Do you run online advertising?", weight: 3 },
  { id: "bizEmail", category: "Operations", label: "Do you use a professional business email?", weight: 4 },
  { id: "crm", category: "Operations", label: "Do you manage customer data digitally (CRM/spreadsheet)?", weight: 4 },
];

function scoreAnswer(a: AuditAnswer): number {
  if (a === "yes") return 1;
  if (a === "partial") return 0.5;
  if (a === "unsure") return 0.25;
  return 0;
}

export type AuditResult = {
  score: number;
  label: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recommendations: string[];
  suggestedServices: string[];
};

export function classifyAuditScore(score: number): string {
  if (score <= 30) return "Needs Major Improvement";
  if (score <= 50) return "Early Digital Stage";
  if (score <= 70) return "Growing";
  if (score <= 85) return "Strong Digital Presence";
  return "Excellent Digital Presence";
}

export function runBusinessAudit(
  answers: Record<string, AuditAnswer>,
): AuditResult {
  let earned = 0;
  let total = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const q of AUDIT_QUESTIONS) {
    total += q.weight;
    const a = answers[q.id] || "no";
    const s = scoreAnswer(a);
    earned += s * q.weight;
    if (s >= 0.9) strengths.push(q.label);
    else if (s <= 0.25) weaknesses.push(q.label);
  }

  const score = Math.round((earned / total) * 100);
  const opportunities: string[] = [];
  const recommendations: string[] = [];
  const suggestedServices: string[] = [];

  if ((answers.website || "no") !== "yes") {
    opportunities.push("Launch a professional business website");
    suggestedServices.push("Website development");
  }
  if ((answers.seo || "no") !== "yes") {
    opportunities.push("Improve search visibility with SEO");
    suggestedServices.push("SEO optimization");
  }
  if ((answers.booking || "no") !== "yes") {
    opportunities.push("Add online booking or ordering");
    suggestedServices.push("Booking / e-commerce system");
  }
  if ((answers.payments || "no") !== "yes") {
    opportunities.push("Enable online payments");
    suggestedServices.push("Payment integration");
  }
  if ((answers.chatbot as AuditAnswer) === undefined && (answers.support || "no") !== "yes") {
    opportunities.push("Automate first-line customer support");
    suggestedServices.push("AI chatbot / automation");
  }
  if ((answers.analytics || "no") !== "yes") {
    opportunities.push("Track visitors and conversions with analytics");
  }

  if (score < 50) {
    recommendations.push(
      "Prioritize a mobile-friendly website, WhatsApp Business, and a clear contact path.",
    );
    recommendations.push(
      "Claim Google Business Profile and collect reviews from happy customers.",
    );
  } else if (score < 75) {
    recommendations.push(
      "Strengthen SEO, online payments, and booking to convert more visitors.",
    );
    recommendations.push(
      "Add analytics so you can measure what marketing actually works.",
    );
  } else {
    recommendations.push(
      "Focus on automation, retention, and performance optimization.",
    );
    recommendations.push(
      "Consider AI support, CRM workflows, and conversion rate improvements.",
    );
  }

  if (suggestedServices.length === 0) {
    suggestedServices.push("Performance & conversion review");
  }

  return {
    score,
    label: classifyAuditScore(score),
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    opportunities: opportunities.slice(0, 5),
    recommendations,
    suggestedServices: [...new Set(suggestedServices)].slice(0, 4),
  };
}
