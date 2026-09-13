import { NextRequest, NextResponse } from "next/server";
import { getListingBySlug } from "@/lib/store/catalog";
import { verifyDownloadToken } from "@/lib/store/tokens";

/**
 * Token-gated delivery.
 * Phase 2a: streams a text receipt + install instructions (binaries live in Blob later).
 * Phase 2b: redirect to Supabase/Vercel Blob signed URL when file_path is set.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const slug = req.nextUrl.searchParams.get("slug") || "";

  const result = verifyDownloadToken(token, slug);
  if (!result.ok) {
    return new NextResponse(result.error, { status: 403 });
  }

  const listing = getListingBySlug(slug);
  if (!listing || listing.reviewStatus !== "approved") {
    return new NextResponse("Listing unavailable", { status: 404 });
  }

  // When real storage is wired:
  // if (listing.file_path) return redirect(await createSignedUrl(listing.file_path))

  const body = [
    `DoyinStore secure delivery`,
    `========================`,
    `Title: ${listing.title}`,
    `Version: ${listing.version}`,
    `Platform: ${listing.platform}`,
    `Package: ${listing.fileName || "pending-upload"}`,
    `SHA-256: ${listing.sha256 || "pending"}`,
    ``,
    `Your download was authorized.`,
    `Binary hosting (APK/ZIP) will be attached via private storage.`,
    `For this MVP build, contact doyintechnology@outlook.com or WhatsApp +2348085343926`,
    `with this token reference if the binary is not yet on CDN:`,
    `TOKEN:${token.slice(0, 12)}…`,
    ``,
    `Install (Android APK): open file → allow install from source → Install`,
    `Install (Desktop): run installer → accept UAC/Gatekeeper prompts`,
    ``,
    `DoyinTech · https://doyintech.vercel.app/store`,
  ].join("\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${listing.slug}-delivery.txt"`,
      "Cache-Control": "no-store",
    },
  });
}
