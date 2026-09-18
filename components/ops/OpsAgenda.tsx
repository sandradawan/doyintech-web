"use client";

import type { Contact, Deal, OpsWorkspace, Task } from "@/lib/ops/types";
import { formatNgn, whatsappHref } from "@/lib/ops/store";

type Item = {
  id: string;
  kind: "followup" | "task" | "invoice";
  date: string;
  title: string;
  subtitle: string;
  urgency: "overdue" | "today" | "upcoming";
  contact?: Contact;
  deal?: Deal;
  task?: Task;
};

function urgencyOf(date: string, today: string): Item["urgency"] {
  if (date < today) return "overdue";
  if (date === today) return "today";
  return "upcoming";
}

function buildItems(ws: OpsWorkspace, today: string): Item[] {
  const byId = (id: string) => ws.contacts.find((c) => c.id === id);
  const items: Item[] = [];

  for (const d of ws.deals) {
    if (!d.nextFollowUp) continue;
    if (d.stage === "paid" || d.stage === "lost") continue;
    const c = byId(d.contactId);
    items.push({
      id: `deal-${d.id}`,
      kind: "followup",
      date: d.nextFollowUp,
      title: d.title,
      subtitle: `${c?.name || "Unknown"} · ${formatNgn(d.valueNgn)} · ${d.stage}`,
      urgency: urgencyOf(d.nextFollowUp, today),
      contact: c,
      deal: d,
    });
  }

  for (const t of ws.tasks || []) {
    if (t.done || !t.dueDate) continue;
    const c = t.contactId ? byId(t.contactId) : undefined;
    items.push({
      id: `task-${t.id}`,
      kind: "task",
      date: t.dueDate,
      title: t.title,
      subtitle: c ? `Task · ${c.name}` : "Task",
      urgency: urgencyOf(t.dueDate, today),
      contact: c,
      task: t,
    });
  }

  for (const inv of ws.invoices) {
    if (inv.status !== "sent" && inv.status !== "overdue") continue;
    if (!inv.dueDate) continue;
    const c = byId(inv.contactId);
    items.push({
      id: `inv-${inv.id}`,
      kind: "invoice",
      date: inv.dueDate,
      title: `${inv.number} · ${formatNgn(inv.amountNgn)}`,
      subtitle: `${c?.name || "Unknown"} · ${inv.description}`,
      urgency: urgencyOf(inv.dueDate, today),
      contact: c,
    });
  }

  items.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  return items;
}

const badge: Record<Item["urgency"], string> = {
  overdue: "bg-red-500/15 text-red-300 border-red-500/30",
  today: "bg-[#ff8c14]/15 text-[#ff8c14] border-[#ff8c14]/30",
  upcoming: "bg-white/5 text-white/50 border-white/10",
};

const kindLabel: Record<Item["kind"], string> = {
  followup: "Follow-up",
  task: "Task",
  invoice: "Invoice due",
};

export default function OpsAgenda({
  ws,
  today,
  onDoneTask,
}: {
  ws: OpsWorkspace;
  today: string;
  onDoneTask?: (taskId: string) => void;
}) {
  const items = buildItems(ws, today);
  const groups = [
    { key: "overdue" as const, label: "Overdue" },
    { key: "today" as const, label: "Today" },
    { key: "upcoming" as const, label: "Upcoming" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
        <h2 className="text-sm font-semibold text-white">Agenda</h2>
        <p className="mt-1 text-[12px] text-white/45">
          Follow-ups, task due dates, and invoice deadlines — sorted so nothing slips.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 text-center text-sm text-white/40">
          No dated items yet. Set follow-up dates on deals, due dates on tasks, or invoice due dates.
        </div>
      ) : (
        groups.map((g) => {
          const list = items.filter((i) => i.urgency === g.key);
          if (!list.length) return null;
          return (
            <section key={g.key} className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
                {g.label} ({list.length})
              </h3>
              <ul className="space-y-2">
                {list.map((item) => {
                  const wa = item.contact
                    ? whatsappHref(
                        item.contact.phone,
                        item.kind === "invoice"
                          ? `Hi ${item.contact.name}, gentle reminder about ${item.title}.`
                          : `Hi ${item.contact.name}, following up on ${item.title}.`
                      )
                    : null;
                  return (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0c1220] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge[item.urgency]}`}>
                            {kindLabel[item.kind]}
                          </span>
                          <span className="text-[11px] tabular-nums text-white/40">{item.date}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-white">{item.title}</p>
                        <p className="text-[12px] text-white/45">{item.subtitle}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {wa && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-[#25D366] px-3 py-1.5 text-[11px] font-semibold text-white"
                          >
                            WhatsApp
                          </a>
                        )}
                        {item.task && onDoneTask && (
                          <button
                            type="button"
                            onClick={() => onDoneTask(item.task!.id)}
                            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-300"
                          >
                            Done
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
