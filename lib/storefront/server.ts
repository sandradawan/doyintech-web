/** DoyinTech Store: server-only data access, entitlements and Paystack calls. */
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { hasActiveFamily } from "@/lib/subscriptions/server";
import type { StoreProduct, Storefront } from "@/lib/storefront/shared";

const STORE_COLUMNS =
  "id, slug, name, tagline, whatsapp, is_published, payments_status, bank_name, account_name, account_last4";

export function db() {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Database not configured");
  return sb;
}

export async function storeForOwner(ownerId: string): Promise<(Storefront & { owner_email: string }) | null> {
  const { data } = await db()
    .from("storefronts")
    .select(`${STORE_COLUMNS}, owner_email`)
    .eq("owner_id", ownerId)
    .maybeSingle();
  return (data as (Storefront & { owner_email: string }) | null) ?? null;
}

export async function publicStore(
  slug: string
): Promise<{ store: Storefront & { owner_email: string; paystack_subaccount_code: string | null }; products: StoreProduct[] } | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data: store } = await sb
    .from("storefronts")
    .select(`${STORE_COLUMNS}, owner_email, paystack_subaccount_code`)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!store) return null;
  const { data: products } = await sb
    .from("storefront_products")
    .select("id, store_id, name, description, price_kobo, image_url, in_stock, sort")
    .eq("store_id", store.id)
    .order("sort", { ascending: true })
    .order("created_at", { ascending: true });
  return { store: store as never, products: (products as StoreProduct[]) || [] };
}

/** Paid Store plan: unlimited products, Paystack checkout, no badge. */
export function isPaidStore(ownerEmail: string): Promise<boolean> {
  return hasActiveFamily(ownerEmail, "store");
}

/** Online checkout needs the paid plan AND an admin-approved Paystack subaccount. */
export async function canTakePayments(store: {
  owner_email: string;
  payments_status: string;
  paystack_subaccount_code?: string | null;
}): Promise<boolean> {
  if (store.payments_status !== "active" || !store.paystack_subaccount_code) return false;
  return isPaidStore(store.owner_email);
}

export async function paystack<T = Record<string, unknown>>(
  path: string,
  init: { method?: string; body?: unknown } = {}
): Promise<{ ok: boolean; data?: T; message?: string }> {
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  if (!secret) return { ok: false, message: "Payments are not configured." };
  const res = await fetch(`https://api.paystack.co${path}`, {
    method: init.method || "GET",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as { status?: boolean; data?: T; message?: string } | null;
  return { ok: res.ok && !!json?.status, data: json?.data, message: json?.message };
}
