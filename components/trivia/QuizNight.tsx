"use client";

import { useState } from "react";
import Link from "next/link";
import QuestionCard from "@/components/trivia/QuestionCard";
import { CATEGORIES, type Category, type Difficulty } from "@/lib/trivia/bank";
import { partyQuestions, points, type Asked } from "@/lib/trivia/game";

const LEVELS: { d: Difficulty; label: string; desc: string }[] = [
  { d: 1, label: "Kids", desc: "Easy questions only" },
  { d: 2, label: "Family", desc: "Easy and medium" },
  { d: 3, label: "Experts", desc: "Everything, including hard" },
];
const COLORS = ["bg-[#ff8c14]", "bg-sky-400", "bg-green-400", "bg-pink-400", "bg-yellow-300", "bg-violet-400"];

type Phase = "setup" | "handoff" | "question" | "results";

/** Pass-the-phone quiz for 2–6 players or teams, taking turns on one device. */
export default function QuizNight() {
  const [names, setNames] = useState(["Team 1", "Team 2"]);
  const [cats, setCats] = useState<Category[]>([...CATEGORIES]);
  const [level, setLevel] = useState<Difficulty>(2);
  const [each, setEach] = useState(5);
  const [phase, setPhase] = useState<Phase>("setup");
  const [qs, setQs] = useState<Asked[]>([]);
  const [i, setI] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [rights, setRights] = useState<number[]>([]);
  const [note, setNote] = useState("");

  const players = names.map((n, k) => n.trim() || `Player ${k + 1}`);
  const turn = i % players.length;

  const start = () => {
    const picked = partyQuestions(cats, level, players.length * each);
    const fits = Math.floor(picked.length / players.length) * players.length;
    if (fits === 0) {
      setNote("Not enough questions for that mix. Add a category or raise the level.");
      return;
    }
    setNote(fits < players.length * each ? `${fits / players.length} questions each: that is all we have for this mix.` : "");
    setQs(picked.slice(0, fits));
    setScores(players.map(() => 0));
    setRights(players.map(() => 0));
    setI(0);
    setPhase("handoff");
  };

  const onAnswer = (choice: number, left: number) => {
    const ok = choice === qs[i].correct;
    setScores((s) => s.map((v, k) => (k === turn ? v + points(ok, left) : v)));
    if (ok) setRights((r) => r.map((v, k) => (k === turn ? v + 1 : v)));
  };

  const next = () => {
    if (i + 1 >= qs.length) setPhase("results");
    else {
      setI(i + 1);
      setPhase("handoff");
    }
  };

  const toggleCat = (c: Category) => setCats((cs) => (cs.includes(c) ? (cs.length > 1 ? cs.filter((x) => x !== c) : cs) : [...cs, c]));
  const ranking = players.map((n, k) => ({ n, k, s: scores[k] ?? 0, r: rights[k] ?? 0 })).sort((a, b) => b.s - a.s);
  const btn = (on: boolean) => `min-h-11 rounded-full px-4 text-[14px] font-semibold transition ${on ? "bg-[#ff8c14] text-black" : "border border-white/15 text-[#c7cdd8] hover:border-white/35"}`;

  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-b from-[#1b2340] to-[#141a28] p-5 sm:p-7">
      {phase === "setup" && (
        <>
          <div>
            <p className="text-[16px] font-semibold text-white">Who is playing? <span className="text-[13px] font-normal text-[#a1a1a6]">(2–6 players or teams)</span></p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {names.map((n, k) => (
                <div key={k} className="flex items-center gap-2">
                  <span className={`h-9 w-9 shrink-0 rounded-full ${COLORS[k]}`} aria-hidden />
                  <input aria-label={`Player ${k + 1} name`} value={n} maxLength={20} onChange={(e) => setNames(names.map((x, j) => (j === k ? e.target.value : x)))} className="min-h-11 w-full rounded-xl border border-white/15 bg-black/40 px-3 text-[15px] text-white outline-none focus:border-[#ff8c14]" />
                  {names.length > 2 && <button type="button" aria-label={`Remove ${players[k]}`} onClick={() => setNames(names.filter((_, j) => j !== k))} className="min-h-11 min-w-11 rounded-xl border border-white/15 text-white">×</button>}
                </div>
              ))}
            </div>
            {names.length < 6 && <button type="button" onClick={() => setNames([...names, `Team ${names.length + 1}`])} className="mt-2 min-h-11 rounded-full border border-dashed border-white/25 px-4 text-[14px] text-white">+ Add player</button>}
          </div>

          <div>
            <p className="text-[16px] font-semibold text-white">Level</p>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Level">
              {LEVELS.map((l) => <button key={l.d} type="button" role="radio" aria-checked={level === l.d} onClick={() => setLevel(l.d)} className={btn(level === l.d)}>{l.label} · <span className="font-normal">{l.desc}</span></button>)}
            </div>
          </div>

          <div>
            <p className="text-[16px] font-semibold text-white">Categories</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => <button key={c} type="button" aria-pressed={cats.includes(c)} onClick={() => toggleCat(c)} className={btn(cats.includes(c))}>{c}</button>)}
            </div>
          </div>

          <div>
            <p className="text-[16px] font-semibold text-white">Questions each</p>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Questions each">
              {[3, 5, 10].map((n) => <button key={n} type="button" role="radio" aria-checked={each === n} onClick={() => setEach(n)} className={btn(each === n)}>{n}</button>)}
            </div>
          </div>

          {note && <p className="text-[14px] text-pink-300" role="status">{note}</p>}
          <button type="button" onClick={start} className="min-h-14 w-full rounded-2xl bg-green-400 text-[20px] font-black text-black">Start quiz night</button>
        </>
      )}

      {phase === "handoff" && i === 0 && note && <p className="text-[14px] text-yellow-200" role="status">{note}</p>}

      {(phase === "handoff" || phase === "question") && (
        <div className="flex flex-wrap gap-2">
          {players.map((n, k) => (
            <span key={k} className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold ${k === turn ? `${COLORS[k]} text-black` : "bg-white/10 text-white"}`}>{n}: {scores[k]}</span>
          ))}
        </div>
      )}

      {phase === "handoff" && (
        <div className="py-8 text-center">
          <p className="text-[15px] text-[#a1a1a6]">Question {i + 1} of {qs.length}</p>
          <p className="mt-2 text-[18px] text-[#c7cdd8]">Pass the phone to</p>
          <p className={`mx-auto mt-3 inline-block rounded-2xl px-6 py-3 text-[32px] font-black text-black ${COLORS[turn]}`}>{players[turn]}</p>
          <div><button type="button" onClick={() => setPhase("question")} className="mt-6 min-h-14 rounded-full bg-white px-8 text-[18px] font-black text-black">I&apos;m ready</button></div>
        </div>
      )}

      {phase === "question" && (
        <QuestionCard key={i} q={qs[i]} label={`${players[turn]} · Q${i + 1}/${qs.length}`} onAnswer={onAnswer} onNext={next} nextLabel={i + 1 < qs.length ? "Next player" : "See the winner"} />
      )}

      {phase === "results" && (
        <div className="text-center">
          <p className="text-[52px]" aria-hidden>🏆</p>
          <p className="text-[30px] font-black text-white">{ranking[0].s === ranking[1]?.s ? "It's a tie!" : `${ranking[0].n} wins!`}</p>
          <ol className="mx-auto mt-5 max-w-md space-y-2 text-left">
            {ranking.map((p, pos) => (
              <li key={p.k} className="flex items-center justify-between gap-3 rounded-2xl bg-black/30 px-4 py-3">
                <span className="flex items-center gap-3 text-[17px] font-semibold text-white">
                  <span className="w-6 text-center text-[#a1a1a6]">{pos + 1}</span>
                  <span className={`h-4 w-4 rounded-full ${COLORS[p.k]}`} aria-hidden />
                  {p.n}
                </span>
                <span className="text-[15px] text-[#c7cdd8]">{p.s} pts · {p.r}/{qs.length / players.length} right</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={start} className="min-h-12 rounded-full bg-[#ff8c14] px-6 text-[15px] font-bold text-black">Rematch (new questions)</button>
            <button type="button" onClick={() => setPhase("setup")} className="min-h-12 rounded-full border border-white/15 px-6 text-[15px] font-semibold text-white">Change players</button>
          </div>
          <p className="mt-6 text-[14px] text-[#a1a1a6]">
            Hosting a bigger quiz at church, school or the office? Get the <Link href="/products/quiz-night-host-pack" className="text-[#ff8c14] underline">printable Quiz Night Host Pack</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
