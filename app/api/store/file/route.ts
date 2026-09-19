import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "fs";
import path from "path";
import { Readable } from "stream";
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

  const fileName = listing.fileName;
  if (fileName) {
    const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const candidates = [
      path.join(process.cwd(), ".data", "store-binaries", safe),
      path.join(process.cwd(), ".data", "store-binaries", fileName),
    ];
    for (const full of candidates) {
      if (existsSync(full)) {
        const st = statSync(full);
        const stream = createReadStream(full);
        const webStream = Readable.toWeb(stream) as unknown as ReadableStream;
        const ext = path.extname(full).toLowerCase();
        const type =
          ext === ".apk"
            ? "application/vnd.android.package-archive"
            : ext === ".pdf"
              ? "application/pdf"
              : "application/octet-stream";
        return new NextResponse(webStream, {
          status: 200,
          headers: {
            "Content-Type": type,
            "Content-Length": String(st.size),
            "Content-Disposition": `attachment; filename="${safe}"`,
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
    }
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
    `When a binary is uploaded by staff, this endpoint streams the real APK/ZIP.`,
    `Contact: doyintechnology@outlook.com · WhatsApp +2348085343926`,
    `Ref: TOKEN:${token.slice(0, 12)}…`,
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
