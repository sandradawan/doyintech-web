"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { track } from "@/lib/analytics/client";
import {
  FiCheck,
  FiChevronLeft,
  FiLock,
  FiMinus,
  FiPackage,
  FiPlus,
  FiSearch,
  FiShare2,
  FiShoppingBag,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import {
  discountKobo,
  formatKobo,
  normalizeWhatsapp,
  whatsappOrderLink,
  type DeliveryZone,
  type Discount,
} from "@/lib/storefront/shared";

export type ShopProduct = {
  id: string;
  name: string;
  description: string | null;
  price_kobo: number;
  image_url: string | null;
  in_stock: boolean;
};

type OrderState = { ref: string; status: "pending" | "paid" | "unconfirmed" };
type Details = { name: string; phone: string; email: string; note: string };

const field =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-[15px] text-[#111] outline-none transition placeholder:text-[#9a9a9a] focus:border-[#111] focus:ring-2 focus:ring-black/5";
const iconBtn =
  "flex h-10 w-10 items-center justify-center rounded-full text-[#111] transition hover:bg-black/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#111]";

/** Stable accent hue per shop so each storefront has its own colour without a setting. */
function hueFor(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "S"
  );
}

function Avatar({ name, hue, size }: { name: string; hue: number; size: "sm" | "lg" }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${
        size === "lg" ? "h-16 w-16 text-[22px] sm:h-20 sm:w-20 sm:text-[26px]" : "h-8 w-8 text-[12px]"
      }`}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${(hue + 40) % 360} 75% 35%))` }}
    >
      {initials(name)}
    </span>
  );
}

function ProductImage({ product, sizes, priority }: { product: ShopProduct; sizes: string; priority?: boolean }) {
  if (!product.image_url) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#efeee9] text-[#a3a29a]">
        <FiPackage size={28} aria-hidden />
        <span className="text-[11px] uppercase tracking-wider">{initials(product.name)}</span>
      </div>
    );
  }
  return (
    <Image
      src={product.image_url}
      alt={product.name}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition duration-500 group-hover:scale-[1.04]"
    />
  );
}

function Stepper({ qty, name, onChange, size = "md" }: { qty: number; name: string; onChange: (q: number) => void; size?: "sm" | "md" }) {
  const btn = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-full border border-black/10 bg-white">
      <button type="button" aria-label={`Remove one ${name}`} onClick={() => onChange(qty - 1)} className={`${btn} flex items-center justify-center rounded-full text-[#111] hover:bg-black/5`}>
        {qty === 1 ? <FiTrash2 size={14} /> : <FiMinus size={14} />}
      </button>
      <span className="min-w-7 text-center text-[14px] font-semibold tabular-nums text-[#111]" aria-live="polite">
        {qty}
      </span>
      <button type="button" aria-label={`Add one ${name}`} onClick={() => onChange(qty + 1)} className={`${btn} flex items-center justify-center rounded-full text-[#111] hover:bg-black/5`}>
        <FiPlus size={14} />
      </button>
    </div>
  );
}

