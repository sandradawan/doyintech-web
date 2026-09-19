import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { dbGetBySlug } from "@/lib/store/db";
import { dbCreateReview, dbListReviewsBySlug } from "@/lib/store/orders-reviews";
import { notifyOps } from "@/lib/store/notify";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "";
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }
  const reviews = await dbListReviewsBySlug(slug);
  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      body: r.body,
      reviewerName: r.reviewer_name || "Buyer",
      createdAt: r.created_at?.slice(0, 10),
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`store-review:${ip}`, 8, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many reviews. Try later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const slug = String(body.slug || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim().slice(0, 80);
    const rating = Number(body.rating);
    const text = String(body.body || "").trim().slice(0, 2000);

    if (!slug || !email.includes("@")) {
      return NextResponse.json({ error: "slug and valid email required" }, { status: 400 });
    }
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "rating must be 1–5" }, { status: 400 });
    }

    const listing = await dbGetBySlug(slug);
    if (!listing || listing.reviewStatus !== "approved") {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (!listing.id || listing.id.startsWith("app-") || listing.id.startsWith("dig-")) {
      return NextResponse.json(
        {
          error:
            "Reviews require a database-backed listing. Publish via admin after Supabase is connected.",
          code: "SEED_LISTING",
        },
        { status: 400 }
      );
    }

    const result = await dbCreateReview({
      listingId: listing.id,
      reviewerEmail: email,
      reviewerName: name,
      rating,
      body: text,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    void notifyOps("store_review", { slug, rating, email: email.slice(0, 3) + "***" });

    return NextResponse.json({ ok: true, id: result.id });
  } catch (e: unknown) {
    console.error("reviews POST", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
