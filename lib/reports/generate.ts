/**
 * Multi-platform report generation — Instagram, Facebook, TikTok, YouTube,
 * LinkedIn, WhatsApp, website, X. Professional client deliverables only.
 * Never fabricates metrics or private analytics.
 */

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
  "This report is prepared by DoyinTech Report Studio based on information you submitted and publicly observable profile details at the time of analysis. " +
  "It does not include private platform analytics and does not guarantee follower counts, rankings, leads, or sales outcomes. " +
  "Recommendations are professional guidance; results depend on your execution and market conditions.";

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
    instagram: [
      "State your offer, audience, and primary call to action in the first line of the bio",
      "Organise Highlights for Services, Proof, Booking, and FAQs",
      "Pin posts that demonstrate real outcomes (with client consent)",
      "Maintain a consistent visual style across the grid",
    ],
    facebook: [
      "Complete the About section with what you sell and where you serve",
      "Configure Call, WhatsApp, or website action buttons",
      "Pin a clear service post with a next step",
      "Keep reviews and photos current",
    ],
    tiktok: [
      "Make the niche obvious within two seconds of opening the profile",
      "Point the profile link to booking, WhatsApp, or your website",
      "Balance educational content, proof, and brand personality",
      "Use recurring formats so viewers know what to expect",
    ],
    youtube: [
      "Ensure channel name and banner communicate the core offer",
      "Feature a strong introductory video or playlist for new visitors",
      "Keep thumbnails and titles consistent with your niche",
      "Place clear calls to action in descriptions and end screens",
    ],
    linkedin: [
      "Write a headline that states role and value, not title alone",
      "Use the Featured section for proof and flagship offers",
      "Write the About section for buyers, not only for recruiters",
      "Align personal and company pages where both exist",
    ],
    whatsapp: [
      "Complete business profile name, category, and description",
      "Set greeting and away messages",
      "Add a catalog or quick replies for common questions",
      "Match profile photo and intro to other brand channels",
    ],
    twitter: [
      "State who you help and what you offer in the bio",
      "Pin a post with a clear call to action or proof",
      "Ensure the profile link works reliably on mobile",
      "Keep tone consistent with your other channels",
    ],
    website: [
      "Present offer, proof, and next step above the fold on mobile",
      "Make contact or WhatsApp reachable within two taps",
      "Prioritise mobile speed and clarity",
      "Align website language with social profiles",
    ],
  };
  return (
    map[platform] || [
      `State the ${cat} offer clearly on the profile`,
      "Make the contact path obvious",
      "Show proof without requiring the visitor to search",
      "Keep messaging consistent with other channels",
    ]
  );
}

