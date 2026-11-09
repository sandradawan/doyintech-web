"use client";

import { useMemo } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { FORECAST_WEEKS, cashForecast, type CashLine } from "@/lib/tools/bottleneck-calcs";
import { Field, esc, field, ghostBtn, num, panel, primaryBtn, useSavedState } from "./kit";

type Row = { label: string; kind: CashLine["kind"]; amount: string; freq: CashLine["freq"]; week: string };

const INITIAL = {
  business: "",
  opening: "1500000",
  rows: [
    { label: "Customer sales", kind: "in", amount: "900000", freq: "weekly", week: "1" },
    { label: "Big client invoice", kind: "in", amount: "2500000", freq: "once", week: "6" },
    { label: "Salaries", kind: "out", amount: "2200000", freq: "monthly", week: "4" },
    { label: "Stock purchase", kind: "out", amount: "700000", freq: "weekly", week: "1" },
    { label: "Rent", kind: "out", amount: "1800000", freq: "once", week: "2" },
    { label: "Fuel and power", kind: "out", amount: "120000", freq: "weekly", week: "1" },
  ] as Row[],
};

const k = (n: number) => (Math.abs(n) >= 1e6 ? `${(n / 1e6).toFixed(1)}m` : `${Math.round(n / 1000)}k`);
const naira0 = (n: number) => (n < 0 ? "-" : "") + "₦" + Math.abs(Math.round(n)).toLocaleString("en-NG");

