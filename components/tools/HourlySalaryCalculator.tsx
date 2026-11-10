"use client";

import { useState } from "react";
import Link from "next/link";
import CurrencySelect, { useLocalCurrency } from "@/components/tools/CurrencySelect";
import { formatMoney } from "@/lib/global/currencies";
import { PAY_UNITS, convertPay, type PayUnit } from "@/lib/global/pay-rates";

const num = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;
const field = "mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link";

/** Hourly ↔ daily ↔ weekly ↔ monthly ↔ yearly pay, for any working pattern. */
export default function HourlySalaryCalculator() {
  const [currency, setCurrency] = useLocalCurrency();
  const [amount, setAmount] = useState("25");
  const [unit, setUnit] = useState<PayUnit>("hour");
  const [hours, setHours] = useState("40");
  const [days, setDays] = useState("5");
  const [weeks, setWeeks] = useState("52");

  const out = convertPay(num(amount), unit, { hoursPerWeek: num(hours), daysPerWeek: num(days), weeksPerYear: num(weeks) });

  const btn = (on: boolean) =>
    `min-h-10 rounded-full px-4 text-[13px] font-semibold transition ${on ? "bg-brand-accent text-black" : "border border-brand-ink/15 text-brand-soft hover:border-brand-ink/35"}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-5 rounded-2xl border border-brand-ink/10 bg-brand-surface p-5">
        <div role="radiogroup" aria-label="I am paid" className="flex flex-wrap gap-2">
          {PAY_UNITS.map((p) => (
            <button key={p.unit} type="button" role="radio" aria-checked={unit === p.unit} onClick={() => setUnit(p.unit)} className={btn(unit === p.unit)}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
          <label className="block text-[12px] font-medium text-brand-muted">
            {PAY_UNITS.find((p) => p.unit === unit)?.label} pay
            <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={field + " py-3 text-[20px] font-semibold"} />
          </label>
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="block text-[12px] font-medium text-brand-muted">Hours a week<input inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} className={field} /></label>
          <label className="block text-[12px] font-medium text-brand-muted">Days a week<input inputMode="decimal" value={days} onChange={(e) => setDays(e.target.value)} className={field} /></label>
          <label className="block text-[12px] font-medium text-brand-muted">Paid weeks a year<input inputMode="decimal" value={weeks} onChange={(e) => setWeeks(e.target.value)} className={field} /></label>
        </div>
        <p className="text-[13px] text-brand-muted">Use 52 paid weeks if your holidays are paid; take off unpaid weeks if they are not.</p>
      </div>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <dl className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-5 text-[15px]">
          {PAY_UNITS.map((p) => (
            <div key={p.unit} className={`flex justify-between gap-3 py-2 ${p.unit === "year" ? "mt-1 border-t border-brand-ink/10 pt-3" : ""}`}>
              <dt className="text-brand-muted">{p.label}</dt>
              <dd className={p.unit === "year" ? "text-[24px] font-semibold text-brand-link" : "font-medium text-brand-ink"}>{formatMoney(out[p.unit], currency)}</dd>
            </div>
          ))}
        </dl>
        <Link href="/tools/freelance-rate-calculator" className="inline-flex min-h-11 items-center rounded-full border border-brand-ink/15 px-5 text-[14px] font-semibold text-brand-ink hover:border-brand-link">
          Going freelance? Work out your rate
        </Link>
      </div>
    </div>
  );
}
