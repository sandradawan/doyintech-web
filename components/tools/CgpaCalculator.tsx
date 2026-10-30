"use client";

import { useEffect, useMemo, useState } from "react";

type Scale = "5" | "4";
type Course = { id: string; code: string; units: string; grade: string };
type Semester = { id: string; name: string; courses: Course[] };

/** Nigerian university 5-point and polytechnic 4-point grading. */
const SCALES: Record<Scale, { label: string; points: Record<string, number>; classes: [number, string][] }> = {
  "5": {
    label: "University (5.0)",
    points: { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 },
    classes: [
      [4.5, "First Class"],
      [3.5, "Second Class Upper (2:1)"],
      [2.4, "Second Class Lower (2:2)"],
      [1.5, "Third Class"],
      [1.0, "Pass"],
      [0, "Below pass"],
    ],
  },
  "4": {
    label: "Polytechnic (4.0)",
    points: { AA: 4, A: 3.5, AB: 3.25, B: 3, BC: 2.75, C: 2.5, CD: 2.25, D: 2, F: 0 },
    classes: [
      [3.5, "Distinction"],
      [3.0, "Upper Credit"],
      [2.5, "Lower Credit"],
      [2.0, "Pass"],
      [0, "Below pass"],
    ],
  },
};

const STORAGE = "doyintech_cgpa_v1";
const uid = () => Math.random().toString(36).slice(2, 9);
const blankCourse = (): Course => ({ id: uid(), code: "", units: "", grade: "" });
const blankSemester = (n: number): Semester => ({ id: uid(), name: `Semester ${n}`, courses: [blankCourse(), blankCourse(), blankCourse()] });

const field = "w-full rounded-lg border border-white/15 bg-black/40 px-2.5 py-2 text-[14px] text-white outline-none focus:border-[#ff8c14]";

function gpaOf(courses: Course[], points: Record<string, number>) {
  let units = 0;
  let quality = 0;
  for (const c of courses) {
    const u = Number(c.units);
    if (!(u > 0) || !(c.grade in points)) continue;
    units += u;
    quality += u * points[c.grade];
  }
  return { units, quality, gpa: units ? quality / units : 0 };
}

function classOf(cgpa: number, scale: Scale) {
  return SCALES[scale].classes.find(([min]) => cgpa >= min)?.[1] || "";
}

