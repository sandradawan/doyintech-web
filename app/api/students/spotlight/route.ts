import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { limitRequest } from "@/lib/rate-limit";
import { SPOTLIGHT_BUCKET, SPOTLIGHT_TABLE } from "@/lib/students/spotlights-server";

const MAX_BYTES = 3_145_728;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** A student asks to be featured in the magazine. The entry is saved hidden and waits for admin approval. */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "student-spotlight", 5, 60 * 60 * 1000);
  if (limited) return limited;
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "This form is not available right now." }, { status: 503 });

  const form = await req.formData().catch(() => null);
  const text = (key: string, max: number) => String(form?.get(key) ?? "").trim().slice(0, max);
  if (text("website", 200)) return NextResponse.json({ ok: true }); // honeypot

  const name = text("name", 80);
  const school = text("school", 80);
  const work = text("work", 120);
  const contact = text("contact", 120);
  const photo = form?.get("photo");

  if (name.length < 2) return NextResponse.json({ error: "Add your name." }, { status: 400 });
  if (school.length < 2) return NextResponse.json({ error: "Add your school." }, { status: 400 });
  if (contact.length < 5) return NextResponse.json({ error: "Add a phone number or email so we can confirm it is you." }, { status: 400 });
  if (text("consent", 5) !== "yes") return NextResponse.json({ error: "Tick the box to agree to your photo being shown." }, { status: 400 });
  if (!(photo instanceof File) || !photo.size) return NextResponse.json({ error: "Choose a photo." }, { status: 400 });
  const ext = TYPES[photo.type];
  if (!ext) return NextResponse.json({ error: "Use a JPG, PNG or WebP photo." }, { status: 400 });
  if (photo.size > MAX_BYTES) return NextResponse.json({ error: "Photo must be under 3 MB." }, { status: 400 });

  const path = `submitted/${randomUUID()}.${ext}`;
  const up = await sb.storage.from(SPOTLIGHT_BUCKET).upload(path, Buffer.from(await photo.arrayBuffer()), { contentType: photo.type, upsert: false });
  if (up.error) {
    console.error("student submission upload", up.error.message);
    return NextResponse.json({ error: "We could not save your photo. Please try again later." }, { status: 500 });
  }
  const photoUrl = sb.storage.from(SPOTLIGHT_BUCKET).getPublicUrl(path).data.publicUrl;

  const { error } = await sb.from(SPOTLIGHT_TABLE).insert({ name, school, work, contact, photo_url: photoUrl, published: false, source: "student", consent: true });
  if (error) {
    console.error("student submission insert", error.message);
    await sb.storage.from(SPOTLIGHT_BUCKET).remove([path]);
    return NextResponse.json({ error: "We could not save your request. Please try again later." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
