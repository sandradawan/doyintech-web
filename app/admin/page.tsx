"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";

type Module = {
  id: string;
  title: string;
  desc: string;
  href: string;
  metric: number | null;
  metricLabel: string;
};

type Overview = {
  configured?: boolean;
  note?: string;
  stats: {
    leadsTotal: number;
    leadsNew: number;
    leads7: number;
    projectsActive: number;
    projectValueNgn: number;
    storeOrders: number;
    storeRevenueNgn: number;
    storeListings: number;
    opsWorkspaces: number;
  } | null;
  modules?: Module[];
  needsAttention: Array<{ kind: string; id: string; title: string; subtitle: string; status: string; at: string; href: string }>;
  recent: Array<{ kind: string; id: string; title: string; subtitle: string; at: string; href: string }>;
};

function fmtNgn(n: number) {
  return `₦${Math.round(n).toLocaleString("en-NG")}`;
}

function relativeTime(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 14) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AdminHomePage() {
  const session = useAdminSession();
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!session.isAdmin) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/overview", { headers: { ...session.authHeaders() } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load overview");
      setData(json);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session.isAdmin) void load();
  }, [session.isAdmin, load]);

  const stats = data?.stats;
  const name = session.email?.split("@")[0] || "Admin";
  const modules = data?.modules || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff8c14]">Command center</p>
          <h1 className="mt-1.5 font-display text-[26px] font-semibold tracking-tight text-white sm:text-[30px]">Welcome, {name}</h1>
          <p className="mt-1.5 max-w-xl text-[14px] text-[#a1a1a6]">Manage leads, students, store, orders, ops, AI tools, and site content from one place.</p>
        </div>
        <button type="button" onClick={() => load()} disabled={loading || !session.isAdmin} className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh data"}
        </button>
      </div>

      {err ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{err}</p> : null}
      {data?.note ? <p className="text-sm text-amber-300">{data.note}</p> : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "New leads", value: stats?.leadsNew ?? "—", accent: true },
          { label: "Leads (7d)", value: stats?.leads7 ?? "—" },
          { label: "Active projects", value: stats?.projectsActive ?? "—" },
          { label: "Pipeline ₦", value: stats ? fmtNgn(stats.projectValueNgn) : "—" },
          { label: "Store orders", value: stats?.storeOrders ?? "—" },
          { label: "Store revenue", value: stats ? fmtNgn(stats.storeRevenueNgn) : "—" },
        ].map((k) => (
          <div key={k.label} className={`rounded-2xl border p-4 ${k.accent ? "border-[#ff8c14]/35 bg-[#ff8c14]/10" : "border-white/[0.08] bg-white/[0.03]"}`}>
            <p className="text-[11px] uppercase tracking-wide text-[#86868b]">{k.label}</p>
            <p className="mt-2 font-display text-[22px] font-semibold tabular-nums text-white">{loading && !stats ? "—" : k.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-[15px] font-semibold text-white">All modules</h2>
        <p className="mt-1 text-[13px] text-[#86868b]">Every major product surface on doyintech.com</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <Link key={m.id} href={m.href} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#ff8c14]/40 hover:bg-[#ff8c14]/5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14px] font-semibold text-white">{m.title}</p>
                {m.metric != null ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] tabular-nums text-[#ff8c14]">{m.metric} {m.metricLabel}</span>
                ) : (
                  <span className="text-[11px] text-[#86868b]">{m.metricLabel}</span>
                )}
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-[#a1a1a6]">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#121214] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-white">Needs attention</h2>
            <Link href="/admin/leads" className="text-[12px] text-[#2997ff] hover:underline">Open →</Link>
          </div>
          <div className="mt-4 space-y-2">
            {!loading && !(data?.needsAttention || []).length ? <p className="text-[13px] text-[#86868b]">Nothing urgent.</p> : null}
            {(data?.needsAttention || []).map((item) => (
              <Link key={`${item.kind}-${item.id}`} href={item.href} className="block rounded-xl border border-white/5 bg-black/30 px-3 py-2.5 transition hover:border-white/15">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-white">{item.title}</p>
                    <p className="truncate text-[12px] text-[#a1a1a6]">{item.subtitle}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[#a1a1a6]">{item.status}</span>
                </div>
                <p className="mt-1 text-[10px] text-[#555]">{relativeTime(item.at)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#121214] p-5">
          <h2 className="text-[15px] font-semibold text-white">Recent activity</h2>
          <div className="mt-4 space-y-2">
            {!loading && !(data?.recent || []).length ? <p className="text-[13px] text-[#86868b]">No recent items yet.</p> : null}
            {(data?.recent || []).map((item) => (
              <Link key={`${item.kind}-${item.id}`} href={item.href} className="block rounded-xl border border-white/5 bg-black/30 px-3 py-2.5 transition hover:border-white/15">
                <p className="truncate text-[13px] font-medium text-white">{item.title}</p>
                <p className="truncate text-[12px] text-[#a1a1a6]">{item.kind} · {item.subtitle}</p>
                <p className="mt-1 text-[10px] text-[#555]">{relativeTime(item.at)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
