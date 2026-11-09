"use client";

import { useMemo } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { Area, Field, esc, ghostBtn, ngn, num, panel, primaryBtn, useSavedState } from "./kit";

type Cost = { item: string; amount: string };
type Plan = {
  name: string;
  owner: string;
  location: string;
  summary: string;
  problem: string;
  solution: string;
  customers: string;
  competitors: string;
  advantage: string;
  marketing: string;
  operations: string;
  team: string;
  costs: Cost[];
  price: string;
  unitsPerMonth: string;
  costPerUnit: string;
  fixedMonthly: string;
  ownFunds: string;
  milestones: string;
};

const SECTIONS: [keyof Plan, string, string][] = [
  ["summary", "Executive summary", "In two or three sentences: what you sell, to whom, and why it will make money."],
  ["problem", "The problem", "What is costly, slow or frustrating for your customers today?"],
  ["solution", "Your product or service", "What you sell and how it solves the problem."],
  ["customers", "Target customers and market", "Who buys, where they are, how many of them, what they pay now."],
  ["competitors", "Competitors", "Who else they buy from today, including informal sellers."],
  ["advantage", "Your advantage", "Why customers will choose you: price, quality, location, speed, trust."],
  ["marketing", "Marketing and sales plan", "Channels (WhatsApp, Instagram, Google Maps, walk-in, distributors) and your first 90 days."],
  ["operations", "Operations", "Location, suppliers, equipment, opening hours, how an order is delivered."],
  ["team", "Management and team", "Who runs what, relevant experience, staff you will hire."],
];

const START: Plan = {
  name: "", owner: "", location: "", summary: "", problem: "", solution: "", customers: "", competitors: "", advantage: "", marketing: "", operations: "", team: "",
  costs: [{ item: "Equipment", amount: "" }, { item: "First stock", amount: "" }, { item: "Shop rent (1 year)", amount: "" }, { item: "Registration and branding", amount: "" }],
  price: "", unitsPerMonth: "", costPerUnit: "", fixedMonthly: "", ownFunds: "", milestones: "",
};

