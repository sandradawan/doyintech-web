import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/admin/",
        "/nurture",
        "/ops",
        "/ops/",
        "/client-portal",
        "/apps/",
        "/auth/",
        "/wallet",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: "www.doyintech.com",
  };
}
