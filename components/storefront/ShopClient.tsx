"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { formatKobo, whatsappOrderLink } from "@/lib/storefront/shared";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_kobo: number;
  image_url: string | null;
  in_stock: boolean;
};

const field =
  "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[15px] text-white outline-none focus:border-[#ff8c14]";

/** Product grid, cart, and checkout (WhatsApp order, or Paystack when the shop takes payments). */
export default function ShopClient({
  slug,
  storeName,
  whatsapp,
  canPay,
  products,
}: {
  slug: string;
  storeName: string;
  whatsapp: string;
  canPay: boolean;
  products: Product[];
}) {
  const cartKey = `dt_shop_cart_${slug}`;
  const [cart, setCart] = useState<Record<string, number>>({});
  const [checkingOut, setCheckingOut] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<{ ref: string; status: string } | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(cartKey) || "{}");
      // Restore cart after hydration (localStorage is client-only).
      if (saved && typeof saved === "object") setCart(saved);
    } catch {
      /* ignore */
    }
  }, [cartKey]);

  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart, cartKey]);

  // Returning from Paystack: ?order=SF_… — poll until the payment is confirmed.
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("order");
    if (!ref) return;
    let tries = 0;
    let stop = false;
    async function poll() {
      try {
        const res = await fetch(`/api/storefront/order?ref=${encodeURIComponent(ref!)}`);
        const data = await res.json();
        if (stop) return;
        setOrder({ ref: ref!, status: data.status || "pending" });
        if (data.status === "paid") {
          setCart({});
          return;
        }
      } catch {
        /* retry */
      }
      if (++tries < 20 && !stop) setTimeout(poll, 3000);
    }
    poll();
    return () => {
      stop = true;
    };
  }, []);

  const lines = useMemo(
    () =>
      products
        .filter((p) => cart[p.id] > 0)
        .map((p) => ({ product_id: p.id, name: p.name, qty: cart[p.id], price_kobo: p.price_kobo })),
    [products, cart]
  );
  const total = lines.reduce((n, l) => n + l.qty * l.price_kobo, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  function setQty(id: string, qty: number) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(99, qty);
      return next;
    });
  }

  async function pay(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/storefront/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          items: lines.map((l) => ({ product_id: l.product_id, qty: l.qty })),
          customer: { name, phone, email },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.authorization_url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setBusy(false);
    }
  }

  const waLink = whatsappOrderLink(whatsapp, storeName, lines, { name });

  return (
    <>
      {order && (
        <div
          role="status"
          className={`mt-8 rounded-2xl border p-5 text-center ${
            order.status === "paid" ? "border-emerald-500/40 bg-emerald-500/10" : "border-white/10 bg-white/[0.03]"
          }`}
        >
          {order.status === "paid" ? (
            <>
              <p className="text-[17px] font-semibold text-white">Payment received — thank you!</p>
              <p className="mt-1 text-[14px] text-[#c7cdd8]">
                {storeName} has been notified. Reference {order.ref}.
              </p>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi ${storeName}, I just paid online. Reference ${order.ref}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex rounded-full bg-[#25D366] px-5 py-2.5 text-[14px] font-semibold text-white"
              >
                Confirm delivery on WhatsApp
              </a>
            </>
          ) : (
            <p className="text-[15px] text-[#c7cdd8]">Confirming your payment…</p>
          )}
        </div>
      )}

      {products.length === 0 ? (
        <p className="mt-16 text-center text-[15px] text-[#86868b]">No products yet — check back soon.</p>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {p.image_url ? (
                <div className="relative aspect-square bg-black/30">
                  <Image src={p.image_url} alt={p.name} fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover" />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center bg-black/30 text-[13px] text-[#86868b]">
                  No photo
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-[16px] font-semibold text-white">{p.name}</h2>
                {p.description && <p className="mt-1 line-clamp-3 text-[13px] text-[#a1a1a6]">{p.description}</p>}
                <p className="mt-3 text-[18px] font-semibold text-white">{formatKobo(p.price_kobo)}</p>
                <div className="mt-auto pt-4">
                  {!p.in_stock ? (
                    <p className="text-[13px] text-[#86868b]">Out of stock</p>
                  ) : cart[p.id] ? (
                    <div className="flex items-center gap-3">
                      <button type="button" aria-label={`Remove one ${p.name}`} onClick={() => setQty(p.id, cart[p.id] - 1)} className="h-9 w-9 rounded-full border border-white/20 text-white">
                        −
                      </button>
                      <span className="min-w-6 text-center text-white">{cart[p.id]}</span>
                      <button type="button" aria-label={`Add one ${p.name}`} onClick={() => setQty(p.id, cart[p.id] + 1)} className="h-9 w-9 rounded-full border border-white/20 text-white">
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setQty(p.id, 1)}
                      className="w-full rounded-full bg-[#ff8c14] py-2.5 text-[14px] font-semibold text-black"
                    >
                      Add to order
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-white/10 bg-[#0d1220]/95 px-5 py-4 backdrop-blur">
          <div className="mx-auto max-w-[1000px]">
            {!checkingOut ? (
              <div className="flex items-center justify-between gap-4">
                <p className="text-[15px] text-white">
                  {count} item{count > 1 ? "s" : ""} · <strong>{formatKobo(total)}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setCheckingOut(true)}
                  className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black"
                >
                  Checkout
                </button>
              </div>
            ) : (
              <form onSubmit={pay} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-semibold text-white">Total {formatKobo(total)}</p>
                  <button type="button" onClick={() => setCheckingOut(false)} className="text-[13px] text-[#a1a1a6] underline">
                    Back
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" className={field} />
                  <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" aria-label="Phone number" className={field} />
                  {canPay && (
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email for receipt" aria-label="Email" className={field} />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {canPay && (
                    <button type="submit" disabled={busy} className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black disabled:opacity-60">
                      {busy ? "Opening secure payment…" : `Pay ${formatKobo(total)} now`}
                    </button>
                  )}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#25D366] px-6 py-3 text-[14px] font-semibold text-white"
                  >
                    Order on WhatsApp
                  </a>
                </div>
                {error && <p className="text-[13px] text-red-400">{error}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
