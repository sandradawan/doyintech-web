"use client";

import { useEffect, useMemo, useState } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { complianceCalendar, deadlinesToIcs, type EntityKind } from "@/lib/tools/bottleneck-calcs";
import { Chips, Field, esc, ghostBtn, longDate, num, panel, primaryBtn, useSavedState } from "./kit";

const KINDS = [
  { id: "company", label: "Limited company" },
  { id: "business-name", label: "Business name / sole trader" },
  { id: "ngo", label: "NGO / church / association" },
  { id: "individual", label: "Freelancer" },
] as const;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const INITIAL = {
  org: "",
  kind: "company" as EntityKind,
  hasStaff: true,
  staff: "6",
  vat: true,
  wht: true,
  yearEnd: "12",
  registered: "",
};

export default function ComplianceCalendar() {
  const [s, setS] = useSavedState("dt-compliance-calendar", INITIAL);
  // Today's date only on the client, so the server render and hydration agree.
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the clock once after mount
    setToday(new Date());
  }, []);

  const items = useMemo(
    () =>
      today
        ? complianceCalendar(
            { kind: s.kind, hasStaff: s.hasStaff, staffCount: num(s.staff), vatRegistered: s.vat, deductsWht: s.wht, yearEndMonth: num(s.yearEnd), registeredOn: s.registered },
            today
          )
        : [],
    [s, today]
  );

  const daysLeft = (d: string) => (today ? Math.ceil((new Date(d + "T12:00:00").getTime() - today.getTime()) / 86400000) : 0);

  function downloadIcs() {
    const blob = new Blob([deadlinesToIcs(items, s.org ? `${s.org} compliance` : "Compliance deadlines")], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "compliance-deadlines.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function print() {
    const td = "border-bottom:1px solid #ddd;padding:7px 6px;vertical-align:top";
    const html = `<div style="max-width:820px;margin:24px auto;font-size:13px">
      <h1 style="font-size:20px;margin:0">Compliance calendar${s.org ? ": " + esc(s.org) : ""}</h1>
      <p style="color:#555">Next 12 months · ${KINDS.find((k) => k.id === s.kind)?.label}</p>
      <table style="width:100%;border-collapse:collapse"><tr><th style="${td};text-align:left">Due</th><th style="${td};text-align:left">What</th><th style="${td};text-align:left">Who</th><th style="${td}">Done</th></tr>
      ${items.map((d) => `<tr><td style="${td};white-space:nowrap">${longDate(d.date)}</td><td style="${td}"><b>${esc(d.title)}</b><br/><span style="color:#666">${esc(d.note)}</span></td><td style="${td}">${esc(d.agency)}</td><td style="${td};text-align:center">☐</td></tr>`).join("")}</table>
      <p style="color:#777;font-size:12px;margin-top:16px">If a date falls on a weekend or public holiday, file by the working day before. Confirm with your tax adviser or the agency. doyintech.com/tools/compliance-calendar-nigeria</p></div>`;
    printHtml("Compliance calendar", html);
  }

  const check = (k: "hasStaff" | "vat" | "wht", text: string) => (
    <label className="flex min-h-11 items-center gap-3 text-[14px] text-[#e8eaed]">
      <input type="checkbox" className="h-5 w-5 accent-[#ff8c14]" checked={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.checked })} />
      {text}
    </label>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <div className={`${panel} lg:sticky lg:top-28 lg:self-start`}>
        <Field name="Organisation name (optional)" value={s.org} onChange={(v) => setS({ ...s, org: v })} />
        <div>
          <p className="mb-2 text-[12px] font-medium text-[#a1a1a6]">What are you registered as?</p>
          <Chips label="Registration type" options={KINDS} value={s.kind} onChange={(v) => setS({ ...s, kind: v })} />
        </div>
        <div>
          {check("hasStaff", "We pay salaries to staff")}
          {s.hasStaff && <Field name="Number of staff" type="number" value={s.staff} onChange={(v) => setS({ ...s, staff: v })} className="mb-2 max-w-[200px]" />}
          {check("vat", "We are registered for VAT")}
          {check("wht", "We deduct withholding tax from suppliers")}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {s.kind === "company" && (
            <label className="block text-[12px] font-medium text-[#a1a1a6]">
              Accounting year ends in
              <select className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[14px] text-white" value={s.yearEnd} onChange={(e) => setS({ ...s, yearEnd: e.target.value })}>
                {MONTHS.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
              </select>
            </label>
          )}
          {s.kind !== "individual" && <Field name="CAC registration date" type="date" value={s.registered} onChange={(v) => setS({ ...s, registered: v })} />}
        </div>
      </div>

      <div className="space-y-4" aria-live="polite">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={downloadIcs} className={primaryBtn} disabled={!items.length}>Add all to Google / Outlook calendar (.ics)</button>
          <button type="button" onClick={print} className={ghostBtn} disabled={!items.length}>Print checklist</button>
        </div>
        <p className="text-[12px] text-[#8b919c]">The calendar file sets a reminder 3 days before each deadline. In Google Calendar: Settings → Import.</p>
        {!today ? (
          <p className="text-[14px] text-[#a1a1a6]">Loading your deadlines…</p>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-white/10 p-4 text-[14px] text-[#a1a1a6]">No recurring deadlines for these answers. Tick the boxes that apply to you.</p>
        ) : (
          <ol className="space-y-2">
            {items.map((d, i) => {
              const left = daysLeft(d.date);
              return (
                <li key={i} className={`rounded-xl border p-4 ${left <= 14 ? "border-[#ff8c14]/50 bg-[#ff8c14]/5" : "border-white/10 bg-[#141a28]"}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-[15px] font-semibold text-white">{d.title}</p>
                    <p className={`text-[13px] font-semibold ${left <= 14 ? "text-[#ff8c14]" : "text-[#a1a1a6]"}`}>{longDate(d.date)} · {left <= 0 ? "today" : `${left} day${left === 1 ? "" : "s"}`}</p>
                  </div>
                  <p className="mt-1 text-[13px] text-[#c7cdd8]">{d.agency}</p>
                  <p className="mt-1 text-[13px] text-[#a1a1a6]">{d.note}</p>
                </li>
              );
            })}
          </ol>
        )}
        <p className="text-[12px] text-[#8b919c]">If a date falls on a weekend or public holiday, file by the working day before. Rules change; confirm with your accountant or the agency.</p>
      </div>
    </div>
  );
}
