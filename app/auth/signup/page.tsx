"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const sb = getSupabaseBrowser();
    if (!sb) {
      setError("Auth is not configured (Supabase keys missing).");
      setLoading(false);
      return;
    }
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://doyintech.vercel.app";
    const { data, error: err } = await sb.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/wallet` },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      router.replace("/wallet");
      return;
    }
    setInfo("Check your email to confirm your account, then sign in.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0e17] px-5 pt-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-[#121820] p-6"
      >
        <h1 className="text-2xl font-semibold text-white">Create account</h1>
        <p className="text-sm text-[#86868b]">Free wallet for airtime, data, and more.</p>
        {error && (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
        )}
        {info && (
          <p className="rounded-xl bg-[#25D366]/10 px-3 py-2 text-sm text-[#c8f7d4]">{info}</p>
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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#ff8c14] py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
        <p className="text-center text-sm text-[#86868b]">
          Already have an account?{" "}
          <a href="/auth/login" className="text-[#ff8c14] hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </main>
  );
}
