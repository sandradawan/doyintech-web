import type { Contact, Deal, Invoice, OpsWorkspace } from "./types";

const KEY = "doyinops_workspace_v1";

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyWorkspace(orgName = "My business"): OpsWorkspace {
  return { version: 1, orgName, contacts: [], deals: [], invoices: [] };
}

export function loadWorkspace(): OpsWorkspace {
  if (typeof window === "undefined") return emptyWorkspace();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyWorkspace();
    const data = JSON.parse(raw) as OpsWorkspace;
    if (!data || data.version !== 1) return emptyWorkspace();
    return data;
  } catch {
    return emptyWorkspace();
  }
}

export function saveWorkspace(ws: OpsWorkspace) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(ws));
}

export function formatNgn(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function newContact(
  partial: Omit<Contact, "id" | "createdAt">
): Contact {
  return { ...partial, id: uid(), createdAt: new Date().toISOString() };
}

export function newDeal(
  partial: Omit<Deal, "id" | "createdAt" | "updatedAt">
): Deal {
  const now = new Date().toISOString();
  return { ...partial, id: uid(), createdAt: now, updatedAt: now };
}

export function newInvoice(
  partial: Omit<Invoice, "id" | "number" | "createdAt">,
  seq: number
): Invoice {
  const y = new Date().getFullYear();
  return {
    ...partial,
    id: uid(),
    number: `DOP-${y}-${String(seq).padStart(4, "0")}`,
    createdAt: new Date().toISOString(),
  };
}

export function exportJson(ws: OpsWorkspace) {
  const blob = new Blob([JSON.stringify(ws, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `doyinops-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
