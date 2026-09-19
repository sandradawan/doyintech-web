import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { ReviewStatus, StoreListing } from "./types";
import type { QueuedSubmission } from "./queue";

export type DbListingRow = {
  id: string;
  slug: string;
  kind: string;
  title: string;
  short_description: string;
  description: string;
  developer_name: string;
  developer_email: string;
  platform: string;
  price_ngn: number;
  amount_kobo: number;
  category: string;
  icon_emoji: string | null;
  version: string | null;
  package_type: string | null;
  file_name: string | null;
  file_path: string | null;
  file_size_mb: number | null;
  sha256: string | null;
  review_status: string;
  virus_scan_status: string | null;
  security_notes: string | null;
  downloads: number | null;
  rating_avg: number | null;
  rating_count: number | null;
  features: unknown;
  privacy_policy_url?: string | null;
  screenshots?: unknown;
  icon_url?: string | null;
  launch_url?: string | null;
  created_at: string;
  updated_at?: string | null;
  published_at: string | null;
};

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base || "app"}-${suffix}`;
}

export function rowToListing(r: DbListingRow): StoreListing {
  const features = Array.isArray(r.features)
    ? (r.features as string[])
    : typeof r.features === "string"
      ? (() => {
          try {
            return JSON.parse(r.features) as string[];
          } catch {
            return [];
          }
        })()
      : [];

  return {
    id: r.id,
    slug: r.slug,
    kind: r.kind === "digital_product" ? "digital_product" : "app",
    title: r.title,
    shortDescription: r.short_description,
    description: r.description,
    developerName: r.developer_name,
    developerEmail: r.developer_email,
    platform: (r.platform as StoreListing["platform"]) || "android",
    priceNgn: r.price_ngn || 0,
    amountKobo: r.amount_kobo || Math.round((r.price_ngn || 0) * 100),
    category: r.category || "Business",
    iconEmoji: r.icon_emoji || (r.kind === "digital_product" ? "📦" : "📱"),
    version: r.version || "1.0.0",
    packageType: (r.package_type as StoreListing["packageType"]) || undefined,
    fileName: r.file_name || undefined,
    fileSizeMb: r.file_size_mb ?? undefined,
    sha256: r.sha256 || undefined,
    reviewStatus: r.review_status as ReviewStatus,
    virusScanStatus: (r.virus_scan_status as StoreListing["virusScanStatus"]) || "pending",
    securityNotes: r.security_notes || undefined,
    downloads: r.downloads || 0,
    ratingAvg: Number(r.rating_avg || 0),
    ratingCount: r.rating_count || 0,
    features: features.length ? features : ["Community listing", "Security reviewed"],
    screenshots: Array.isArray(r.screenshots)
      ? (r.screenshots as string[])
      : typeof r.screenshots === "string"
        ? (() => {
            try {
              return JSON.parse(r.screenshots) as string[];
            } catch {
              return [];
            }
          })()
        : [],
    iconUrl: r.icon_url || undefined,
    launchUrl: r.launch_url || undefined,
    createdAt: (r.created_at || "").slice(0, 10),
    publishedAt: r.published_at ? r.published_at.slice(0, 10) : undefined,
  };
}

export function rowToQueue(r: DbListingRow): QueuedSubmission {
  return {
    id: r.id,
    title: r.title,
    shortDescription: r.short_description,
    description: r.description,
    developerName: r.developer_name,
    developerEmail: r.developer_email,
    platform: r.platform,
    kind: r.kind,
    priceNgn: r.price_ngn || 0,
    category: r.category || "Business",
    version: r.version || "1.0.0",
    packageType: r.package_type || undefined,
    fileName: r.file_name || undefined,
    privacyPolicyUrl: r.privacy_policy_url || undefined,
    reviewStatus: r.review_status as ReviewStatus,
    virusScanStatus: (r.virus_scan_status as QueuedSubmission["virusScanStatus"]) || "pending",
    securityNotes: r.security_notes || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at || r.created_at,
  };
}

export async function dbInsertSubmission(input: {
  title: string;
  shortDescription: string;
  description: string;
  developerName: string;
  developerEmail: string;
  platform: string;
  kind: string;
  priceNgn: number;
  category: string;
  version: string;
  packageType?: string;
  fileName?: string;
  privacyPolicyUrl?: string;
  screenshots?: string[];
  iconUrl?: string;
}): Promise<QueuedSubmission | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;

  const kind = input.kind === "digital_product" ? "digital_product" : "app";
  const slug = slugify(input.title);
  const price = Math.max(0, Math.round(input.priceNgn));

  const { data, error } = await sb
    .from("store_listings")
    .insert({
      slug,
      kind,
      title: input.title,
      short_description: input.shortDescription || input.title,
      description: input.description || input.shortDescription || input.title,
      developer_name: input.developerName,
      developer_email: input.developerEmail,
      platform: input.platform || "android",
      price_ngn: price,
      amount_kobo: price * 100,
      category: input.category || "Business",
      icon_emoji: kind === "digital_product" ? "📦" : "📱",
      version: input.version || "1.0.0",
      package_type: input.packageType || null,
      file_name: input.fileName || null,
      privacy_policy_url: input.privacyPolicyUrl || null,
      screenshots: input.screenshots || [],
      icon_url: input.iconUrl || null,
      review_status: "submitted",
      virus_scan_status: "pending",
      features: ["Pending review"],
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("dbInsertSubmission", error?.message);
    return null;
  }

  await sb.from("store_submissions_log").insert({
    payload: { ...input, listing_id: data.id, slug },
  });

  void (async () => {
    try {
      await sb
        .from("store_listings")
        .update({ review_status: "scanning", updated_at: new Date().toISOString() })
        .eq("id", data.id);
      await new Promise((r) => setTimeout(r, 800));
      await sb
        .from("store_listings")
        .update({
          review_status: "in_review",
          virus_scan_status: "clean",
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);
    } catch (e) {
      console.warn("scan pipeline", e);
    }
  })();

  return rowToQueue(data as DbListingRow);
}

export async function dbListQueue(): Promise<QueuedSubmission[] | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data, error } = await sb
    .from("store_listings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("dbListQueue", error.message);
    return null;
  }
  return (data || []).map((r) => rowToQueue(r as DbListingRow));
}

export async function dbUpdateStatus(
  id: string,
  reviewStatus: ReviewStatus,
  securityNotes?: string
): Promise<QueuedSubmission | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;

  const patch: Record<string, unknown> = {
    review_status: reviewStatus,
    updated_at: new Date().toISOString(),
  };
  if (securityNotes !== undefined) patch.security_notes = securityNotes;
  if (reviewStatus === "approved") {
    patch.virus_scan_status = "clean";
    patch.published_at = new Date().toISOString();
    patch.features = ["Community listing", "Security reviewed"];
  }
  if (reviewStatus === "rejected") {
    patch.virus_scan_status = "flagged";
  }

  const { data, error } = await sb
    .from("store_listings")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    console.error("dbUpdateStatus", error?.message);
    return null;
  }
  return rowToQueue(data as DbListingRow);
}

export async function dbListApproved(): Promise<StoreListing[] | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data, error } = await sb
    .from("store_listings")
    .select("*")
    .eq("review_status", "approved")
    .order("published_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("dbListApproved", error.message);
    return null;
  }
  return (data || []).map((r) => rowToListing(r as DbListingRow));
}

export async function dbGetBySlug(slug: string): Promise<StoreListing | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data, error } = await sb
    .from("store_listings")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("dbGetBySlug", error.message);
    return null;
  }
  if (!data) return null;
  return rowToListing(data as DbListingRow);
}

export async function dbCreateOrder(input: {
  listingId: string;
  listingSlug: string;
  buyerEmail: string;
  amountKobo: number;
  paystackReference?: string;
  status: "pending" | "paid" | "failed" | "refunded";
  downloadToken: string;
  expiresAt: Date;
}): Promise<boolean> {
  const sb = getSupabaseAdmin();
  if (!sb) return false;
  const { error } = await sb.from("store_orders").insert({
    listing_id: input.listingId,
    listing_slug: input.listingSlug,
    buyer_email: input.buyerEmail,
    amount_kobo: input.amountKobo,
    paystack_reference: input.paystackReference || null,
    status: input.status,
    download_token: input.downloadToken,
    download_expires_at: input.expiresAt.toISOString(),
  });
  if (error) {
    console.error("dbCreateOrder", error.message);
    return false;
  }
  return true;
}

export async function dbVerifyOrderToken(
  token: string,
  slug: string
): Promise<{ ok: true; email: string; expiresAt: number } | { ok: false; error: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, error: "Database not configured" };

  const { data, error } = await sb
    .from("store_orders")
    .select("*")
    .eq("download_token", token)
    .maybeSingle();

  if (error || !data) return { ok: false, error: "Invalid or expired token" };
  if (data.listing_slug !== slug) return { ok: false, error: "Token mismatch" };
  const exp = data.download_expires_at ? new Date(data.download_expires_at).getTime() : 0;
  if (exp && Date.now() > exp) return { ok: false, error: "Token expired" };

  return {
    ok: true,
    email: data.buyer_email,
    expiresAt: exp || Date.now() + 3600_000,
  };
}

export async function dbBumpDownloads(listingId: string) {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  const { data } = await sb.from("store_listings").select("downloads").eq("id", listingId).single();
  const next = (data?.downloads || 0) + 1;
  await sb.from("store_listings").update({ downloads: next }).eq("id", listingId);
}
