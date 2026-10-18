"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";

type Overview = {
  ok?: boolean;
  configured?: boolean;
  note?: string;
  stats: {
    leadsTotal: number;
    leadsNew: number;
    leads7: number;
    leads30: number;
    leadsWon: number;
    leadsByStatus: Record<string, number>;
    projectsTotal: number;
    projectsActive: number;
    projectValueNgn: number;
  } | null;
  needsAttention: Array<{
    kind: string;
    id: string;
    title: string;
    subtitle: string;
    status: string;
    at: string;
    href: string;
  }>;
  recent: Array<{
    kind: string;
    id: string;
    title: string;
    subtitle: string;
    at: string;
    href: string;
  }>;
  errors?: { leads?: string | null; projects?: string | null };
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
      const res = await fetch("/api/admin/overview", {
        headers: { ...session.authHeaders() },
      });
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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff8c14]">
            Operations
          </p>
          <h1 className="mt-1.5 font-display text-[26px] font-semibold tracking-tight text-white sm:text-[30px]">
            Welcome, {name}
          </h1>
          <p className="mt-1.5 text-[14px] text-[#a1a1a6]">
            Signed in with email · data loads from your admin session
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          disabled={loading || !session.isAdmin}
          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh data"}
        </button>
      </div>

      {err ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {err}
        </p>
      ) : null}
      {data?.note ? (
        <p className="text-sm text-amber-300">{data.note}</p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "New leads", value: stats?.leadsNew ?? "—", accent: true },
          { label: "Leads (7d)", value: stats?.leads7 ?? "—" },
          { label: "Leads total", value: stats?.leadsTotal ?? "—" },
          { label: "Active projects", value: stats?.projectsActive ?? "—" },
          {
            label: "Pipeline value",
            value: stats ? fmtNgn(stats.projectValueNgn) : "—",
          },
        ].map((k) => (
          <div
            key={k.label}
            className={`rounded-2xl border p-4 ${
              k.accent
                ? "border-[#ff8c14]/35 bg-[#ff8c14]/10"
                : "border-white/[0.08] bg-white/[0.03]"
            }`}
          >
            <p className="text-[11px] uppercase tracking-wide text-[#86868b]">{k.label}</p>
            <p className="mt-2 font-display text-[24px] font-semibold text-white tabular-nums">
              {loading && !stats ? "—" : k.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#121214] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-white">Needs attention</h2>
            <Link href="/admin/leads" className="text-[12px] text-[#2997ff] hover:underline">
              Leads →
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {!loading && !(data?.needsAttention || []).length ? (
              <p className="text-[13px] text-[#86868b]">Nothing urgent.</p>
            ) : null}
            {(data?.needsAttention || []).map((item) => (
              <Link
                key={`${item.kind}-${item.id}`}
                href={item.href}
                className="block rounded-xl border border-white/5 bg-black/30 px-3 py-2.5 transition hover:border-white/15"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-white">{item.title}</p>
                    <p className="truncate text-[12px] text-[#a1a1a6]">{item.subtitle}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[#a1a1a6]">
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-[#555]">{relativeTime(item.at)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#121214] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-white">Recent activity</h2>
            <Link href="/admin/student-projects" className="text-[12px] text-[#2997ff] hover:underline">
              Projects →
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {!loading && !(data?.recent || []).length ? (
              <p className="text-[13px] text-[#86868b]">No recent items yet.</p>
            ) : null}
            {(data?.recent || []).map((item) => (
              <Link
                key={`${item.kind}-${item.id}`}
                href={item.href}
                className="block rounded-xl border border-white/5 bg-black/30 px-3 py-2.5 transition hover:border-white/15"
              >
                <p className="truncate text-[13px] font-medium text-white">{item.title}</p>
                <p className="truncate text-[12px] text-[#a1a1a6]">{item.subtitle}</p>
                <p className="mt-1 text-[10px] text-[#555]">{relativeTime(item.at)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ["/admin/leads", "Leads"],
          ["/admin/student-projects", "Student projects"],
          ["/admin/analytics", "Analytics"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-[#e8e8ed] hover:border-[#ff8c14]/40"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
