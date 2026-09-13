"use client";

import { useEffect, useState } from "react";
import type { DigitalProduct } from "@/lib/products";
import { productWhatsAppLink } from "@/lib/products";

export default function PaystackBuyButton({
  product,
  className = "",
}: {
  product: DigitalProduct;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          email: email.trim(),
          name: "",
        }),
      });
      const data = await res.json();

      if (res.status === 503 || data.code === "NO_KEYS") {
        window.location.href = productWhatsAppLink(product.name, "digital product");
        return;
      }

      if (!res.ok || !data.authorization_url) {
        throw new Error(data.error || "Could not start payment");
      }

      window.location.href = data.authorization_url;
    } catch (err: any) {
      setError(err.message || "Payment failed to start");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          "mt-auto inline-flex w-full items-center justify-center rounded-full bg-[#0071e3] py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#0077ed]"
        }
      >
        Pay with Paystack
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            aria-label="Close checkout"
            onClick={() => !loading && setOpen(false)}
          />

          <div className="relative z-10 flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-[24px] border border-white/10 bg-[#1d1d1f] shadow-2xl sm:rounded-[24px]">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a1a1a6]">
                  Secure checkout
                </p>
                <h3
                  id="checkout-title"
                  className="mt-1 truncate text-[17px] font-semibold text-[#f5f5f7]"
                >
                  {product.name}
                </h3>
                <p className="mt-1 text-[22px] font-semibold tracking-tight text-white">
                  {product.priceNgn}
                </p>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#f5f5f7] hover:bg-white/15 disabled:opacity-40"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={pay} className="flex flex-col gap-4 overflow-y-auto px-5 py-5">
              <p className="text-[13px] leading-relaxed text-[#a1a1a6]">
                Enter the email for your receipt and product delivery. You’ll be redirected to
                Paystack.
              </p>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-medium text-[#a1a1a6]">
                  Email
                </span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-[15px] text-white outline-none ring-[#0071e3] placeholder:text-white/30 focus:border-[#0071e3] focus:ring-1"
                />
              </label>

              {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#00C3F7] py-3.5 text-[15px] font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Redirecting to Paystack…" : `Pay ${product.priceNgn}`}
              </button>

              <a
                href={productWhatsAppLink(product.name, "digital product")}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-[13px] text-[#2997ff] hover:underline"
              >
                Prefer WhatsApp payment?
              </a>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
