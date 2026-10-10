"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SECRET_KEY = "doyin_admin_leads_secret";

type Row = {
  id: string;
  title: string;
  deal_type: string;
  property_type: string;
  location: string;
  price_usd: number;
  status: string;
  agent_name: string;
  agent_phone: string;
  agent_whatsapp: string;
  image_url?: string;
  video_url?: string;
  created_at?: string;
  verified?: boolean;
};

export default function AdminPropertiesPage() {
  const [secret, setSecret] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0 });

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(SECRET_KEY);
      if (s) setSecret(s);
    } catch {
      /* ignore */
    }
  }, []);

  async function load(override?: string) {
    const s = override ?? secret;
    if (!s) return;
    setLoading(true);
    setErr("");
    try {
      sessionStorage.setItem(SECRET_KEY, s);
    } catch {
      /* ignore */
    }
    try {
      const q = filter ? `?status=${filter}` : "";
      const res = await fetch(`/api/admin/properties${q}`, {
        headers: { "x-admin-secret": s },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setRows(json.listings || []);
      setCounts(json.counts || { total: 0, pending: 0, approved: 0 });
      setNote(json.sqlHint || json.error || "");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function setStatus(id: string, status: string) {
    if (!secret) return;
    const res = await fetch("/api/admin/properties", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({ id, status }),
    });
    const json = await res.json();
    if (!res.ok) {
      setErr(json.error || "Update failed");
      return;
    }
    await load();
  }

  return (
    <main className="pb-20 pt-8 lg:pt-10">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#ff8c14]">
              CRM · Real estate
            </p>
            <h1 className="mt-1 font-display text-[28px] font-semibold text-white">
              Property listings
            </h1>
            <p className="mt-2 text-[14px] text-[#a1a1a6]">
              Approve agent submissions to publish on{" "}
              <Link href="/real-estate" className="text-[#2997ff] hover:underline">
                /real-estate
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="min-w-[160px] rounded-xl border border-white/15 bg-[#141a28] px-4 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-white/15 bg-[#141a28] px-3 py-2.5 text-sm text-white"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
            <button
              type="button"
              onClick={() => load()}
              disabled={loading || !secret}
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>
        </div>

        {err && <p className="mt-4 text-sm text-red-400">{err}</p>}
        {note && <p className="mt-4 text-sm text-amber-400">{note}</p>}

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-[#141416] px-4 py-4">
            <p className="text-[22px] font-semibold text-white">{counts.total}</p>
            <p className="text-[11px] uppercase text-[#86868b]">Total</p>
          </div>
          <div className="rounded-2xl border border-[#ff8c14]/40 bg-[#ff8c14]/10 px-4 py-4">
            <p className="text-[22px] font-semibold text-white">{counts.pending}</p>
            <p className="text-[11px] uppercase text-[#86868b]">Pending</p>
          </div>
          <div className="rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-4">
            <p className="text-[22px] font-semibold text-white">{counts.approved}</p>
            <p className="text-[11px] uppercase text-[#86868b]">Live</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {rows.map((r) => (
            <article
              key={r.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#141416] p-4 sm:flex-row"
            >
              {r.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.image_url}
                  alt=""
                  className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-36"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">{r.title}</p>
                    <p className="text-[13px] text-[#a1a1a6]">
                      {r.location} · {r.deal_type} · {r.property_type} · $
                      {Number(r.price_usd).toLocaleString()}
                    </p>
                    <p className="mt-1 text-[12px] text-[#86868b]">
                      {r.agent_name} · {r.agent_phone}
                      {r.agent_whatsapp ? (
                        <>
                          {" · "}
                          <a
                            href={`https://wa.me/${r.agent_whatsapp.replace(/\D/g, "")}`}
                            className="text-[#25D366] hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-[#a1a1a6]">
                    {r.status}
                    {r.verified ? " · verified" : ""}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => setStatus(r.id, "approved")}
                      className="rounded-full bg-[#25D366] px-3 py-1.5 text-[12px] font-semibold text-white"
                    >
                      Approve
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => setStatus(r.id, "rejected")}
                      className="rounded-full border border-white/20 px-3 py-1.5 text-[12px] text-white"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setStatus(r.id, "archived")}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-[#86868b]"
                  >
                    Archive
                  </button>
                  {r.video_url ? (
                    <a
                      href={r.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#ff8c14]/40 px-3 py-1.5 text-[12px] text-[#ff8c14]"
                    >
                      Video
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
          {!rows.length && !loading && (
            <p className="text-center text-[14px] text-[#86868b]">
              No listings yet. Agents submit at /real-estate/list
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
