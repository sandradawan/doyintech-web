"use client";

import { useMemo, useState } from "react";
import { computePaye } from "@/lib/tax/paye2026";
import { printHtml } from "@/components/tools/PaidGate";
import { Field, esc, ngn, num, panel, primaryBtn, useSavedState } from "./kit";

type Company = { name: string; address: string; color: string };
type Employee = { name: string; staffId: string; role: string; dept: string; bank: string; account: string };
type Pay = {
  basic: string;
  housing: string;
  transport: string;
  other: string;
  rent: string;
  pension: boolean;
  nhf: boolean;
  loan: string;
  otherDeduction: string;
};

const thisMonth = () => new Date().toISOString().slice(0, 7);

/** Monthly payslip with PAYE under the Nigeria Tax Act 2025, computed from annualised pay. */
export default function PayslipGenerator() {
  const [company, setCompany] = useSavedState<Company>("doyintech_payslip_company_v1", { name: "", address: "", color: "#0f766e" });
  const [emp, setEmp] = useState<Employee>({ name: "", staffId: "", role: "", dept: "", bank: "", account: "" });
  const [month, setMonth] = useState(thisMonth);
  const [pay, setPay] = useState<Pay>({
    basic: "150000",
    housing: "60000",
    transport: "30000",
    other: "0",
    rent: "",
    pension: true,
    nhf: false,
    loan: "",
    otherDeduction: "",
  });

  const r = useMemo(() => {
    const basic = num(pay.basic), housing = num(pay.housing), transport = num(pay.transport), other = num(pay.other);
    const grossMonthly = basic + housing + transport + other;
    const paye = computePaye({
      grossAnnual: grossMonthly * 12,
      pensionableAnnual: (basic + housing + transport) * 12,
      basicAnnual: basic * 12,
      includePension: pay.pension,
      includeNhf: pay.nhf,
      annualRent: num(pay.rent),
    });
    const pension = paye.pension / 12;
    const nhf = paye.nhf / 12;
    const tax = paye.monthlyTax;
    const loan = num(pay.loan), otherDed = num(pay.otherDeduction);
    const deductions = tax + pension + nhf + loan + otherDed;
    return { basic, housing, transport, other, grossMonthly, pension, nhf, tax, loan, otherDed, deductions, net: grossMonthly - deductions, employer: pay.pension ? (basic + housing + transport) * 0.1 : 0 };
  }, [pay]);

  const period = month ? new Date(month + "-01T12:00:00").toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "";
  const set = (k: keyof Pay) => (v: string) => setPay((p) => ({ ...p, [k]: v }));
  const setE = (k: keyof Employee) => (v: string) => setEmp((p) => ({ ...p, [k]: v }));

  const earnings: [string, number][] = [["Basic salary", r.basic], ["Housing allowance", r.housing], ["Transport allowance", r.transport], ["Other allowances", r.other]];
  const deductions: [string, number][] = [["PAYE tax", r.tax], ["Pension (employee 8%)", r.pension], ["NHF (2.5%)", r.nhf], ["Loan / salary advance", r.loan], ["Other deductions", r.otherDed]];

  function print() {
    const rows = (list: [string, number][]) =>
      list.filter(([, v]) => v > 0).map(([k, v]) => `<tr><td style="padding:6px 0">${esc(k)}</td><td style="padding:6px 0;text-align:right">${ngn(v)}</td></tr>`).join("");
    const c = esc(company.color);
    const html = `<div style="max-width:720px;margin:32px auto;font-size:14px;color:#111">
      <div style="border-bottom:3px solid ${c};padding-bottom:12px;display:flex;justify-content:space-between;align-items:flex-end">
        <div><div style="font-size:22px;font-weight:700">${esc(company.name || "Company name")}</div><div style="color:#555">${esc(company.address)}</div></div>
        <div style="text-align:right"><div style="font-size:12px;letter-spacing:2px;color:${c};font-weight:700">PAYSLIP</div><div>${esc(period)}</div></div>
      </div>
      <table style="width:100%;margin-top:16px;font-size:13px"><tr>
        <td><b>${esc(emp.name || "Employee name")}</b><br/>${esc(emp.role)}${emp.dept ? " · " + esc(emp.dept) : ""}</td>
        <td style="text-align:right">Staff ID: ${esc(emp.staffId)}<br/>${esc(emp.bank)} ${esc(emp.account)}</td>
      </tr></table>
      <div style="display:flex;gap:24px;margin-top:20px">
        <table style="flex:1;border-collapse:collapse"><tr><th colspan="2" style="text-align:left;border-bottom:1px solid #ddd;padding-bottom:6px;color:${c}">Earnings</th></tr>${rows(earnings)}
          <tr><td style="border-top:1px solid #ddd;padding-top:6px"><b>Gross pay</b></td><td style="border-top:1px solid #ddd;padding-top:6px;text-align:right"><b>${ngn(r.grossMonthly)}</b></td></tr></table>
        <table style="flex:1;border-collapse:collapse"><tr><th colspan="2" style="text-align:left;border-bottom:1px solid #ddd;padding-bottom:6px;color:${c}">Deductions</th></tr>${rows(deductions)}
          <tr><td style="border-top:1px solid #ddd;padding-top:6px"><b>Total deductions</b></td><td style="border-top:1px solid #ddd;padding-top:6px;text-align:right"><b>${ngn(r.deductions)}</b></td></tr></table>
      </div>
      <div style="margin-top:24px;background:#f4f4f5;border-radius:10px;padding:14px 18px;display:flex;justify-content:space-between;font-size:18px"><b>Net pay</b><b style="color:${c}">${ngn(r.net)}</b></div>
      ${r.employer ? `<p style="font-size:12px;color:#555;margin-top:10px">Employer pension contribution (10%, not deducted from pay): ${ngn(r.employer)}</p>` : ""}
      <p style="font-size:11px;color:#888;margin-top:32px">PAYE computed under the Nigeria Tax Act 2025 bands. This payslip is computer-generated.</p>
    </div>`;
    printHtml(`Payslip ${emp.name} ${period}`, html);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={panel}>
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-1 text-[14px] font-semibold text-brand-ink">Company (saved on this device)</legend>
          <Field name="Company name" value={company.name} onChange={(v) => setCompany({ ...company, name: v })} />
          <Field name="Address" value={company.address} onChange={(v) => setCompany({ ...company, address: v })} />
          <label className="block text-[12px] font-medium text-brand-muted">
            Brand colour
            <input type="color" value={company.color} onChange={(e) => setCompany({ ...company, color: e.target.value })} className="mt-1 h-11 w-full cursor-pointer rounded-xl border border-brand-ink/15 bg-brand-well" />
          </label>
          <Field name="Pay month" type="month" value={month} onChange={setMonth} />
        </fieldset>
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-1 text-[14px] font-semibold text-brand-ink">Employee</legend>
          <Field name="Full name" value={emp.name} onChange={setE("name")} />
          <Field name="Staff ID" value={emp.staffId} onChange={setE("staffId")} />
          <Field name="Job title" value={emp.role} onChange={setE("role")} />
          <Field name="Department" value={emp.dept} onChange={setE("dept")} />
          <Field name="Bank" value={emp.bank} onChange={setE("bank")} />
          <Field name="Account number" value={emp.account} onChange={setE("account")} />
        </fieldset>
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-1 text-[14px] font-semibold text-brand-ink">Monthly pay (₦)</legend>
          <Field name="Basic salary" type="number" value={pay.basic} onChange={set("basic")} />
          <Field name="Housing" type="number" value={pay.housing} onChange={set("housing")} />
          <Field name="Transport" type="number" value={pay.transport} onChange={set("transport")} />
          <Field name="Other allowances" type="number" value={pay.other} onChange={set("other")} />
          <Field name="Annual rent paid (for rent relief)" type="number" value={pay.rent} onChange={set("rent")} placeholder="optional" />
          <Field name="Loan / advance repayment" type="number" value={pay.loan} onChange={set("loan")} placeholder="0" />
          <Field name="Other deductions" type="number" value={pay.otherDeduction} onChange={set("otherDeduction")} placeholder="0" />
          <div className="flex flex-col justify-end gap-2 text-[13px] text-brand-soft">
            <label className="flex min-h-10 items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-brand-link" checked={pay.pension} onChange={(e) => setPay({ ...pay, pension: e.target.checked })} /> Pension (8%)</label>
            <label className="flex min-h-10 items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-brand-link" checked={pay.nhf} onChange={(e) => setPay({ ...pay, nhf: e.target.checked })} /> NHF (2.5% of basic)</label>
          </div>
        </fieldset>
      </div>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl bg-white p-6 text-[14px] text-gray-800 shadow-xl" aria-live="polite">
          <div className="flex items-end justify-between border-b-[3px] pb-3" style={{ borderColor: company.color }}>
            <div>
              <p className="text-[18px] font-bold text-gray-900">{company.name || "Company name"}</p>
              <p className="text-[12px] text-gray-500">{company.address}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold tracking-[0.2em]" style={{ color: company.color }}>PAYSLIP</p>
              <p className="text-[13px]">{period}</p>
            </div>
          </div>
          <p className="mt-3 font-semibold text-gray-900">{emp.name || "Employee name"}</p>
          <p className="text-[12px] text-gray-500">{[emp.role, emp.dept, emp.staffId && `ID ${emp.staffId}`].filter(Boolean).join(" · ")}</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {([["Earnings", earnings, r.grossMonthly, "Gross pay"], ["Deductions", deductions, r.deductions, "Total"]] as const).map(([title, list, total, totalLabel]) => (
              <div key={title}>
                <p className="border-b border-gray-200 pb-1 text-[12px] font-semibold uppercase tracking-wide" style={{ color: company.color }}>{title}</p>
                {list.filter(([, v]) => v > 0).map(([k, v]) => (
                  <p key={k} className="flex justify-between py-1 text-[13px]"><span>{k}</span><span>{ngn(v)}</span></p>
                ))}
                <p className="flex justify-between border-t border-gray-200 pt-1 text-[13px] font-semibold"><span>{totalLabel}</span><span>{ngn(total)}</span></p>
              </div>
            ))}
          </div>
          <p className="mt-4 flex justify-between rounded-xl bg-gray-100 px-4 py-3 text-[17px] font-bold">
            <span>Net pay</span>
            <span style={{ color: company.color }}>{ngn(r.net)}</span>
          </p>
        </div>
        <button type="button" onClick={print} className={`${primaryBtn} w-full`}>
          Download payslip PDF
        </button>
        <p className="text-center text-[12px] text-brand-muted">Choose “Save as PDF” in the print window. Nothing leaves your browser.</p>
      </div>
    </div>
  );
}
