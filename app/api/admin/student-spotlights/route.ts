import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SPOTLIGHT_BUCKET, SPOTLIGHT_TABLE, type SpotlightRow } from "@/lib/students/spotlights-server";

const MAX_BYTES = 3_145_728;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const SETUP_HINT = "Run supabase/migrations/012_student_spotlights.sql in the Supabase SQL editor first.";

function setupError(message: string) {
  const missing = /does not exist|schema cache|Bucket not found|not found/i.test(message);
  return NextResponse.json({ error: missing ? "Student magazine storage is not set up yet." : "That didn't save.", hint: missing ? SETUP_HINT : undefined }, { status: 500 });
}

async function guard(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.ok) return { res: NextResponse.json({ error: admin.error || "Sign in required" }, { status: 401 }) };
  const sb = getSupabaseAdmin();
  if (!sb) return { res: NextResponse.json({ error: "Database is not configured." }, { status: 500 }) };
  return { sb };
}

/** Everyone in the magazine, newest first. */
export async function GET(req: NextRequest) {
  const g = await guard(req);
  if (!g.sb) return g.res;
  const { data, error } = await g.sb.from(SPOTLIGHT_TABLE).select("*").order("created_at", { ascending: false }).limit(500);
  if (error) return setupError(error.message);
  return NextResponse.json({ students: data as SpotlightRow[] });
}

/** Adds one student: a photo, the school tag, and optionally a name, the work done and a ready-made banner. */
export async function POST(req: NextRequest) {
  const g = await guard(req);
  if (!g.sb) return g.res;
  const sb = g.sb;

  const form = await req.formData().catch(() => null);
  const text = (key: string, max: number) => String(form?.get(key) ?? "").trim().slice(0, max);
  const name = text("name", 80);
  const school = text("school", 80);
  const work = text("work", 120);
  const photo = form?.get("photo");
  const banner = form?.get("banner");

  if (school.length < 2) return NextResponse.json({ error: "Add the school name." }, { status: 400 });
  if (!(photo instanceof File) || !photo.size) return NextResponse.json({ error: "Choose a photo." }, { status: 400 });

  async function upload(file: File, label: string): Promise<string | NextResponse> {
    const ext = TYPES[file.type];
    if (!ext) return NextResponse.json({ error: `${label}: use a JPG, PNG or WebP image.` }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: `${label}: image must be under 3 MB.` }, { status: 400 });
    const path = `${randomUUID()}.${ext}`;
    const { error } = await sb.storage.from(SPOTLIGHT_BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
    if (error) {
      console.error("student spotlight upload", error.message);
      return setupError(error.message);
    }
    return sb.storage.from(SPOTLIGHT_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const photoUrl = await upload(photo, "Photo");
  if (typeof photoUrl !== "string") return photoUrl;
  let bannerUrl: string | null = null;
  if (banner instanceof File && banner.size) {
    const uploaded = await upload(banner, "Banner");
    if (typeof uploaded !== "string") return uploaded;
    bannerUrl = uploaded;
  }

  const { data, error } = await sb.from(SPOTLIGHT_TABLE).insert({ name, school, work, photo_url: photoUrl, banner_url: bannerUrl }).select("*").single();
  if (error) {
    console.error("student spotlight insert", error.message);
    return setupError(error.message);
  }
  revalidatePath("/students");
  return NextResponse.json({ ok: true, student: data as SpotlightRow });
}

/** Removes one student and their images. */
export async function DELETE(req: NextRequest) {
  const g = await guard(req);
  if (!g.sb) return g.res;
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Missing student id." }, { status: 400 });

  const { data: row } = await g.sb.from(SPOTLIGHT_TABLE).select("photo_url, banner_url").eq("id", id).maybeSingle();
  const { error } = await g.sb.from(SPOTLIGHT_TABLE).delete().eq("id", id);
  if (error) return setupError(error.message);

  const marker = `/object/public/${SPOTLIGHT_BUCKET}/`;
  const paths = [row?.photo_url, row?.banner_url]
    .filter((u): u is string => typeof u === "string" && u.includes(marker))
    .map((u) => u.slice(u.indexOf(marker) + marker.length));
  if (paths.length) await g.sb.storage.from(SPOTLIGHT_BUCKET).remove(paths);

  revalidatePath("/students");
  return NextResponse.json({ ok: true });
}
