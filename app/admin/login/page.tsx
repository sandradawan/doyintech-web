"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      const sb = getSupabaseBrowser();
      if (!sb) return;
      const { data } = await sb.auth.getSession();
      if (!data.session?.access_token) return;
      const res = await fetch("/api/admin/me", {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      if (res.ok) router.replace("/admin");
    }
    void check();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const sb = getSupabaseBrowser();
    if (!sb) {
      setError("Auth is not configured (Supabase keys missing on this deployment).");
      setLoading(false);
      return;
    }

    const { data, error: err } = await sb.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (err || !data.session) {
      setLoading(false);
      setError(err?.message || "Sign-in failed");
      return;
    }

    const res = await fetch("/api/admin/me", {
      headers: { Authorization: `Bearer ${data.session.access_token}` },
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      await sb.auth.signOut();
      setError(
        json.error ||
          "This account is signed in but not on the admin allowlist. Set ADMIN_EMAILS in Vercel."
      );
      return;
    }

    router.replace("/admin");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060a] px-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,140,20,0.16),_transparent_50%)]" />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md space-y-5 rounded-3xl border border-white/10 bg-[#0c0d12]/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 text-[18px] font-bold text-[#ff8c14]">
            DT
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff8c14]">
            Command center
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white">
            Admin sign in
          </h1>
          <p className="mt-1.5 text-sm text-white/45">
            Secure email &amp; password access
          </p>
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <label className="block">
          <span className="text-[12px] font-medium text-[#a1a1a6]">Work email</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@doyintech.com"
            className="mt-1.5 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none placeholder:text-white/30 focus:border-[#ff8c14]/50"
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-medium text-[#a1a1a6]">Password</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none placeholder:text-white/30 focus:border-[#ff8c14]/50"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-[#ff9a2e] to-[#ff8c14] py-3.5 font-semibold text-black shadow-[0_8px_28px_rgba(255,140,20,0.3)] disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Enter dashboard"}
        </button>

        <p className="text-center text-[12px] text-white/35">
          Allowlisted admins only ·{" "}
          <Link href="/" className="text-[#2997ff] hover:underline">
            Public site
          </Link>
        </p>
      </form>
    </main>
  );
}
