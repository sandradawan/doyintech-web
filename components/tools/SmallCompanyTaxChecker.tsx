"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { checkCompany } from "@/lib/tax/company2026";
import { naira } from "@/lib/tax/paye2026";

const field =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[15px] text-white outline-none focus:border-[#ff8c14]";

const num = (v: string) => {
  const n = Number(v.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export default function SmallCompanyTaxChecker() {
  const [turnover, setTurnover] = useState("35000000");
  const [assets, setAssets] = useState("20000000");
  const [profit, setProfit] = useState("8000000");
  const [professional, setProfessional] = useState(false);

  const r = useMemo(
    () =>
      checkCompany({
        turnover: num(turnover),
        fixedAssets: num(assets),
        professionalServices: professional,
        profit: num(profit),
      }),
    [turnover, assets, profit, professional]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-[13px] text-[#a1a1a6]">
            Annual turnover (₦)
            <input inputMode="numeric" value={turnover} onChange={(e) => setTurnover(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Total fixed assets (₦)
            <input inputMode="numeric" value={assets} onChange={(e) => setAssets(e.target.value)} className={field} />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Annual profit (₦)
            <input inputMode="numeric" value={profit} onChange={(e) => setProfit(e.target.value)} className={field} />
          </label>
        </div>
        <label className="mt-4 flex items-start gap-2 text-[14px] text-white">
          <input type="checkbox" className="mt-1" checked={professional} onChange={(e) => setProfessional(e.target.checked)} />
          <span>
            We provide professional services
            <span className="block text-[12px] text-[#86868b]">e.g. legal, accounting, consulting, medical, engineering or architecture practices</span>
          </span>
        </label>
      </div>

      <div
        role="status"
        className={`rounded-2xl border p-6 ${r.isSmall ? "border-emerald-500/40 bg-emerald-500/10" : "border-[#ff8c14]/40 bg-[#ff8c14]/10"}`}
      >
        <p className="text-[13px] uppercase tracking-wide text-[#a1a1a6]">Result</p>
        <p className="mt-1 text-[24px] font-semibold text-white">
          {r.isSmall ? "Small company — 0% company tax" : "Not a small company"}
        </p>
        {r.isSmall ? (
          <p className="mt-2 text-[14px] text-[#c7cdd8]">
            You pay no companies income tax, no development levy and no capital gains tax. You
            must still register, keep records and file annual returns. Headroom before you lose
            the exemption: {naira(Math.max(0, r.turnoverHeadroom))} of turnover.
          </p>
        ) : (
          <>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-[#c7cdd8]">
              {r.reasons.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Stat label="Companies income tax (30%)" value={naira(r.cit)} />
              <Stat label="Development levy (4%)" value={naira(r.developmentLevy)} />
              <Stat label="Estimated total" value={naira(r.totalTax)} strong />
            </div>
            <p className="mt-3 text-[12px] text-[#86868b]">
              Estimate on the profit you entered; your assessable profit after allowable expenses
              and capital allowances may differ.
              {r.minimumEtrApplies && " At ₦20 billion turnover or more, the 15% minimum effective tax rate rules also apply."}
            </p>
          </>
        )}
      </div>

      <p className="text-[14px] text-[#a1a1a6]">
        Charging customers VAT? Work it out with the{" "}
        <Link href="/tools/nigeria-vat-calculator" className="text-[#ff8c14] hover:underline">
          7.5% VAT calculator
        </Link>
        , and issue proper{" "}
        <Link href="/tools/invoice-generator-nigeria" className="text-[#ff8c14] hover:underline">
          invoices
        </Link>{" "}
        for your records.
      </p>
    </div>
  );
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-[11px] uppercase tracking-wide text-[#86868b]">{label}</p>
      <p className={`mt-1 text-[18px] ${strong ? "font-semibold text-white" : "text-[#c7cdd8]"}`}>{value}</p>
    </div>
  );
}
