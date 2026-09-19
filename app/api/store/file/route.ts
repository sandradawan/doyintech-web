import { NextRequest, NextResponse } from "next/server";
import { getPublishedBySlug } from "@/lib/store/published";
import { verifyDownloadToken } from "@/lib/store/tokens";
import { dbVerifyOrderToken } from "@/lib/store/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const slug = req.nextUrl.searchParams.get("slug") || "";

  const mem = verifyDownloadToken(token, slug);
  const db = mem.ok ? null : await dbVerifyOrderToken(token, slug);
  if (!mem.ok && !(db && db.ok)) {
    return new NextResponse(mem.ok ? "Forbidden" : mem.error, { status: 403 });
  }

  const listing = await getPublishedBySlug(slug);
  if (!listing || listing.reviewStatus !== "approved") {
    return new NextResponse("Listing unavailable", { status: 404 });
  }

  const body = [
    `DoyinStore secure delivery`,
    `========================`,
    `Title: ${listing.title}`,
    `Version: ${listing.version}`,
    `Platform: ${listing.platform}`,
    `Package: ${listing.fileName || "pending-upload"}`,
    `SHA-256: ${listing.sha256 || "pending"}`,
    ``,
    `Your download was authorized with a time-limited token.`,
    `When binary CDN is connected, this endpoint streams the real APK/ZIP.`,
    `Contact: doyintechnology@outlook.com · WhatsApp +2348085343926`,
    `Ref: TOKEN:${token.slice(0, 12)}…`,
    ``,
    `Install (Android APK): open file → allow install from source → Install`,
    `Install (Desktop): run installer → accept system prompts`,
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
