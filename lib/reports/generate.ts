/**
 * Report content generation for DoyinTech Report Studio.
 * Structured templates + optional AI when OPENAI_API_KEY is set.
 * Never fabricates metrics (followers, engagement rates, etc.).
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
  "This report is based on information you provided and publicly observable profile details at the time of analysis. " +
  "It does not include private Instagram Insights, guaranteed follower counts, or financial projections. " +
  "Recommendations are practical guidance, not a promise of growth, sales, or ranking outcomes.";

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
    (input.businessObjective || "attract more qualified customers").trim() ||
    "attract more qualified customers";
  const audience =
    (input.targetAudience || "people who need your services").trim() ||
    "people who need your services";
  const isIg = isInstagram(input.profileUrl) || input.reportType === "instagram_audit";
  const deep = input.productId === "ig-growth" || input.productId === "ig-pro";

  const sections: ReportSection[] = [
    {
      title: "Executive summary",
      body:
        `This report reviews the digital presence submitted for ${input.name} ` +
        `(category: ${cat}). Primary objective: ${objective}. Target audience: ${audience}. ` +
        (isIg
          ? "Focus: first-impression clarity on Instagram and path to contact or booking."
          : "Focus: offer clarity, trust signals, and practical next steps."),
    },
    {
      title: "What the profile should communicate",
      body: `A strong ${cat} presence answers who you help, what you offer, and how to take the next step.`,
      bullets: [
        "Name / brand is readable and consistent",
        "Bio states the main offer in plain language",
        "Primary contact or booking path is one tap away",
        "Visual style feels intentional for the category",
        "Pinned or highlighted content proves the service",
      ],
    },
    {
      title: "Strengths to protect",
      body: `Keep what already works for a ${cat} brand.`,
      bullets: [
        "Keep messaging aligned with the main service you sell",
        "Preserve proof (testimonials, results) with permission",
        "Maintain a single primary call to action",
      ],
    },
    {
      title: "Improvement opportunities",
      body: `Highest-leverage fixes for converting visitors into enquiries for ${audience}.`,
      bullets: [
        "Make the core offer explicit in the first line of the bio",
        "Add a clear next step (WhatsApp, form, or booking link)",
        "Show service proof weekly with client consent",
        "Group content into themes so new visitors understand the range",
        "Archive posts that dilute the main offer",
      ],
    },
    {
      title: "Content recommendations",
      body: `Content that works for ${cat} brands educates, demonstrates, and invites action.`,
      bullets: isIg
        ? [
            "Service demonstration (process or result)",
            "Short educational tips",
            "Client testimonial highlight",
            "Behind-the-scenes of delivery quality",
            "Clear offer post with CTA",
            "FAQ-style posts that remove booking friction",
          ]
        : [
            "Homepage clarity: one primary offer above the fold",
            "Proof section with real outcomes",
            "Mobile contact path under two taps",
            "Consistent brand language across site and social",
          ],
    },
    {
      title: "Conversion checklist",
      body: "Use before investing more in ads or outreach.",
      bullets: [
        "Visitor can state what you sell after 5 seconds",
        "Visitor can start a conversation without hunting",
        "At least one proof element is visible",
        "Structure matches the services you want to sell most",
        "Tone matches expectations of " + audience,
      ],
    },
  ];

  if (deep) {
    sections.push({
      title: "Prioritised recommendations",
      body: "Complete the first three before any complex content calendar.",
      bullets: [
        "1. Rewrite bio / header to name the offer + who it is for",
        "2. Put WhatsApp or booking link in the most visible place",
        "3. Create Highlights for Services, Proof, Pricing/Booking, FAQs",
        "4. Publish 3 proof posts in the next 14 days",
        "5. Review weekly: which posts earned DMs — do more of that format",
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
          "Rewrite bio with offer + audience + CTA",
          "Set profile photo and brand colours consistently",
          "Add or verify contact link",
          "Create Highlights structure",
        ],
      },
      {
        week: "Week 2",
        focus: "Proof content",
        tasks: [
          "Publish two demonstration posts",
          "Publish one testimonial (with consent)",
          "Pin the strongest service post",
        ],
      },
      {
        week: "Week 3",
        focus: "Education + trust",
        tasks: [
          "Two educational posts answering common questions",
          "One behind-the-scenes post",
          "Reply to relevant comments within 24 hours",
        ],
      },
      {
        week: "Week 4",
        focus: "Review & refine",
        tasks: [
          "Note which posts drove DMs or calls",
          "Drop formats that did not perform",
          "Plan next month around winning formats",
          "Optional: book a deeper website review with DoyinTech",
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
      profileUrl: input.profileUrl || undefined,
      disclaimer:
        "This report is guidance based on information you submitted. It is not a guarantee of interviews or job offers.",
      sections: [
        {
          title: "Structure review",
          body: "Lead with role-relevant impact, not duties lists.",
          bullets: [
            "Put target role and strongest proof near the top",
            "Use consistent date formatting",
            "Keep length appropriate to experience level",
          ],
        },
        {
          title: "Impact wording",
          body: "Replace task-only bullets with outcome-oriented statements where evidence exists.",
          bullets: [
            "Start bullets with strong verbs",
            "Quantify results only when accurate",
            "Align language to target role keywords",
          ],
        },
        {
          title: "Gaps vs objective",
          body: `Objective noted: ${objective}. Focus rewrites on evidence that supports this goal.`,
          bullets: [
            "Highlight projects closest to the target role",
            "Move less relevant experience lower",
            "Add skills that match the job family without inventing experience",
          ],
        },
      ],
    };
  }

  if (input.reportType === "business_profile") {
    sections.unshift({
      title: "Digital readiness snapshot",
      body: `For a ${cat} business, digital readiness means a clear offer, reliable contact path, and systems that capture enquiries.`,
      bullets: [
        "Offer clarity on website and socials",
        "Mobile-friendly contact / WhatsApp path",
        "Basic tracking of leads if advertising",
        "Room for systems (booking, CRM) as volume grows",
      ],
    });
  }

  return {
    title: input.productName,
    subtitle: isIg
      ? `Personalized Instagram business report for ${input.name}`
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
            content:
              "You produce structured audit report JSON only. Never fabricate metrics.",
          },
          {
            role: "user",
            content: `Return ONLY valid JSON: {"sections":[{"title":"string","body":"string","bullets":["string"]}],"actionPlan":null or week array}.
Category: ${input.businessCategory || "business"}. Objective: ${input.businessObjective || "grow"}.
Profile: ${input.profileUrl || "n/a"}. Product: ${input.productName} (${input.productId}).
No invented follower counts. 4-7 sections. Include actionPlan only for ig-growth.`,
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
