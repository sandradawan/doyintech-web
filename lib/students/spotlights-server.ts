import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { BUILT_IN_SPOTLIGHTS, type StudentSpotlight } from "./spotlights";

export const SPOTLIGHT_TABLE = "student_spotlights";
export const SPOTLIGHT_BUCKET = "students";

export type SpotlightRow = {
  id: number;
  name: string;
  school: string;
  work: string;
  photo_url: string;
  banner_url: string | null;
  published: boolean;
  created_at: string;
};

/** Built-in students first, then everyone added in the admin. Falls back to the built-in two if the table is not there yet. */
export async function getStudentSpotlights(): Promise<StudentSpotlight[]> {
  const sb = getSupabaseAdmin();
  if (!sb) return BUILT_IN_SPOTLIGHTS;
  try {
    const { data, error } = await sb
      .from(SPOTLIGHT_TABLE)
      .select("id, name, school, work, photo_url, banner_url")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error || !data) return BUILT_IN_SPOTLIGHTS;
    const added = (data as Pick<SpotlightRow, "id" | "name" | "school" | "work" | "photo_url" | "banner_url">[]).map((r) => ({
      id: `s-${r.id}`,
      name: r.name,
      school: r.school,
      work: r.work,
      photo: r.photo_url,
      banner: r.banner_url || undefined,
    }));
    return [...BUILT_IN_SPOTLIGHTS, ...added];
  } catch {
    return BUILT_IN_SPOTLIGHTS;
  }
}
