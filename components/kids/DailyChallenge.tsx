"use client";

import { useEffect, useRef, useState } from "react";
import LevelPicker, { useLevel } from "@/components/kids/LevelPicker";
import StreakBar from "@/components/kids/StreakBar";
import { dailyMaths, dailyWords, dayKey } from "@/lib/kids/daily";
import { loadProgress, recordDaily, type Progress } from "@/lib/kids/progress";

type Task = "maths" | "words";
type Item = { prompt: string; clue?: string; answer: string };

const SITE = "https://www.doyintech.com/kids/daily-challenge";

/** Today's maths and word puzzles, the same for every child, with a streak for coming back daily. */
export default function DailyChallenge() {
  const [level, setLevel] = useLevel();
  const [day, setDay] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<null | { right: boolean; answer: string }>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the child's local date and saved progress are only known in the browser
    setDay(dayKey());
    setProgress(loadProgress());
  }, []);

  const items: Item[] = !day || !task ? [] : task === "maths"
    ? dailyMaths(day, level).map((q) => ({ prompt: `${q.text} = ?`, answer: String(q.answer) }))
    : dailyWords(day, level).map((w) => ({ prompt: w.scrambled.toUpperCase(), clue: w.clue, answer: w.word }));
  const id = task ? `${task}:${level}` : "";
  const done = task !== null && i >= items.length;

  const start = (t: Task) => {
    setTask(t);
    setI(0);
    setScore(0);
    setGuess("");
    setFeedback(null);
  };

  const check = () => {
    if (!guess.trim() || feedback) return;
    const right = guess.trim().toLowerCase() === items[i].answer;
    setFeedback({ right, answer: items[i].answer });
    const nextScore = score + (right ? 1 : 0);
    setScore(nextScore);
    if (i === items.length - 1) setProgress(recordDaily(id, nextScore, Math.round((nextScore / items.length) * 3)));
  };

  const next = () => {
    setI(i + 1);
    setGuess("");
    setFeedback(null);
    setTimeout(() => input.current?.focus(), 0);
  };

  if (!day) return <div className="h-80 animate-pulse rounded-3xl bg-white/5" />;

  const share = `I scored ${score}/${items.length} on today's DoyinTech Kids ${task === "maths" ? "maths" : "word"} challenge! Can you beat me? ${SITE}`;
  const played = progress?.today.scores ?? {};

  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-b from-brand-raised to-brand-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StreakBar progress={progress} />
        <span className="text-[13px] text-brand-muted">Puzzles for {new Date(day + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</span>
      </div>

      {!task && (
        <>
          <LevelPicker value={level} onChange={setLevel} />
          <div className="grid gap-3 sm:grid-cols-2">
            {([["maths", "🧮", "Maths challenge", "10 sums"], ["words", "🔤", "Word scramble", "5 mixed-up words"]] as const).map(([t, icon, name, desc]) => {
              const best = played[`${t}:${level}`];
              return (
                <button key={t} type="button" onClick={() => start(t)} className="flex min-h-24 items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-[#ff8c14]">
                  <span className="text-[40px]" aria-hidden>{icon}</span>
                  <span>
                    <span className="block text-[18px] font-bold text-white">{name}</span>
                    <span className="block text-[14px] text-brand-muted">{best !== undefined ? `Done today: ${best} right ✓ Play again` : desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {task && !done && (
        <div className="text-center">
          <p className="text-[14px] text-brand-muted">Question {i + 1} of {items.length} · Score {score}</p>
          <div className="mx-auto mt-2 h-2 max-w-sm overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[#ff8c14] transition-all" style={{ width: `${(i / items.length) * 100}%` }} /></div>
          {items[i].clue && <p className="mt-5 text-[15px] text-sky-300">Clue: {items[i].clue}</p>}
          <p className="mt-3 text-[44px] font-black tracking-wider text-white sm:text-[56px]">{items[i].prompt}</p>
          <form onSubmit={(e) => { e.preventDefault(); if (feedback) next(); else check(); }} className="mx-auto mt-4 flex max-w-sm gap-2">
            <input
              ref={input}
              autoFocus
              aria-label="Your answer"
              inputMode={task === "maths" ? "numeric" : "text"}
              autoComplete="off"
              autoCapitalize="off"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={!!feedback}
              className="min-h-14 w-full rounded-2xl border-2 border-white/20 bg-black/40 px-4 text-center text-[24px] font-bold text-white outline-none focus:border-[#ff8c14]"
            />
            <button type="submit" className="min-h-14 shrink-0 rounded-2xl bg-[#ff8c14] px-5 text-[16px] font-bold text-black">{feedback ? "Next" : "Check"}</button>
          </form>
          {feedback && (
            <p className={`mt-4 text-[18px] font-bold ${feedback.right ? "text-green-400" : "text-pink-300"}`}>
              {feedback.right ? "Brilliant! ✓" : `Nice try! The answer is ${feedback.answer}.`}
            </p>
          )}
        </div>
      )}

      {done && (
        <div className="text-center">
          <p className="text-[56px]" aria-hidden>{score === items.length ? "🏆" : score >= items.length / 2 ? "🎉" : "💪"}</p>
          <p className="text-[28px] font-black text-white">{score} out of {items.length}</p>
          <p className="mt-1 text-[22px]" aria-label={`${Math.round((score / items.length) * 3)} stars`}>{"⭐".repeat(Math.round((score / items.length) * 3)) || "Keep practising!"}</p>
          <p className="mt-3 text-[15px] text-brand-soft">New puzzles every day. Come back tomorrow to keep your streak going!</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => start(task === "maths" ? "words" : "maths")} className="min-h-12 rounded-full bg-[#ff8c14] px-5 text-[15px] font-bold text-black">
              Try the {task === "maths" ? "word scramble" : "maths challenge"}
            </button>
            <a href={`https://wa.me/?text=${encodeURIComponent(share)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full border border-green-400/40 px-5 text-[15px] font-semibold text-green-300">
              Challenge a friend
            </a>
            <button type="button" onClick={() => setTask(null)} className="min-h-12 rounded-full border border-white/15 px-5 text-[15px] font-semibold text-white">Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
