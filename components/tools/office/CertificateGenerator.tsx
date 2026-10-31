"use client";

import { useState } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { Area, Chips, Field, esc, longDate, panel, primaryBtn, todayISO, useSavedState } from "./kit";

type Kind = "completion" | "participation" | "achievement" | "appreciation" | "attendance";

const KINDS = [
  { id: "completion", label: "Completion" },
  { id: "participation", label: "Participation" },
  { id: "achievement", label: "Achievement" },
  { id: "appreciation", label: "Appreciation" },
  { id: "attendance", label: "Attendance" },
] as const;

const LINE: Record<Kind, (event: string) => string> = {
  completion: (e) => `for successfully completing ${e || "the training programme"}`,
  participation: (e) => `for active participation in ${e || "the programme"}`,
  achievement: (e) => `in recognition of outstanding achievement in ${e || "the competition"}`,
  appreciation: (e) => `in appreciation of dedicated service and contribution to ${e || "our organisation"}`,
  attendance: (e) => `for attending ${e || "the event"}`,
};

/** Printable landscape certificates; one page per name, so a whole class or team prints in one go. */
export default function CertificateGenerator() {
  const [org, setOrg] = useSavedState("doyintech_certificate_org_v1", { name: "", color: "#b45309", sign1: "", title1: "Director", sign2: "", title2: "Programme Coordinator" });
  const [kind, setKind] = useState<Kind>("completion");
  const [event, setEvent] = useState("");
  const [date, setDate] = useState(todayISO);
  const [names, setNames] = useState("");
  const list = names.split("\n").map((n) => n.trim()).filter(Boolean);
  const first = list[0] || "Recipient Name";
  const heading = KINDS.find((k) => k.id === kind)!.label;

  function page(name: string, i: number) {
    const c = esc(org.color);
    const sig = (n: string, t: string) => (n || t ? `<div style="text-align:center;min-width:200px"><div style="border-top:1px solid #333;padding-top:6px;font-weight:600">${esc(n)}</div><div style="font-size:12px;color:#555">${esc(t)}</div></div>` : "");
    return `<section style="width:277mm;height:190mm;box-sizing:border-box;margin:0 auto;padding:14mm;${i ? "page-break-before:always;" : ""}">
      <div style="height:100%;box-sizing:border-box;border:6px double ${c};padding:14mm 18mm;text-align:center;font-family:Georgia,'Times New Roman',serif;color:#1f2937;display:flex;flex-direction:column;justify-content:space-between">
        <div><div style="font-size:15px;letter-spacing:3px;text-transform:uppercase;color:#444">${esc(org.name || "Organisation name")}</div>
        <div style="font-size:40px;color:${c};margin-top:14px;letter-spacing:2px">CERTIFICATE</div>
        <div style="font-size:16px;letter-spacing:6px;text-transform:uppercase">of ${esc(heading)}</div></div>
        <div><div style="font-size:14px;color:#555">This certificate is proudly presented to</div>
        <div style="font-size:36px;font-style:italic;margin:10px 0;border-bottom:1px solid #ccc;display:inline-block;padding:0 30px 6px">${esc(name)}</div>
        <div style="font-size:15px;margin-top:6px">${esc(LINE[kind](event))}</div>
        <div style="font-size:13px;color:#555;margin-top:6px">${esc(longDate(date))}</div></div>
        <div style="display:flex;justify-content:space-around">${sig(org.sign1, org.title1)}${sig(org.sign2, org.title2)}</div>
      </div></section>`;
  }

  function print() {
    const html = `<style>@page{size:A4 landscape;margin:0}</style>${(list.length ? list : [first]).map(page).join("")}`;
    printHtml(`Certificates ${event}`.trim(), html);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className={panel}>
        <Chips label="Certificate type" options={KINDS} value={kind} onChange={setKind} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="Organisation / school (saved)" value={org.name} onChange={(v) => setOrg({ ...org, name: v })} />
          <Field name="Course, event or award" value={event} onChange={setEvent} placeholder="Digital Marketing Bootcamp 2026" />
          <Field name="Date" type="date" value={date} onChange={setDate} />
          <label className="block text-[12px] font-medium text-[#a1a1a6]">
            Colour
            <input type="color" value={org.color} onChange={(e) => setOrg({ ...org, color: e.target.value })} className="mt-1 h-11 w-full cursor-pointer rounded-xl border border-white/15 bg-black/40" />
          </label>
          <Field name="Signatory 1 name" value={org.sign1} onChange={(v) => setOrg({ ...org, sign1: v })} />
          <Field name="Signatory 1 title" value={org.title1} onChange={(v) => setOrg({ ...org, title1: v })} />
          <Field name="Signatory 2 name" value={org.sign2} onChange={(v) => setOrg({ ...org, sign2: v })} />
          <Field name="Signatory 2 title" value={org.title2} onChange={(v) => setOrg({ ...org, title2: v })} />
        </div>
        <Area name="Recipient names, one per line (prints one certificate each)" rows={6} value={names} onChange={setNames} placeholder={"Chiamaka Eze\nIbrahim Sani\nTolu Adeyemi"} />
        <button type="button" onClick={print} className={`${primaryBtn} w-full`}>
          Print {list.length > 1 ? `${list.length} certificates` : "certificate"} (PDF)
        </button>
        <p className="text-[12px] text-[#a1a1a6]">Prints A4 landscape. In the print window turn off “Headers and footers” for a clean edge.</p>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start" aria-label="Certificate preview">
        <div className="aspect-[297/210] rounded-xl bg-white p-3 shadow-xl">
          <div className="flex h-full flex-col justify-between border-[5px] border-double p-4 text-center font-serif text-gray-800" style={{ borderColor: org.color }}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600">{org.name || "Organisation name"}</p>
              <p className="mt-1 text-[24px] tracking-wider sm:text-[28px]" style={{ color: org.color }}>CERTIFICATE</p>
              <p className="text-[10px] uppercase tracking-[0.4em]">of {heading}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">This certificate is proudly presented to</p>
              <p className="my-1 text-[20px] italic sm:text-[24px]">{first}</p>
              <p className="text-[11px]">{LINE[kind](event)}</p>
            </div>
            <div className="flex justify-around text-[9px]">
              {[[org.sign1, org.title1], [org.sign2, org.title2]].filter(([n, t]) => n || t).map(([n, t]) => (
                <div key={t + n} className="min-w-[90px] border-t border-gray-500 pt-1">
                  <p className="font-semibold">{n}</p>
                  <p className="text-gray-500">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
