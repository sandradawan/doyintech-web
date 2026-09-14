"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Ebook } from "@/lib/ebooks";
import { formatEbookPrice } from "@/lib/ebooks";
import { productWhatsAppLink } from "@/lib/products";

export function EbookCover({
  book,
  size = "md",
}: {
  book: Ebook;
  size?: "sm" | "md" | "lg";
}) {
  const h =
    size === "lg" ? "h-[320px] w-[220px]" : size === "sm" ? "h-[160px] w-[110px]" : "h-[220px] w-[150px]";
  return (
    <div
      className={`${h} relative overflow-hidden rounded-r-md rounded-l-sm shadow-2xl ring-1 ring-white/10`}
      style={{
        background: `linear-gradient(155deg, ${book.coverFrom} 0%, ${book.coverTo} 100%)`,
      }}
    >
      <div className="absolute inset-y-0 left-0 w-1.5 bg-black/30" />
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
            DoyinTech Press
          </p>
          <p className="mt-3 text-3xl">{book.icon}</p>
        </div>
        <div>
          <h3
            className={`font-semibold leading-tight text-white ${size === "lg" ? "text-lg" : "text-sm"}`}
          >
            {book.title}
          </h3>
          <p className="mt-2 text-[10px] leading-snug text-white/70 line-clamp-3">{book.subtitle}</p>
          <div
            className="mt-3 h-0.5 w-10 rounded-full"
            style={{ backgroundColor: book.accent }}
          />
          <p className="mt-2 text-[10px] text-white/50">{book.author}</p>
        </div>
      </div>
    </div>
  );
}

export function EbookCard({ book }: { book: Ebook }) {
  return (
    <Link
      href={`/ebooks/${book.slug}`}
      className="group flex h-full flex-col rounded-[22px] border border-white/10 bg-gradient-to-b from-[#1a2030] to-[#0c1018] p-5 transition hover:border-[#ff8c14]/40"
    >
      <div className="flex justify-center py-2">
        <div className="transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
          <EbookCover book={book} size="md" />
        </div>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        {book.badge && (
          <span className="mb-2 w-fit rounded-full bg-[#ff8c14]/15 px-2 py-0.5 text-[10px] font-semibold text-[#ff8c14]">
            {book.badge}
          </span>
        )}
        <h3 className="text-[17px] font-semibold text-white group-hover:text-[#ff8c14]">
          {book.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-[#a1a1a6]">{book.subtitle}</p>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-[16px] font-semibold text-white">
            {formatEbookPrice(book.priceNgn)}
          </span>
          <span className="text-[11px] text-[#86868b]">{book.pagesLabel}</span>
        </div>
      </div>
    </Link>
  );
}

export function EbookBuyPanel({ book }: { book: Ebook }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function buy() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: book.id,
          email: email.trim(),
          name: name.trim() || "Ebook buyer",
        }),
      });
      const data = await res.json();
      if (res.status === 503 || data.code === "NO_KEYS" || !data.authorization_url) {
        window.location.href = productWhatsAppLink(book.title, "Ebook purchase");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.authorization_url;
    } catch (e: any) {
      setErr(e.message || "Could not start payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
      <p className="text-[28px] font-semibold text-white">{formatEbookPrice(book.priceNgn)}</p>
      <p className="mt-1 text-[12px] text-[#a1a1a6]">One-time · Instant access after payment</p>
      <label className="mt-4 block text-[12px] text-[#a1a1a6]">
        Email for delivery
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
          placeholder="you@email.com"
        />
      </label>
      <label className="mt-3 block text-[12px] text-[#a1a1a6]">
        Name (optional)
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
        />
      </label>
      <button
        type="button"
        disabled={loading || !email.includes("@")}
        onClick={buy}
        className="mt-4 w-full rounded-full bg-[#ff8c14] py-3.5 text-[15px] font-semibold text-black disabled:opacity-50"
      >
        {loading ? "Redirecting…" : `Buy ebook · ${formatEbookPrice(book.priceNgn)}`}
      </button>
      {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
      <p className="mt-3 text-[11px] leading-relaxed text-[#86868b]">
        After payment you get full chapter access on this page. Request PDF via WhatsApp if needed.
      </p>
    </div>
  );
}

export function EbookReader({ book }: { book: Ebook }) {
  return (
    <article className="space-y-8">
      {book.chapters.map((ch) => (
        <section key={ch.title} className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <h3 className="text-[16px] font-semibold text-white">{ch.title}</h3>
          <div className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-[#c7cdd8]">
            {ch.body}
          </div>
        </section>
      ))}
    </article>
  );
}

export function EbookGatedReader({ book }: { book: Ebook }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const key = `ebook_unlocked_${book.slug}`;
      if (sessionStorage.getItem(key) === "1") setUnlocked(true);
      const params = new URLSearchParams(window.location.search);
      if (params.get("paid") === "1" || params.get("reference")) {
        sessionStorage.setItem(key, "1");
        setUnlocked(true);
      }
    } catch {
      /* ignore */
    }
  }, [book.slug]);

  if (unlocked) {
    return (
      <div className="space-y-4">
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          Full ebook unlocked on this device.
        </p>
        <EbookReader book={book} />
      </div>
    );
  }

  const preview = book.chapters.slice(0, 1);
  const restCount = book.chapters.length - 1;

  return (
    <div className="space-y-6">
      {preview.map((ch) => (
        <section key={ch.title} className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
            Free preview
          </p>
          <h3 className="mt-1 text-[16px] font-semibold text-white">{ch.title}</h3>
          <div className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-[#c7cdd8]">
            {ch.body}
          </div>
        </section>
      ))}
      <div className="rounded-2xl border border-white/10 bg-[#141a28] p-6 text-center">
        <p className="text-[15px] font-semibold text-white">+ {restCount} more chapters locked</p>
        <p className="mt-2 text-[13px] text-[#a1a1a6]">Buy to unlock the full guide on this page.</p>
        <p className="mt-4 text-[20px] font-semibold text-[#ff8c14]">
          {formatEbookPrice(book.priceNgn)}
        </p>
      </div>
    </div>
  );
}
