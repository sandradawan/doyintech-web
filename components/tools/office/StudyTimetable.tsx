"use client";

import { useMemo } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { Field, esc, field, ghostBtn, label, num, panel, primaryBtn, todayISO, useSavedState } from "./kit";

type Course = { code: string; difficulty: string; exam: string };
type State = { courses: Course[]; hours: string[]; slot: string; start: string };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const START: State = {
  courses: [
    { code: "MTH 201", difficulty: "3", exam: "" },
    { code: "CSC 205", difficulty: "2", exam: "" },
    { code: "GST 211", difficulty: "1", exam: "" },
  ],
  hours: ["3", "3", "3", "3", "2", "5", "2"],
  slot: "60",
  start: "17:00",
};

/**
 * Splits weekly study time across courses by difficulty and how close each exam is,
 * then fills the week round-robin so the same course isn't stacked back to back.
 */
export function buildTimetable(s: State, today = todayISO()) {
  const slotMin = Math.max(30, num(s.slot) || 60);
  const courses = s.courses.filter((c) => c.code.trim());
  const weight = (c: Course) => {
    const d = Math.min(3, Math.max(1, num(c.difficulty) || 2));
    if (!c.exam) return d;
    const days = (new Date(c.exam).getTime() - new Date(today).getTime()) / 86_400_000;
    const urgency = days < 0 ? 0.5 : days <= 14 ? 2 : days <= 30 ? 1.5 : 1;
    return d * urgency;
  };
  const totalSlots = s.hours.reduce((sum, h) => sum + Math.floor((num(h) * 60) / slotMin), 0);
  const totalWeight = courses.reduce((sum, c) => sum + weight(c), 0) || 1;
  const quota = courses.map((c) => ({ code: c.code, left: Math.max(1, Math.round((weight(c) / totalWeight) * totalSlots)) }));

  const [h0, m0] = (s.start || "17:00").split(":").map(Number);
  let cursor = 0;
  const grid = DAYS.map((day, i) => {
    const n = Math.floor((num(s.hours[i]) * 60) / slotMin);
    const slots: { time: string; code: string }[] = [];
    let last = "";
    for (let k = 0; k < n; k++) {
      let pick = "";
      for (let tries = 0; tries < quota.length; tries++) {
        const q = quota[(cursor + tries) % quota.length];
        if (q.left > 0 && (q.code !== last || quota.length === 1)) {
          pick = q.code;
          q.left--;
          cursor = (cursor + tries + 1) % quota.length;
          break;
        }
      }
      const t = h0 * 60 + m0 + k * slotMin;
      slots.push({ time: `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`, code: pick || "Revision / past questions" });
      last = pick;
    }
    return { day, slots };
  });
  return { grid, totalSlots, slotMin, perCourse: courses.map((c) => ({ code: c.code, slots: grid.flatMap((d) => d.slots).filter((x) => x.code === c.code).length })) };
}

export default function StudyTimetable() {
  const [s, setS] = useSavedState<State>("doyintech_study_timetable_v1", START);
  const t = useMemo(() => buildTimetable(s), [s]);
  const setCourse = (i: number, k: keyof Course, v: string) => setS({ ...s, courses: s.courses.map((c, j) => (j === i ? { ...c, [k]: v } : c)) });

  function print() {
    const max = Math.max(...t.grid.map((d) => d.slots.length));
    const cell = "border:1px solid #ccc;padding:6px;font-size:12px;vertical-align:top";
    const rows = Array.from({ length: max }, (_, r) =>
      `<tr>${t.grid.map((d) => (d.slots[r] ? `<td style="${cell}"><b>${esc(d.slots[r].code)}</b><br/><span style="color:#666">${d.slots[r].time}</span></td>` : `<td style="${cell}"></td>`)).join("")}</tr>`,
    ).join("");
    printHtml(
      "Study timetable",
      `<style>@page{size:A4 landscape}</style><div style="margin:20px"><h1 style="font-size:20px">My study timetable</h1><p style="color:#555">${t.slotMin}-minute sessions. Tick each one when done.</p>
      <table style="width:100%;border-collapse:collapse"><tr>${t.grid.map((d) => `<th style="${cell};background:#f3f4f6">${d.day}</th>`).join("")}</tr>${rows}</table></div>`,
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={panel}>
          <p className="text-[15px] font-semibold text-white">Courses</p>
          {s.courses.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_110px_1fr_auto] items-end gap-2">
              <Field name="Course" value={c.code} onChange={(v) => setCourse(i, "code", v)} />
              <label className={label}>
                Difficulty
                <select className={field} value={c.difficulty} onChange={(e) => setCourse(i, "difficulty", e.target.value)}>
                  <option value="1" className="bg-black">Easy</option>
                  <option value="2" className="bg-black">Medium</option>
                  <option value="3" className="bg-black">Hard</option>
                </select>
              </label>
              <Field name="Exam date" type="date" value={c.exam} onChange={(v) => setCourse(i, "exam", v)} />
              <button type="button" aria-label={`Remove ${c.code || "course"}`} className="min-h-11 px-2 text-[#ff8a8a]" onClick={() => setS({ ...s, courses: s.courses.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <button type="button" className={ghostBtn} onClick={() => setS({ ...s, courses: [...s.courses, { code: "", difficulty: "2", exam: "" }] })}>+ Add course</button>
        </div>
        <div className={panel}>
          <p className="text-[15px] font-semibold text-white">Hours you can study each day</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {DAYS.map((d, i) => (
              <Field key={d} name={d} type="number" value={s.hours[i] || ""} onChange={(v) => setS({ ...s, hours: s.hours.map((h, j) => (j === i ? v : h)) })} />
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={label}>
              Session length
              <select className={field} value={s.slot} onChange={(e) => setS({ ...s, slot: e.target.value })}>
                {["30", "45", "60", "90"].map((m) => <option key={m} value={m} className="bg-black">{m} minutes</option>)}
              </select>
            </label>
            <Field name="Start time" type="time" value={s.start} onChange={(v) => setS({ ...s, start: v })} />
          </div>
          <ul className="space-y-1 text-[13px] text-brand-soft">
            {t.perCourse.map((c) => (
              <li key={c.code} className="flex justify-between"><span>{c.code}</span><span>{c.slots} sessions / week</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-brand-surface p-4">
        <div className="grid min-w-[720px] grid-cols-7 gap-2">
          {t.grid.map((d) => (
            <div key={d.day}>
              <p className="mb-2 text-center text-[13px] font-semibold text-white">{d.day}</p>
              <div className="space-y-1.5">
                {d.slots.length === 0 && <p className="rounded-lg border border-dashed border-white/10 p-2 text-center text-[11px] text-brand-muted">Rest</p>}
                {d.slots.map((x, k) => (
                  <div key={k} className="rounded-lg bg-black/40 p-2">
                    <p className="text-[12px] font-semibold text-white">{x.code}</p>
                    <p className="text-[11px] text-brand-muted">{x.time}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button type="button" className={primaryBtn} onClick={print}>Print timetable</button>
    </div>
  );
}
