"use client";

import { useState } from "react";
import Link from "next/link";
import CurrencySelect, { useLocalCurrency } from "@/components/tools/CurrencySelect";
import { formatMoney } from "@/lib/global/currencies";
import { freelanceRate } from "@/lib/global/pay-rates";

const num = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;
const field = "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]";

/** The hourly and day rate a freelancer needs to reach a target income after tax and costs. */
export default function FreelanceRateCalculator() {
  const [currency, setCurrency] = useLocalCurrency();
  const [target, setTarget] = useState("60000");
  const [expenses, setExpenses] = useState("6000");
  const [tax, setTax] = useState("25");
  const [billable, setBillable] = useState("25");
  const [weeksOff, setWeeksOff] = useState("6");
  const [hoursPerDay, setHoursPerDay] = useState("7");

  const r = freelanceRate({
    targetIncome: num(target),
    expenses: num(expenses),
    taxPercent: num(tax),
    billableHoursPerWeek: num(billable),
    weeksOff: num(weeksOff),
    hoursPerDay: num(hoursPerDay),
  });
  const money = (n: number) => formatMoney(n, currency);
  const quote = r.hourly * 40;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4 rounded-2xl border border-white/10 bg-brand-surface p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[12px] font-medium text-brand-muted">Income you want to keep a year<input inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} className={field + " text-[18px] font-semibold"} /></label>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <label className="block text-[12px] font-medium text-brand-muted">Business costs a year<input inputMode="decimal" value={expenses} onChange={(e) => setExpenses(e.target.value)} className={field} /></label>
          <label className="block text-[12px] font-medium text-brand-muted">Tax and contributions (%)<input inputMode="decimal" value={tax} onChange={(e) => setTax(e.target.value)} className={field} /></label>
          <label className="block text-[12px] font-medium text-brand-muted">Billable hours a week<input inputMode="decimal" value={billable} onChange={(e) => setBillable(e.target.value)} className={field} /></label>
          <label className="block text-[12px] font-medium text-brand-muted">Weeks off a year<input inputMode="decimal" value={weeksOff} onChange={(e) => setWeeksOff(e.target.value)} className={field} /></label>
          <label className="block text-[12px] font-medium text-brand-muted">Hours in a working day<input inputMode="decimal" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} className={field} /></label>
        </div>
        <p className="text-[13px] leading-relaxed text-brand-muted">
          Most freelancers bill 20–30 hours of a 40-hour week; the rest goes on sales, admin and email. Weeks off cover holidays, sick days and gaps between clients.
        </p>
      </div>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <div className="rounded-2xl border border-white/10 bg-brand-surface p-5">
          <p className="text-[13px] text-brand-muted">Charge at least</p>
          <p className="mt-1 text-[32px] font-semibold text-[#ff8c14]">{money(r.hourly)}<span className="text-[15px] font-medium text-brand-muted"> / hour</span></p>
          <p className="text-[15px] text-white">{money(r.daily)} a day</p>
        </div>
        <dl className="rounded-2xl border border-white/10 bg-brand-surface p-5 text-[14px]">
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Revenue you need a year</dt><dd className="text-white">{money(r.revenueNeeded)}</dd></div>
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Billable hours a year</dt><dd className="text-white">{Math.round(r.billableHours).toLocaleString()}</dd></div>
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Working weeks</dt><dd className="text-white">{r.workingWeeks}</dd></div>
          <div className="flex justify-between gap-3 border-t border-white/10 pt-2.5"><dt className="text-brand-muted">A 40-hour project at this rate</dt><dd className="font-semibold text-white">{money(quote)}</dd></div>
        </dl>
        <Link href={`/tools/invoice-generator?currency=${currency}`} className="inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">
          Invoice a client in {currency}
        </Link>
      </div>
    </div>
  );
}
