"use client";

import { useState } from "react";
import Link from "next/link";
import CurrencySelect, { useLocalCurrency } from "@/components/tools/CurrencySelect";
import { formatMoney } from "@/lib/global/currencies";
import { daysLate, lateInterest, ukCompensation } from "@/lib/global/money-tools";

const num = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;
const field = "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]";
const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Interest and compensation owed on a late invoice: UK statutory or any contract rate. */
export default function LatePaymentCalculator() {
  const [currency, setCurrency] = useLocalCurrency("GBP");
  const [mode, setMode] = useState<"uk" | "custom">("uk");
  const [amount, setAmount] = useState("2500");
  const [baseRate, setBaseRate] = useState("3.75");
  const [customRate, setCustomRate] = useState("10");
  const [due, setDue] = useState(() => iso(new Date(Date.now() - 45 * 86400000)));
  const [paid, setPaid] = useState(() => iso(new Date()));

  const rate = mode === "uk" ? 8 + num(baseRate) : num(customRate);
  const days = daysLate(due, paid);
  const { daily, interest } = lateInterest(num(amount), rate, days);
  const compensation = mode === "uk" ? ukCompensation(num(amount)) : 0;
  const money = (n: number) => formatMoney(n, currency);

  const btn = (on: boolean) =>
    `min-h-10 rounded-full px-4 text-[13px] font-semibold transition ${on ? "bg-[#ff8c14] text-black" : "border border-white/15 text-brand-soft hover:border-white/35"}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-5 rounded-2xl border border-white/10 bg-brand-surface p-5">
        <div role="radiogroup" aria-label="Interest rule" className="flex flex-wrap gap-2">
          <button type="button" role="radio" aria-checked={mode === "uk"} onClick={() => setMode("uk")} className={btn(mode === "uk")}>UK statutory interest</button>
          <button type="button" role="radio" aria-checked={mode === "custom"} onClick={() => setMode("custom")} className={btn(mode === "custom")}>My contract rate</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[12px] font-medium text-brand-muted">Invoice amount<input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={field + " py-3 text-[20px] font-semibold"} /></label>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <label className="block text-[12px] font-medium text-brand-muted">Payment was due<input type="date" value={due} onChange={(e) => setDue(e.target.value)} className={field} /></label>
          <label className="block text-[12px] font-medium text-brand-muted">Paid (or today)<input type="date" value={paid} onChange={(e) => setPaid(e.target.value)} className={field} /></label>
          {mode === "uk" ? (
            <label className="block text-[12px] font-medium text-brand-muted">Bank of England base rate (%)<input inputMode="decimal" value={baseRate} onChange={(e) => setBaseRate(e.target.value)} className={field} /></label>
          ) : (
            <label className="block text-[12px] font-medium text-brand-muted">Yearly interest rate (%)<input inputMode="decimal" value={customRate} onChange={(e) => setCustomRate(e.target.value)} className={field} /></label>
          )}
        </div>
        {mode === "uk" && (
          <p className="text-[13px] leading-relaxed text-brand-muted">
            UK businesses can charge 8% plus the Bank of England base rate on 30 June (for debts that fall due July–December) or 31 December (January–June). 3.75% applied on 30 June 2026; check the current reference rate before you claim.
          </p>
        )}
      </div>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <dl className="rounded-2xl border border-white/10 bg-brand-surface p-5 text-[15px]">
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Days late</dt><dd className="text-white">{days}</dd></div>
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Interest rate</dt><dd className="text-white">{rate.toFixed(2)}% a year</dd></div>
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Interest per day</dt><dd className="text-white">{money(daily)}</dd></div>
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Interest owed</dt><dd className="text-white">{money(interest)}</dd></div>
          {mode === "uk" && <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Fixed compensation</dt><dd className="text-white">{money(compensation)}</dd></div>}
          <div className="mt-2 flex justify-between gap-3 border-t border-white/10 pt-3"><dt className="text-brand-muted">Total you can claim</dt><dd className="text-[26px] font-semibold text-[#ff8c14]">{money(num(amount) + interest + compensation)}</dd></div>
        </dl>
        <Link href="/get-paid" className="inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">
          Stop chasing: add a payment link to invoices
        </Link>
      </div>
    </div>
  );
}
