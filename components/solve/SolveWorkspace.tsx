"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const WA = "2348085343926";
const wa = (t: string) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
type Tab = "pipeline" | "booking" | "quote" | "sop" | "cash" | "reviews" | "package" | "receivables";
const TABS: { id: Tab; label: string }[] = [
  { id: "pipeline", label: "Pipeline" },
  { id: "booking", label: "Booking" },
  { id: "quote", label: "Quote" },
  { id: "sop", label: "SOPs" },
  { id: "cash", label: "Cash" },
  { id: "reviews", label: "Reviews" },
  { id: "package", label: "Package" },
  { id: "receivables", label: "Receivables" },
];

function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch { /* ignore */ }
  }, [key]);
  const save = useCallback((next: T | ((p: T) => T)) => {
    setValue((prev) => {
      const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
      return v;
    });
  }, [key]);
  return [value, save] as const;
}

const field = "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none";
const btn = "inline-flex items-center justify-center rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black";
const btnWa = "inline-flex items-center justify-center rounded-full border border-[#25D366]/50 bg-[#25D366]/15 px-4 py-2.5 text-[13px] font-semibold text-[#25D366]";

const SOPS = [
  { t: "Open day", s: ["Unread WhatsApp + missed calls", "Confirm bookings", "Cash float", "Reply enquiries <30m"] },
  { t: "After quote", s: ["Log as Quoted", "Follow up 24h", "Day-3 value follow-up", "Deposit before hold"] },
  { t: "Before delivery", s: ["Balance / COD rules", "Pack checklist", "On-the-way message", "Ask for review"] },
  { t: "Close day", s: ["Cash vs log", "List receivables", "Top 5 follow-ups tomorrow", "Lock devices"] },
];

