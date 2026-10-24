"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { sellerApi } from "@/lib/storefront/sellerApi";
import { BOOST_PLANS, formatKobo, MAX_DELIVERY_ZONES, type DeliveryZone, type Storefront } from "@/lib/storefront/shared";

export type DiscountRow = {
  code: string;
  percent_off: number | null;
  amount_off_kobo: number | null;
  min_subtotal_kobo: number;
  max_uses: number | null;
  uses: number;
  expires_at: string | null;
  active: boolean;
};

export type PaymentLink = {
  reference: string;
  title: string;
  amount_kobo: number;
  customer_name: string | null;
  customer_email: string | null;
  due_date: string | null;
  status: string;
  paid_at: string | null;
  reminders_sent: number;
  created_at: string;
};

const field =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[15px] text-white outline-none focus:border-[#ff8c14]";
const card = "rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:p-6";
const primary = "rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black disabled:opacity-60";
const pill = (on: boolean) =>
  `rounded-full px-2 py-0.5 text-[11px] font-semibold ${on ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-[#a1a1a6]"}`;

const ngn = (kobo: number) => String(kobo / 100);

/** Pay to appear first in the /shops directory with a "Sponsored" label. */
export function BoostPanel({ store, productCount, onChange }: { store: Storefront; productCount: number; onChange: () => void }) {
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const featuredUntil = store.featured_until ? new Date(store.featured_until) : null;
  const active = featuredUntil && featuredUntil > new Date();
  const ready = store.is_published && productCount > 0;

  // Back from Paystack (?boost=BST_…): confirm, then refresh the dashboard.
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("boost");
    if (!ref) return;
    let tries = 0;
    let stop = false;
    setConfirming(true);
    async function poll() {
      try {
        const data = await sellerApi<{ status: string }>(`/api/storefront/boost?ref=${encodeURIComponent(ref!)}`);
        if (stop) return;
        if (data.status === "paid") {
          setConfirming(false);
          window.history.replaceState(null, "", window.location.pathname);
          onChange();
          return;
        }
      } catch {
        /* retry */
      }
      if (!stop && ++tries < 12) setTimeout(poll, 3000);
      else setConfirming(false);
    }
    poll();
    return () => {
      stop = true;
    };
  }, [onChange]);

  async function buy(days: number) {
    setBusy(days);
    setError("");
    try {
      const data = await sellerApi<{ authorization_url: string }>("/api/storefront/boost", { method: "POST", body: JSON.stringify({ days }) });
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
      setBusy(null);
    }
  }

  return (
    <div className={`${card} ${active ? "border-[#ff8c14]/40" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[16px] font-semibold text-white">Get featured in the shop directory</p>
          <p className="mt-1 max-w-xl text-[13px] text-[#a1a1a6]">
            Sponsored shops appear first on{" "}
            <Link href="/shops" target="_blank" className="text-[#ff8c14] hover:underline">
              doyintech.com/shops
            </Link>{" "}
            and at the top of their category, in front of people already looking to buy.
          </p>
        </div>
        {active && <span className={pill(true)}>Featured until {featuredUntil!.toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>}
      </div>
      {confirming && <p className="mt-3 text-[13px] text-[#a1a1a6]">Confirming your payment…</p>}
      {!ready ? (
        <p className="mt-3 text-[13px] text-[#ff8c14]">Make your shop visible and add a product in stock to promote it.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-3">
          {BOOST_PLANS.map((p) => (
            <button key={p.days} type="button" disabled={busy !== null} onClick={() => buy(p.days)} className={p.days === 30 ? primary : "rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white disabled:opacity-60"}>
              {busy === p.days ? "Opening payment…" : `${active ? "Add" : "Feature for"} ${p.label} · ${formatKobo(p.amountKobo)}`}
            </button>
          ))}
        </div>
      )}
      {active && <p className="mt-2 text-[12px] text-[#86868b]">Buying more adds days on top of your current featured time.</p>}
      {error && <p className="mt-2 text-[13px] text-red-400">{error}</p>}
    </div>
  );
}

/** Delivery areas and their fees, chosen by customers at checkout. */
export function DeliveryPanel({ zones, onChange }: { zones: DeliveryZone[]; onChange: () => void }) {
  const [rows, setRows] = useState(zones.length ? zones.map((z) => ({ name: z.name, fee: ngn(z.fee_kobo) })) : []);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setBusy(true);
    setMsg("");
    try {
      const clean = rows
        .filter((r) => r.name.trim())
        .map((r) => ({ name: r.name.trim(), fee_kobo: Math.round((Number(r.fee.replace(/[^\d.]/g, "")) || 0) * 100) }));
      await sellerApi("/api/storefront/delivery", { method: "POST", body: JSON.stringify({ zones: clean }) });
      setMsg("Saved");
      onChange();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={card}>
      <p className="text-[16px] font-semibold text-white">Delivery areas</p>
      <p className="mt-1 text-[13px] text-[#a1a1a6]">
        Customers pick an area at checkout and the fee is added to their total. Leave empty to arrange delivery on WhatsApp.
      </p>
      <ul className="mt-4 space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              value={r.name}
              onChange={(e) => setRows((rs) => rs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
              placeholder="Area, e.g. Jos North"
              aria-label="Area name"
              className={`${field} mt-0 flex-1`}
            />
            <input
              value={r.fee}
              inputMode="decimal"
              onChange={(e) => setRows((rs) => rs.map((x, j) => (j === i ? { ...x, fee: e.target.value } : x)))}
              placeholder="Fee ₦ (0 = free)"
              aria-label="Delivery fee in naira"
              className={`${field} mt-0 w-36`}
            />
            <button
              type="button"
              onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
              className="px-2 text-[13px] text-red-400 underline"
              aria-label={`Remove ${r.name || "area"}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {rows.length < MAX_DELIVERY_ZONES && (
          <button
            type="button"
            onClick={() => setRows((rs) => [...rs, { name: "", fee: "" }])}
            className="rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white"
          >
            Add area
          </button>
        )}
        <button type="button" onClick={save} disabled={busy} className={primary}>
          {busy ? "Saving…" : "Save delivery areas"}
        </button>
        {msg && <span className="text-[13px] text-[#a1a1a6]">{msg}</span>}
      </div>
    </div>
  );
}

