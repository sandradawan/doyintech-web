import type { MetadataRoute } from "next";
import { TOOLS_META } from "@/lib/tools/config";

const BASE = "https://doyintech.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/hire",
    "/ops",
    "/products",
    "/ebooks",
    "/components",
    "/templates",
    "/free-audit",
    "/pricing",
    "/services",
    "/services/backend",
    "/services/mobile",
    "/services/ai-automation",
    "/tools",
    "/portfolio",
    "/store",
    "/blog",
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
        : path === "/hire" || path === "/products" || path === "/ops"
          ? 0.95
          : path.startsWith("/tools")
            ? 0.9
            : path === "/case-studies" || path.startsWith("/case-studies")
              ? 0.75
              : 0.8,
  }));
}
