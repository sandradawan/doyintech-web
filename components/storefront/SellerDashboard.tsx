"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import SubscribeButton from "@/components/subscriptions/SubscribeButton";
import { absoluteUrl } from "@/lib/site";
import { sellerApi } from "@/lib/storefront/sellerApi";
import {
  BoostPanel,
  DeliveryPanel,
  DiscountsPanel,
  PaymentLinksPanel,
  type DiscountRow,
  type PaymentLink,
} from "@/components/storefront/SellerSalesTools";
import {
  FREE_PLAN_FEE_PERCENT,
  STORE_CATEGORIES,
  formatKobo,
  normalizeSlug,
  type OrderItem,
  type StoreProduct,
  type Storefront,
} from "@/lib/storefront/shared";

type Order = {
  reference: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  amount_kobo: number;
  status: string;
  created_at: string;
  delivery_zone?: string | null;
  delivery_address?: string | null;
  discount_code?: string | null;
};

type Me = {
  store: Storefront | null;
  products?: StoreProduct[];
  orders?: Order[];
  discounts?: DiscountRow[];
  requests?: PaymentLink[];
  paid: boolean;
  freeLimit: number;
  feePercent?: number;
  stats?: { views7: number; views30: number; fromDoyinTech30: number };
};

const field =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[15px] text-white outline-none focus:border-[#ff8c14]";
const card = "rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:p-6";

const api = sellerApi;

export default function SellerDashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const sb = getSupabaseBrowser();
    const { data } = (await sb?.auth.getSession()) || { data: null };
    setEmail(data?.session?.user.email || null);
    if (data?.session) {
      try {
        setMe(await api<Me>("/api/storefront/me"));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load your shop");
      }
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load from Supabase auth (external system)
    load();
    const sub = getSupabaseBrowser()?.auth.onAuthStateChange(() => load());
    return () => sub?.data.subscription.unsubscribe();
  }, [load]);

  if (checking) return <p className="text-[14px] text-[#86868b]">Loading…</p>;
  if (!email) return <SignIn />;
  if (!me) return <p className="text-[14px] text-red-400">{error || "Could not load your shop."}</p>;
  if (!me.store) return <StoreForm onSaved={load} />;

  const store = me.store;
  const products = me.products || [];
  const orders = me.orders || [];
  const shopUrl = absoluteUrl(`/s/${store.slug}`);
  const atLimit = !me.paid && products.length >= me.freeLimit;
  const paidOrders = orders.filter((o) => o.status === "paid");
  const revenue = paidOrders.reduce((n, o) => n + o.amount_kobo, 0);

  const steps = [
    { done: products.length > 0, label: "Add your first product", hint: "Use a clear photo and a short description." },
    {
      done: products.length > 0 && products.every((p) => p.image_url),
      label: "Give every product a photo",
      hint: "Products with photos get far more orders.",
    },
    {
      done: store.payments_status === "active" || store.payments_status === "pending_review",
      label: "Turn on online payments",
      hint: "Connect your bank below so customers can pay by card or transfer, straight to your account.",
    },
  ];
  const stepsLeft = steps.filter((s) => !s.done).length;

  return (
    <div className="space-y-6">
      <div className={card}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[12px] uppercase tracking-wide text-[#86868b]">
              Your shop
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal ${
                  store.is_published ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-[#a1a1a6]"
                }`}
              >
                {store.is_published ? "Live" : "Hidden"}
              </span>
            </p>
            <p className="mt-1 text-[22px] font-semibold text-white">{store.name}</p>
            <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all text-[14px] text-[#ff8c14] hover:underline">
              {shopUrl.replace(/^https?:\/\//, "")}
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black">
              View shop
            </a>
            <CopyButton text={shopUrl} />
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Shop ${store.name} online: ${shopUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-4 py-2 text-[13px] font-semibold text-white"
            >
              Share on WhatsApp
            </a>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Shop views (7 days)", String(me.stats?.views7 ?? 0)],
            ["Products", me.paid ? String(products.length) : `${products.length}/${me.freeLimit}`],
            ["Paid orders", String(paidOrders.length)],
            ["Online sales", formatKobo(revenue)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-black/30 px-3 py-3 sm:px-4">
              <dt className="text-[11px] uppercase tracking-wide text-[#86868b]">{label}</dt>
              <dd className="mt-1 truncate text-[18px] font-semibold tabular-nums text-white sm:text-[20px]">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[13px] text-[#a1a1a6]">
          Plan: <strong className="text-white">{me.paid ? "Store" : "Free"}</strong>
          {!store.is_published && " · Customers can't see your shop. Turn it on in Shop settings."}
        </p>
      </div>

      {stepsLeft > 0 && (
        <div className={card}>
          <p className="text-[16px] font-semibold text-white">Get your shop ready to sell</p>
          <p className="mt-1 text-[13px] text-[#a1a1a6]">
            {steps.length - stepsLeft} of {steps.length} done
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[#ff8c14] transition-all" style={{ width: `${((steps.length - stepsLeft) / steps.length) * 100}%` }} />
          </div>
          <ol className="mt-4 space-y-3">
            {steps.map((s) => (
              <li key={s.label} className="flex gap-3">
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    s.done ? "bg-emerald-500 text-black" : "border border-white/25 text-transparent"
                  }`}
                >
                  ✓
                </span>
                <div>
                  <p className={`text-[14px] font-medium ${s.done ? "text-[#86868b] line-through" : "text-white"}`}>{s.label}</p>
                  {!s.done && <p className="text-[12px] text-[#86868b]">{s.hint}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {!me.paid && (
        <div className={`${card} border-[#ff8c14]/40`}>
          <p className="text-[16px] font-semibold text-white">Upgrade to DoyinTech Store — ₦3,500/month</p>
          <p className="mt-1 text-[14px] text-[#a1a1a6]">
            Unlimited products, no {FREE_PLAN_FEE_PERCENT}% fee on online orders, discount codes, and no DoyinTech badge.
          </p>
          <div className="mt-4 grid max-w-md gap-3 sm:grid-cols-2">
            <SubscribeButton planId="store-monthly" label="₦3,500 / month" highlight />
            <SubscribeButton planId="store-annual" label="₦35,000 / year" />
          </div>
        </div>
      )}

      <ProductsPanel products={products} atLimit={atLimit} freeLimit={me.freeLimit} onChange={load} />
      <PaymentsPanel store={store} feePercent={me.feePercent ?? 0} onChange={load} />
      <BoostPanel store={store} productCount={products.filter((p) => p.in_stock).length} stats={me.stats} onChange={load} />
      <DeliveryPanel key={JSON.stringify(store.delivery_zones || [])} zones={store.delivery_zones || []} onChange={load} />
      <DiscountsPanel discounts={me.discounts || []} paid={me.paid} onChange={load} />
      <PaymentLinksPanel
        links={me.requests || []}
        paymentsActive={store.payments_status === "active"}
        feePercent={me.feePercent ?? 0}
        onChange={load}
      />
      <OrdersPanel orders={orders} />

      <details className={card}>
        <summary className="cursor-pointer text-[15px] font-semibold text-white">Shop settings</summary>
        <div className="mt-4">
          <StoreForm store={store} onSaved={load} />
        </div>
      </details>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard blocked */
        }
      }}
      className="rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white"
    >
      {copied ? "Copied ✓" : "Copy link"}
    </button>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function send(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabaseBrowser();
    if (!sb) return setError("Sign-in is not configured.");
    const { error: err } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/stores/dashboard` },
    });
    if (err) return setError(err.message);
    setSent(true);
  }

  return (
    <form onSubmit={send} className={card}>
      <p className="text-[16px] font-semibold text-white">Sign in to manage your shop</p>
      <p className="mt-1 text-[13px] text-[#a1a1a6]">We&apos;ll email you a one-time link. New here? The same link creates your account.</p>
      {sent ? (
        <p className="mt-4 text-[14px] text-emerald-300">Check your inbox (and spam) for the sign-in link.</p>
      ) : (
        <>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Email" className={field} />
          <button type="submit" className="mt-3 rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black">
            Email me a sign-in link
          </button>
          {error && <p className="mt-2 text-[13px] text-red-400">{error}</p>}
        </>
      )}
    </form>
  );
}

function StoreForm({ store, onSaved }: { store?: Storefront; onSaved: () => void }) {
  const [name, setName] = useState(store?.name || "");
  const [slug, setSlug] = useState(store?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(store));
  const [whatsapp, setWhatsapp] = useState(store?.whatsapp || "");
  const [tagline, setTagline] = useState(store?.tagline || "");
  const [category, setCategory] = useState(store?.category || "");
  const [city, setCity] = useState(store?.city || "");
  const [published, setPublished] = useState(store?.is_published ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const effectiveSlug = slugTouched ? slug : normalizeSlug(name);

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/storefront/me", {
        method: "POST",
        body: JSON.stringify({ name, slug: effectiveSlug, whatsapp, tagline, category, city, is_published: published }),
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className={store ? "" : card}>
      {!store && (
        <>
          <p className="text-[18px] font-semibold text-white">Create your free shop</p>
          <p className="mt-1 text-[13px] text-[#a1a1a6]">Takes two minutes. Add up to 5 products free.</p>
        </>
      )}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-[13px] text-[#a1a1a6]">
          Shop name
          <input required value={name} onChange={(e) => setName(e.target.value)} className={field} />
        </label>
        <label className="block text-[13px] text-[#a1a1a6]">
          Shop link: doyintech.com/s/<strong className="text-white">{effectiveSlug || "your-shop"}</strong>
          <input
            value={effectiveSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(normalizeSlug(e.target.value));
            }}
            className={field}
          />
        </label>
        <label className="block text-[13px] text-[#a1a1a6]">
          WhatsApp number for orders
          <input required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="0803 123 4567" className={field} />
        </label>
        <label className="block text-[13px] text-[#a1a1a6]">
          Short description (optional)
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Fresh pastries delivered in Jos" className={field} />
        </label>
        <label className="block text-[13px] text-[#a1a1a6]">
          Category (for the shop directory)
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
            <option value="">Choose a category</option>
            {STORE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[13px] text-[#a1a1a6]">
          City
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Jos" maxLength={40} className={field} />
        </label>
      </div>
      {store && (
        <label className="mt-4 flex items-center gap-2 text-[14px] text-white">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Shop visible to customers
        </label>
      )}
      <button type="submit" disabled={busy} className="mt-5 rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black disabled:opacity-60">
        {busy ? "Saving…" : store ? "Save settings" : "Create my shop"}
      </button>
      {error && <p className="mt-2 text-[13px] text-red-400">{error}</p>}
    </form>
  );
}

function ProductsPanel({
  products,
  atLimit,
  freeLimit,
  onChange,
}: {
  products: StoreProduct[];
  atLimit: boolean;
  freeLimit: number;
  onChange: () => void;
}) {
  const [editing, setEditing] = useState<StoreProduct | "new" | null>(null);

  async function remove(p: StoreProduct) {
    if (!confirm(`Delete ${p.name}?`)) return;
    await api(`/api/storefront/products?id=${encodeURIComponent(p.id)}`, { method: "DELETE" });
    onChange();
  }

  async function toggleStock(p: StoreProduct) {
    await api("/api/storefront/products", { method: "PATCH", body: JSON.stringify({ id: p.id, in_stock: !p.in_stock }) });
    onChange();
  }

  return (
    <div className={card}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[16px] font-semibold text-white">Products</p>
        {!editing && (
          <button
            type="button"
            disabled={atLimit}
            onClick={() => setEditing("new")}
            className="rounded-full bg-[#ff8c14] px-4 py-2 text-[13px] font-semibold text-black disabled:opacity-50"
          >
            Add product
          </button>
        )}
      </div>
      {atLimit && !editing && (
        <p className="mt-2 text-[13px] text-[#ff8c14]">You&apos;ve used all {freeLimit} free products. Upgrade above for unlimited.</p>
      )}

      {editing && (
        <ProductForm
          product={editing === "new" ? undefined : editing}
          onDone={() => {
            setEditing(null);
            onChange();
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      {products.length === 0 && !editing ? (
        <p className="mt-4 text-[14px] text-[#86868b]">No products yet. Add your first one.</p>
      ) : (
        <ul className="mt-4 divide-y divide-white/10">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/40">
                {p.image_url && <Image src={p.image_url} alt="" fill sizes="48px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-white">{p.name}</p>
                <p className="flex items-center gap-2 text-[13px] text-[#a1a1a6]">
                  {formatKobo(p.price_kobo)}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      p.in_stock ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-[#a1a1a6]"
                    }`}
                  >
                    {p.in_stock ? "In stock" : "Sold out"}
                  </span>
                  {!p.image_url && <span className="text-[11px] text-[#ff8c14]">No photo</span>}
                </p>
              </div>
              <div className="flex shrink-0 gap-2 text-[12px]">
                <button type="button" onClick={() => toggleStock(p)} className="text-[#a1a1a6] underline">
                  {p.in_stock ? "Mark out" : "Mark in"}
                </button>
                <button type="button" onClick={() => setEditing(p)} className="text-[#ff8c14] underline">
                  Edit
                </button>
                <button type="button" onClick={() => remove(p)} className="text-red-400 underline">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProductForm({ product, onDone, onCancel }: { product?: StoreProduct; onDone: () => void; onCancel: () => void }) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product ? String(product.price_kobo / 100) : "");
  const [description, setDescription] = useState(product?.description || "");
  const [image, setImage] = useState(product?.image_url || "");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const priceKobo = Math.round(Number(price.replace(/[^\d.]/g, "")) * 100);

  async function upload(file: File | undefined) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Use a JPG, PNG or WebP photo.");
      return;
    }
    if (file.size > 1024 * 1024) {
      setError("That photo is over 1 MB. Take a screenshot of it or resize it, then try again.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const data = await api<{ url: string }>("/api/storefront/upload", { method: "POST", body: form });
      setImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = { name, price_ngn: Number(price.replace(/[^\d.]/g, "")), description, image_url: image };
      await api("/api/storefront/products", {
        method: product ? "PATCH" : "POST",
        body: JSON.stringify(product ? { ...body, id: product.id } : body),
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-[13px] text-[#a1a1a6]">
          Product name
          <input required value={name} onChange={(e) => setName(e.target.value)} className={field} />
        </label>
        <label className="block text-[13px] text-[#a1a1a6]">
          Price (₦)
          <input required inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="5000" className={field} />
          {priceKobo > 0 && <span className="mt-1 block text-[12px] text-[#86868b]">Customers see {formatKobo(priceKobo)}</span>}
        </label>
        <label className="block text-[13px] text-[#a1a1a6] sm:col-span-2">
          Description (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Size, colour, what's included, delivery time…"
            className={field}
          />
        </label>
        <div className="flex items-center gap-4 sm:col-span-2">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-black/30 text-[11px] text-[#86868b]">
            {image ? <Image src={image} alt="Product photo preview" fill sizes="96px" className="object-cover" /> : uploading ? "Uploading…" : "No photo"}
          </div>
          <div className="text-[13px] text-[#a1a1a6]">
            <label className="inline-flex cursor-pointer rounded-full border border-white/20 px-4 py-2 font-semibold text-white hover:bg-white/5">
              {uploading ? "Uploading…" : image ? "Change photo" : "Upload photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading}
                onChange={(e) => upload(e.target.files?.[0])}
                className="sr-only"
              />
            </label>
            {image && (
              <button type="button" onClick={() => setImage("")} className="ml-3 text-[12px] text-[#a1a1a6] underline">
                Remove
              </button>
            )}
            <p className="mt-2 text-[12px] text-[#86868b]">JPG, PNG or WebP under 1 MB. Square photos look best.</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={busy || uploading} className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black disabled:opacity-60">
          {busy ? "Saving…" : "Save product"}
        </button>
        <button type="button" onClick={onCancel} className="text-[14px] text-[#a1a1a6] underline">
          Cancel
        </button>
      </div>
      {error && <p className="mt-2 text-[13px] text-red-400">{error}</p>}
    </form>
  );
}

function PaymentsPanel({ store, feePercent, onChange }: { store: Storefront; feePercent: number; onChange: () => void }) {
  const [banks, setBanks] = useState<{ name: string; code: string }[]>([]);
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function openForm() {
    setOpen(true);
    if (!banks.length) {
      try {
        const data = await api<{ banks: { name: string; code: string }[] }>("/api/storefront/payments");
        setBanks(data.banks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load banks");
      }
    }
  }

  async function connect(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api<{ message: string }>("/api/storefront/payments", {
        method: "POST",
        body: JSON.stringify({ bank_code: bank, account_number: account }),
      });
      setMsg(data.message);
      setOpen(false);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect");
    } finally {
      setBusy(false);
    }
  }

  const status: Record<string, string> = {
    off: "Not set up — customers order on WhatsApp.",
    pending_review: "Under review — we'll switch on checkout within one business day.",
    active: "Active — customers can pay online. Money settles to your bank.",
    rejected: "Not approved — contact us on WhatsApp for details.",
  };

  return (
    <div className={card}>
      <p className="text-[16px] font-semibold text-white">Online payments (Paystack)</p>
      <p className="mt-1 text-[14px] text-[#a1a1a6]">{status[store.payments_status]}</p>
      {store.account_name && (
        <p className="mt-1 text-[13px] text-[#86868b]">
          Payout account: {store.account_name} · ••••{store.account_last4}
        </p>
      )}
      {msg && <p className="mt-2 text-[13px] text-emerald-300">{msg}</p>}
      <p className="mt-1 text-[12px] text-[#86868b]">
        {feePercent > 0
          ? `Free plan: DoyinTech keeps ${feePercent}% of each online payment. On the Store plan there's no fee.`
          : "Store plan: no DoyinTech fee on online payments."}{" "}
        Paystack&apos;s own fee is deducted by Paystack.
      </p>
      {!open ? (
        <button type="button" onClick={openForm} className="mt-4 rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white">
          {store.payments_status === "off" ? "Connect bank account" : "Change bank account"}
        </button>
      ) : (
        <form onSubmit={connect} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-[13px] text-[#a1a1a6]">
            Bank
            <select required value={bank} onChange={(e) => setBank(e.target.value)} className={field}>
              <option value="">Choose your bank</option>
              {banks.map((b) => (
                <option key={b.code + b.name} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Account number
            <input required inputMode="numeric" maxLength={10} value={account} onChange={(e) => setAccount(e.target.value)} className={field} />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" disabled={busy} className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black disabled:opacity-60">
              {busy ? "Verifying…" : "Verify and connect"}
            </button>
            <p className="mt-2 text-[12px] text-[#86868b]">
              We verify the account name with your bank. Paystack fees are deducted from each payment.
            </p>
          </div>
        </form>
      )}
      {error && <p className="mt-2 text-[13px] text-red-400">{error}</p>}
    </div>
  );
}

function OrdersPanel({ orders }: { orders: Order[] }) {
  return (
    <div className={card}>
      <p className="text-[16px] font-semibold text-white">Online orders</p>
      {orders.length === 0 ? (
        <p className="mt-2 text-[14px] text-[#86868b]">
          Paid orders appear here. WhatsApp orders arrive in your WhatsApp chats.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-white/10">
          {orders.map((o) => (
            <li key={o.reference} className="py-3 text-[14px]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-white">
                  {o.customer_name} · {formatKobo(o.amount_kobo)}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                    o.status === "paid" ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-[#a1a1a6]"
                  }`}
                >
                  {o.status === "pending" ? "Awaiting payment" : o.status}
                </span>
              </div>
              <p className="text-[13px] text-[#a1a1a6]">
                {o.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}
                {o.discount_code ? ` · code ${o.discount_code}` : ""}
                {o.delivery_zone ? ` · deliver to ${o.delivery_zone}` : ""} ·{" "}
                <a href={`https://wa.me/${o.customer_phone.replace(/\D/g, "").replace(/^0/, "234")}`} target="_blank" rel="noopener noreferrer" className="text-[#25D366] underline">
                  {o.customer_phone}
                </a>{" "}
                · {new Date(o.created_at).toLocaleString("en-NG")}
              </p>
              {o.delivery_address && <p className="text-[12px] text-[#86868b]">Address / note: {o.delivery_address}</p>}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-[12px] text-[#86868b]">
        Need a full website for your brand?{" "}
        <Link href="/hire" className="text-[#ff8c14] hover:underline">
          See website packages
        </Link>
        .
      </p>
    </div>
  );
}
