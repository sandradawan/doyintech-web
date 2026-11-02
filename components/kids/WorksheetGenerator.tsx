"use client";

import { useState } from "react";
import Link from "next/link";
import { DIFFICULTY, TOPICS, newCode, worksheet, type Difficulty, type Topic } from "@/lib/kids/worksheets";

const field = "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]";
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Free printable maths worksheets with an answer key; a sheet code reprints the same sheet. */
export default function WorksheetGenerator() {
  const [topic, setTopic] = useState<Topic>("addition");
  const [level, setLevel] = useState<Difficulty>(1);
  const [code, setCode] = useState("START");
  const [name, setName] = useState("");
  const sums = worksheet(code, topic, level);
  const title = `${TOPICS[topic]} · ${DIFFICULTY[level].split(" (")[0]}`;

  const print = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const cells = (withAnswers: boolean) =>
      sums.map((s, i) => `<div class="q"><b>${i + 1}.</b> ${esc(s.text)} = <span class="${withAnswers ? "a" : "line"}">${withAnswers ? s.answer : ""}</span></div>`).join("");
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)} worksheet</title><style>
      body{font-family:Arial,sans-serif;margin:32px;color:#111}h1{font-size:22px;margin:0}.meta{display:flex;justify-content:space-between;margin:12px 0 20px;font-size:14px}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 24px;font-size:20px}.line{display:inline-block;min-width:70px;border-bottom:1px solid #333}
      .a{color:#0a7a2f;font-weight:bold}.foot{margin-top:28px;font-size:11px;color:#666}.page{page-break-after:always}
    </style></head><body>
      <div class="page"><h1>${esc(title)}</h1><div class="meta"><span>Name: ${esc(name) || "______________________"}</span><span>Date: ____________</span><span>Score: ____ / ${sums.length}</span></div>
      <div class="grid">${cells(false)}</div><p class="foot">Free worksheet from doyintech.com/kids · Sheet code ${esc(code)}</p></div>
      <div><h1>Answers · ${esc(title)}</h1><div class="meta"><span>Sheet code ${esc(code)}</span></div><div class="grid">${cells(true)}</div></div>
      <script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-[12px] font-medium text-[#a1a1a6]">Topic
          <select value={topic} onChange={(e) => setTopic(e.target.value as Topic)} className={field}>
            {Object.entries(TOPICS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="block text-[12px] font-medium text-[#a1a1a6]">Difficulty
          <select value={level} onChange={(e) => setLevel(Number(e.target.value) as Difficulty)} className={field}>
            {Object.entries(DIFFICULTY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="block text-[12px] font-medium text-[#a1a1a6]">Child&apos;s name (optional, stays on this device)
          <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} className={field} />
        </label>
        <label className="block text-[12px] font-medium text-[#a1a1a6]">Sheet code
          <input value={code} maxLength={8} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} className={field} />
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
          <button type="button" onClick={print} className="min-h-11 rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">Print worksheet + answers</button>
          <button type="button" onClick={() => setCode(newCode())} className="min-h-11 rounded-full border border-white/15 px-5 text-[14px] font-semibold text-white">New questions</button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 text-[#111] shadow-xl">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-black/10 pb-3">
          <p className="text-[18px] font-bold">{title}</p>
          <p className="text-[13px] text-black/60">Name: {name || "________________"} · Score: ___ / {sums.length}</p>
        </div>
        <ol className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[17px] sm:grid-cols-3">
          {sums.map((s, i) => (
            <li key={i}><b>{i + 1}.</b> {s.text} = <span className="inline-block w-14 border-b border-black/50" /></li>
          ))}
        </ol>
        <p className="mt-5 text-[12px] text-black/50">Preview · the printout adds an answer key on page 2</p>
      </div>

      <div className="rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-5">
        <p className="text-[16px] font-semibold text-white">Want a whole term&apos;s practice ready to print?</p>
        <p className="mt-1 text-[14px] text-[#c7cdd8]">The Primary Maths Practice Workbook has 40 graded worksheets with answers, from counting to fractions and word problems.</p>
        <Link href="/products/primary-maths-practice-workbook" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">See the workbook</Link>
      </div>
    </div>
  );
}
