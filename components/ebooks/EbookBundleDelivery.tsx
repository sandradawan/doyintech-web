"use client";

import { useState } from "react";

type Book = { id: string; title: string; slug: string };

function download(filename: string, base64: string) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** After buying a bundle: every book with a Read online link and a PDF download. */
export default function EbookBundleDelivery({ reference, title, books }: { reference: string; title: string; books: Book[] }) {
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  async function pdf(book: Book) {
    setBusy(book.id);
    setErr("");
    try {
      const res = await fetch("/api/ebooks/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, productId: book.id, mode: "pdf" }),
      });
      const data = (await res.json()) as { filename?: string; contentBase64?: string; error?: string };
      if (!res.ok || !data.contentBase64) throw new Error(data.error || "Could not prepare the PDF.");
      download(data.filename || `${book.slug}.pdf`, data.contentBase64);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not prepare the PDF.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="mt-8">
      <p className="text-[17px] font-semibold text-brand-ink">{title}: {books.length} ebooks unlocked</p>
      <p className="mt-1 text-[14px] text-brand-muted">
        Read online on this device, or download each PDF. Keep your payment reference to unlock them on another device: {reference}
      </p>
      {err && <p role="alert" className="mt-3 text-[14px] text-red-300">{err}</p>}
      <ul className="mt-5 divide-y divide-brand-ink/10 rounded-2xl border border-brand-ink/10 bg-brand-surface">
        {books.map((b) => (
          <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0 flex-1 text-[15px] text-brand-ink">{b.title}</span>
            <span className="flex shrink-0 gap-2">
              <a href={`/ebooks/${b.slug}?reference=${encodeURIComponent(reference)}`} className="inline-flex min-h-10 items-center rounded-full border border-brand-ink/20 px-4 text-[13px] font-semibold text-brand-ink">
                Read
              </a>
              <button type="button" onClick={() => pdf(b)} disabled={busy === b.id} className="min-h-10 rounded-full bg-brand-accent px-4 text-[13px] font-semibold text-black disabled:opacity-60">
                {busy === b.id ? "Preparing…" : "PDF"}
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
