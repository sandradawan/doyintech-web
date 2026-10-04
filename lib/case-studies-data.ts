export type CaseStudy = {
  slug: string;
  name: string;
  sector: string;
  outcome: string;
  metric: string;
  tag: string;
  href: string;
  results: { label: string; value: string }[];
  problem: string;
  solution: string;
  stack: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "jennyglams",
    name: "JennyGlams",
    sector: "Beauty · Jos",
    outcome: "Portfolio + WhatsApp booking — DM chaos → one-tap enquire",
    metric: "Live in ~7 days",
    tag: "Local SME",
    href: "/case-studies/jennyglams",
    results: [
      { label: "Before", value: "DM chaos" },
      { label: "After", value: "1-tap book" },
      { label: "Timeline", value: "~7 days" },
      { label: "Focus", value: "Mobile" },
    ],
    problem:
      "Strong Instagram interest, but bookings died in endless DMs and unclear pricing.",
    solution:
      "Brand site with portfolio, clear packages, and WhatsApp deep-links so followers book in one tap.",
    stack: ["Next.js", "WhatsApp CTAs", "Mobile-first"],
  },
  {
    slug: "legacyplay",
    name: "LegacyPlay",
    sector: "Gaming lounge",
    outcome: "Bold site for station booking & tournament interest",
    metric: "Clear reserve CTA",
    tag: "Local SME",
    href: "/case-studies/legacyplay",
    results: [
      { label: "Goal", value: "Book stations" },
      { label: "CTA", value: "Always visible" },
      { label: "Brand", value: "Bold / youth" },
      { label: "Channel", value: "WhatsApp" },
    ],
    problem: "Walk-ins and chats were unstructured; tournaments needed a clear public face.",
    solution:
      "High-energy site with reserve CTAs, event messaging, and simple paths to WhatsApp.",
    stack: ["Next.js", "Brand design", "CTA hierarchy"],
  },
  {
    slug: "imperial-villa",
    name: "Imperial Villa Property",
    sector: "Property & fintech",
    outcome: "Unified brand site + client portal + staff tools",
    metric: "3 products live",
    tag: "Complex",
    href: "/case-studies/imperial-villa",
    results: [
      { label: "Surfaces", value: "3 live" },
      { label: "Users", value: "Clients + staff" },
      { label: "Type", value: "Multi-portal" },
      { label: "Scope", value: "Platform" },
    ],
    problem:
      "Property operations needed public trust, client access, and internal tooling in one ecosystem.",
    solution:
      "Brand site plus portals so clients and staff work from the right surface without chaos.",
    stack: ["Next.js", "Auth", "Dashboards"],
  },
  {
    slug: "doyinmart",
    name: "DoyinMart",
    sector: "Marketplace",
    outcome: "African software marketplace with local pricing",
    metric: "Multi-vendor ready",
    tag: "Platform",
    href: "/case-studies/doyinmart",
    results: [
      { label: "Model", value: "Marketplace" },
      { label: "Pricing", value: "Local-first" },
      { label: "Vendors", value: "Multi" },
      { label: "Region", value: "Africa" },
    ],
    problem: "Software discovery and local pricing were fragmented for African buyers.",
    solution: "Marketplace UX with local currency framing and clear product paths.",
    stack: ["Next.js", "Catalog", "Payments-ready"],
  },
  {
    slug: "ipvl",
    name: "IPVL Lobby Dashboard",
    sector: "Ops dashboard",
    outcome: "Real-time lobby & staff access for property ops",
    metric: "Internal system",
    tag: "SaaS",
    href: "/case-studies/ipvl",
    results: [
      { label: "Use", value: "Internal ops" },
      { label: "Access", value: "Staff roles" },
      { label: "Mode", value: "Realtime" },
      { label: "Outcome", value: "Less friction" },
    ],
    problem: "Lobby and staff coordination lived in chats and spreadsheets.",
    solution: "Focused ops dashboard with role-aware access for day-to-day property work.",
    stack: ["Dashboard UI", "Roles", "Realtime patterns"],
  },
  {
    slug: "arqademy-cbt",
    name: "Arqademy CBT",
    sector: "Education",
    outcome: "Computer-based testing experience for learners",
    metric: "Exam-ready UX",
    tag: "EdTech",
    href: "/case-studies/arqademy-cbt",
    results: [
      { label: "Focus", value: "Exams" },
      { label: "UX", value: "Low friction" },
      { label: "Users", value: "Learners" },
      { label: "Type", value: "CBT" },
    ],
    problem: "Learners needed a clear, reliable computer-based testing flow.",
    solution: "Exam-oriented interface optimized for clarity under pressure.",
    stack: ["Next.js", "Forms", "Timed flows"],
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