export function buildTemplateReport(input: ReportInput): GeneratedReport {
  const cat = (input.businessCategory || "business").trim() || "business";
  const objective = (
    input.businessObjective || "attract more qualified customers"
  ).trim();
  const audience = (
    input.targetAudience || "people who need your services"
  ).trim();
  const platforms = normalize(input);
  const names = platforms.map((p) => platformLabel(String(p.platform)));
  const multi = platforms.length > 1;
  const deep =
    ["platform-full", "platform-pro", "biz-profile"].includes(input.productId) ||
    ["full_presence", "multi_platform"].includes(input.reportType);

  if (input.reportType === "cv_report") {
    return {
      title: "CV Improvement Report",
      subtitle: `Professional review prepared for ${input.name}`,
      generatedAt: new Date().toISOString(),
      customerName: input.name,
      platformsReviewed: platforms.map((p) => ({
        platform: platformLabel(String(p.platform)),
        url: p.url,
      })),
      disclaimer:
        "This guidance is based on information you submitted. It is not a guarantee of interviews or employment offers.",
      sections: [
        {
          title: "Structure and clarity",
          body: "Lead with role-relevant impact so a recruiter sees your strongest evidence quickly.",
          bullets: [
            "Place the strongest proof near the top of the document",
            "Use consistent date formatting throughout",
            "Keep overall length appropriate to your experience level",
          ],
        },
        {
          title: "Impact-oriented wording",
          body: "Prefer outcome-focused statements wherever you have accurate evidence.",
          bullets: [
            "Begin bullets with strong action verbs",
            "Quantify results only when the figures are accurate",
            "Align language with keywords for your target role",
          ],
        },
        {
          title: "LinkedIn and public profile alignment",
          body: "Ensure your CV and public profiles tell the same professional story.",
          bullets: [
            "Match headline and summary to the target role narrative",
            "Feature work that supports CV highlights",
            "Eliminate conflicting dates or job titles",
          ],
        },
      ],
    };
  }

  const sections: ReportSection[] = [
    {
      title: "Executive summary",
      body:
        `This report reviews the digital presence of ${input.name} in the ${cat} category. ` +
        `Primary objective: ${objective}. Intended audience: ${audience}. ` +
        (platforms.length
          ? `Channels included in this review: ${names.join(", ")}.`
          : "No public profile links were submitted; recommendations are based on the category and objectives provided."),
    },
    {
      title: "What every channel should communicate",
      body: `Across Instagram, Facebook, TikTok, YouTube, LinkedIn, WhatsApp, your website, and X, a strong ${cat} presence answers three questions: who you help, what you offer, and how to take the next step.`,
      bullets: [
        "Present the same brand name and core offer on every active channel",
        "Use one primary call to action (WhatsApp, form, or booking) consistently",
        "Make proof visible without requiring the visitor to search",
        `Match tone and presentation to the expectations of ${audience}`,
      ],
    },
  ];

  if (platforms.length) {
    sections.push({
      title: multi ? "Channel-by-channel assessment" : "Platform assessment",
      body: multi
        ? "Each platform serves a distinct role. Use the points below as a working checklist for the links you submitted."
        : `Focused checks for your ${names[0]} presence.`,
      bullets: platforms.flatMap((p) => {
        const label = platformLabel(String(p.platform));
        return [
          `${label} — ${p.url.slice(0, 56)}${p.url.length > 56 ? "…" : ""}`,
          ...tips(String(p.platform), cat).map((t) => `  · ${t}`),
        ];
      }),
    });
  }

  if (multi) {
    sections.push({
      title: "Cross-platform consistency",
      body: "Customers often discover you on one channel and verify you on another. Inconsistency reduces trust and conversion.",
      bullets: [
        "Use identical business name spelling and logo treatment",
        "Keep primary service language aligned across channels",
        "Standardise one contact path — ideally a single WhatsApp number or form",
        "Ensure website and social bios do not contradict each other",
        "Designate one home-base channel for deep proof; point secondary channels toward it",
      ],
    });
  }

  sections.push(
    {
      title: "Priority improvement opportunities",
      body: `Highest-leverage improvements for a ${cat} brand seeking to convert ${audience} into enquiries.`,
      bullets: [
        "State the core offer explicitly on every bio, About section, and homepage hero",
        "Place WhatsApp or booking where it cannot be missed",
        "Publish proof weekly on at least one primary channel",
        "Reduce competing calls to action to a single primary next step",
        "Archive or update abandoned profiles that undermine brand credibility",
      ],
    },
    {
      title: "Content guidance by channel",
      body: "Adapt format to each platform. Avoid publishing identical posts without adjustment.",
      bullets: [
        "Instagram and TikTok: short demonstration, education, and offer content",
        "YouTube: deeper demonstrations, FAQs, and trust-building long form",
        "Facebook: local updates, offers, and community proof",
        "LinkedIn: expertise, case outcomes, and professional positioning",
        "WhatsApp: timely replies, catalog, and status updates",
        "Website: clear offer, proof, and conversion path",
        "X: concise tips with links back to your primary channel",
      ],
    },
    {
      title: "Conversion readiness checklist",
      body: "Complete these checks before increasing advertising spend.",
      bullets: [
        "A new visitor understands the offer within five seconds on any primary profile",
        "Starting a conversation does not require hunting for contact details",
        "At least one proof element is immediately visible",
        "Inactive or abandoned channels have been cleaned up or redirected",
        "The primary call to action is consistent on website and social channels",
      ],
    }
  );

  if (deep) {
    sections.push({
      title: "Recommended sequence of action",
      body: "Complete these steps in order. The first four typically unlock clearer enquiries.",
      bullets: [
        "1. Inventory every public profile and close or update inactive ones",
        "2. Rewrite bios and About sections with offer, audience, and call to action",
        "3. Standardise one contact method across all channels",
        "4. Publish proof on your strongest channel within seven days",
        "5. Align website and social language",
        "6. Only then increase posting volume or paid promotion",
      ],
    });
  }

  let actionPlan: GeneratedReport["actionPlan"] | undefined;
  if (input.productId === "platform-full" || input.reportType === "full_presence") {
    actionPlan = [
      {
        week: "Week 1",
        focus: "Audit and align",
        tasks: [
          "List all public profile URLs and resolve abandoned accounts",
          "Rewrite bios on every active channel",
          "Apply one primary call to action everywhere",
          "Align profile photos and brand name spelling",
        ],
      },
      {
        week: "Week 2",
        focus: "Establish proof on the primary channel",
        tasks: [
          "Select your strongest platform as the home base",
          "Publish two demonstration or results posts",
          "Publish one testimonial with client consent",
          "Pin or feature the strongest proof asset",
        ],
      },
      {
        week: "Week 3",
        focus: "Secondary channels and website",
        tasks: [
          "Point secondary channels to the same call to action",
          "Improve mobile contact path on the website if needed",
          "Configure WhatsApp greeting and away messages",
          "Publish one educational asset adapted per platform",
        ],
      },
      {
        week: "Week 4",
        focus: "Review and systemise",
        tasks: [
          "Identify which channels produced real enquiries",
          "Discontinue formats that did not perform",
          "Plan the following month around winning formats",
          "Optional: engage DoyinTech for website or operational systems",
        ],
      },
    ];
  }

  if (input.reportType === "business_profile") {
    sections.unshift({
      title: "Digital readiness overview",
      body: `For a ${cat} business, digital readiness means a clear offer, a reliable contact path, consistent multi-platform presence, and systems that capture enquiries.`,
      bullets: [
        "Offer clarity on website and social profiles",
        "Mobile-friendly WhatsApp or contact path",
        "No conflicting messages across channels",
        "Capacity to add booking or CRM tools as volume grows",
      ],
    });
  }

  return {
    title: input.productName,
    subtitle: multi
      ? `Multi-platform digital presence report for ${input.name}`
      : `Personalised digital presence report for ${input.name}`,
    generatedAt: new Date().toISOString(),
    customerName: input.name,
    profileUrl: platforms[0]?.url,
    platformsReviewed: platforms.map((p) => ({
      platform: platformLabel(String(p.platform)),
      url: p.url,
    })),
    disclaimer: DISCLAIMER,
    sections,
    actionPlan,
  };
}

