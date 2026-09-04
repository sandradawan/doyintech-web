"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNgn } from "@/lib/tools/extra";
import { TOOLS_CONFIG } from "@/lib/tools/config";
import LeadForm from "./LeadForm";

type LineItem = {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
};

type Biz = {
  name: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  taxId: string;
};

type Client = {
  name: string;
  address: string;
  city: string;
  email: string;
  phone: string;
};

type Payment = {
  method: "bank" | "paystack" | "flutterwave" | "cash" | "other";
  bankName: string;
  accountName: string;
  accountNumber: string;
  otherNote: string;
};

const STORAGE_KEY = "doyintech_invoice_biz_v1";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

const field =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50";
const label = "block text-xs font-medium text-gray-400 mb-1";

export default function InvoiceGenerator() {
  const [docType, setDocType] = useState<"Invoice" | "Quote" | "Receipt">(
    "Invoice",
  );
  const [invoiceNo, setInvoiceNo] = useState(
    () => `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
  );
  const [issueDate, setIssueDate] = useState(todayISO);
  const [dueDate, setDueDate] = useState(() => addDaysISO(7));
  const [status, setStatus] = useState<"Unpaid" | "Paid" | "Partial" | "Overdue">(
    "Unpaid",
  );

  const [biz, setBiz] = useState<Biz>({
    name: "",
    address: "",
    city: "",
    email: "",
    phone: "",
    taxId: "",
  });

  const [client, setClient] = useState<Client>({
    name: "",
    address: "",
    city: "",
    email: "",
    phone: "",
  });

  const [items, setItems] = useState<LineItem[]>([
    {
      id: uid(),
      description: "Web development services",
      qty: 1,
      unitPrice: 150000,
    },
  ]);

  const [taxPercent, setTaxPercent] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState(
    "Payment is due within the stated due date. Thank you for your business.",
  );
  const [terms, setTerms] = useState(
    "Goods/services remain the property of the seller until payment is received in full.",
  );

  const [payment, setPayment] = useState<Payment>({
    method: "bank",
    bankName: "",
    accountName: "",
    accountNumber: "",
    otherNote: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { biz?: Biz; payment?: Payment };
        if (parsed.biz) setBiz((b) => ({ ...b, ...parsed.biz }));
        if (parsed.payment) setPayment((p) => ({ ...p, ...parsed.payment }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ biz, payment }),
      );
    } catch {
      /* ignore */
    }
  }, [biz, payment]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0),
        0,
      ),
    [items],
  );
  const taxAmount = useMemo(
    () => Math.round(subtotal * (Number(taxPercent) || 0) / 100),
    [subtotal, taxPercent],
  );
  const total = useMemo(
    () => Math.max(0, subtotal + taxAmount - (Number(discount) || 0)),
    [subtotal, taxAmount, discount],
  );

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: uid(), description: "", qty: 1, unitPrice: 0 },
    ]);
  }

  function removeItem(id: string) {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((x) => x.id !== id)));
  }

  function handlePrint() {
    document.body.classList.add("printing-invoice");
    window.print();
    // cleanup in case print dialog cancelled quickly
    setTimeout(() => document.body.classList.remove("printing-invoice"), 500);
  }

  useEffect(() => {
    const onAfterPrint = () => document.body.classList.remove("printing-invoice");
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);

  const paymentLabel =
    payment.method === "bank"
      ? "Bank transfer"
      : payment.method === "paystack"
        ? "Paystack"
        : payment.method === "flutterwave"
          ? "Flutterwave"
          : payment.method === "cash"
            ? "Cash"
            : "Other";

  return (
    <div className="space-y-6">
      {/* Editor */}
      <div className="invoice-no-print space-y-6 rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8">
        <div className="flex flex-wrap gap-2">
          {(["Invoice", "Quote", "Receipt"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setDocType(t)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                docType === t
                  ? "border-primary bg-primary/20 text-white"
                  : "border-white/10 text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={label}>{docType} number</label>
            <input className={field} value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
          </div>
          <div>
            <label className={label}>Issue date</label>
            <input type="date" className={field} value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          </div>
          <div>
            <label className={label}>Due date</label>
            <input type="date" className={field} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <label className={label}>Status</label>
            <select
              className={field}
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              {(["Unpaid", "Paid", "Partial", "Overdue"] as const).map((s) => (
                <option key={s} value={s} className="bg-black">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <fieldset className="space-y-3 rounded-2xl border border-white/10 p-4">
            <legend className="px-1 text-sm font-semibold text-white">From (your business)</legend>
            <input className={field} placeholder="Business name" value={biz.name} onChange={(e) => setBiz({ ...biz, name: e.target.value })} />
            <input className={field} placeholder="Street address" value={biz.address} onChange={(e) => setBiz({ ...biz, address: e.target.value })} />
            <input className={field} placeholder="City / State" value={biz.city} onChange={(e) => setBiz({ ...biz, city: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={field} placeholder="Email" value={biz.email} onChange={(e) => setBiz({ ...biz, email: e.target.value })} />
              <input className={field} placeholder="Phone" value={biz.phone} onChange={(e) => setBiz({ ...biz, phone: e.target.value })} />
            </div>
            <input className={field} placeholder="CAC / Tax ID (optional)" value={biz.taxId} onChange={(e) => setBiz({ ...biz, taxId: e.target.value })} />
          </fieldset>

          <fieldset className="space-y-3 rounded-2xl border border-white/10 p-4">
            <legend className="px-1 text-sm font-semibold text-white">Bill to (client)</legend>
            <input className={field} placeholder="Client / company name" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
            <input className={field} placeholder="Street address" value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} />
            <input className={field} placeholder="City / State" value={client.city} onChange={(e) => setClient({ ...client, city: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={field} placeholder="Email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} />
              <input className={field} placeholder="Phone" value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} />
            </div>
          </fieldset>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Line items</p>
            <button type="button" onClick={addItem} className="text-xs font-semibold text-primary hover:underline">
              + Add item
            </button>
          </div>
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-12">
                <input
                  className={field + " sm:col-span-5"}
                  placeholder="Description"
                  value={it.description}
                  onChange={(e) => updateItem(it.id, { description: e.target.value })}
                />
                <input
                  type="number"
                  min={0}
                  className={field + " sm:col-span-2"}
                  placeholder="Qty"
                  value={it.qty}
                  onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) || 0 })}
                />
                <input
                  type="number"
                  min={0}
                  className={field + " sm:col-span-3"}
                  placeholder="Unit price (₦)"
                  value={it.unitPrice}
                  onChange={(e) =>
                    updateItem(it.id, { unitPrice: Number(e.target.value) || 0 })
                  }
                />
                <div className="flex items-center justify-between gap-2 sm:col-span-2">
                  <span className="text-sm text-gray-300">
                    {formatNgn((it.qty || 0) * (it.unitPrice || 0))}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="text-xs text-red-400 hover:underline"
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className={label}>Tax %</label>
            <input
              type="number"
              min={0}
              className={field}
              value={taxPercent}
              onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className={label}>Discount (₦)</label>
            <input
              type="number"
              min={0}
              className={field}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            />
          </div>
          <div className="flex flex-col justify-end rounded-xl border border-primary/30 bg-primary/10 px-3 py-2">
            <span className="text-[11px] uppercase text-gray-400">Total</span>
            <span className="text-lg font-bold text-white">{formatNgn(total)}</span>
          </div>
        </div>

        <fieldset className="space-y-3 rounded-2xl border border-white/10 p-4">
          <legend className="px-1 text-sm font-semibold text-white">Payment method</legend>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["bank", "Bank transfer"],
                ["paystack", "Paystack"],
                ["flutterwave", "Flutterwave"],
                ["cash", "Cash"],
                ["other", "Other"],
              ] as const
            ).map(([id, lab]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPayment({ ...payment, method: id })}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  payment.method === id
                    ? "border-primary bg-primary/20 text-white"
                    : "border-white/10 text-gray-400"
                }`}
              >
                {lab}
              </button>
            ))}
          </div>
          {payment.method === "bank" && (
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className={field}
                placeholder="Bank name"
                value={payment.bankName}
                onChange={(e) => setPayment({ ...payment, bankName: e.target.value })}
              />
              <input
                className={field}
                placeholder="Account name"
                value={payment.accountName}
                onChange={(e) =>
                  setPayment({ ...payment, accountName: e.target.value })
                }
              />
              <input
                className={field}
                placeholder="Account number"
                value={payment.accountNumber}
                onChange={(e) =>
                  setPayment({ ...payment, accountNumber: e.target.value })
                }
              />
            </div>
          )}
          {(payment.method === "paystack" ||
            payment.method === "flutterwave" ||
            payment.method === "other") && (
            <input
              className={field}
              placeholder={
                payment.method === "other"
                  ? "Payment instructions"
                  : "Payment link or reference note (optional)"
              }
              value={payment.otherNote}
              onChange={(e) => setPayment({ ...payment, otherNote: e.target.value })}
            />
          )}
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label}>Notes</label>
            <textarea
              className={field + " resize-none"}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Terms</label>
            <textarea
              className={field + " resize-none"}
              rows={3}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
          >
            Print / Save PDF
          </button>
          <p className="self-center text-xs text-gray-500">
            Only the invoice sheet prints — not the website menu or footer.
          </p>
        </div>
      </div>

      {/* Printable sheet */}
      <div
        id="invoice-sheet"
        className="invoice-sheet overflow-hidden rounded-2xl border border-white/10 bg-white text-gray-900 shadow-xl"
      >
        <div className="border-b-4 border-blue-600 px-6 py-6 sm:px-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                {docType}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                {biz.name || "Your Business Name"}
              </h2>
              <div className="mt-2 space-y-0.5 text-sm text-gray-600">
                {biz.address && <p>{biz.address}</p>}
                {biz.city && <p>{biz.city}</p>}
                {biz.email && <p>{biz.email}</p>}
                {biz.phone && <p>{biz.phone}</p>}
                {biz.taxId && <p>CAC / Tax ID: {biz.taxId}</p>}
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="text-gray-500">
                {docType} No.{" "}
                <span className="font-semibold text-gray-900">{invoiceNo}</span>
              </p>
              <p className="mt-1 text-gray-500">
                Date: <span className="text-gray-900">{formatDate(issueDate)}</span>
              </p>
              <p className="text-gray-500">
                Due: <span className="text-gray-900">{formatDate(dueDate)}</span>
              </p>
              <p className="mt-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : status === "Overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {status}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-2 sm:px-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Bill to
            </p>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {client.name || "Client name"}
            </p>
            <div className="mt-1 space-y-0.5 text-sm text-gray-600">
              {client.address && <p>{client.address}</p>}
              {client.city && <p>{client.city}</p>}
              {client.email && <p>{client.email}</p>}
              {client.phone && <p>{client.phone}</p>}
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Amount due
            </p>
            <p className="mt-1 text-3xl font-bold text-blue-700">{formatNgn(total)}</p>
            <p className="text-xs text-gray-500">Currency: Nigerian Naira (NGN)</p>
          </div>
        </div>

        <div className="px-6 sm:px-10">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
                <th className="py-3 pr-2 font-semibold">Description</th>
                <th className="py-3 px-2 text-right font-semibold">Qty</th>
                <th className="py-3 px-2 text-right font-semibold">Unit</th>
                <th className="py-3 pl-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-gray-100">
                  <td className="py-3 pr-2 text-gray-800">
                    {it.description || "—"}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-700">{it.qty || 0}</td>
                  <td className="py-3 px-2 text-right text-gray-700">
                    {formatNgn(it.unitPrice || 0)}
                  </td>
                  <td className="py-3 pl-2 text-right font-medium text-gray-900">
                    {formatNgn((it.qty || 0) * (it.unitPrice || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-xs space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatNgn(subtotal)}</span>
              </div>
              {taxPercent > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({taxPercent}%)</span>
                  <span>{formatNgn(taxAmount)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span>-{formatNgn(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{formatNgn(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 border-t border-gray-100 px-6 py-6 sm:grid-cols-2 sm:px-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Payment method
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{paymentLabel}</p>
            {payment.method === "bank" && (
              <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                {payment.bankName && <p>Bank: {payment.bankName}</p>}
                {payment.accountName && <p>Account name: {payment.accountName}</p>}
                {payment.accountNumber && (
                  <p>Account number: {payment.accountNumber}</p>
                )}
              </div>
            )}
            {payment.otherNote && (
              <p className="mt-1 text-sm text-gray-600">{payment.otherNote}</p>
            )}
            {payment.method === "cash" && (
              <p className="mt-1 text-sm text-gray-600">Pay in cash to the business.</p>
            )}
          </div>
          <div>
            {notes && (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Notes
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{notes}</p>
              </>
            )}
            {terms && (
              <>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Terms
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{terms}</p>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 text-center text-[10px] text-gray-400 sm:px-10">
          Generated with {TOOLS_CONFIG.brand} Invoice Tool · {TOOLS_CONFIG.siteUrl}/tools/invoice-generator
        </div>
      </div>

      <div className="invoice-no-print">
        <LeadForm
          tool="Invoice Generator"
          resultSummary={`${docType} ${invoiceNo}`}
          defaultMessage="Hi DoyinTech, I used your invoice generator and need a custom billing system or website."
        />
      </div>
    </div>
  );
}
