"use client";

import { getSupabaseBrowser } from "@/lib/supabase/client";

async function authHeader(): Promise<Record<string, string>> {
  const { data } = (await getSupabaseBrowser()?.auth.getSession()) || { data: null };
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Calls an admin API route with the signed-in admin's token; throws the route's error message. */
export async function adminApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(await authHeader()), ...(init.headers || {}) },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const d = data as { error?: string; hint?: string };
    throw new Error([d.error || `Request failed (${res.status})`, d.hint].filter(Boolean).join(" "));
  }
  return data as T;
}

/** Downloads an authenticated file (e.g. CSV export). */
export async function adminDownload(path: string, filename: string) {
  const res = await fetch(path, { headers: await authHeader(), cache: "no-store" });
  if (!res.ok) throw new Error("Export failed");
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
