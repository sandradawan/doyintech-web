"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

async function accessToken(): Promise<string | null> {
  const sb = getSupabaseBrowser();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.access_token || null;
}

/**
 * Starts a Paystack subscription checkout. Signed-in visitors subscribe with their account
 * email; others enter an email, which they later sign in with to use their membership.
 */
export default function SubscribeButton({
  planId,
  label,
  highlight = false,
}: {
  planId: string;
  label: string;
  highlight?: boolean;
}) {
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [askEmail, setAskEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSupabaseBrowser()
      ?.auth.getSession()
      .then(({ data }) => setSignedInEmail(data.session?.user.email || null))
      .catch(() => {});
  }, []);

  async function subscribe() {
    if (!signedInEmail && !email.includes("@")) {
      setAskEmail(true);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = await accessToken();
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ planId, email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.authorization_url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.authorization_url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  }

  const btn = highlight
    ? "bg-[#ff8c14] text-black hover:bg-[#ffa03a]"
    : "border border-white/20 text-white hover:border-[#ff8c14]/60";

  return (
    <div className="space-y-2">
      {askEmail && !signedInEmail && (
        <input
          type="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && subscribe()}
          placeholder="Your email"
          aria-label="Email for your membership"
          className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
        />
      )}
      <button
        type="button"
        disabled={loading}
        onClick={subscribe}
        className={`w-full rounded-full py-3 text-[14px] font-semibold transition disabled:opacity-60 ${btn}`}
      >
        {loading ? "Opening secure checkout…" : label}
      </button>
      {signedInEmail && (
        <p className="text-center text-[11px] text-[#86868b]">Billed to {signedInEmail}</p>
      )}
      {error && <p className="text-center text-[12px] text-red-400">{error}</p>}
    </div>
  );
}
