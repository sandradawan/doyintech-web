"use client";

import { useState } from "react";
import CurrencySelect, { useLocalCurrency } from "@/components/tools/CurrencySelect";
import { formatMoney } from "@/lib/global/currencies";
import { loanSchedule } from "@/lib/global/money-tools";

const num = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;
const field = "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]";

/** Monthly repayment, total interest and a year-by-year schedule for a fixed-rate loan. */
export default function LoanCalculator() {
  const [currency, setCurrency] = useLocalCurrency();
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("8");
  const [term, setTerm] = useState("3");
  const [unit, setUnit] = useState<"years" | "months">("years");

  const months = unit === "years" ? num(term) * 12 : num(term);
  const l = loanSchedule(num(amount), num(rate), months);
  const money = (n: number) => formatMoney(n, currency);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-brand-surface p-5 sm:grid-cols-2">
          <label className="block text-[12px] font-medium text-brand-muted">Loan amount<input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={field + " py-3 text-[20px] font-semibold"} /></label>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <label className="block text-[12px] font-medium text-brand-muted">Interest rate (% a year)<input inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={field} /></label>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <label className="block text-[12px] font-medium text-brand-muted">Term<input inputMode="numeric" value={term} onChange={(e) => setTerm(e.target.value)} className={field} /></label>
            <label className="block text-[12px] font-medium text-brand-muted">
              <span className="sr-only">Term unit</span>&nbsp;
              <select value={unit} onChange={(e) => setUnit(e.target.value as "years" | "months")} className={field}>
                <option value="years">years</option>
                <option value="months">months</option>
              </select>
            </label>
          </div>
        </div>

        <dl className="rounded-2xl border border-white/10 bg-brand-surface p-5 text-[15px] lg:sticky lg:top-28 lg:self-start" aria-live="polite">
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Total interest</dt><dd className="text-white">{money(l.interest)}</dd></div>
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Total you repay</dt><dd className="text-white">{money(l.total)}</dd></div>
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Number of payments</dt><dd className="text-white">{Math.max(1, Math.round(months))}</dd></div>
          <div className="mt-2 flex justify-between gap-3 border-t border-white/10 pt-3"><dt className="text-brand-muted">Monthly payment</dt><dd className="text-[28px] font-semibold text-[#ff8c14]">{money(l.payment)}</dd></div>
        </dl>
      </div>

      {l.years.length > 1 && l.years.length <= 40 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-brand-surface p-5">
          <h2 className="text-[16px] font-semibold text-white">Year by year</h2>
          <table className="mt-3 w-full min-w-[420px] text-left text-[14px]">
            <thead><tr className="border-b border-white/10 text-brand-muted"><th className="py-2 font-medium">Year</th><th className="py-2 font-medium">Principal paid</th><th className="py-2 font-medium">Interest paid</th><th className="py-2 font-medium">Balance left</th></tr></thead>
            <tbody>
              {l.years.map((y) => (
                <tr key={y.year} className="border-b border-white/5 text-brand-soft"><td className="py-2 text-white">{y.year}</td><td className="py-2">{money(y.principal)}</td><td className="py-2">{money(y.interest)}</td><td className="py-2">{money(y.balance)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
