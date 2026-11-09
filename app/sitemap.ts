import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { listPosts } from "@/lib/community/server";
import { postPath } from "@/lib/community/rules";

// New community questions should reach Google without waiting for a deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];
  for (const e of sitemapEntries()) {
    if (seen.has(e.path)) continue;
    seen.add(e.path);
    const modified = e.modified ? new Date(e.modified) : null;
    out.push({
      url: `${SITE_URL}${e.path}`,
      // Only a real date: stamping every page with the build time teaches Google to ignore lastmod.
      ...(modified && !Number.isNaN(modified.getTime()) ? { lastModified: modified } : {}),
      changeFrequency: e.freq,
      priority: e.priority,
      // Next writes image URLs into the XML unescaped, and a bare "&" (Unsplash query strings) breaks the whole sitemap.
      ...(e.images ? { images: e.images.map((src) => src.replace(/&(?!amp;)/g, "&amp;")) } : {}),
    });
  }
  const posts = await listPosts(500).catch(() => null);
  for (const post of posts ?? []) {
    out.push({ url: `${SITE_URL}${postPath(post)}`, ...(post.created_at ? { lastModified: new Date(post.created_at) } : {}), changeFrequency: "weekly", priority: 0.5 });
  }
  return out;
}
