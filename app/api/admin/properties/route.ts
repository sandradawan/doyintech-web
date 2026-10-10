import { NextRequest, NextResponse } from "next/server";
import {
  listAllForAdmin,
  updateListingStatus,
  insertListing,
} from "@/lib/real-estate/db";

function adminOk(req: NextRequest) {
  const secret =
    process.env.ADMIN_LEADS_SECRET ||
    process.env.LEADS_ADMIN_SECRET ||
    process.env.ADMIN_SECRET;
  if (!secret) return false;
  return (req.headers.get("x-admin-secret") || "") === secret;
}

export async function GET(req: NextRequest) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get("status") || "";
  const { rows, configured, error } = await listAllForAdmin(status || undefined);

  const pending = rows.filter((r) => r.status === "pending").length;
  const approved = rows.filter((r) => r.status === "approved").length;

  return NextResponse.json({
    ok: true,
    configured,
    error: error || null,
    counts: { total: rows.length, pending, approved },
    listings: rows,
    sqlHint: configured
      ? null
      : "Run docs/property-listings.sql in Supabase, set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.",
  });
}

export async function PATCH(req: NextRequest) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const id = String(body.id || "").trim();
  const status = String(body.status || "").trim() as
    | "pending"
    | "approved"
    | "rejected"
    | "archived";
  const allowed = ["pending", "approved", "rejected", "archived"];
  if (!id || !allowed.includes(status)) {
    return NextResponse.json(
      { error: "id and status (pending|approved|rejected|archived) required" },
      { status: 400 }
    );
  }

  const verified = status === "approved" ? true : body.verified;
  const result = await updateListingStatus(id, status, verified);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = await insertListing({
    title: String(body.title || "").trim(),
    dealType: body.dealType === "buy" ? "buy" : "rent",
    propertyType: String(body.propertyType || "flat"),
    location: String(body.location || "").trim(),
    city: String(body.city || "").trim(),
    state: String(body.state || "").trim(),
    beds: Number(body.beds) || 0,
    baths: Number(body.baths) || 0,
    priceUsd: Number(body.priceUsd) || 0,
    description: String(body.description || ""),
    features: Array.isArray(body.features) ? body.features : [],
    imageUrl: String(body.imageUrl || ""),
    videoUrl: body.videoUrl ? String(body.videoUrl) : undefined,
    agentName: String(body.agentName || ""),
    agentPhone: String(body.agentPhone || ""),
    agentWhatsApp: String(body.agentWhatsApp || "").replace(/\D/g, ""),
    status: body.status === "approved" ? "approved" : "pending",
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: result.id });
}
