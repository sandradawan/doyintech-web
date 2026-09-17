"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { OpsWorkspace } from "@/lib/ops/types";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import { parseWorkspaceJson } from "@/lib/ops/store";

type Props = {
  workspace: OpsWorkspace;
  onPull: (ws: OpsWorkspace) => void;
};

const field =
  "w-full rounded-lg border border-white/10 bg-[#0c1220] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#ff8c14]/60";
const btnP =
  "rounded-lg bg-[#ff8c14] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-40";
const btnG =
  "rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/10";

export default function CloudSync({ workspace, onPull }: Props) {
  const configured = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function sendMagicLink(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabaseBrowser();
    if (!sb) return;
    setBusy(true);
    setMsg("");
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/ops/app`
        : "https://doyintech.vercel.app/ops/app";
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });
    setBusy(false);
    setMsg(error ? error.message : "Check your email for the magic link.");
  }

  async function pushCloud() {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    setBusy(true);
    setMsg("");
    const {
      data: { session },
    } = await sb.auth.getSession();
    if (!session) {
      setBusy(false);
      setMsg("Sign in first.");
      return;
    }
    const res = await fetch("/api/ops/workspace", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ payload: workspace }),
    });
    const json = await res.json();
    setBusy(false);
    setMsg(res.ok ? "Workspace saved to cloud." : json.error || "Save failed");
  }

  async function pullCloud() {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    setBusy(true);
    setMsg("");
    const {
      data: { session },
    } = await sb.auth.getSession();
    if (!session) {
      setBusy(false);
      setMsg("Sign in first.");
      return;
    }
    const res = await fetch("/api/ops/workspace", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(json.error || "Load failed");
      return;
    }
    if (!json.payload) {
      setMsg("No cloud workspace yet — push first.");
      return;
    }
    const parsed = parseWorkspaceJson(JSON.stringify(json.payload));
    if (!parsed) {
      setMsg("Cloud data invalid.");
      return;
    }
    if (!confirm("Replace local workspace with cloud copy?")) return;
    onPull(parsed);
    setMsg("Pulled from cloud.");
  }

  async function signOut() {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    await sb.auth.signOut();
    setUserEmail(null);
    setMsg("Signed out.");
  }

  if (!configured) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="text-sm font-semibold text-amber-200">Cloud sync</h2>
        <p className="mt-2 text-[13px] text-white/55">
          Add these Vercel env vars to enable login + multi-device sync:
        </p>
        <ul className="mt-2 space-y-1 font-mono text-[11px] text-white/45">
          <li>NEXT_PUBLIC_SUPABASE_URL</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          <li>SUPABASE_SERVICE_ROLE_KEY (for payment auto-mark)</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0c1220] p-6">
      <h2 className="text-sm font-semibold text-white">Cloud sync</h2>
      <p className="mt-1 text-[13px] text-white/45">
        Sign in with email, then push/pull your workspace across devices.
      </p>

      {!userEmail ? (
        <form onSubmit={sendMagicLink} className="mt-4 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            className={field}
          />
          <button type="submit" disabled={busy} className={btnP}>
            {busy ? "Sending…" : "Email magic link"}
          </button>
        </form>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-[13px] text-white/70">
            Signed in as <span className="text-[#ff8c14]">{userEmail}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={pushCloud} className={btnP}>
              Push to cloud
            </button>
            <button type="button" disabled={busy} onClick={pullCloud} className={btnG}>
              Pull from cloud
            </button>
            <button type="button" onClick={signOut} className={btnG}>
              Sign out
            </button>
          </div>
        </div>
      )}

      {msg && <p className="mt-3 text-[12px] text-white/50">{msg}</p>}
    </div>
  );
}
