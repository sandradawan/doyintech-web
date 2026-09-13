"use client";

import { useState } from "react";
import type { DigitalProduct } from "@/lib/products";
import { productWhatsAppLink } from "@/lib/products";

export default function PaystackBuyButton({ product }: { product: DigitalProduct }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          email,
          name,
        }),
      });
      const data = await res.json();

      if (res.status === 503 || data.code === "NO_KEYS") {
        // Paystack keys not set — fall back to WhatsApp
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
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#0071e3] py-3 text-[14px] font-medium text-white hover:bg-[#0077ed]"
      >
        Pay with Paystack
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1d1d1f] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-semibold text-[#f5f5f7]">Checkout</h3>
                <p className="mt-1 text-[14px] text-[#a1a1a6]">{product.name}</p>
                <p className="mt-2 text-[22px] font-semibold text-[#f5f5f7]">
                  {product.priceNgn}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !loading && setOpen(false)}
                className="text-[#a1a1a6] hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={pay} className="mt-5 space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#2997ff]/50"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email for receipt & delivery"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#2997ff]/50"
              />
              {error && <p className="text-[13px] text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#00C3F7] py-3 text-[14px] font-semibold text-black disabled:opacity-60"
              >
                {loading ? "Redirecting to Paystack…" : `Pay ${product.priceNgn}`}
              </button>
              <a
                href={productWhatsAppLink(product.name, "digital product")}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-[13px] text-[#2997ff] hover:underline"
              >
                Prefer WhatsApp payment? ›
              </a>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
