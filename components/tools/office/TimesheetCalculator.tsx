"use client";

import { useMemo, useState } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { Field, esc, field, ngn, num, panel, primaryBtn } from "./kit";

type Day = { day: string; start: string; end: string; brk: string };

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Minutes between two HH:MM times; handles shifts that cross midnight. */
export function shiftMinutes(start: string, end: string, breakMin: number) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let mins = eh * 60 + em - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60;
  return Math.max(0, mins - Math.max(0, breakMin));
}

const hrs = (m: number) => `${Math.floor(m / 60)}h ${String(Math.round(m % 60)).padStart(2, "0")}m`;

export default function TimesheetCalculator() {
  const [name, setName] = useState("");
  const [week, setWeek] = useState("");
  const [rate, setRate] = useState("1500");
  const [threshold, setThreshold] = useState("40");
  const [mult, setMult] = useState("1.5");
  const [days, setDays] = useState<Day[]>(DAYS.map((d, i) => ({ day: d, start: i < 5 ? "08:00" : "", end: i < 5 ? "17:00" : "", brk: i < 5 ? "60" : "0" })));

  const r = useMemo(() => {
    const perDay = days.map((d) => shiftMinutes(d.start, d.end, num(d.brk)));
    const total = perDay.reduce((s, m) => s + m, 0);
    const limit = num(threshold) * 60;
    const regular = Math.min(total, limit);
    const overtime = Math.max(0, total - limit);
    const rateN = num(rate);
    const regularPay = (regular / 60) * rateN;
    const otPay = (overtime / 60) * rateN * (num(mult) || 1);
    return { perDay, total, regular, overtime, regularPay, otPay, pay: regularPay + otPay };
  }, [days, rate, threshold, mult]);

  const setDay = (i: number, k: keyof Day, v: string) => setDays(days.map((d, j) => (j === i ? { ...d, [k]: v } : d)));

  function print() {
    const td = "border:1px solid #bbb;padding:6px 8px";
    const html = `<div style="max-width:720px;margin:32px auto;font-size:14px;color:#111">
      <h1 style="font-size:20px;margin:0">Weekly timesheet</h1><p style="color:#555;margin:4px 0 16px">${esc(name || "Employee")}${week ? " · week of " + esc(week) : ""}</p>
      <table style="width:100%;border-collapse:collapse"><tr><th style="${td};text-align:left">Day</th><th style="${td}">Start</th><th style="${td}">End</th><th style="${td}">Break (min)</th><th style="${td}">Hours</th></tr>
      ${days.map((d, i) => `<tr><td style="${td}">${d.day}</td><td style="${td};text-align:center">${esc(d.start)}</td><td style="${td};text-align:center">${esc(d.end)}</td><td style="${td};text-align:center">${esc(d.brk)}</td><td style="${td};text-align:right">${r.perDay[i] ? hrs(r.perDay[i]) : "—"}</td></tr>`).join("")}
      </table>
      <table style="margin-top:16px;margin-left:auto;font-size:14px">
        <tr><td style="padding:3px 12px">Regular hours</td><td style="text-align:right">${hrs(r.regular)}</td><td style="padding-left:16px;text-align:right">${ngn(r.regularPay)}</td></tr>
        <tr><td style="padding:3px 12px">Overtime (×${esc(mult)})</td><td style="text-align:right">${hrs(r.overtime)}</td><td style="padding-left:16px;text-align:right">${ngn(r.otPay)}</td></tr>
        <tr><td style="padding:3px 12px"><b>Total</b></td><td style="text-align:right"><b>${hrs(r.total)}</b></td><td style="padding-left:16px;text-align:right"><b>${ngn(r.pay)}</b></td></tr>
      </table>
      <table style="width:100%;margin-top:56px"><tr><td>____________________<br/>Employee</td><td style="text-align:right">____________________<br/>Supervisor</td></tr></table></div>`;
    printHtml(`Timesheet ${name}`, html);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className={panel}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="Employee name" value={name} onChange={setName} />
          <Field name="Week starting" type="date" value={week} onChange={setWeek} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-[13px]">
            <thead>
              <tr className="text-left text-brand-muted">
                <th className="py-2 font-medium">Day</th>
                <th className="font-medium">Start</th>
                <th className="font-medium">End</th>
                <th className="font-medium">Break (min)</th>
                <th className="text-right font-medium">Hours</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => (
                <tr key={d.day} className="border-t border-white/5">
                  <th scope="row" className="py-1.5 pr-2 text-left font-medium text-white">{d.day.slice(0, 3)}</th>
                  <td className="pr-2"><input aria-label={`${d.day} start`} type="time" className={field} value={d.start} onChange={(e) => setDay(i, "start", e.target.value)} /></td>
                  <td className="pr-2"><input aria-label={`${d.day} end`} type="time" className={field} value={d.end} onChange={(e) => setDay(i, "end", e.target.value)} /></td>
                  <td className="pr-2"><input aria-label={`${d.day} break minutes`} type="number" inputMode="numeric" className={field} value={d.brk} onChange={(e) => setDay(i, "brk", e.target.value)} /></td>
                  <td className="text-right text-white">{r.perDay[i] ? hrs(r.perDay[i]) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field name="Hourly rate (₦)" type="number" value={rate} onChange={setRate} />
          <Field name="Overtime after (hours/week)" type="number" value={threshold} onChange={setThreshold} />
          <Field name="Overtime multiplier" type="number" value={mult} onChange={setMult} />
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-brand-surface p-5 text-[14px]" aria-live="polite">
          {[["Total hours", hrs(r.total)], ["Overtime", hrs(r.overtime)], ["Regular pay", ngn(r.regularPay)], ["Overtime pay", ngn(r.otPay)]].map(([k, v]) => (
            <div key={k}><dt className="text-brand-muted">{k}</dt><dd className="mt-0.5 text-[18px] font-semibold text-white">{v}</dd></div>
          ))}
          <div className="col-span-2 border-t border-white/10 pt-3"><dt className="text-brand-muted">Gross pay this week</dt><dd className="text-[30px] font-semibold text-[#ff8c14]">{ngn(r.pay)}</dd></div>
        </dl>
        <button type="button" onClick={print} className={`${primaryBtn} w-full`}>Download signed timesheet PDF</button>
      </div>
    </div>
  );
}
