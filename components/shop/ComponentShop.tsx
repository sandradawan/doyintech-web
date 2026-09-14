"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { UiComponentPack } from "@/lib/ui-components";
import { formatCompPrice } from "@/lib/ui-components";
import { productWhatsAppLink } from "@/lib/products";
import { ComponentLivePreview } from "@/components/shop/LivePreviews";

function buildAiPrompt(item: UiComponentPack): string {
  return `Install the DoyinTech "${item.name}" component in this Next.js + Tailwind project.

Product page: https://doyintech.vercel.app/components/${item.slug}
Registry: https://doyintech.vercel.app/api/registry?slug=${item.slug}

Requirements:
- App Router compatible
- Tailwind CSS only (no extra UI kit required)
- Match existing project colours if present; else dark bg #0a0e17 and accent #ff8c14
- Prefer WhatsApp CTAs for African SME sites when relevant

Preview pattern:
${item.previewCode}

After the user purchases, full source is on the product page. Until then, implement from this preview and the description: ${item.description}`;
}

export function ComponentCard({ item }: { item: UiComponentPack }) {
  return (
    <Link
      href={`/components/${item.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a2030] to-[#0c1018] p-4 transition hover:border-[#ff8c14]/40"
    >
      <ComponentLivePreview slug={item.slug} />
      <div className="mt-3 flex items-start justify-between gap-2">
        <p className="text-[11px] uppercase tracking-wide text-[#86868b]">{item.category}</p>
        {item.badge && (
          <span className="rounded-full bg-[#ff8c14]/15 px-2 py-0.5 text-[10px] font-semibold text-[#ff8c14]">
            {item.badge}
          </span>
        )}
      </div>
      <h3 className="mt-1 text-[17px] font-semibold text-white group-hover:text-[#ff8c14]">
        {item.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-[13px] text-[#a1a1a6]">{item.tagline}</p>
      <div className="mt-auto mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[16px] font-semibold text-white">{formatCompPrice(item.priceNgn)}</span>
        <span className="text-[12px] text-[#ff8c14]">Watch + buy →</span>
      </div>
    </Link>
  );
}

export function ComponentBuyPanel({ item }: { item: UiComponentPack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [promptCopied, setPromptCopied] = useState(false);

  async function buy() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.id,
          email: email.trim(),
          name: "Component buyer",
        }),
      });
      const data = await res.json();
      if (res.status === 503 || data.code === "NO_KEYS" || !data.authorization_url) {
        window.location.href = productWhatsAppLink(item.name, "Next.js component");
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

  function copyPrompt() {
    navigator.clipboard.writeText(buildAiPrompt(item)).then(
      () => {
        setPromptCopied(true);
        setTimeout(() => setPromptCopied(false), 2000);
      },
      () => alert("Copy failed")
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
      <p className="text-[28px] font-semibold text-white">{formatCompPrice(item.priceNgn)}</p>
      <p className="mt-1 text-[12px] text-[#a1a1a6]">One-time · Source unlock after payment</p>
      <button
        type="button"
        onClick={copyPrompt}
        className="mt-3 w-full rounded-full border border-white/20 py-2.5 text-[13px] font-semibold text-white hover:border-[#ff8c14]/50"
      >
        {promptCopied ? "AI prompt copied" : "Copy AI prompt (Cursor / Claude)"}
      </button>
      <label className="mt-4 block text-[12px] text-[#a1a1a6]">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
          placeholder="you@email.com"
        />
      </label>
      <button
        type="button"
        disabled={loading || !email.includes("@")}
        onClick={buy}
        className="mt-4 w-full rounded-full bg-[#ff8c14] py-3.5 text-[15px] font-semibold text-black disabled:opacity-50"
      >
        {loading ? "Redirecting…" : `Buy component · ${formatCompPrice(item.priceNgn)}`}
      </button>
      {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
    </div>
  );
}

export function ComponentCodeGate({ item }: { item: UiComponentPack }) {
  const [unlocked, setUnlocked] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  useEffect(() => {
    try {
      const key = `comp_unlocked_${item.slug}`;
      if (localStorage.getItem(key) === "1" || sessionStorage.getItem(key) === "1") {
        setUnlocked(true);
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get("paid") === "1" || params.get("reference")) {
        localStorage.setItem(key, "1");
        sessionStorage.setItem(key, "1");
        setUnlocked(true);
      }
    } catch {
      /* ignore */
    }
  }, [item.slug]);

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(
      () => alert("Copied"),
      () => alert("Copy failed")
    );
  }

  function copyPrompt() {
    navigator.clipboard.writeText(buildAiPrompt(item)).then(
      () => {
        setPromptCopied(true);
        setTimeout(() => setPromptCopied(false), 2000);
      },
      () => alert("Copy failed")
    );
  }

  function download() {
    const blob = new Blob([item.fullCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.slug + ".tsx";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!unlocked) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyPrompt}
            className="rounded-full border border-[#ff8c14]/40 bg-[#ff8c14]/10 px-4 py-2 text-xs font-semibold text-[#ff8c14]"
          >
            {promptCopied ? "Copied" : "Copy AI prompt"}
          </button>
        </div>
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#86868b]">Preview code</p>
        <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-[12px] leading-relaxed text-[#a1a1a6]">
          {item.previewCode}
        </pre>
        <p className="text-[13px] text-[#86868b]">Full source unlocks after payment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
        Full source unlocked on this device.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copy(item.fullCode)}
          className="rounded-full border border-white/20 px-4 py-2 text-xs text-white"
        >
          Copy code
        </button>
        <button
          type="button"
          onClick={download}
          className="rounded-full bg-[#ff8c14] px-4 py-2 text-xs font-semibold text-black"
        >
          Download .tsx
        </button>
        <button
          type="button"
          onClick={copyPrompt}
          className="rounded-full border border-white/20 px-4 py-2 text-xs text-white"
        >
          {promptCopied ? "Prompt copied" : "Copy AI prompt"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-[12px] leading-relaxed text-[#c7cdd8]">
        {item.fullCode}
      </pre>
    </div>
  );
}
