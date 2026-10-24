/** Data for the public /shops directory. Sponsored shops first, then shops with the most products. */
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type DirectoryShop = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  category: string | null;
  city: string | null;
  sponsored: boolean;
  productCount: number;
  fromKobo: number | null;
  images: string[];
};

export async function listShops(opts: { q?: string; category?: string; city?: string }): Promise<DirectoryShop[]> {
  const sb = getSupabaseAdmin();
  if (!sb) return [];

  let query = sb
    .from("storefronts")
    .select("id, slug, name, tagline, category, city, featured_until, created_at")
    .eq("is_published", true)
    .limit(500);
  const q = (opts.q || "").replace(/[%_,()*\\:"']/g, " ").trim().slice(0, 60);
  if (q) query = query.or(`name.ilike.%${q}%,tagline.ilike.%${q}%`);
  if (opts.category) query = query.eq("category", opts.category);
  const city = (opts.city || "").replace(/[%_,()*\\:"']/g, " ").trim().slice(0, 40);
  if (city) query = query.ilike("city", `%${city}%`);

  const { data: stores, error } = await query;
  if (error || !stores?.length) return [];

  const ids = stores.map((s) => s.id);
  const { data: products } = await sb
    .from("storefront_products")
    .select("store_id, price_kobo, image_url, sort")
    .in("store_id", ids)
    .eq("in_stock", true)
    .order("sort", { ascending: true })
    .limit(5000);

  const byStore = new Map<string, { count: number; min: number | null; images: string[] }>();
  for (const p of products || []) {
    const b = byStore.get(p.store_id) || { count: 0, min: null, images: [] };
    b.count++;
    b.min = b.min === null ? p.price_kobo : Math.min(b.min, p.price_kobo);
    if (p.image_url && b.images.length < 3) b.images.push(p.image_url);
    byStore.set(p.store_id, b);
  }

  const now = Date.now();
  return stores
    .map((s) => {
      const b = byStore.get(s.id);
      return {
        id: s.id,
        slug: s.slug,
        name: s.name,
        tagline: s.tagline,
        category: s.category,
        city: s.city,
        sponsored: Boolean(s.featured_until && new Date(s.featured_until).getTime() > now),
        productCount: b?.count || 0,
        fromKobo: b?.min ?? null,
        images: b?.images || [],
        created: s.created_at as string,
      };
    })
    .filter((s) => s.productCount > 0)
    .sort((a, b) => Number(b.sponsored) - Number(a.sponsored) || b.images.length - a.images.length || b.productCount - a.productCount || (a.created < b.created ? 1 : -1))
    .map((shop) => {
      const { created, ...rest } = shop;
      void created;
      return rest;
    });
}
