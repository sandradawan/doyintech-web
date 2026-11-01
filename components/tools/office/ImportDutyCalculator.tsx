"use client";

import { useMemo } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { importLandedCost } from "@/lib/tools/bottleneck-calcs";
import { Chips, Field, esc, ngn, num, panel, primaryBtn, useSavedState } from "./kit";

const CET_BANDS = [
  { id: "0", label: "0% essentials" },
  { id: "5", label: "5% raw materials" },
  { id: "10", label: "10% inputs" },
  { id: "20", label: "20% finished goods" },
  { id: "35", label: "35% special goods" },
] as const;

const INITIAL = {
  item: "",
  fob: "10000",
  freight: "1800",
  insurance: "",
  rate: "1550",
  duty: "20",
  levy: "0",
  surcharge: "7",
  etls: "0.5",
  ciss: "1",
  vat: "7.5",
  local: "650000",
  qty: "500",
  margin: "25",
};

export default function ImportDutyCalculator() {
  const [s, setS] = useSavedState("dt-import-duty", INITIAL);
  const set = (k: keyof typeof INITIAL) => (v: string) => setS({ ...s, [k]: v });

  const r = useMemo(
    () =>
      importLandedCost({
        fobUsd: num(s.fob),
        freightUsd: num(s.freight),
        insuranceUsd: s.insurance.trim() ? num(s.insurance) : undefined,
        rate: num(s.rate),
        dutyPct: num(s.duty),
        levyPct: num(s.levy),
        surchargePct: num(s.surcharge),
        etlsPct: num(s.etls),
        cissPct: num(s.ciss),
        vatPct: num(s.vat),
        localCharges: num(s.local),
        quantity: num(s.qty),
        marginPct: num(s.margin),
      }),
    [s]
  );

  const lines: [string, number, string][] = [
    ["FOB value", r.fob, `$${num(s.fob).toLocaleString()} × ₦${num(s.rate).toLocaleString()}`],
    ["Freight", r.freight, ""],
    ["Insurance", r.insurance, s.insurance.trim() ? "" : "1.5% of FOB (default)"],
    ["CIF (customs value)", r.cif, "FOB + freight + insurance"],
    ["Import duty", r.duty, `${s.duty}% of CIF`],
    ...(r.levy ? ([["Levy / adjustment tax", r.levy, `${s.levy}% of CIF`]] as [string, number, string][]) : []),
    ["Surcharge", r.surcharge, `${s.surcharge}% of duty`],
    ["ETLS", r.etls, `${s.etls}% of CIF`],
    ["CISS", r.ciss, `${s.ciss}% of FOB`],
    ["VAT", r.vat, `${s.vat}% of CIF + duty + charges`],
    ["Clearing, port and haulage", num(s.local), "your agent's estimate"],
  ];

  function print() {
    const td = "padding:6px 0;border-bottom:1px solid #eee";
    const html = `<div style="max-width:680px;margin:32px auto;font-size:14px">
      <h1 style="font-size:20px;margin:0">Import landed cost${s.item ? ": " + esc(s.item) : ""}</h1>
      <p style="color:#555">Exchange rate ₦${esc(s.rate)}/$ · quantity ${esc(s.qty)}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">
      ${lines.map(([k, v, n]) => `<tr><td style="${td}">${k}<br/><span style="color:#888;font-size:12px">${esc(n)}</span></td><td style="${td};text-align:right">${ngn(v)}</td></tr>`).join("")}
      <tr><td style="padding:10px 0"><b>Total duties and taxes</b></td><td style="text-align:right"><b>${ngn(r.totalTaxes)}</b></td></tr>
      <tr><td style="padding:4px 0"><b>Landed cost</b></td><td style="text-align:right"><b>${ngn(r.landed)}</b></td></tr>
      <tr><td style="padding:4px 0">Landed cost per unit</td><td style="text-align:right">${ngn(r.perUnit)}</td></tr>
      <tr><td style="padding:4px 0">Selling price per unit at ${esc(s.margin)}% margin</td><td style="text-align:right">${ngn(r.sellPerUnit)}</td></tr></table>
      <p style="color:#777;font-size:12px;margin-top:24px">Estimate only. Customs assesses duty on its own valuation and HS code; confirm with your licensed clearing agent. doyintech.com/tools/import-duty-calculator-nigeria</p></div>`;
    printHtml("Import landed cost", html);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className={panel}>
        <Field name="What are you importing? (optional)" value={s.item} onChange={set("item")} placeholder="e.g. 500 units of solar lamps" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="FOB value (US$)" type="number" value={s.fob} onChange={set("fob")} />
          <Field name="Freight (US$)" type="number" value={s.freight} onChange={set("freight")} />
          <Field name="Insurance (US$)" type="number" value={s.insurance} onChange={set("insurance")} placeholder="Blank = 1.5% of FOB" />
          <Field name="Customs exchange rate (₦ per $)" type="number" value={s.rate} onChange={set("rate")} />
        </div>
        <div>
          <p className="mb-2 text-[12px] font-medium text-[#a1a1a6]">Import duty band (ECOWAS CET, from your HS code)</p>
          <Chips label="Import duty band" options={CET_BANDS} value={s.duty} onChange={set("duty")} />
          <Field name="Or exact duty rate (%)" type="number" value={s.duty} onChange={set("duty")} className="mt-3 max-w-[220px]" />
        </div>
        <details className="rounded-xl border border-white/10 p-4">
          <summary className="cursor-pointer text-[14px] font-semibold text-white">Other customs charges (edit if they change)</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Field name="Surcharge (% of duty)" type="number" value={s.surcharge} onChange={set("surcharge")} />
            <Field name="ETLS (% of CIF)" type="number" value={s.etls} onChange={set("etls")} />
            <Field name="CISS (% of FOB)" type="number" value={s.ciss} onChange={set("ciss")} />
            <Field name="VAT (%)" type="number" value={s.vat} onChange={set("vat")} />
            <Field name="Extra levy (% of CIF)" type="number" value={s.levy} onChange={set("levy")} />
          </div>
        </details>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field name="Clearing, port and haulage (₦)" type="number" value={s.local} onChange={set("local")} />
          <Field name="Quantity (units)" type="number" value={s.qty} onChange={set("qty")} />
          <Field name="Target margin (%)" type="number" value={s.margin} onChange={set("margin")} />
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <dl className="space-y-1.5 text-[13px]">
            {lines.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3"><dt className="text-[#a1a1a6]">{k}</dt><dd className="text-white">{ngn(v)}</dd></div>
            ))}
          </dl>
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-[13px] text-[#a1a1a6]">Duties and taxes</p>
            <p className="text-[20px] font-semibold text-white">{ngn(r.totalTaxes)} <span className="text-[13px] font-normal text-[#a1a1a6]">({Math.round(r.taxShare * 100)}% of landed cost)</span></p>
            <p className="mt-3 text-[13px] text-[#a1a1a6]">Landed cost</p>
            <p className="text-[30px] font-semibold text-[#ff8c14]">{ngn(r.landed)}</p>
            <p className="mt-2 text-[14px] text-white">{ngn(r.perUnit)} per unit → sell at <b>{ngn(r.sellPerUnit)}</b></p>
          </div>
        </div>
        <button type="button" onClick={print} className={`${primaryBtn} w-full`}>Download landed cost PDF</button>
        <p className="text-[12px] text-[#8b919c]">Customs values goods on its own assessment and HS code. Confirm the duty rate with your licensed clearing agent.</p>
      </div>
    </div>
  );
}
