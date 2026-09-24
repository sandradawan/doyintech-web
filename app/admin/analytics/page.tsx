"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/ui/Footer";

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
    engagementRate: number;
  };
  platforms: {
    tiktok: PlatformStats;
    instagram: PlatformStats;
    youtube: PlatformStats;
  };
  notes: string[];
};

type PlatformStats = {
  name: string;
  handle: string;
  views: number;
  likes: number;
  comments: number;
  shares?: number;
  status: string;
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/data/social-analytics.json?t=" + Date.now());
        if (!res.ok) throw new Error("Failed to load analytics data");
        const json = await res.json();
        setData(json);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error loading data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black pt-24 pb-24">
        <div className="mx-auto max-w-[960px] px-6">
          <p className="text-[#a1a1a6]">Loading analytics…</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-black pt-24 pb-24">
        <div className="mx-auto max-w-[960px] px-6">
          <p className="text-red-400">{error || "No data available"}</p>
        </div>
      </main>
    );
  }

  const { summary, yesterday, platforms, notes, lastUpdated, period } = data;

  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[960px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-semibold text-white">
                Social Analytics
              </h1>
              <p className="mt-1 text-[14px] text-[#a1a1a6]">
                Live view of DoyinTech growth across platforms
              </p>
            </div>
            <p className="text-[12px] text-[#86868b]">
              Updated: {new Date(lastUpdated).toLocaleString("en-NG")}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <StatCard label="Posts" value={summary.totalPosts} />
            <StatCard label="Views" value={summary.totalViews.toLocaleString()} />
            <StatCard label="Likes" value={summary.totalReactions} />
            <StatCard label="Comments" value={summary.totalComments} />
            <StatCard
              label="Eng. Rate"
              value={`${summary.engagementRate}%`}
              highlight
            />
          </div>

          {/* Yesterday */}
          <section className="mt-10">
            <h2 className="text-[18px] font-semibold text-white">
              Yesterday ({yesterday.date})
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Posts" value={yesterday.posts} small />
              <StatCard label="Views" value={yesterday.views} small />
              <StatCard label="Likes" value={yesterday.reactions} small />
              <StatCard label="Comments" value={yesterday.comments} small />
            </div>
          </section>

          {/* Platforms */}
          <section className="mt-10">
            <h2 className="text-[18px] font-semibold text-white">
              Platforms
            </h2>
            <div className="mt-4 space-y-4">
              {Object.values(platforms).map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[16px] font-semibold text-white">
                        {p.name}
                      </p>
                      <p className="text-[13px] text-[#a1a1a6]">{p.handle}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-[#a1a1a6]">
                      {p.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    <MiniStat label="Views" value={p.views} />
                    <MiniStat label="Likes" value={p.likes} />
                    <MiniStat label="Comments" value={p.comments} />
                    {p.shares !== undefined && (
                      <MiniStat label="Shares" value={p.shares} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section className="mt-10">
            <h2 className="text-[18px] font-semibold text-white">Notes</h2>
            <ul className="mt-3 space-y-2">
              {notes.map((note, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-white/10 bg-[#141a28] px-4 py-3 text-[13px] text-[#c7cdd8]"
                >
                  {note}
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-10 text-center text-[12px] text-[#555]">
            Data period: {period}. Updated daily from Buffer.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatCard({
  label,
  value,
  highlight,
  small,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#1d1d1f] px-4 py-4 text-center ${
        highlight ? "border-[#ff8c14]/40" : ""
      }`}
    >
      <p
        className={`font-semibold text-white ${
          small ? "text-[20px]" : "text-[24px]"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-[#86868b]">
        {label}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-[18px] font-semibold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-[#86868b]">
        {label}
      </p>
    </div>
  );
}
