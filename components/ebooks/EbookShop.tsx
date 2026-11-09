"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { withGiftCode } from "@/lib/giftcards/client";
import type { Ebook, EbookChapter } from "@/lib/ebooks";
import type { PublicEbook } from "@/lib/shop/public";
import { formatEbookPrice } from "@/lib/shop/format";
import { usePurchaseUnlock } from "@/lib/shop/usePurchaseUnlock";
import { productWhatsAppLink } from "@/lib/products";

export function EbookCover({
  book,
  size = "md",
}: {
  book: Ebook;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "lg"
      ? { wrap: "h-[345px] w-[230px]", sizes: "230px" }
      : size === "sm"
        ? { wrap: "h-[174px] w-[116px]", sizes: "116px" }
        : { wrap: "h-[252px] w-[168px]", sizes: "168px" };

  return (
    <div className={`${dims.wrap} relative overflow-hidden rounded-[3px] shadow-[0_6px_18px_rgba(0,0,0,0.45)] ring-1 ring-white/10`}>
      <Image
        src={book.coverImage}
        alt={`${book.title} ebook cover`}
        fill
        className="object-cover"
        sizes={dims.sizes}
        priority={size === "lg"}
      />
    </div>
  );
}

export function EbookCard({ book }: { book: PublicEbook }) {
  return (
    <Link
      href={`/ebooks/${book.slug}`}
      className="group flex h-full flex-col glass rounded-[22px] p-5 transition hover:border-[#ff8c14]/50"
    >
      <div className="flex justify-center py-3">
        <div className="transition duration-300 group-hover:-translate-y-1">
          <EbookCover book={book} size="md" />
        </div>
      </div>
      <div className="mt-2 flex flex-1 flex-col">
        <p className="text-[11px] font-medium uppercase tracking-wide text-brand-subtle">
          {book.category}
        </p>
        <h3 className="mt-1 text-[17px] font-semibold text-white group-hover:text-[#ff8c14]">
          {book.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-brand-muted">{book.subtitle}</p>
        <div className="mt-4 flex flex-col gap-1 border-t border-white/10 pt-3">
          <span className="text-[16px] font-semibold text-white">
            {book.onSale ? formatEbookPrice(book.priceNgn) : "Coming soon"}
          </span>
          <span className="text-[11px] text-brand-subtle">{book.pagesLabel}</span>
        </div>
      </div>
    </Link>
  );
}

export function EbookBuyPanel({ book }: { book: PublicEbook }) {
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
        body: JSON.stringify(
          withGiftCode({
            productId: book.id,
            email: email.trim(),
            name: name.trim() || "Ebook buyer",
          })
        ),
      });
      const data = await res.json();
      if (res.status === 503 || data.code === "NO_KEYS" || !data.authorization_url) {
        window.location.href = productWhatsAppLink(book.title, "Ebook purchase");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.authorization_url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not start payment");
    } finally {
      setLoading(false);
    }
  }

  if (!book.onSale) {
    return (
      <div className="rounded-2xl border border-white/10 bg-brand-surface p-5">
        <p className="text-[18px] font-semibold text-white">Coming soon</p>
        <p className="mt-2 text-[14px] leading-relaxed text-brand-soft">We are finishing this book and it isn&apos;t on sale yet. Please check back shortly.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-brand-surface p-5">
      <p className="text-[28px] font-semibold text-white">{formatEbookPrice(book.priceNgn)}</p>
      <p className="mt-1 text-[12px] text-brand-muted">One-time · Instant access after payment</p>
      <label className="mt-4 block text-[12px] text-brand-muted">
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
      <label className="mt-3 block text-[12px] text-brand-muted">
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
      <p className="mt-3 text-[11px] leading-relaxed text-brand-subtle">
        After payment: full chapters unlock on this site and a PDF is emailed to you.
      </p>
    </div>
  );
}

function EbookReader({ chapters }: { chapters: EbookChapter[] }) {
  return (
    <article className="space-y-8">
      {chapters.map((ch) => (
        <section key={ch.title} className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <h3 className="text-[16px] font-semibold text-white">{ch.title}</h3>
          <div className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-brand-soft">
            {ch.body}
          </div>
        </section>
      ))}
    </article>
  );
}

/** `book` must be a publicEbook(): its chapters are the free preview only. */
export function EbookGatedReader({ book }: { book: PublicEbook }) {
  const unlock = usePurchaseUnlock<{ chapters: EbookChapter[] }>(book.id);

  if (unlock.status === "unlocked") {
    return (
      <div className="space-y-4">
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          Full ebook unlocked on this device.
        </p>
        <EbookReader chapters={unlock.content.chapters} />
      </div>
    );
  }

  if (!book.onSale) return null;

  const preview = book.chapters.slice(0, 1);
  const restCount = Math.max(0, book.totalChapters - preview.length);

  return (
    <div className="space-y-6">
      {preview.map((ch) => (
        <section key={ch.title} className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
            Free preview
          </p>
          <h3 className="mt-1 text-[16px] font-semibold text-white">{ch.title}</h3>
          <div className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-brand-soft">
            {ch.body}
          </div>
        </section>
      ))}
      <div className="rounded-2xl border border-white/10 bg-brand-surface p-6 text-center">
        <p className="text-[15px] font-semibold text-white">+ {restCount} more chapters locked</p>
        <p className="mt-2 text-[13px] text-brand-muted">Buy to unlock the full guide on this page.</p>
        <p className="mt-4 text-[20px] font-semibold text-[#ff8c14]">
          {formatEbookPrice(book.priceNgn)}
        </p>
      </div>
    </div>
  );
}
