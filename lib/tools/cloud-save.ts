"use client";

import { useSyncExternalStore } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

/**
 * Cloud save for the free tools. Tools keep working from localStorage; when the visitor is
 * signed in, each tool's data is also pulled from and pushed to /api/tools/saved.
 */

/** Storage key → the slug saved on the account ("doyintech_minutes_org_v1" → "minutes-org"). */
export function toolSlug(storageKey: string): string {
  return storageKey
    .replace(/^(dt-|doyintech_)/, "")
    .replace(/_v\d+$/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Saved slug → the tool page it belongs to (for the account's saved-tools list). */
export const SAVED_TOOL_PAGES: Record<string, { title: string; href: string }> = {
  "solar-vs-gen": { title: "Solar vs generator calculator", href: "/tools/solar-vs-generator-calculator" },
  "import-duty": { title: "Import duty calculator", href: "/tools/import-duty-calculator-nigeria" },
  "cash-flow-13w": { title: "13-week cash flow forecast", href: "/tools/cash-flow-forecast" },
  "employee-cost": { title: "True cost of an employee", href: "/tools/employee-cost-calculator-nigeria" },
  "bid-evaluation": { title: "Bid evaluation", href: "/tools/bid-evaluation-tool" },
  "compliance-calendar": { title: "Compliance calendar", href: "/tools/compliance-calendar-nigeria" },
  "minutes-org": { title: "Meeting minutes (organisation details)", href: "/tools/meeting-minutes-generator" },
  "certificate-org": { title: "Certificates (organisation details)", href: "/tools/certificate-generator" },
  "idcard-org": { title: "ID cards (organisation details)", href: "/tools/id-card-generator" },
};

export type CloudState = {
  active: boolean; // a tool on this page saves its data
  signedIn: boolean;
  email: string | null;
  status: "idle" | "saving" | "saved" | "error";
};

let state: CloudState = { active: false, signedIn: false, email: null, status: "idle" };
const listeners = new Set<() => void>();
const SERVER_STATE: CloudState = { active: false, signedIn: false, email: null, status: "idle" };

function set(patch: Partial<CloudState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function useCloudState(): CloudState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => SERVER_STATE
  );
}

async function session(): Promise<{ token: string; email: string | null } | null> {
  const sb = getSupabaseBrowser();
  if (!sb) return null;
  try {
    const { data } = await sb.auth.getSession();
    if (!data.session) return null;
    return { token: data.session.access_token, email: data.session.user.email ?? null };
  } catch {
    return null;
  }
}

/** The tool's saved copy on the account, or null when signed out / nothing saved / offline. */
export async function pullTool(tool: string): Promise<{ payload: Record<string, unknown> | null; updatedAt: number } | null> {
  set({ active: true });
  const s = await session();
  set({ signedIn: !!s, email: s?.email ?? null });
  if (!s) return null;
  try {
    const res = await fetch(`/api/tools/saved?tool=${encodeURIComponent(tool)}`, { headers: { Authorization: `Bearer ${s.token}` } });
    if (!res.ok) return null;
    const json = await res.json();
    set({ status: json.payload ? "saved" : state.status });
    return { payload: json.payload ?? null, updatedAt: json.updated_at ? Date.parse(json.updated_at) : 0 };
  } catch {
    return null;
  }
}

const timers = new Map<string, ReturnType<typeof setTimeout>>();

/** Debounced upload of a tool's data; does nothing when signed out. */
export function pushTool(tool: string, payload: unknown, delayMs = 1200) {
  const t = timers.get(tool);
  if (t) clearTimeout(t);
  timers.set(
    tool,
    setTimeout(async () => {
      timers.delete(tool);
      const s = await session();
      if (!s) return;
      set({ status: "saving" });
      try {
        const res = await fetch("/api/tools/saved", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${s.token}` },
          body: JSON.stringify({ tool, payload }),
        });
        set({ status: res.ok ? "saved" : "error" });
      } catch {
        set({ status: "error" });
      }
    }, delayMs)
  );
}

/** Email sign-in link that brings the visitor back to this page. */
export async function sendSignInLink(email: string): Promise<string | null> {
  const sb = getSupabaseBrowser();
  if (!sb) return "Sign-in is not available right now.";
  const { error } = await sb.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: window.location.href } });
  return error ? error.message : null;
}
