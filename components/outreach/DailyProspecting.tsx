"use client";

import { useMemo, useState } from "react";
import { OUTREACH_TEMPLATES } from "@/lib/outreach-templates";

const STEPS = [
  "Open Google Maps / Instagram / your contacts — list 20 local businesses without a clear website or WhatsApp booking.",
  "For each: note Name, Business, one weakness (no site / outdated / no WhatsApp button).",
  "Pick a DM script below → replace [brackets] → send on WhatsApp.",
  "Log replies in a note: Interested / Later / No. Follow up in 3 days on Later.",
  "Goal: 20 sends/day → 2–4 real conversations → 1 deposit/week is a strong start.",
];

const CHECKLIST_SEED = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  done: false,
}));

export default function DailyProspecting() {
  const [checks, setChecks] = useState(CHECKLIST_SEED);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const dmTemplates = useMemo(
    () =>
      OUTREACH_TEMPLATES.filter(
        (t) => t.channel.includes("DM") || t.channel.includes("WhatsApp DM")
      ),
    []
  );
  const statusTemplates = useMemo(
    () => OUTREACH_TEMPLATES.filter((t) => t.channel.includes("Status")),
    []
  );

  const doneCount = checks.filter((c) => c.done).length;

  async function copy(id: string, body: string) {
    try {
      await navigator.clipboard.writeText(body);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto max-w-[800px] px-4">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
        Internal · sales engine
      </p>
      <h1 className="mt-2 text-[30px] font-semibold tracking-tight text-white sm:text-[36px]">
        Daily prospecting — 20 messages
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#a1a1a6]">
        Revenue comes from conversations. Use this page every workday. Scripts are ready —
        personalize the brackets, then send.
      </p>

      <div className="mt-8 rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[15px] font-semibold text-white">Today’s progress</p>
          <p className="text-[20px] font-bold text-[#ff8c14]">{doneCount}/20</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/40">
          <div
            className="h-full rounded-full bg-[#ff8c14] transition-all"
            style={{ width: `${(doneCount / 20) * 100}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {checks.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() =>
                setChecks((prev) =>
                  prev.map((x) => (x.id === c.id ? { ...x, done: !x.done } : x))
                )
              }
              className={`rounded-lg py-2 text-[12px] font-semibold ${
                c.done
                  ? "bg-[#ff8c14] text-black"
                  : "bg-black/40 text-[#a1a1a6] hover:bg-white/10"
              }`}
            >
              {c.id}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setChecks(CHECKLIST_SEED)}
          className="mt-3 text-[12px] text-[#86868b] hover:text-white"
        >
          Reset day
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-[18px] font-semibold text-white">How to run the day</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[14px] text-[#c7cdd8]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      <div className="mt-10">
        <h2 className="text-[18px] font-semibold text-white">WhatsApp DM scripts</h2>
        <p className="mt-1 text-[13px] text-[#a1a1a6]">
          Replace [Name], [Business], [source], [issues]. Keep it short.
        </p>
        <div className="mt-4 space-y-4">
          {dmTemplates.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-white/10 bg-[#141a28] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[14px] font-semibold text-white">{t.title}</p>
                  <p className="text-[11px] text-[#86868b]">{t.channel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copy(t.id, t.body)}
                  className="rounded-full bg-[#25D366] px-4 py-2 text-[12px] font-semibold text-white"
                >
                  {copiedId === t.id ? "Copied ✓" : "Copy script"}
                </button>
              </div>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-[#e8eaed]">
                {t.body}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-[18px] font-semibold text-white">Status captions (distribution)</h2>
        <div className="mt-4 space-y-4">
          {statusTemplates.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[14px] font-semibold text-white">{t.title}</p>
                <button
                  type="button"
                  onClick={() => copy(t.id, t.body)}
                  className="rounded-full bg-[#ff8c14] px-4 py-2 text-[12px] font-semibold text-black"
                >
                  {copiedId === t.id ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-[#e8eaed]">
                {t.body}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-[#141a28] p-5 text-[14px] text-[#a1a1a6]">
        <p className="font-semibold text-white">Links to paste</p>
        <ul className="mt-2 space-y-1">
          <li>
            Hire:{" "}
            <a className="text-[#2997ff]" href="https://doyintech.vercel.app/hire">
              /hire
            </a>
          </li>
          <li>
            Free audit:{" "}
            <a className="text-[#2997ff]" href="https://doyintech.vercel.app/free-audit">
              /free-audit
            </a>
          </li>
          <li>
            Store:{" "}
            <a className="text-[#2997ff]" href="https://doyintech.vercel.app/store">
              /store
            </a>
          </li>
          <li>
            Full console:{" "}
            <a className="text-[#2997ff]" href="/outreach">
              /outreach
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
