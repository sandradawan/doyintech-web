"use client";

import { useEffect, useState } from "react";
import {
  getPaidTool,
  isUnlocked,
  setUnlocked,
  type PaidToolDef,
} from "@/lib/tools/paid";

export function usePaidUnlock(toolSlug: string) {
  const def = getPaidTool(toolSlug);
  const [unlocked, setUn] = useState(false);

  useEffect(() => {
    if (!def) return;
    setUn(isUnlocked(def.unlockKey));
  }, [def]);

  return {
    def,
    unlocked,
    unlockLocal: () => {
      if (!def) return;
      setUnlocked(def.unlockKey);
      setUn(true);
    },
  };
}

export default function PaidGate({
  toolSlug,
  children,
  preview,
}: {
  toolSlug: string;
  children: React.ReactNode;
  preview?: React.ReactNode;
}) {
  const { def, unlocked, unlockLocal } = usePaidUnlock(toolSlug);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!def) return;
    const q = new URLSearchParams(window.location.search);
    const ref = q.get("reference") || q.get("trxref");
    if (ref && q.get("paid") === "1") {
      fetch(`/api/paystack/verify?reference=${encodeURIComponent(ref)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.ok) unlockLocal();
        })
        .catch(() => {});
    }
  }, [def, unlockLocal]);

  if (!def) return <p className="text-red-400">Tool not configured.</p>;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: def!.productId,
          email,
          name: "Tool user",
        }),
      });
      const data = await res.json();
      if (res.status === 503 || data.code === "NO_KEYS") {
        window.location.href = `https://wa.me/2348085343926?text=${encodeURIComponent(
          `Hi, I want to unlock ${def!.title} (${def!.priceNgn}).`
        )}`;
        return;
      }
      if (!res.ok || !data.authorization_url) {
        throw new Error(data.error || "Payment failed");
      }
      window.location.href = data.authorization_url;
    } catch (err: any) {
      setError(err.message || "Error");
      setLoading(false);
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="space-y-6">
      {preview}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
        <p className="text-sm font-semibold text-amber-200">
          Paid tool · {def.priceNgn} one-time
        </p>
        <p className="mt-1 text-sm text-amber-100/80">
          Preview only. Pay to unlock full output / export on this device.
        </p>
        <form onSubmit={pay} className="mt-4 space-y-3">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email for receipt"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#00C3F7] py-3 text-sm font-semibold text-black disabled:opacity-60"
          >
            {loading ? "Redirecting…" : `Unlock for ${def.priceNgn}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export function printHtml(title: string, html: string) {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(
    `<!DOCTYPE html><html><head><title>${title}</title>
    <style>@media print{body{margin:0}} body{font-family:system-ui,sans-serif;color:#111}</style>
    </head><body>${html}<script>window.onload=function(){window.print()}</script></body></html>`
  );
  w.document.close();
}

export type { PaidToolDef };
