import { NextRequest, NextResponse } from "next/server";
import { getPublishedBySlug } from "@/lib/store/published";
import { issueDownloadToken, verifyDownloadToken } from "@/lib/store/tokens";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = String(body.slug || "");
    const email = String(body.email || "").trim();
    const paystackRef = body.reference ? String(body.reference) : "";
    const listing = getPublishedBySlug(slug);

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
      const secret = process.env.PAYSTACK_SECRET_KEY || "";
      if (secret) {
        const vr = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(paystackRef)}`,
          { headers: { Authorization: `Bearer ${secret}` } }
        );
        const vdata = await vr.json();
        if (!vr.ok || !vdata.status || vdata.data?.status !== "success") {
          return NextResponse.json({ error: "Payment not verified." }, { status: 402 });
        }
      }
    }

    const token = issueDownloadToken(slug, email || "buyer@doyintech.local", 120);
    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://doyintech.vercel.app";

    const downloadUrl = `${origin}/api/store/file?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}`;

    console.log(
      JSON.stringify({
        event: "store_download_grant",
        slug,
        email,
        free: listing.priceNgn === 0,
        at: new Date().toISOString(),
      })
    );

    return NextResponse.json({
      ok: true,
      message: `Download authorized for ${listing.fileName || listing.title}. Starting…`,
      downloadUrl,
      token,
      expiresInMinutes: 120,
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
  const result = verifyDownloadToken(token, slug);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }
  return NextResponse.json({
    ok: true,
    grant: { slug: result.grant.slug, expiresAt: result.grant.expiresAt },
  });
}
