"use client";

import type { Contact, Invoice } from "@/lib/ops/types";
import { formatNgn } from "@/lib/ops/store";

type Props = {
  orgName: string;
  invoice: Invoice;
  client: Contact | undefined;
  onClose: () => void;
};

export default function InvoicePrint({ orgName, invoice, client, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/80 p-4 print:static print:bg-white print:p-0">
      <div className="w-full max-w-2xl">
        <div className="mb-3 flex justify-end gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-[#ff8c14] px-5 py-2 text-sm font-semibold text-black"
          >
            Print / Save PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/30 px-5 py-2 text-sm text-white"
          >
            Close
          </button>
        </div>

        <article
          id="doyinops-invoice-print"
          className="rounded-2xl border border-white/10 bg-white p-8 text-black shadow-xl print:rounded-none print:border-0 print:shadow-none"
        >
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Invoice
              </p>
              <h1 className="mt-1 text-2xl font-bold">{orgName}</h1>
              <p className="mt-1 text-sm text-gray-600">Powered by DoyinOps · DoyinTech</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{invoice.number}</p>
              <p className="text-gray-600">Status: {invoice.status}</p>
              <p className="text-gray-600">Due: {invoice.dueDate}</p>
            </div>
          </header>

          <section className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">Bill to</p>
              <p className="mt-1 font-semibold">{client?.name || "Client"}</p>
              {client?.business && <p className="text-sm text-gray-700">{client.business}</p>}
              {client?.phone && <p className="text-sm text-gray-700">{client.phone}</p>}
              {client?.email && <p className="text-sm text-gray-700">{client.email}</p>}
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase text-gray-500">Amount due</p>
              <p className="mt-1 text-3xl font-bold text-orange-600">
                {formatNgn(invoice.amountNgn)}
              </p>
            </div>
          </section>

          <table className="mt-8 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-2 font-semibold">Description</th>
                <th className="py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3">{invoice.description}</td>
                <td className="py-3 text-right">{formatNgn(invoice.amountNgn)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-4 font-semibold">Total</td>
                <td className="pt-4 text-right text-lg font-bold">
                  {formatNgn(invoice.amountNgn)}
                </td>
              </tr>
            </tfoot>
          </table>

          <p className="mt-10 text-xs text-gray-500">
            Created {invoice.createdAt.slice(0, 10)}
            {invoice.paidAt ? ` · Paid ${invoice.paidAt.slice(0, 10)}` : ""}. Thank you for your
            business.
          </p>
        </article>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * { visibility: hidden !important; }
              #doyinops-invoice-print, #doyinops-invoice-print * { visibility: visible !important; }
              #doyinops-invoice-print {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
              }
            }
          `,
        }}
      />
    </div>
  );
}
