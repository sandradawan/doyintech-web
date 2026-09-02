"use client";

import { useMemo, useState } from "react";
import {
  READINESS_QUESTIONS,
  runReadinessAssessment,
  type ReadinessAnswer,
} from "@/lib/tools/readiness";
import { trackToolEvent } from "@/lib/tools/analytics";
import ScoreRing from "./ScoreRing";
import LeadForm from "./LeadForm";
import ShareActions from "./ShareActions";

const PAGE_SIZE = 6;

export default function DigitalReadiness() {
  const [answers, setAnswers] = useState<Record<string, ReadinessAnswer>>({});
  const [page, setPage] = useState(0);
  const [done, setDone] = useState(false);

  const pages = Math.ceil(READINESS_QUESTIONS.length / PAGE_SIZE);
  const slice = READINESS_QUESTIONS.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );
  const result = useMemo(() => runReadinessAssessment(answers), [answers]);

  function setAns(id: string, a: ReadinessAnswer) {
    setAnswers((prev) => ({ ...prev, [id]: a }));
  }

  function finish() {
    trackToolEvent("readiness_test_completed", { score: result.score });
    setDone(true);
  }

  if (done) {
    const shareText = `I scored ${result.score}/100 (${result.level}) on the DoyinTech Digital Readiness Checker. Try it: https://doyintech.vercel.app/tools/digital-readiness`;
    return (
      <div className="space-y-6 rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <ScoreRing score={result.score} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Digital maturity
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              {result.level}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Based on your self-assessment across presence, experience, payments,
              marketing, operations, and security.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {result.categoryScores.map((c) => (
            <div
              key={c.category}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-3"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{c.category}</span>
                <span className="font-semibold text-white">{c.score}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${c.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Block title="Strengths" items={result.strengths} />
          <Block title="Weaknesses" items={result.weaknesses} />
          <Block title="Quick wins" items={result.quickWins} />
          <Block title="Medium-term improvements" items={result.mediumTerm} />
        </div>

        <Block title="Long-term recommendations" items={result.longTerm} />

        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm font-semibold text-white">Recommended DoyinTech services</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.services.map((s) => (
              <span
                key={s}
                className="rounded-full border border-primary/30 px-3 py-1 text-xs text-primary"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <ShareActions
          tool="digital-readiness"
          shareText={shareText}
          onRestart={() => {
            setDone(false);
            setPage(0);
          }}
        />

        <LeadForm
          tool="Digital Readiness Checker"
          resultSummary={`${result.score}/100 — ${result.level}`}
          defaultMessage={`Hi DoyinTech, my Digital Readiness score is ${result.score}/100 (${result.level}). I want help improving.`}
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8">
      <p className="text-xs text-gray-500">
        Step {page + 1} of {pages}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((page + 1) / pages) * 100}%` }}
        />
      </div>

      <div className="mt-6 space-y-5">
        {slice.map((q) => (
          <div key={q.id}>
            <p className="text-sm font-medium text-white">{q.label}</p>
            <p className="text-[11px] text-gray-500">{q.category}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["yes", "partial", "no"] as ReadinessAnswer[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAns(q.id, a)}
                  className={`rounded-full border px-3 py-1.5 text-xs capitalize ${
                    answers[q.id] === a
                      ? "border-primary bg-primary/20 text-white"
                      : "border-white/10 text-gray-400"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-300 disabled:opacity-40"
        >
          Back
        </button>
        {page < pages - 1 ? (
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
          >
            See results
          </button>
        )}
      </div>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">—</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm text-gray-300">
          {items.map((i) => (
            <li key={i}>• {i}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
