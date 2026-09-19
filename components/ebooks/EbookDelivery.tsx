"use client";

import { useState } from "react";

type Props = {
  productId: string;
  reference: string;
  defaultEmail?: string;
  bookTitle: string;
  bookSlug: string;
};

function triggerBinaryDownload(filename: string, mime: string, base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function EbookDelivery({
  productId,
  reference,
  defaultEmail,
  bookTitle,
  bookSlug,
}: Props) {
  const [email, setEmail] = useState(defaultEmail || "");
  const [loading, setLoading] = useState<"pdf" | "email" | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function callDeliver(mode: "pdf" | "email") {
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

  async function deliver(mode: "pdf" | "email") {
    setLoading(mode);
    setErr("");
    setMsg("");
    try {
      const { res, data } = await callDeliver(mode);

      if (mode === "email") {
        if (data.contentBase64 && (data.code === "NO_EMAIL_PROVIDER" || data.downloadAvailable)) {
          triggerBinaryDownload(
            data.filename || `${bookSlug}-doyintech.pdf`,
            "application/pdf",
            data.contentBase64
          );
          setMsg(
            "Email not configured on server — your professional PDF downloaded instead."
          );
        } else if (!res.ok || !data.ok) {
          if (data.contentBase64) {
            triggerBinaryDownload(
              data.filename || `${bookSlug}-doyintech.pdf`,
              "application/pdf",
              data.contentBase64
            );
            setMsg("Email failed — PDF downloaded so you still have your files.");
          } else {
            throw new Error(data.error || "Email failed");
          }
        } else {
          setMsg(`Professional PDF sent to ${data.email || email}. Check inbox and spam.`);
        }
        return;
      }

      if (!res.ok || !data.ok || !data.contentBase64) {
        throw new Error(data.error || "PDF generation failed");
      }
      triggerBinaryDownload(
        data.filename || `${bookSlug}-doyintech.pdf`,
        "application/pdf",
        data.contentBase64
      );
      setMsg(`Downloaded: ${bookTitle} (professional PDF).`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Delivery failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
      <p className="text-[15px] font-semibold text-white">Your ebook is ready</p>
      <p className="mt-1 text-[13px] text-[#94a3b8]">
        Professionally formatted PDF — cover, contents, and full chapters. Also unlocked on this site.
      </p>

      <label className="mt-4 block text-[12px] text-[#94a3b8]">
        Email for delivery
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="mt-1 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
        />
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => deliver("pdf")}
          className="rounded-full bg-[#ff8c14] px-5 py-3 text-sm font-semibold text-black hover:bg-[#ffa03a] disabled:opacity-50"
        >
          {loading === "pdf" ? "Building PDF…" : "Download PDF"}
        </button>
        <button
          type="button"
          disabled={loading !== null || !email.includes("@")}
          onClick={() => deliver("email")}
          className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50"
        >
          {loading === "email" ? "Sending…" : "Email me the PDF"}
        </button>
      </div>

      {msg && <p className="mt-3 text-[13px] text-emerald-400">{msg}</p>}
      {err && <p className="mt-3 text-[13px] text-red-400">{err}</p>}

      <p className="mt-4 text-[12px] text-[#64748b]">
        Online reader:{" "}
        <a
          href={`/ebooks/${bookSlug}?paid=1&reference=${encodeURIComponent(reference)}`}
          className="text-[#ff8c14] hover:underline"
        >
          Open chapters on site
        </a>
      </p>
    </div>
  );
}
