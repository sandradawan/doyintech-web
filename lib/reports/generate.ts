/** Multi-platform report generation — IG, FB, TikTok, YT, LinkedIn, WA, web, X. */

import type { PlatformId } from "./packages";
import { platformLabel } from "./packages";

export type PlatformLinkInput = { platform: PlatformId | string; url: string };

export type ReportInput = {
  productId: string;
  productName: string;
  reportType: string;
  name: string;
  email: string;
  profileUrl?: string | null;
  platforms?: PlatformLinkInput[];
  businessCategory?: string | null;
  businessObjective?: string | null;
  targetAudience?: string | null;
  notes?: string | null;
};

export type ReportSection = { title: string; body: string; bullets?: string[] };

export type GeneratedReport = {
  title: string;
  subtitle: string;
  generatedAt: string;
  customerName: string;
  profileUrl?: string;
  platformsReviewed?: { platform: string; url: string }[];
  disclaimer: string;
  sections: ReportSection[];
  actionPlan?: { week: string; focus: string; tasks: string[] }[];
};

const DISCLAIMER =
  "Based on information you provided and publicly observable details. No private analytics or invented metrics. Guidance only — not growth guarantees.";

function host(url?: string | null): string {
  if (!url) return "";
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return url.slice(0, 80);
  }
}

function detect(url: string): PlatformId {
  const h = host(url).toLowerCase();
  if (h.includes("instagram") || h.includes("instagr.am")) return "instagram";
  if (h.includes("facebook") || h.includes("fb.com")) return "facebook";
  if (h.includes("tiktok")) return "tiktok";
  if (h.includes("youtube") || h.includes("youtu.be")) return "youtube";
  if (h.includes("linkedin")) return "linkedin";
  if (h.includes("wa.me") || h.includes("whatsapp")) return "whatsapp";
  if (h.includes("twitter.com") || h.includes("x.com")) return "twitter";
  return "website";
}

function normalize(input: ReportInput): PlatformLinkInput[] {
  const list: PlatformLinkInput[] = [];
  if (Array.isArray(input.platforms)) {
    for (const p of input.platforms) {
      const url = String(p.url || "").trim();
      if (!url) continue;
      list.push({ platform: (p.platform as PlatformId) || detect(url), url });
    }
  }
  if (!list.length && input.profileUrl) {
    list.push({ platform: detect(input.profileUrl), url: input.profileUrl });
  }
  return list;
}

function tips(platform: string, cat: string): string[] {
  const map: Record<string, string[]> = {
    instagram: ["Bio: offer + audience + CTA", "Highlights: Services, Proof, Booking", "Pinned proof posts", "Consistent grid"],
    facebook: ["About states offer + location", "Call/WhatsApp action set", "Pinned service post", "Fresh reviews/photos"],
    tiktok: ["Bio niche in 2 seconds", "Link to booking/WA/site", "Education + proof mix", "Recurring formats"],
    youtube: ["Banner/name show offer", "Featured video for newcomers", "Consistent thumbnails", "CTA in descriptions"],
    linkedin: ["Headline = role + value", "Featured proof", "About for buyers", "Align company page"],
    whatsapp: ["Business profile complete", "Greeting + away messages", "Catalog/quick replies", "Photo matches brand"],
    twitter: ["Bio states offer", "Pinned CTA/proof", "Mobile-friendly link", "Tone matches brand"],
    website: ["Offer+proof+CTA above fold", "Contact under 2 taps", "Mobile speed", "Matches social language"],
  };
  return map[platform] || [`Clear ${cat} offer`, "Obvious contact path", "Visible proof", "Consistent messaging"];
}

