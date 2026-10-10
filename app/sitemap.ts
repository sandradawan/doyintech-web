import type { MetadataRoute } from "next";
import { TOOLS_META } from "@/lib/tools/config";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

/** Public marketing URLs only — no /admin, /ops, /auth, /api, /wallet. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/hire",
    "/pricing",
    "/pricing-quiz",
    "/free-audit",
    "/products",
    "/ebooks",
    "/store",
    "/bills",
    "/solve",
    "/ai",
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
    "/status-pack",
    "/agency-vs-freelancer",
    "/web-design-jos",
    "/web-design-abuja",
    "/local-seo",
    "/components",
    "/templates",
    "/white-label",
    "/apps",
    "/apps/doyinshield",
    "/apps/whatsapp-agent",
    "/apps/build-plan-30d",
    "/outreach",
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
    "/students/projects/track",
  ];

  const toolRoutes = TOOLS_META.map((t) => t.href);
  const routes = [...new Set([...staticRoutes, ...toolRoutes])];

  return routes.map((path) => {
    const isHome = path === "";
    const isMoney =
      path === "/hire" ||
      path === "/products" ||
      path === "/free-audit" ||
      path === "/bills" ||
      path === "/pricing" ||
      path === "/ai" ||
      path.startsWith("/students");
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
