import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Private, transactional and internal-tool routes stay out of search results. */
const DISALLOW = [
  "/api/",
  "/admin",
  "/auth/",
  "/wallet",
  "/ops",
  "/client-portal",
  "/apps/",
  "/nurture",
  "/outreach",
  "/status-pack",
  "/store/admin",
  "/store/dashboard",
  "/store/developer",
  "/store/purchases",
  "/products/success",
  "/hire/success",
  "/reports/success",
  "/reports/track",
  "/reports/view/",
  "/students/projects/track",
  "/account",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: DISALLOW }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
