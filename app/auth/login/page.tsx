"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { IconWallet, IconShield } from "@/components/bills/BillsIcons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const sb = getSupabaseBrowser();
    if (!sb) {
      setError("Auth is not configured (Supabase keys missing).");
      setLoading(false);
      return;
    }
    const { error: err } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace("/wallet");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b12] px-5 pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,140,20,0.12),_transparent_60%)]" />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#ff8c14]">
            <IconWallet className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/40">Sign in to your DoyinTech wallet</p>
        </div>
        {error && (
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200">
            {error}
          </p>
        )}
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none placeholder:text-white/30 focus:border-[#ff8c14]/50"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none placeholder:text-white/30 focus:border-[#ff8c14]/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-[#ff9a2e] to-[#ff8c14] py-3.5 font-semibold text-black shadow-[0_8px_28px_rgba(255,140,20,0.3)] disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-white/30">
          <IconShield className="h-3.5 w-3.5" />
          Secure session · encrypted
        </p>
        <p className="text-center text-sm text-white/40">
          No account?{" "}
          <a href="/auth/signup" className="font-semibold text-[#ff8c14] hover:underline">
            Create one
          </a>
        </p>
      </form>
    </main>
  );
}
