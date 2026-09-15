"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { StoreListing } from "@/lib/store/types";
import { formatNgn } from "@/lib/store/catalog";
import { productWhatsAppLink } from "@/lib/products";
import { StoreAppIcon } from "@/components/ui/BrandIcons";

export function StoreNav() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Link href="/store" className="rounded-full bg-white/10 px-3 py-1.5 text-white">
        Browse
      </Link>
      <Link
        href="/store/developer"
        className="rounded-full border border-white/15 px-3 py-1.5 text-[#a1a1a6] hover:text-white"
      >
        Publish app
      </Link>
      <Link
        href="/store/security"
        className="rounded-full border border-white/15 px-3 py-1.5 text-[#a1a1a6] hover:text-white"
      >
        Security
      </Link>
      <Link
        href="/store/admin"
        className="rounded-full border border-white/15 px-3 py-1.5 text-[#a1a1a6] hover:text-white"
      >
        Admin
      </Link>
    </div>
  );
}

export function ListingCard({ item }: { item: StoreListing }) {
  return (
    <Link
      href={`/store/${item.slug}`}
      className="group flex h-full flex-col rounded-[20px] border border-white/10 bg-gradient-to-b from-[#1c2333] to-[#0f141f] p-5 transition hover:border-[#ff8c14]/40"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#ff8c14]/15 to-white/5 shadow-inner">
          <StoreAppIcon slug={item.slug} category={item.category} size={28} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-semibold text-white group-hover:text-[#ff8c14]">
            {item.title}
          </h3>
          <p className="text-[12px] text-[#a1a1a6]">{item.developerName}</p>
          <p className="mt-1 text-[12px] capitalize text-[#86868b]">
            {item.platform} · {item.kind === "app" ? "App" : "Digital"}
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 flex-1 text-[13px] leading-relaxed text-[#a1a1a6]">
        {item.shortDescription}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[15px] font-semibold text-white">{formatNgn(item.priceNgn)}</span>
        <span className="text-[12px] text-[#86868b]">
          ★ {item.ratingAvg.toFixed(1)}
          {item.launchUrl ? " · Open" : ` · ${item.downloads} dl`}
        </span>
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

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const okCat =
        cat === "All" ||
        l.category === cat ||
        (cat === "Digital Products" && l.kind === "digital_product");
      const okQ =
        !q ||
        l.title.toLowerCase().includes(q.toLowerCase()) ||
        l.shortDescription.toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [listings, q, cat]);

  return (
    <div>
      <div className="mx-auto max-w-xl">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search apps & digital products"
          className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3.5 text-[15px] text-white outline-none ring-[#ff8c14] placeholder:text-white/30 focus:ring-1"
        />
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${
              cat === c
                ? "bg-[#ff8c14] text-black"
                : "border border-white/15 text-[#a1a1a6] hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <ListingCard key={item.id} item={item} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-12 text-center text-[#a1a1a6]">No listings match your search.</p>
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
    } catch (e: any) {
      setStatus("err");
      setMsg(e.message || "Something went wrong");
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
      <p className="text-[28px] font-semibold text-white">{formatNgn(item.priceNgn)}</p>
      <p className="mt-1 text-[12px] text-[#a1a1a6]">
        {item.reviewStatus === "approved" ? "Security reviewed · " : ""}
        {item.virusScanStatus === "clean" ? "Scan clean" : "Scan pending"}
        {isWebApp ? " · Web app" : ""}
      </p>

      {!isWebApp && (
        <label className="mt-4 block">
          <span className="text-[12px] text-[#a1a1a6]">
            {item.priceNgn > 0 ? "Email for receipt" : "Email (optional)"}
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
            placeholder="you@email.com"
          />
        </label>
      )}

      <button
        type="button"
        onClick={start}
        disabled={status === "loading" || (item.priceNgn > 0 && !isWebApp && !email.includes("@"))}
        className="mt-4 w-full rounded-full bg-[#ff8c14] py-3.5 text-[15px] font-semibold text-black disabled:opacity-50"
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

      <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-[12px] leading-relaxed text-amber-100/90">
        {isWebApp ? (
          <>
            <strong className="text-amber-200">Web app:</strong> Runs in your browser. No APK
            install. Data stays on this device when the app uses local storage.
          </>
        ) : (
          <>
            <strong className="text-amber-200">Install note:</strong> After payment/claim, the file{" "}
            <strong>downloads automatically</strong>. Installing still needs your confirmation (OS
            security).
          </>
        )}
      </div>
    </div>
  );
}
