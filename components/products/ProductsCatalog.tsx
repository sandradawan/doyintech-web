"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DIGITAL_PRODUCTS,
  PRODUCT_CATEGORIES,
  SAAS_PRODUCTS,
  productCategory,
  waitlistWhatsAppLink,
  type ProductCategory,
} from "@/lib/products";
import PaystackBuyButton from "@/components/ui/PaystackBuyButton";

type Filter = ProductCategory | "All";

const SLUG = (c: string) => c.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "");

export default function ProductsCatalog() {
  const [filter, setFilter] = useState<Filter>("All");
  const [q, setQ] = useState("");

  // Deep link: /products?c=students
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    const match = PRODUCT_CATEGORIES.find((x) => SLUG(x) === c);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the ?c= filter once on load
    if (match) setFilter(match);
  }, []);

  function choose(f: Filter) {
    setFilter(f);
    const url = new URL(window.location.href);
    if (f === "All") url.searchParams.delete("c");
    else url.searchParams.set("c", SLUG(f));
    window.history.replaceState(null, "", url);
  }

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of DIGITAL_PRODUCTS) m.set(productCategory(p), (m.get(productCategory(p)) || 0) + 1);
    return m;
  }, []);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return DIGITAL_PRODUCTS.filter((p) => filter === "All" || productCategory(p) === filter).filter(
      (p) => !query || `${p.name} ${p.description} ${p.features.join(" ")}`.toLowerCase().includes(query),
    );
  }, [filter, q]);

  return (
    <div className="mx-auto max-w-[1140px] px-6 pb-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter products by category" className="flex flex-wrap gap-2">
          {(["All", ...PRODUCT_CATEGORIES] as Filter[]).map((c) => {
            const n = c === "All" ? DIGITAL_PRODUCTS.length : counts.get(c) || 0;
            if (!n) return null;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={filter === c}
                onClick={() => choose(c)}
                className={`min-h-10 rounded-full px-4 text-[13px] font-semibold transition ${
                  filter === c ? "bg-white text-black" : "border border-white/15 text-[#c7cdd8] hover:border-white/35"
                }`}
              >
                {c} <span className="opacity-60">({n})</span>
              </button>
            );
          })}
        </div>
        <label className="md:w-72">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search: payroll, school, HR…"
            className="min-h-11 w-full rounded-full border border-white/15 bg-black/40 px-4 text-[14px] text-white outline-none placeholder:text-[#8a8f99] focus:border-[#ff8c14]"
          />
        </label>
      </div>

      <p className="mt-4 text-[13px] text-[#a1a1a6]" aria-live="polite">
        {list.length} product{list.length === 1 ? "" : "s"}
        {filter !== "All" ? ` in ${filter}` : ""}
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <article key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#16181d] transition hover:border-[#ff8c14]/50">
            <Link href={`/products/${p.id}`} className="flex flex-1 flex-col p-5 focus-visible:outline-none">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a1a1a6]">{productCategory(p)}</span>
                {p.badge && (
                  <span className="rounded-full bg-[#ff8c14]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#ffb366]">{p.badge}</span>
                )}
              </div>
              <h2 className="mt-3 text-[18px] font-semibold leading-snug text-white group-hover:text-[#ffb366]">{p.name}</h2>
              <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#a1a1a6]">{p.description}</p>
              <ul className="mt-4 space-y-1.5">
                {p.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] text-[#e8eaed]">
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 flex-none text-[#ff8c14]" fill="currentColor">
                      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-baseline gap-2 pt-5">
                <span className="text-[26px] font-semibold text-white">{p.priceNgn}</span>
                <span className="text-[13px] text-[#8a8f99]">≈ {p.priceUsd}</span>
              </div>
              <span className="mt-1 text-[13px] font-medium text-[#ffb366]">See what&apos;s inside →</span>
            </Link>
            <div className="border-t border-white/10 bg-black/30 px-5 py-4">
              <PaystackBuyButton product={p} />
            </div>
          </article>
        ))}
      </div>

      {list.length === 0 && (
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#141a28] p-8 text-center">
          <p className="text-[15px] text-white">Nothing matches “{q}”.</p>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            Try “payroll”, “school” or “WhatsApp”, browse our{" "}
            <Link href="/ebooks" className="text-[#ffb366] underline">ebooks</Link>, or{" "}
            <button type="button" className="text-[#ffb366] underline" onClick={() => { setQ(""); choose("All"); }}>
              show everything
            </button>
            .
          </p>
        </div>
      )}

      {SAAS_PRODUCTS.length > 0 && (
        <>
          <h3 className="mb-4 mt-16 text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[#a1a1a6]">Waitlist: monthly apps</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {SAAS_PRODUCTS.map((p) => (
              <article key={p.id} className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
                <p className="text-[15px] font-semibold text-white">{p.name}</p>
                <p className="mt-1 text-[13px] text-[#a1a1a6]">{p.priceNgn || p.priceUsd}</p>
                <a
                  href={waitlistWhatsAppLink(p.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-10 items-center text-[13px] font-semibold text-[#2997ff] hover:underline"
                >
                  Join waitlist ›
                </a>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        <Link href="/ebooks" className="rounded-2xl border border-white/10 bg-[#141a28] p-6 transition hover:border-white/30">
          <p className="text-[16px] font-semibold text-white">Prefer to read?</p>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">Practical ebooks on business, Excel, bookkeeping, remote jobs and final year projects. Read the first chapter free.</p>
          <span className="mt-3 inline-block text-[14px] font-semibold text-[#ffb366]">Browse ebooks →</span>
        </Link>
        <Link href="/tools" className="rounded-2xl border border-white/10 bg-[#141a28] p-6 transition hover:border-white/30">
          <p className="text-[16px] font-semibold text-white">Free tools</p>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">Payslips, invoices, certificates, ID cards, CGPA and more. Free PDF downloads, no sign-up.</p>
          <span className="mt-3 inline-block text-[14px] font-semibold text-[#ffb366]">Open the tools →</span>
        </Link>
      </div>
    </div>
  );
}
