import { NextRequest, NextResponse } from "next/server";
import { getPublishedBySlug } from "@/lib/store/published";
import { issueDownloadToken, verifyDownloadToken } from "@/lib/store/tokens";
import { dbCreateOrder, dbVerifyOrderToken, dbBumpDownloads } from "@/lib/store/db";
import { randomBytes } from "crypto";
import { verifyPurchase } from "@/lib/payments/purchase";
import { limitRequest } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";

export async function POST(req: NextRequest) {
  try {
    const limited = limitRequest(req, "store-download", 20, 60_000);
    if (limited) return limited;

    const body = await req.json();
    const slug = String(body.slug || "");
    let email = String(body.email || "").trim().toLowerCase() || "buyer@doyintech.local";
    const paystackRef = body.reference ? String(body.reference).trim() : "";
    const listing = await getPublishedBySlug(slug);

    if (!listing || listing.reviewStatus !== "approved") {
      return NextResponse.json({ error: "Listing not available." }, { status: 404 });
    }

    if (listing.priceNgn > 0) {
      if (!paystackRef) {
        return NextResponse.json(
          {
            error: "Paid item — complete Paystack checkout first.",
            code: "PAYMENT_REQUIRED",
          },
          { status: 402 }
        );
      }
      // Must be a full payment for THIS listing (fails closed if Paystack isn't configured).
      const check = await verifyPurchase(paystackRef);
      if (!check.ok || (check.productId !== listing.slug && check.productId !== listing.id)) {
        return NextResponse.json({ error: "Payment not verified for this item." }, { status: 402 });
      }
      email = check.email || email;
    }

    const ttlMinutes = 120;
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    const token = randomBytes(24).toString("hex");
    issueDownloadToken(slug, email, ttlMinutes, token);

    const saved = await dbCreateOrder({
      listingId: listing.id,
      listingSlug: slug,
      buyerEmail: email,
      amountKobo: listing.amountKobo || listing.priceNgn * 100,
      paystackReference: paystackRef || undefined,
      status: "paid",
      downloadToken: token,
      expiresAt,
    });

    void dbBumpDownloads(listing.id);

    const downloadUrl = `${SITE_URL}/api/store/file?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}`;

    console.log(
      JSON.stringify({
        event: "store_download_grant",
        slug,
        free: listing.priceNgn === 0,
        persisted: saved,
        at: new Date().toISOString(),
      })
    );

    return NextResponse.json({
      ok: true,
      message: `Download authorized for ${listing.fileName || listing.title}. Starting…`,
      downloadUrl,
      token,
      expiresInMinutes: ttlMinutes,
      installHint:
        listing.platform === "android"
          ? "Open the APK → Allow install from this source → Install"
          : "Open the downloaded file and confirm system prompts",
    });
  } catch {
    return NextResponse.json({ error: "Download failed." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const slug = req.nextUrl.searchParams.get("slug") || "";

  const fromDb = await dbVerifyOrderToken(token, slug);
  if (fromDb.ok) {
    return NextResponse.json({
      ok: true,
      grant: { slug, expiresAt: fromDb.expiresAt, email: fromDb.email },
      source: "supabase",
    });
  }

  const result = verifyDownloadToken(token, slug);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }
  return NextResponse.json({
    ok: true,
    grant: { slug: result.grant.slug, expiresAt: result.grant.expiresAt },
    source: "memory",
  });
}
