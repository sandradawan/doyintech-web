import type { MetadataRoute } from "next";

const BASE = "https://doyintech.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    "",
    "/services",
    "/services/backend",
    "/services/mobile",
    "/services/ai-automation",
    "/tools",
    "/tools/website-calculator",
    "/tools/business-audit",
    "/tools/cv-builder",
    "/tools/digital-readiness",
    "/portfolio",
    "/blog",
    "/blog/why-production-grade-backends-matter",
    "/blog/laravel-vs-node-when-to-choose",
    "/blog/practical-ai-automation-for-smes",
    "/about",
    "/contact",
    "/company-profile",
    "/privacy",
    "/terms",
    "/case-studies/imperial-villa",
    "/case-studies/doyinmart",
    "/case-studies/legacyplay",
    "/case-studies/jennyglams",
    "/case-studies/arqademy-cbt",
    "/case-studies/ipvl",
  ];

  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency:
      path === "" || path === "/blog" || path.startsWith("/tools")
        ? "weekly"
        : "monthly",
    priority:
      path === ""
        ? 1
        : path.startsWith("/tools")
          ? 0.9
          : path.startsWith("/case-studies")
            ? 0.7
            : 0.8,
  }));
}