export default function SolveWorkspace() {
  const [tab, setTab] = useState<Tab>("pipeline");
  const [leads, setLeads] = useLocal<{ id: string; name: string; phone: string; note: string; stage: string }[]>("dt-solve-leads", []);
  const [books, setBooks] = useLocal<{ id: string; client: string; service: string; when: string; deposit: string; status: string }[]>("dt-solve-book", []);
  const [cash, setCash] = useLocal<{ id: string; type: "in" | "out"; amount: number; channel: string; note: string }[]>("dt-solve-cash", []);
  const [reviews, setReviews] = useLocal<{ id: string; name: string; text: string; stars: number }[]>("dt-solve-rev", []);
  const [debts, setDebts] = useLocal<{ id: string; who: string; amount: number; due: string; note: string; paid: boolean }[]>("dt-solve-debt", []);
  const [lf, setLf] = useState({ name: "", phone: "", note: "" });
  const [bf, setBf] = useState({ client: "", service: "", when: "", deposit: "" });
  const [qf, setQf] = useState({ service: "website", size: "small", urgency: "normal", extras: false });
  const [cf, setCf] = useState({ type: "in" as "in" | "out", amount: "", channel: "cash", note: "" });
  const [rf, setRf] = useState({ name: "", text: "", stars: 5 });
  const [df, setDf] = useState({ who: "", amount: "", due: "", note: "" });
  const [pf, setPf] = useState({ pages: "1", bookings: "no", budget: "100k" });
  const nid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const net = useMemo(() => cash.reduce((s, r) => s + (r.type === "in" ? r.amount : -r.amount), 0), [cash]);
  const quote = useMemo(() => {
    let base = 100000;
    if (qf.service === "website") base = qf.size === "small" ? 100000 : qf.size === "medium" ? 250000 : 450000;
    else if (qf.service === "whatsapp-system") base = qf.size === "small" ? 80000 : 180000;
    else if (qf.service === "booking") base = 150000;
    else base = 50000;
    if (qf.urgency === "rush") base = Math.round(base * 1.25);
    if (qf.extras) base += 50000;
    return { total: base, deposit: Math.round(base * 0.5) };
  }, [qf]);
  const pkg = useMemo(() => {
    if (pf.budget === "100k" || pf.pages === "1") return { name: "Landing Page Starter", price: "₦100,000", dep: "₦50,000" };
    if (pf.bookings === "yes" || pf.budget === "450k") return { name: "Growth Website", price: "₦450,000", dep: "₦225,000" };
    return { name: "Local Business Website", price: "₦250,000", dep: "₦125,000" };
  }, [pf]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${tab === t.id ? "bg-[#ff8c14] text-black" : "border border-white/15 text-[#a1a1a6]"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-[12px] text-[#86868b]">Saved in this browser. Need Paystack on your domain? <a href="/hire" className="text-[#ff8c14] hover:underline">Hire us</a>.</p>

      {tab === "pipeline" && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <h2 className="text-lg font-semibold text-white">Lead pipeline</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            <input className={field} placeholder="Name" value={lf.name} onChange={(e) => setLf({ ...lf, name: e.target.value })} />
            <input className={field} placeholder="Phone" value={lf.phone} onChange={(e) => setLf({ ...lf, phone: e.target.value })} />
            <input className={field} placeholder="Note" value={lf.note} onChange={(e) => setLf({ ...lf, note: e.target.value })} />
          </div>
          <button type="button" className={btn} onClick={() => {
            if (!lf.name.trim()) return;
            setLeads((p) => [{ id: nid(), name: lf.name.trim(), phone: lf.phone.trim(), note: lf.note.trim(), stage: "new" }, ...p]);
            setLf({ name: "", phone: "", note: "" });
          }}>Add lead</button>
          {leads.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
              <div><p className="text-white">{l.name}</p><p className="text-xs text-[#a1a1a6]">{l.phone || "—"} · {l.note || "—"}</p></div>
              <div className="flex flex-wrap gap-2">
                <select className={field + " !w-auto"} value={l.stage} onChange={(e) => setLeads((p) => p.map((x) => x.id === l.id ? { ...x, stage: e.target.value } : x))}>
                  <option value="new">New</option><option value="quoted">Quoted</option><option value="won">Won</option><option value="lost">Lost</option>
                </select>
                {l.phone && <a className={btnWa} href={wa(`Hi ${l.name}, following up on: ${l.note || "your enquiry"}.`)} target="_blank" rel="noreferrer">WhatsApp</a>}
                <button type="button" className="text-xs text-red-400" onClick={() => setLeads((p) => p.filter((x) => x.id !== l.id))}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "booking" && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <h2 className="text-lg font-semibold text-white">Booking + deposit</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={field} placeholder="Client" value={bf.client} onChange={(e) => setBf({ ...bf, client: e.target.value })} />
            <input className={field} placeholder="Service" value={bf.service} onChange={(e) => setBf({ ...bf, service: e.target.value })} />
            <input className={field} placeholder="When" value={bf.when} onChange={(e) => setBf({ ...bf, when: e.target.value })} />
            <input className={field} placeholder="Deposit ₦" value={bf.deposit} onChange={(e) => setBf({ ...bf, deposit: e.target.value })} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn} onClick={() => {
              if (!bf.client.trim()) return;
              setBooks((p) => [{ id: nid(), client: bf.client.trim(), service: bf.service.trim(), when: bf.when.trim(), deposit: bf.deposit.trim(), status: "pending" }, ...p]);
            }}>Save</button>
            <a className={btnWa} href={wa(`Hi ${bf.client || "there"}, to confirm ${bf.service || "your booking"} on ${bf.when || "the date"}, please pay deposit ₦${bf.deposit || "____"}. Slot held after payment.`)} target="_blank" rel="noreferrer">Deposit request WA</a>
          </div>
          {books.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 p-3 text-sm text-white">
              <span>{b.client} · {b.service} · {b.when} · ₦{b.deposit}</span>
              <select className={field + " !w-auto"} value={b.status} onChange={(e) => setBooks((p) => p.map((x) => x.id === b.id ? { ...x, status: e.target.value } : x))}>
                <option value="pending">Pending</option><option value="paid">Paid</option><option value="done">Done</option>
              </select>
            </div>
          ))}
          <a href="/hire" className="text-sm text-[#ff8c14] hover:underline">Install Paystack booking on my site →</a>
        </div>
      )}

      {tab === "quote" && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <h2 className="text-lg font-semibold text-white">Quote builder</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <select className={field} value={qf.service} onChange={(e) => setQf({ ...qf, service: e.target.value })}>
              <option value="website">Website</option><option value="whatsapp-system">WhatsApp system</option>
              <option value="booking">Booking setup</option><option value="ops">Ops setup</option>
            </select>
            <select className={field} value={qf.size} onChange={(e) => setQf({ ...qf, size: e.target.value })}>
              <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
            </select>
            <select className={field} value={qf.urgency} onChange={(e) => setQf({ ...qf, urgency: e.target.value })}>
              <option value="normal">Normal</option><option value="rush">Rush +25%</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-[#a1a1a6]">
              <input type="checkbox" checked={qf.extras} onChange={(e) => setQf({ ...qf, extras: e.target.checked })} /> Extras +₦50k
            </label>
          </div>
          <div className="rounded-xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-4">
            <p className="text-2xl font-semibold text-white">₦{quote.total.toLocaleString()}</p>
            <p className="text-sm text-[#a1a1a6]">Deposit ₦{quote.deposit.toLocaleString()}</p>
          </div>
          <a className={btnWa} href={wa(`Quote estimate:\n${qf.service} / ${qf.size} / ${qf.urgency}\nTotal ~ ₦${quote.total.toLocaleString()}\nDeposit ~ ₦${quote.deposit.toLocaleString()}`)} target="_blank" rel="noreferrer">Send on WhatsApp</a>
        </div>
      )}

      {tab === "sop" && (
        <div className="grid gap-3 md:grid-cols-2">
          {SOPS.map((s) => (
            <div key={s.t} className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
              <h3 className="font-semibold text-white">{s.t}</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[#c7cdd8]">{s.s.map((x) => <li key={x}>{x}</li>)}</ol>
            </div>
          ))}
          <a className={btnWa} href={wa("Hi DoyinTech, I want custom SOPs for my team.")} target="_blank" rel="noreferrer">Custom SOPs</a>
        </div>
      )}

      {tab === "cash" && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <div className="flex justify-between"><h2 className="text-lg font-semibold text-white">Cash log</h2><p className="text-xl font-semibold text-[#ff8c14]">₦{net.toLocaleString()}</p></div>
          <div className="grid gap-2 sm:grid-cols-4">
            <select className={field} value={cf.type} onChange={(e) => setCf({ ...cf, type: e.target.value as "in" | "out" })}>
              <option value="in">In</option><option value="out">Out</option>
            </select>
            <input className={field} placeholder="Amount" value={cf.amount} onChange={(e) => setCf({ ...cf, amount: e.target.value })} />
            <select className={field} value={cf.channel} onChange={(e) => setCf({ ...cf, channel: e.target.value })}>
              <option value="cash">Cash</option><option value="transfer">Transfer</option><option value="pos">POS</option>
            </select>
            <input className={field} placeholder="Note" value={cf.note} onChange={(e) => setCf({ ...cf, note: e.target.value })} />
          </div>
          <button type="button" className={btn} onClick={() => {
            const amount = Number(cf.amount); if (!amount) return;
            setCash((p) => [{ id: nid(), type: cf.type, amount, channel: cf.channel, note: cf.note.trim() }, ...p]);
            setCf({ ...cf, amount: "", note: "" });
          }}>Log</button>
          <ul className="max-h-48 space-y-1 overflow-y-auto text-sm text-[#a1a1a6]">
            {cash.map((r) => (
              <li key={r.id} className="flex justify-between">
                <span>{r.type === "in" ? "+" : "−"}₦{r.amount.toLocaleString()} · {r.channel} {r.note}</span>
                <button type="button" className="text-red-400" onClick={() => setCash((p) => p.filter((x) => x.id !== r.id))}>×</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "reviews" && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <h2 className="text-lg font-semibold text-white">Review wall</h2>
          <a className={btnWa} href={wa("Hi! If you were happy with our work, please reply with a short 1–2 sentence review. Thank you!")} target="_blank" rel="noreferrer">Send review request</a>
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={field} placeholder="Name" value={rf.name} onChange={(e) => setRf({ ...rf, name: e.target.value })} />
            <select className={field} value={rf.stars} onChange={(e) => setRf({ ...rf, stars: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
            </select>
            <textarea className={field + " min-h-[72px] sm:col-span-2"} placeholder="Review" value={rf.text} onChange={(e) => setRf({ ...rf, text: e.target.value })} />
          </div>
          <button type="button" className={btn} onClick={() => {
            if (!rf.text.trim()) return;
            setReviews((p) => [{ id: nid(), name: rf.name.trim() || "Customer", text: rf.text.trim(), stars: rf.stars }, ...p]);
            setRf({ name: "", text: "", stars: 5 });
          }}>Add to wall</button>
          <div className="grid gap-2 md:grid-cols-2">
            {reviews.map((r) => (
              <figure key={r.id} className="rounded-xl border border-white/10 p-3">
                <p className="text-[#ff8c14]">{"★".repeat(r.stars)}</p>
                <blockquote className="mt-1 text-sm text-[#e8eaed]">“{r.text}”</blockquote>
                <figcaption className="mt-1 text-xs text-[#86868b]">{r.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {tab === "package" && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <h2 className="text-lg font-semibold text-white">Package finder</h2>
          <select className={field} value={pf.pages} onChange={(e) => setPf({ ...pf, pages: e.target.value })}>
            <option value="1">One landing page</option><option value="few">A few pages</option><option value="many">Many / growth</option>
          </select>
          <select className={field} value={pf.bookings} onChange={(e) => setPf({ ...pf, bookings: e.target.value })}>
            <option value="no">No booking needed yet</option><option value="yes">Need booking / deposit</option>
          </select>
          <select className={field} value={pf.budget} onChange={(e) => setPf({ ...pf, budget: e.target.value })}>
            <option value="100k">~₦100k</option><option value="250k">~₦250k</option><option value="450k">~₦450k+</option>
          </select>
          <div className="rounded-xl border border-[#ff8c14]/40 bg-[#ff8c14]/10 p-4">
            <p className="text-xl font-semibold text-white">{pkg.name}</p>
            <p className="text-[#f5f5f7]">{pkg.price} · deposit {pkg.dep}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="/hire" className={btn}>Pay deposit</a>
              <a className={btnWa} href={wa(`Hi DoyinTech, package finder suggested ${pkg.name} (${pkg.price}). I want to book.`)} target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          </div>
        </div>
      )}

      {tab === "receivables" && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <h2 className="text-lg font-semibold text-white">Receivables</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={field} placeholder="Who" value={df.who} onChange={(e) => setDf({ ...df, who: e.target.value })} />
            <input className={field} placeholder="Amount" value={df.amount} onChange={(e) => setDf({ ...df, amount: e.target.value })} />
            <input className={field} placeholder="Due" value={df.due} onChange={(e) => setDf({ ...df, due: e.target.value })} />
            <input className={field} placeholder="Note" value={df.note} onChange={(e) => setDf({ ...df, note: e.target.value })} />
          </div>
          <button type="button" className={btn} onClick={() => {
            const amount = Number(df.amount);
            if (!df.who.trim() || !amount) return;
            setDebts((p) => [{ id: nid(), who: df.who.trim(), amount, due: df.due.trim(), note: df.note.trim(), paid: false }, ...p]);
            setDf({ who: "", amount: "", due: "", note: "" });
          }}>Add</button>
          {debts.map((d) => (
            <div key={d.id} className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${d.paid ? "opacity-50" : "border-white/10"}`}>
              <div className="text-sm text-white">{d.who} · ₦{d.amount.toLocaleString()} · due {d.due || "—"}</div>
              <div className="flex gap-2">
                <a className={btnWa} href={wa(`Hi ${d.who}, friendly reminder: ₦${d.amount.toLocaleString()} is due${d.due ? ` by ${d.due}` : ""}. Thank you.`)} target="_blank" rel="noreferrer">Remind</a>
                <button type="button" className="text-xs text-[#25D366]" onClick={() => setDebts((p) => p.map((x) => x.id === d.id ? { ...x, paid: !x.paid } : x))}>{d.paid ? "Undo" : "Paid"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