/** GPA per semester, cumulative CGPA, degree class, and the GPA needed to hit a target. Saved on this device. */
export default function CgpaCalculator() {
  const [scale, setScale] = useState<Scale>("5");
  const [semesters, setSemesters] = useState<Semester[]>([blankSemester(1)]);
  const [prevCgpa, setPrevCgpa] = useState("");
  const [prevUnits, setPrevUnits] = useState("");
  const [target, setTarget] = useState("");
  const [futureUnits, setFutureUnits] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || "null");
      if (saved?.semesters?.length) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved work after hydration
        setSemesters(saved.semesters);
        if (saved.scale === "4" || saved.scale === "5") setScale(saved.scale);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify({ scale, semesters }));
    } catch {
      /* ignore */
    }
  }, [scale, semesters]);

  const points = SCALES[scale].points;
  const perSemester = semesters.map((s) => gpaOf(s.courses, points));
  const prevU = Number(prevUnits) || 0;
  const prevQ = prevU * (Number(prevCgpa) || 0);
  const totalUnits = perSemester.reduce((n, g) => n + g.units, 0) + prevU;
  const totalQuality = perSemester.reduce((n, g) => n + g.quality, 0) + prevQ;
  const cgpa = totalUnits ? totalQuality / totalUnits : 0;

  const needed = useMemo(() => {
    const t = Number(target);
    const fu = Number(futureUnits);
    if (!(t > 0) || !(fu > 0)) return null;
    return (t * (totalUnits + fu) - totalQuality) / fu;
  }, [target, futureUnits, totalUnits, totalQuality]);

  const max = Number(scale);

  function updateCourse(si: number, ci: number, patch: Partial<Course>) {
    setSemesters((ss) => ss.map((s, i) => (i !== si ? s : { ...s, courses: s.courses.map((c, j) => (j === ci ? { ...c, ...patch } : c)) })));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Grading scale">
          {(Object.keys(SCALES) as Scale[]).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={scale === s}
              onClick={() => {
                setScale(s);
                setSemesters((ss) => ss.map((sem) => ({ ...sem, courses: sem.courses.map((c) => ({ ...c, grade: "" })) })));
              }}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold ${scale === s ? "bg-[#ff8c14] text-black" : "border border-white/15 text-[#c7cdd8]"}`}
            >
              {SCALES[s].label}
            </button>
          ))}
        </div>

        {semesters.map((sem, si) => (
          <section key={sem.id} className="rounded-2xl border border-white/10 bg-[#141a28] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <input
                value={sem.name}
                onChange={(e) => setSemesters((ss) => ss.map((s, i) => (i === si ? { ...s, name: e.target.value } : s)))}
                aria-label="Semester name"
                className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-white outline-none"
              />
              <span className="text-[13px] text-[#a1a1a6]">
                GPA <strong className="text-white">{perSemester[si].gpa.toFixed(2)}</strong>
              </span>
              {semesters.length > 1 && (
                <button type="button" onClick={() => setSemesters((ss) => ss.filter((_, i) => i !== si))} className="text-[12px] text-red-400 underline">
                  Remove
                </button>
              )}
            </div>
            <div className="mt-3 grid grid-cols-[1fr_72px_96px_28px] gap-2 text-[11px] uppercase tracking-wide text-[#86868b]">
              <span>Course</span>
              <span>Units</span>
              <span>Grade</span>
              <span />
            </div>
            <div className="mt-1 space-y-2">
              {sem.courses.map((c, ci) => (
                <div key={c.id} className="grid grid-cols-[1fr_72px_96px_28px] gap-2">
                  <input value={c.code} onChange={(e) => updateCourse(si, ci, { code: e.target.value })} placeholder="GST 101" aria-label="Course code" className={field} />
                  <input
                    value={c.units}
                    inputMode="numeric"
                    onChange={(e) => updateCourse(si, ci, { units: e.target.value.replace(/[^\d]/g, "").slice(0, 2) })}
                    placeholder="3"
                    aria-label="Credit units"
                    className={field}
                  />
                  <select value={c.grade} onChange={(e) => updateCourse(si, ci, { grade: e.target.value })} aria-label="Grade" className={field}>
                    <option value="">—</option>
                    {Object.keys(points).map((g) => (
                      <option key={g} value={g}>
                        {g} ({points[g]})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    aria-label="Remove course"
                    onClick={() => setSemesters((ss) => ss.map((s, i) => (i !== si ? s : { ...s, courses: s.courses.filter((_, j) => j !== ci) })))}
                    className="text-[16px] text-[#86868b] hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSemesters((ss) => ss.map((s, i) => (i === si ? { ...s, courses: [...s.courses, blankCourse()] } : s)))}
              className="mt-3 text-[13px] font-semibold text-[#ff8c14] hover:underline"
            >
              + Add course
            </button>
          </section>
        ))}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSemesters((ss) => [...ss, blankSemester(ss.length + 1)])}
            className="rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white"
          >
            + Add semester
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear all courses?")) setSemesters([blankSemester(1)]);
            }}
            className="text-[13px] text-[#a1a1a6] underline"
          >
            Start over
          </button>
        </div>

        <details className="rounded-2xl border border-white/10 bg-[#141a28] p-4">
          <summary className="cursor-pointer text-[14px] font-semibold text-white">Already have a CGPA from earlier semesters?</summary>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="text-[13px] text-[#a1a1a6]">
              Current CGPA
              <input className={`${field} mt-1`} inputMode="decimal" value={prevCgpa} onChange={(e) => setPrevCgpa(e.target.value)} placeholder="3.45" />
            </label>
            <label className="text-[13px] text-[#a1a1a6]">
              Units taken so far
              <input className={`${field} mt-1`} inputMode="numeric" value={prevUnits} onChange={(e) => setPrevUnits(e.target.value)} placeholder="72" />
            </label>
          </div>
        </details>
      </div>

      <aside className="h-fit space-y-4 lg:sticky lg:top-24">
        <div className="rounded-2xl border border-[#ff8c14]/40 bg-[#ff8c14]/[0.06] p-5">
          <p className="text-[12px] uppercase tracking-wide text-[#ffb366]">Your CGPA</p>
          <p className="mt-1 text-[44px] font-semibold leading-none tabular-nums text-white">
            {cgpa.toFixed(2)}
            <span className="text-[16px] text-[#a1a1a6]"> / {max.toFixed(1)}</span>
          </p>
          <p className="mt-2 text-[15px] font-semibold text-white">{totalUnits ? classOf(cgpa, scale) : "Add courses to see your class"}</p>
          <p className="mt-1 text-[12px] text-[#a1a1a6]">{totalUnits} units counted</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <p className="text-[14px] font-semibold text-white">What GPA do I need?</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="text-[12px] text-[#a1a1a6]">
              Target CGPA
              <input className={`${field} mt-1`} inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} placeholder={scale === "5" ? "4.50" : "3.50"} />
            </label>
            <label className="text-[12px] text-[#a1a1a6]">
              Units still to take
              <input className={`${field} mt-1`} inputMode="numeric" value={futureUnits} onChange={(e) => setFutureUnits(e.target.value)} placeholder="48" />
            </label>
          </div>
          {needed !== null && (
            <p className="mt-3 text-[14px] text-[#c7cdd8]">
              {needed > max ? (
                <>Not reachable with {futureUnits} units: you&apos;d need {needed.toFixed(2)}. Aim for the next class down.</>
              ) : needed <= 0 ? (
                <>You&apos;re already there. Keep it steady.</>
              ) : (
                <>
                  You need an average GPA of <strong className="text-white">{needed.toFixed(2)}</strong> over your remaining units.
                </>
              )}
            </p>
          )}
        </div>
        <p className="text-[12px] text-[#86868b]">Saved on this device only. Check your school&apos;s handbook: some departments use slightly different boundaries.</p>
      </aside>
    </div>
  );
}
