"use client";

import { useState } from "react";
import CurrencySelect, { useLocalCurrency } from "@/components/tools/CurrencySelect";
import { formatMoney, samplePrice } from "@/lib/global/currencies";
import { breakEven } from "@/lib/global/money-tools";

const num = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;
const field = "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]";

/** Units and sales needed to cover fixed costs, optionally with a profit target. */
export default function BreakEvenCalculator() {
  const [currency, setCurrency] = useLocalCurrency();
  const [fixed, setFixed] = useState("5000");
  const [price, setPrice] = useState("40");
  const [variable, setVariable] = useState("15");
  const [profit, setProfit] = useState("");

  const r = breakEven(num(fixed), num(price), num(variable), num(profit));
  const money = (n: number) => formatMoney(n, currency);
  const large = samplePrice(currency) > 1500;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-brand-surface p-5 sm:grid-cols-2">
        <label className="block text-[12px] font-medium text-brand-muted">Fixed costs a month<input inputMode="decimal" value={fixed} onChange={(e) => setFixed(e.target.value)} className={field + " py-3 text-[20px] font-semibold"} /></label>
        <CurrencySelect value={currency} onChange={setCurrency} />
        <label className="block text-[12px] font-medium text-brand-muted">Price per unit<input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={field} /></label>
        <label className="block text-[12px] font-medium text-brand-muted">Variable cost per unit<input inputMode="decimal" value={variable} onChange={(e) => setVariable(e.target.value)} className={field} /></label>
        <label className="block text-[12px] font-medium text-brand-muted sm:col-span-2">Profit you want a month (optional)<input inputMode="decimal" value={profit} placeholder={large ? "e.g. 500000" : "e.g. 2000"} onChange={(e) => setProfit(e.target.value)} className={field} /></label>
        <p className="text-[13px] leading-relaxed text-brand-muted sm:col-span-2">Fixed costs stay the same however much you sell: rent, salaries, software. Variable costs rise with each sale: stock, packaging, delivery, card fees.</p>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        {r ? (
          <dl className="rounded-2xl border border-white/10 bg-brand-surface p-5 text-[15px]">
            <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Contribution per unit</dt><dd className="text-white">{money(r.contribution)} ({r.contributionRatio.toFixed(0)}%)</dd></div>
            <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Sales needed a month</dt><dd className="text-white">{money(r.revenue)}</dd></div>
            <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">That is about a day</dt><dd className="text-white">{Math.ceil(r.units / 30).toLocaleString("en")} units</dd></div>
            <div className="mt-2 flex justify-between gap-3 border-t border-white/10 pt-3"><dt className="text-brand-muted">{num(profit) > 0 ? "Units to hit your profit" : "Break-even units"}</dt><dd className="text-[28px] font-semibold text-[#ff8c14]">{r.units.toLocaleString("en")}</dd></div>
          </dl>
        ) : (
          <p className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-[14px] text-red-200">Your price must be higher than the variable cost per unit, or every sale loses money.</p>
        )}
      </div>
    </div>
  );
}
