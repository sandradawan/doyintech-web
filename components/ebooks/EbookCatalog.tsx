"use client";

import { useMemo, useState } from "react";
import type { PublicEbook } from "@/lib/shop/public";
import { EbookCard } from "@/components/ebooks/EbookShop";

const CATEGORIES = [
  "All",
  "Finance",
  "Wealth",
  "Education",
  "Fitness",
  "Food",
  "Culture",
  "Marketing",
  "Freelancing",
  "Business",
  "Sales",
  "Career",
  "Income",
  "Security",
  "Productivity",
  "AI & Productivity",
];

export default function EbookCatalog({ books }: { books: PublicEbook[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const available = useMemo(() => {
    const set = new Set(books.map((b) => b.category));
    return CATEGORIES.filter((c) => c === "All" || set.has(c));
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (category !== "All" && b.category !== category) return false;
      if (!q) return true;
      const hay = `${b.title} ${b.subtitle} ${b.blurb} ${b.category}`.toLowerCase();
      return hay.includes(q);
    });
  }, [books, category, query]);

  return (
    <div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ebooks…"
          className="w-full rounded-xl border border-brand-ink/12 bg-brand-ink/[0.04] px-4 py-2.5 text-sm text-brand-ink outline-none placeholder:text-[#64748b] focus:border-brand-link sm:max-w-xs"
        />
        <p className="text-[13px] text-brand-subtle">
          {filtered.length} book{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {available.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={
              category === c
                ? "rounded-full bg-brand-accent px-3.5 py-1.5 text-[12px] font-semibold text-black"
                : "rounded-full border border-brand-ink/12 bg-brand-ink/[0.03] px-3.5 py-1.5 text-[12px] font-medium text-brand-soft hover:border-brand-ink/25"
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="section-light band grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((book) => (
          <EbookCard key={book.id} book={book} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-[15px] text-brand-subtle">
          No ebooks match. Try another category or clear search.
        </p>
      )}
    </div>
  );
}
