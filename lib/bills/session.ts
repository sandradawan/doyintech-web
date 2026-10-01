import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** Resolve authenticated user from Bearer access token (browser session). */
export async function getUserFromRequest(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anon) return null;

  const supabase = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function ensureProfileWallet(userId: string, email?: string | null) {
  const admin = getSupabaseAdmin();
  if (!admin) return;
  await admin.from("profiles").upsert(
    { id: userId, email: email || null },
    { onConflict: "id" }
  );
  await admin.from("wallets").upsert(
    { user_id: userId, balance_kobo: 0 },
    { onConflict: "user_id", ignoreDuplicates: true }
  );
}
