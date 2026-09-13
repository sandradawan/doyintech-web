"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  TOOLS_META,
  TOOL_CATEGORIES,
  TOOLS_PER_PAGE,
  type ToolMeta,
} from "@/lib/tools/config";

const icons: Record<string, string> = {
  pdf: "📄",
  calculator: "₦",
  audit: "◎",
  orgsec: "📡",
  shield: "🛡",
  headers: "☰",
  ssl: "🔐",
  exposed: "📂",
  cookie: "🍪",
  csp: "🧩",
  robots: "🤖",
  mixed: "🔗",
  redirect: "↪",
  checklist: "☑",
  golive: "🚀",
  breach: "⚠",
  deps: "📦",
  cv: "▤",
  readiness: "◈",
  brief: "☰",
  proposal: "📄",
  contract: "✍",
  status: "▣",
  stack: "⬡",
  hosting: "☁",
  roi: "%",
  invoice: "§",
  wa: "✆",
  maintain: "⚙",
  email: "✉",
  salary: "₦",
  skills: "◆",
  letter: "✎",
  ideas: "✦",
  interview: "?",
  ai: "◉",
  bot: "▣",
  qr: "▦",
  lock: "🔒",
};

type CatId = ToolMeta["category"] | "all";

export default function ToolsHubClient() {
  const [category, setCategory] = useState<CatId>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (category === "all") return TOOLS_META;
    return TOOLS_META.filter((t) => t.category === category);
  }, [category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / TOOLS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice(
    (safePage - 1) * TOOLS_PER_PAGE,
    safePage * TOOLS_PER_PAGE
  );

  function selectCategory(id: CatId) {
    setCategory(id);
    setPage(1);
  }

  return (
    <div>
      <div className="mt-10 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => selectCategory("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            category === "all"
              ? "bg-white text-black"
              : "border border-white/15 text-gray-300 hover:border-white/30"
          }`}
        >
          All ({TOOLS_META.length})
        </button>
        {TOOL_CATEGORIES.map((cat) => {
          const count = TOOLS_META.filter((t) => t.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => selectCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                category === cat.id
                  ? "bg-white text-black"
                  : "border border-white/15 text-gray-300 hover:border-white/30"
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Showing {slice.length} of {filtered.length} tools
        {category !== "all" ? ` in this category` : ""} · Page {safePage} of{" "}
        {totalPages}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slice.map((t) => (
          <Link
            key={t.slug}
            href={t.href}
            className="group rounded-2xl border border-white/10 bg-surface/80 p-5 transition hover:border-primary/40 hover:bg-surface"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-lg text-primary">
                {icons[t.icon] || "•"}
              </div>
              {t.paid && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                  Paid
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-white group-hover:text-primary">
              {t.title}
            </h3>
            <p className="mt-1.5 text-sm text-gray-400">{t.short}</p>
            <span className="mt-4 inline-flex text-xs font-bold uppercase tracking-wider text-primary">
              Use tool →
            </span>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white disabled:opacity-30"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`h-9 w-9 rounded-full text-sm font-semibold ${
                n === safePage
                  ? "bg-white text-black"
                  : "border border-white/15 text-gray-300"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
