"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type {
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

type Tab = "home" | "contacts" | "pipeline" | "invoices" | "tasks";

const input =
  "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]";

export default function OpsApp() {
  const [ws, setWs] = useState<OpsWorkspace | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [q, setQ] = useState("");
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
      <div className="flex min-h-[40vh] items-center justify-center text-[#a1a1a6]">
        Loading workspace…
      </div>
    );
  }

  const data: OpsWorkspace = {
    ...ws,
    tasks: Array.isArray(ws.tasks) ? ws.tasks : [],
  };

  function contactById(id: string) {
    return data.contacts.find((c) => c.id === id);
  }

  function contactName(id: string) {
    return contactById(id)?.name || "Unknown";
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
    setWs((w) => (w ? { ...w, contacts: [c, ...w.contacts], tasks: w.tasks || [] } : w));
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
    setWs((w) => (w ? { ...w, deals: [d, ...w.deals], tasks: w.tasks || [] } : w));
    e.currentTarget.reset();
  }

  function setStage(id: string, stage: DealStage) {
    setWs((w) =>
      w
        ? {
            ...w,
            tasks: w.tasks || [],
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
    setWs((w) => (w ? { ...w, invoices: [inv, ...w.invoices], tasks: w.tasks || [] } : w));
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
    setWs((w) => (w ? { ...w, tasks: [t, ...(w.tasks || [])] } : w));
    e.currentTarget.reset();
  }

  function toggleTask(id: string) {
    setWs((w) =>
      w
        ? {
            ...w,
            tasks: (w.tasks || []).map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
          }
        : w
    );
  }

  function removeTask(id: string) {
    setWs((w) => (w ? { ...w, tasks: (w.tasks || []).filter((t) => t.id !== id) } : w));
  }

  function markPaid(id: string) {
    setWs((w) =>
      w
        ? {
            ...w,
            tasks: w.tasks || [],
            invoices: w.invoices.map((i) =>
              i.id === id
                ? { ...i, status: "paid" as const, paidAt: new Date().toISOString() }
                : i
            ),
          }
        : w
    );
  }

  function removeContact(id: string) {
    if (!confirm("Remove this contact?")) return;
    setWs((w) =>
      w ? { ...w, contacts: w.contacts.filter((c) => c.id !== id), tasks: w.tasks || [] } : w
    );
  }

  function removeDeal(id: string) {
    if (!confirm("Remove this deal?")) return;
    setWs((w) =>
      w ? { ...w, deals: w.deals.filter((d) => d.id !== id), tasks: w.tasks || [] } : w
    );
  }

  function removeInvoice(id: string) {
    if (!confirm("Remove this invoice?")) return;
    setWs((w) =>
      w
        ? { ...w, invoices: w.invoices.filter((i) => i.id !== id), tasks: w.tasks || [] }
        : w
    );
  }

  function resetAll() {
    if (!confirm("Clear entire local workspace? Export a backup first if needed.")) return;
    setWs(emptyWorkspace(data.orgName));
  }

  function loadDemo() {
    if (
      data.contacts.length > 0 &&
      !confirm("Replace current workspace with demo data?")
    ) {
      return;
    }
    setWs(seedDemoWorkspace());
    setTab("home");
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
      if (!confirm(`Restore workspace "${parsed.orgName}"? This replaces current data.`)) return;
      setWs(parsed);
    };
    reader.readAsText(file);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "home", label: "Dashboard" },
    { id: "contacts", label: "Contacts" },
    { id: "pipeline", label: "Pipeline" },
    { id: "invoices", label: "Invoices" },
    { id: "tasks", label: "Tasks" },
  ];

  const openTasks = data.tasks.filter((t) => !t.done);

  return (
    <div className="space-y-6">
      {printInv && (
        <InvoicePrint
          orgName={data.orgName}
          invoice={printInv}
          client={contactById(printInv.contactId)}
          onClose={() => setPrintInv(null)}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            DoyinOps workspace
          </p>
          <input
            className="mt-1 border-0 bg-transparent text-[22px] font-semibold text-white outline-none"
            value={data.orgName}
            onChange={(e) => setWs({ ...data, orgName: e.target.value })}
            aria-label="Organisation name"
          />
          <p className="text-[12px] text-[#86868b]">
            Browser storage · Export / import · Print invoices · Cloud sync coming
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => onImportFile(e.target.files?.[0] || null)}
          />
          <button
            type="button"
            onClick={loadDemo}
            className="rounded-full border border-[#ff8c14]/50 px-4 py-2 text-[12px] font-semibold text-[#ff8c14]"
          >
            Load demo
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-full border border-white/20 px-4 py-2 text-[12px] font-semibold text-white"
          >
            Import
          </button>
          <button
            type="button"
            onClick={() => exportJson(data)}
            className="rounded-full border border-white/20 px-4 py-2 text-[12px] font-semibold text-white"
          >
            Export
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="rounded-full border border-red-500/40 px-4 py-2 text-[12px] text-red-300"
          >
            Reset
          </button>
          <Link href="/ops" className="rounded-full px-4 py-2 text-[12px] text-[#a1a1a6] hover:text-white">
            About
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              tab === t.id
                ? "bg-[#ff8c14] text-black"
                : "border border-white/15 text-[#a1a1a6] hover:text-white"
            }`}
          >
            {t.label}
            {t.id === "home" && dueFollowUps.length > 0 ? ` (${dueFollowUps.length})` : ""}
            {t.id === "tasks" && openTasks.length > 0 ? ` (${openTasks.length})` : ""}
          </button>
        ))}
      </div>

      {tab === "home" && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(
              [
                ["Contacts", String(stats.contacts)],
                ["Open deals", String(stats.openDeals)],
                ["Pipeline", formatNgn(stats.pipelineNgn)],
                ["Unpaid", formatNgn(stats.unpaidNgn)],
                ["Open tasks", String(stats.openTasks)],
              ] as const
            ).map(([label, val]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
                <p className="text-[11px] uppercase tracking-wide text-[#86868b]">{label}</p>
                <p className="mt-1 text-xl font-semibold text-white">{val}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
              <h2 className="text-sm font-semibold text-white">Follow-ups due</h2>
              {dueFollowUps.length === 0 ? (
                <p className="mt-2 text-[13px] text-[#a1a1a6]">None overdue.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {dueFollowUps.map((d) => {
                    const c = contactById(d.contactId);
                    const wa = whatsappHref(
                      c?.phone,
                      `Hi ${c?.name || "there"}, following up on ${d.title}.`
                    );
                    return (
                      <li
                        key={d.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{d.title}</p>
                          <p className="text-[12px] text-[#a1a1a6]">
                            {contactName(d.contactId)} · {d.nextFollowUp}
                          </p>
                        </div>
                        {wa && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-[#25D366] px-3 py-1 text-[11px] font-semibold text-white"
                          >
                            WhatsApp
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
              <h2 className="text-sm font-semibold text-white">Open tasks</h2>
              {openTasks.length === 0 ? (
                <p className="mt-2 text-[13px] text-[#a1a1a6]">No open tasks.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {openTasks.slice(0, 6).map((t: Task) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-white/10 px-3 py-2"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(t.id)}
                        className="text-left text-sm text-white hover:text-[#ff8c14]"
                      >
                        {t.title}
                        {t.dueDate ? (
                          <span className="block text-[11px] text-[#86868b]">Due {t.dueDate}</span>
                        ) : null}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTask(t.id)}
                        className="text-[11px] text-emerald-400"
                      >
                        Done
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => setTab("tasks")}
                className="mt-3 text-[12px] text-[#ff8c14] hover:underline"
              >
                All tasks →
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-[14px] text-[#a1a1a6]">
            <p className="font-semibold text-white">Quick start</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>Click <strong className="text-white">Load demo</strong> to explore with sample data.</li>
              <li>Add your real contacts with WhatsApp numbers.</li>
              <li>Track deals, tasks, and invoices — print invoices for clients.</li>
            </ol>
            <p className="mt-4 text-[13px]">
              Need a custom system?{" "}
              <Link href="/hire" className="text-[#ff8c14] hover:underline">
                Hire DoyinTech
              </Link>
            </p>
          </div>
        </div>
      )}

      {tab === "contacts" && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <form onSubmit={addContact} className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
            <h2 className="text-sm font-semibold text-white">Add contact</h2>
            <input name="name" required placeholder="Name *" className={input} />
            <input name="business" placeholder="Business" className={input} />
            <input name="phone" placeholder="Phone / WhatsApp" className={input} />
            <input name="email" type="email" placeholder="Email" className={input} />
            <textarea name="notes" placeholder="Notes" rows={3} className={input} />
            <button type="submit" className="w-full rounded-full bg-[#ff8c14] py-2.5 text-sm font-semibold text-black">
              Save contact
            </button>
          </form>
          <div className="space-y-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search contacts…"
              className={input}
            />
            <ul className="space-y-3">
              {filteredContacts.length === 0 && (
                <p className="text-sm text-[#a1a1a6]">No contacts match.</p>
              )}
              {filteredContacts.map((c: Contact) => {
                const wa = whatsappHref(c.phone, `Hi ${c.name},`);
                return (
                  <li key={c.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{c.name}</p>
                        <p className="text-[12px] text-[#a1a1a6]">
                          {[c.business, c.phone, c.email].filter(Boolean).join(" · ")}
                        </p>
                        {c.notes && <p className="mt-2 text-[13px] text-[#c7cdd8]">{c.notes}</p>}
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
                          onClick={() => removeContact(c.id)}
                          className="text-xs text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {tab === "pipeline" && (
        <div className="space-y-6">
          <form
            onSubmit={addDeal}
            className="grid gap-3 rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:grid-cols-2"
          >
            <h2 className="sm:col-span-2 text-sm font-semibold text-white">New deal</h2>
            <select name="contactId" required className={input} defaultValue="">
              <option value="" disabled>
                Select contact *
              </option>
              {data.contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input name="title" placeholder="Deal title" className={input} />
            <input name="valueNgn" type="number" min={0} placeholder="Value (NGN)" className={input} />
            <input name="nextFollowUp" type="date" className={input} />
            <input name="notes" placeholder="Notes" className={`sm:col-span-2 ${input}`} />
            <button
              type="submit"
              disabled={data.contacts.length === 0}
              className="sm:col-span-2 rounded-full bg-[#ff8c14] py-2.5 text-sm font-semibold text-black disabled:opacity-40"
            >
              Add deal
            </button>
          </form>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {DEAL_STAGES.filter((s) => s.id !== "lost").map((stage) => {
              const list = data.deals.filter((d) => d.stage === stage.id);
              return (
                <div key={stage.id} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                    {stage.label} ({list.length})
                  </p>
                  <ul className="space-y-2">
                    {list.map((d: Deal) => (
                      <li key={d.id} className="rounded-xl border border-white/10 bg-[#141a28] p-3">
                        <p className="text-sm font-semibold text-white">{d.title}</p>
                        <p className="text-[12px] text-[#a1a1a6]">
                          {contactName(d.contactId)} · {formatNgn(d.valueNgn)}
                          {d.nextFollowUp ? ` · FU ${d.nextFollowUp}` : ""}
                        </p>
                        <select
                          value={d.stage}
                          onChange={(e) => setStage(d.id, e.target.value as DealStage)}
                          className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-2 py-1.5 text-xs text-white"
                        >
                          {DEAL_STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeDeal(d.id)}
                          className="mt-2 text-[11px] text-red-400"
                        >
                          Remove
                        </button>
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
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <form onSubmit={addInvoice} className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
            <h2 className="text-sm font-semibold text-white">New invoice</h2>
            <select name="contactId" required className={input} defaultValue="">
              <option value="" disabled>
                Client *
              </option>
              {data.contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input name="amountNgn" type="number" min={0} required placeholder="Amount (NGN)" className={input} />
            <input name="description" placeholder="Description" className={input} />
            <input name="dueDate" type="date" className={input} />
            <button
              type="submit"
              disabled={data.contacts.length === 0}
              className="w-full rounded-full bg-[#ff8c14] py-2.5 text-sm font-semibold text-black disabled:opacity-40"
            >
              Create invoice
            </button>
          </form>
          <ul className="space-y-3">
            {data.invoices.length === 0 && (
              <p className="text-sm text-[#a1a1a6]">No invoices yet.</p>
            )}
            {data.invoices.map((inv: Invoice) => {
              const c = contactById(inv.contactId);
              const wa = whatsappHref(
                c?.phone,
                invoiceReminderMessage(data.orgName, inv, c?.name || "there")
              );
              return (
                <li key={inv.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">
                        {inv.number}{" "}
                        <span className="text-xs font-normal uppercase text-[#ff8c14]">{inv.status}</span>
                      </p>
                      <p className="text-[13px] text-[#a1a1a6]">
                        {contactName(inv.contactId)} · {formatNgn(inv.amountNgn)}
                      </p>
                      <p className="mt-1 text-[13px] text-[#c7cdd8]">{inv.description}</p>
                      <p className="mt-1 text-[11px] text-[#86868b]">Due {inv.dueDate}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setPrintInv(inv)}
                        className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Print / PDF
                      </button>
                      {inv.status !== "paid" && (
                        <button
                          type="button"
                          onClick={() => markPaid(inv.id)}
                          className="rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300"
                        >
                          Mark paid
                        </button>
                      )}
                      {wa && inv.status !== "paid" && (
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-[#25D366] px-3 py-1.5 text-center text-xs font-semibold text-white"
                        >
                          Remind on WA
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => removeInvoice(inv.id)}
                        className="text-xs text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {tab === "tasks" && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <form onSubmit={addTask} className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
            <h2 className="text-sm font-semibold text-white">New task</h2>
            <input name="title" required placeholder="What to do *" className={input} />
            <input name="dueDate" type="date" className={input} />
            <select name="contactId" className={input} defaultValue="">
              <option value="">Optional contact</option>
              {data.contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button type="submit" className="w-full rounded-full bg-[#ff8c14] py-2.5 text-sm font-semibold text-black">
              Add task
            </button>
          </form>
          <ul className="space-y-2">
            {data.tasks.length === 0 && (
              <p className="text-sm text-[#a1a1a6]">No tasks yet.</p>
            )}
            {data.tasks.map((t: Task) => (
              <li
                key={t.id}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 px-4 py-3 ${
                  t.done ? "bg-black/20 opacity-60" : "bg-black/30"
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
                    <p className={`text-sm font-medium text-white ${t.done ? "line-through" : ""}`}>
                      {t.title}
                    </p>
                    <p className="text-[11px] text-[#86868b]">
                      {[t.dueDate ? `Due ${t.dueDate}` : null, t.contactId ? contactName(t.contactId) : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => removeTask(t.id)} className="text-xs text-red-400">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
