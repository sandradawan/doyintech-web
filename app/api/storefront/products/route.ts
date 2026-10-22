import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { db, isPaidStore, storeForOwner } from "@/lib/storefront/server";
import { FREE_PRODUCT_LIMIT } from "@/lib/storefront/shared";
import { limitRequest } from "@/lib/rate-limit";

async function sellerStore(req: NextRequest) {
  const user = await userFromBearer(req);
  if (!user) return { error: NextResponse.json({ error: "Sign in required" }, { status: 401 }) };
  const store = await storeForOwner(user.id);
  if (!store) return { error: NextResponse.json({ error: "Create your shop first." }, { status: 400 }) };
  return { user, store };
}

function productFields(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  if (body.name !== undefined) out.name = String(body.name).trim().slice(0, 120);
  if (body.description !== undefined) out.description = String(body.description).trim().slice(0, 1000) || null;
  if (body.price_ngn !== undefined) {
    const ngn = Number(body.price_ngn);
    if (!Number.isFinite(ngn) || ngn < 0 || ngn > 100_000_000) return { error: "Enter a valid price." };
    out.price_kobo = Math.round(ngn * 100);
  }
  if (body.image_url !== undefined) {
    const url = String(body.image_url || "");
    // Only images uploaded through our own bucket.
    if (url && !/^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/storefront\//.test(url)) {
      return { error: "Upload the image through the dashboard." };
    }
    out.image_url = url || null;
  }
  if (body.in_stock !== undefined) out.in_stock = Boolean(body.in_stock);
  if (body.sort !== undefined) out.sort = Math.max(0, Math.min(10_000, Number(body.sort) || 0));
  return { fields: out };
}

export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "storefront-products", 60, 60_000);
  if (limited) return limited;
  const ctx = await sellerStore(req);
  if ("error" in ctx) return ctx.error;

  const { fields, error } = productFields(await req.json().catch(() => ({})));
  if (error) return NextResponse.json({ error }, { status: 400 });
  if (!fields?.name || String(fields.name).length < 2) {
    return NextResponse.json({ error: "Enter a product name." }, { status: 400 });
  }
  if (fields.price_kobo === undefined) return NextResponse.json({ error: "Enter a price." }, { status: 400 });

  if (!(await isPaidStore(ctx.user.email))) {
    const { count } = await db()
      .from("storefront_products")
      .select("id", { count: "exact", head: true })
      .eq("store_id", ctx.store.id);
    if ((count || 0) >= FREE_PRODUCT_LIMIT) {
      return NextResponse.json(
        { error: `The free plan includes ${FREE_PRODUCT_LIMIT} products. Upgrade for unlimited products.`, code: "UPGRADE" },
        { status: 402 }
      );
    }
  }

  const { data, error: insErr } = await db()
    .from("storefront_products")
    .insert({ ...fields, store_id: ctx.store.id })
    .select("*")
    .single();
  if (insErr) return NextResponse.json({ error: "Could not add the product." }, { status: 500 });
  return NextResponse.json({ ok: true, product: data });
}

export async function PATCH(req: NextRequest) {
  const ctx = await sellerStore(req);
  if ("error" in ctx) return ctx.error;
  const body = await req.json().catch(() => ({}));
  const { fields, error } = productFields(body);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const { data, error: upErr } = await db()
    .from("storefront_products")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", String(body.id || ""))
    .eq("store_id", ctx.store.id) // ownership check
    .select("*")
    .maybeSingle();
  if (upErr || !data) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ ok: true, product: data });
}

export async function DELETE(req: NextRequest) {
  const ctx = await sellerStore(req);
  if ("error" in ctx) return ctx.error;
  const id = req.nextUrl.searchParams.get("id") || "";
  await db().from("storefront_products").delete().eq("id", id).eq("store_id", ctx.store.id);
  return NextResponse.json({ ok: true });
}
