import { NextRequest, NextResponse } from "next/server";
import { getPublicListings } from "@/lib/real-estate/db";
import type { DealType, PropertyType } from "@/lib/real-estate/listings";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = clientIp(req);
  const rl = rateLimit(`re-search:${ip}`, 60, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const sp = req.nextUrl.searchParams;
  const location = (sp.get("location") || "").trim().toLowerCase();
  const propertyType = (sp.get("type") || "any") as PropertyType | "any";
  const dealType = (sp.get("deal") || "any") as DealType | "any";
  const minBeds = Number(sp.get("beds") || 0) || 0;
  const maxPriceUsd = Number(sp.get("maxPrice") || 0) || undefined;

  const all = await getPublicListings();
  const results = all
    .filter((l) => {
      if (dealType !== "any" && l.dealType !== dealType) return false;
      if (propertyType !== "any" && l.propertyType !== propertyType) return false;
      if (l.beds < minBeds) return false;
      if (maxPriceUsd && l.priceUsd > maxPriceUsd) return false;
      if (location) {
        const hay = `${l.location} ${l.city} ${l.state} ${l.title}`.toLowerCase();
        if (!hay.includes(location)) return false;
      }
      return true;
    })
    .sort((a, b) => a.priceUsd - b.priceUsd);

  return NextResponse.json({
    ok: true,
    count: results.length,
    results,
    note: "Catalog = demo listings + approved agent submissions (CRM).",
  });
}
