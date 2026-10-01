"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";

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
    <main className="flex min-h-screen items-center justify-center bg-[#0a0e17] px-5 pt-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-[#121820] p-6"
      >
        <h1 className="text-2xl font-semibold text-white">Sign in</h1>
        <p className="text-sm text-[#86868b]">Access your wallet, top up airtime & data.</p>
        {error && (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
        )}
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]/50"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#ff8c14] py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-sm text-[#86868b]">
          No account?{" "}
          <a href="/auth/signup" className="text-[#ff8c14] hover:underline">
            Create one
          </a>
        </p>
      </form>
    </main>
  );
}
