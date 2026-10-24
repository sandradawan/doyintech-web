/** Sponsored placement in the /shops directory: paid to DoyinTech, extends the shop's featured_until. */
import { randomBytes } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { PaystackTx } from "@/lib/payments/purchase";

export const BOOST_REF_RE = /^BST_[a-z0-9]{6,12}_[a-f0-9]{8}$/;

export function newBoostRef() {
  return `BST_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
}

/**
 * Marks a boost paid when `tx` is a successful NGN payment covering it, then pushes the shop's
 * featured_until forward (stacking on any time still left). Safe to call from webhook and return page.
 */
export async function markBoostPaid(tx: PaystackTx): Promise<boolean> {
  const sb = getSupabaseAdmin();
  if (!sb || !BOOST_REF_RE.test(tx.reference) || tx.status !== "success" || (tx.currency || "NGN").toUpperCase() !== "NGN") {
    return false;
  }
  const { data: boost } = await sb
    .from("storefront_boosts")
    .select("id, store_id, days, amount_kobo, status")
    .eq("reference", tx.reference)
    .maybeSingle();
  if (!boost || boost.status !== "pending" || tx.amount < boost.amount_kobo) return false;

  const { data: store } = await sb.from("storefronts").select("featured_until").eq("id", boost.store_id).maybeSingle();
  const now = Date.now();
  const current = store?.featured_until ? new Date(store.featured_until).getTime() : 0;
  const starts = new Date(Math.max(now, current));
  const ends = new Date(starts.getTime() + boost.days * 86_400_000);

  const { data: updated } = await sb
    .from("storefront_boosts")
    .update({ status: "paid", paid_at: tx.paid_at || new Date().toISOString(), starts_at: starts.toISOString(), ends_at: ends.toISOString() })
    .eq("id", boost.id)
    .eq("status", "pending")
    .select("id");
  if (!updated?.length) return false;

  await sb.from("storefronts").update({ featured_until: ends.toISOString() }).eq("id", boost.store_id);
  return true;
}
