"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type {
  BusinessProfile,
  Contact,
  Deal,
  DealStage,
  Invoice,
  OpsWorkspace,
  Task,
} from "@/lib/ops/types";
import { DEAL_STAGES } from "@/lib/ops/types";
import {
  emptyWorkspace,
  exportJson,
  formatNgn,
  invoiceReminderMessage,
  loadWorkspace,
  newContact,
  newDeal,
  newInvoice,
  newTask,
  parseWorkspaceJson,
  saveWorkspace,
  seedDemoWorkspace,
  todayIsoDate,
  whatsappHref,
} from "@/lib/ops/store";
import InvoicePrint from "@/components/ops/InvoicePrint";

type Tab =
  | "home"
  | "contacts"
  | "pipeline"
  | "invoices"
  | "tasks"
  | "settings";

const field =
  "w-full rounded-lg border border-white/10 bg-[#0c1220] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#ff8c14]/60 focus:ring-1 focus:ring-[#ff8c14]/30";

const btnPrimary =
  "inline-flex items-center justify-center rounded-lg bg-[#ff8c14] px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-40";
const btnGhost =
  "inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10";

const NAV: { id: Tab; label: string; hint: string }[] = [
  { id: "home", label: "Overview", hint: "KPIs & follow-ups" },
  { id: "contacts", label: "Contacts", hint: "Clients & leads" },
  { id: "pipeline", label: "Pipeline", hint: "Deals by stage" },
  { id: "invoices", label: "Invoices", hint: "Billing & PDF" },
  { id: "tasks", label: "Tasks", hint: "Daily to-dos" },
  { id: "settings", label: "Settings", hint: "Business profile" },
];

