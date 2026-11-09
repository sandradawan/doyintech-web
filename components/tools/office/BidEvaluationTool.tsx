"use client";

import { useMemo } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { evaluateBids, type BidMethod } from "@/lib/tools/bottleneck-calcs";
import { Area, Chips, Field, esc, field, ghostBtn, longDate, num, panel, primaryBtn, todayISO, useSavedState } from "./kit";

type Crit = { name: string; max: string };
type Bid = { name: string; price: string; scores: string[] };

const METHODS = [
  { id: "qcbs", label: "Quality + cost (QCBS)" },
  { id: "lowest", label: "Lowest evaluated price" },
] as const;

const INITIAL = {
  org: "",
  tender: "",
  ref: "",
  date: "",
  method: "qcbs" as BidMethod,
  techWeight: "70",
  passMark: "70",
  committee: "Chairman\nSecretary\nMember",
  criteria: [
    { name: "Relevant experience", max: "30" },
    { name: "Methodology and work plan", max: "30" },
    { name: "Key staff qualifications", max: "25" },
    { name: "Financial capacity", max: "15" },
  ] as Crit[],
  bids: [
    { name: "Bidder A Ltd", price: "48500000", scores: ["26", "24", "20", "12"] },
    { name: "Bidder B Nig. Ltd", price: "41200000", scores: ["22", "21", "18", "11"] },
    { name: "Bidder C Ventures", price: "36900000", scores: ["15", "14", "12", "8"] },
  ] as Bid[],
};

const naira0 = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");
const pct = (n: number | null) => (n == null ? "—" : n.toFixed(2));

