import { NextRequest, NextResponse } from "next/server";
import { getListingBySlug } from "@/lib/store/catalog";

/**
 * MVP download endpoint.
 * Free approved listings: return instructions + placeholder URL.
 * Paid: should only be called after Paystack verify (phase 2: signed tokens).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = String(body.slug || "");
    const email = String(body.email || "").trim();
    const listing = getListingBySlug(slug);

    if (!listing || listing.reviewStatus !== "approved") {
      return NextResponse.json({ error: "Listing not available." }, { status: 404 });
    }

    if (listing.priceNgn > 0) {
      return NextResponse.json(
        {
          error: "Paid item — complete Paystack checkout first. Delivery link sent after payment.",
        },
        { status: 402 }
      );
    }

    // Free apps: log claim (console → later DB)
    console.log(
      JSON.stringify({
        event: "store_free_download",
        slug,
        email,
        at: new Date().toISOString(),
      })
    );

    // Phase 1: no binary in repo — point developer/user to WhatsApp for real APK host
    // Phase 2: redirect to Vercel Blob / Supabase signed URL
    const downloadUrl =
      listing.platform === "digital"
        ? "https://doyintech.vercel.app/products"
        : `https://wa.me/2348085343926?text=${encodeURIComponent(
            `Hi, I claimed free download for "${listing.title}" (${slug}). Please send the verified file.`
          )}`;

    return NextResponse.json({
      ok: true,
      message:
        listing.fileName
          ? `Preparing ${listing.fileName}. Opening secure delivery…`
          : "Opening secure delivery…",
      downloadUrl,
      installHint:
        listing.platform === "android"
          ? "Open the APK → Allow install from browser → Install"
          : "Open the downloaded installer and confirm system prompts",
    });
  } catch {
    return NextResponse.json({ error: "Download failed." }, { status: 500 });
  }
}
