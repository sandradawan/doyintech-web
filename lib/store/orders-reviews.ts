import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { StoreListing } from "./types";
import { dbGetBySlug, dbListApproved } from "./db";

export type StoreOrderRow = {
  id: string;
  listing_id: string | null;
  listing_slug: string | null;
  buyer_email: string;
  amount_kobo: number;
  paystack_reference: string | null;
  status: string;
  download_token: string | null;
  download_expires_at: string | null;
  created_at: string;
};

export async function dbListOrdersByEmail(email: string): Promise<StoreOrderRow[]> {
  const sb = getSupabaseAdmin();
  if (!sb) return [];
  const { data, error } = await sb
    .from("store_orders")
    .select("*")
    .eq("buyer_email", email.toLowerCase().trim())
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("dbListOrdersByEmail", error.message);
    return [];
  }
  return (data || []) as StoreOrderRow[];
}

export type StoreReviewRow = {
  id: string;
  listing_id: string;
  reviewer_email: string;
  reviewer_name: string | null;
  rating: number;
  body: string | null;
  status: string;
  created_at: string;
};

export async function dbListReviews(listingId: string): Promise<StoreReviewRow[]> {
  const sb = getSupabaseAdmin();
  if (!sb) return [];
  const { data, error } = await sb
    .from("store_reviews")
    .select("*")
    .eq("listing_id", listingId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("dbListReviews", error.message);
    return [];
  }
  return (data || []) as StoreReviewRow[];
}

export async function dbListReviewsBySlug(slug: string): Promise<StoreReviewRow[]> {
  const listing = await dbGetBySlug(slug);
  if (!listing) return [];
  return dbListReviews(listing.id);
}

export async function dbCreateReview(input: {
  listingId: string;
  reviewerEmail: string;
  reviewerName?: string;
  rating: number;
  body?: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, error: "Database not configured" };

  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));
  const email = input.reviewerEmail.toLowerCase().trim();
  if (!email.includes("@")) return { ok: false, error: "Valid email required" };

  const { data, error } = await sb
    .from("store_reviews")
    .upsert(
      {
        listing_id: input.listingId,
        reviewer_email: email,
        reviewer_name: (input.reviewerName || "").slice(0, 80) || null,
        rating,
        body: (input.body || "").slice(0, 2000) || null,
        status: "published",
      },
      { onConflict: "listing_id,reviewer_email" }
    )
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("dbCreateReview", error.message);
    return { ok: false, error: "Could not save review" };
  }
  return { ok: true, id: data?.id || "" };
}

export async function dbListingsByDeveloperName(name: string): Promise<StoreListing[]> {
  const all = await dbListApproved();
  if (!all) return [];
  const n = name.toLowerCase().trim();
  return all.filter((l) => l.developerName.toLowerCase() === n);
}
