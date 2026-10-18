import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** Comma-separated allowlist: ADMIN_EMAILS=you@doyintech.com,ops@... */
export function getAdminEmails(): string[] {
  const raw =
    process.env.ADMIN_EMAILS ||
    process.env.ADMIN_EMAIL ||
    "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = getAdminEmails();
  if (list.length === 0) {
    return false;
  }
  if (list.includes("*")) return true;
  return list.includes(email.trim().toLowerCase());
}

export function adminSecretOk(req: NextRequest): boolean {
  const secret =
    process.env.ADMIN_LEADS_SECRET ||
    process.env.LEADS_ADMIN_SECRET ||
    process.env.ADMIN_SECRET ||
    "";
  if (!secret) return false;
  const header = req.headers.get("x-admin-secret") || "";
  return header === secret;
}

/**
 * Accepts either:
 * - Authorization: Bearer <supabase access_token> for an allowlisted admin email
 * - x-admin-secret header (automation / legacy)
 */
export async function requireAdmin(req: NextRequest): Promise<{
  ok: boolean;
  email?: string;
  via?: "session" | "secret";
  error?: string;
}> {
  if (adminSecretOk(req)) {
    return { ok: true, via: "secret" };
  }

  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) {
    return { ok: false, error: "Sign in required" };
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    return { ok: false, error: "Auth server not configured" };
  }

  try {
    const { data, error } = await sb.auth.getUser(token);
    if (error || !data.user?.email) {
      return { ok: false, error: "Invalid or expired session" };
    }
    if (!isAdminEmail(data.user.email)) {
      return { ok: false, error: "This account is not an admin" };
    }
    return { ok: true, email: data.user.email, via: "session" };
  } catch {
    return { ok: false, error: "Auth check failed" };
  }
}