export function buildTemplateReport(input: ReportInput): GeneratedReport {
  const cat = (input.businessCategory || "business").trim() || "business";
  const objective = (input.businessObjective || "attract more qualified customers").trim();
  const audience = (input.targetAudience || "people who need your services").trim();
  const platforms = normalize(input);
  const names = platforms.map((p) => platformLabel(String(p.platform)));
  const multi = platforms.length > 1;
  const deep = ["platform-full", "platform-pro", "biz-profile"].includes(input.productId) ||
    ["full_presence", "multi_platform"].includes(input.reportType);

  if (input.reportType === "cv_report") {
    return {
      title: "CV Improvement Report",
      subtitle: `Prepared for ${input.name}`,
      generatedAt: new Date().toISOString(),
      customerName: input.name,
      platformsReviewed: platforms.map((p) => ({ platform: platformLabel(String(p.platform)), url: p.url })),
      disclaimer: "Guidance only — not a guarantee of interviews or offers.",
      sections: [
        { title: "Structure", body: "Lead with role-relevant impact.", bullets: ["Strongest proof at top", "Consistent dates", "Right length"] },
        { title: "Impact wording", body: "Outcome-oriented bullets where evidence exists.", bullets: ["Strong verbs", "Quantify accurately", "Role keywords"] },
        { title: "LinkedIn alignment", body: "Keep CV and public profile consistent.", bullets: ["Matching headline", "Featured work", "No conflicting dates"] },
      ],
    };
  }

  const sections: ReportSection[] = [
    {
      title: "Executive summary",
      body: `Digital presence for ${input.name} (${cat}). Objective: ${objective}. Audience: ${audience}. ${platforms.length ? `Channels: ${names.join(", ")}.` : ""}`,
    },
    {
      title: "What every channel should communicate",
      body: `Across Instagram, Facebook, TikTok, YouTube, LinkedIn, WhatsApp, website, and X, a strong ${cat} presence answers who you help, what you offer, and the next step.`,
      bullets: ["Same brand name and offer", "One primary CTA", "Proof without hunting", `Tone fits ${audience}`],
    },
  ];

  if (platforms.length) {
    sections.push({
      title: multi ? "Channel-by-channel focus" : "Platform focus",
      body: multi ? "Each platform has a job." : `Checks for ${names[0]}.`,
      bullets: platforms.flatMap((p) => {
        const label = platformLabel(String(p.platform));
        return [`${label} (${p.url.slice(0, 50)}${p.url.length > 50 ? "…" : ""})`, ...tips(String(p.platform), cat).map((t) => `  · ${t}`)];
      }),
    });
  }

  if (multi) {
    sections.push({
      title: "Cross-platform consistency",
      body: "Customers verify you across apps.",
      bullets: ["Same name spelling", "Same service language", "Same contact path", "Web and social aligned", "One home-base for deep proof"],
    });
  }

  sections.push(
    {
      title: "Improvement opportunities",
      body: `Fixes for a ${cat} brand targeting ${audience}.`,
      bullets: ["Explicit offer on every bio/About/homepage", "WhatsApp/booking unmissable", "Weekly proof on primary channel", "One main CTA", "Clean abandoned profiles"],
    },
    {
      title: "Content by channel",
      body: "Adapt format per platform.",
      bullets: [
        "Instagram/TikTok: short proof & education",
        "YouTube: deeper demos",
        "Facebook: local updates & community",
        "LinkedIn: expertise & outcomes",
        "WhatsApp: replies, catalog, status",
        "Website: offer + conversion",
        "X: tips linking to home base",
      ],
    },
    {
      title: "Conversion checklist",
      body: "Before more ads.",
      bullets: ["Offer clear in 5 seconds", "Easy conversation path", "Proof visible", "Dead channels fixed", "Same CTA on web and social"],
    }
  );

  if (deep) {
    sections.push({
      title: "Prioritised recommendations",
      body: "In order.",
      bullets: [
        "1. List all profiles — fix or close dead ones",
        "2. Rewrite bios with offer + audience + CTA",
        "3. One contact method everywhere",
        "4. Proof on strongest channel this week",
        "5. Align website and social language",
        "6. Then scale content or ads",
      ],
    });
  }

  let actionPlan: GeneratedReport["actionPlan"] | undefined;
  if (input.productId === "platform-full" || input.reportType === "full_presence") {
    actionPlan = [
      { week: "Week 1", focus: "Audit & align", tasks: ["List all URLs", "Rewrite bios", "One CTA everywhere", "Align photos/names"] },
      { week: "Week 2", focus: "Proof", tasks: ["Choose home base", "Two proof posts", "One testimonial", "Pin best proof"] },
      { week: "Week 3", focus: "Secondary + web", tasks: ["Point secondary to CTA", "Mobile contact on site", "WhatsApp greeting", "One educational piece adapted"] },
      { week: "Week 4", focus: "Review", tasks: ["Note enquiry channels", "Drop weak formats", "Plan next month", "Optional: DoyinTech systems"] },
    ];
  }

  if (input.reportType === "business_profile") {
    sections.unshift({
      title: "Digital readiness",
      body: `For ${cat}: clear offer, contact path, multi-platform consistency, systems for leads.`,
      bullets: ["Offer clarity", "Mobile contact", "No conflicting messages", "Room for CRM/booking"],
    });
  }

  return {
    title: input.productName,
    subtitle: multi ? `Multi-platform report for ${input.name}` : `Personalized report for ${input.name}`,
    generatedAt: new Date().toISOString(),
    customerName: input.name,
    profileUrl: platforms[0]?.url,
    platformsReviewed: platforms.map((p) => ({ platform: platformLabel(String(p.platform)), url: p.url })),
    disclaimer: DISCLAIMER,
    sections,
    actionPlan,
  };
}

export async function generateReportContent(input: ReportInput): Promise<GeneratedReport> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  const base = buildTemplateReport(input);
  if (!apiKey) return base;
  try {
    const platforms = normalize(input);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_REPORT_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Multi-platform audit JSON only. Never fabricate metrics." },
          {
            role: "user",
            content: `JSON: {"sections":[{"title":"","body":"","bullets":[]}],"actionPlan":null}. Category: ${input.businessCategory || "business"}. Platforms: ${JSON.stringify(platforms)}. Product: ${input.productName}.`,
          },
        ],
      }),
    });
    if (!res.ok) return base;
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.sections) || parsed.sections.length < 2) return base;
    return {
      ...base,
      sections: parsed.sections.map((s: { title?: string; body?: string; bullets?: string[] }) => ({
        title: String(s.title || "Section"),
        body: String(s.body || ""),
        bullets: Array.isArray(s.bullets) ? s.bullets.map(String).slice(0, 16) : undefined,
      })),
      actionPlan: Array.isArray(parsed.actionPlan)
        ? parsed.actionPlan.map((w: { week?: string; focus?: string; tasks?: string[] }) => ({
            week: String(w.week || "Week"),
            focus: String(w.focus || ""),
            tasks: Array.isArray(w.tasks) ? w.tasks.map(String) : [],
          }))
        : base.actionPlan,
    };
  } catch {
    return base;
  }
}
