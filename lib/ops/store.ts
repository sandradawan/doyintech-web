import type {
  BusinessProfile,
  Contact,
  Deal,
  Invoice,
  OpsWorkspace,
  Task,
} from "./types";

const KEY = "doyinops_workspace_v1";

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyWorkspace(orgName = "My business"): OpsWorkspace {
  return {
    version: 1,
    orgName,
    profile: {},
    contacts: [],
    deals: [],
    invoices: [],
    tasks: [],
  };
}

function normalize(data: Partial<OpsWorkspace>): OpsWorkspace {
  return {
    version: 1,
    orgName: data.orgName || "My business",
    profile: data.profile && typeof data.profile === "object" ? data.profile : {},
    contacts: Array.isArray(data.contacts) ? data.contacts : [],
    deals: Array.isArray(data.deals) ? data.deals : [],
    invoices: Array.isArray(data.invoices) ? data.invoices : [],
    tasks: Array.isArray(data.tasks) ? data.tasks : [],
  };
}

export function loadWorkspace(): OpsWorkspace {
  if (typeof window === "undefined") return emptyWorkspace();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyWorkspace();
    const data = JSON.parse(raw) as Partial<OpsWorkspace>;
    if (!data || data.version !== 1) return emptyWorkspace();
    return normalize(data);
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

export function phoneToWa(phone?: string): string | null {
  if (!phone) return null;
  let d = phone.replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("0") && d.length === 11) d = "234" + d.slice(1);
  if (d.length < 10) return null;
  return d;
}

export function whatsappHref(phone: string | undefined, message: string) {
  const n = phoneToWa(phone);
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export function invoiceReminderMessage(
  orgName: string,
  inv: Invoice,
  clientName: string
) {
  return (
    `Hello ${clientName},\n\n` +
    `Invoice *${inv.number}* from *${orgName}*\n` +
    `Amount: ${formatNgn(inv.amountNgn)}\n` +
    `For: ${inv.description}\n` +
    `Due: ${inv.dueDate}\n\n` +
    `Please confirm payment when done. Thank you.`
  );
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

export function newTask(
  partial: Omit<Task, "id" | "createdAt" | "done"> & { done?: boolean }
): Task {
  return {
    title: partial.title,
    dueDate: partial.dueDate,
    contactId: partial.contactId,
    done: partial.done ?? false,
    id: uid(),
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

export function parseWorkspaceJson(raw: string): OpsWorkspace | null {
  try {
    const data = JSON.parse(raw) as Partial<OpsWorkspace>;
    if (!data || data.version !== 1) return null;
    return normalize(data);
  } catch {
    return null;
  }
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function seedDemoWorkspace(): OpsWorkspace {
  const c1 = newContact({
    name: "Ada Okeke",
    business: "Glow Salon",
    phone: "08031234567",
    notes: "Wants booking site",
  });
  const c2 = newContact({
    name: "James Bello",
    business: "Bello Properties",
    phone: "08039876543",
    email: "james@example.com",
  });
  const d1 = newDeal({
    contactId: c1.id,
    title: "Salon website + WhatsApp",
    stage: "quoted",
    valueNgn: 250000,
    nextFollowUp: todayIsoDate(),
    notes: "Sent quote yesterday",
  });
  const d2 = newDeal({
    contactId: c2.id,
    title: "Property listing portal",
    stage: "lead",
    valueNgn: 450000,
    nextFollowUp: todayIsoDate(),
  });
  const inv = newInvoice(
    {
      contactId: c1.id,
      amountNgn: 125000,
      status: "sent",
      description: "50% deposit — Local Business Website",
      dueDate: todayIsoDate(),
    },
    1
  );
  const t1 = newTask({
    title: "Call Ada about deposit",
    dueDate: todayIsoDate(),
    contactId: c1.id,
  });
  const t2 = newTask({
    title: "Send Bello portfolio samples",
    dueDate: todayIsoDate(),
    contactId: c2.id,
  });
  const profile: BusinessProfile = {
    legalName: "Demo Studio Ltd",
    email: "hello@demostudio.example",
    phone: "+234 808 000 0000",
    address: "12 Innovation Drive",
    city: "Jos, Nigeria",
    website: "https://doyintech.vercel.app",
    bankNote: "Transfer to GTBank · Demo Studio · 0123456789",
  };
  return {
    version: 1,
    orgName: "Demo Studio",
    profile,
    contacts: [c1, c2],
    deals: [d1, d2],
    invoices: [inv],
    tasks: [t1, t2],
  };
}
