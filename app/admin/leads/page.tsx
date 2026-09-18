"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/ui/Footer";

type Lead = {
  id: string;
  created_at: string;
  type: string;
  product: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  source?: string | null;
  status: string;
};

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;
const SECRET_KEY = "doyin_admin_leads_secret";

export default function AdminLeadsPage() {
  const [secret, setSecret] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(SECRET_KEY);
      if (s) setSecret(s);
    } catch {
      /* ignore */
    }
  }, []);

  async function load(overrideSecret?: string) {
    const s = overrideSecret ?? secret;
    if (!s) return;
    setLoading(true);
    setErr("");
    try {
      sessionStorage.setItem(SECRET_KEY, s);
    } catch {
      /* ignore */
    }
    try {
      const qs = new URLSearchParams({ limit: "100" });
      if (filterStatus) qs.set("status", filterStatus);
      if (filterType) qs.set("type", filterType);
      const res = await fetch(`/api/leads?${qs}`, {
        headers: { "x-admin-secret": s },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setLeads(data.leads || []);
      setNote(data.note || "");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function setStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Update error");
    } finally {
      setUpdating(null);
    }
  }

  const stats = useMemo(() => {
    const c = { new: 0, contacted: 0, qualified: 0, won: 0, lost: 0, total: leads.length };
    for (const l of leads) {
      if (l.status in c) (c as Record<string, number>)[l.status]++;
    }
    return c;
  }, [leads]);

  function waLink(l: Lead) {
    const phone = (l.phone || "").replace(/\D/g, "");
    const text = encodeURIComponent(
      `Hi ${l.name.split(" ")[0] || "there"}, this is DoyinTech following up on ${l.product}.`
    );
    if (phone.length >= 10) {
      const n = phone.startsWith("234") ? phone : phone.replace(/^0/, "234");
      return `https://wa.me/${n}?text=${text}`;
    }
    return `https://wa.me/2348085343926?text=${encodeURIComponent(
      `Follow up draft for ${l.name} — ${l.product}\n${l.message || ""}`
    )}`;
  }

  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[960px] px-6">
          <h1 className="text-[28px] font-semibold text-white">Lead inbox</h1>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            Audits, deposits, chat handoffs. Needs{" "}
            <code className="text-[#ff8c14]">ADMIN_LEADS_SECRET</code> + Supabase{" "}
            <code className="text-[#ff8c14]">site_leads</code> (see docs/site-leads.sql).
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="min-w-[200px] flex-1 rounded-xl border border-white/15 bg-[#141a28] px-4 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-white/15 bg-[#141a28] px-3 py-2.5 text-sm text-white"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-xl border border-white/15 bg-[#141a28] px-3 py-2.5 text-sm text-white"
            >
              <option value="">All types</option>
              <option value="audit">audit</option>
              <option value="purchase">purchase</option>
              <option value="lead-magnet">lead-magnet</option>
              <option value="chat">chat</option>
              <option value="waitlist">waitlist</option>
            </select>
            <button
              type="button"
              onClick={() => load()}
              disabled={loading || !secret}
              className="rounded-full bg-[#ff8c14] px-6 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Loading…" : "Load leads"}
            </button>
          </div>
          {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
          {note && <p className="mt-3 text-sm text-amber-400">{note}</p>}

          {leads.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-6">
              {(["total", "new", "contacted", "qualified", "won", "lost"] as const).map((k) => (
                <div
                  key={k}
                  className="rounded-xl border border-white/10 bg-[#1d1d1f] px-3 py-2 text-center"
                >
                  <p className="text-[18px] font-semibold text-white">{stats[k]}</p>
                  <p className="text-[10px] uppercase tracking-wide text-[#86868b]">{k}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 space-y-3">
            {leads.length === 0 && !loading && (
              <p className="text-[14px] text-[#86868b]">No leads loaded yet.</p>
            )}
            {leads.map((l) => (
              <article
                key={l.id}
                className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[16px] font-semibold text-white">{l.name}</p>
                    <p className="mt-1 text-[13px] text-[#a1a1a6]">
                      {l.product} · {l.type}
                      {l.source ? ` · ${l.source}` : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] ${
                      l.status === "new"
                        ? "border-[#ff8c14]/40 text-[#ff8c14]"
                        : l.status === "won"
                          ? "border-emerald-500/40 text-emerald-400"
                          : "border-white/10 text-[#a1a1a6]"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-[#c7cdd8]">
                  {l.email || "—"} · {l.phone || "—"}
                </p>
                {l.message && (
                  <p className="mt-2 whitespace-pre-wrap text-[13px] text-[#a1a1a6]">{l.message}</p>
                )}
                <p className="mt-2 text-[11px] text-[#555]">
                  {l.created_at ? new Date(l.created_at).toLocaleString() : ""}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {STATUSES.filter((s) => s !== l.status).map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={updating === l.id}
                      onClick={() => setStatus(l.id, s)}
                      className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-[#a1a1a6] hover:border-[#ff8c14]/50 hover:text-white disabled:opacity-40"
                    >
                      → {s}
                    </button>
                  ))}
                  <a
                    href={waLink(l)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#25D366]/15 px-3 py-1 text-[11px] font-semibold text-[#25D366]"
                  >
                    WhatsApp →
                  </a>
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
