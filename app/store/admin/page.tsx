"use client";

import { useCallback, useEffect, useState } from "react";
import Footer from "@/components/ui/Footer";
import { StoreNav } from "@/components/store/StoreShell";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type Sub = {
  id: string;
  title: string;
  developerName: string;
  developerEmail: string;
  platform: string;
  kind: string;
  priceNgn: number;
  packageType?: string;
  fileName?: string;
  reviewStatus: string;
  virusScanStatus: string;
  securityNotes?: string;
  shortDescription: string;
  createdAt: string;
};

export default function StoreAdminPage() {
  const [key, setKey] = useState("");
  const [items, setItems] = useState<Sub[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");
  const [live, setLive] = useState(false);

  const load = useCallback(async () => {
    if (!key.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/store/admin`, {
        headers: { "x-store-admin-key": key.trim() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setItems(data.submissions || []);
      setSource(data.source || "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [key]);

  // Auto-refresh every 8s when key present
  useEffect(() => {
    if (!key.trim()) return;
    void load();
    const t = setInterval(() => void load(), 8000);
    return () => clearInterval(t);
  }, [key, load]);

  // Supabase Realtime — new/updated public rows (approved catalog changes)
  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const channel = sb
      .channel("store-listings-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "store_listings" },
        () => {
          setLive(true);
          if (key.trim()) void load();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setLive(true);
      });
    return () => {
      void sb.removeChannel(channel);
    };
  }, [key, load]);

  async function act(id: string, reviewStatus: string) {
    const notes = window.prompt("Security notes (optional)") || "";
    const res = await fetch("/api/store/admin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-store-admin-key": key.trim(),
      },
      body: JSON.stringify({ id, reviewStatus, securityNotes: notes }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }
    await load();
  }

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pt-24 pb-24">
        <div className="mx-auto max-w-[960px] px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
                Admin
              </p>
              <h1 className="mt-2 text-[28px] font-semibold text-white">Review queue</h1>
              <p className="mt-1 text-[13px] text-[#a1a1a6]">
                Backed by Supabase. Set STORE_ADMIN_KEY on Vercel.{" "}
                {source && (
                  <span className="text-[#ff8c14]">source: {source}</span>
                )}
                {live && (
                  <span className="ml-2 inline-flex items-center gap-1 text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    live
                  </span>
                )}
              </p>
            </div>
            <StoreNav />
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="STORE_ADMIN_KEY"
              className="min-w-[200px] flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          <div className="space-y-4">
            {items.length === 0 && !error && (
              <p className="text-[#a1a1a6]">
                {key ? "No submissions yet — submit via /store/developer." : "Enter admin key to load queue."}
              </p>
            )}
            {items.map((s) => (
              <article
                key={s.id}
                className="rounded-2xl border border-white/10 bg-[#141a28] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[17px] font-semibold text-white">{s.title}</h2>
                    <p className="text-[13px] text-[#a1a1a6]">
                      {s.developerName} · {s.developerEmail}
                    </p>
                    <p className="mt-1 text-[12px] text-[#86868b]">
                      {s.kind} · {s.platform} · {s.packageType || "—"} ·{" "}
                      {s.fileName || "no file"} · ₦{(s.priceNgn || 0).toLocaleString()}
                    </p>
                    <p className="mt-2 text-[13px] text-[#c7cdd8]">{s.shortDescription}</p>
                    <p className="mt-2 text-[12px]">
                      <span className="text-[#ff8c14]">{s.reviewStatus}</span>
                      {" · scan: "}
                      <span className="text-emerald-400">{s.virusScanStatus}</span>
                    </p>
                    {s.securityNotes && (
                      <p className="mt-1 text-[12px] text-[#a1a1a6]">Notes: {s.securityNotes}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => void act(s.id, "approved")}
                      className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-black"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => void act(s.id, "changes_requested")}
                      className="rounded-full border border-white/20 px-4 py-2 text-xs text-white"
                    >
                      Request changes
                    </button>
                    <button
                      type="button"
                      onClick={() => void act(s.id, "rejected")}
                      className="rounded-full border border-red-500/40 px-4 py-2 text-xs text-red-300"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
