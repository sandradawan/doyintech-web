"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getSalaryCountry } from "@/lib/global/salary";

type Period = "year" | "month";

/** Take-home pay for one country; the country's engine lives in lib/global/salary. */
export default function SalaryCalculator({ slug }: { slug: string }) {
  const c = getSalaryCountry(slug)!;
  const [amount, setAmount] = useState(String(c.example));
  const [period, setPeriod] = useState<Period>("year");
  const [married, setMarried] = useState(false);

  const fmt = useMemo(() => new Intl.NumberFormat(c.locale, { style: "currency", currency: c.currency, maximumFractionDigits: 0 }), [c]);
  const typed = parseFloat(amount.replace(/,/g, "")) || 0;
  const gross = period === "year" ? typed : typed * 12;
  const r = c.calc(gross, { married });
  const deducted = gross - r.net;
  const rate = gross > 0 ? (deducted / gross) * 100 : 0;

  const btn = (on: boolean) =>
    `min-h-10 rounded-full px-4 text-[13px] font-semibold transition ${on ? "bg-[#ff8c14] text-black" : "border border-white/15 text-[#c7cdd8] hover:border-white/35"}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-5 rounded-2xl border border-white/10 bg-[#141a28] p-5">
        <div role="radiogroup" aria-label="Salary period" className="flex flex-wrap gap-2">
          <button type="button" role="radio" aria-checked={period === "year"} onClick={() => setPeriod("year")} className={btn(period === "year")}>Yearly salary</button>
          <button type="button" role="radio" aria-checked={period === "month"} onClick={() => setPeriod("month")} className={btn(period === "month")}>Monthly salary</button>
        </div>
        <label className="block text-[12px] font-medium text-[#a1a1a6]">
          Gross {period === "year" ? "yearly" : "monthly"} salary ({c.currency})
          <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-3 text-[20px] font-semibold text-white outline-none focus:border-[#ff8c14]" />
        </label>
        {c.hasFilingStatus && (
          <div role="radiogroup" aria-label="Filing status" className="flex flex-wrap gap-2">
            <button type="button" role="radio" aria-checked={!married} onClick={() => setMarried(false)} className={btn(!married)}>Single</button>
            <button type="button" role="radio" aria-checked={married} onClick={() => setMarried(true)} className={btn(married)}>Married filing jointly</button>
          </div>
        )}
        <p className="text-[13px] leading-relaxed text-[#a1a1a6]">Includes {c.covers}. Tax year {c.taxYear}.</p>
      </div>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <p className="text-[13px] text-[#a1a1a6]">Take-home pay</p>
          <p className="mt-1 text-[32px] font-semibold text-[#ff8c14]">{fmt.format(r.net / 12)}<span className="text-[15px] font-medium text-[#a1a1a6]"> / month</span></p>
          <p className="text-[14px] text-white">{fmt.format(r.net)} a year · {fmt.format(r.net / 52)} a week</p>
        </div>
        <table className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#141a28] text-[14px]">
          <thead>
            <tr className="text-left text-[#a1a1a6]"><th className="px-4 py-2.5 font-medium" scope="col"> </th><th className="px-4 py-2.5 text-right font-medium" scope="col">Year</th><th className="px-4 py-2.5 text-right font-medium" scope="col">Month</th></tr>
          </thead>
          <tbody>
            <tr className="border-t border-white/5"><th scope="row" className="px-4 py-2 text-left font-normal text-white">Gross pay</th><td className="px-4 py-2 text-right">{fmt.format(gross)}</td><td className="px-4 py-2 text-right">{fmt.format(gross / 12)}</td></tr>
            {r.lines.map((l) => (
              <tr key={l.label} className="border-t border-white/5"><th scope="row" className="px-4 py-2 text-left font-normal text-[#c7cdd8]">{l.label}</th><td className="px-4 py-2 text-right">−{fmt.format(l.amount)}</td><td className="px-4 py-2 text-right">−{fmt.format(l.amount / 12)}</td></tr>
            ))}
            <tr className="border-t border-white/10 font-semibold text-white"><th scope="row" className="px-4 py-2.5 text-left">Take-home pay</th><td className="px-4 py-2.5 text-right">{fmt.format(r.net)}</td><td className="px-4 py-2.5 text-right">{fmt.format(r.net / 12)}</td></tr>
          </tbody>
        </table>
        <p className="text-[13px] text-[#a1a1a6]">You keep {(100 - rate).toFixed(1)}% of your gross pay; {rate.toFixed(1)}% goes to tax and contributions.</p>
        <Link href={`/tools/invoice-generator?currency=${c.currency}`} className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-[14px] font-semibold text-white hover:border-[#ff8c14]">
          Freelancing on the side? Make a {c.currency} invoice
        </Link>
      </div>
    </div>
  );
}