export default function OpsApp() {
  const [ws, setWs] = useState<OpsWorkspace | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [q, setQ] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [printInv, setPrintInv] = useState<Invoice | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWs(loadWorkspace());
  }, []);

  useEffect(() => {
    if (ws) saveWorkspace(ws);
  }, [ws]);

  const stats = useMemo(() => {
    if (!ws) return { contacts: 0, openDeals: 0, pipelineNgn: 0, unpaidNgn: 0, openTasks: 0 };
    const open = ws.deals.filter((d) => d.stage !== "paid" && d.stage !== "lost");
    const unpaid = ws.invoices.filter((i) => i.status === "sent" || i.status === "overdue");
    return {
      contacts: ws.contacts.length,
      openDeals: open.length,
      pipelineNgn: open.reduce((s, d) => s + (d.valueNgn || 0), 0),
      unpaidNgn: unpaid.reduce((s, i) => s + (i.amountNgn || 0), 0),
      openTasks: (ws.tasks || []).filter((t) => !t.done).length,
    };
  }, [ws]);

  const dueFollowUps = useMemo(() => {
    if (!ws) return [];
    const today = todayIsoDate();
    return ws.deals
      .filter(
        (d) =>
          d.nextFollowUp &&
          d.nextFollowUp <= today &&
          d.stage !== "paid" &&
          d.stage !== "lost"
      )
      .sort((a, b) => (a.nextFollowUp || "").localeCompare(b.nextFollowUp || ""));
  }, [ws]);

  const filteredContacts = useMemo(() => {
    if (!ws) return [];
    const s = q.trim().toLowerCase();
    if (!s) return ws.contacts;
    return ws.contacts.filter((c) =>
      [c.name, c.business, c.phone, c.email, c.notes]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [ws, q]);

  if (!ws) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-white/50">
        Loading workspace…
      </div>
    );
  }

  const data: OpsWorkspace = {
    ...ws,
    profile: ws.profile || {},
    tasks: Array.isArray(ws.tasks) ? ws.tasks : [],
  };

  function contactById(id: string) {
    return data.contacts.find((c) => c.id === id);
  }
  function contactName(id: string) {
    return contactById(id)?.name || "Unknown";
  }

  function patch(partial: Partial<OpsWorkspace>) {
    setWs((w) => (w ? { ...w, ...partial, profile: partial.profile ?? w.profile ?? {}, tasks: partial.tasks ?? w.tasks ?? [] } : w));
  }

  function addContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const c = newContact({
      name: String(fd.get("name") || "").trim(),
      business: String(fd.get("business") || "").trim() || undefined,
      phone: String(fd.get("phone") || "").trim() || undefined,
      email: String(fd.get("email") || "").trim() || undefined,
      notes: String(fd.get("notes") || "").trim() || undefined,
    });
    if (!c.name) return;
    setWs((w) => (w ? { ...normalizeWs(w), contacts: [c, ...w.contacts] } : w));
    e.currentTarget.reset();
  }

  function addDeal(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const contactId = String(fd.get("contactId") || "");
    if (!contactId) return;
    const d = newDeal({
      contactId,
      title: String(fd.get("title") || "").trim() || "New deal",
      stage: "lead",
      valueNgn: Number(fd.get("valueNgn") || 0) || 0,
      notes: String(fd.get("notes") || "").trim() || undefined,
      nextFollowUp: String(fd.get("nextFollowUp") || "") || undefined,
    });
    setWs((w) => (w ? { ...normalizeWs(w), deals: [d, ...w.deals] } : w));
    e.currentTarget.reset();
  }

  function setStage(id: string, stage: DealStage) {
    setWs((w) =>
      w
        ? {
            ...normalizeWs(w),
            deals: w.deals.map((d) =>
              d.id === id ? { ...d, stage, updatedAt: new Date().toISOString() } : d
            ),
          }
        : w
    );
  }

  function addInvoice(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const contactId = String(fd.get("contactId") || "");
    if (!contactId) return;
    const inv = newInvoice(
      {
        contactId,
        amountNgn: Number(fd.get("amountNgn") || 0) || 0,
        status: "sent",
        description: String(fd.get("description") || "").trim() || "Services",
        dueDate: String(fd.get("dueDate") || todayIsoDate()),
      },
      data.invoices.length + 1
    );
    setWs((w) => (w ? { ...normalizeWs(w), invoices: [inv, ...w.invoices] } : w));
    e.currentTarget.reset();
  }

  function addTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    if (!title) return;
    const t = newTask({
      title,
      dueDate: String(fd.get("dueDate") || "") || undefined,
      contactId: String(fd.get("contactId") || "") || undefined,
    });
    setWs((w) => (w ? { ...normalizeWs(w), tasks: [t, ...(w.tasks || [])] } : w));
    e.currentTarget.reset();
  }

  function toggleTask(id: string) {
    setWs((w) =>
      w
        ? {
            ...normalizeWs(w),
            tasks: (w.tasks || []).map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
          }
        : w
    );
  }

  function saveProfile(e: FormEvent<HTMLFormElement>) {
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
    setWs((w) => (w ? { ...normalizeWs(w), orgName, profile } : w));
  }

  function onImportFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseWorkspaceJson(String(reader.result || ""));
      if (!parsed) {
        alert("Invalid DoyinOps backup file.");
        return;
      }
      if (!confirm(`Restore "${parsed.orgName}"? This replaces current data.`)) return;
      setWs(parsed);
    };
    reader.readAsText(file);
  }

  function go(t: Tab) {
    setTab(t);
    setSidebarOpen(false);
  }

  const openTasks = data.tasks.filter((t) => !t.done);
  const pageTitle = NAV.find((n) => n.id === tab)?.label || "Overview";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1400px]">
      {printInv && (
        <InvoicePrint
          orgName={data.orgName}
          profile={data.profile}
          invoice={printInv}
          client={contactById(printInv.contactId)}
          onClose={() => setPrintInv(null)}
        />
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.06] bg-[#0a0f1a] pt-12 transition-transform lg:static lg:translate-x-0 lg:pt-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/[0.06] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff8c14] text-sm font-bold text-black">
              D
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">DoyinOps</p>
              <p className="truncate text-[11px] text-white/40">{data.orgName}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => {
            const active = tab === item.id;
            const badge =
              item.id === "tasks"
                ? openTasks.length
                : item.id === "home"
                  ? dueFollowUps.length
                  : 0;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition ${
                  active
                    ? "bg-[#ff8c14]/15 text-[#ff8c14]"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>
                  <span className="block text-[13px] font-medium">{item.label}</span>
                  <span className="block text-[10px] opacity-60">{item.hint}</span>
                </span>
                {badge > 0 && (
                  <span className="rounded-full bg-[#ff8c14]/20 px-2 py-0.5 text-[10px] font-semibold text-[#ff8c14]">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/[0.06] p-3">
          <button type="button" onClick={() => setWs(seedDemoWorkspace())} className={`${btnGhost} w-full`}>
            Load demo data
          </button>
          <Link href="/ops" className={`${btnGhost} w-full`}>
            About DoyinOps
          </Link>
          <Link href="/" className="block text-center text-[11px] text-white/30 hover:text-white/60">
            ← DoyinTech site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-12 z-30 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#070b12]/90 px-4 py-3 backdrop-blur-md lg:top-0 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-white/10 p-2 text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">{pageTitle}</h1>
              <p className="text-[11px] text-white/40">Workspace · local browser storage</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => onImportFile(e.target.files?.[0] || null)}
            />
            <button type="button" onClick={() => fileRef.current?.click()} className={btnGhost}>
              Import
            </button>
            <button type="button" onClick={() => exportJson(data)} className={btnGhost}>
              Export
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          {tab === "home" && (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {(
                  [
                    ["Contacts", String(stats.contacts), "All clients"],
                    ["Open deals", String(stats.openDeals), "Active pipeline"],
                    ["Pipeline value", formatNgn(stats.pipelineNgn), "Open stages"],
                    ["Unpaid", formatNgn(stats.unpaidNgn), "Invoices due"],
                    ["Tasks", String(stats.openTasks), "Still open"],
                  ] as const
                ).map(([label, val, sub]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/[0.06] bg-gradient-to-b from-[#121a2b] to-[#0c1220] p-4"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wide text-white/40">{label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{val}</p>
                    <p className="mt-1 text-[11px] text-white/30">{sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Panel title="Follow-ups due" action={() => go("pipeline")} actionLabel="Pipeline">
                  {dueFollowUps.length === 0 ? (
                    <Empty>Nothing overdue. Set follow-up dates on deals.</Empty>
                  ) : (
                    <ul className="space-y-2">
                      {dueFollowUps.map((d) => {
                        const c = contactById(d.contactId);
                        const wa = whatsappHref(
                          c?.phone,
                          `Hi ${c?.name || "there"}, following up on ${d.title}.`
                        );
                        return (
                          <li
                            key={d.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5"
                          >
                            <div>
                              <p className="text-sm font-medium text-white">{d.title}</p>
                              <p className="text-[11px] text-white/45">
                                {contactName(d.contactId)} · {d.nextFollowUp}
                              </p>
                            </div>
                            {wa && (
                              <a
                                href={wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md bg-[#25D366] px-2.5 py-1 text-[11px] font-semibold text-white"
                              >
                                WhatsApp
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Panel>

                <Panel title="Open tasks" action={() => go("tasks")} actionLabel="All tasks">
                  {openTasks.length === 0 ? (
                    <Empty>No open tasks.</Empty>
                  ) : (
                    <ul className="space-y-2">
                      {openTasks.slice(0, 6).map((t: Task) => (
                        <li
                          key={t.id}
                          className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-3 py-2.5"
                        >
                          <button
                            type="button"
                            onClick={() => toggleTask(t.id)}
                            className="text-left text-sm text-white hover:text-[#ff8c14]"
                          >
                            {t.title}
                            {t.dueDate && (
                              <span className="block text-[11px] text-white/40">Due {t.dueDate}</span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleTask(t.id)}
                            className="text-[11px] font-medium text-emerald-400"
                          >
                            Done
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>
              </div>
            </div>
          )}

          {tab === "contacts" && (
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              <form onSubmit={addContact} className="h-fit space-y-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-5">
                <h2 className="text-sm font-semibold text-white">New contact</h2>
                <input name="name" required placeholder="Name *" className={field} />
                <input name="business" placeholder="Business" className={field} />
                <input name="phone" placeholder="Phone / WhatsApp" className={field} />
                <input name="email" type="email" placeholder="Email" className={field} />
                <textarea name="notes" placeholder="Notes" rows={3} className={field} />
                <button type="submit" className={`${btnPrimary} w-full`}>
                  Save contact
                </button>
              </form>
              <div className="space-y-3">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search contacts…"
                  className={field}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredContacts.length === 0 && <Empty>No contacts match.</Empty>}
                  {filteredContacts.map((c: Contact) => {
                    const wa = whatsappHref(c.phone, `Hi ${c.name},`);
                    return (
                      <div
                        key={c.id}
                        className="rounded-xl border border-white/[0.06] bg-[#0c1220] p-4"
                      >
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="font-semibold text-white">{c.name}</p>
                            <p className="mt-1 text-[12px] text-white/45">
                              {[c.business, c.phone, c.email].filter(Boolean).join(" · ")}
                            </p>
                            {c.notes && (
                              <p className="mt-2 text-[13px] text-white/60">{c.notes}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {wa && (
                              <a
                                href={wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-[#25D366]"
                              >
                                WhatsApp
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (!confirm("Remove contact?")) return;
                                setWs((w) =>
                                  w
                                    ? {
                                        ...normalizeWs(w),
                                        contacts: w.contacts.filter((x) => x.id !== c.id),
                                      }
                                    : w
                                );
                              }}
                              className="text-xs text-red-400"
                            >
                              Remove
                            </button>
                          </div>
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
              <form
                onSubmit={addDeal}
                className="grid gap-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                <h2 className="text-sm font-semibold text-white sm:col-span-2 lg:col-span-4">
                  New deal
                </h2>
                <select name="contactId" required className={field} defaultValue="">
                  <option value="" disabled>
                    Contact *
                  </option>
                  {data.contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input name="title" placeholder="Deal title" className={field} />
                <input name="valueNgn" type="number" min={0} placeholder="Value (NGN)" className={field} />
                <input name="nextFollowUp" type="date" className={field} />
                <input name="notes" placeholder="Notes" className={`sm:col-span-2 lg:col-span-3 ${field}`} />
                <button
                  type="submit"
                  disabled={data.contacts.length === 0}
                  className={`${btnPrimary} lg:col-span-1`}
                >
                  Add deal
                </button>
              </form>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {DEAL_STAGES.filter((s) => s.id !== "lost").map((stage) => {
                  const list = data.deals.filter((d) => d.stage === stage.id);
                  return (
                    <div
                      key={stage.id}
                      className="w-[260px] shrink-0 rounded-xl border border-white/[0.06] bg-[#0c1220]"
                    >
                      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                          {stage.label}
                        </p>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
                          {list.length}
                        </span>
                      </div>
                      <ul className="max-h-[480px] space-y-2 overflow-y-auto p-2">
                        {list.map((d: Deal) => (
                          <li
                            key={d.id}
                            className="rounded-lg border border-white/[0.06] bg-[#070b12] p-3"
                          >
                            <p className="text-sm font-medium text-white">{d.title}</p>
                            <p className="mt-1 text-[11px] text-white/45">
                              {contactName(d.contactId)} · {formatNgn(d.valueNgn)}
                            </p>
                            {d.nextFollowUp && (
                              <p className="mt-1 text-[10px] text-amber-400/80">FU {d.nextFollowUp}</p>
                            )}
                            <select
                              value={d.stage}
                              onChange={(e) => setStage(d.id, e.target.value as DealStage)}
                              className="mt-2 w-full rounded-md border border-white/10 bg-[#0c1220] px-2 py-1.5 text-xs text-white"
                            >
                              {DEAL_STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.label}
                                </option>
                              ))}
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

          {tab === "invoices" && (
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              <form onSubmit={addInvoice} className="h-fit space-y-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-5">
                <h2 className="text-sm font-semibold text-white">New invoice</h2>
                <select name="contactId" required className={field} defaultValue="">
                  <option value="" disabled>
                    Client *
                  </option>
                  {data.contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input name="amountNgn" type="number" min={0} required placeholder="Amount (NGN)" className={field} />
                <input name="description" placeholder="Description" className={field} />
                <input name="dueDate" type="date" className={field} />
                <button type="submit" disabled={data.contacts.length === 0} className={`${btnPrimary} w-full`}>
                  Create invoice
                </button>
              </form>
              <div className="space-y-3">
                {data.invoices.length === 0 && <Empty>No invoices yet.</Empty>}
                {data.invoices.map((inv: Invoice) => {
                  const c = contactById(inv.contactId);
                  const wa = whatsappHref(
                    c?.phone,
                    invoiceReminderMessage(data.orgName, inv, c?.name || "there")
                  );
                  return (
                    <div
                      key={inv.id}
                      className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-4"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          {inv.number}{" "}
                          <StatusPill status={inv.status} />
                        </p>
                        <p className="mt-1 text-[13px] text-white/50">
                          {contactName(inv.contactId)} · {formatNgn(inv.amountNgn)}
                        </p>
                        <p className="mt-1 text-[13px] text-white/70">{inv.description}</p>
                        <p className="mt-1 text-[11px] text-white/35">Due {inv.dueDate}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => setPrintInv(inv)} className={btnGhost}>
                          Print / PDF
                        </button>
                        {inv.status !== "paid" && (
                          <button
                            type="button"
                            onClick={() =>
                              setWs((w) =>
                                w
                                  ? {
                                      ...normalizeWs(w),
                                      invoices: w.invoices.map((i) =>
                                        i.id === inv.id
                                          ? {
                                              ...i,
                                              status: "paid" as const,
                                              paidAt: new Date().toISOString(),
                                            }
                                          : i
                                      ),
                                    }
                                  : w
                              )
                            }
                            className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-400"
                          >
                            Mark paid
                          </button>
                        )}
                        {wa && inv.status !== "paid" && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-[#25D366] px-3 py-2 text-xs font-semibold text-white"
                          >
                            Remind WA
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "tasks" && (
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              <form onSubmit={addTask} className="h-fit space-y-3 rounded-xl border border-white/[0.06] bg-[#0c1220] p-5">
                <h2 className="text-sm font-semibold text-white">New task</h2>
                <input name="title" required placeholder="What to do *" className={field} />
                <input name="dueDate" type="date" className={field} />
                <select name="contactId" className={field} defaultValue="">
                  <option value="">Optional contact</option>
                  {data.contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className={`${btnPrimary} w-full`}>
                  Add task
                </button>
              </form>
              <ul className="space-y-2">
                {data.tasks.length === 0 && <Empty>No tasks yet.</Empty>}
                {data.tasks.map((t: Task) => (
                  <li
                    key={t.id}
                    className={`flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] px-4 py-3 ${
                      t.done ? "bg-[#0c1220]/50 opacity-55" : "bg-[#0c1220]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTask(t.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className={`text-sm text-white ${t.done ? "line-through" : ""}`}>{t.title}</p>
                        <p className="text-[11px] text-white/40">
                          {[t.dueDate ? `Due ${t.dueDate}` : null, t.contactId ? contactName(t.contactId) : null]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setWs((w) =>
                          w
                            ? {
                                ...normalizeWs(w),
                                tasks: (w.tasks || []).filter((x) => x.id !== t.id),
                              }
                            : w
                        )
                      }
                      className="text-xs text-red-400"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "settings" && (
            <div className="mx-auto max-w-xl space-y-6">
              <div className="rounded-xl border border-white/[0.06] bg-[#0c1220] p-6">
                <h2 className="text-sm font-semibold text-white">Business profile</h2>
                <p className="mt-1 text-[13px] text-white/45">
                  Appears on printed invoices. Fill this once for professional PDFs.
                </p>
                <form onSubmit={saveProfile} className="mt-5 space-y-3">
                  <input
                    name="orgName"
                    defaultValue={data.orgName}
                    placeholder="Workspace name"
                    className={field}
                  />
                  <input
                    name="legalName"
                    defaultValue={data.profile.legalName || ""}
                    placeholder="Legal / trade name on invoice"
                    className={field}
                  />
                  <input
                    name="email"
                    defaultValue={data.profile.email || ""}
                    placeholder="Business email"
                    className={field}
                  />
                  <input
                    name="phone"
                    defaultValue={data.profile.phone || ""}
                    placeholder="Business phone"
                    className={field}
                  />
                  <input
                    name="address"
                    defaultValue={data.profile.address || ""}
                    placeholder="Street address"
                    className={field}
                  />
                  <input
                    name="city"
                    defaultValue={data.profile.city || ""}
                    placeholder="City, country"
                    className={field}
                  />
                  <input
                    name="website"
                    defaultValue={data.profile.website || ""}
                    placeholder="Website"
                    className={field}
                  />
                  <textarea
                    name="bankNote"
                    defaultValue={data.profile.bankNote || ""}
                    placeholder="Payment instructions (bank name, account…)"
                    rows={3}
                    className={field}
                  />
                  <button type="submit" className={btnPrimary}>
                    Save profile
                  </button>
                </form>
              </div>

              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                <h2 className="text-sm font-semibold text-red-300">Danger zone</h2>
                <p className="mt-1 text-[12px] text-white/45">
                  Export a backup before clearing. Data lives only in this browser until cloud ships.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm("Clear entire workspace?")) return;
                    setWs(emptyWorkspace(data.orgName));
                  }}
                  className="mt-3 rounded-lg border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-300"
                >
                  Reset workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function normalizeWs(w: OpsWorkspace): OpsWorkspace {
  return {
    ...w,
    profile: w.profile || {},
    tasks: w.tasks || [],
  };
}

function Panel({
  title,
  children,
  action,
  actionLabel,
}: {
  title: string;
  children: React.ReactNode;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <section className="rounded-xl border border-white/[0.06] bg-[#0c1220] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {action && actionLabel && (
          <button type="button" onClick={action} className="text-[11px] font-medium text-[#ff8c14]">
            {actionLabel} →
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] text-white/40">{children}</p>;
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "paid"
      ? "bg-emerald-500/15 text-emerald-400"
      : status === "overdue"
        ? "bg-red-500/15 text-red-400"
        : "bg-[#ff8c14]/15 text-[#ff8c14]";
  return (
    <span className={`ml-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${color}`}>
      {status}
    </span>
  );
}
