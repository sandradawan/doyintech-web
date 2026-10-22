import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { db, isPaidStore, storeForOwner } from "@/lib/storefront/server";
import { FREE_PRODUCT_LIMIT, isValidSlug, normalizeSlug, normalizeWhatsapp } from "@/lib/storefront/shared";
import { limitRequest } from "@/lib/rate-limit";

const NO_STORE = { "Cache-Control": "private, no-store" };

/** The signed-in seller's store, products, recent orders and plan. */
export async function GET(req: NextRequest) {
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const store = await storeForOwner(user.id);
  const paid = await isPaidStore(user.email);
  if (!store) return NextResponse.json({ store: null, paid, freeLimit: FREE_PRODUCT_LIMIT }, { headers: NO_STORE });

  const [{ data: products }, { data: orders }] = await Promise.all([
    db().from("storefront_products").select("*").eq("store_id", store.id).order("sort").order("created_at"),
    db()
      .from("storefront_orders")
      .select("reference, customer_name, customer_phone, items, amount_kobo, status, created_at, paid_at")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return NextResponse.json(
    { store, products: products || [], orders: orders || [], paid, freeLimit: FREE_PRODUCT_LIMIT },
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
  const whatsapp = normalizeWhatsapp(String(body.whatsapp || ""));
  const isPublished = body.is_published !== false;

  if (name.length < 2) return NextResponse.json({ error: "Enter your shop name." }, { status: 400 });
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Choose a shop link of 3–40 letters, numbers or dashes." }, { status: 400 });
  }
  if (!whatsapp) return NextResponse.json({ error: "Enter a valid WhatsApp number." }, { status: 400 });

  const existing = await storeForOwner(user.id);
  const row = { name, slug, tagline, whatsapp, is_published: isPublished, updated_at: new Date().toISOString() };
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
  return NextResponse.json({ ok: true, store: data });
}