export async function generateReportContent(
  input: ReportInput
): Promise<GeneratedReport> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  const base = buildTemplateReport(input);
  if (!apiKey) return base;

  try {
    const platforms = normalize(input);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_REPORT_MODEL || "gpt-4o-mini",
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a senior digital strategy consultant preparing a paid client deliverable for DoyinTech Report Studio. " +
              "Return polished professional multi-platform audit JSON only. " +
              "Tone: clear, confident, practical, respectful. No slang, no hype, no fabricated metrics. " +
              "Write complete sentences suitable for a paying SME client. " +
              "Never invent follower counts, views, engagement rates, or private analytics.",
          },
          {
            role: "user",
            content: `Return ONLY valid JSON with this shape:
{"sections":[{"title":"string","body":"string","bullets":["string"]}],"actionPlan":null or [{"week":"","focus":"","tasks":[""]}]}]

Client: ${input.name}
Category: ${input.businessCategory || "business"}
Objective: ${input.businessObjective || "grow enquiries"}
Audience: ${input.targetAudience || "customers"}
Product: ${input.productName} (${input.productId})
Platforms submitted: ${JSON.stringify(platforms)}
Notes: ${input.notes || "none"}

Requirements: 5–8 professional sections with complete sentences and specific recommendations. Include actionPlan only for platform-full or full_presence. No invented metrics.`,
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
      sections: parsed.sections.map(
        (s: { title?: string; body?: string; bullets?: string[] }) => ({
          title: String(s.title || "Section"),
          body: String(s.body || ""),
          bullets: Array.isArray(s.bullets)
            ? s.bullets.map(String).slice(0, 16)
            : undefined,
        })
      ),
      actionPlan: Array.isArray(parsed.actionPlan)
        ? parsed.actionPlan.map(
            (w: { week?: string; focus?: string; tasks?: string[] }) => ({
              week: String(w.week || "Week"),
              focus: String(w.focus || ""),
              tasks: Array.isArray(w.tasks) ? w.tasks.map(String) : [],
            })
          )
        : base.actionPlan,
    };
  } catch {
    return base;
  }
}
