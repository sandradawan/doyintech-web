"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { StoreListing } from "@/lib/store/types";
import { formatNgn } from "@/lib/store/catalog";
import { productWhatsAppLink } from "@/lib/products";
import { StoreAppIcon } from "@/components/ui/BrandIcons";

/** Minimal nav — only essential links */
export function StoreNav() {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Link
        href="/store/purchases"
        className="rounded-full border border-white/15 px-4 py-2 font-medium text-[#cbd5e1] transition hover:border-white/30 hover:text-white"
      >
        Purchases
      </Link>
      <Link
        href="/store/auth"
        className="rounded-full bg-[#ff8c14] px-4 py-2 font-semibold text-black transition hover:bg-[#ffa03a]"
      >
        Developer
      </Link>
    </div>
  );
}

/** Hero carousel: top-rated + latest apps with screenshots */
export function HeroCarousel({ listings }: { listings: StoreListing[] }) {
  const slides = useMemo(() => {
    const withShot = listings.filter(
      (l) => (l.screenshots && l.screenshots.length > 0) || l.iconUrl
    );
    const topRated = [...withShot]
      .sort((a, b) => b.ratingAvg - a.ratingAvg || b.downloads - a.downloads)
      .slice(0, 4);
    const latest = [...withShot]
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      )
      .slice(0, 4);

    const seen = new Set<string>();
    const merged: StoreListing[] = [];
    for (const item of [...topRated, ...latest]) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      merged.push(item);
      if (merged.length >= 6) break;
    }
    if (merged.length === 0) {
      return listings.slice(0, 4);
    }
    return merged;
  }, [listings]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-3xl border border-white/[0.08] bg-[#0c1220] sm:h-[340px]">
        <p className="text-sm text-[#64748b]">Apps will appear here once published.</p>
      </div>
    );
  }

  const current = slides[index];
  const cover = current.screenshots?.[0] || current.iconUrl || null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c1220]">
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] sm:min-h-[320px]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current.id}
            src={cover}
            alt={current.title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#ff8c14]/20 via-[#0c1220] to-[#070b12]">
            <StoreAppIcon slug={current.slug} category={current.category} size={64} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b12]/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">
                {index < 3 ? "Top rated" : "Latest"}
              </p>
              <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-white sm:text-[28px]">
                {current.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-[13px] text-[#94a3b8] sm:text-[14px]">
                {current.shortDescription}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-[#cbd5e1]">
                <span className="font-semibold text-white">{formatNgn(current.priceNgn)}</span>
                <span className="text-[#64748b]">·</span>
                <span className="flex items-center gap-1">
                  <span className="text-amber-400">★</span>
                  {current.ratingAvg.toFixed(1)}
                </span>
                <span className="text-[#64748b]">·</span>
                <span className="capitalize text-[#94a3b8]">{current.platform}</span>
              </div>
            </div>
            <Link
              href={`/store/${current.slug}`}
              className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ff8c14]"
            >
              View app
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1.5 sm:bottom-auto sm:right-6 sm:top-6">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-[#ff8c14]" : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ListingCard({ item }: { item: StoreListing }) {
  const cover = item.screenshots?.[0] || item.iconUrl;

  return (
    <Link
      href={`/store/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1220] transition duration-200 hover:border-[#ff8c14]/35"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0f1a]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ff8c14]/12 to-transparent">
            <StoreAppIcon slug={item.slug} category={item.category} size={36} />
          </div>
        )}
        {item.priceNgn === 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-black">
            Free
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate text-[15px] font-semibold text-white group-hover:text-[#ff8c14]">
          {item.title}
        </h3>
        <p className="mt-0.5 text-[12px] text-[#64748b]">{item.developerName}</p>
        <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-[#94a3b8]">
          {item.shortDescription}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-[14px] font-semibold text-white">{formatNgn(item.priceNgn)}</span>
          <span className="flex items-center gap-1 text-[12px] text-[#64748b]">
            <span className="text-amber-400">★</span>
            {item.ratingAvg.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function StoreBrowse({
  listings,
  categories,
}: {
  listings: StoreListing[];
  categories: readonly string[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [price, setPrice] = useState<"all" | "free" | "paid">("all");
  const [sort, setSort] = useState<"top" | "newest" | "price">("top");

  const filtered = useMemo(() => {
    let list = listings.filter((l) => {
      const okCat =
        cat === "All" ||
        l.category === cat ||
        (cat === "Digital Products" && l.kind === "digital_product");
      const okQ =
        !q ||
        l.title.toLowerCase().includes(q.toLowerCase()) ||
        l.shortDescription.toLowerCase().includes(q.toLowerCase()) ||
        l.developerName.toLowerCase().includes(q.toLowerCase());
      const okPrice =
        price === "all" ||
        (price === "free" && l.priceNgn === 0) ||
        (price === "paid" && l.priceNgn > 0);
      return okCat && okQ && okPrice;
    });
    list = [...list].sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
        );
      }
      if (sort === "price") return a.priceNgn - b.priceNgn;
      return b.ratingAvg - a.ratingAvg || b.downloads - a.downloads;
    });
    return list;
  }, [listings, q, cat, price, sort]);

  return (
    <div>
      <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search apps…"
          className="w-full rounded-xl border border-white/10 bg-[#0a0f1a] px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/25 focus:border-[#ff8c14]/50"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "top" | "newest" | "price")}
          className="rounded-xl border border-white/10 bg-[#0a0f1a] px-3 py-3 text-[13px] text-white outline-none focus:border-[#ff8c14]/50"
        >
          <option value="top">Top rated</option>
          <option value="newest">Newest</option>
          <option value="price">Price: low → high</option>
        </select>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {(["all", "free", "paid"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPrice(p)}
            className={`rounded-full px-3 py-1 text-[12px] font-medium transition ${
              price === p ? "bg-white/15 text-white" : "text-[#64748b] hover:text-white"
            }`}
          >
            {p === "all" ? "All prices" : p === "free" ? "Free" : "Paid"}
          </button>
        ))}
        <span className="mx-1 text-[#334155]">|</span>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1 text-[12px] font-medium transition ${
              cat === c ? "bg-[#ff8c14] text-black" : "text-[#64748b] hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <ListingCard key={item.id} item={item} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-[#64748b]">No apps match your search.</p>
      )}
    </div>
  );
}

export function BuyDownloadPanel({ item }: { item: StoreListing }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "err">("idle");
  const [msg, setMsg] = useState("");

  const isWebApp = item.platform === "web" && !!item.launchUrl;

  async function start() {
    if (isWebApp && item.priceNgn === 0 && item.launchUrl) {
      window.location.href = item.launchUrl;
      return;
    }

    setStatus("loading");
    setMsg("");
    try {
      if (item.priceNgn === 0) {
        const res = await fetch("/api/store/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: item.slug,
            email: email || "guest@doyintech.local",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setStatus("ready");
        setMsg(data.message || "Download ready");
        if (data.downloadUrl) {
          window.location.href = data.downloadUrl;
        }
        return;
      }

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.slug === "sme-digital-ops-system" ? "sme-digital-ops-system" : item.id,
          email: email.trim(),
          name: "Store buyer",
        }),
      });
      const data = await res.json();
      if (res.status === 503 || data.code === "NO_KEYS" || !data.authorization_url) {
        window.location.href = productWhatsAppLink(item.title, "DoyinStore purchase");
        return;
      }
      window.location.href = data.authorization_url;
    } catch (e: unknown) {
      setStatus("err");
      setMsg(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1220] p-5">
      <p className="text-[26px] font-semibold text-white">{formatNgn(item.priceNgn)}</p>
      <p className="mt-1 text-[12px] text-[#64748b]">
        {item.reviewStatus === "approved" ? "Security reviewed" : ""}
        {item.virusScanStatus === "clean" ? " · Scan clean" : ""}
      </p>

      {!isWebApp && (
        <label className="mt-4 block">
          <span className="text-[12px] text-[#94a3b8]">
            {item.priceNgn > 0 ? "Email for receipt" : "Email (optional)"}
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
            placeholder="you@email.com"
          />
        </label>
      )}

      <button
        type="button"
        onClick={start}
        disabled={status === "loading" || (item.priceNgn > 0 && !isWebApp && !email.includes("@"))}
        className="mt-4 w-full rounded-full bg-[#ff8c14] py-3 text-[15px] font-semibold text-black transition hover:bg-[#ffa03a] disabled:opacity-50"
      >
        {status === "loading"
          ? "Please wait…"
          : isWebApp && item.priceNgn === 0
            ? "Open app"
            : item.priceNgn === 0
              ? "Download"
              : `Buy · ${formatNgn(item.priceNgn)}`}
      </button>

      {msg && (
        <p className={`mt-3 text-[13px] ${status === "err" ? "text-red-400" : "text-emerald-400"}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
