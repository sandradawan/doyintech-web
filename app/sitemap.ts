import type { MetadataRoute } from "next";
import { TOOLS_META } from "@/lib/tools/config";
import { INDUSTRIES } from "@/lib/industries";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

/** Public marketing URLs only — no /admin, /ops, /api, account or internal tools. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/hire",
    "/website-cost-nigeria",
    "/care-plans",
    "/pro",
    "/pricing",
    "/free-audit",
    "/products",
    "/reports",
    "/ebooks",
    "/tools",
    "/tools/system-protector",
    "/services",
    "/services/backend",
    "/services/mobile",
    "/services/ai-automation",
    "/portfolio",
    "/case-studies",
    "/case-studies/imperial-villa",
    "/case-studies/doyinmart",
    "/case-studies/legacyplay",
    "/case-studies/jennyglams",
    "/case-studies/arqademy-cbt",
    "/case-studies/ipvl",
    "/refer",
    "/reviews",
    "/agency-vs-freelancer",
    "/web-design-jos",
    "/web-design-abuja",
    "/local-seo",
    "/components",
    "/templates",
    "/white-label",
    "/blog",
    "/blog/website-for-salon-nigeria",
    "/blog/whatsapp-booking-system-nigeria",
    "/blog/website-for-clinic-nigeria",
    "/blog/property-website-nigeria",
    "/blog/website-for-gaming-lounge-nigeria",
    "/blog/website-for-restaurant-nigeria",
    "/blog/website-for-church-event-nigeria",
    "/blog/why-production-grade-backends-matter",
    "/blog/laravel-vs-node-when-to-choose",
    "/blog/practical-ai-automation-for-smes",
    "/about",
    "/contact",
    "/company-profile",
    "/privacy",
    "/terms",
    "/students",
    "/students/analyzer",
    "/students/studio",
    "/students/citations",
    "/students/cover-letter",
    "/students/projects",
  ];

  const toolRoutes = TOOLS_META.map((t) => t.href);
  const industryRoutes = ["/websites", ...INDUSTRIES.map((i) => `/websites/${i.slug}`)];
  const routes = [...new Set([...staticRoutes, ...industryRoutes, ...toolRoutes])];

  return routes.map((path) => {
    const isHome = path === "";
    const isMoney = path.startsWith("/websites/") || [
      "/hire",
      "/website-cost-nigeria",
      "/tools/paye-calculator-nigeria",
      "/tools/invoice-generator-nigeria",
      "/tools/receipt-generator-nigeria",
      "/tools/small-company-tax-checker",
      "/care-plans",
      "/pro",
      "/pricing",
      "/products",
      "/ebooks",
      "/reports",
      "/free-audit",
    ].includes(path);
    const isTools = path.startsWith("/tools");
    const isBlog = path.startsWith("/blog");
    const isLocal = path.startsWith("/web-design-") || path === "/local-seo";

    return {
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency: (isHome || isTools || path === "/blog" || path === "/products"
        ? "weekly"
        : "monthly") as "weekly" | "monthly",
      priority: isHome
        ? 1
        : isMoney
          ? 0.95
          : isTools
            ? 0.9
            : isBlog || isLocal
              ? 0.85
              : path.startsWith("/case-studies")
                ? 0.75
                : 0.8,
    };
  });
}