/** Discount codes (Store plan). */
export function DiscountsPanel({ discounts, paid, onChange }: { discounts: DiscountRow[]; paid: boolean; onChange: () => void }) {
  const [code, setCode] = useState("");
  const [kind, setKind] = useState<"percent" | "amount">("percent");
  const [value, setValue] = useState("");
  const [min, setMin] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expires, setExpires] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function create(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await sellerApi("/api/storefront/discounts", {
        method: "POST",
        body: JSON.stringify({
          code,
          ...(kind === "percent" ? { percent_off: Number(value) } : { amount_off_ngn: Number(value.replace(/[^\d.]/g, "")) }),
          min_subtotal_ngn: Number(min.replace(/[^\d.]/g, "")) || 0,
          max_uses: Number(maxUses) || undefined,
          expires_at: expires ? `${expires}T23:59:59` : undefined,
        }),
      });
      setCode("");
      setValue("");
      setMin("");
      setMaxUses("");
      setExpires("");
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the code");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(d: DiscountRow) {
    await sellerApi("/api/storefront/discounts", { method: "PATCH", body: JSON.stringify({ code: d.code, active: !d.active }) });
    onChange();
  }

  async function remove(d: DiscountRow) {
    if (!confirm(`Delete code ${d.code}?`)) return;
    await sellerApi(`/api/storefront/discounts?code=${encodeURIComponent(d.code)}`, { method: "DELETE" });
    onChange();
  }

  return (
    <div className={card}>
      <p className="text-[16px] font-semibold text-white">Discount codes</p>
      <p className="mt-1 text-[13px] text-[#a1a1a6]">Run a sale or reward loyal customers. Codes work for online payments and WhatsApp orders.</p>
      {!paid ? (
        <p className="mt-3 text-[13px] text-[#ff8c14]">Discount codes are part of the Store plan. Upgrade above to create them.</p>
      ) : (
        <form onSubmit={create} className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="block text-[13px] text-[#a1a1a6]">
            Code
            <input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} placeholder="SALE10" maxLength={20} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Type
            <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className={field}>
              <option value="percent">% off</option>
              <option value="amount">₦ off</option>
            </select>
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            {kind === "percent" ? "Percent (1–90)" : "Naira off"}
            <input required inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Minimum order ₦ (optional)
            <input inputMode="decimal" value={min} onChange={(e) => setMin(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Max uses (optional)
            <input inputMode="numeric" value={maxUses} onChange={(e) => setMaxUses(e.target.value.replace(/\D/g, ""))} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Ends on (optional)
            <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className={field} />
          </label>
          <div className="sm:col-span-3">
            <button type="submit" disabled={busy} className={primary}>
              {busy ? "Saving…" : "Create code"}
            </button>
            {error && <p className="mt-2 text-[13px] text-red-400">{error}</p>}
          </div>
        </form>
      )}
      {discounts.length > 0 && (
        <ul className="mt-5 divide-y divide-white/10">
          {discounts.map((d) => (
            <li key={d.code} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[14px]">
              <div>
                <p className="font-mono font-semibold text-white">
                  {d.code} <span className={pill(d.active)}>{d.active ? "On" : "Off"}</span>
                </p>
                <p className="text-[12px] text-[#a1a1a6]">
                  {d.percent_off ? `${d.percent_off}% off` : `${formatKobo(d.amount_off_kobo || 0)} off`}
                  {d.min_subtotal_kobo ? ` · orders over ${formatKobo(d.min_subtotal_kobo)}` : ""} · used {d.uses}
                  {d.max_uses ? `/${d.max_uses}` : ""}
                  {d.expires_at ? ` · ends ${new Date(d.expires_at).toLocaleDateString("en-NG")}` : ""}
                </p>
              </div>
              <div className="flex gap-3 text-[12px]">
                <button type="button" onClick={() => toggle(d)} className="text-[#a1a1a6] underline">
                  {d.active ? "Turn off" : "Turn on"}
                </button>
                <button type="button" onClick={() => remove(d)} className="text-red-400 underline">
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

/** "Pay now" links for invoices, with automatic email reminders. */
export function PaymentLinksPanel({
  links,
  paymentsActive,
  feePercent,
  onChange,
}: {
  links: PaymentLink[];
  paymentsActive: boolean;
  feePercent: number;
  onChange: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [due, setDue] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ url: string; emailed: boolean } | null>(null);
  const [copied, setCopied] = useState("");

  async function create(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await sellerApi<{ url: string; emailed: boolean }>("/api/storefront/requests", {
        method: "POST",
        body: JSON.stringify({
          title,
          amount_ngn: Number(amount.replace(/[^\d.]/g, "")),
          customer_name: customer,
          customer_email: email,
          due_date: due || undefined,
          description,
        }),
      });
      setCreated(data);
      setTitle("");
      setAmount("");
      setCustomer("");
      setEmail("");
      setDue("");
      setDescription("");
      setOpen(false);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the link");
    } finally {
      setBusy(false);
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  async function cancel(l: PaymentLink) {
    if (!confirm(`Cancel the payment link for ${l.title}?`)) return;
    await sellerApi(`/api/storefront/requests?ref=${encodeURIComponent(l.reference)}`, { method: "DELETE" });
    onChange();
  }

  const urlFor = (ref: string) => `${window.location.origin}/pay/${ref}`;

  return (
    <div className={card}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[16px] font-semibold text-white">Payment links</p>
        {paymentsActive && !open && (
          <button type="button" onClick={() => setOpen(true)} className={primary}>
            New payment link
          </button>
        )}
      </div>
      <p className="mt-1 text-[13px] text-[#a1a1a6]">
        Send a &ldquo;Pay now&rdquo; link with any invoice. Customers pay by card, transfer or USSD and the money settles to your bank.
        If you add their email, we send the link and remind them the day before, on, and 3 days after the due date.
        {feePercent > 0 && ` Free plan fee: ${feePercent}% per payment.`}
      </p>

      {!paymentsActive && (
        <p className="mt-3 text-[13px] text-[#ff8c14]">Connect your bank under Online payments first. Links work once your account is approved.</p>
      )}

      {created && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-[13px] text-emerald-100">
          <p className="font-semibold">Link ready{created.emailed ? " and emailed to your customer" : ""}.</p>
          <p className="mt-1 break-all font-mono text-[12px]">{created.url}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => copy(created.url)} className="rounded-full border border-white/20 px-4 py-2 font-semibold text-white">
              {copied === created.url ? "Copied ✓" : "Copy link"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Here's the payment link for your invoice: ${created.url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-4 py-2 font-semibold text-white"
            >
              Send on WhatsApp
            </a>
          </div>
        </div>
      )}

      {open && (
        <form onSubmit={create} className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:grid-cols-2">
          <label className="block text-[13px] text-[#a1a1a6]">
            What it&apos;s for
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Invoice INV-0042" className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Amount (₦)
            <input required inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="25000" className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Customer name (optional)
            <input value={customer} onChange={(e) => setCustomer(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Customer email (for the link and reminders)
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Due date (optional)
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Note (optional)
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Website design, 50% deposit" className={field} />
          </label>
          <div className="flex items-center gap-3 sm:col-span-2">
            <button type="submit" disabled={busy} className={primary}>
              {busy ? "Creating…" : email ? "Create and email link" : "Create link"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-[14px] text-[#a1a1a6] underline">
              Cancel
            </button>
          </div>
          {error && <p className="text-[13px] text-red-400 sm:col-span-2">{error}</p>}
        </form>
      )}

      {links.length > 0 && (
        <ul className="mt-5 divide-y divide-white/10">
          {links.map((l) => (
            <li key={l.reference} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[14px]">
              <div className="min-w-0">
                <p className="font-semibold text-white">
                  {l.title} · {formatKobo(l.amount_kobo)}{" "}
                  <span className={pill(l.status === "paid")}>{l.status === "open" ? "Unpaid" : l.status}</span>
                </p>
                <p className="text-[12px] text-[#a1a1a6]">
                  {l.customer_name || l.customer_email || "No customer details"}
                  {l.due_date ? ` · due ${new Date(`${l.due_date}T12:00:00Z`).toLocaleDateString("en-NG")}` : ""}
                  {l.reminders_sent ? ` · ${l.reminders_sent} reminder${l.reminders_sent > 1 ? "s" : ""} sent` : ""}
                  {l.paid_at ? ` · paid ${new Date(l.paid_at).toLocaleDateString("en-NG")}` : ""}
                </p>
              </div>
              {l.status === "open" && (
                <div className="flex gap-3 text-[12px]">
                  <button type="button" onClick={() => copy(urlFor(l.reference))} className="text-[#ff8c14] underline">
                    {copied === urlFor(l.reference) ? "Copied ✓" : "Copy link"}
                  </button>
                  <button type="button" onClick={() => cancel(l)} className="text-red-400 underline">
                    Cancel
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
