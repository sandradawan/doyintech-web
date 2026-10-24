import { NextRequest, NextResponse, after } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { db, isPaidStore, storeForOwner } from "@/lib/storefront/server";
import { FREE_PLAN_FEE_PERCENT, FREE_PRODUCT_LIMIT, STORE_CATEGORIES, isValidSlug, normalizeSlug, normalizeWhatsapp } from "@/lib/storefront/shared";
import { recordEvent } from "@/lib/analytics/server";
import { enrollSubscriber } from "@/lib/newsletter/enroll";
import { limitRequest } from "@/lib/rate-limit";

const NO_STORE = { "Cache-Control": "private, no-store" };

/** The signed-in seller's store, products, recent orders and plan. */
export async function GET(req: NextRequest) {
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const store = await storeForOwner(user.id);
  const paid = await isPaidStore(user.email);
  if (!store) return NextResponse.json({ store: null, paid, freeLimit: FREE_PRODUCT_LIMIT }, { headers: NO_STORE });

  const since = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();
  const views = (labels: string[], days: number) =>
    db().from("site_events").select("id", { count: "exact", head: true }).eq("name", "shop_view").in("label", labels).gte("created_at", since(days));
  const [{ data: products }, { data: orders }, { data: discounts }, { data: requests }, v7, v30, dir30] = await Promise.all([
    db().from("storefront_products").select("*").eq("store_id", store.id).order("sort").order("created_at"),
    db()
      .from("storefront_orders")
      .select(
        "reference, customer_name, customer_phone, items, amount_kobo, status, created_at, paid_at, delivery_zone, delivery_address, discount_code, platform_fee_kobo"
      )
      .eq("store_id", store.id)
      .order("created_at", { ascending: false })
      .limit(50),
    db()
      .from("storefront_discounts")
      .select("code, percent_off, amount_off_kobo, min_subtotal_kobo, max_uses, uses, expires_at, active")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false }),
    db()
      .from("storefront_payment_requests")
      .select("reference, title, amount_kobo, customer_name, customer_email, due_date, status, paid_at, reminders_sent, created_at")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false })
      .limit(50),
    views([store.slug, `${store.slug}:dir`], 7),
    views([store.slug, `${store.slug}:dir`], 30),
    views([`${store.slug}:dir`], 30),
  ]);

  return NextResponse.json(
    {
      store,
      products: products || [],
      orders: orders || [],
      discounts: discounts || [],
      requests: requests || [],
      paid,
      freeLimit: FREE_PRODUCT_LIMIT,
      stats: { views7: v7.count ?? 0, views30: v30.count ?? 0, fromDoyinTech30: dir30.count ?? 0 },
      feePercent: paid ? 0 : FREE_PLAN_FEE_PERCENT,
    },
    { headers: NO_STORE }
  );
}

/** Create or update the seller's store (one store per account). */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "storefront-me", 30, 60_000);
  if (limited) return limited;
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim().slice(0, 80);
  const slug = normalizeSlug(String(body.slug || name));
  const tagline = String(body.tagline || "").trim().slice(0, 160) || null;
  const category = (STORE_CATEGORIES as readonly string[]).includes(String(body.category)) ? String(body.category) : null;
  const city = String(body.city || "").trim().replace(/s+/g, " ").slice(0, 40) || null;
  const whatsapp = normalizeWhatsapp(String(body.whatsapp || ""));
  const isPublished = body.is_published !== false;

  if (name.length < 2) return NextResponse.json({ error: "Enter your shop name." }, { status: 400 });
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Choose a shop link of 3–40 letters, numbers or dashes." }, { status: 400 });
  }
  if (!whatsapp) return NextResponse.json({ error: "Enter a valid WhatsApp number." }, { status: 400 });

  const existing = await storeForOwner(user.id);
  const row = { name, slug, tagline, whatsapp, category, city, is_published: isPublished, updated_at: new Date().toISOString() };
  const { data, error } = existing
    ? await db().from("storefronts").update(row).eq("id", existing.id).select("id, slug").single()
    : await db()
        .from("storefronts")
        .insert({ ...row, owner_id: user.id, owner_email: user.email })
        .select("id, slug")
        .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "That shop link is taken. Try another." }, { status: 409 });
    }
    console.error("storefront save", error.message);
    return NextResponse.json({ error: "Could not save your shop." }, { status: 500 });
  }
  if (!existing && user.email) {
    const email = user.email;
    after(async () => {
      await recordEvent("shop_created", { req, label: slug });
      await enrollSubscriber({ email, name: null, source: "store", sequence: "store" });
    });
  }
  return NextResponse.json({ ok: true, store: data });
}