export default function BidEvaluationTool() {
  const [s, setS] = useSavedState("dt-bid-evaluation", INITIAL);
  const { criteria, bids } = s;
  const setCriteria = (c: Crit[]) => setS({ ...s, criteria: c, bids: bids.map((b) => ({ ...b, scores: c.map((_, k) => b.scores[k] ?? "") })) });
  const setBids = (b: Bid[]) => setS({ ...s, bids: b });

  const rows = useMemo(
    () =>
      evaluateBids(
        criteria.map((c) => ({ name: c.name, max: num(c.max) })),
        bids.map((b) => ({ name: b.name, price: num(b.price), scores: b.scores.map(num) })),
        s.method,
        num(s.techWeight),
        num(s.passMark)
      ),
    [criteria, bids, s.method, s.techWeight, s.passMark]
  );
  const ranked = [...rows].filter((r) => r.rank != null).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  const winner = ranked[0];
  const tw = num(s.techWeight);

  function print() {
    const td = "border:1px solid #bbb;padding:5px 7px";
    const members = s.committee.split("\n").map((m) => m.trim()).filter(Boolean);
    const html = `<div style="max-width:900px;margin:24px auto;font-size:13px;color:#111">
      <p style="text-align:center;font-weight:bold;font-size:15px;margin:0">${esc(s.org || "Procuring entity")}</p>
      <h1 style="text-align:center;font-size:18px;margin:6px 0">Bid evaluation report</h1>
      <p style="text-align:center;margin:0">${esc(s.tender || "Tender")}${s.ref ? " · Ref: " + esc(s.ref) : ""} · ${longDate(s.date || todayISO())}</p>
      <p style="margin-top:16px"><b>Method:</b> ${s.method === "qcbs" ? `Quality and cost based selection: technical ${tw}%, financial ${100 - tw}%. Technical pass mark ${esc(s.passMark)}%; financial proposals of bids below the pass mark were not scored.` : `Lowest evaluated responsive bid. Technical pass mark ${esc(s.passMark)}%; passing bids ranked by price.`}</p>
      <h2 style="font-size:14px">1. Technical evaluation</h2>
      <table style="border-collapse:collapse;width:100%"><tr><th style="${td};text-align:left">Criterion (max)</th>${bids.map((b) => `<th style="${td}">${esc(b.name)}</th>`).join("")}</tr>
      ${criteria.map((c, k) => `<tr><td style="${td}">${esc(c.name)} (${esc(c.max)})</td>${bids.map((b) => `<td style="${td};text-align:center">${esc(b.scores[k] ?? "")}</td>`).join("")}</tr>`).join("")}
      <tr><td style="${td}"><b>Technical score %</b></td>${rows.map((r) => `<td style="${td};text-align:center"><b>${pct(r.technical)}</b> ${r.passed ? "" : "<br/><span style='color:#b00'>Did not pass</span>"}</td>`).join("")}</tr></table>
      <h2 style="font-size:14px">2. Financial and combined evaluation</h2>
      <table style="border-collapse:collapse;width:100%"><tr><th style="${td};text-align:left">Bidder</th><th style="${td}">Bid price</th><th style="${td}">Technical %</th><th style="${td}">Financial %</th><th style="${td}">${s.method === "qcbs" ? "Combined" : "Score"}</th><th style="${td}">Rank</th></tr>
      ${rows.map((r) => `<tr><td style="${td}">${esc(r.name)}</td><td style="${td};text-align:right">${naira0(r.price)}</td><td style="${td};text-align:center">${pct(r.technical)}</td><td style="${td};text-align:center">${pct(r.financial)}</td><td style="${td};text-align:center">${pct(r.combined)}</td><td style="${td};text-align:center">${r.rank ?? "—"}</td></tr>`).join("")}</table>
      <h2 style="font-size:14px">3. Recommendation</h2>
      <p>${winner ? `The committee recommends the award to <b>${esc(winner.name)}</b> at a bid price of <b>${naira0(winner.price)}</b>, being the ${s.method === "qcbs" ? "highest combined score" : "lowest evaluated responsive bid"}.` : "No bid met the technical pass mark. The committee recommends re-tendering."}</p>
      <h2 style="font-size:14px;margin-top:28px">Evaluation committee</h2>
      <table style="width:100%;border-collapse:collapse">${members.map((m) => `<tr><td style="padding:14px 0;width:40%">${esc(m)}</td><td style="padding:14px 0">Signature: ____________________</td><td style="padding:14px 0">Date: __________</td></tr>`).join("")}</table></div>`;
    printHtml(`Bid evaluation ${s.tender}`, html);
  }

  return (
    <div className="space-y-6">
      <div className={panel}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="Organisation / ministry / agency" value={s.org} onChange={(v) => setS({ ...s, org: v })} />
          <Field name="Tender title" value={s.tender} onChange={(v) => setS({ ...s, tender: v })} placeholder="e.g. Supply and installation of solar street lights" />
          <Field name="Tender reference" value={s.ref} onChange={(v) => setS({ ...s, ref: v })} />
          <Field name="Evaluation date" type="date" value={s.date} onChange={(v) => setS({ ...s, date: v })} />
        </div>
        <div>
          <p className="mb-2 text-[12px] font-medium text-brand-muted">Selection method</p>
          <Chips label="Selection method" options={METHODS} value={s.method} onChange={(v) => setS({ ...s, method: v })} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {s.method === "qcbs" && <Field name="Technical weight (%) — financial gets the rest" type="number" value={s.techWeight} onChange={(v) => setS({ ...s, techWeight: v })} />}
          <Field name="Technical pass mark (%)" type="number" value={s.passMark} onChange={(v) => setS({ ...s, passMark: v })} />
        </div>
      </div>

      <div className={panel}>
        <h2 className="text-[15px] font-semibold text-white">Technical criteria and scores</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="text-left text-brand-muted">
                <th className="py-2 font-medium">Criterion</th>
                <th className="w-20 font-medium">Max</th>
                {bids.map((b, j) => (
                  <th key={j} className="min-w-[130px] font-medium">
                    <input aria-label={`Bidder ${j + 1} name`} className={field} value={b.name} onChange={(e) => setBids(bids.map((x, i) => (i === j ? { ...x, name: e.target.value } : x)))} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((c, k) => (
                <tr key={k} className="border-t border-white/5">
                  <td className="pr-2"><input aria-label={`Criterion ${k + 1}`} className={field} value={c.name} onChange={(e) => setCriteria(criteria.map((x, i) => (i === k ? { ...x, name: e.target.value } : x)))} /></td>
                  <td className="pr-2"><input aria-label={`Criterion ${k + 1} maximum`} type="number" className={field} value={c.max} onChange={(e) => setCriteria(criteria.map((x, i) => (i === k ? { ...x, max: e.target.value } : x)))} /></td>
                  {bids.map((b, j) => (
                    <td key={j} className="pr-2">
                      <input aria-label={`${b.name} score for ${c.name}`} type="number" inputMode="decimal" className={field} value={b.scores[k] ?? ""} onChange={(e) => setBids(bids.map((x, i) => (i === j ? { ...x, scores: criteria.map((_, q) => (q === k ? e.target.value : x.scores[q] ?? "")) } : x)))} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-white/10">
                <td colSpan={2} className="py-2 text-brand-muted">Bid price (₦)</td>
                {bids.map((b, j) => (
                  <td key={j} className="pr-2"><input aria-label={`${b.name} bid price`} type="number" inputMode="decimal" className={field} value={b.price} onChange={(e) => setBids(bids.map((x, i) => (i === j ? { ...x, price: e.target.value } : x)))} /></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={ghostBtn} onClick={() => setCriteria([...criteria, { name: "", max: "10" }])}>+ Criterion</button>
          <button type="button" className={ghostBtn} onClick={() => setBids([...bids, { name: `Bidder ${String.fromCharCode(65 + bids.length)}`, price: "", scores: criteria.map(() => "") }])}>+ Bidder</button>
          {criteria.length > 1 && <button type="button" className={ghostBtn} onClick={() => setCriteria(criteria.slice(0, -1))}>Remove last criterion</button>}
          {bids.length > 1 && <button type="button" className={ghostBtn} onClick={() => setBids(bids.slice(0, -1))}>Remove last bidder</button>}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-brand-surface p-5" aria-live="polite">
        <h2 className="text-[15px] font-semibold text-white">Result</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-right text-[13px]">
            <thead><tr className="text-brand-muted"><th className="py-1.5 text-left font-medium">Bidder</th><th className="font-medium">Price</th><th className="font-medium">Technical %</th><th className="font-medium">Financial %</th><th className="font-medium">{s.method === "qcbs" ? "Combined" : "Score"}</th><th className="font-medium">Rank</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className={`border-t border-white/5 ${r.rank === 1 ? "text-[#ff8c14]" : "text-white"}`}>
                  <th scope="row" className="py-1.5 text-left font-medium">{r.name}{!r.passed && <span className="ml-2 text-[12px] text-[#ff6b6b]">below pass mark</span>}</th>
                  <td>{naira0(r.price)}</td>
                  <td>{pct(r.technical)}</td>
                  <td>{pct(r.financial)}</td>
                  <td className="font-semibold">{pct(r.combined)}</td>
                  <td>{r.rank ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[14px] text-white">
          {winner ? <>Recommended: <b className="text-[#ff8c14]">{winner.name}</b> at {naira0(winner.price)}.</> : "No bid met the technical pass mark: re-tender."}
        </p>
        <div className="mt-4"><Area name="Committee members (one per line, for signatures)" rows={3} value={s.committee} onChange={(v) => setS({ ...s, committee: v })} /></div>
        <button type="button" onClick={print} className={`${primaryBtn} mt-4 w-full sm:w-auto`}>Download evaluation report PDF</button>
        <p className="mt-2 text-[12px] text-brand-subtle">Bid data stays on this device. Follow your procurement law and the bidding document&apos;s stated criteria.</p>
      </div>
    </div>
  );
}
