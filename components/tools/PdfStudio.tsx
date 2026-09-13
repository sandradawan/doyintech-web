"use client";

import { useEffect, useMemo, useState } from "react";
import { getDigitalProduct } from "@/lib/products";

const UNLOCK_KEY = "doyintech_pdf_studio_unlocked";
const PRODUCT_ID = "pdf-studio-unlock";

type DocType = "letter" | "quote" | "report";

export default function PdfStudio() {
  const product = getDigitalProduct(PRODUCT_ID);
  const [unlocked, setUnlocked] = useState(false);
  const [docType, setDocType] = useState<DocType>("letter");
  const [title, setTitle] = useState("Business Letter");
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [body, setBody] = useState("");
  const [amount, setAmount] = useState("");
  const [payEmail, setPayEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    try {
      if (localStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
    } catch {
      /* ignore */
    }
    // Return from Paystack success with ?pdf_unlock=1&reference=
    const q = new URLSearchParams(window.location.search);
    if (q.get("pdf_unlock") === "1" && q.get("reference")) {
      fetch(`/api/paystack/verify?reference=${encodeURIComponent(q.get("reference")!)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.ok) {
            localStorage.setItem(UNLOCK_KEY, "1");
            setUnlocked(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  const previewLimited = !unlocked;

  const htmlDoc = useMemo(() => {
    const safeBody = (body || "Your content appears here.").replace(/\n/g, "<br/>");
    if (docType === "quote") {
      return `
        <div style="font-family: system-ui, sans-serif; color: #111; max-width: 720px; margin: 0 auto; padding: 40px;">
          <h1 style="font-size: 22px; margin: 0 0 8px;">QUOTE</h1>
          <p style="margin: 0; color: #555;">From: <strong>${fromName || "Your business"}</strong></p>
          <p style="margin: 0 0 16px; color: #555;">To: <strong>${toName || "Client"}</strong></p>
          <h2 style="font-size: 18px;">${title}</h2>
          <p>${safeBody}</p>
          <p style="font-size: 20px; font-weight: 700; margin-top: 24px;">Total: ₦${amount || "0"}</p>
          <p style="font-size: 12px; color: #777; margin-top: 32px;">Generated with DoyinTech PDF Studio</p>
        </div>`;
    }
    if (docType === "report") {
      return `
        <div style="font-family: system-ui, sans-serif; color: #111; max-width: 720px; margin: 0 auto; padding: 40px;">
          <p style="text-transform: uppercase; letter-spacing: 0.08em; color: #666; font-size: 12px;">Report</p>
          <h1 style="font-size: 28px; margin: 8px 0 16px;">${title}</h1>
          <p style="color: #555;">Prepared by ${fromName || "—"} · For ${toName || "—"}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
          <div style="line-height: 1.6;">${safeBody}</div>
          <p style="font-size: 12px; color: #777; margin-top: 40px;">DoyinTech PDF Studio</p>
        </div>`;
    }
    return `
      <div style="font-family: system-ui, sans-serif; color: #111; max-width: 720px; margin: 0 auto; padding: 40px;">
        <p style="font-weight: 700; margin: 0;">${fromName || "Your Business"}</p>
        <p style="color: #666; margin: 4px 0 24px; font-size: 13px;">Letter</p>
        <p>Dear ${toName || "Sir/Madam"},</p>
        <h2 style="font-size: 18px;">${title}</h2>
        <div style="line-height: 1.65;">${safeBody}</div>
        <p style="margin-top: 32px;">Sincerely,<br/><strong>${fromName || "Your name"}</strong></p>
      </div>`;
  }, [docType, title, fromName, toName, body, amount]);

  function exportPdf() {
    if (!unlocked) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
      <style>@media print { body { margin: 0; } }</style></head><body>${htmlDoc}
      <script>window.onload=function(){window.print();}</script></body></html>`);
    w.document.close();
  }

  async function startPay(e: React.FormEvent) {
    e.preventDefault();
    setPaying(true);
    setPayError("");
    try {
      const origin = window.location.origin;
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: PRODUCT_ID,
          email: payEmail,
          name: fromName || "PDF Studio user",
        }),
      });
      const data = await res.json();
      if (res.status === 503 || data.code === "NO_KEYS") {
        window.location.href = `https://wa.me/2348085343926?text=${encodeURIComponent(
          "Hi, I want to unlock PDF Studio (₦5,000). Please send payment details."
        )}`;
        return;
      }
      if (!res.ok || !data.authorization_url) {
        throw new Error(data.error || "Could not start payment");
      }
      // Override callback for tool unlock — Paystack still uses product callback;
      // success page + local verify handles unlock when product is pdf-studio-unlock
      window.location.href = data.authorization_url;
    } catch (err: any) {
      setPayError(err.message || "Payment failed");
      setPaying(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
        <strong className="text-amber-200">Paid tool · ₦5,000 one-time</strong>
        <p className="mt-1 text-amber-100/80">
          Preview is free. Unlock full PDF export with Paystack
          {product ? ` (${product.priceNgn})` : ""}. Not a free utility.
        </p>
      </div>

      {!unlocked && (
        <form
          onSubmit={startPay}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3"
        >
          <p className="text-sm font-semibold text-white">Unlock PDF Studio</p>
          <input
            required
            type="email"
            value={payEmail}
            onChange={(e) => setPayEmail(e.target.value)}
            placeholder="Email for receipt"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none"
          />
          {payError && <p className="text-xs text-red-400">{payError}</p>}
          <button
            type="submit"
            disabled={paying}
            className="w-full rounded-full bg-[#00C3F7] py-3 text-sm font-semibold text-black disabled:opacity-60"
          >
            {paying ? "Redirecting…" : "Pay ₦5,000 with Paystack"}
          </button>
        </form>
      )}

      {unlocked && (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          Unlocked — you can export unlimited PDFs on this device.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {(["letter", "quote", "report"] as DocType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setDocType(t)}
            className={`rounded-xl border px-4 py-3 text-sm capitalize ${
              docType === t
                ? "border-primary bg-primary/20 text-white"
                : "border-white/10 text-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white"
        />
        <input
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
          placeholder="From / your name"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white"
        />
        <input
          value={toName}
          onChange={(e) => setToName(e.target.value)}
          placeholder="To / client"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white"
        />
        {docType === "quote" && (
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (NGN)"
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white"
          />
        )}
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        placeholder="Body content…"
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white"
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white">
        {previewLimited && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex h-24 items-end justify-center bg-gradient-to-t from-black/80 to-transparent pb-3">
            <span className="text-xs text-white/90">Preview limited — unlock to export PDF</span>
          </div>
        )}
        <div
          className={`p-2 ${previewLimited ? "max-h-48 overflow-hidden opacity-80" : ""}`}
          dangerouslySetInnerHTML={{ __html: htmlDoc }}
        />
      </div>

      <button
        type="button"
        disabled={!unlocked}
        onClick={exportPdf}
        className="w-full rounded-full bg-white py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        {unlocked ? "Export / Print PDF" : "Unlock to export PDF"}
      </button>
    </div>
  );
}
