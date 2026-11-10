"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dailyQuiz } from "@/lib/daily/quiz";
import { finishQuiz, loadQuiz, quizStreak, type QuizProgress } from "@/lib/daily/progress";
import { dayKey } from "@/lib/kids/daily";

const SITE = "https://www.doyintech.com/daily-quiz";

function untilMidnight() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const mins = Math.max(0, Math.round((end.getTime() - now.getTime()) / 60000));
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

/** Five questions a day, the same for everyone, with a streak and a score to share. */
export default function DailyQuiz() {
  const [day, setDay] = useState<string | null>(null);
  const [progress, setProgress] = useState<QuizProgress | null>(null);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the visitor's local date and saved progress are only known in the browser
    setDay(dayKey());
    setProgress(loadQuiz());
    setCountdown(untilMidnight());
    const t = setInterval(() => setCountdown(untilMidnight()), 30000);
    return () => clearInterval(t);
  }, []);

  if (!day || !progress) return <div className="h-96 animate-pulse rounded-3xl bg-brand-ink/5" />;

  const qs = dailyQuiz(day);
  // Played earlier today (not in this visit): go straight to the results.
  const doneEarlier = progress.today !== null && answers.length === 0;
  const given = doneEarlier ? progress.today!.answers : answers;
  const finished = doneEarlier || i >= qs.length;
  const score = qs.filter((q, k) => given[k] === q.correct).length;
  const streak = quizStreak(progress);
  const q = qs[i];
  const picked = answers[i];

  const choose = (k: number) => {
    if (picked !== undefined) return;
    const next = [...answers, k];
    setAnswers(next);
    if (next.length === qs.length) setProgress(finishQuiz(qs.filter((x, n) => next[n] === x.correct).length, next));
  };

  const share = `I got ${score}/5 on today's DoyinTech Daily Money Quiz 🔥${streak > 1 ? ` (${streak}-day streak)` : ""}. Can you beat me? ${SITE}`;

  return (
    <div className="space-y-5 rounded-3xl border border-brand-ink/10 bg-gradient-to-b from-brand-raised to-brand-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[14px] font-semibold">
        <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-brand-link/15 px-3 text-brand-link"><span aria-hidden>🔥</span> {streak} day{streak === 1 ? "" : "s"} streak</span>
        <span className="text-[13px] font-normal text-brand-muted">{new Date(day + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</span>
      </div>

      {!finished && (
        <div>
          <div className="flex items-center justify-between text-[13px] text-brand-muted">
            <span>Question {i + 1} of {qs.length} · {q.topic}</span>
            <span>{answers.filter((a, k) => a === qs[k].correct).length} right</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-ink/10"><div className="h-full bg-brand-accent transition-all" style={{ width: `${(answers.length / qs.length) * 100}%` }} /></div>
          <p className="mt-5 text-[21px] font-semibold leading-snug text-brand-ink sm:text-[24px]">{q.q}</p>
          <div className="mt-5 grid gap-2">
            {q.shuffled.map((opt, k) => {
              const state = picked === undefined ? "" : k === q.correct ? "border-green-400 bg-green-400/15 text-brand-ink" : k === picked ? "border-pink-400 bg-pink-400/15 text-brand-ink" : "opacity-50";
              return (
                <button key={k} type="button" onClick={() => choose(k)} disabled={picked !== undefined} className={`min-h-14 rounded-2xl border border-brand-ink/15 bg-brand-ink/5 px-4 py-3 text-left text-[16px] text-[#e5e7eb] transition enabled:hover:border-brand-link ${state}`}>
                  {opt}
                </button>
              );
            })}
          </div>
          {picked !== undefined && (
            <div className="mt-4 rounded-2xl bg-brand-well p-4" aria-live="polite">
              <p className={`text-[16px] font-bold ${picked === q.correct ? "text-green-400" : "text-pink-300"}`}>{picked === q.correct ? "Correct!" : "Not quite."}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-brand-soft">{q.explain}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setI(i + 1)} className="min-h-11 rounded-full bg-brand-accent px-5 text-[15px] font-semibold text-black">{i + 1 < qs.length ? "Next question" : "See my score"}</button>
                {q.tool && <Link href={q.tool.href} className="inline-flex min-h-11 items-center rounded-full border border-brand-ink/15 px-5 text-[14px] font-semibold text-brand-ink">{q.tool.label} →</Link>}
              </div>
            </div>
          )}
        </div>
      )}

      {finished && (
        <div>
          <div className="text-center">
            <p className="text-[52px]" aria-hidden>{score === 5 ? "🏆" : score >= 3 ? "🎉" : "💡"}</p>
            <p className="text-[30px] font-black text-brand-ink">{score} / 5 today</p>
            <p className="mt-1 text-[15px] text-brand-soft">New questions in {countdown}. Come back tomorrow to keep your streak!</p>
            {progress.played > 1 && <p className="mt-1 text-[13px] text-brand-muted">All time: {progress.correct} right from {progress.played * 5} questions · best streak {progress.streak?.best ?? 1}</p>}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <a href={`https://wa.me/?text=${encodeURIComponent(share)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-green-500 px-5 text-[15px] font-semibold text-black">Share on WhatsApp</a>
              <Link href="/kids/daily-challenge" className="inline-flex min-h-11 items-center rounded-full border border-brand-ink/15 px-5 text-[15px] font-semibold text-brand-ink">Kids&apos; daily challenge</Link>
            </div>
          </div>
          <ol className="mt-6 space-y-2">
            {qs.map((x, k) => (
              <li key={k} className="rounded-2xl bg-brand-well p-3 text-[14px]">
                <p className="text-brand-ink"><span aria-hidden>{given[k] === x.correct ? "✅" : "❌"}</span> {x.q}</p>
                <p className="mt-1 text-brand-muted">Answer: <span className="text-green-300">{x.shuffled[x.correct]}</span></p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
