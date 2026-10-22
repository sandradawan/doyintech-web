import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { userFromBearer } from "@/lib/auth/request-user";
import { db, storeForOwner } from "@/lib/storefront/server";
import { limitRequest } from "@/lib/rate-limit";

const MAX_BYTES = 1_048_576;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Uploads one product image to the public `storefront` bucket under the seller's folder. */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "storefront-upload", 30, 60 * 60 * 1000);
  if (limited) return limited;
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const store = await storeForOwner(user.id);
  if (!store) return NextResponse.json({ error: "Create your shop first." }, { status: 400 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image." }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "Use a JPG, PNG or WebP image." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be under 1 MB." }, { status: 400 });

  const path = `${store.id}/${randomUUID()}.${ext}`;
  const { error } = await db()
    .storage.from("storefront")
    .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
  if (error) {
    console.error("storefront upload", error.message);
    return NextResponse.json({ error: "Upload failed. Try a smaller image." }, { status: 500 });
  }
  const { data } = db().storage.from("storefront").getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
