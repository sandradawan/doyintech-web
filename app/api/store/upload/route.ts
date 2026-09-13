import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { createHash } from "crypto";

const MAX_BYTES = 40 * 1024 * 1024; // 40MB MVP limit
const ALLOWED_EXT = new Set([
  ".apk",
  ".zip",
  ".exe",
  ".msi",
  ".dmg",
  ".deb",
  ".AppImage",
  ".txt",
  ".pdf",
]);

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const submissionId = String(form.get("submissionId") || "");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 40MB on this plan). Use external host for bigger builds." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name);
    if (!ALLOWED_EXT.has(ext) && !ALLOWED_EXT.has(ext.replace(/appimage/i, "AppImage"))) {
      // allow case-insensitive apk/zip etc
      const lower = ext.toLowerCase();
      if (!["apk", "zip", "exe", "msi", "dmg", "deb", "pdf", "txt"].some((e) => lower.endsWith(e))) {
        return NextResponse.json(
          { error: "File type not allowed. Use APK, ZIP, EXE, MSI, DMG, DEB, PDF." },
          { status: 400 }
        );
      }
    }

    if (ext.toLowerCase() === ".aab") {
      return NextResponse.json(
        { error: "AAB is not accepted for user install. Upload APK." },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const sha256 = createHash("sha256").update(buf).digest("hex");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const dir = path.join(process.cwd(), ".data", "store-binaries");
    await mkdir(dir, { recursive: true });
    const stored = `${Date.now()}_${safeName}`;
    const full = path.join(dir, stored);
    await writeFile(full, buf);

    console.log(
      JSON.stringify({
        event: "store_upload",
        submissionId,
        fileName: safeName,
        size: file.size,
        sha256,
        stored,
        at: new Date().toISOString(),
      })
    );

    return NextResponse.json({
      ok: true,
      fileName: safeName,
      storedName: stored,
      sizeBytes: file.size,
      sha256,
      message:
        "File stored on server disk for this deployment. For production use Supabase Storage / Vercel Blob (ephemeral FS on serverless).",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