export default function CashFlowForecast() {
  const [s, setS] = useSavedState("dt-cash-flow-13w", INITIAL);
  const rows = s.rows;
  const setRows = (r: Row[]) => setS({ ...s, rows: r });
  const setRow = (i: number, key: keyof Row, v: string) => setRows(rows.map((r, j) => (j === i ? { ...r, [key]: v } : r)));

  const f = useMemo(
    () => cashForecast(num(s.opening), rows.map((r) => ({ label: r.label, kind: r.kind, amount: num(r.amount), freq: r.freq, week: num(r.week) }))),
    [s.opening, rows]
  );

  const maxAbs = Math.max(1, ...f.weeks.map((w) => Math.abs(w.closing)));
  const hasNeg = f.weeks.some((w) => w.closing < 0);
  const H = 160;
  const zeroY = hasNeg ? H / 2 : H - 4;
  const scale = (hasNeg ? H / 2 - 8 : H - 12) / maxAbs;

  function print() {
    const td = "border:1px solid #ccc;padding:5px 7px;text-align:right";
    const html = `<div style="max-width:900px;margin:24px auto;font-size:13px">
      <h1 style="font-size:20px;margin:0">13-week cash flow forecast${s.business ? ": " + esc(s.business) : ""}</h1>
      <p style="color:#555">Opening balance ${naira0(num(s.opening))} · lowest point ${naira0(f.lowest.closing)} in week ${f.lowest.week}${f.firstNegative ? ` · <b style="color:#b00">cash runs out in week ${f.firstNegative.week}</b>` : ""}</p>
      <table style="border-collapse:collapse;width:100%"><tr><th style="${td};text-align:left">Week</th><th style="${td}">Opening</th><th style="${td}">Cash in</th><th style="${td}">Cash out</th><th style="${td}">Closing</th></tr>
      ${f.weeks.map((w) => `<tr><td style="${td};text-align:left">Week ${w.week}</td><td style="${td}">${naira0(w.opening)}</td><td style="${td}">${naira0(w.inflow)}</td><td style="${td}">${naira0(w.outflow)}</td><td style="${td};${w.closing < 0 ? "color:#b00;font-weight:bold" : ""}">${naira0(w.closing)}</td></tr>`).join("")}
      </table>
      <h2 style="font-size:15px;margin-top:20px">Assumptions</h2><ul>${rows.map((r) => `<li>${esc(r.label)}: ${r.kind === "in" ? "+" : "-"}${naira0(num(r.amount))} ${r.freq === "once" ? `once, week ${esc(r.week)}` : r.freq === "weekly" ? `every week from week ${esc(r.week)}` : `monthly, week ${esc(r.week)} of each month`}</li>`).join("")}</ul>
      <p style="color:#777;font-size:12px">doyintech.com/tools/cash-flow-forecast</p></div>`;
    printHtml("13-week cash flow forecast", html);
  }

  return (
    <div className="space-y-6">
      <div className={panel}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="Business name (optional)" value={s.business} onChange={(v) => setS({ ...s, business: v })} />
          <Field name="Cash in bank today (₦)" type="number" value={s.opening} onChange={(v) => setS({ ...s, opening: v })} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="text-left text-brand-muted">
                <th className="py-2 font-medium">Item</th>
                <th className="font-medium">In / out</th>
                <th className="font-medium">Amount (₦)</th>
                <th className="font-medium">How often</th>
                <th className="font-medium">Week</th>
                <th><span className="sr-only">Remove</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="pr-2"><input aria-label="Item" className={field} value={r.label} onChange={(e) => setRow(i, "label", e.target.value)} /></td>
                  <td className="pr-2">
                    <select aria-label="In or out" className={field} value={r.kind} onChange={(e) => setRow(i, "kind", e.target.value)}>
                      <option value="in">Cash in</option>
                      <option value="out">Cash out</option>
                    </select>
                  </td>
                  <td className="pr-2"><input aria-label="Amount" type="number" inputMode="decimal" className={field} value={r.amount} onChange={(e) => setRow(i, "amount", e.target.value)} /></td>
                  <td className="pr-2">
                    <select aria-label="How often" className={field} value={r.freq} onChange={(e) => setRow(i, "freq", e.target.value)}>
                      <option value="weekly">Every week</option>
                      <option value="monthly">Monthly</option>
                      <option value="once">Once</option>
                    </select>
                  </td>
                  <td className="w-24 pr-2">
                    <input aria-label={r.freq === "monthly" ? "Week of the month (1 to 4)" : "Week number"} type="number" min={1} max={r.freq === "monthly" ? 4 : FORECAST_WEEKS} className={field} value={r.week} onChange={(e) => setRow(i, "week", e.target.value)} />
                  </td>
                  <td>
                    <button type="button" aria-label={`Remove ${r.label || "row"}`} onClick={() => setRows(rows.filter((_, j) => j !== i))} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-muted hover:text-white">
                      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-brand-subtle">Week: for &quot;once&quot; the week it lands (1–13); for &quot;monthly&quot; the week of each month (1–4); for &quot;every week&quot; the week it starts.</p>
        <button type="button" className={ghostBtn} onClick={() => setRows([...rows, { label: "", kind: "out", amount: "", freq: "once", week: "1" }])}>+ Add item</button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-brand-surface p-5" aria-live="polite">
        {f.firstNegative ? (
          <p className="rounded-xl border border-[#ff6b6b]/40 bg-[#ff6b6b]/10 p-3 text-[14px] text-[#ffb3b3]">
            Cash runs out in <b>week {f.firstNegative.week}</b>. You need about <b>{naira0(-f.lowest.closing)}</b> more by week {f.lowest.week}: chase invoices, take deposits, or move a payment.
          </p>
        ) : (
          <p className="rounded-xl border border-[#3ddc97]/30 bg-[#3ddc97]/10 p-3 text-[14px] text-[#a8f0cf]">
            No cash gap in the next 13 weeks. Lowest balance: <b>{naira0(f.lowest.closing)}</b> in week {f.lowest.week}.
          </p>
        )}
        <svg role="img" aria-label="Closing cash balance for each of the next 13 weeks" viewBox={`0 0 ${FORECAST_WEEKS * 40} ${H + 18}`} className="mt-4 w-full">
          <line x1="0" x2={FORECAST_WEEKS * 40} y1={zeroY} y2={zeroY} stroke="rgba(255,255,255,0.2)" />
          {f.weeks.map((w, i) => {
            const h = Math.max(1, Math.abs(w.closing) * scale);
            const y = w.closing >= 0 ? zeroY - h : zeroY;
            return (
              <g key={w.week}>
                <rect x={i * 40 + 8} y={y} width="24" height={h} rx="3" fill={w.closing < 0 ? "#ff6b6b" : "#ff8c14"} />
                <text x={i * 40 + 20} y={H + 14} textAnchor="middle" fontSize="10" fill="#8b919c">W{w.week}</text>
                <title>{`Week ${w.week}: ${naira0(w.closing)}`}</title>
              </g>
            );
          })}
        </svg>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-right text-[13px]">
            <thead><tr className="text-brand-muted"><th className="py-1.5 text-left font-medium">Week</th><th className="font-medium">Cash in</th><th className="font-medium">Cash out</th><th className="font-medium">Closing</th></tr></thead>
            <tbody>
              {f.weeks.map((w) => (
                <tr key={w.week} className="border-t border-white/5">
                  <th scope="row" className="py-1.5 text-left font-medium text-white">Week {w.week}</th>
                  <td className="text-[#a8f0cf]">{k(w.inflow)}</td>
                  <td className="text-brand-soft">{k(w.outflow)}</td>
                  <td className={w.closing < 0 ? "font-semibold text-[#ff6b6b]" : "text-white"}>{naira0(w.closing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={print} className={`${primaryBtn} mt-4 w-full sm:w-auto`}>Download forecast PDF</button>
        <p className="mt-2 text-[12px] text-brand-subtle">Saved on this device only. Update it every Monday with your real bank balance.</p>
      </div>
    </div>
  );
}
