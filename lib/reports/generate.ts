/**
 * Report content generation for DoyinTech Report Studio.
 * Structured templates + optional AI when OPENAI_API_KEY is set.
 * Never fabricates metrics.
 */

export type ReportInput = {
  productId: string;
  productName: string;
  reportType: string;
  name: string;
  email: string;
  profileUrl?: string | null;
  businessCategory?: string | null;
  businessObjective?: string | null;
  targetAudience?: string | null;
  notes?: string | null;
};

export type ReportSection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type GeneratedReport = {
  title: string;
  subtitle: string;
  generatedAt: string;
  customerName: string;
  profileUrl?: string;
  disclaimer: string;
  sections: ReportSection[];
  actionPlan?: { week: string; focus: string; tasks: string[] }[];
};

const DISCLAIMER =
  "This report is based on information you provided and publicly observable profile details. " +
  "It does not include private Insights or guaranteed metrics. Recommendations are guidance, not promises.";

function hostnameFromUrl(url?: string | null): string {
  if (!url) return "";
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url.slice(0, 80);
  }
}

function isInstagram(url?: string | null): boolean {
  const h = hostnameFromUrl(url).toLowerCase();
  return h.includes("instagram.com") || h.includes("instagr.am");
}

export function buildTemplateReport(input: ReportInput): GeneratedReport {
  const cat = (input.businessCategory || "business").trim() || "business";
  const objective =
    (input.businessObjective || "attract more qualified customers").trim();
  const audience =
    (input.targetAudience || "people who need your services").trim();
  const isIg = isInstagram(input.profileUrl) || input.reportType === "instagram_audit";
  const deep = input.productId === "ig-growth" || input.productId === "ig-pro";

  const sections: ReportSection[] = [
    {
      title: "Executive summary",
      body: `This report reviews the digital presence for ${input.name} (category: ${cat}). Objective: ${objective}. Audience: ${audience}.`,
    },
    {
      title: "What the profile should communicate",
      body: `A strong ${cat} presence answers who you help, what you offer, and the next step.`,
      bullets: [
        "Name / brand is readable and consistent",
        "Bio states the main offer clearly",
        "Contact or booking path is one tap away",
        "Visual style fits the category",
        "Pinned content proves the service",
      ],
    },
    {
      title: "Improvement opportunities",
      body: `Highest-leverage fixes for converting visitors into enquiries for ${audience}.`,
      bullets: [
        "Make the core offer explicit in the first line of the bio",
        "Add a clear next step (WhatsApp, form, or booking link)",
        "Show service proof weekly with client consent",
        "Group content into themes",
        "Archive posts that dilute the main offer",
      ],
    },
    {
      title: "Content recommendations",
      body: `Content that works for ${cat} brands educates, demonstrates, and invites action.`,
      bullets: isIg
        ? [
            "Service demonstration",
            "Short educational tips",
            "Client testimonial highlight",
            "Behind-the-scenes quality",
            "Clear offer post with CTA",
          ]
        : [
            "One primary offer above the fold",
            "Proof section with real outcomes",
            "Mobile contact under two taps",
            "Consistent brand language",
          ],
    },
    {
      title: "Conversion checklist",
      body: "Use before investing more in ads.",
      bullets: [
        "Visitor understands the offer in 5 seconds",
        "Visitor can start a conversation easily",
        "At least one proof element is visible",
        "Structure matches services you sell most",
      ],
    },
  ];

  if (deep) {
    sections.push({
      title: "Prioritised recommendations",
      body: "Complete the first three before a complex content calendar.",
      bullets: [
        "1. Rewrite bio with offer + audience + CTA",
        "2. Put WhatsApp or booking link in the most visible place",
        "3. Create Highlights for Services, Proof, Booking, FAQs",
        "4. Publish 3 proof posts in 14 days",
        "5. Weekly review: double down on formats that earn DMs",
      ],
    });
  }

  let actionPlan: GeneratedReport["actionPlan"] | undefined;
  if (input.productId === "ig-growth") {
    actionPlan = [
      {
        week: "Week 1",
        focus: "Profile clarity",
        tasks: [
          "Rewrite bio",
          "Verify contact link",
          "Create Highlights structure",
        ],
      },
      {
        week: "Week 2",
        focus: "Proof content",
        tasks: ["Two demonstration posts", "One testimonial", "Pin best service post"],
      },
      {
        week: "Week 3",
        focus: "Education + trust",
        tasks: ["Two educational posts", "One process post", "Reply to comments fast"],
      },
      {
        week: "Week 4",
        focus: "Review & refine",
        tasks: [
          "Note what drove DMs",
          "Drop weak formats",
          "Plan next month around winners",
        ],
      },
    ];
  }

  if (input.reportType === "cv_report") {
    return {
      title: "CV Improvement Report",
      subtitle: `Prepared for ${input.name}`,
      generatedAt: new Date().toISOString(),
      customerName: input.name,
      disclaimer:
        "Guidance based on information you submitted. Not a guarantee of interviews or offers.",
      sections: [
        {
          title: "Structure review",
          body: "Lead with role-relevant impact.",
          bullets: [
            "Strongest proof near the top",
            "Consistent date formatting",
            "Length appropriate to experience",
          ],
        },
        {
          title: "Impact wording",
          body: "Prefer outcome-oriented bullets where evidence exists.",
          bullets: [
            "Strong verbs",
            "Quantify only when accurate",
            "Align to target role keywords",
          ],
        },
      ],
    };
  }

  if (input.reportType === "business_profile") {
    sections.unshift({
      title: "Digital readiness snapshot",
      body: `For a ${cat} business: clear offer, contact path, and systems that capture enquiries.`,
      bullets: [
        "Offer clarity online",
        "Mobile WhatsApp / contact path",
        "Lead tracking if advertising",
        "Room for booking/CRM as volume grows",
      ],
    });
  }

  return {
    title: input.productName,
    subtitle: isIg
      ? `Personalized Instagram report for ${input.name}`
      : `Personalized digital report for ${input.name}`,
    generatedAt: new Date().toISOString(),
    customerName: input.name,
    profileUrl: input.profileUrl || undefined,
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
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_REPORT_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Structured audit report JSON only. Never fabricate metrics.",
          },
          {
            role: "user",
            content: `JSON only: {"sections":[{"title":"","body":"","bullets":[]}],"actionPlan":null}. Category: ${input.businessCategory || "business"}. Objective: ${input.businessObjective || "grow"}. Profile: ${input.profileUrl || "n/a"}. Product: ${input.productName}.`,
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
            ? s.bullets.map(String).slice(0, 12)
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
