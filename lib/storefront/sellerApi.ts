"use client";

import { getSupabaseBrowser } from "@/lib/supabase/client";

async function token(): Promise<string | null> {
  const { data } = (await getSupabaseBrowser()?.auth.getSession()) || { data: null };
  return data?.session?.access_token || null;
}

/** Calls a seller API route with the signed-in user's token; throws the route's error message. */
export async function sellerApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const t = await token();
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...(init.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Request failed");
  return data as T;
}
