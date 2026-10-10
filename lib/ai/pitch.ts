/**
 * SME pitch deck generator + optional live URL snapshot (Microlink).
 */

function clean(s: string, max = 400): string {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
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
  kind: "title" | "problem" | "solution" | "product" | "why" | "ask";
  eyebrow: string;
  headline: string;
  subhead?: string;
  bullets?: string[];
  accent?: string;
};

export type PitchResult = {
  slides: PitchSlide[];
  /** Legacy text cards for copy */
  textSlides: { title: string; body: string }[];
  markdown: string;
  screenshotUrl: string | null;
  pageTitle: string | null;
  pageDescription: string | null;
  finalUrl: string | null;
  projectName: string;
  description: string;
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

export async function generatePitchDeck(input: PitchInput): Promise<PitchResult> {
  const name = clean(input.projectName, 100) || "Project";
  const description =
    clean(input.description, 600) ||
    "A practical product that solves a clear customer problem.";
  const audience = clean(input.audience || "busy decision-makers", 120);
  const ask =
    clean(
      input.ask || "a pilot engagement or seed commitment to ship the next milestone",
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

  const shortDesc =
    description.length > 140 ? description.slice(0, 137) + "..." : description;

  const slides: PitchSlide[] = [
    {
      id: "title",
      kind: "title",
      eyebrow: "Pitch deck",
      headline: name,
      subhead: shortDesc,
      bullets: [`Built for ${audience}`, finalUrl ? finalUrl.replace(/^https?:\/\//, "") : "Private preview"],
      accent: "#ff8c14",
    },
    {
      id: "problem",
      kind: "problem",
      eyebrow: "01  ·  Problem",
      headline: "The gap costs time and revenue",
      subhead: `${audience} still lose deals to slow follow-up and fragmented tools.`,
      bullets: [
        "Enquiries go cold when replies take hours",
        "Work is scattered across chats, notes, and spreadsheets",
        "Generic software is either too heavy or too vague",
      ],
    },
    {
      id: "solution",
      kind: "solution",
      eyebrow: "02  ·  Solution",
      headline: name,
      subhead: description,
      bullets: [
        "Focused on one sharp outcome",
        "Simple onboarding — value in the first cycle",
        "Clear packaging and delivery standards",
      ],
    },
    {
      id: "product",
      kind: "product",
      eyebrow: "03  ·  Product",
      headline: "Live product snapshot",
      subhead: pageTitle || (finalUrl ? finalUrl : "Add a public URL to capture your site"),
      bullets: pageDescription ? [pageDescription] : undefined,
    },
    {
      id: "why",
      kind: "why",
      eyebrow: "04  ·  Why now",
      headline: "Timing favors focused digital systems",
      subhead: "Teams that productise delivery and follow-up win more of the same demand.",
      bullets: [
        "Customers already search for faster workflows",
        "Switching costs are lower for focused tools",
        `${name} is positioned on a clear, measurable pain`,
      ],
    },
    {
      id: "ask",
      kind: "ask",
      eyebrow: "05  ·  The ask",
      headline: "What we need next",
      subhead: ask,
      bullets: [
        "Short demo to align on scope",
        "Agree first milestone and success metrics",
        "Start with a pilot or commitment to ship",
      ],
    },
  ];

  const textSlides = slides.map((s) => ({
    title: s.headline,
    body: [s.subhead, ...(s.bullets || [])].filter(Boolean).join("\n"),
  }));

  const markdown = [
    `# Pitch deck — ${name}`,
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
  };
}
