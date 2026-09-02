"use client";

import { useMemo, useState } from "react";
import {
  AUDIT_QUESTIONS,
  runBusinessAudit,
  type AuditAnswer,
} from "@/lib/tools/audit";
import { trackToolEvent } from "@/lib/tools/analytics";
import ScoreRing from "./ScoreRing";
import LeadForm from "./LeadForm";
import ShareActions from "./ShareActions";

const PAGE_SIZE = 5;

export default function BusinessAudit() {
  const [meta, setMeta] = useState({ name: "", industry: "", url: "" });
  const [answers, setAnswers] = useState<Record<string, AuditAnswer>>({});
  const [page, setPage] = useState(0);
  const [done, setDone] = useState(false);

  const pages = Math.ceil(AUDIT_QUESTIONS.length / PAGE_SIZE);
  const slice = AUDIT_QUESTIONS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const result = useMemo(() => runBusinessAudit(answers), [answers]);

  function setAns(id: string, a: AuditAnswer) {
    setAnswers((prev) => ({ ...prev, [id]: a }));
  }

  function finish() {
    trackToolEvent("audit_completed", { score: result.score });
    setDone(true);
  }

  if (done) {
    const shareText = `I scored ${result.score}/100 (${result.label}) on the DoyinTech Business Audit. Check yours: https://doyintech.vercel.app/tools/business-audit`;
    return (
      <div className="space-y-6 rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <ScoreRing score={result.score} label="/ 100" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              How strong is your business online?
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              {result.label}
            </h2>
            {meta.name && (
              <p className="mt-2 text-sm text-gray-400">
                {meta.name}
                {meta.industry ? ` · ${meta.industry}` : ""}
              </p>
            )}
            <p className="mt-3 text-sm text-gray-400">
              Scores are based on your answers only — this tool does not crawl or
              verify your website automatically.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ListCard title="Strengths" items={result.strengths} tone="good" />
          <ListCard title="Weaknesses" items={result.weaknesses} tone="bad" />
          <ListCard title="Opportunities" items={result.opportunities} />
          <ListCard title="Priority recommendations" items={result.recommendations} />
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm font-semibold text-white">Suggested DoyinTech services</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.suggestedServices.map((s) => (
              <span
                key={s}
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <ShareActions
          tool="business-audit"
          shareText={shareText}
          onRestart={() => {
            setDone(false);
            setPage(0);
          }}
        />

        <LeadForm
          tool="Business Audit"
          resultSummary={`${result.score}/100 — ${result.label}`}
          defaultMessage={`Hi DoyinTech, I completed the Business Audit. Score: ${result.score}/100 (${result.label}). I want to improve my business online.`}
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8">
      {page === 0 && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <input
            value={meta.name}
            onChange={(e) => setMeta({ ...meta, name: e.target.value })}
            placeholder="Business name"
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50"
          />
          <input
            value={meta.industry}
            onChange={(e) => setMeta({ ...meta, industry: e.target.value })}
            placeholder="Industry"
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50"
          />
          <input
            value={meta.url}
            onChange={(e) => setMeta({ ...meta, url: e.target.value })}
            placeholder="Website URL (optional)"
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50"
          />
        </div>
      )}

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
              {(["yes", "partial", "no", "unsure"] as AuditAnswer[]).map((a) => (
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
            See my score
          </button>
        )}
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone?: "good" | "bad";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">None highlighted</p>
      ) : (
        <ul className="mt-2 space-y-1.5 text-sm text-gray-300">
          {items.map((i) => (
            <li key={i} className="flex gap-2">
              <span
                className={
                  tone === "good"
                    ? "text-green-400"
                    : tone === "bad"
                      ? "text-amber-400"
                      : "text-primary"
                }
              >
                •
              </span>
              <span>{i}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
