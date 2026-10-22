import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { db, storeForOwner } from "@/lib/storefront/server";
import { cleanZones } from "@/lib/storefront/shared";
import { limitRequest } from "@/lib/rate-limit";

/** Replace the seller's delivery areas and fees. An empty list means delivery is arranged on WhatsApp. */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "storefront-delivery", 30, 60_000);
  if (limited) return limited;
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const store = await storeForOwner(user.id);
  if (!store) return NextResponse.json({ error: "Create your shop first." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const zones = cleanZones(body.zones);
  const { error } = await db()
    .from("storefronts")
    .update({ delivery_zones: zones, updated_at: new Date().toISOString() })
    .eq("id", store.id);
  if (error) return NextResponse.json({ error: "Could not save delivery areas." }, { status: 500 });
  return NextResponse.json({ ok: true, zones });
}
