"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QuestionCard from "@/components/trivia/QuestionCard";
import { dayKey } from "@/lib/kids/daily";
import { dailyRound, finishDaily, loadTrivia, points, triviaStreak, type TriviaProgress } from "@/lib/trivia/game";

const SITE = "https://www.doyintech.com/trivia";

/** Ten timed questions a day, easy to hard, with points for speed and a streak. */
export default function DailyTrivia() {
  const [day, setDay] = useState<string | null>(null);
  const [progress, setProgress] = useState<TriviaProgress | null>(null);
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [results, setResults] = useState<{ right: boolean; pts: number }[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the visitor's local date and saved progress are only known in the browser
    setDay(dayKey());
    setProgress(loadTrivia());
  }, []);

  if (!day || !progress) return <div className="h-80 animate-pulse rounded-3xl bg-white/5" />;

  const qs = dailyRound(day);
  const streak = triviaStreak(progress);
  const earlier = progress.today && results.length === 0 ? progress.today : null;
  const finished = earlier !== null || i >= qs.length;
  const score = earlier ? earlier.score : results.reduce((a, r) => a + r.pts, 0);
  const right = earlier ? earlier.right : results.filter((r) => r.right).length;

  const onAnswer = (choice: number, left: number) => {
    const ok = choice === qs[i].correct;
    const next = [...results, { right: ok, pts: points(ok, left) }];
    setResults(next);
    if (next.length === qs.length) setProgress(finishDaily(next.reduce((a, r) => a + r.pts, 0), next.filter((r) => r.right).length));
  };

  const share = `I scored ${score} points (${right}/10) in today's DoyinTech Trivia 🧠${streak > 1 ? ` 🔥${streak}-day streak` : ""}. Beat me: ${SITE}`;

  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-b from-brand-raised to-brand-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[14px] font-semibold">
        <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#ff8c14]/15 px-3 text-[#ffb366]"><span aria-hidden>🔥</span> {streak} day{streak === 1 ? "" : "s"} streak</span>
        {!finished && started && <span className="text-yellow-200">⭐ {score} pts</span>}
        {progress.best > 0 && <span className="text-[13px] font-normal text-brand-muted">Best: {progress.best} pts</span>}
      </div>

      {!started && !finished && (
        <div className="py-4 text-center">
          <p className="text-[48px]" aria-hidden>🧠</p>
          <p className="text-[24px] font-black text-white">Today&apos;s 10 questions</p>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-brand-soft">Easy to hard, 20 seconds each. 100 points for a right answer, plus up to 50 for speed. Everyone gets the same questions today.</p>
          <button type="button" onClick={() => setStarted(true)} className="mt-5 min-h-14 rounded-full bg-[#ff8c14] px-8 text-[18px] font-black text-black">Start</button>
        </div>
      )}

      {started && !finished && (
        <QuestionCard key={i} q={qs[i]} label={`Question ${i + 1} of ${qs.length}`} onAnswer={onAnswer} onNext={() => setI(i + 1)} nextLabel={i + 1 < qs.length ? "Next question" : "See my score"} />
      )}

      {finished && (
        <div className="text-center">
          <p className="text-[52px]" aria-hidden>{right >= 9 ? "🏆" : right >= 6 ? "🎉" : "💪"}</p>
          <p className="text-[32px] font-black text-white">{score} points</p>
          <p className="text-[16px] text-brand-soft">{right} out of 10 right{score >= progress.best && score > 0 ? " · your best yet!" : ""}</p>
          <p className="mt-2 text-[14px] text-brand-muted">New questions at midnight. Keep your streak going!</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <a href={`https://wa.me/?text=${encodeURIComponent(share)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full bg-green-500 px-5 text-[15px] font-semibold text-black">Challenge friends on WhatsApp</a>
            <Link href="/trivia/family-quiz-night" className="inline-flex min-h-12 items-center rounded-full border border-white/15 px-5 text-[15px] font-semibold text-white">Play family quiz night</Link>
          </div>
        </div>
      )}
    </div>
  );
}
