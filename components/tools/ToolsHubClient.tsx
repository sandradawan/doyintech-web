"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  TOOLS_META,
  TOOL_CATEGORIES,
  TOOLS_PER_PAGE,
  type ToolMeta,
} from "@/lib/tools/config";
import { ToolIcon, CategoryIcon } from "@/components/ui/BrandIcons";

type CatId = ToolMeta["category"] | "all";

export default function ToolsHubClient() {
  const [category, setCategory] = useState<CatId>("all");
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = TOOLS_META;
    if (category !== "all") list = list.filter((t) => t.category === category);
    if (query) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.short.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.slug.includes(query)
      );
    }
    return list;
  }, [category, q]);

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
      <div className="mt-8">
        <label className="sr-only" htmlFor="tool-search">
          Search tools
        </label>
        <input
          id="tool-search"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search tools — invoice, VAT, WhatsApp, margin, word counter…"
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-primary/50"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
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
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                category === cat.id
                  ? "bg-white text-black"
                  : "border border-white/15 text-gray-300 hover:border-white/30"
              }`}
            >
              <CategoryIcon category={cat.id} size={14} />
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Showing {slice.length} of {filtered.length} tools
        {category !== "all" ? " in this category" : ""}
        {q.trim() ? ` matching "${q.trim()}"` : ""} · Page {safePage} of {totalPages}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slice.map((t) => (
          <Link
            key={t.slug}
            href={t.href}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-primary/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40">
                <ToolIcon name={t.icon} size={20} />
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                {t.badge ? (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    {t.badge}
                  </span>
                ) : null}
                {t.paid ? (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                    {t.priceNgn ? `₦${t.priceNgn.toLocaleString()}` : "Paid"}
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                    Free
                  </span>
                )}
              </div>
            </div>
            <h2 className="mt-3 font-display text-lg font-semibold text-white group-hover:text-primary">
              {t.title}
            </h2>
            <p className="mt-1 text-sm text-gray-400">{t.short}</p>
            <p className="mt-2 line-clamp-2 text-xs text-gray-500">{t.description}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-gray-500">
          No tools match your search. Try invoice, VAT, WhatsApp, or margin.
        </p>
      ) : null}

      {totalPages > 1 ? (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
