import type { Contact, Invoice, OpsWorkspace } from "./types";
import { formatNgn } from "./store";

function escapeCsv(v: string | number | undefined | null) {
  const s = v === undefined || v === null ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function download(filename: string, csv: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportContactsCsv(contacts: Contact[]) {
  const header = ["name", "business", "phone", "email", "notes", "createdAt"];
  const rows = contacts.map((c) =>
    [c.name, c.business, c.phone, c.email, c.notes, c.createdAt].map(escapeCsv).join(",")
  );
  download(`doyinops-contacts-${Date.now()}.csv`, [header.join(","), ...rows].join("\n"));
}

export function exportInvoicesCsv(ws: OpsWorkspace) {
  const byId = (id: string) => ws.contacts.find((c) => c.id === id)?.name || "";
  const header = [
    "number",
    "client",
    "amount",
    "status",
    "description",
    "dueDate",
    "createdAt",
    "paidAt",
  ];
  const rows = ws.invoices.map((i: Invoice) =>
    [
      i.number,
      byId(i.contactId),
      i.amountNgn,
      i.status,
      i.description,
      i.dueDate,
      i.createdAt,
      i.paidAt || "",
    ]
      .map(escapeCsv)
      .join(",")
  );
  download(`doyinops-invoices-${Date.now()}.csv`, [header.join(","), ...rows].join("\n"));
}

export function exportDealsCsv(ws: OpsWorkspace) {
  const byId = (id: string) => ws.contacts.find((c) => c.id === id)?.name || "";
  const header = ["title", "client", "stage", "value", "nextFollowUp", "createdAt"];
  const rows = ws.deals.map((d) =>
    [d.title, byId(d.contactId), d.stage, d.valueNgn, d.nextFollowUp || "", d.createdAt]
      .map(escapeCsv)
      .join(",")
  );
  download(`doyinops-deals-${Date.now()}.csv`, [header.join(","), ...rows].join("\n"));
}

/** Human-readable summary for clipboard / activity */
export function workspaceSummaryLine(ws: OpsWorkspace) {
  const open = ws.deals.filter((d) => d.stage !== "paid" && d.stage !== "lost");
  const unpaid = ws.invoices.filter((i) => i.status === "sent" || i.status === "overdue");
  return `${ws.orgName}: ${ws.contacts.length} contacts · ${open.length} open deals (${formatNgn(
    open.reduce((s, d) => s + d.valueNgn, 0)
  )}) · ${unpaid.length} unpaid (${formatNgn(unpaid.reduce((s, i) => s + i.amountNgn, 0))})`;
}
