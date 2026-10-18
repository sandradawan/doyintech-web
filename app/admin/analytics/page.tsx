"use client";

import { useEffect, useState } from "react";

type AnalyticsData = {
  lastUpdated: string;
  period: string;
  summary: {
    totalPosts: number;
    totalViews: number;
    totalReactions: number;
    totalComments: number;
    engagementRate: number;
  };
  yesterday: {
    date: string;
    posts: number;
    views: number;
    reactions: number;
    comments: number;
  };
  platforms?: Array<{
    name: string;
    posts?: number;
    views?: number;
    reactions?: number;
    comments?: number;
  }>;
  note?: string;
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch("/data/social-analytics.json?t=" + Date.now());
        if (!res.ok) throw new Error("Analytics file not found (public/data/social-analytics.json)");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e: unknown) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Could not load analytics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const s = data?.summary;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Insights</p>
        <h1 className="mt-1 font-display text-[24px] font-semibold text-white">Social analytics</h1>
        <p className="mt-1 text-[13px] text-[#86868b]">
          Snapshot from static export. Meta Pixel / ads metrics appear in Events Manager after Pixel is live.
        </p>
      </div>

      {loading ? <p className="text-[13px] text-[#86868b]">Loading…</p> : null}
      {err ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">{err}</p>
      ) : null}

      {s ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Posts" value={s.totalPosts} />
            <Kpi label="Views" value={s.totalViews} />
            <Kpi label="Reactions" value={s.totalReactions} />
            <Kpi label="Engagement %" value={s.engagementRate} />
          </div>
          {data?.yesterday ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[12px] uppercase tracking-wide text-[#86868b]">Yesterday · {data.yesterday.date}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniStat label="Posts" value={data.yesterday.posts} />
                <MiniStat label="Views" value={data.yesterday.views} />
                <MiniStat label="Reactions" value={data.yesterday.reactions} />
                <MiniStat label="Comments" value={data.yesterday.comments} />
              </div>
            </div>
          ) : null}
          {data?.platforms?.length ? (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-white/[0.04] text-[11px] uppercase text-[#86868b]">
                  <tr>
                    <th className="px-3 py-2.5">Platform</th>
                    <th className="px-3 py-2.5">Posts</th>
                    <th className="px-3 py-2.5">Views</th>
                    <th className="px-3 py-2.5">Reactions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.platforms.map((p) => (
                    <tr key={p.name} className="border-t border-white/5">
                      <td className="px-3 py-3 text-white">{p.name}</td>
                      <td className="px-3 py-3 text-[#a1a1a6]">{p.posts ?? "—"}</td>
                      <td className="px-3 py-3 text-[#a1a1a6]">{p.views ?? "—"}</td>
                      <td className="px-3 py-3 text-[#a1a1a6]">{p.reactions ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          <p className="text-[12px] text-[#555]">Updated {data?.lastUpdated || "—"} · period {data?.period || "—"}</p>
        </>
      ) : null}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <p className="font-display text-[22px] font-semibold text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-[#86868b]">{label}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-[18px] font-semibold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-[#86868b]">{label}</p>
    </div>
  );
}
