import type { MetadataRoute } from "next";
import { TOOLS_META } from "@/lib/tools/config";

const BASE = "https://doyintech.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/services",
    "/services/backend",
    "/services/mobile",
    "/services/ai-automation",
    "/tools",
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

  const toolRoutes = TOOLS_META.map((t) => t.href);

  const routes = [...new Set([...staticRoutes, ...toolRoutes])];

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
