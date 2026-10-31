"use client";

import { useState } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { Area, Field, Chips, esc, ghostBtn, longDate, panel, primaryBtn, todayISO, useSavedState } from "./kit";

type Item = { id: string; title: string; discussion: string; resolution: string; owner: string; due: string };
type Style = "formal" | "simple";

const newItem = (title = ""): Item => ({ id: Math.random().toString(36).slice(2), title, discussion: "", resolution: "", owner: "", due: "" });

const STYLES = [
  { id: "formal", label: "Formal (board, AGM, committee)" },
  { id: "simple", label: "Simple (team meeting)" },
] as const;

/** Meeting minutes with attendance, agenda items, resolutions and an action-item table. */
export default function MinutesGenerator() {
  const [org, setOrg] = useSavedState("doyintech_minutes_org_v1", { name: "", secretary: "" });
  const [style, setStyle] = useState<Style>("formal");
  const [m, setM] = useState({ title: "Monthly management meeting", date: todayISO(), time: "10:00", venue: "", chair: "", present: "", apologies: "", start: "10:05", end: "11:30", next: "" });
  const [items, setItems] = useState<Item[]>([newItem("Reading and adoption of previous minutes"), newItem("Matters arising"), newItem("")]);
  const set = (k: keyof typeof m) => (v: string) => setM((p) => ({ ...p, [k]: v }));
  const setItem = (id: string, k: keyof Item, v: string) => setItems((list) => list.map((i) => (i.id === id ? { ...i, [k]: v } : i)));

  const actions = items.filter((i) => i.owner.trim());
  const names = (s: string) => s.split(/\n|,/).map((x) => x.trim()).filter(Boolean);

  function print() {
    const formal = style === "formal";
    const html = `<div style="max-width:720px;margin:36px auto;font-family:Georgia,'Times New Roman',serif;font-size:14.5px;line-height:1.6;color:#111">
      <div style="text-align:center">
        <div style="font-size:19px;font-weight:bold;text-transform:uppercase">${esc(org.name || "Organisation name")}</div>
        <div style="font-weight:bold;margin-top:6px">${formal ? "MINUTES OF THE " : ""}${esc(m.title.toUpperCase())}</div>
        <div>held ${m.venue ? "at " + esc(m.venue) + " " : ""}on ${esc(longDate(m.date))}${m.time ? " at " + esc(m.time) : ""}</div>
      </div>
      <p style="margin-top:20px"><b>Present:</b> ${names(m.present).map(esc).join(", ") || "—"}</p>
      ${m.apologies.trim() ? `<p><b>Absent with apologies:</b> ${names(m.apologies).map(esc).join(", ")}</p>` : ""}
      ${m.chair ? `<p><b>In the chair:</b> ${esc(m.chair)}</p>` : ""}
      ${formal && m.start ? `<p><b>Opening:</b> The meeting was called to order at ${esc(m.start)}${m.chair ? " by the chair, " + esc(m.chair) : ""}.</p>` : ""}
      ${items
        .filter((i) => i.title.trim())
        .map(
          (i, n) => `<div style="margin-top:16px"><b>${n + 1}. ${esc(i.title)}</b>
          ${i.discussion ? `<p style="margin:4px 0">${esc(i.discussion).replace(/\n/g, "<br/>")}</p>` : ""}
          ${i.resolution ? `<p style="margin:4px 0"><b>${formal ? "Resolved" : "Decision"}:</b> ${esc(i.resolution)}</p>` : ""}
          ${i.owner ? `<p style="margin:4px 0"><i>Action: ${esc(i.owner)}${i.due ? " by " + esc(longDate(i.due)) : ""}</i></p>` : ""}</div>`,
        )
        .join("")}
      ${actions.length ? `<div style="margin-top:22px"><b>Action items</b><table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:13px">
        <tr><th style="border:1px solid #999;padding:6px;text-align:left">Action</th><th style="border:1px solid #999;padding:6px;text-align:left">Responsible</th><th style="border:1px solid #999;padding:6px;text-align:left">Due</th></tr>
        ${actions.map((a) => `<tr><td style="border:1px solid #999;padding:6px">${esc(a.resolution || a.title)}</td><td style="border:1px solid #999;padding:6px">${esc(a.owner)}</td><td style="border:1px solid #999;padding:6px">${esc(longDate(a.due))}</td></tr>`).join("")}
      </table></div>` : ""}
      ${m.next ? `<p style="margin-top:18px"><b>Next meeting:</b> ${esc(longDate(m.next))}</p>` : ""}
      ${m.end ? `<p><b>Adjournment:</b> There being no other business, the meeting was adjourned at ${esc(m.end)}.</p>` : ""}
      <table style="width:100%;margin-top:56px"><tr>
        <td>____________________<br/>${esc(m.chair || "Chairperson")}<br/>Chairperson</td>
        <td style="text-align:right">____________________<br/>${esc(org.secretary || "Secretary")}<br/>Secretary</td>
      </tr></table>
    </div>`;
    printHtml(`Minutes ${m.title}`, html);
  }

  return (
    <div className="space-y-6">
      <div className={panel}>
        <Chips label="Minutes style" options={STYLES} value={style} onChange={setStyle} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field name="Organisation (saved)" value={org.name} onChange={(v) => setOrg({ ...org, name: v })} />
          <Field name="Secretary (saved)" value={org.secretary} onChange={(v) => setOrg({ ...org, secretary: v })} />
          <Field name="Meeting title" value={m.title} onChange={set("title")} />
          <Field name="Date" type="date" value={m.date} onChange={set("date")} />
          <Field name="Time" type="time" value={m.time} onChange={set("time")} />
          <Field name="Venue" value={m.venue} onChange={set("venue")} placeholder="Board room / Google Meet" />
          <Field name="Chairperson" value={m.chair} onChange={set("chair")} />
          <Field name="Called to order at" type="time" value={m.start} onChange={set("start")} />
          <Field name="Adjourned at" type="time" value={m.end} onChange={set("end")} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Area name="Present (one per line or comma separated)" value={m.present} onChange={set("present")} placeholder={"Mrs. Ada Okafor — MD\nMr. Musa Bello — Finance"} />
          <Area name="Absent with apologies" value={m.apologies} onChange={set("apologies")} />
        </div>
      </div>

      <div className="space-y-4">
        {items.map((i, n) => (
          <div key={i.id} className={panel}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[14px] font-semibold text-white">Agenda item {n + 1}</p>
              {items.length > 1 && (
                <button type="button" onClick={() => setItems(items.filter((x) => x.id !== i.id))} className="min-h-10 px-2 text-[13px] text-[#ff8a8a] hover:underline" aria-label={`Remove agenda item ${n + 1}`}>
                  Remove
                </button>
              )}
            </div>
            <Field name="Title" value={i.title} onChange={(v) => setItem(i.id, "title", v)} placeholder="Q4 sales targets" />
            <Area name="Discussion" value={i.discussion} onChange={(v) => setItem(i.id, "discussion", v)} placeholder="Summarise what was said, not every word." />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field name="Resolution / decision" value={i.resolution} onChange={(v) => setItem(i.id, "resolution", v)} className="sm:col-span-3" />
              <Field name="Action owner" value={i.owner} onChange={(v) => setItem(i.id, "owner", v)} />
              <Field name="Due date" type="date" value={i.due} onChange={(v) => setItem(i.id, "due", v)} />
            </div>
          </div>
        ))}
        <div className="flex flex-wrap items-end gap-3">
          <button type="button" onClick={() => setItems([...items, newItem()])} className={ghostBtn}>
            + Add agenda item
          </button>
          <Field name="Next meeting" type="date" value={m.next} onChange={set("next")} />
          <button type="button" onClick={print} className={`${primaryBtn} ml-auto`}>
            Download minutes PDF
          </button>
        </div>
      </div>
    </div>
  );
}
