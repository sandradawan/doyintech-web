import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const MAX_BYTES = 40 * 1024 * 1024; // 40MB MVP limit
const ALLOWED_EXT = new Set([
  ".apk",
  ".zip",
  ".exe",
  ".msi",
  ".dmg",
  ".deb",
  ".appimage",
  ".txt",
  ".pdf",
]);

function authorized(req: NextRequest): boolean {
  const key = process.env.STORE_ADMIN_KEY || "";
  if (!key) return false;
  const header = req.headers.get("x-store-admin-key") || "";
  return header === key;
}

export async function POST(req: NextRequest) {
  try {
    if (!authorized(req)) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. Binary upload requires x-store-admin-key. Developers: submit metadata via /api/store/submit; staff uploads after review.",
        },
        { status: 401 }
      );
    }

    const ip = clientIp(req);
    const rl = rateLimit(`store-upload:${ip}`, 10, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many uploads. Try later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const form = await req.formData();
    const file = form.get("file");
    const submissionId = String(form.get("submissionId") || "").slice(0, 80);

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 40MB on this plan). Use external host for bigger builds." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json(
        { error: "File type not allowed. Use APK, ZIP, EXE, MSI, DMG, DEB, PDF." },
        { status: 400 }
      );
    }

    if (ext === ".aab") {
      return NextResponse.json(
        { error: "AAB is not accepted for user install. Upload APK." },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const sha256 = createHash("sha256").update(buf).digest("hex");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
    const dir = path.join(process.cwd(), ".data", "store-binaries");
    await mkdir(dir, { recursive: true });
    const stored = `${Date.now()}_${safeName}`;
    const full = path.join(dir, stored);
    // Path traversal guard
    if (!full.startsWith(dir)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
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
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
