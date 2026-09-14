"use client";

import { useState } from "react";

type Props = {
  productId: string;
  reference: string;
  defaultEmail?: string;
  bookTitle: string;
  bookSlug: string;
};

function triggerDownload(filename: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function openPrintablePdf(html: string) {
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();
  // Give images a moment to load, then print → user chooses Save as PDF
  setTimeout(() => {
    try {
      w.focus();
      w.print();
    } catch {
      /* ignore */
    }
  }, 800);
  return true;
}

export default function EbookDelivery({
  productId,
  reference,
  defaultEmail,
  bookTitle,
  bookSlug,
}: Props) {
  const [email, setEmail] = useState(defaultEmail || "");
  const [loading, setLoading] = useState<"download" | "pdf" | "email" | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function fetchDelivery(mode: "download" | "email") {
    const res = await fetch("/api/ebooks/deliver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        productId,
        mode,
        email: email.trim(),
      }),
    });
    const data = await res.json();
    return { res, data };
  }

  async function deliver(mode: "download" | "pdf" | "email") {
    setLoading(mode);
    setErr("");
    setMsg("");
    try {
      if (mode === "email") {
        const { res, data } = await fetchDelivery("email");
        if (data.code === "NO_EMAIL_PROVIDER" || data.downloadAvailable) {
          if (data.content) {
            triggerDownload(
              data.filename || `${bookSlug}-doyintech.html`,
              data.contentType || "text/html;charset=utf-8",
              data.content
            );
            setMsg("Email not configured — illustrated HTML download started. Open it → Print → Save as PDF.");
          } else {
            setErr(data.message || "Email not available. Use Download instead.");
          }
        } else if (!res.ok || !data.ok) {
          throw new Error(data.error || "Email failed");
        } else {
          setMsg(`Ebook sent to ${data.email || email}. Check inbox and spam.`);
        }
      } else {
        const { res, data } = await fetchDelivery("download");
        if (!res.ok || !data.ok || !data.content) {
          throw new Error(data.error || "Download failed");
        }

        if (mode === "pdf") {
          const opened = openPrintablePdf(data.content);
          if (opened) {
            setMsg(
              "Print dialog opened. Choose Save as PDF / Microsoft Print to PDF. Images are included."
            );
          } else {
            triggerDownload(
              data.filename || `${bookSlug}-doyintech.html`,
              data.contentType || "text/html;charset=utf-8",
              data.content
            );
            setMsg("Pop-up blocked — HTML file downloaded. Open it → Print → Save as PDF.");
          }
        } else {
          triggerDownload(
            data.filename || `${bookSlug}-doyintech.html`,
            data.contentType || "text/html;charset=utf-8",
            data.content
          );
          setMsg("Illustrated HTML downloaded. Open the file → Print → Save as PDF for a PDF copy.");
        }
      }

      try {
        localStorage.setItem(`ebook_unlocked_${bookSlug}`, "1");
        sessionStorage.setItem(`ebook_unlocked_${bookSlug}`, "1");
      } catch {
        /* ignore */
      }
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-[#141a28] p-5 text-left">
      <h2 className="text-[16px] font-semibold text-white">Get your illustrated ebook</h2>
      <p className="mt-1 text-[13px] text-[#a1a1a6]">
        <span className="text-white">{bookTitle}</span> includes cover + chapter images. Choose download,
        PDF, or email.
      </p>

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          disabled={!!loading}
          onClick={() => deliver("pdf")}
          className="rounded-xl border border-[#ff8c14]/40 bg-[#ff8c14]/10 px-4 py-4 text-left transition hover:border-[#ff8c14] disabled:opacity-50"
        >
          <p className="text-[15px] font-semibold text-white">
            {loading === "pdf" ? "Preparing PDF…" : "📄 Save as PDF (with images)"}
          </p>
          <p className="mt-1 text-[12px] text-[#86868b]">
            Opens print view — choose Save as PDF. Best quality with photos.
          </p>
        </button>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={!!loading}
            onClick={() => deliver("download")}
            className="rounded-xl border border-white/15 bg-black/40 px-4 py-4 text-left transition hover:border-[#ff8c14]/50 disabled:opacity-50"
          >
            <p className="text-[15px] font-semibold text-white">
              {loading === "download" ? "Preparing…" : "⬇ Download HTML"}
            </p>
            <p className="mt-1 text-[12px] text-[#86868b]">Illustrated file · offline · then Save as PDF</p>
          </button>

          <div className="rounded-xl border border-white/15 bg-black/40 px-4 py-4">
            <p className="text-[15px] font-semibold text-white">✉ Email me a copy</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#ff8c14]"
            />
            <button
              type="button"
              disabled={!!loading || !email.includes("@")}
              onClick={() => deliver("email")}
              className="mt-2 w-full rounded-full bg-[#ff8c14] py-2 text-[13px] font-semibold text-black disabled:opacity-50"
            >
              {loading === "email" ? "Sending…" : "Send to email"}
            </button>
          </div>
        </div>
      </div>

      {msg && (
        <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[13px] text-emerald-300">
          {msg}
        </p>
      )}
      {err && (
        <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[13px] text-amber-200">
          {err}
        </p>
      )}

      <a
        href={`/ebooks/${bookSlug}?paid=1&reference=${encodeURIComponent(reference)}`}
        className="mt-4 inline-flex text-[14px] font-semibold text-[#ff8c14] hover:underline"
      >
        Or read full ebook online →
      </a>
    </div>
  );
}