/** Public storefront: header, product grid, product view, bag and checkout (WhatsApp, or Paystack when enabled). */
export default function ShopClient({
  slug,
  storeName,
  tagline,
  whatsapp,
  canPay,
  zones,
  hasCodes,
  products,
}: {
  slug: string;
  storeName: string;
  tagline: string | null;
  whatsapp: string;
  canPay: boolean;
  zones: DeliveryZone[];
  hasCodes: boolean;
  products: ShopProduct[];
}) {
  const cartKey = `dt_shop_cart_${slug}`;
  const detailsKey = `dt_shop_details_${slug}`;
  const hue = hueFor(slug);

  // One view per visitor per 30 minutes; ":dir" marks visits that came from DoyinTech (directory, homepage).
  useEffect(() => {
    try {
      const key = `dt_view_${slug}`;
      if (Date.now() - Number(sessionStorage.getItem(key) || 0) < 30 * 60_000) return;
      sessionStorage.setItem(key, String(Date.now()));
    } catch {
      /* storage blocked: still count */
    }
    let fromDoyinTech = false;
    try {
      const ref = new URL(document.referrer);
      fromDoyinTech = ref.host === window.location.host && !ref.pathname.startsWith("/s/");
    } catch {
      /* no referrer */
    }
    track("shop_view", fromDoyinTech ? `${slug}:dir` : slug);
  }, [slug]);

  const [cart, setCart] = useState<Record<string, number>>({});
  const [details, setDetails] = useState<Details>({ name: "", phone: "", email: "", note: "" });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");
  const [viewing, setViewing] = useState<ShopProduct | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [step, setStep] = useState<"bag" | "details">("bag");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderState | null>(null);
  const [toast, setToast] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [codeMsg, setCodeMsg] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  // Restore the bag and the customer's details (localStorage is client-only).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(cartKey) || "{}");
      if (saved && typeof saved === "object") setCart(saved);
      const d = JSON.parse(localStorage.getItem(detailsKey) || "null");
      if (d && typeof d === "object") setDetails((prev) => ({ ...prev, ...d }));
    } catch {
      /* ignore */
    }
  }, [cartKey, detailsKey]);

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
        if (data.status === "paid") {
          setOrder({ ref: ref!, status: "paid" });
          setCart({});
          return;
        }
        setOrder({ ref: ref!, status: "pending" });
      } catch {
        /* retry */
      }
      if (stop) return;
      if (++tries < 20) setTimeout(poll, 3000);
      else setOrder({ ref: ref!, status: "unconfirmed" });
    }
    poll();
    return () => {
      stop = true;
    };
  }, []);

  // Lock page scroll and close on Escape while a panel is open.
  useEffect(() => {
    if (!bagOpen && !viewing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setViewing(null);
      setBagOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [bagOpen, viewing]);

  const lines = useMemo(
    () =>
      products
        .filter((p) => p.in_stock && cart[p.id] > 0)
        .map((p) => ({ product: p, product_id: p.id, name: p.name, qty: cart[p.id], price_kobo: p.price_kobo })),
    [products, cart]
  );
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price_kobo, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const zone = zones.find((z) => z.name === zoneName) || null;
  const off = discountKobo(subtotal, discount);
  const total = subtotal - off + (zone?.fee_kobo || 0);

  async function applyCode() {
    const code = codeInput.trim();
    if (!code) return;
    setCodeMsg("");
    try {
      const res = await fetch(`/api/storefront/discounts?slug=${encodeURIComponent(slug)}&code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!res.ok || !data.discount) throw new Error(data.error || "That code isn't valid.");
      const d = data.discount as Discount;
      setDiscount(d);
      setCodeMsg(
        discountKobo(subtotal, d) ? `${d.code} applied` : `${d.code} needs an order of ${formatKobo(d.min_subtotal_kobo)} or more`
      );
    } catch (err) {
      setDiscount(null);
      setCodeMsg(err instanceof Error ? err.message : "That code isn't valid.");
    }
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? products.filter((p) => `${p.name} ${p.description || ""}`.toLowerCase().includes(q)) : products;
    if (sort === "low") return [...list].sort((a, b) => a.price_kobo - b.price_kobo);
    if (sort === "high") return [...list].sort((a, b) => b.price_kobo - a.price_kobo);
    return list;
  }, [products, query, sort]);

  function flash(message: string) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 1800);
  }

  function setQty(id: string, qty: number) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(99, qty);
      return next;
    });
  }

  function add(p: ShopProduct) {
    setQty(p.id, (cart[p.id] || 0) + 1);
    flash(`Added ${p.name}`);
  }

  function openBag() {
    setStep("bag");
    setError("");
    setBagOpen(true);
  }

  function updateDetails(patch: Partial<Details>) {
    setDetails((d) => {
      const next = { ...d, ...patch };
      try {
        localStorage.setItem(detailsKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  async function share() {
    const url = `${window.location.origin}/s/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: storeName, text: tagline || `Shop ${storeName}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      flash("Shop link copied");
    } catch {
      /* share sheet dismissed */
    }
  }

  async function pay(e: FormEvent) {
    e.preventDefault();
    if (zones.length && !zone) {
      setError("Choose a delivery area.");
      return;
    }
    if (!normalizeWhatsapp(details.phone)) {
      setError("Enter a valid phone number so the shop can reach you.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/storefront/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          items: lines.map((l) => ({ product_id: l.product_id, qty: l.qty })),
          customer: { name: details.name, phone: details.phone, email: details.email, address: details.note },
          delivery_zone: zone?.name,
          discount_code: off ? discount?.code : undefined,
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

  const waOrderLink = whatsappOrderLink(whatsapp, storeName, lines, {
    name: details.name.trim(),
    phone: details.phone.trim(),
    note: details.note.trim(),
    zone,
    discount: off && discount ? { code: discount.code, kobo: off } : null,
  });
  const waChat = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi ${storeName}, I found your shop online.`)}`;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-[#f7f7f4]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <a href="#top" className="flex min-w-0 items-center gap-2.5">
            <Avatar name={storeName} hue={hue} size="sm" />
            <span className="truncate text-[15px] font-semibold tracking-tight text-[#111]">{storeName}</span>
          </a>
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={share} className={iconBtn} aria-label="Share this shop">
              <FiShare2 size={18} />
            </button>
            <a href={waChat} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label={`Chat with ${storeName} on WhatsApp`}>
              <FaWhatsapp size={19} />
            </a>
            <button type="button" onClick={openBag} className={`${iconBtn} relative`} aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}>
              <FiShoppingBag size={19} />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#111] px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div id="top" className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {order && <OrderBanner order={order} storeName={storeName} whatsapp={whatsapp} details={details} onClose={() => setOrder(null)} />}

        {/* Hero */}
        <section
          className="mt-6 overflow-hidden rounded-3xl p-6 ring-1 ring-black/[0.06] sm:mt-8 sm:p-10"
          style={{
            background: `radial-gradient(120% 120% at 0% 0%, hsl(${hue} 80% 94%) 0%, #ffffff 55%)`,
          }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <Avatar name={storeName} hue={hue} size="lg" />
              <div className="min-w-0">
                <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-[#111] sm:text-[36px]">{storeName}</h1>
                {tagline && <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-[#555] sm:text-[16px]">{tagline}</p>}
              </div>
            </div>
            <a
              href={waChat}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#25D366] px-5 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:brightness-95 sm:self-center"
            >
              <FaWhatsapp size={17} /> Chat with us
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2 text-[12px] font-medium text-[#444]">
            <li className="rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-black/[0.06]">
              {products.length} product{products.length === 1 ? "" : "s"}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-black/[0.06]">
              <FaWhatsapp className="text-[#25D366]" aria-hidden /> Order on WhatsApp
            </li>
            {canPay && (
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-black/[0.06]">
                <FiLock aria-hidden /> Secure card &amp; transfer payment by Paystack
              </li>
            )}
          </ul>
        </section>

        {/* Toolbar */}
        {products.length > 3 && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full sm:max-w-sm">
              <span className="sr-only">Search products</span>
              <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${storeName}`}
                className={`${field} pl-10`}
              />
            </label>
            <label className="flex items-center gap-2 text-[13px] text-[#555]">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[14px] text-[#111] outline-none focus:border-[#111]"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </label>
          </div>
        )}

        {/* Grid */}
        {products.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-black/10 bg-white px-6 py-16 text-center">
            <FiShoppingBag className="mx-auto text-[#bbb]" size={32} aria-hidden />
            <p className="mt-3 text-[16px] font-semibold text-[#111]">New products are on the way</p>
            <p className="mt-1 text-[14px] text-[#666]">Message the shop on WhatsApp to ask what&apos;s available.</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-[15px] text-[#555]">No products match &ldquo;{query}&rdquo;.</p>
            <button type="button" onClick={() => setQuery("")} className="mt-2 text-[14px] font-semibold text-[#111] underline">
              Clear search
            </button>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((p, i) => (
              <li key={p.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06] transition hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]">
                <button type="button" onClick={() => setViewing(p)} className="relative block aspect-square overflow-hidden bg-[#efeee9]" aria-label={`View ${p.name}`}>
                  <ProductImage product={p} sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 280px" priority={i < 4} />
                  {!p.in_stock && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-[#111]/80 px-2.5 py-1 text-[11px] font-semibold text-white">Sold out</span>
                  )}
                </button>
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <button type="button" onClick={() => setViewing(p)} className="text-left">
                    <h2 className="line-clamp-2 text-[14px] font-medium leading-snug text-[#111] sm:text-[15px]">{p.name}</h2>
                  </button>
                  <p className="mt-1.5 text-[15px] font-semibold text-[#111] sm:text-[16px]">{formatKobo(p.price_kobo)}</p>
                  <div className="mt-auto pt-3">
                    {!p.in_stock ? (
                      <span className="block w-full rounded-full bg-black/[0.04] py-2.5 text-center text-[13px] font-medium text-[#888]">Sold out</span>
                    ) : cart[p.id] ? (
                      <Stepper qty={cart[p.id]} name={p.name} onChange={(q) => setQty(p.id, q)} size="sm" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => add(p)}
                        className="w-full rounded-full bg-[#111] py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#333] sm:text-[14px]"
                      >
                        Add to bag
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Floating bag bar */}
      <AnimatePresence>
        {count > 0 && !bagOpen && !viewing && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
          >
            <button
              type="button"
              onClick={openBag}
              className="flex w-full max-w-md items-center justify-between gap-3 rounded-full bg-[#111] py-3 pl-5 pr-3 text-white shadow-2xl"
            >
              <span className="flex items-center gap-2 text-[14px] font-medium">
                <FiShoppingBag aria-hidden /> {count} item{count === 1 ? "" : "s"}
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-[#111]">View bag · {formatKobo(subtotal)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.p
            role="status"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="fixed left-1/2 top-20 z-[120] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#111] px-4 py-2.5 text-[13px] font-medium text-white shadow-xl"
          >
            <FiCheck aria-hidden /> {toast}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Product view */}
      <AnimatePresence>
        {viewing && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={viewing.name}>
            <motion.button
              type="button"
              aria-label="Close"
              onClick={() => setViewing(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white text-[#111] shadow-2xl sm:rounded-3xl"
            >
              <button type="button" onClick={() => setViewing(null)} className={`${iconBtn} absolute right-3 top-3 z-10 bg-white/90 shadow`} aria-label="Close">
                <FiX size={18} />
              </button>
              <div className="grid sm:grid-cols-2">
                <div className="group relative aspect-square bg-[#efeee9]">
                  <ProductImage product={viewing} sizes="(max-width: 640px) 100vw, 384px" />
                </div>
                <div className="flex flex-col p-6 sm:p-7">
                  <h2 className="pr-8 text-[22px] font-semibold leading-tight tracking-tight">{viewing.name}</h2>
                  <p className="mt-2 text-[22px] font-semibold">{formatKobo(viewing.price_kobo)}</p>
                  <p className={`mt-1 text-[13px] font-medium ${viewing.in_stock ? "text-emerald-700" : "text-[#999]"}`}>
                    {viewing.in_stock ? "In stock" : "Sold out"}
                  </p>
                  {viewing.description && <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-[#444]">{viewing.description}</p>}
                  <div className="mt-6 space-y-3 sm:mt-auto sm:pt-6">
                    {viewing.in_stock &&
                      (cart[viewing.id] ? (
                        <div className="flex items-center justify-between gap-3">
                          <Stepper qty={cart[viewing.id]} name={viewing.name} onChange={(q) => setQty(viewing.id, q)} />
                          <button
                            type="button"
                            onClick={() => {
                              setViewing(null);
                              openBag();
                            }}
                            className="rounded-full bg-[#111] px-5 py-3 text-[14px] font-semibold text-white"
                          >
                            View bag
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => add(viewing)} className="w-full rounded-full bg-[#111] py-3.5 text-[15px] font-semibold text-white hover:bg-[#333]">
                          Add to bag · {formatKobo(viewing.price_kobo)}
                        </button>
                      ))}
                    <a
                      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi ${storeName}, is "${viewing.name}" (${formatKobo(viewing.price_kobo)}) available?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-black/10 py-3 text-[14px] font-semibold text-[#111] hover:bg-black/[0.03]"
                    >
                      <FaWhatsapp className="text-[#25D366]" size={17} /> Ask about this item
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bag drawer */}
      <AnimatePresence>
        {bagOpen && (
          <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Your bag">
            <motion.button
              type="button"
              aria-label="Close bag"
              onClick={() => setBagOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#f7f7f4] text-[#111] shadow-2xl"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-black/[0.06] px-4">
                {step === "details" ? (
                  <button type="button" onClick={() => setStep("bag")} className="flex items-center gap-1 text-[14px] font-medium text-[#111]">
                    <FiChevronLeft size={18} /> Bag
                  </button>
                ) : (
                  <p className="text-[17px] font-semibold">Your bag {count > 0 && <span className="text-[#888]">({count})</span>}</p>
                )}
                <button type="button" onClick={() => setBagOpen(false)} className={iconBtn} aria-label="Close bag">
                  <FiX size={20} />
                </button>
              </div>

              {lines.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <FiShoppingBag size={36} className="text-[#bbb]" aria-hidden />
                  <p className="mt-3 text-[16px] font-semibold">Your bag is empty</p>
                  <button type="button" onClick={() => setBagOpen(false)} className="mt-4 rounded-full bg-[#111] px-6 py-3 text-[14px] font-semibold text-white">
                    Continue shopping
                  </button>
                </div>
              ) : step === "bag" ? (
                <>
                  <ul className="flex-1 divide-y divide-black/[0.06] overflow-y-auto px-4">
                    {lines.map((l) => (
                      <li key={l.product_id} className="flex gap-3 py-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#efeee9]">
                          <ProductImage product={l.product} sizes="80px" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="line-clamp-2 text-[14px] font-medium leading-snug">{l.name}</p>
                          <p className="mt-0.5 text-[13px] text-[#777]">{formatKobo(l.price_kobo)} each</p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <Stepper qty={l.qty} name={l.name} onChange={(q) => setQty(l.product_id, q)} size="sm" />
                            <p className="text-[14px] font-semibold tabular-nums">{formatKobo(l.qty * l.price_kobo)}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="shrink-0 border-t border-black/[0.06] bg-white p-4">
                    <div className="flex items-center justify-between text-[15px]">
                      <span className="text-[#555]">Subtotal</span>
                      <span className="text-[18px] font-semibold tabular-nums">{formatKobo(subtotal)}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-[#888]">
                      {zones.length ? "Delivery fee and any discount are added at checkout." : "Delivery is arranged with the shop on WhatsApp."}
                    </p>
                    <button type="button" onClick={() => setStep("details")} className="mt-4 w-full rounded-full bg-[#111] py-3.5 text-[15px] font-semibold text-white hover:bg-[#333]">
                      Checkout
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={pay} className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    <p className="text-[17px] font-semibold">Your details</p>
                    <input required={canPay} autoComplete="name" value={details.name} onChange={(e) => updateDetails({ name: e.target.value })} placeholder="Full name" aria-label="Full name" className={field} />
                    <input
                      required={canPay}
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={details.phone}
                      onChange={(e) => updateDetails({ phone: e.target.value })}
                      placeholder="Phone number"
                      aria-label="Phone number"
                      className={field}
                    />
                    {canPay && (
                      <input
                        required
                        type="email"
                        autoComplete="email"
                        value={details.email}
                        onChange={(e) => updateDetails({ email: e.target.value })}
                        placeholder="Email for your receipt"
                        aria-label="Email"
                        className={field}
                      />
                    )}
                    <textarea
                      rows={3}
                      autoComplete="street-address"
                      value={details.note}
                      onChange={(e) => updateDetails({ note: e.target.value })}
                      placeholder="Delivery address or note (optional)"
                      aria-label="Delivery address or note"
                      className={field}
                    />
                    {zones.length > 0 && (
                      <select
                        required
                        value={zoneName}
                        onChange={(e) => setZoneName(e.target.value)}
                        aria-label="Delivery area"
                        className={field}
                      >
                        <option value="">Choose delivery area</option>
                        {zones.map((z) => (
                          <option key={z.name} value={z.name}>
                            {z.name} · {z.fee_kobo ? formatKobo(z.fee_kobo) : "Free"}
                          </option>
                        ))}
                      </select>
                    )}
                    {hasCodes && (
                      <div>
                        <div className="flex gap-2">
                          <input
                            value={codeInput}
                            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                            placeholder="Discount code"
                            aria-label="Discount code"
                            className={`${field} uppercase`}
                          />
                          <button
                            type="button"
                            onClick={applyCode}
                            className="shrink-0 rounded-xl border border-black/10 bg-white px-4 text-[14px] font-semibold text-[#111] hover:bg-black/[0.03]"
                          >
                            Apply
                          </button>
                        </div>
                        {codeMsg && <p className={`mt-1.5 text-[12px] ${off ? "text-emerald-700" : "text-red-600"}`}>{codeMsg}</p>}
                      </div>
                    )}
                    <div className="rounded-2xl bg-white p-4 ring-1 ring-black/[0.06]">
                      {lines.map((l) => (
                        <div key={l.product_id} className="flex justify-between gap-3 py-1 text-[13px] text-[#555]">
                          <span className="truncate">
                            {l.qty} × {l.name}
                          </span>
                          <span className="tabular-nums">{formatKobo(l.qty * l.price_kobo)}</span>
                        </div>
                      ))}
                      {off > 0 && (
                        <div className="flex justify-between gap-3 py-1 text-[13px] text-emerald-700">
                          <span>Discount ({discount?.code})</span>
                          <span className="tabular-nums">−{formatKobo(off)}</span>
                        </div>
                      )}
                      {zone && (
                        <div className="flex justify-between gap-3 py-1 text-[13px] text-[#555]">
                          <span>Delivery · {zone.name}</span>
                          <span className="tabular-nums">{zone.fee_kobo ? formatKobo(zone.fee_kobo) : "Free"}</span>
                        </div>
                      )}
                      <div className="mt-2 flex justify-between border-t border-black/[0.06] pt-2 text-[15px] font-semibold">
                        <span>Total</span>
                        <span className="tabular-nums">{formatKobo(total)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 space-y-2.5 border-t border-black/[0.06] bg-white p-4">
                    {error && (
                      <p role="alert" className="text-[13px] text-red-600">
                        {error}
                      </p>
                    )}
                    {canPay && (
                      <button
                        type="submit"
                        disabled={busy}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111] py-3.5 text-[15px] font-semibold text-white hover:bg-[#333] disabled:opacity-60"
                      >
                        <FiLock size={15} aria-hidden /> {busy ? "Opening secure payment…" : `Pay ${formatKobo(total)}`}
                      </button>
                    )}
                    <a
                      href={waOrderLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-semibold ${
                        canPay ? "border border-black/10 text-[#111] hover:bg-black/[0.03]" : "bg-[#25D366] text-white hover:brightness-95"
                      }`}
                    >
                      <FaWhatsapp size={18} className={canPay ? "text-[#25D366]" : ""} /> Send order on WhatsApp
                    </a>
                    <p className="text-center text-[11px] text-[#999]">
                      {canPay ? "Payments are processed securely by Paystack." : "Your order opens in WhatsApp, ready to send."}
                    </p>
                  </div>
                </form>
              )}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function OrderBanner({
  order,
  storeName,
  whatsapp,
  details,
  onClose,
}: {
  order: OrderState;
  storeName: string;
  whatsapp: string;
  details: Details;
  onClose: () => void;
}) {
  const message = [
    `Hi ${storeName}, I just paid online. Reference ${order.ref}.`,
    details.name ? `Name: ${details.name}` : "",
    details.note ? `Delivery: ${details.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const confirmLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <div
      role="status"
      className={`relative mt-6 rounded-3xl p-5 pr-12 ring-1 sm:p-6 sm:pr-14 ${
        order.status === "paid" ? "bg-emerald-50 ring-emerald-200" : "bg-white ring-black/[0.06]"
      }`}
    >
      <button type="button" onClick={onClose} className={`${iconBtn} absolute right-2 top-2`} aria-label="Dismiss">
        <FiX size={16} />
      </button>
      {order.status === "paid" ? (
        <div className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <FiCheck size={20} aria-hidden />
          </span>
          <div>
            <p className="text-[17px] font-semibold text-[#111]">Payment received. Thank you!</p>
            <p className="mt-1 text-[14px] text-[#555]">
              {storeName} has been notified. Your reference is <span className="font-mono text-[#111]">{order.ref}</span>.
            </p>
            <a
              href={confirmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              <FaWhatsapp size={16} /> Arrange delivery on WhatsApp
            </a>
          </div>
        </div>
      ) : order.status === "pending" ? (
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-black/15 border-t-[#111]" aria-hidden />
          <p className="text-[15px] text-[#333]">Confirming your payment…</p>
        </div>
      ) : (
        <div>
          <p className="text-[15px] font-semibold text-[#111]">We couldn&apos;t confirm this payment yet.</p>
          <p className="mt-1 text-[14px] text-[#555]">
            If you were debited, message the shop with reference <span className="font-mono text-[#111]">{order.ref}</span>.
          </p>
          <a href={confirmLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-[#128C7E] underline">
            <FaWhatsapp size={16} /> Message {storeName}
          </a>
        </div>
      )}
    </div>
  );
}
