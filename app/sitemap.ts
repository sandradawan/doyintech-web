import type { MetadataRoute } from "next";
import { TOOLS_META } from "@/lib/tools/config";

const BASE = "https://doyintech.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/hire",
    "/pricing-quiz",
    "/refer",
    "/status-pack",
    "/ops",
    "/products",
    "/ebooks",
    "/components",
    "/templates",
    "/free-audit",
    "/local-seo",
    "/white-label",
    "/pricing",
    "/services",
    "/services/backend",
    "/services/mobile",
    "/services/ai-automation",
    "/tools",
    "/portfolio",
    "/store",
    "/blog",
    "/blog/website-for-salon-nigeria",
    "/blog/whatsapp-booking-system-nigeria",
    "/blog/website-for-clinic-nigeria",
    "/blog/property-website-nigeria",
    "/blog/website-for-gaming-lounge-nigeria",
    "/blog/why-production-grade-backends-matter",
    "/blog/laravel-vs-node-when-to-choose",
    "/blog/practical-ai-automation-for-smes",
    "/about",
    "/contact",
    "/company-profile",
    "/privacy",
    "/terms",
    "/case-studies",
    "/case-studies/imperial-villa",
    "/case-studies/doyinmart",
    "/case-studies/legacyplay",
    "/case-studies/jennyglams",
    "/case-studies/arqademy-cbt",
    "/case-studies/ipvl",
  ];

  const toolRoutes = TOOLS_META.map((t) => t.href);
  const routes = [...new Set([...staticRoutes, ...toolRoutes])];

  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency:
      path === "" || path === "/blog" || path === "/products" || path === "/ops" || path.startsWith("/tools")
        ? "weekly"
        : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/hire" || path === "/products" || path === "/ops" || path === "/free-audit"
          ? 0.95
          : path.startsWith("/tools")
            ? 0.9
            : path.startsWith("/blog/")
              ? 0.85
              : path === "/case-studies" || path.startsWith("/case-studies")
                ? 0.75
                : 0.8,
  }));
}
