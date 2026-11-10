"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RENT_RELIEF_CAP, RENT_RELIEF_RATE, naira, taxOnTaxableIncome } from "@/lib/tax/paye2026";

const field =
  "mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-[15px] text-brand-ink outline-none focus:border-brand-link";

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
      <div className="rounded-2xl border border-brand-link/40 bg-brand-link/10 px-5 py-4 text-[14px] text-brand-ink">
        {/* Day count is computed at build time and again in the browser; the browser value wins. */}
        <span suppressHydrationWarning>
          {`${deadline.days} days until the ${deadline.label} deadline to file your ${deadline.incomeYear} income tax return.`}
        </span>
      </div>

      <div className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[13px] text-brand-muted">
            Total income for the year (₦)
            <span className="block text-[11px] text-brand-subtle">All clients, local and foreign, converted to naira</span>
            <input inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-brand-muted">
            Business expenses (₦)
            <span className="block text-[11px] text-brand-subtle">Internet, software, equipment, workspace — keep receipts</span>
            <input inputMode="numeric" value={expenses} onChange={(e) => setExpenses(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-brand-muted">
            Annual rent you pay (₦)
            <input inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-brand-muted">
            Voluntary pension contributions (₦)
            <input inputMode="numeric" value={pension} onChange={(e) => setPension(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-brand-muted">
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

      <div className="overflow-hidden rounded-2xl border border-brand-ink/10">
        <table className="w-full text-left text-[14px]">
          <caption className="sr-only">Freelancer tax breakdown</caption>
          <tbody className="divide-y divide-brand-ink/10 text-brand-soft">
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

      <div className="rounded-2xl border border-brand-ink/10 bg-brand-ink/[0.03] p-5 text-[14px] text-brand-muted">
        Records make filing easy: issue every client a proper{" "}
        <Link href="/tools/invoice-generator-nigeria" className="text-brand-link hover:underline">invoice</Link> and keep{" "}
        <Link href="/tools/receipt-generator-nigeria" className="text-brand-link hover:underline">receipts</Link> for expenses.
        Branded invoices, receipts and every premium tool come with{" "}
        <Link href="/pro" className="text-brand-link hover:underline">DoyinTech Pro</Link>.
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-brand-link/40 bg-brand-link/10" : "border-brand-ink/10 bg-brand-ink/[0.03]"}`}>
      <p className="text-[12px] uppercase tracking-wide text-brand-subtle">{label}</p>
      <p className="mt-1 text-[24px] font-semibold text-brand-ink">{value}</p>
    </div>
  );
}

function Row({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <tr className={strong ? "bg-brand-ink/[0.04]" : ""}>
      <td className={`px-4 py-2.5 ${muted ? "pl-8 text-brand-subtle" : ""} ${strong ? "font-semibold text-brand-ink" : ""}`}>{label}</td>
      <td className={`px-4 py-2.5 text-right ${strong ? "font-semibold text-brand-ink" : muted ? "text-brand-subtle" : ""}`}>{value}</td>
    </tr>
  );
}
