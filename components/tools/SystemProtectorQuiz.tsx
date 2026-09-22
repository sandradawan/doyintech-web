"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Q = {
  id: string;
  text: string;
  weight: number;
};

const QUESTIONS: Q[] = [
  { id: "lock", text: "Phone has PIN / biometric lock (not swipe-only)", weight: 12 },
  { id: "wa2fa", text: "WhatsApp two-step verification is ON", weight: 14 },
  { id: "wabackup", text: "WhatsApp backs up at least weekly", weight: 10 },
  { id: "unknown", text: "I avoid installing random APKs / WhatsApp Plus mods", weight: 12 },
  { id: "defender", text: "On PC: Windows Security / Defender is ON", weight: 12 },
  { id: "updates", text: "Phone + PC get security updates regularly", weight: 10 },
  { id: "2fa", text: "Email / bank apps use 2FA where available", weight: 12 },
  { id: "code", text: "I never share WhatsApp SMS codes with anyone", weight: 14 },
  { id: "backup", text: "Business files (invoices, photos) have a backup", weight: 8 },
  { id: "staff", text: "Staff know not to pay new-account Status scams", weight: 6 },
];

function scoreLabel(score: number) {
  if (score >= 85) return { t: "Strong habits", c: "text-emerald-400" };
  if (score >= 60) return { t: "Okay — close the gaps", c: "text-[#ff8c14]" };
  if (score >= 35) return { t: "At risk", c: "text-amber-400" };
  return { t: "High risk", c: "text-red-400" };
}

export default function SystemProtectorQuiz() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);

  const score = useMemo(() => {
    let s = 0;
    for (const q of QUESTIONS) {
      if (answers[q.id]) s += q.weight;
    }
    return Math.min(100, s);
  }, [answers]);

  const label = scoreLabel(score);
  const gaps = QUESTIONS.filter((q) => !answers[q.id]);

  return (
    <div className="mx-auto max-w-[640px]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
        Free · System Protector
      </p>
      <h1 className="mt-2 text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
        Device & WhatsApp security score
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#a1a1a6]">
        Honest hygiene check — not a virus scan. Tick what is true for your phone and PC.
        Then get a score and next steps. Full playbooks are in the SME System Protector Kit.
      </p>

      <div className="mt-8 space-y-3">
        {QUESTIONS.map((q) => (
          <label
            key={q.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-[#141a28] p-4 hover:border-white/20"
          >
            <input
              type="checkbox"
              checked={!!answers[q.id]}
              onChange={(e) => {
                setAnswers((a) => ({ ...a, [q.id]: e.target.checked }));
                setDone(false);
              }}
              className="mt-1 h-4 w-4 rounded border-white/30"
            />
            <span className="text-[14px] text-[#e8eaed]">{q.text}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setDone(true)}
        className="mt-6 w-full rounded-full bg-[#ff8c14] py-3.5 text-[15px] font-semibold text-black"
      >
        Calculate score
      </button>

      {done && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0c1018] p-6">
          <p className="text-[13px] text-[#86868b]">Your protector score</p>
          <p className={`mt-1 text-[40px] font-bold ${label.c}`}>{score}/100</p>
          <p className={`text-[16px] font-semibold ${label.c}`}>{label.t}</p>

          {gaps.length > 0 && (
            <div className="mt-4">
              <p className="text-[13px] font-semibold text-white">Fix next</p>
              <ul className="mt-2 space-y-1 text-[13px] text-[#a1a1a6]">
                {gaps.slice(0, 5).map((g) => (
                  <li key={g.id}>· {g.text}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/products"
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black"
            >
              Get full Kit · ₦12,500
            </Link>
            <Link
              href="/tools"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              More security tools
            </Link>
            <Link
              href="/apps/doyinshield"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              DoyinShield app plan
            </Link>
          </div>
          <p className="mt-4 text-[12px] text-[#86868b]">
            Does not replace Windows Defender or Play Protect. Keep them on.
          </p>
        </div>
      )}
    </div>
  );
}
