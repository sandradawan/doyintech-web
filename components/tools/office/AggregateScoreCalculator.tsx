"use client";

import { useMemo, useState } from "react";
import { Chips, Field, field, label, num, panel } from "./kit";

type Method = "fifty" | "olevel" | "custom";

const METHODS = [
  { id: "fifty", label: "JAMB 50% + Post-UTME 50%" },
  { id: "olevel", label: "JAMB 50% + Post-UTME 30% + O'level 20%" },
  { id: "custom", label: "Custom weights" },
] as const;

/** Points per O'level grade used by schools that score five subjects out of 20. */
const OLEVEL_POINTS: Record<string, number> = { A1: 4, B2: 3.6, B3: 3.2, C4: 2.8, C5: 2.4, C6: 2 };

export function aggregate(o: { method: Method; jamb: number; putme: number; putmeMax: number; grades: string[]; w: { jamb: number; putme: number; olevel: number } }) {
  const jambPct = Math.min(400, Math.max(0, o.jamb)) / 400;
  const putmePct = o.putmeMax > 0 ? Math.min(o.putmeMax, Math.max(0, o.putme)) / o.putmeMax : 0;
  const olevelPct = o.grades.reduce((s, g) => s + (OLEVEL_POINTS[g] || 0), 0) / 20;
  const weights = o.method === "fifty" ? { jamb: 50, putme: 50, olevel: 0 } : o.method === "olevel" ? { jamb: 50, putme: 30, olevel: 20 } : o.w;
  const total = weights.jamb + weights.putme + weights.olevel;
  const parts = { jamb: jambPct * weights.jamb, putme: putmePct * weights.putme, olevel: olevelPct * weights.olevel };
  const score = total > 0 ? ((parts.jamb + parts.putme + parts.olevel) / total) * 100 : 0;
  return { score, parts, weights };
}

export default function AggregateScoreCalculator() {
  const [method, setMethod] = useState<Method>("fifty");
  const [jamb, setJamb] = useState("250");
  const [putme, setPutme] = useState("60");
  const [putmeMax, setPutmeMax] = useState("100");
  const [grades, setGrades] = useState(["B3", "B3", "C4", "C4", "C5"]);
  const [w, setW] = useState({ jamb: "50", putme: "50", olevel: "0" });

  const r = useMemo(
    () => aggregate({ method, jamb: num(jamb), putme: num(putme), putmeMax: num(putmeMax), grades, w: { jamb: num(w.jamb), putme: num(w.putme), olevel: num(w.olevel) } }),
    [method, jamb, putme, putmeMax, grades, w],
  );
  const band = r.score >= 70 ? "Strong for most courses" : r.score >= 60 ? "Competitive for many courses" : r.score >= 50 ? "Borderline: compare with last year's cut-off" : "Below typical cut-offs for competitive courses";
  const subjects = ["English", "Mathematics", "Subject 3", "Subject 4", "Subject 5"];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className={panel}>
        <Chips label="Screening formula" options={METHODS} value={method} onChange={setMethod} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Field name="JAMB (UTME) score / 400" type="number" value={jamb} onChange={setJamb} />
          <Field name="Post-UTME score" type="number" value={putme} onChange={setPutme} />
          <Field name="Post-UTME is out of" type="number" value={putmeMax} onChange={setPutmeMax} />
        </div>
        {(method === "olevel" || (method === "custom" && num(w.olevel) > 0)) && (
          <fieldset>
            <legend className="mb-2 text-[13px] font-semibold text-white">O&apos;level grades (five relevant subjects, one sitting)</legend>
            <div className="grid gap-2 sm:grid-cols-5">
              {grades.map((g, i) => (
                <label key={i} className={label}>
                  {subjects[i]}
                  <select className={field} value={g} onChange={(e) => setGrades(grades.map((x, j) => (j === i ? e.target.value : x)))}>
                    {Object.keys(OLEVEL_POINTS).map((k) => (
                      <option key={k} value={k} className="bg-black">{k}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {method === "custom" && (
          <div className="grid gap-3 sm:grid-cols-3">
            <Field name="JAMB weight %" type="number" value={w.jamb} onChange={(v) => setW({ ...w, jamb: v })} />
            <Field name="Post-UTME weight %" type="number" value={w.putme} onChange={(v) => setW({ ...w, putme: v })} />
            <Field name="O'level weight %" type="number" value={w.olevel} onChange={(v) => setW({ ...w, olevel: v })} />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#ff8c14]/40 bg-gradient-to-b from-[#1d1d1f] to-[#141a28] p-6 lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-[#ff8c14]">Your aggregate</p>
        <p className="mt-2 text-[52px] font-semibold leading-none text-white">{r.score.toFixed(2)}<span className="text-[22px] text-[#a1a1a6]">/100</span></p>
        <p className="mt-2 text-[14px] text-[#e8eaed]">{band}</p>
        <dl className="mt-5 space-y-2 text-[14px]">
          <div className="flex justify-between"><dt className="text-[#a1a1a6]">JAMB ({r.weights.jamb}%)</dt><dd className="text-white">{r.parts.jamb.toFixed(2)}</dd></div>
          <div className="flex justify-between"><dt className="text-[#a1a1a6]">Post-UTME ({r.weights.putme}%)</dt><dd className="text-white">{r.parts.putme.toFixed(2)}</dd></div>
          {r.weights.olevel > 0 && <div className="flex justify-between"><dt className="text-[#a1a1a6]">O&apos;level ({r.weights.olevel}%)</dt><dd className="text-white">{r.parts.olevel.toFixed(2)}</dd></div>}
        </dl>
        <p className="mt-5 text-[12px] leading-relaxed text-[#a1a1a6]">Each school publishes its own formula and cut-off marks. Check your institution&apos;s admission brochure and choose Custom weights if it differs.</p>
      </div>
    </div>
  );
}
