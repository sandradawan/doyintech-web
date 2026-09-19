import { NextRequest, NextResponse } from "next/server";
import { dbListingsByDeveloperEmail } from "@/lib/store/membership";
import { rowToListing, type DbListingRow } from "@/lib/store/db";
import { verifySessionToken } from "@/lib/store/session-token";

export async function GET(req: NextRequest) {
  const bearer = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  const headerToken = (req.headers.get("x-store-session") || "").trim();
  const token = bearer || headerToken;
  const payload = verifySessionToken(token);

  if (!payload?.email) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (payload.role !== "developer" && payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let email = payload.email;
  if (payload.role === "admin") {
    const q = req.nextUrl.searchParams.get("email");
    if (q) email = q.toLowerCase().trim();
  }

  const rows = await dbListingsByDeveloperEmail(email);
  const listings = rows.map((r) => rowToListing(r as DbListingRow));
  return NextResponse.json({ ok: true, listings });
}
