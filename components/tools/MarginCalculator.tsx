"use client";

import { useState } from "react";
import CurrencySelect, { useLocalCurrency } from "@/components/tools/CurrencySelect";
import { formatMoney } from "@/lib/global/currencies";
import { marginFromPrices, priceForMargin, priceForMarkup } from "@/lib/global/money-tools";

const num = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;
const field = "mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link";
type Mode = "price" | "margin" | "markup";

/** Margin and markup from cost and price, or the price that hits a target margin or markup. */
export default function MarginCalculator() {
  const [currency, setCurrency] = useLocalCurrency();
  const [mode, setMode] = useState<Mode>("price");
  const [cost, setCost] = useState("60");
  const [price, setPrice] = useState("100");
  const [target, setTarget] = useState("40");

  const c = num(cost);
  const sell = mode === "price" ? num(price) : mode === "margin" ? priceForMargin(c, num(target)) : priceForMarkup(c, num(target));
  const r = marginFromPrices(c, sell);
  const money = (n: number) => formatMoney(n, currency);

  const btn = (on: boolean) =>
    `min-h-10 rounded-full px-4 text-[13px] font-semibold transition ${on ? "bg-brand-accent text-black" : "border border-brand-ink/15 text-brand-soft hover:border-brand-ink/35"}`;
  const modes: [Mode, string][] = [["price", "I know my price"], ["margin", "Price for a margin"], ["markup", "Price for a markup"]];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-5 rounded-2xl border border-brand-ink/10 bg-brand-surface p-5">
        <div role="radiogroup" aria-label="Calculation" className="flex flex-wrap gap-2">
          {modes.map(([m, label]) => (
            <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className={btn(mode === m)}>{label}</button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[12px] font-medium text-brand-muted">Cost per item<input inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} className={field + " py-3 text-[20px] font-semibold"} /></label>
          <CurrencySelect value={currency} onChange={setCurrency} />
          {mode === "price" ? (
            <label className="block text-[12px] font-medium text-brand-muted">Selling price<input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={field} /></label>
          ) : (
            <label className="block text-[12px] font-medium text-brand-muted">Target {mode} (%)<input inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} className={field} /></label>
          )}
        </div>
        {mode === "margin" && num(target) >= 100 && <p className="text-[13px] text-red-300">A margin must be below 100%.</p>}
      </div>

      <dl className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-5 text-[15px] lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Selling price</dt><dd className="text-brand-ink">{money(sell)}</dd></div>
        <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Profit per item</dt><dd className={r.profit < 0 ? "text-red-300" : "text-brand-ink"}>{money(r.profit)}</dd></div>
        <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Markup (on cost)</dt><dd className="text-brand-ink">{r.markup.toFixed(1)}%</dd></div>
        <div className="mt-2 flex justify-between gap-3 border-t border-brand-ink/10 pt-3"><dt className="text-brand-muted">Profit margin</dt><dd className="text-[28px] font-semibold text-brand-link">{r.margin.toFixed(1)}%</dd></div>
      </dl>
    </div>
  );
}
