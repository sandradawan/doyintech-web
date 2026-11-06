import { SHOWS } from "@/lib/listen/shows";
import type { MetadataRoute } from "next";
import { TOOLS_META } from "@/lib/tools/config";
import { INDUSTRIES } from "@/lib/industries";
import { CITIES } from "@/lib/cities";
import { ALL_EBOOKS } from "@/lib/ebooks-catalog";
import { DIGITAL_PRODUCTS } from "@/lib/products";
import { PAGE_TEMPLATES } from "@/lib/page-templates";
import { UI_COMPONENTS } from "@/lib/ui-components";
import { SITE_URL } from "@/lib/site";
import { VAT_COUNTRIES, VAT_EXISTING_PAGES } from "@/lib/global/vat-rates";
import { SALARY_COUNTRIES } from "@/lib/global/salary";

/**
 * Every public, indexable URL, grouped by what it sells. Built from the same data the pages
 * render from, so new tools, ebooks, products, templates and city pages appear automatically.
 * Private and transactional routes are excluded here and disallowed in robots.ts.
 */

type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
type Entry = { path: string; priority: number; freq: Freq; modified?: string; images?: string[] };

const BUILT = new Date();

const page = (path: string, priority: number, freq: Freq = "monthly"): Entry => ({ path, priority, freq });

/** Search-landing pages that bring buyers: services, prices and money pages. */
const MONEY: Entry[] = [
  page("", 1, "weekly"),
  page("/hire", 0.95, "weekly"),
  page("/pricing", 0.95),
  page("/website-cost-nigeria", 0.95),
  page("/products", 0.95, "weekly"),
  page("/ebooks", 0.95, "weekly"),
  page("/tools", 0.95, "weekly"),
  page("/business-solutions", 0.95, "weekly"),
  page("/get-paid", 0.95),
  page("/care-plans", 0.9),
  page("/pro", 0.9),
  page("/free-audit", 0.9),
  page("/reports", 0.85),
  page("/e-invoicing-nigeria", 0.9),
  page("/business-name-registration-nigeria", 0.9),
  page("/google-business-profile-setup", 0.9),
  page("/business-email-domain-nigeria", 0.9),
  page("/school-management-software-nigeria", 0.9),
  page("/hotel-booking-website-nigeria", 0.9),
  page("/ecommerce-website-nigeria", 0.9),
  page("/stores", 0.85, "weekly"),
  page("/shops", 0.8, "daily"),
  page("/gift-cards", 0.8),
  page("/gift-cards/redeem", 0.5),
  page("/get-featured", 0.75),
  page("/services", 0.85),
  page("/services/backend", 0.8),
  page("/services/mobile", 0.8),
  page("/services/ai-automation", 0.8),
  page("/white-label", 0.7),
  page("/templates", 0.75),
  page("/components", 0.7),
  page("/students", 0.85),
  page("/students/projects", 0.8),
  page("/students/analyzer", 0.7),
  page("/students/studio", 0.7),
  page("/students/citations", 0.75),
  page("/students/cover-letter", 0.7),
  page("/local-seo", 0.8),
  page("/agency-vs-freelancer", 0.7),
];

const TRUST: Entry[] = [
  page("/portfolio", 0.75),
  page("/case-studies", 0.75),
  ...["imperial-villa", "doyinmart", "legacyplay", "jennyglams", "arqademy-cbt", "ipvl"].map((s) => page(`/case-studies/${s}`, 0.7)),
  page("/reviews", 0.7),
  page("/refer", 0.6),
  page("/about", 0.7),
  page("/contact", 0.8),
  page("/company-profile", 0.6),
  page("/support", 0.5),
  page("/privacy", 0.3, "yearly"),
  page("/terms", 0.3, "yearly"),
];

const BLOG: Entry[] = [
  page("/blog", 0.8, "weekly"),
  ...[
    "website-for-salon-nigeria",
    "whatsapp-booking-system-nigeria",
    "website-for-clinic-nigeria",
    "property-website-nigeria",
    "website-for-gaming-lounge-nigeria",
    "website-for-restaurant-nigeria",
    "website-for-church-event-nigeria",
    "why-production-grade-backends-matter",
    "laravel-vs-node-when-to-choose",
    "practical-ai-automation-for-smes",
  ].map((s) => page(`/blog/${s}`, 0.7)),
];

/** Tool pages that exist outside the hub list (paid exports, security and market utilities). */
const EXTRA_TOOLS = [
  "system-protector", "ai-usecase", "breach-hygiene", "chatbot-script", "contract-generator", "contract-export", "cookie-auditor",
  "csp-generator", "cv-premium", "dependency-risk", "dues-receipt", "exposed-files", "golive-checklist", "hosting-planner",
  "hosting-export", "interview-pack", "maintenance-picker", "mixed-content", "offer-letter", "org-security", "paper-journal",
  "position-risk", "project-ideas", "project-status", "proposal-export", "qr-pro", "redirect-inspector", "rent-receipt",
  "robots-auditor", "security-headers", "security-report", "signal-explainer", "tech-stack", "trade-checklist",
  "uptime-monitor", "whatsapp-checklist",
];

