"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Contact, Deal, DealStage, Invoice, OpsWorkspace } from "@/lib/ops/types";
import { DEAL_STAGES } from "@/lib/ops/types";
import {
  emptyWorkspace,
  exportJson,
  formatNgn,
  loadWorkspace,
  newContact,
  newDeal,
  newInvoice,
  saveWorkspace,
} from "@/lib/ops/store";

type Tab = "home" | "contacts" | "pipeline" | "invoices";

const input =
  "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]";

export default function OpsApp() {
  const [ws, setWs] = useState<OpsWorkspace | null>(null);
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    setWs(loadWorkspace());
  }, []);

  useEffect(() => {
    if (ws) saveWorkspace(ws);
  }, [ws]);

  const stats = useMemo(() => {
    if (!ws) return { contacts: 0, openDeals: 0, pipelineNgn: 0, unpaidNgn: 0 };
    const open = ws.deals.filter((d) => !["paid", "lost"].includes(d.stage));
    const unpaid = ws.invoices.filter((i) => i.status === "sent" || i.status === "overdue");
    return {
      contacts: ws.contacts.length,
      openDeals: open.length,
      pipelineNgn: open.reduce((s, d) => s + (d.valueNgn || 0), 0),
      unpaidNgn: unpaid.reduce((s, i) => s + (i.amountNgn || 0), 0),
    };
  }, [ws]);

  if (!ws) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[#a1a1a6]">
        Loading workspace…
      </div>
    );
  }

  function contactName(id: string) {
    return ws!.contacts.find((c) => c.id === id)?.name || "Unknown";
  }

  function addContact(e: React.FormEvent<HTMLFormElement>) {
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
    setWs((w) => (w ? { ...w, contacts: [c, ...w.contacts] } : w));
    e.currentTarget.reset();
  }

  function addDeal(e: React.FormEvent<HTMLFormElement>) {
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
    setWs((w) => (w ? { ...w, deals: [d, ...w.deals] } : w));
    e.currentTarget.reset();
  }

  function setStage(id: string, stage: DealStage) {
    setWs((w) =>
      w
        ? {
            ...w,
            deals: w.deals.map((d) =>
              d.id === id ? { ...d, stage, updatedAt: new Date().toISOString() } : d
            ),
          }
        : w
    );
  }

  function addInvoice(e: React.FormEvent<HTMLFormElement>) {
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
        dueDate: String(fd.get("dueDate") || new Date().toISOString().slice(0, 10)),
      },
      ws.invoices.length + 1
    );
    setWs((w) => (w ? { ...w, invoices: [inv, ...w.invoices] } : w));
    e.currentTarget.reset();
  }

  function markPaid(id: string) {
    setWs((w) =>
      w
        ? {
            ...w,
            invoices: w.invoices.map((i) =>
              i.id === id
                ? { ...i, status: "paid", paidAt: new Date().toISOString() }
                : i
            ),
          }
        : w
    );
  }

  function removeContact(id: string) {
    if (!confirm("Remove this contact? Linked deals stay but show Unknown.")) return;
    setWs((w) => (w ? { ...w, contacts: w.contacts.filter((c) => c.id !== id) } : w));
  }

  function resetAll() {
    if (!confirm("Clear entire local workspace? Export a backup first if needed.")) return;
    setWs(emptyWorkspace(ws.orgName));
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "home", label: "Dashboard" },
    { id: "contacts", label: "Contacts" },
    { id: "pipeline", label: "Pipeline" },
    { id: "invoices", label: "Invoices" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            DoyinOps workspace
          </p>
          <input
            className="mt-1 border-0 bg-transparent text-[22px] font-semibold text-white outline-none"
            value={ws.orgName}
            onChange={(e) => setWs({ ...ws, orgName: e.target.value })}
            aria-label="Organisation name"
          />
          <p className="text-[12px] text-[#86868b]">
            Data saved in this browser · Export backup anytime · Cloud sync coming
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportJson(ws)}
            className="rounded-full border border-white/20 px-4 py-2 text-[12px] font-semibold text-white"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="rounded-full border border-red-500/40 px-4 py-2 text-[12px] text-red-300"
          >
            Reset
          </button>
          <Link href="/ops" className="rounded-full px-4 py-2 text-[12px] text-[#a1a1a6] hover:text-white">
            About DoyinOps
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
          </button>
        ))}
      </div>

      {tab === "home" && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Contacts", stats.contacts],
              ["Open deals", stats.openDeals],
              ["Pipeline value", formatNgn(stats.pipelineNgn)],
              ["Unpaid invoices", formatNgn(stats.unpaidNgn)],
            ].map(([label, val]) => (
              <div
                key={String(label)}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4"
              >
                <p className="text-[11px] uppercase tracking-wide text-[#86868b]">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{val}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5 text-[14px] text-[#a1a1a6]">
            <p className="font-semibold text-white">How to use DoyinOps today</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>Add contacts (clients / leads).</li>
              <li>Create deals and move stages as you chat on WhatsApp.</li>
              <li>Issue invoices and mark paid when money lands.</li>
              <li>Export JSON weekly as backup until cloud accounts ship.</li>
            </ol>
            <p className="mt-4 text-[13px]">
              Need a full website or custom CRM?{" "}
              <Link href="/hire" className="text-[#ff8c14] hover:underline">
                Hire DoyinTech
              </Link>
              .
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
          <ul className="space-y-3">
            {ws.contacts.length === 0 && (
              <p className="text-sm text-[#a1a1a6]">No contacts yet.</p>
            )}
            {ws.contacts.map((c: Contact) => (
              <li key={c.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-[12px] text-[#a1a1a6]">
                      {[c.business, c.phone, c.email].filter(Boolean).join(" · ")}
                    </p>
                    {c.notes && <p className="mt-2 text-[13px] text-[#c7cdd8]">{c.notes}</p>}
                  </div>
                  <button type="button" onClick={() => removeContact(c.id)} className="text-xs text-red-400">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
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
              {ws.contacts.map((c) => (
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
              disabled={ws.contacts.length === 0}
              className="sm:col-span-2 rounded-full bg-[#ff8c14] py-2.5 text-sm font-semibold text-black disabled:opacity-40"
            >
              Add deal
            </button>
          </form>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {DEAL_STAGES.filter((s) => s.id !== "lost").map((stage) => {
              const list = ws.deals.filter((d) => d.stage === stage.id);
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
              {ws.contacts.map((c) => (
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
              disabled={ws.contacts.length === 0}
              className="w-full rounded-full bg-[#ff8c14] py-2.5 text-sm font-semibold text-black disabled:opacity-40"
            >
              Create invoice
            </button>
          </form>
          <ul className="space-y-3">
            {ws.invoices.length === 0 && (
              <p className="text-sm text-[#a1a1a6]">No invoices yet.</p>
            )}
            {ws.invoices.map((inv: Invoice) => (
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
                  {inv.status !== "paid" && (
                    <button
                      type="button"
                      onClick={() => markPaid(inv.id)}
                      className="rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300"
                    >
                      Mark paid
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
