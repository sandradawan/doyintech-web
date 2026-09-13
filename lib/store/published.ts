import type { StoreListing } from "./types";
import { STORE_LISTINGS } from "./catalog";
import { listQueue, type QueuedSubmission } from "./queue";

function slugify(title: string, id: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base || "app"}-${id.slice(-6)}`;
}

export function queueToListing(q: QueuedSubmission): StoreListing {
  return {
    id: q.id,
    slug: slugify(q.title, q.id),
    kind: q.kind === "digital_product" ? "digital_product" : "app",
    title: q.title,
    shortDescription: q.shortDescription || q.title,
    description: q.description || q.shortDescription || q.title,
    developerName: q.developerName,
    developerEmail: q.developerEmail,
    platform: (q.platform as StoreListing["platform"]) || "android",
    priceNgn: q.priceNgn || 0,
    amountKobo: Math.round((q.priceNgn || 0) * 100),
    category: q.category || "Business",
    iconEmoji: q.kind === "digital_product" ? "📦" : "📱",
    version: q.version || "1.0.0",
    packageType: (q.packageType as StoreListing["packageType"]) || "apk",
    fileName: q.fileName,
    reviewStatus: "approved",
    virusScanStatus: q.virusScanStatus === "flagged" ? "flagged" : "clean",
    securityNotes: q.securityNotes,
    downloads: 0,
    ratingAvg: 0,
    ratingCount: 0,
    features: ["Community listing", "Security reviewed"],
    createdAt: q.createdAt.slice(0, 10),
    publishedAt: q.updatedAt.slice(0, 10),
  };
}

/** Public catalog = seeds + approved queue items (this server instance) */
export function getAllPublishedListings(): StoreListing[] {
  const fromQueue = listQueue()
    .filter((q) => q.reviewStatus === "approved")
    .map(queueToListing);
  const slugs = new Set(STORE_LISTINGS.map((l) => l.slug));
  const extra = fromQueue.filter((l) => !slugs.has(l.slug));
  return [...STORE_LISTINGS.filter((l) => l.reviewStatus === "approved"), ...extra];
}

export function getPublishedBySlug(slug: string): StoreListing | undefined {
  return getAllPublishedListings().find((l) => l.slug === slug);
}