/** Tools people search for by name every day get the highest tool priority. */
const HIGH_DEMAND_TOOLS = new Set([
  "paye-calculator-nigeria", "invoice-generator-nigeria", "receipt-generator-nigeria", "quotation-generator-nigeria",
  "proforma-invoice-generator-nigeria", "purchase-order-generator", "payslip-generator-nigeria", "cgpa-calculator",
  "aggregate-score-calculator", "letter-generator", "certificate-generator", "id-card-generator", "business-plan-generator",
  "meeting-minutes-generator", "cv-builder", "qr-generator", "nigeria-vat-calculator", "small-company-tax-checker",
  "freelancer-tax-calculator-nigeria", "timesheet-calculator", "study-timetable-planner",
  "solar-vs-generator-calculator", "import-duty-calculator-nigeria", "cash-flow-forecast", "employee-cost-calculator-nigeria",
  "bid-evaluation-tool", "compliance-calendar-nigeria", "hourly-to-salary-calculator", "freelance-rate-calculator", "discount-calculator", "late-payment-interest-calculator", "daily-quiz",
  "profit-margin-calculator", "break-even-calculator", "loan-emi-calculator",
]);

function entries(): Entry[] {
  const tools: Entry[] = [
    ...TOOLS_META.map((t) => ({ path: t.href, priority: HIGH_DEMAND_TOOLS.has(t.slug) ? 0.9 : 0.75, freq: "monthly" as Freq })),
    ...EXTRA_TOOLS.map((s) => page(`/tools/${s}`, 0.6)),
  ];

  const ebooks: Entry[] = ALL_EBOOKS.map((b) => ({
    path: `/ebooks/${b.slug}`,
    priority: 0.85,
    freq: "monthly",
    images: b.coverImage ? [b.coverImage] : undefined,
  }));

  const products: Entry[] = DIGITAL_PRODUCTS.filter((p) => p.type === "one-time").map((p) => ({
    path: `/products/${p.id}`,
    priority: 0.85,
    freq: "monthly",
    modified: p.addedAt,
  }));

  const worldwide: Entry[] = [
    page("/vat-calculator", 0.9),
    page("/tools/invoice-generator", 0.9),
    page("/salary-calculator", 0.9),
    ...SALARY_COUNTRIES.map((c) => page(`/salary-calculator/${c.slug}`, 0.85)),
    ...VAT_COUNTRIES.filter((v) => !VAT_EXISTING_PAGES[v.slug]).map((v) => page(`/vat-calculator/${v.slug}`, 0.8)),
    page("/kids", 0.85),
    page("/trivia", 0.85),
    page("/trivia/family-quiz-night", 0.8),
    page("/listen", 0.85),
    ...SHOWS.map((s) => page(`/listen/${s.slug}`, 0.6)),
    ...["daily-challenge", "times-tables", "memory-game", "maths-worksheets"].map((s) => page(`/kids/${s}`, 0.8)),
  ];

  const local: Entry[] = [
    page("/web-design-jos", 0.85),
    page("/web-design-abuja", 0.85),
    ...CITIES.map((c) => page(`/web-design-${c.slug}`, 0.85)),
  ];

  const industries: Entry[] = [page("/websites", 0.85), ...INDUSTRIES.map((i) => page(`/websites/${i.slug}`, 0.85))];
  const templates: Entry[] = PAGE_TEMPLATES.map((t) => page(`/templates/${t.slug}`, 0.6));
  const components: Entry[] = UI_COMPONENTS.map((c) => page(`/components/${c.slug}`, 0.5));

  return [...MONEY, ...tools, ...worldwide, ...ebooks, ...products, ...industries, ...local, ...BLOG, ...TRUST, ...templates, ...components];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];
  for (const e of entries()) {
    if (seen.has(e.path)) continue;
    seen.add(e.path);
    const modified = e.modified ? new Date(e.modified) : BUILT;
    out.push({
      url: `${SITE_URL}${e.path}`,
      lastModified: Number.isNaN(modified.getTime()) ? BUILT : modified,
      changeFrequency: e.freq,
      priority: e.priority,
      // Next writes image URLs into the XML unescaped, and a bare "&" (Unsplash query strings) breaks the whole sitemap.
      ...(e.images ? { images: e.images.map((src) => src.replace(/&(?!amp;)/g, "&amp;")) } : {}),
    });
  }
  return out;
}
