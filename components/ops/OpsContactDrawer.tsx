"use client";

import type { ReactNode } from "react";
import type { Contact, OpsWorkspace } from "@/lib/ops/types";
import { formatNgn, whatsappHref } from "@/lib/ops/store";
import { StatusPill } from "@/components/ops/OpsHelpers";

export default function OpsContactDrawer({
  contact,
  ws,
  onClose,
}: {
  contact: Contact;
  ws: OpsWorkspace;
  onClose: () => void;
}) {
  const deals = ws.deals.filter((d) => d.contactId === contact.id);
  const invoices = ws.invoices.filter((i) => i.contactId === contact.id);
  const quotes = (ws.quotes || []).filter((q) => q.contactId === contact.id);
  const tasks = (ws.tasks || []).filter((t) => t.contactId === contact.id);
  const pipeline = deals
    .filter((d) => d.stage !== "paid" && d.stage !== "lost")
    .reduce((s, d) => s + (d.valueNgn || 0), 0);
  const unpaid = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((s, i) => s + (i.amountNgn || 0), 0);
  const paid = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + (i.amountNgn || 0), 0);
  const wa = whatsappHref(contact.phone, `Hi ${contact.name},`);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close drawer" />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0a0f1a] shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[#ff8c14]/80">Client 360</p>
            <h2 className="mt-1 text-lg font-semibold text-white">{contact.name}</h2>
            <p className="text-[13px] text-white/45">
              {[contact.business, contact.phone, contact.email].filter(Boolean).join(" · ")}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-2 py-1 text-sm text-white/60 hover:bg-white/5">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 border-b border-white/[0.06] p-4">
          {[
            ["Pipeline", formatNgn(pipeline)],
            ["Unpaid", formatNgn(unpaid)],
            ["Paid", formatNgn(paid)],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur">
              <p className="text-[10px] uppercase text-white/40">{l}</p>
              <p className="mt-1 text-sm font-semibold text-white">{v}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 border-b border-white/[0.06] px-4 py-3">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#25D366] px-3 py-2 text-xs font-semibold text-white">
              WhatsApp
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
              Email
            </a>
          )}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {contact.notes && (
            <section>
              <h3 className="mb-1 text-[11px] font-semibold uppercase text-white/40">Notes</h3>
              <p className="text-sm text-white/70">{contact.notes}</p>
            </section>
          )}

          <Section title={`Deals (${deals.length})`}>
            {deals.length === 0 ? (
              <EmptyLine />
            ) : (
              deals.map((d) => (
                <div key={d.id} className="rounded-lg border border-white/[0.06] px-3 py-2">
                  <p className="text-sm text-white">{d.title}</p>
                  <p className="text-[11px] text-white/45">
                    {d.stage} · {formatNgn(d.valueNgn)}
                    {d.nextFollowUp ? ` · follow-up ${d.nextFollowUp}` : ""}
                  </p>
                </div>
              ))
            )}
          </Section>

          <Section title={`Invoices (${invoices.length})`}>
            {invoices.length === 0 ? (
              <EmptyLine />
            ) : (
              invoices.map((i) => (
                <div key={i.id} className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-3 py-2">
                  <div>
                    <p className="text-sm text-white">{i.number}</p>
                    <p className="text-[11px] text-white/45">{formatNgn(i.amountNgn)} · due {i.dueDate}</p>
                  </div>
                  <StatusPill status={i.status} />
                </div>
              ))
            )}
          </Section>

          <Section title={`Quotes (${quotes.length})`}>
            {quotes.length === 0 ? (
              <EmptyLine />
            ) : (
              quotes.map((q) => (
                <div key={q.id} className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-3 py-2">
                  <div>
                    <p className="text-sm text-white">{q.number}</p>
                    <p className="text-[11px] text-white/45">{formatNgn(q.amountNgn)}</p>
                  </div>
                  <StatusPill status={q.status} />
                </div>
              ))
            )}
          </Section>

          <Section title={`Tasks (${tasks.length})`}>
            {tasks.length === 0 ? (
              <EmptyLine />
            ) : (
              tasks.map((t) => (
                <div key={t.id} className="rounded-lg border border-white/[0.06] px-3 py-2 text-sm text-white">
                  <span className={t.done ? "line-through opacity-50" : ""}>{t.title}</span>
                  {t.dueDate && <span className="ml-2 text-[11px] text-white/40">{t.dueDate}</span>}
                </div>
              ))
            )}
          </Section>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function EmptyLine() {
  return <p className="text-[12px] text-white/35">None yet.</p>;
}
