"use client";

import { useEffect, useMemo, useState } from "react";

const SECRET_KEY = "doyin_admin_leads_secret";

type PurchaseLead = {
  id: string;
  created_at: string;
  product: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  message?: string | null;
  source?: string | null;
  type: string;
};

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

export default function AdminOrdersPage() {
  const [secret, setSecret] = useState("");
  const [rows, setRows] = useState<PurchaseLead[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [q, setQ] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

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
    setError("");
    try {
      sessionStorage.setItem(SECRET_KEY, s);
    } catch {
      /* ignore */
    }
    try {
      // Reuse leads API filtered client-side for type=purchase + product sales signals
      const res = await fetch("/api/leads?limit=200", {
        headers: { "x-admin-secret": s },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const all = (data.leads || []) as PurchaseLead[];
      const purchases = all.filter(
        (l) =>
          l.type === "purchase" ||
          (l.product || "").toLowerCase().includes("buy") ||
          (l.message || "").toLowerCase().includes("paid")
      );
      setRows(purchases.length ? purchases : all.filter((l) => l.type === "purchase"));
      // If no purchase-typed rows, still show all leads tagged product-ish
      if (!purchases.length) {
        setRows(
          all.filter(
            (l) =>
              l.type === "purchase" ||
              l.type === "waitlist" ||
              (l.product && l.product !== "General")
          )
        );
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
      setRows([]);
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
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Update error");
    } finally {
      setUpdating(null);
    }
  }

  const filtered = useMemo(() => {
    let list = rows;
    if (filterStatus) list = list.filter((r) => r.status === filterStatus);
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(t) ||
          (r.email || "").toLowerCase().includes(t) ||
          (r.product || "").toLowerCase().includes(t) ||
          (r.phone || "").includes(t)
      );
    }
    return list;
  }, [rows, filterStatus, q]);

  const counts = useMemo(() => {
    const c = { total: rows.length, new: 0, won: 0, lost: 0 };
    for (const r of rows) {
      if (r.status === "new") c.new++;
      if (r.status === "won") c.won++;
      if (r.status === "lost") c.lost++;
    }
    return c;
  }, [rows]);

  function waLink(r: PurchaseLead) {
    const phone = (r.phone || "").replace(/\D/g, "");
    if (!phone) return null;
    const text = encodeURIComponent(
      `Hi ${r.name}, following up on your interest in ${r.product} (DoyinTech).`
    );
    const n = phone.startsWith("234") ? phone : phone.replace(/^0/, "234");
    return `https://wa.me/${n}?text=${text}`;
  }

  return (
    <main className="pb-20 pt-8 lg:pt-10">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#ff8c14]">
              Revenue
            </p>
            <h1 className="mt-1 font-display text-[26px] font-semibold text-white sm:text-[30px]">
              Orders & sales
            </h1>
            <p className="mt-1 max-w-xl text-[13px] text-[#a1a1a6]">
              Purchase leads, product interest, and paid signals from the site.
              Store listing review lives under Store admin.
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
            <button
              type="button"
              onClick={() => load()}
              disabled={loading || !secret}
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Loading…" : "Load"}
            </button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniKpi label="Records" value={counts.total} />
          <MiniKpi label="New" value={counts.new} accent />
          <MiniKpi label="Won" value={counts.won} />
          <MiniKpi label="Lost" value={counts.lost} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="/store/admin"
            className="rounded-full border border-white/15 px-4 py-2 text-[12px] text-[#a1a1a6] hover:border-[#ff8c14]/40 hover:text-white"
          >
            Store listing admin →
          </a>
          <a
            href="/ops/app"
            className="rounded-full border border-white/15 px-4 py-2 text-[12px] text-[#a1a1a6] hover:border-[#ff8c14]/40 hover:text-white"
          >
            DoyinOps invoices →
          </a>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, product…"
            className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white outline-none focus:border-[#ff8c14]"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 space-y-3">
          {filtered.length === 0 && !loading && (
            <p className="rounded-2xl border border-white/10 bg-[#141416] px-5 py-8 text-center text-[13px] text-[#86868b]">
              No purchase / product leads yet.
            </p>
          )}
          {filtered.map((r) => {
            const wa = waLink(r);
            return (
              <div
                key={r.id}
                className="rounded-2xl border border-white/10 bg-[#141416] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-white">
                      {r.name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#a1a1a6]">
                      {r.product} · {r.type}
                      {r.source ? ` · ${r.source}` : ""}
                    </p>
                    <p className="mt-1 text-[12px] text-[#86868b]">
                      {r.email || "—"}
                      {r.phone ? ` · ${r.phone}` : ""} ·{" "}
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString()
                        : ""}
                    </p>
                    {r.message && (
                      <p className="mt-2 line-clamp-2 text-[12px] text-[#a1a1a6]">
                        {r.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <select
                      value={r.status}
                      disabled={updating === r.id}
                      onChange={(e) => setStatus(r.id, e.target.value)}
                      className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-[12px] text-white"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-emerald-400 hover:underline"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function MiniKpi({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        accent
          ? "border-[#ff8c14]/40 bg-[#ff8c14]/10"
          : "border-white/10 bg-[#141416]"
      }`}
    >
      <p className="text-[22px] font-semibold text-white">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-[#86868b]">
        {label}
      </p>
    </div>
  );
}
