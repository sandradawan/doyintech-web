"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { BusinessProfile, Contact, Deal, DealStage, Invoice, OpsWorkspace, Quote, Task } from "@/lib/ops/types";
import { DEAL_STAGES } from "@/lib/ops/types";
import {
  emptyWorkspace, exportJson, formatNgn, invoiceReminderMessage, loadWorkspace,
  newContact, newDeal, newInvoice, newQuote, newTask, parseWorkspaceJson, pushActivity,
  quoteMessage, saveWorkspace, seedDemoWorkspace, todayIsoDate, whatsappHref,
} from "@/lib/ops/store";
import InvoicePrint from "@/components/ops/InvoicePrint";
import { normalizeWs, Panel, Empty, StatusPill } from "@/components/ops/OpsHelpers";
import CloudSync from "@/components/ops/CloudSync";
import OpsCharts from "@/components/ops/OpsCharts";
import OpsAgenda from "@/components/ops/OpsAgenda";
import OpsWeeklyReport from "@/components/ops/OpsWeeklyReport";

type Tab = "home" | "agenda" | "contacts" | "pipeline" | "quotes" | "invoices" | "tasks" | "settings";
const field = "w-full rounded-lg border border-white/10 bg-[#0c1220] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#ff8c14]/60";
const btnP = "rounded-lg bg-[#ff8c14] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-40";
const btnG = "rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/10";
const NAV: { id: Tab; label: string }[] = [
  { id: "home", label: "Overview" }, { id: "agenda", label: "Agenda" }, { id: "contacts", label: "Contacts" },
  { id: "pipeline", label: "Pipeline" }, { id: "quotes", label: "Quotes" },
  { id: "invoices", label: "Invoices" }, { id: "tasks", label: "Tasks" },
  { id: "settings", label: "Settings" },
];

