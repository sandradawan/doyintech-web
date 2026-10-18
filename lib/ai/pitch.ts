/**
 * SME pitch deck generator — professional slides + optional live URL snapshot.
 * Uses OpenAI when OPENAI_API_KEY is set for boardroom-grade copy.
 */

import { hasOpenAiKey, openAiJson } from "@/lib/ai/openai";

function clean(s: string, max = 400): string {
  return String(s || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function normalizeUrl(raw: string): string | null {
  const t = clean(raw, 500);
  if (!t) return null;
  try {
    const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    const u = new URL(withProto);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export type PitchInput = {
  projectName: string;
  description: string;
  url?: string;
  audience?: string;
  ask?: string;
};

export type PitchSlide = {
  id: string;
  kind: "title" | "problem" | "solution" | "product" | "market" | "why" | "ask";
  eyebrow: string;
  headline: string;
  subhead?: string;
  bullets?: string[];
  accent?: string;
};

export type PitchResult = {
  slides: PitchSlide[];
  textSlides: { title: string; body: string }[];
  markdown: string;
  screenshotUrl: string | null;
  pageTitle: string | null;
  pageDescription: string | null;
  finalUrl: string | null;
  projectName: string;
  description: string;
  aiEnhanced: boolean;
};

export async function fetchUrlSnapshot(url: string): Promise<{
  screenshotUrl: string | null;
  pageTitle: string | null;
  pageDescription: string | null;
  finalUrl: string | null;
}> {
  const endpoint = new URL("https://api.microlink.io");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("screenshot", "true");
  endpoint.searchParams.set("meta", "true");
  const key = process.env.MICROLINK_API_KEY?.trim();
  if (key) endpoint.searchParams.set("apiKey", key);
  try {
    const res = await fetch(endpoint.toString(), {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) {
      return { screenshotUrl: null, pageTitle: null, pageDescription: null, finalUrl: url };
    }
    const json = (await res.json()) as {
      data?: {
        title?: string;
        description?: string;
        url?: string;
        screenshot?: { url?: string };
      };
    };
    return {
      screenshotUrl: json.data?.screenshot?.url || null,
      pageTitle: json.data?.title || null,
      pageDescription: json.data?.description || null,
      finalUrl: json.data?.url || url,
    };
  } catch {
    return { screenshotUrl: null, pageTitle: null, pageDescription: null, finalUrl: url };
  }
}

function templateSlides(args: {
  name: string;
  description: string;
  audience: string;
  ask: string;
  finalUrl: string | null;
  pageTitle: string | null;
  pageDescription: string | null;
}): PitchSlide[] {
  const { name, description, audience, ask, finalUrl, pageTitle, pageDescription } = args;
  const shortDesc =
    description.length > 160 ? description.slice(0, 157) + "…" : description;
  return [
    {
      id: "title",
      kind: "title",
      eyebrow: "Investor & partner pitch",
      headline: name,
      subhead: shortDesc,
      bullets: [
        `Built for ${audience}`,
        finalUrl ? finalUrl.replace(/^https?:\/\//, "") : "Confidential preview",
      ],
      accent: "#ff8c14",
    },
    {
      id: "problem",
      kind: "problem",
      eyebrow: "01  ·  The problem",
      headline: "Slow systems leak revenue every week",
      subhead: `${audience} lose deals when follow-up is slow and tools are fragmented.`,
      bullets: [
        "High-intent enquiries go cold when replies take hours instead of minutes",
        "Work is scattered across chats, notes, spreadsheets, and memory",
        "Generic software is either too heavy to adopt or too vague to drive results",
      ],
    },
    {
      id: "solution",
      kind: "solution",
      eyebrow: "02  ·  The solution",
      headline: name,
      subhead: description,
      bullets: [
        "Focused on one sharp, measurable customer outcome",
        "Simple onboarding — value visible in the first working cycle",
        "Clear packaging, delivery standards, and next steps",
      ],
    },
    {
      id: "product",
      kind: "product",
      eyebrow: "03  ·  Product in action",
      headline: "See the experience",
      subhead: pageTitle || (finalUrl ? finalUrl : "Add a public URL to capture a live snapshot"),
      bullets: pageDescription ? [pageDescription] : undefined,
    },
    {
      id: "market",
      kind: "market",
      eyebrow: "04  ·  Who it serves",
      headline: audience,
      subhead: "A clear buyer with budget, urgency, and a painful status quo.",
      bullets: [
        "Decision-makers who feel the cost of missed follow-up",
        "Teams ready to standardise delivery instead of improvising",
        "Buyers who prefer focused tools over bloated suites",
      ],
    },
    {
      id: "why",
      kind: "why",
      eyebrow: "05  ·  Why this wins",
      headline: "Timing favors focused digital systems",
      subhead: "Operators who productise delivery and follow-up capture more of the same demand.",
      bullets: [
        "Customers already search for faster, clearer workflows",
        "Switching costs are lower for tools that solve one problem well",
        `${name} is positioned on a pain the buyer already feels`,
      ],
    },
    {
      id: "ask",
      kind: "ask",
      eyebrow: "06  ·  The ask",
      headline: "What we need next",
      subhead: ask,
      bullets: [
        "A short demo to align on scope and success metrics",
        "Agreement on the first milestone and timeline",
        "A pilot or commitment to ship the next release",
      ],
    },
  ];
}

type AiSlidePayload = {
  slides?: Array<{
    kind?: string;
    eyebrow?: string;
    headline?: string;
    subhead?: string;
    bullets?: string[];
  }>;
};

async function aiEnhanceSlides(
  base: PitchSlide[],
  input: {
    name: string;
    description: string;
    audience: string;
    ask: string;
    pageTitle: string | null;
    pageDescription: string | null;
    finalUrl: string | null;
  }
): Promise<PitchSlide[] | null> {
  if (!hasOpenAiKey()) return null;
  const parsed = await openAiJson<AiSlidePayload>(
    "You are a world-class startup pitch consultant and presentation designer for DoyinTech. " +
      "Write boardroom-ready pitch decks: vivid, specific, persuasive, professional. " +
      "Never invent traction metrics, revenue, users, or logos. No slang or filler. " +
      "Return JSON only with slides array. Each slide: kind, eyebrow, headline, subhead, bullets (2-4). " +
      "Kinds in order: title, problem, solution, product, market, why, ask. " +
      "Headlines max ~12 words. Subheads 1-2 sentences. Bullets crisp and memorable.",
    `Create a stunning 7-slide pitch deck.\n\nProject: ${input.name}\nDescription: ${input.description}\nAudience: ${input.audience}\nThe ask: ${input.ask}\nLive URL: ${input.finalUrl || "none"}\nPage title: ${input.pageTitle || "n/a"}\nPage description: ${input.pageDescription || "n/a"}\n\nReturn JSON: {"slides":[{"kind":"title|problem|solution|product|market|why|ask","eyebrow":"","headline":"","subhead":"","bullets":["",""]}]}`
  );
  if (!parsed?.slides || !Array.isArray(parsed.slides) || parsed.slides.length < 5) {
    return null;
  }
  const kindOrder = ["title", "problem", "solution", "product", "market", "why", "ask"] as const;
  const byKind = new Map(
    parsed.slides.map((s) => [String(s.kind || "").toLowerCase(), s] as const)
  );
  return kindOrder.map((kind, i) => {
    const src = byKind.get(kind) || parsed.slides![i] || {};
    const fallback = base.find((b) => b.kind === kind) || base[i];
    return {
      id: kind,
      kind,
      eyebrow: clean(String(src.eyebrow || fallback?.eyebrow || kind), 80),
      headline: clean(String(src.headline || fallback?.headline || kind), 120),
      subhead: src.subhead ? clean(String(src.subhead), 280) : fallback?.subhead,
      bullets: Array.isArray(src.bullets)
        ? src.bullets.map((b) => clean(String(b), 160)).filter(Boolean).slice(0, 4)
        : fallback?.bullets,
      accent: fallback?.accent,
    } satisfies PitchSlide;
  });
}

export async function generatePitchDeck(input: PitchInput): Promise<PitchResult> {
  const name = clean(input.projectName, 100) || "Project";
  const description =
    clean(input.description, 600) ||
    "A practical product that solves a clear customer problem.";
  const audience = clean(input.audience || "busy decision-makers", 120);
  const ask = clean(
    input.ask || "a pilot engagement or commitment to ship the next milestone",
    200
  );
  const url = input.url ? normalizeUrl(input.url) : null;

  let screenshotUrl: string | null = null;
  let pageTitle: string | null = null;
  let pageDescription: string | null = null;
  let finalUrl: string | null = null;

  if (url) {
    const snap = await fetchUrlSnapshot(url);
    screenshotUrl = snap.screenshotUrl;
    pageTitle = snap.pageTitle;
    pageDescription = snap.pageDescription;
    finalUrl = snap.finalUrl;
  }

  const base = templateSlides({
    name,
    description,
    audience,
    ask,
    finalUrl,
    pageTitle,
    pageDescription,
  });

  let slides = base;
  let aiEnhanced = false;
  const enhanced = await aiEnhanceSlides(base, {
    name,
    description,
    audience,
    ask,
    pageTitle,
    pageDescription,
    finalUrl,
  });
  if (enhanced) {
    slides = enhanced;
    aiEnhanced = true;
  }

  const textSlides = slides.map((s) => ({
    title: s.headline,
    body: [s.subhead, ...(s.bullets || [])].filter(Boolean).join("\n"),
  }));

  const markdown = [
    `# Pitch deck — ${name}`,
    ``,
    aiEnhanced ? `_AI-enhanced professional deck · DoyinTech_` : `_DoyinTech pitch template_`,
    ``,
    ...slides.flatMap((s, i) => [
      `## Slide ${i + 1}: ${s.eyebrow}`,
      `### ${s.headline}`,
      s.subhead || "",
      ...(s.bullets || []).map((b) => `- ${b}`),
      ``,
    ]),
    url ? `**Product URL:** ${finalUrl || url}` : "",
    screenshotUrl ? `**Screenshot:** ${screenshotUrl}` : "",
    ``,
    `---`,
    `*Generated by DoyinTech AI Tools · SME Pitch*`,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  return {
    slides,
    textSlides,
    markdown,
    screenshotUrl,
    pageTitle,
    pageDescription,
    finalUrl,
    projectName: name,
    description,
    aiEnhanced,
  };
}
