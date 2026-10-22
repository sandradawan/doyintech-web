import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { db, findDiscount, isPaidStore, publicStore, storeForOwner } from "@/lib/storefront/server";
import { normalizeCode } from "@/lib/storefront/shared";
import { limitRequest } from "@/lib/rate-limit";

async function owner(req: NextRequest) {
  const user = await userFromBearer(req);
  if (!user) return { error: NextResponse.json({ error: "Sign in required" }, { status: 401 }) };
  const store = await storeForOwner(user.id);
  if (!store) return { error: NextResponse.json({ error: "Create your shop first." }, { status: 400 }) };
  return { user, store };
}

/** Public: check a code on a shop's checkout. ?slug=…&code=… */
export async function GET(req: NextRequest) {
  const limited = limitRequest(req, "storefront-discount-check", 30, 60_000);
  if (limited) return limited;
  const slug = req.nextUrl.searchParams.get("slug") || "";
  const code = req.nextUrl.searchParams.get("code") || "";
  const data = await publicStore(slug);
  if (!data) return NextResponse.json({ error: "Shop not found." }, { status: 404 });
  const discount = await findDiscount(data.store.id, code);
  if (!discount) return NextResponse.json({ error: "That code isn't valid." }, { status: 404 });
  return NextResponse.json({ discount });
}

/** Seller: create a code (Store plan). Body: { code, percent_off? | amount_off_ngn?, min_subtotal_ngn?, max_uses?, expires_at? } */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "storefront-discounts", 30, 60_000);
  if (limited) return limited;
  const o = await owner(req);
  if (o.error) return o.error;
  if (!(await isPaidStore(o.user.email))) {
    return NextResponse.json({ error: "Discount codes are part of the Store plan.", code: "UPGRADE" }, { status: 402 });
  }

  const body = await req.json().catch(() => ({}));
  const code = normalizeCode(String(body.code || ""));
  if (code.length < 3) return NextResponse.json({ error: "Use 3–20 letters or numbers for the code." }, { status: 400 });
  const percent = Math.round(Number(body.percent_off) || 0);
  const amountOff = Math.round((Number(body.amount_off_ngn) || 0) * 100);
  if ((percent > 0) === (amountOff > 0)) {
    return NextResponse.json({ error: "Set either a percentage or a naira amount off." }, { status: 400 });
  }
  if (percent && (percent < 1 || percent > 90)) {
    return NextResponse.json({ error: "Percentage must be between 1 and 90." }, { status: 400 });
  }
  const maxUses = Math.round(Number(body.max_uses) || 0);
  const expires = body.expires_at ? new Date(String(body.expires_at)) : null;
  if (expires && Number.isNaN(expires.getTime())) return NextResponse.json({ error: "Invalid end date." }, { status: 400 });

  const { error } = await db()
    .from("storefront_discounts")
    .insert({
      store_id: o.store.id,
      code,
      percent_off: percent || null,
      amount_off_kobo: amountOff || null,
      min_subtotal_kobo: Math.max(0, Math.round((Number(body.min_subtotal_ngn) || 0) * 100)),
      max_uses: maxUses > 0 ? maxUses : null,
      expires_at: expires ? expires.toISOString() : null,
    });
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "You already have that code." }, { status: 409 });
    return NextResponse.json({ error: "Could not save the code." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, code });
}

/** Seller: switch a code on or off. Body: { code, active } */
export async function PATCH(req: NextRequest) {
  const o = await owner(req);
  if (o.error) return o.error;
  const body = await req.json().catch(() => ({}));
  const { error } = await db()
    .from("storefront_discounts")
    .update({ active: body.active === true })
    .eq("store_id", o.store.id)
    .eq("code", normalizeCode(String(body.code || "")));
  if (error) return NextResponse.json({ error: "Could not update the code." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** Seller: delete a code. ?code=… */
export async function DELETE(req: NextRequest) {
  const o = await owner(req);
  if (o.error) return o.error;
  await db()
    .from("storefront_discounts")
    .delete()
    .eq("store_id", o.store.id)
    .eq("code", normalizeCode(req.nextUrl.searchParams.get("code") || ""));
  return NextResponse.json({ ok: true });
}
