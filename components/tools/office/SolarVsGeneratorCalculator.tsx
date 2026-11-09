"use client";

import { useMemo } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { solarVsGenerator } from "@/lib/tools/bottleneck-calcs";
import { Field, esc, num, panel, primaryBtn, useSavedState } from "./kit";

const APPLIANCES: { name: string; watts: number }[] = [
  { name: "LED bulbs ×10", watts: 100 },
  { name: "Ceiling fans ×3", watts: 225 },
  { name: "Fridge", watts: 150 },
  { name: "Chest freezer", watts: 200 },
  { name: "TV + decoder", watts: 150 },
  { name: "Laptops ×4", watts: 260 },
  { name: "Desktop PC + monitor", watts: 250 },
  { name: "Router + CCTV", watts: 80 },
  { name: "Printer (average)", watts: 100 },
  { name: "POS + phones charging", watts: 60 },
  { name: "1HP air conditioner", watts: 900 },
  { name: "Water pump (1HP)", watts: 750 },
];

const INITIAL = {
  load: "800",
  hours: "10",
  fuel: "950",
  lph: "1.2",
  maint: "15000",
  genPrice: "450000",
  sun: "5",
  autonomy: "6",
  panelW: "230",
  batteryKwh: "350000",
  inverterKva: "150000",
  install: "15",
  quote: "",
};

const naira0 = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

