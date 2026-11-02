"use client";

import { useEffect, useRef, useState } from "react";
import StreakBar from "@/components/kids/StreakBar";
import { loadProgress, recordBest, type Progress } from "@/lib/kids/progress";

const SECONDS = 60;
type Q = { a: number; b: number };

const pick = (table: number | "mix"): Q => ({
  a: table === "mix" ? 2 + Math.floor(Math.random() * 11) : table,
  b: 1 + Math.floor(Math.random() * 12),
});

/** One-minute times tables race: answer as many as you can, beat your best. */
export default function TimesTables() {
  const [table, setTable] = useState<number | "mix">("mix");
  const [phase, setPhase] = useState<"pick" | "play" | "end">("pick");
  const [q, setQ] = useState<Q>({ a: 2, b: 2 });
  const [left, setLeft] = useState(SECONDS);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [miss, setMiss] = useState<string | null>(null);
  const [newBest, setNewBest] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const scoreRef = useRef(0);
  const leftRef = useRef(SECONDS);

  useEffect(() => {
    if (phase !== "play") return;
    const t = setInterval(() => {
      leftRef.current -= 1;
      setLeft(leftRef.current);
      if (leftRef.current > 0) return;
      clearInterval(t);
      const final = scoreRef.current;
      setNewBest(recordBest(`tables:${table}`, final, final >= 30 ? 3 : final >= 20 ? 2 : final >= 10 ? 1 : 0));
      setProgress(loadProgress());
      setPhase("end");
    }, 1000);
    return () => clearInterval(t);
  }, [phase, table]);

  const start = () => {
    scoreRef.current = 0;
    leftRef.current = SECONDS;
    setScore(0);
    setLeft(SECONDS);
    setGuess("");
    setMiss(null);
    setQ(pick(table));
    setPhase("play");
    setTimeout(() => input.current?.focus(), 0);
  };

  const submit = () => {
    if (!guess) return;
    if (Number(guess) === q.a * q.b) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setMiss(null);
    } else {
      setMiss(`${q.a} × ${q.b} = ${q.a * q.b}`);
    }
    setGuess("");
    setQ(pick(table));
  };

  const best = progress?.best[`tables:${table}`];
  const tables: (number | "mix")[] = ["mix", 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-b from-[#1b2340] to-[#141a28] p-5 sm:p-7">
      <StreakBar progress={progress} />

      {phase === "pick" && (
        <>
          <p className="text-[17px] font-semibold text-white">Pick a times table</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {tables.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={table === t}
                onClick={() => setTable(t)}
                className={`min-h-14 rounded-2xl text-[20px] font-bold transition ${table === t ? "bg-[#ff8c14] text-black" : "border border-white/15 bg-white/5 text-white hover:border-white/35"}`}
              >
                {t === "mix" ? "Mix" : `${t}×`}
              </button>
            ))}
          </div>
          <button type="button" onClick={start} className="min-h-14 w-full rounded-2xl bg-green-400 text-[20px] font-black text-black">Start · 60 seconds</button>
        </>
      )}

      {phase === "play" && (
        <div className="text-center">
          <div className="flex justify-between text-[16px] font-bold">
            <span className={left <= 10 ? "text-pink-300" : "text-sky-300"}>⏱ {left}s</span>
            <span className="text-green-300">✓ {score}</span>
          </div>
          <p className="mt-4 text-[56px] font-black text-white">{q.a} × {q.b}</p>
          <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mx-auto mt-3 flex max-w-xs gap-2">
            <input
              ref={input}
              aria-label="Your answer"
              inputMode="numeric"
              autoComplete="off"
              value={guess}
              onChange={(e) => setGuess(e.target.value.replace(/\D/g, ""))}
              className="min-h-14 w-full rounded-2xl border-2 border-white/20 bg-black/40 px-4 text-center text-[28px] font-bold text-white outline-none focus:border-[#ff8c14]"
            />
            <button type="submit" className="min-h-14 rounded-2xl bg-[#ff8c14] px-5 text-[16px] font-bold text-black">Go</button>
          </form>
          <p className="mt-3 min-h-6 text-[15px] text-pink-300" aria-live="polite">{miss && `Oops: ${miss}`}</p>
        </div>
      )}

      {phase === "end" && (
        <div className="text-center">
          <p className="text-[56px]" aria-hidden>{newBest ? "🏆" : "🎉"}</p>
          <p className="text-[28px] font-black text-white">{score} right in 60 seconds</p>
          <p className="mt-1 text-[16px] text-[#c7cdd8]">{newBest ? "That is a new best score!" : `Your best for ${table === "mix" ? "mixed tables" : `the ${table} times table`}: ${best ?? score}`}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={start} className="min-h-12 rounded-full bg-[#ff8c14] px-6 text-[15px] font-bold text-black">Play again</button>
            <button type="button" onClick={() => setPhase("pick")} className="min-h-12 rounded-full border border-white/15 px-6 text-[15px] font-semibold text-white">Change table</button>
          </div>
        </div>
      )}
    </div>
  );
}
