import { NextRequest, NextResponse } from "next/server";
import { dbListingsByDeveloperEmail } from "@/lib/store/membership";
import { rowToListing, type DbListingRow } from "@/lib/store/db";

export async function GET(req: NextRequest) {
  const email = (req.headers.get("x-developer-email") || "").toLowerCase().trim();
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  const rows = await dbListingsByDeveloperEmail(email);
  const listings = rows.map((r) => rowToListing(r as DbListingRow));
  return NextResponse.json({ ok: true, listings });
}
