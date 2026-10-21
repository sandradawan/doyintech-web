import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** Resolves the signed-in Supabase user from `Authorization: Bearer <access_token>`. */
export async function userFromBearer(req: Request): Promise<{ id: string; email: string } | null> {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return null;
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  try {
    const { data, error } = await sb.auth.getUser(token);
    if (error || !data.user?.email) return null;
    return { id: data.user.id, email: data.user.email.toLowerCase() };
  } catch {
    return null;
  }
}
