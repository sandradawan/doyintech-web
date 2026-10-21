"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computePaye, naira } from "@/lib/tax/paye2026";
import PaidGate, { printHtml } from "@/components/tools/PaidGate";

const field =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[15px] text-white outline-none focus:border-[#ff8c14]";

function num(v: string): number {
  const n = Number(v.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Free PAYE calculator; the printable payslip is the paid upgrade (or included in Pro). */
export default function PayeCalculator() {
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");
  const [gross, setGross] = useState("500000");
  const [rent, setRent] = useState("1200000");
  const [pension, setPension] = useState(true);
  const [nhf, setNhf] = useState(false);
  const [nhis, setNhis] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [basicShare, setBasicShare] = useState("100");

  const mult = period === "monthly" ? 12 : 1;
  const grossAnnual = num(gross) * mult;
  const pensionableAnnual = (grossAnnual * Math.min(100, num(basicShare) || 100)) / 100;

  const r = useMemo(
    () =>
      computePaye({
        grossAnnual,
        pensionableAnnual,
        includePension: pension,
        includeNhf: nhf,
        nhisAnnual: num(nhis),
        annualRent: num(rent),
      }),
    [grossAnnual, pensionableAnnual, pension, nhf, nhis, rent]
  );

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:p-6">
        <div className="flex gap-2" role="tablist" aria-label="Salary period">
          {(["monthly", "annual"] as const).map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={period === p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold ${
                period === p ? "bg-[#ff8c14] text-black" : "border border-white/15 text-white/80"
              }`}
            >
              {p === "monthly" ? "Monthly salary" : "Annual salary"}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-[13px] text-[#a1a1a6]">
            Gross {period} pay (₦)
            <input inputMode="numeric" value={gross} onChange={(e) => setGross(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Annual rent you pay (₦)
            <input inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className={field} />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-white">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pension} onChange={(e) => setPension(e.target.checked)} />
            Pension (8%)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={nhf} onChange={(e) => setNhf(e.target.checked)} />
            NHF (2.5% of basic)
          </label>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-[13px] text-[#ff8c14] hover:underline"
          >
            {showAdvanced ? "Hide" : "More"} options
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-[13px] text-[#a1a1a6]">
              Basic + housing + transport, % of gross
              <input inputMode="numeric" value={basicShare} onChange={(e) => setBasicShare(e.target.value)} className={field} />
            </label>
            <label className="block text-[13px] text-[#a1a1a6]">
              Health insurance (NHIS), annual ₦
              <input inputMode="numeric" value={nhis} onChange={(e) => setNhis(e.target.value)} className={field} />
            </label>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Monthly PAYE tax" value={naira(r.monthlyTax)} highlight />
        <Stat label="Monthly take-home" value={naira(r.netMonthly)} />
        <Stat label="Effective tax rate" value={`${(r.effectiveRate * 100).toFixed(1)}%`} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-[14px]">
          <caption className="sr-only">PAYE calculation breakdown</caption>
          <tbody className="divide-y divide-white/10">
            <Row label="Gross pay (annual)" value={naira(r.grossAnnual)} />
            <Row label="Less pension" value={`− ${naira(r.pension)}`} />
            {r.nhf > 0 && <Row label="Less NHF" value={`− ${naira(r.nhf)}`} />}
            {r.nhis > 0 && <Row label="Less NHIS" value={`− ${naira(r.nhis)}`} />}
            <Row label="Less rent relief (20%, max ₦500k)" value={`− ${naira(r.rentRelief)}`} />
            <Row label="Taxable income" value={naira(r.taxableIncome)} strong />
            {r.bands
              .filter((b) => b.taxable > 0)
              .map((b) => (
                <Row
                  key={b.from}
                  label={`${(b.rate * 100).toFixed(0)}% on ${naira(b.taxable)}`}
                  value={naira(b.tax)}
                  muted
                />
              ))}
            <Row label="Annual PAYE tax" value={naira(r.annualTax)} strong />
          </tbody>
        </table>
      </div>

      <PaidGate
        toolSlug="paye-calculator-nigeria"
        preview={
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[15px] font-semibold text-white">Need a payslip for staff or a loan application?</p>
            <p className="mt-1 text-[13px] text-[#a1a1a6]">
              Generate a clean, printable payslip with this exact 2026 PAYE breakdown. Included in{" "}
              <Link href="/pro" className="text-[#ff8c14] hover:underline">
                DoyinTech Pro
              </Link>
              .
            </p>
          </div>
        }
      >
        <PayslipForm result={r} />
      </PaidGate>
    </div>
  );
}

function PayslipForm({ result }: { result: ReturnType<typeof computePaye> }) {
  const [company, setCompany] = useState("");
  const [employee, setEmployee] = useState("");
  const [month, setMonth] = useState(() =>
    new Date().toLocaleDateString("en-NG", { month: "long", year: "numeric" })
  );

  function print() {
    const m = (n: number) => naira(n / 12);
    const rows: [string, string][] = [
      ["Gross pay", m(result.grossAnnual)],
      ["Pension (employee)", `(${m(result.pension)})`],
      ...(result.nhf > 0 ? ([["NHF", `(${m(result.nhf)})`]] as [string, string][]) : []),
      ...(result.nhis > 0 ? ([["NHIS", `(${m(result.nhis)})`]] as [string, string][]) : []),
      ["PAYE tax", `(${m(result.annualTax)})`],
      ["Net pay", m(result.netAnnual)],
    ];
    const html = `
      <div style="max-width:640px;margin:32px auto;padding:32px;border:1px solid #ddd;border-radius:12px">
        <h1 style="margin:0;font-size:22px">${escapeHtml(company || "Company name")}</h1>
        <p style="margin:4px 0 24px;color:#555">Payslip · ${escapeHtml(month)}</p>
        <p style="margin:0 0 16px"><strong>Employee:</strong> ${escapeHtml(employee || "Employee name")}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows
            .map(
              ([k, v], i) =>
                `<tr style="${i === rows.length - 1 ? "font-weight:700;border-top:2px solid #111" : "border-top:1px solid #eee"}"><td style="padding:8px 0">${k}</td><td style="padding:8px 0;text-align:right">${v}</td></tr>`
            )
            .join("")}
        </table>
        <p style="margin-top:24px;font-size:11px;color:#777">PAYE computed under the Nigeria Tax Act 2025 bands. Taxable income ${naira(
          result.taxableIncome / 12
        )}/month after reliefs (incl. rent relief ${naira(result.rentRelief / 12)}/month).</p>
      </div>`;
    printHtml(`Payslip ${month}`, html);
  }

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
      <p className="text-[15px] font-semibold text-white">Payslip generator</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" aria-label="Company name" className={field} />
        <input value={employee} onChange={(e) => setEmployee(e.target.value)} placeholder="Employee name" aria-label="Employee name" className={field} />
        <input value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Pay period" className={field} />
      </div>
      <button
        type="button"
        onClick={print}
        className="mt-4 rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black"
      >
        Print / save payslip PDF
      </button>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-[#ff8c14]/40 bg-[#ff8c14]/10" : "border-white/10 bg-white/[0.03]"}`}>
      <p className="text-[12px] uppercase tracking-wide text-[#86868b]">{label}</p>
      <p className="mt-1 text-[26px] font-semibold text-white">{value}</p>
    </div>
  );
}

function Row({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <tr className={strong ? "bg-white/[0.04]" : ""}>
      <td className={`px-4 py-2.5 ${muted ? "pl-8 text-[#86868b]" : "text-[#c7cdd8]"} ${strong ? "font-semibold text-white" : ""}`}>{label}</td>
      <td className={`px-4 py-2.5 text-right ${strong ? "font-semibold text-white" : muted ? "text-[#86868b]" : "text-[#c7cdd8]"}`}>{value}</td>
    </tr>
  );
}
