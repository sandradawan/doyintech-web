"use client";

import { useEffect, useRef, useState } from "react";
import { SECONDS_PER_QUESTION, type Asked } from "@/lib/trivia/game";

/** One timed question. Calls onAnswer once with the chosen option (or -1 on time out) and the seconds left. */
export default function QuestionCard({
  q,
  label,
  onAnswer,
  onNext,
  nextLabel,
}: {
  q: Asked;
  label: string;
  onAnswer: (choice: number, secondsLeft: number) => void;
  onNext: () => void;
  nextLabel: string;
}) {
  const [left, setLeft] = useState(SECONDS_PER_QUESTION);
  const [choice, setChoice] = useState<number | null>(null);
  const leftRef = useRef(SECONDS_PER_QUESTION);
  const answered = useRef(false);

  const answer = (k: number) => {
    if (answered.current) return;
    answered.current = true;
    setChoice(k);
    onAnswer(k, leftRef.current);
  };

  useEffect(() => {
    const t = setInterval(() => {
      if (answered.current) return clearInterval(t);
      leftRef.current -= 1;
      setLeft(leftRef.current);
      if (leftRef.current <= 0) {
        clearInterval(t);
        answer(-1);
      }
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the parent remounts this card (key) for every question
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between text-[13px] text-brand-muted">
        <span>{label} · {q.cat}</span>
        <span className={`font-bold ${choice === null && left <= 5 ? "text-pink-300" : "text-sky-300"}`}>⏱ {Math.max(left, 0)}s</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-sky-400 transition-all duration-1000 ease-linear" style={{ width: `${(Math.max(left, 0) / SECONDS_PER_QUESTION) * 100}%` }} />
      </div>
      <p className="mt-5 text-[21px] font-semibold leading-snug text-white sm:text-[24px]">{q.q}</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {q.shuffled.map((opt, k) => {
          const state = choice === null ? "" : k === q.correct ? "border-green-400 bg-green-400/15 text-white" : k === choice ? "border-pink-400 bg-pink-400/15 text-white" : "opacity-50";
          return (
            <button key={k} type="button" disabled={choice !== null} onClick={() => answer(k)} className={`min-h-14 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-[16px] text-[#e5e7eb] transition enabled:hover:border-[#ff8c14] ${state}`}>
              {opt}
            </button>
          );
        })}
      </div>
      {choice !== null && (
        <div className="mt-4 rounded-2xl bg-black/30 p-4" aria-live="polite">
          <p className={`text-[16px] font-bold ${choice === q.correct ? "text-green-400" : "text-pink-300"}`}>
            {choice === q.correct ? "Correct!" : choice === -1 ? `Time's up! It's ${q.shuffled[q.correct]}.` : `It's ${q.shuffled[q.correct]}.`}
          </p>
          <p className="mt-1 text-[15px] leading-relaxed text-brand-soft">{q.fact}</p>
          <button type="button" autoFocus onClick={onNext} className="mt-3 min-h-11 rounded-full bg-[#ff8c14] px-5 text-[15px] font-semibold text-black">{nextLabel}</button>
        </div>
      )}
    </div>
  );
}
