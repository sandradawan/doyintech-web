import { NextRequest, NextResponse } from "next/server";
import {
  searchListings,
  type DealType,
  type PropertyType,
} from "@/lib/real-estate/listings";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = clientIp(req);
  const rl = rateLimit(`re-search:${ip}`, 60, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const sp = req.nextUrl.searchParams;
  const location = sp.get("location") || "";
  const propertyType = (sp.get("type") || "any") as PropertyType | "any";
  const dealType = (sp.get("deal") || "any") as DealType | "any";
  const minBeds = Number(sp.get("beds") || 0) || 0;
  const maxPriceUsd = Number(sp.get("maxPrice") || 0) || undefined;

  const results = searchListings({
    location,
    propertyType,
    dealType,
    minBeds,
    maxPriceUsd,
  });

  return NextResponse.json({
    ok: true,
    count: results.length,
    results,
    note:
      "Listings are from the DoyinTech property catalog. Google Maps scraping is not used.",
  });
}