/** One-document business plan with start-up costs, monthly projection and break-even, built for loan, grant and investor applications. */
export default function BusinessPlanGenerator() {
  const [p, setP] = useSavedState<Plan>("doyintech_business_plan_v1", START);
  const set = (k: keyof Plan) => (v: string) => setP((x) => ({ ...x, [k]: v }));

  const f = useMemo(() => {
    const startup = p.costs.reduce((s, c) => s + num(c.amount), 0);
    const price = num(p.price), units = num(p.unitsPerMonth), unitCost = num(p.costPerUnit), fixed = num(p.fixedMonthly);
    const revenue = price * units;
    const variable = unitCost * units;
    const profit = revenue - variable - fixed;
    const margin = price - unitCost;
    const breakEvenUnits = margin > 0 ? Math.ceil(fixed / margin) : null;
    const payback = profit > 0 ? Math.ceil(startup / profit) : null;
    const need = Math.max(0, startup - num(p.ownFunds));
    return { startup, revenue, variable, fixed, profit, breakEvenUnits, payback, need };
  }, [p]);

  function print() {
    const sec = (title: string, body: string) => (body.trim() ? `<h2 style="font-size:16px;color:#0f766e;margin:22px 0 6px">${esc(title)}</h2><p style="margin:0;white-space:pre-wrap">${esc(body)}</p>` : "");
    const row = (k: string, v: string) => `<tr><td style="padding:5px 8px;border-bottom:1px solid #eee">${esc(k)}</td><td style="padding:5px 8px;border-bottom:1px solid #eee;text-align:right">${v}</td></tr>`;
    const html = `<div style="max-width:720px;margin:36px auto;font-size:14px;line-height:1.6;color:#111">
      <div style="text-align:center;padding:40px 0;border-bottom:2px solid #0f766e"><div style="font-size:12px;letter-spacing:3px;color:#0f766e">BUSINESS PLAN</div>
      <div style="font-size:30px;font-weight:700;margin-top:8px">${esc(p.name || "Business name")}</div>
      <div style="color:#555">${esc([p.owner, p.location].filter(Boolean).join(" · "))}</div></div>
      ${SECTIONS.map(([k, t]) => sec(t, String(p[k] || ""))).join("")}
      <h2 style="font-size:16px;color:#0f766e;margin:22px 0 6px">Start-up costs</h2>
      <table style="width:100%;border-collapse:collapse">${p.costs.filter((c) => c.item && num(c.amount)).map((c) => row(c.item, ngn(num(c.amount)))).join("")}
      ${row("Total start-up cost", `<b>${ngn(f.startup)}</b>`)}${row("Owner's contribution", ngn(num(p.ownFunds)))}${row("Funding required", `<b>${ngn(f.need)}</b>`)}</table>
      <h2 style="font-size:16px;color:#0f766e;margin:22px 0 6px">Monthly projection</h2>
      <table style="width:100%;border-collapse:collapse">${row("Sales revenue", ngn(f.revenue))}${row("Cost of sales", ngn(f.variable))}${row("Fixed costs (rent, salaries, data, power)", ngn(f.fixed))}${row("Net profit per month", `<b>${ngn(f.profit)}</b>`)}
      ${row("Break-even sales per month", f.breakEvenUnits != null ? `${f.breakEvenUnits.toLocaleString()} units` : "—")}${row("Payback period", f.payback != null ? `${f.payback} months` : "—")}</table>
      ${sec("Milestones (next 12 months)", p.milestones)}
    </div>`;
    printHtml(`${p.name || "Business"} plan`, html);
  }

  return (
    <div className="space-y-6">
      <div className={`${panel} grid gap-3 space-y-0 sm:grid-cols-3`}>
        <Field name="Business name" value={p.name} onChange={set("name")} />
        <Field name="Owner(s)" value={p.owner} onChange={set("owner")} />
        <Field name="Location" value={p.location} onChange={set("location")} placeholder="Ikeja, Lagos" />
      </div>

      <div className={panel}>
        {SECTIONS.map(([k, t, hint]) => (
          <Area key={k} name={t} value={String(p[k] || "")} onChange={set(k)} placeholder={hint} rows={3} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={panel}>
          <p className="text-[15px] font-semibold text-white">Start-up costs (₦)</p>
          {p.costs.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_140px_auto] items-end gap-2">
              <Field name={`Item ${i + 1}`} value={c.item} onChange={(v) => setP({ ...p, costs: p.costs.map((x, j) => (j === i ? { ...x, item: v } : x)) })} />
              <Field name="Amount" type="number" value={c.amount} onChange={(v) => setP({ ...p, costs: p.costs.map((x, j) => (j === i ? { ...x, amount: v } : x)) })} />
              <button type="button" aria-label={`Remove ${c.item || "item"}`} className="min-h-11 px-2 text-[#ff8a8a]" onClick={() => setP({ ...p, costs: p.costs.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button type="button" className={ghostBtn} onClick={() => setP({ ...p, costs: [...p.costs, { item: "", amount: "" }] })}>+ Add cost</button>
          <Field name="Your own money going in" type="number" value={p.ownFunds} onChange={set("ownFunds")} />
        </div>

        <div className={panel}>
          <p className="text-[15px] font-semibold text-white">Monthly projection</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="Average selling price (₦)" type="number" value={p.price} onChange={set("price")} />
            <Field name="Units / customers per month" type="number" value={p.unitsPerMonth} onChange={set("unitsPerMonth")} />
            <Field name="Cost per unit (₦)" type="number" value={p.costPerUnit} onChange={set("costPerUnit")} />
            <Field name="Fixed costs per month (₦)" type="number" value={p.fixedMonthly} onChange={set("fixedMonthly")} />
          </div>
          <dl className="grid grid-cols-2 gap-3 text-[13px]" aria-live="polite">
            {[
              ["Start-up cost", ngn(f.startup)],
              ["Funding needed", ngn(f.need)],
              ["Monthly revenue", ngn(f.revenue)],
              ["Monthly profit", ngn(f.profit)],
              ["Break-even", f.breakEvenUnits != null ? `${f.breakEvenUnits.toLocaleString()} units/month` : "Set price above unit cost"],
              ["Payback", f.payback != null ? `${f.payback} months` : "Not yet profitable"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-black/30 p-3">
                <dt className="text-brand-muted">{k}</dt>
                <dd className={`mt-0.5 font-semibold ${k === "Monthly profit" && f.profit < 0 ? "text-[#ff8a8a]" : "text-white"}`}>{v}</dd>
              </div>
            ))}
          </dl>
          <Area name="Milestones for the next 12 months" value={p.milestones} onChange={set("milestones")} placeholder={"Month 1: register with CAC and open a business account\nMonth 3: 50 regular customers"} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={print} className={primaryBtn}>Download business plan PDF</button>
        <button type="button" onClick={() => confirm("Clear the whole plan?") && setP(START)} className={ghostBtn}>Start over</button>
        <p className="text-[12px] text-brand-muted">Your plan saves automatically on this device.</p>
      </div>
    </div>
  );
}
