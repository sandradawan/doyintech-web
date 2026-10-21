"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { StoreNav } from "@/components/store/StoreShell";

export default function PurchasesPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent("");
    try {
      const res = await fetch("/api/store/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSent(data.message || "Check your inbox.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[#070b12] pt-24 pb-24">
        <div className="mx-auto max-w-[720px] px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <Link href="/store" className="text-[14px] text-[#94a3b8] hover:text-white">
              ← Store
            </Link>
            <StoreNav />
          </div>

          <h1 className="text-2xl font-semibold text-white sm:text-3xl">My purchases</h1>
          <p className="mt-2 text-sm text-[#94a3b8]">
            Enter the email used at checkout and we&apos;ll email you your active download links.
          </p>

          <form onSubmit={lookup} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-xl border border-white/12 bg-[#0c1220] px-4 py-3 text-sm text-white outline-none focus:border-[#ff8c14]"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#ff8c14] px-6 py-3 text-sm font-semibold text-black hover:bg-[#ffa03a] disabled:opacity-50"
            >
              {loading ? "Sending…" : "Email my links"}
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          {sent && (
            <p className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {sent}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
