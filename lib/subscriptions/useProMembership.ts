"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

let cached: Promise<boolean> | null = null;

async function fetchPro(): Promise<boolean> {
  const sb = getSupabaseBrowser();
  if (!sb) return false;
  const { data } = await sb.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return false;
  const res = await fetch("/api/subscriptions/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return false;
  const json = (await res.json()) as { pro?: boolean };
  return Boolean(json.pro);
}

/** True when the signed-in visitor has an active DoyinTech Pro membership (checked server-side). */
export function useProMembership(): boolean {
  const [pro, setPro] = useState(false);
  useEffect(() => {
    let alive = true;
    cached ??= fetchPro().catch(() => false);
    cached.then((v) => {
      if (alive) setPro(v);
    });
    return () => {
      alive = false;
    };
  }, []);
  return pro;
}
