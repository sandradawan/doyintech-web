"use client";

import { useEffect, useMemo, useState } from "react";

function shell(title: string, children: React.ReactNode) {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="rounded-2xl border border-white/10 bg-[#141a28] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
          DoyinStore Web App
        </p>
        <h1 className="mt-1 text-xl font-semibold text-white">{title}</h1>
      </div>
      {children}
    </div>
  );
}

const input =
  "w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]";

/* ——— Invoice Helper ——— */
export function InvoiceHelperApp() {
  const [biz, setBiz] = useState("");
  const [client, setClient] = useState("");
  const [item, setItem] = useState("Service");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("Thank you for your business.");

  function printInv() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Invoice</title>
      <style>body{font-family:system-ui;padding:40px;color:#111;max-width:640px;margin:auto}
      table{width:100%;border-collapse:collapse;margin-top:20px}
      td{border-bottom:1px solid #ddd;padding:8px}</style></head><body>
      <h1>INVOICE</h1>
      <p><b>From:</b> ${biz || "—"}<br/><b>Bill to:</b> ${client || "—"}</p>
      <table><tr><td>${item}</td><td style="text-align:right">₦${amount || "0"}</td></tr></table>
      <p style="font-size:22px;font-weight:700;margin-top:16px">Total: ₦${amount || "0"}</p>
      <p>${note}</p>
      <script>onload=()=>print()</script></body></html>`);
    w.document.close();
  }

  return shell(
    "Invoice Helper",
    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
      <input className={input} placeholder="Your business" value={biz} onChange={(e) => setBiz(e.target.value)} />
      <input className={input} placeholder="Client name" value={client} onChange={(e) => setClient(e.target.value)} />
      <input className={input} placeholder="Line item" value={item} onChange={(e) => setItem(e.target.value)} />
      <input className={input} placeholder="Amount (NGN)" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <textarea className={input} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      <button type="button" onClick={printInv} className="w-full rounded-full bg-[#ff8c14] py-3 text-sm font-semibold text-black">
        Print / Save PDF
      </button>
    </div>
  );
}

/* ——— Client Tracker ——— */
type ClientRow = { id: string; name: string; phone: string; status: string; next: string };

export function ClientTrackerApp() {
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Lead");
  const [next, setNext] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("doyin_client_tracker");
      if (raw) setRows(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("doyin_client_tracker", JSON.stringify(rows));
    } catch {
      /* ignore */
    }
  }, [rows]);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setRows((r) => [
      { id: String(Date.now()), name: name.trim(), phone, status, next },
      ...r,
    ]);
    setName("");
    setPhone("");
    setNext("");
  }

  function exportCsv() {
    const header = "Name,Phone,Status,Next follow-up\n";
    const body = rows
      .map((r) =>
        [r.name, r.phone, r.status, r.next].map((c) => `"${c.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return shell(
    "Client Tracker",
    <div className="space-y-4">
      <form onSubmit={add} className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-4">
        <input className={input} placeholder="Client name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className={input} placeholder="Phone / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <select className={input} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Lead</option>
          <option>Proposal</option>
          <option>Won</option>
          <option>Lost</option>
        </select>
        <input className={input} placeholder="Next follow-up date" value={next} onChange={(e) => setNext(e.target.value)} />
        <button type="submit" className="w-full rounded-full bg-[#ff8c14] py-3 text-sm font-semibold text-black">
          Add client
        </button>
      </form>
      <button type="button" onClick={exportCsv} className="w-full rounded-full border border-white/20 py-2.5 text-sm text-white">
        Export CSV
      </button>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-gray-200">
            <span className="font-semibold text-white">{r.name}</span> · {r.status}
            <p className="text-xs text-gray-500">{r.phone} {r.next ? `· ${r.next}` : ""}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ——— WhatsApp Studio ——— */
export function WhatsAppStudioApp() {
  const [biz, setBiz] = useState("");
  const [hours, setHours] = useState("Mon–Sat 9am–6pm");
  const script = useMemo(
    () =>
      `👋 Welcome to ${biz || "[Business]"}!\n\nHours: ${hours}\n\nReply:\n1 — Prices\n2 — Book\n3 — Talk to a human\n\nAway message:\nThanks — we're offline (${hours}). Leave your name + request.`,
    [biz, hours]
  );

  return shell(
    "WhatsApp Reply Studio",
    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
      <input className={input} placeholder="Business name" value={biz} onChange={(e) => setBiz(e.target.value)} />
      <input className={input} placeholder="Hours" value={hours} onChange={(e) => setHours(e.target.value)} />
      <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/50 p-3 text-sm text-gray-200">
        {script}
      </pre>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(script)}
        className="w-full rounded-full bg-[#ff8c14] py-3 text-sm font-semibold text-black"
      >
        Copy script
      </button>
    </div>
  );
}

/* ——— Expense Log ——— */
type Exp = { id: string; title: string; amount: number; cat: string };

export function ExpenseLogApp() {
  const [items, setItems] = useState<Exp[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("Ops");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("doyin_expense_log");
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("doyin_expense_log", JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const total = items.reduce((s, i) => s + i.amount, 0);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!title.trim() || !n) return;
    setItems((x) => [{ id: String(Date.now()), title: title.trim(), amount: n, cat }, ...x]);
    setTitle("");
    setAmount("");
  }

  return shell(
    "Expense Log",
    <div className="space-y-4">
      <p className="text-center text-2xl font-semibold text-white">
        ₦{total.toLocaleString()}
      </p>
      <form onSubmit={add} className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-4">
        <input className={input} placeholder="What did you spend on?" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className={input} placeholder="Amount (NGN)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <select className={input} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option>Ops</option>
          <option>Marketing</option>
          <option>Transport</option>
          <option>Tools</option>
          <option>Other</option>
        </select>
        <button type="submit" className="w-full rounded-full bg-[#ff8c14] py-3 text-sm font-semibold text-black">
          Add expense
        </button>
      </form>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.id} className="flex justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-gray-200">
            <span>
              {i.title} <span className="text-xs text-gray-500">· {i.cat}</span>
            </span>
            <span className="text-white">₦{i.amount.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
