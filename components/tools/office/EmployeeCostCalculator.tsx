"use client";

import { useMemo } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { employerCost } from "@/lib/tools/bottleneck-calcs";
import { computePaye } from "@/lib/tax/paye2026";
import { Field, esc, num, panel, primaryBtn, useSavedState } from "./kit";

const INITIAL = {
  role: "",
  basic: "180000",
  housing: "72000",
  transport: "36000",
  other: "12000",
  pension: "10",
  nsitf: "1",
  itf: "1",
  itfApplies: true,
  hmo: "8000",
  groupLife: "15000",
  thirteenth: true,
  leave: "10",
  oneOff: "250000",
  days: "260",
  headcount: "1",
};

const naira0 = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

export default function EmployeeCostCalculator() {
  const [s, setS] = useSavedState("dt-employee-cost", INITIAL);
  const set = (k: keyof typeof INITIAL) => (v: string) => setS({ ...s, [k]: v });

  const r = useMemo(
    () =>
      employerCost({
        basic: num(s.basic),
        housing: num(s.housing),
        transport: num(s.transport),
        other: num(s.other),
        employerPensionPct: num(s.pension),
        nsitfPct: num(s.nsitf),
        itfPct: num(s.itf),
        itfApplies: s.itfApplies,
        hmoMonthly: num(s.hmo),
        groupLifeYearly: num(s.groupLife),
        thirteenthMonth: s.thirteenth,
        leaveAllowancePct: num(s.leave),
        oneOffYearly: num(s.oneOff),
        workingDays: num(s.days),
      }),
    [s]
  );

  const paye = useMemo(() => {
    const pensionable = (num(s.basic) + num(s.housing) + num(s.transport)) * 12;
    return computePaye({ grossAnnual: r.cashPay, pensionableAnnual: pensionable, basicAnnual: num(s.basic) * 12, includePension: true, includeNhf: false });
  }, [r.cashPay, s.basic, s.housing, s.transport]);

  const heads = Math.max(1, Math.floor(num(s.headcount)) || 1);

  const lines: [string, number][] = [
    ["Salary (12 months)", r.annualGross],
    ...(r.thirteenth ? ([["13th month", r.thirteenth]] as [string, number][]) : []),
    ...(r.leave ? ([["Leave allowance", r.leave]] as [string, number][]) : []),
    ["Employer pension", r.pension],
    ["NSITF (employee compensation)", r.nsitf],
    ...(r.itf ? ([["ITF training levy", r.itf]] as [string, number][]) : []),
    ...(r.groupLife ? ([["Group life insurance", r.groupLife]] as [string, number][]) : []),
    ...(r.hmo ? ([["HMO / health cover", r.hmo]] as [string, number][]) : []),
    ...(r.oneOff ? ([["Hiring, equipment and training", r.oneOff]] as [string, number][]) : []),
  ];

  function print() {
    const td = "padding:6px 0;border-bottom:1px solid #eee";
    const html = `<div style="max-width:640px;margin:32px auto;font-size:14px">
      <h1 style="font-size:20px;margin:0">Cost of employment${s.role ? ": " + esc(s.role) : ""}</h1>
      <p style="color:#555">Monthly gross ${naira0(r.monthlyGross)}${heads > 1 ? ` · ${heads} staff` : ""}</p>
      <table style="width:100%;border-collapse:collapse">${lines.map(([k, v]) => `<tr><td style="${td}">${k}</td><td style="${td};text-align:right">${naira0(v)}</td></tr>`).join("")}
      <tr><td style="padding:10px 0"><b>Total cost per employee per year</b></td><td style="text-align:right"><b>${naira0(r.total)}</b></td></tr>
      ${heads > 1 ? `<tr><td><b>For ${heads} staff</b></td><td style="text-align:right"><b>${naira0(r.total * heads)}</b></td></tr>` : ""}
      <tr><td>Per month</td><td style="text-align:right">${naira0(r.monthly)}</td></tr>
      <tr><td>Per working day</td><td style="text-align:right">${naira0(r.perDay)}</td></tr>
      <tr><td>Employee take-home per month (after PAYE and 8% pension)</td><td style="text-align:right">${naira0(paye.netMonthly)}</td></tr></table>
      <p style="color:#777;font-size:12px;margin-top:24px">Estimate from doyintech.com/tools/employee-cost-calculator-nigeria</p></div>`;
    printHtml("Cost of employment", html);
  }

  const toggle = (k: "itfApplies" | "thirteenth", text: string) => (
    <label className="flex min-h-11 items-center gap-3 text-[14px] text-[#e8eaed]">
      <input type="checkbox" className="h-5 w-5 accent-[#ff8c14]" checked={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.checked })} />
      {text}
    </label>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className={panel}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="Role (optional)" value={s.role} onChange={set("role")} placeholder="e.g. Accountant" />
          <Field name="How many staff in this role" type="number" value={s.headcount} onChange={set("headcount")} />
        </div>
        <h2 className="text-[15px] font-semibold text-white">Monthly pay</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="Basic (₦)" type="number" value={s.basic} onChange={set("basic")} />
          <Field name="Housing (₦)" type="number" value={s.housing} onChange={set("housing")} />
          <Field name="Transport (₦)" type="number" value={s.transport} onChange={set("transport")} />
          <Field name="Other allowances (₦)" type="number" value={s.other} onChange={set("other")} />
        </div>
        <h2 className="text-[15px] font-semibold text-white">Benefits and statutory costs</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field name="Employer pension (%)" type="number" value={s.pension} onChange={set("pension")} />
          <Field name="NSITF (% of payroll)" type="number" value={s.nsitf} onChange={set("nsitf")} />
          <Field name="ITF (% of payroll)" type="number" value={s.itf} onChange={set("itf")} />
          <Field name="HMO per month (₦)" type="number" value={s.hmo} onChange={set("hmo")} />
          <Field name="Group life per year (₦)" type="number" value={s.groupLife} onChange={set("groupLife")} />
          <Field name="Leave allowance (% of basic)" type="number" value={s.leave} onChange={set("leave")} />
          <Field name="Hiring, laptop, training (₦/yr)" type="number" value={s.oneOff} onChange={set("oneOff")} />
          <Field name="Working days per year" type="number" value={s.days} onChange={set("days")} />
        </div>
        <div className="grid sm:grid-cols-2">
          {toggle("itfApplies", "ITF applies (5+ staff or ₦50m+ turnover)")}
          {toggle("thirteenth", "Pay a 13th month")}
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <p className="text-[13px] text-[#a1a1a6]">True cost of this employee</p>
          <p className="text-[30px] font-semibold text-[#ff8c14]">{naira0(r.total)}<span className="text-[15px] font-normal text-[#a1a1a6]"> / year</span></p>
          <p className="text-[14px] text-white">For every ₦1 of salary you spend <b>₦{r.multiplier.toFixed(2)}</b></p>
          {heads > 1 && <p className="mt-1 text-[14px] text-white">{heads} staff: <b>{naira0(r.total * heads)}</b> a year</p>}
          <dl className="mt-4 space-y-1.5 border-t border-white/10 pt-4 text-[13px]">
            {lines.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3"><dt className="text-[#a1a1a6]">{k}</dt><dd className="text-white">{naira0(v)}</dd></div>
            ))}
          </dl>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-[13px]">
            <div><dt className="text-[#a1a1a6]">Per month</dt><dd className="text-[16px] font-semibold text-white">{naira0(r.monthly)}</dd></div>
            <div><dt className="text-[#a1a1a6]">Per working day</dt><dd className="text-[16px] font-semibold text-white">{naira0(r.perDay)}</dd></div>
            <div className="col-span-2"><dt className="text-[#a1a1a6]">Employee takes home (after PAYE 2026 and 8% pension)</dt><dd className="text-[16px] font-semibold text-white">{naira0(paye.netMonthly)} / month</dd></div>
          </dl>
        </div>
        <button type="button" onClick={print} className={`${primaryBtn} w-full`}>Download cost breakdown PDF</button>
      </div>
    </div>
  );
}