export default function OpsDashboard() {
  const [ws, setWs] = useState<OpsWorkspace | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [q, setQ] = useState("");
  const [globalQ, setGlobalQ] = useState("");
  const [menu, setMenu] = useState(false);
  const [printInv, setPrintInv] = useState<Invoice | null>(null);
  const [payBusy, setPayBusy] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setWs(loadWorkspace()); }, []);
  useEffect(() => { if (ws) saveWorkspace(ws); }, [ws]);

  useEffect(() => {
    if (!ws) return;
    let cancelled = false;
    async function run() {
      const unpaid = (ws!.invoices || []).filter((i) => i.status !== "paid" && i.status !== "cancelled");
      if (!unpaid.length) return;
      let localPaid: string[] = [];
      try { localPaid = JSON.parse(localStorage.getItem("doyinops_paid_invoices") || "[]"); } catch { localPaid = []; }
      const toMark = new Set<string>();
      for (const inv of unpaid) if (localPaid.includes(inv.number)) toMark.add(inv.id);
      await Promise.all(unpaid.map(async (inv) => {
        const params = new URLSearchParams({ invoice: inv.number });
        if (inv.paymentRef) params.set("reference", inv.paymentRef);
        try {
          const res = await fetch(`/api/ops/payments/check?${params}`);
          const data = await res.json();
          if (data.paid) toMark.add(inv.id);
        } catch { /* */ }
      }));
      if (cancelled || !toMark.size) return;
      setWs((w) => {
        if (!w) return w;
        let next = { ...normalizeWs(w), invoices: w.invoices.map((i) => toMark.has(i.id) ? { ...i, status: "paid" as const, paidAt: i.paidAt || new Date().toISOString() } : i) };
        const names = w.invoices.filter((i) => toMark.has(i.id)).map((i) => i.number);
        if (names.length) next = pushActivity(next, `Auto-marked paid: ${names.join(", ")}`);
        return next;
      });
    }
    run();
    return () => { cancelled = true; };
  }, [ws?.invoices?.length]);

  const stats = useMemo(() => {
    if (!ws) return { contacts: 0, openDeals: 0, pipelineNgn: 0, unpaidNgn: 0, openTasks: 0 };
    const open = ws.deals.filter((d) => d.stage !== "paid" && d.stage !== "lost");
    const unpaid = ws.invoices.filter((i) => i.status === "sent" || i.status === "overdue");
    return {
      contacts: ws.contacts.length, openDeals: open.length,
      pipelineNgn: open.reduce((s, d) => s + (d.valueNgn || 0), 0),
      unpaidNgn: unpaid.reduce((s, i) => s + (i.amountNgn || 0), 0),
      openTasks: (ws.tasks || []).filter((t) => !t.done).length,
    };
  }, [ws]);

  const dueFollowUps = useMemo(() => {
    if (!ws) return [];
    const today = todayIsoDate();
    return ws.deals.filter((d) => d.nextFollowUp && d.nextFollowUp <= today && d.stage !== "paid" && d.stage !== "lost");
  }, [ws]);

  const globalHits = useMemo(() => {
    if (!ws || !globalQ.trim()) return [] as { type: string; id: string; title: string; sub: string; tab: Tab }[];
    const qq = globalQ.trim().toLowerCase();
    const hits: { type: string; id: string; title: string; sub: string; tab: Tab }[] = [];
    for (const c of ws.contacts) {
      const hay = [c.name, c.business, c.phone, c.email, c.notes].filter(Boolean).join(" ").toLowerCase();
      if (hay.includes(qq)) hits.push({ type: "Contact", id: c.id, title: c.name, sub: c.business || c.phone || c.email || "", tab: "contacts" });
    }
    for (const d of ws.deals) {
      if ((d.title + " " + d.stage).toLowerCase().includes(qq))
        hits.push({ type: "Deal", id: d.id, title: d.title, sub: d.stage + " · " + formatNgn(d.valueNgn), tab: "pipeline" });
    }
    for (const inv of ws.invoices) {
      if ((inv.number + " " + inv.description).toLowerCase().includes(qq))
        hits.push({ type: "Invoice", id: inv.id, title: inv.number, sub: formatNgn(inv.amountNgn) + " · " + inv.status, tab: "invoices" });
    }
    for (const qt of ws.quotes || []) {
      if ((qt.number + " " + qt.description).toLowerCase().includes(qq))
        hits.push({ type: "Quote", id: qt.id, title: qt.number, sub: formatNgn(qt.amountNgn), tab: "quotes" });
    }
    for (const task of ws.tasks || []) {
      if (task.title.toLowerCase().includes(qq))
        hits.push({ type: "Task", id: task.id, title: task.title, sub: task.done ? "Done" : "Open", tab: "tasks" });
    }
    return hits.slice(0, 12);
  }, [ws, globalQ]);

  if (!ws) return <div className="flex min-h-[50vh] items-center justify-center text-white/50">Loading workspace…</div>;

  const data: OpsWorkspace = { ...ws, profile: ws.profile || {}, tasks: ws.tasks || [], quotes: ws.quotes || [], activity: ws.activity || [] };
  const byId = (id: string) => data.contacts.find((c) => c.id === id);
  const nameOf = (id: string) => byId(id)?.name || "Unknown";
  const openTasks = data.tasks.filter((t) => !t.done);
  const contacts = !q.trim() ? data.contacts : data.contacts.filter((c) => [c.name, c.business, c.phone, c.email, c.notes].filter(Boolean).join(" ").toLowerCase().includes(q.trim().toLowerCase()));

  function go(t: Tab) { setTab(t); setMenu(false); }

  function onImport(file: File | null) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      const parsed = parseWorkspaceJson(String(r.result || ""));
      if (!parsed) return alert("Invalid backup file.");
      if (!confirm(`Restore "${parsed.orgName}"?`)) return;
      setWs(parsed);
    };
    r.readAsText(file);
  }

  async function createPayLink(inv: Invoice) {
    const c = byId(inv.contactId);
    let email = c?.email || "";
    if (!email) email = window.prompt("Client email for Paystack (required):", "") || "";
    email = email.trim().toLowerCase();
    if (!email.includes("@")) return alert("Valid client email required.");
    setPayBusy(inv.id);
    try {
      const res = await fetch("/api/ops/invoice-pay", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amountNgn: inv.amountNgn, invoiceNumber: inv.number, description: inv.description, customerName: c?.name || "" }),
      });
      const dataJson = await res.json();
      if (!res.ok || !dataJson.ok) return alert(dataJson.error || "Pay link failed. Check Paystack keys.");
      const url = dataJson.authorization_url as string;
      setWs((w) => {
        if (!w) return w;
        let next = { ...normalizeWs(w), invoices: w.invoices.map((i) => i.id === inv.id ? { ...i, paymentUrl: url, paymentRef: dataJson.reference } : i) };
        return pushActivity(next, `Pay link created for ${inv.number}`);
      });
      try { await navigator.clipboard.writeText(url); } catch { /* */ }
      window.open(url, "_blank", "noopener,noreferrer");
    } catch { alert("Network error."); }
    finally { setPayBusy(null); }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1400px]">
      {printInv && <InvoicePrint orgName={data.orgName} profile={data.profile} invoice={printInv} client={byId(printInv.contactId)} onClose={() => setPrintInv(null)} />}
      {menu && <button type="button" className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMenu(false)} aria-label="Close" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-white/[0.06] bg-[#0a0f1a] pt-12 transition-transform lg:static lg:translate-x-0 lg:pt-0 ${menu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff8c14] text-sm font-bold text-black">D</div>
          <div className="min-w-0"><p className="text-sm font-semibold text-white">DoyinOps</p><p className="truncate text-[11px] text-white/40">{data.orgName}</p></div>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {NAV.map((item) => (
            <button key={item.id} type="button" onClick={() => go(item.id)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] font-medium ${tab === item.id ? "bg-[#ff8c14]/15 text-[#ff8c14]" : "text-white/65 hover:bg-white/5"}`}>
              {item.label}
              {item.id === "tasks" && openTasks.length > 0 && <span className="rounded-full bg-[#ff8c14]/20 px-2 text-[10px] text-[#ff8c14]">{openTasks.length}</span>}
            </button>
          ))}
        </nav>
        <div className="space-y-2 border-t border-white/[0.06] p-3">
          <button type="button" onClick={() => setWs(seedDemoWorkspace())} className={`${btnG} w-full`}>Load demo</button>
          <Link href="/ops" className={`${btnG} block w-full text-center`}>About</Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-12 z-30 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#070b12]/95 px-4 py-3 backdrop-blur lg:top-0 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-lg border border-white/10 p-2 lg:hidden" onClick={() => setMenu(true)} aria-label="Menu">☰</button>
            <h1 className="text-lg font-semibold text-white">{NAV.find((n) => n.id === tab)?.label}</h1>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <div className="relative hidden max-w-xs flex-1 sm:block">
              <input
                value={globalQ}
                onChange={(e) => setGlobalQ(e.target.value)}
                placeholder="Search everything…"
                className="w-full rounded-lg border border-white/10 bg-[#0c1220] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#ff8c14]/60"
              />
              {globalQ.trim() && globalHits.length > 0 && (
                <ul className="absolute right-0 z-50 mt-1 max-h-72 w-80 overflow-y-auto rounded-xl border border-white/10 bg-[#0c1220] py-1 shadow-xl">
                  {globalHits.map((h) => (
                    <li key={h.type + h.id}>
                      <button
                        type="button"
                        className="flex w-full flex-col px-3 py-2 text-left hover:bg-white/5"
                        onClick={() => { setGlobalQ(""); go(h.tab); }}
                      >
                        <span className="text-[10px] uppercase text-[#ff8c14]/80">{h.type}</span>
                        <span className="text-sm text-white">{h.title}</span>
                        {h.sub && <span className="text-[11px] text-white/40">{h.sub}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => onImport(e.target.files?.[0] || null)} />
            <button type="button" onClick={() => fileRef.current?.click()} className={btnG}>Import</button>
            <button type="button" onClick={() => exportJson(data)} className={btnG}>Export</button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          {tab === "home" && (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {[["Contacts", String(stats.contacts), "Clients"], ["Open deals", String(stats.openDeals), "Active"], ["Pipeline", formatNgn(stats.pipelineNgn), "Value"], ["Unpaid", formatNgn(stats.unpaidNgn), "Due"], ["Tasks", String(stats.openTasks), "Open"]].map(([l, v, sub]) => (
                  <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-white/40">{l}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{v}</p>
                    <p className="mt-1 text-[11px] text-[#ff8c14]/80">{sub}</p>
                  </div>
                ))}
              </div>
              <OpsCharts ws={data} />
              <OpsWeeklyReport ws={data} />
              <div className="grid gap-4 lg:grid-cols-2">
                <Panel title="Follow-ups due" action={() => go("pipeline")} actionLabel="Pipeline">
                  {dueFollowUps.length === 0 ? <Empty>None overdue.</Empty> : (
                    <ul className="space-y-2">{dueFollowUps.map((d) => {
                      const c = byId(d.contactId);
                      const wa = whatsappHref(c?.phone, `Hi ${c?.name || "there"}, following up on ${d.title}.`);
                      return (
                        <li key={d.id} className="flex justify-between gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                          <div><p className="text-sm text-white">{d.title}</p><p className="text-[11px] text-white/45">{nameOf(d.contactId)} · {d.nextFollowUp}</p></div>
                          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="self-center rounded-md bg-[#25D366] px-2 py-1 text-[11px] font-semibold text-white">WA</a>}
                        </li>
                      );
                    })}</ul>
                  )}
                </Panel>
                <Panel title="Open tasks" action={() => go("tasks")} actionLabel="Tasks">
                  {openTasks.length === 0 ? <Empty>No open tasks.</Empty> : (
                    <ul className="space-y-2">{openTasks.slice(0, 6).map((t) => (
                      <li key={t.id} className="flex justify-between rounded-lg border border-white/[0.06] px-3 py-2">
                        <span className="text-sm text-white">{t.title}</span>
                        <button type="button" className="text-[11px] text-emerald-400" onClick={() => setWs((w) => w ? { ...normalizeWs(w), tasks: (w.tasks || []).map((x) => x.id === t.id ? { ...x, done: true } : x) } : w)}>Done</button>
                      </li>
                    ))}</ul>
                  )}
                </Panel>
              </div>
              <Panel title="Recent activity">
                {(data.activity || []).length === 0 ? <Empty>Actions appear here.</Empty> : (
                  <ul className="max-h-48 space-y-2 overflow-y-auto">{(data.activity || []).slice(0, 12).map((a) => (
                    <li key={a.id} className="border-b border-white/[0.04] pb-2 text-[12px] text-white/55">
                      <span className="text-white/80">{a.message}</span>
                      <span className="mt-0.5 block text-[10px] text-white/30">{a.createdAt.slice(0, 16).replace("T", " ")}</span>
                    </li>
                  ))}</ul>
                )}
              </Panel>
            </div>
          )}

          {tab === "agenda" && (
            <OpsAgenda
              ws={data}
              today={todayIsoDate()}
              onDoneTask={(taskId) =>
                setWs((w) =>
                  w
                    ? {
                        ...normalizeWs(w),
                        tasks: (w.tasks || []).map((x) =>
                          x.id === taskId ? { ...x, done: true } : x
                        ),
                      }
                    : w
                )
              }
            />
          )}

          {tab === "contacts" && (
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const c = newContact({ name: String(fd.get("name") || "").trim(), business: String(fd.get("business") || "").trim() || undefined, phone: String(fd.get("phone") || "").trim() || undefined, email: String(fd.get("email") || "").trim() || undefined, notes: String(fd.get("notes") || "").trim() || undefined });
                if (!c.name) return;
                setWs((w) => w ? { ...normalizeWs(w), contacts: [c, ...w.contacts] } : w);
                e.currentTarget.reset();
              }} className="h-fit space-y-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-5">
                <h2 className="text-sm font-semibold text-white">New contact</h2>
                <input name="name" required placeholder="Name *" className={field} />
                <input name="business" placeholder="Business" className={field} />
                <input name="phone" placeholder="Phone" className={field} />
                <input name="email" type="email" placeholder="Email" className={field} />
                <button type="submit" className={`${btnP} w-full`}>Save</button>
              </form>
              <div className="space-y-3">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className={field} />
                <div className="grid gap-3 sm:grid-cols-2">
                  {contacts.map((c: Contact) => {
                    const wa = whatsappHref(c.phone, `Hi ${c.name},`);
                    return (
                      <div key={c.id} className="rounded-xl border border-white/[0.06] bg-[#0c1220] p-4">
                        <p className="font-semibold text-white">{c.name}</p>
                        <p className="text-[12px] text-white/45">{[c.business, c.phone, c.email].filter(Boolean).join(" · ")}</p>
                        <div className="mt-2 flex gap-3">
                          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="text-xs text-[#25D366]">WhatsApp</a>}
                          <button type="button" className="text-xs text-red-400" onClick={() => setWs((w) => w ? { ...normalizeWs(w), contacts: w.contacts.filter((x) => x.id !== c.id) } : w)}>Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === "pipeline" && (
            <div className="space-y-6">
              <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const contactId = String(fd.get("contactId") || "");
                if (!contactId) return;
                const d = newDeal({ contactId, title: String(fd.get("title") || "").trim() || "New deal", stage: "lead", valueNgn: Number(fd.get("valueNgn") || 0) || 0, nextFollowUp: String(fd.get("nextFollowUp") || "") || undefined });
                setWs((w) => w ? { ...normalizeWs(w), deals: [d, ...w.deals] } : w);
                e.currentTarget.reset();
              }} className="grid gap-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-5 sm:grid-cols-4">
                <select name="contactId" required className={field} defaultValue=""><option value="" disabled>Contact *</option>{data.contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <input name="title" placeholder="Title" className={field} />
                <input name="valueNgn" type="number" placeholder="NGN" className={field} />
                <input name="nextFollowUp" type="date" className={field} />
                <button type="submit" disabled={!data.contacts.length} className={`${btnP} sm:col-span-4`}>Add deal</button>
              </form>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {DEAL_STAGES.filter((s) => s.id !== "lost").map((stage) => {
                  const list = data.deals.filter((d) => d.stage === stage.id);
                  return (
                    <div key={stage.id} className="w-[240px] shrink-0 rounded-xl border border-white/[0.06] bg-[#0c1220]">
                      <p className="border-b border-white/[0.06] px-3 py-2 text-[11px] font-semibold uppercase text-[#ff8c14]">{stage.label} ({list.length})</p>
                      <ul className="max-h-[420px] space-y-2 overflow-y-auto p-2">
                        {list.map((d: Deal) => (
                          <li key={d.id} className="rounded-lg border border-white/[0.06] bg-[#070b12] p-3">
                            <p className="text-sm text-white">{d.title}</p>
                            <p className="text-[11px] text-white/45">{nameOf(d.contactId)} · {formatNgn(d.valueNgn)}</p>
                            <select value={d.stage} onChange={(e) => setWs((w) => w ? { ...normalizeWs(w), deals: w.deals.map((x) => x.id === d.id ? { ...x, stage: e.target.value as DealStage, updatedAt: new Date().toISOString() } : x) } : w)} className="mt-2 w-full rounded border border-white/10 bg-[#0c1220] px-2 py-1 text-xs text-white">
                              {DEAL_STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "quotes" && (
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const contactId = String(fd.get("contactId") || "");
                if (!contactId) return;
                const qt = newQuote({ contactId, amountNgn: Number(fd.get("amountNgn") || 0) || 0, description: String(fd.get("description") || "").trim() || "Project quote", status: "sent", validUntil: String(fd.get("validUntil") || todayIsoDate()) }, (data.quotes || []).length + 1);
                setWs((w) => { if (!w) return w; return pushActivity({ ...normalizeWs(w), quotes: [qt, ...(w.quotes || [])] }, `Quote ${qt.number} created`); });
                e.currentTarget.reset();
              }} className="h-fit space-y-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-5">
                <h2 className="text-sm font-semibold text-white">New quote</h2>
                <select name="contactId" required className={field} defaultValue=""><option value="" disabled>Client *</option>{data.contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <input name="amountNgn" type="number" required placeholder="Amount" className={field} />
                <input name="description" placeholder="Scope" className={field} />
                <input name="validUntil" type="date" className={field} />
                <button type="submit" disabled={!data.contacts.length} className={`${btnP} w-full`}>Create</button>
              </form>
              <div className="space-y-3">
                {(data.quotes || []).map((qt: Quote) => {
                  const c = byId(qt.contactId);
                  const wa = whatsappHref(c?.phone, quoteMessage(data.orgName, qt, c?.name || "there"));
                  return (
                    <div key={qt.id} className="flex flex-wrap justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-4">
                      <div>
                        <p className="font-semibold text-white">{qt.number} <StatusPill status={qt.status} /></p>
                        <p className="text-[13px] text-white/50">{nameOf(qt.contactId)} · {formatNgn(qt.amountNgn)}</p>
                        <p className="text-[13px] text-white/70">{qt.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {wa && qt.status !== "converted" && <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#25D366] px-3 py-2 text-xs font-semibold text-white">Send WA</a>}
                        {qt.status !== "converted" && (
                          <button type="button" className={btnG} onClick={() => setWs((w) => {
                            if (!w) return w;
                            const inv = newInvoice({ contactId: qt.contactId, amountNgn: qt.amountNgn, status: "sent", description: qt.description, dueDate: todayIsoDate() }, w.invoices.length + 1);
                            return pushActivity({ ...normalizeWs(w), quotes: (w.quotes || []).map((q) => q.id === qt.id ? { ...q, status: "converted" as const } : q), invoices: [inv, ...w.invoices] }, `Quote ${qt.number} → ${inv.number}`);
                          })}>To invoice</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "invoices" && (
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const contactId = String(fd.get("contactId") || "");
                if (!contactId) return;
                const inv = newInvoice({ contactId, amountNgn: Number(fd.get("amountNgn") || 0) || 0, status: "sent", description: String(fd.get("description") || "").trim() || "Services", dueDate: String(fd.get("dueDate") || todayIsoDate()) }, data.invoices.length + 1);
                setWs((w) => w ? pushActivity({ ...normalizeWs(w), invoices: [inv, ...w.invoices] }, `Invoice ${inv.number} created`) : w);
                e.currentTarget.reset();
              }} className="h-fit space-y-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-5">
                <h2 className="text-sm font-semibold text-white">New invoice</h2>
                <select name="contactId" required className={field} defaultValue=""><option value="" disabled>Client *</option>{data.contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <input name="amountNgn" type="number" required placeholder="Amount" className={field} />
                <input name="description" placeholder="Description" className={field} />
                <input name="dueDate" type="date" className={field} />
                <button type="submit" disabled={!data.contacts.length} className={`${btnP} w-full`}>Create</button>
              </form>
              <div className="space-y-3">
                {data.invoices.map((inv: Invoice) => {
                  const c = byId(inv.contactId);
                  const remindBody = invoiceReminderMessage(data.orgName, inv, c?.name || "there") + (inv.paymentUrl ? `\n\nPay online: ${inv.paymentUrl}` : "");
                  const wa = whatsappHref(c?.phone, remindBody);
                  return (
                    <div key={inv.id} className="flex flex-wrap justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-4">
                      <div>
                        <p className="font-semibold text-white">{inv.number} <StatusPill status={inv.status} /></p>
                        <p className="text-[13px] text-white/50">{nameOf(inv.contactId)} · {formatNgn(inv.amountNgn)}</p>
                        <p className="text-[13px] text-white/70">{inv.description}</p>
                        {inv.paymentUrl && inv.status !== "paid" && <a href={inv.paymentUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-[11px] text-[#ff8c14] underline">Open pay link</a>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => setPrintInv(inv)} className={btnG}>Print</button>
                        {inv.status !== "paid" && <button type="button" disabled={payBusy === inv.id} onClick={() => createPayLink(inv)} className="rounded-lg bg-[#0a5cbf] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{payBusy === inv.id ? "…" : "Pay link"}</button>}
                        {inv.status !== "paid" && <button type="button" className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-400" onClick={() => setWs((w) => w ? { ...normalizeWs(w), invoices: w.invoices.map((i) => i.id === inv.id ? { ...i, status: "paid" as const, paidAt: new Date().toISOString() } : i) } : w)}>Paid</button>}
                        {wa && inv.status !== "paid" && <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#25D366] px-3 py-2 text-xs font-semibold text-white">Remind</a>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "tasks" && (
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const title = String(fd.get("title") || "").trim();
                if (!title) return;
                const t = newTask({ title, dueDate: String(fd.get("dueDate") || "") || undefined, contactId: String(fd.get("contactId") || "") || undefined });
                setWs((w) => w ? { ...normalizeWs(w), tasks: [t, ...(w.tasks || [])] } : w);
                e.currentTarget.reset();
              }} className="h-fit space-y-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-5">
                <h2 className="text-sm font-semibold text-white">New task</h2>
                <input name="title" required placeholder="Task *" className={field} />
                <input name="dueDate" type="date" className={field} />
                <select name="contactId" className={field} defaultValue=""><option value="">Contact</option>{data.contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <button type="submit" className={`${btnP} w-full`}>Add</button>
              </form>
              <ul className="space-y-2">
                {data.tasks.map((t: Task) => (
                  <li key={t.id} className={`flex justify-between rounded-xl border border-white/[0.06] px-4 py-3 ${t.done ? "opacity-50" : "bg-[#0c1220]"}`}>
                    <label className="flex gap-3 text-sm text-white">
                      <input type="checkbox" checked={t.done} onChange={() => setWs((w) => w ? { ...normalizeWs(w), tasks: (w.tasks || []).map((x) => x.id === t.id ? { ...x, done: !x.done } : x) } : w)} />
                      <span className={t.done ? "line-through" : ""}>{t.title}</span>
                    </label>
                    <button type="button" className="text-xs text-red-400" onClick={() => setWs((w) => w ? { ...normalizeWs(w), tasks: (w.tasks || []).filter((x) => x.id !== t.id) } : w)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "settings" && (
            <div className="mx-auto max-w-lg space-y-6">
              <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const profile: BusinessProfile = {
                  legalName: String(fd.get("legalName") || "").trim() || undefined,
                  email: String(fd.get("email") || "").trim() || undefined,
                  phone: String(fd.get("phone") || "").trim() || undefined,
                  address: String(fd.get("address") || "").trim() || undefined,
                  city: String(fd.get("city") || "").trim() || undefined,
                  website: String(fd.get("website") || "").trim() || undefined,
                  bankNote: String(fd.get("bankNote") || "").trim() || undefined,
                };
                const orgName = String(fd.get("orgName") || "").trim() || data.orgName;
                setWs((w) => w ? { ...normalizeWs(w), orgName, profile } : w);
              }} className="space-y-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-6">
                <h2 className="text-sm font-semibold text-white">Business profile</h2>
                <input name="orgName" defaultValue={data.orgName} placeholder="Workspace name" className={field} />
                <input name="legalName" defaultValue={data.profile.legalName || ""} placeholder="Legal name" className={field} />
                <input name="email" defaultValue={data.profile.email || ""} placeholder="Email" className={field} />
                <input name="phone" defaultValue={data.profile.phone || ""} placeholder="Phone" className={field} />
                <input name="address" defaultValue={data.profile.address || ""} placeholder="Address" className={field} />
                <input name="city" defaultValue={data.profile.city || ""} placeholder="City" className={field} />
                <textarea name="bankNote" defaultValue={data.profile.bankNote || ""} rows={2} placeholder="Bank note" className={field} />
                <button type="submit" className={btnP}>Save profile</button>
              </form>
              <CloudSync workspace={data} onPull={(pulled) => setWs(pulled)} />
              <button type="button" className="rounded-lg border border-red-500/40 px-4 py-2 text-xs text-red-300" onClick={() => { if (confirm("Reset workspace?")) setWs(emptyWorkspace(data.orgName)); }}>Reset workspace</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
