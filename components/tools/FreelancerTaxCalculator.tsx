"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RENT_RELIEF_CAP, RENT_RELIEF_RATE, naira, taxOnTaxableIncome } from "@/lib/tax/paye2026";

const field =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[15px] text-white outline-none focus:border-[#ff8c14]";

const num = (v: string) => {
  const n = Number(v.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** Days until 31 March of the filing year (returns for the previous calendar year). */
function filingDeadline(now = new Date()) {
  const year = now.getMonth() > 2 ? now.getFullYear() + 1 : now.getFullYear();
  const deadline = new Date(year, 2, 31, 23, 59);
  const days = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000));
  return { incomeYear: year - 1, label: `31 March ${year}`, days };
}

/**
 * Self-employed / freelancer income tax under the Nigeria Tax Act 2025: same progressive
 * bands as PAYE, charged on profit (income minus allowable business expenses) after reliefs.
 */
export default function FreelancerTaxCalculator() {
  const [income, setIncome] = useState("9000000");
  const [expenses, setExpenses] = useState("1500000");
  const [rent, setRent] = useState("1200000");
  const [pension, setPension] = useState("");
  const [nhis, setNhis] = useState("");

  const deadline = useMemo(() => filingDeadline(), []);

  const r = useMemo(() => {
    const profit = Math.max(0, num(income) - num(expenses));
    const rentRelief = Math.min(num(rent) * RENT_RELIEF_RATE, RENT_RELIEF_CAP);
    const reliefs = rentRelief + num(pension) + num(nhis);
    const taxable = Math.max(0, profit - reliefs);
    const { tax, bands } = taxOnTaxableIncome(taxable);
    return { profit, rentRelief, reliefs, taxable, tax, bands, monthly: tax / 12 };
  }, [income, expenses, rent, pension, nhis]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#ff8c14]/40 bg-[#ff8c14]/10 px-5 py-4 text-[14px] text-white">
        {/* Day count is computed at build time and again in the browser; the browser value wins. */}
        <span suppressHydrationWarning>
          {`${deadline.days} days until the ${deadline.label} deadline to file your ${deadline.incomeYear} income tax return.`}
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[13px] text-[#a1a1a6]">
            Total income for the year (₦)
            <span className="block text-[11px] text-[#86868b]">All clients, local and foreign, converted to naira</span>
            <input inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Business expenses (₦)
            <span className="block text-[11px] text-[#86868b]">Internet, software, equipment, workspace — keep receipts</span>
            <input inputMode="numeric" value={expenses} onChange={(e) => setExpenses(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Annual rent you pay (₦)
            <input inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Voluntary pension contributions (₦)
            <input inputMode="numeric" value={pension} onChange={(e) => setPension(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Health insurance premiums (₦)
            <input inputMode="numeric" value={nhis} onChange={(e) => setNhis(e.target.value)} className={field} />
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Tax for the year" value={naira(r.tax)} highlight />
        <Stat label="Set aside monthly" value={naira(r.monthly)} />
        <Stat label="Taxable income" value={naira(r.taxable)} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-[14px]">
          <caption className="sr-only">Freelancer tax breakdown</caption>
          <tbody className="divide-y divide-white/10 text-[#c7cdd8]">
            <Row label="Income" value={naira(num(income))} />
            <Row label="Less business expenses" value={`− ${naira(num(expenses))}`} />
            <Row label="Profit" value={naira(r.profit)} strong />
            <Row label="Less rent relief (20%, max ₦500k)" value={`− ${naira(r.rentRelief)}`} />
            {num(pension) > 0 && <Row label="Less pension" value={`− ${naira(num(pension))}`} />}
            {num(nhis) > 0 && <Row label="Less health insurance" value={`− ${naira(num(nhis))}`} />}
            <Row label="Taxable income" value={naira(r.taxable)} strong />
            {r.bands
              .filter((b) => b.taxable > 0)
              .map((b) => (
                <Row key={b.from} label={`${(b.rate * 100).toFixed(0)}% on ${naira(b.taxable)}`} value={naira(b.tax)} muted />
              ))}
            <Row label="Income tax due" value={naira(r.tax)} strong />
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[14px] text-[#a1a1a6]">
        Records make filing easy: issue every client a proper{" "}
        <Link href="/tools/invoice-generator-nigeria" className="text-[#ff8c14] hover:underline">invoice</Link> and keep{" "}
        <Link href="/tools/receipt-generator-nigeria" className="text-[#ff8c14] hover:underline">receipts</Link> for expenses.
        Branded invoices, receipts and every premium tool come with{" "}
        <Link href="/pro" className="text-[#ff8c14] hover:underline">DoyinTech Pro</Link>.
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-[#ff8c14]/40 bg-[#ff8c14]/10" : "border-white/10 bg-white/[0.03]"}`}>
      <p className="text-[12px] uppercase tracking-wide text-[#86868b]">{label}</p>
      <p className="mt-1 text-[24px] font-semibold text-white">{value}</p>
    </div>
  );
}

function Row({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <tr className={strong ? "bg-white/[0.04]" : ""}>
      <td className={`px-4 py-2.5 ${muted ? "pl-8 text-[#86868b]" : ""} ${strong ? "font-semibold text-white" : ""}`}>{label}</td>
      <td className={`px-4 py-2.5 text-right ${strong ? "font-semibold text-white" : muted ? "text-[#86868b]" : ""}`}>{value}</td>
    </tr>
  );
}
