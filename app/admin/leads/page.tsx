"use client";

import { useState } from "react";
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

export default function AdminLeadsPage() {
  const [secret, setSecret] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/leads?limit=100`, {
        headers: { "x-admin-secret": secret },
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

  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[900px] px-6">
          <h1 className="text-[28px] font-semibold text-white">Lead inbox</h1>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            Free audits, chat handoffs, and form leads. Requires ADMIN_LEADS_SECRET and Supabase{" "}
            <code className="text-[#ff8c14]">site_leads</code> table.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="min-w-[200px] flex-1 rounded-xl border border-white/15 bg-[#141a28] px-4 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
            />
            <button
              type="button"
              onClick={load}
              disabled={loading || !secret}
              className="rounded-full bg-[#ff8c14] px-6 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Loading…" : "Load leads"}
            </button>
          </div>
          {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
          {note && <p className="mt-3 text-sm text-amber-400">{note}</p>}

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
                  <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-[#a1a1a6]">
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
                <a
                  href={`https://wa.me/2348085343926?text=${encodeURIComponent(
                    `Follow up: ${l.name} — ${l.product}\n${l.message || ""}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[13px] font-semibold text-[#25D366]"
                >
                  Open WhatsApp follow-up →
                </a>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