export default function SolarVsGeneratorCalculator() {
  const [s, setS] = useSavedState("dt-solar-vs-gen", INITIAL);
  const set = (k: keyof typeof INITIAL) => (v: string) => setS({ ...s, [k]: v });

  const r = useMemo(
    () =>
      solarVsGenerator({
        loadWatts: num(s.load),
        hoursPerDay: num(s.hours),
        fuelPrice: num(s.fuel),
        litresPerHour: num(s.lph),
        genMaintenanceMonthly: num(s.maint),
        genPrice: num(s.genPrice),
        sunHours: num(s.sun),
        autonomyHours: num(s.autonomy),
        pricePerPanelWatt: num(s.panelW),
        pricePerBatteryKwh: num(s.batteryKwh),
        pricePerInverterKva: num(s.inverterKva),
        installPct: num(s.install),
        solarQuote: num(s.quote),
      }),
    [s]
  );

  const addLoad = (w: number) => setS({ ...s, load: String(num(s.load) + w) });
  const payback = r.paybackMonths == null ? "Never at this usage" : r.paybackMonths < 12 ? `${r.paybackMonths} months` : `${(r.paybackMonths / 12).toFixed(1)} years`;

  function print() {
    const row = (k: string, v: string) => `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${k}</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${v}</td></tr>`;
    const html = `<div style="max-width:680px;margin:32px auto;font-size:14px">
      <h1 style="font-size:20px;margin:0">Solar vs generator: cost comparison</h1>
      <p style="color:#555">Load ${esc(s.load)} W for ${esc(s.hours)} hours a day · fuel ${naira0(num(s.fuel))}/litre</p>
      <h2 style="font-size:15px;margin-top:20px">Generator</h2><table style="width:100%;border-collapse:collapse">
      ${row("Fuel per month", naira0(r.fuelMonthly))}${row("Fuel + maintenance per month", naira0(r.genMonthly))}${row("Per year", naira0(r.genYearly))}${row("Five years (incl. one replacement)", naira0(r.fiveYearGen))}</table>
      <h2 style="font-size:15px;margin-top:20px">Solar system</h2><table style="width:100%;border-collapse:collapse">
      ${row("Panels", `${r.panelWatts.toLocaleString()} W`)}${row("Lithium battery", `${r.batteryKwh} kWh`)}${row("Inverter", `${r.inverterKva} kVA`)}${row(num(s.quote) ? "Installed cost (your quote)" : "Installed cost (estimate)", naira0(r.solarCost))}${row("Five years incl. upkeep", naira0(r.fiveYearSolar))}</table>
      <h2 style="font-size:15px;margin-top:20px">Result</h2><table style="width:100%;border-collapse:collapse">
      ${row("Payback period", payback)}${row("Five-year saving", naira0(r.fiveYearSaving))}${row("CO₂ avoided per year", `${r.co2TonnesYearly.toFixed(1)} tonnes`)}</table>
      <p style="color:#777;font-size:12px;margin-top:24px">Estimates from doyintech.com/tools/solar-vs-generator-calculator. Get two installer quotes before you buy.</p></div>`;
    printHtml("Solar vs generator cost comparison", html);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className={panel}>
        <div>
          <h2 className="text-[15px] font-semibold text-white">1. What do you power?</h2>
          <p className="mt-1 text-[13px] text-brand-muted">Type your running load in watts, or tap appliances to add them.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {APPLIANCES.map((a) => (
              <button key={a.name} type="button" onClick={() => addLoad(a.watts)} className="min-h-10 rounded-full border border-white/15 px-3 text-[12px] font-medium text-brand-soft hover:border-[#ff8c14]">
                + {a.name} <span className="text-brand-subtle">{a.watts}W</span>
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field name="Running load (watts)" type="number" value={s.load} onChange={set("load")} />
            <Field name="Generator hours per day" type="number" value={s.hours} onChange={set("hours")} />
          </div>
          <button type="button" onClick={() => setS({ ...s, load: "0" })} className="mt-2 text-[12px] text-brand-muted underline">Reset load to 0</button>
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-white">2. Your generator</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field name="Petrol/diesel price (₦ per litre)" type="number" value={s.fuel} onChange={set("fuel")} />
            <Field name="Fuel use (litres per hour)" type="number" value={s.lph} onChange={set("lph")} />
            <Field name="Servicing and repairs (₦ per month)" type="number" value={s.maint} onChange={set("maint")} />
            <Field name="Price of a replacement generator (₦)" type="number" value={s.genPrice} onChange={set("genPrice")} />
          </div>
        </div>
        <details className="rounded-xl border border-white/10 p-4">
          <summary className="cursor-pointer text-[14px] font-semibold text-white">3. Solar prices and sizing (edit to match your quote)</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field name="Peak sun hours per day" type="number" value={s.sun} onChange={set("sun")} />
            <Field name="Battery backup at night (hours)" type="number" value={s.autonomy} onChange={set("autonomy")} />
            <Field name="Panel price (₦ per watt)" type="number" value={s.panelW} onChange={set("panelW")} />
            <Field name="Lithium battery (₦ per kWh)" type="number" value={s.batteryKwh} onChange={set("batteryKwh")} />
            <Field name="Inverter (₦ per kVA)" type="number" value={s.inverterKva} onChange={set("inverterKva")} />
            <Field name="Installation and cabling (%)" type="number" value={s.install} onChange={set("install")} />
            <Field name="Or: installer's total quote (₦)" type="number" value={s.quote} onChange={set("quote")} placeholder="Leave blank to estimate" className="sm:col-span-2" />
          </div>
        </details>
      </div>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <div className="rounded-2xl border border-white/10 bg-brand-surface p-5">
          <p className="text-[13px] text-brand-muted">Your generator costs you</p>
          <p className="text-[30px] font-semibold text-white">{naira0(r.genMonthly)}<span className="text-[15px] text-brand-muted"> / month</span></p>
          <p className="text-[13px] text-brand-muted">{naira0(r.genYearly)} a year in fuel and repairs</p>
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-[13px] text-brand-muted">Solar to replace it</p>
            <p className="text-[15px] text-white">{r.panelWatts.toLocaleString()} W panels · {r.batteryKwh} kWh battery · {r.inverterKva} kVA inverter</p>
            <p className="mt-1 text-[22px] font-semibold text-white">{naira0(r.solarCost)}</p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-[14px]">
            <div><dt className="text-brand-muted">Pays for itself in</dt><dd className="text-[20px] font-semibold text-[#ff8c14]">{payback}</dd></div>
            <div><dt className="text-brand-muted">5-year saving</dt><dd className={`text-[20px] font-semibold ${r.fiveYearSaving >= 0 ? "text-[#3ddc97]" : "text-[#ff6b6b]"}`}>{(r.fiveYearSaving < 0 ? "-" : "") + naira0(Math.abs(r.fiveYearSaving))}</dd></div>
            <div className="col-span-2"><dt className="text-brand-muted">CO₂ avoided</dt><dd className="text-white">{r.co2TonnesYearly.toFixed(1)} tonnes a year</dd></div>
          </dl>
        </div>
        <button type="button" onClick={print} className={`${primaryBtn} w-full`}>Download comparison PDF</button>
        <p className="text-[12px] text-brand-subtle">Prices change weekly. Use your own fuel price and an installer&apos;s quote for a decision.</p>
      </div>
    </div>
  );
}
