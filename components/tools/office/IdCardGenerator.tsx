"use client";

import { useState } from "react";
import { printHtml } from "@/components/tools/PaidGate";
import { Chips, Field, esc, ghostBtn, panel, primaryBtn, useSavedState } from "./kit";

type Person = { id: string; name: string; role: string; number: string; photo: string };
type Kind = "staff" | "student" | "member";

const KINDS = [
  { id: "staff", label: "Staff ID" },
  { id: "student", label: "Student ID" },
  { id: "member", label: "Member / visitor" },
] as const;

const blank = (): Person => ({ id: Math.random().toString(36).slice(2), name: "", role: "", number: "", photo: "" });
const MAX_PHOTO = 600_000;

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "ID";
}

/** ID cards at the standard CR80 size (85.6 × 54 mm), eight per A4 sheet for cutting or laminating. */
export default function IdCardGenerator() {
  const [org, setOrg] = useSavedState("doyintech_idcard_org_v1", { name: "", address: "", color: "#1d4ed8", expiry: "", blood: false });
  const [kind, setKind] = useState<Kind>("staff");
  const [people, setPeople] = useState<Person[]>([blank()]);
  const [err, setErr] = useState("");
  const setP = (id: string, k: keyof Person, v: string) => setPeople((l) => l.map((p) => (p.id === id ? { ...p, [k]: v } : p)));
  const roleLabel = kind === "student" ? "Class / department" : kind === "staff" ? "Job title" : "Category";
  const numLabel = kind === "student" ? "Matric / admission no." : kind === "staff" ? "Staff no." : "Member no.";

  function loadPhoto(id: string, file?: File) {
    setErr("");
    if (!file) return;
    if (file.size > MAX_PHOTO) {
      setErr("That photo is over 600 KB. Use a smaller or cropped photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setP(id, "photo", String(reader.result));
    reader.readAsDataURL(file);
  }

  function card(p: Person) {
    const c = esc(org.color);
    const photo = p.photo
      ? `<img src="${p.photo}" style="width:22mm;height:26mm;object-fit:cover;border-radius:2mm;border:0.6mm solid #fff"/>`
      : `<div style="width:22mm;height:26mm;border-radius:2mm;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-weight:700;color:#6b7280;font-size:16px">${esc(initials(p.name))}</div>`;
    return `<div style="width:85.6mm;height:54mm;box-sizing:border-box;border-radius:3mm;overflow:hidden;border:0.2mm solid #ccc;font-family:system-ui,sans-serif;display:inline-block;margin:2mm;vertical-align:top;background:#fff;position:relative">
      <div style="background:${c};color:#fff;padding:2.2mm 3mm;font-size:9.5px;font-weight:700;letter-spacing:.4px;text-transform:uppercase">${esc(org.name || "Organisation")}<div style="font-weight:400;font-size:7px;opacity:.9;text-transform:none">${esc(org.address)}</div></div>
      <div style="display:flex;gap:3mm;padding:2.5mm 3mm">
        ${photo}
        <div style="font-size:8px;color:#374151;line-height:1.5">
          <div style="font-size:11px;font-weight:700;color:#111">${esc(p.name || "Full name")}</div>
          <div>${esc(p.role)}</div>
          <div style="margin-top:1.5mm"><b>${esc(numLabel)}</b> ${esc(p.number)}</div>
          ${org.expiry ? `<div><b>Valid until</b> ${esc(org.expiry)}</div>` : ""}
          ${org.blood ? `<div><b>Blood group</b> ______</div>` : ""}
        </div>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;background:${c};color:#fff;font-size:7px;text-align:center;padding:1mm;letter-spacing:2px;text-transform:uppercase">${esc(KINDS.find((k) => k.id === kind)!.label)}</div>
    </div>`;
  }

  function print() {
    printHtml(`${org.name} ID cards`, `<style>@page{size:A4;margin:10mm}</style><div>${people.map(card).join("")}</div>`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4">
        <div className={panel}>
          <Chips label="Card type" options={KINDS} value={kind} onChange={setKind} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="Organisation / school (saved)" value={org.name} onChange={(v) => setOrg({ ...org, name: v })} />
            <Field name="Address or tagline" value={org.address} onChange={(v) => setOrg({ ...org, address: v })} />
            <Field name="Valid until" value={org.expiry} onChange={(v) => setOrg({ ...org, expiry: v })} placeholder="Dec 2027" />
            <label className="block text-[12px] font-medium text-brand-muted">
              Colour
              <input type="color" value={org.color} onChange={(e) => setOrg({ ...org, color: e.target.value })} className="mt-1 h-11 w-full cursor-pointer rounded-xl border border-white/15 bg-black/40" />
            </label>
          </div>
          <label className="flex min-h-10 items-center gap-2 text-[13px] text-brand-soft">
            <input type="checkbox" className="h-4 w-4 accent-[#ff8c14]" checked={org.blood} onChange={(e) => setOrg({ ...org, blood: e.target.checked })} />
            Add a blood group line to fill by hand
          </label>
        </div>
        {people.map((p, i) => (
          <div key={p.id} className={panel}>
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold text-white">Card {i + 1}</p>
              {people.length > 1 && (
                <button type="button" className="min-h-10 px-2 text-[13px] text-[#ff8a8a] hover:underline" onClick={() => setPeople(people.filter((x) => x.id !== p.id))}>
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field name="Full name" value={p.name} onChange={(v) => setP(p.id, "name", v)} />
              <Field name={roleLabel} value={p.role} onChange={(v) => setP(p.id, "role", v)} />
              <Field name={numLabel} value={p.number} onChange={(v) => setP(p.id, "number", v)} />
              <label className="block text-[12px] font-medium text-brand-muted">
                Passport photo (optional)
                <input type="file" accept="image/*" onChange={(e) => loadPhoto(p.id, e.target.files?.[0])} className="mt-1 block w-full text-[13px] text-brand-soft file:mr-3 file:min-h-10 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:text-white" />
              </label>
            </div>
          </div>
        ))}
        {err && <p role="alert" className="text-[13px] text-[#ff8a8a]">{err}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="button" className={ghostBtn} onClick={() => setPeople([...people, blank()])}>+ Add person</button>
          <button type="button" className={primaryBtn} onClick={print}>Print {people.length} card{people.length > 1 ? "s" : ""}</button>
        </div>
        <p className="text-[12px] text-brand-muted">Photos stay in your browser. Print on card paper at 100% scale, cut, and laminate.</p>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start" aria-label="ID card preview">
        <div className="relative mx-auto aspect-[85.6/54] w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="px-4 py-2.5 text-white" style={{ background: org.color }}>
            <p className="text-[13px] font-bold uppercase tracking-wide">{org.name || "Organisation"}</p>
            <p className="text-[10px] opacity-90">{org.address}</p>
          </div>
          <div className="flex gap-4 p-4">
            {people[0]?.photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- local data URL preview
              <img src={people[0].photo} alt="" className="h-[96px] w-[80px] rounded-md object-cover" />
            ) : (
              <div className="flex h-[96px] w-[80px] items-center justify-center rounded-md bg-gray-200 text-[20px] font-bold text-gray-500">{initials(people[0]?.name || "")}</div>
            )}
            <div className="text-[12px] leading-relaxed text-gray-700">
              <p className="text-[16px] font-bold text-gray-900">{people[0]?.name || "Full name"}</p>
              <p>{people[0]?.role}</p>
              <p className="mt-1"><b>{numLabel}</b> {people[0]?.number}</p>
              {org.expiry && <p><b>Valid until</b> {org.expiry}</p>}
            </div>
          </div>
          <p className="absolute inset-x-0 bottom-0 py-1 text-center text-[10px] uppercase tracking-[0.2em] text-white" style={{ background: org.color }}>
            {KINDS.find((k) => k.id === kind)!.label}
          </p>
        </div>
      </div>
    </div>
  );
}
