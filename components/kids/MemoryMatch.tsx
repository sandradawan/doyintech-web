"use client";

import { useState } from "react";
import StreakBar from "@/components/kids/StreakBar";
import { loadProgress, recordBest, type Progress } from "@/lib/kids/progress";

const THEMES: Record<string, string[]> = {
  Animals: ["🦁", "🐘", "🦒", "🐢", "🐒", "🦜", "🐊", "🦓", "🐧", "🦉", "🐬", "🦋"],
  Fruits: ["🍎", "🍌", "🍊", "🍍", "🥭", "🍉", "🍇", "🍓", "🥥", "🍒", "🍋", "🥝"],
  Space: ["🚀", "🌍", "🌙", "⭐", "☀️", "🪐", "☄️", "🛰️", "👽", "🌌", "🔭", "👩‍🚀"],
};
const SIZES = { Easy: 6, Medium: 8, Hard: 12 } as const;
type Size = keyof typeof SIZES;
type Card = { id: number; face: string };

function deal(theme: string, size: Size): Card[] {
  const faces = [...THEMES[theme]].sort(() => Math.random() - 0.5).slice(0, SIZES[size]);
  return [...faces, ...faces].map((face, id) => ({ id, face })).sort(() => Math.random() - 0.5);
}

/** Classic pairs game: fewer moves earns more stars. */
export default function MemoryMatch() {
  const [theme, setTheme] = useState("Animals");
  const [size, setSize] = useState<Size>("Easy");
  const [cards, setCards] = useState<Card[] | null>(null);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [newBest, setNewBest] = useState(false);

  const pairs = SIZES[size];
  const won = cards !== null && found.size === pairs;

  const start = () => {
    setCards(deal(theme, size));
    setOpen([]);
    setFound(new Set());
    setMoves(0);
  };

  const flip = (i: number) => {
    if (!cards || open.length === 2 || open.includes(i) || found.has(cards[i].face)) return;
    const now = [...open, i];
    setOpen(now);
    if (now.length < 2) return;
    const m = moves + 1;
    setMoves(m);
    if (cards[now[0]].face === cards[now[1]].face) {
      const f = new Set(found).add(cards[i].face);
      setFound(f);
      setOpen([]);
      if (f.size === pairs) {
        const stars = m <= pairs + 2 ? 3 : m <= pairs * 2 ? 2 : 1;
        setNewBest(recordBest(`memory:${size}`, m, stars, true));
        setProgress(loadProgress());
      }
    } else {
      setTimeout(() => setOpen([]), 800);
    }
  };

  const cols = pairs === 12 ? "grid-cols-4 sm:grid-cols-6" : "grid-cols-4";
  const best = progress?.best[`memory:${size}`];

  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-b from-brand-raised to-brand-surface p-5 sm:p-7">
      <StreakBar progress={progress} />

      {!cards && (
        <>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Theme">
            {Object.keys(THEMES).map((t) => (
              <button key={t} type="button" role="radio" aria-checked={theme === t} onClick={() => setTheme(t)} className={`min-h-12 rounded-2xl px-4 text-[16px] font-bold ${theme === t ? "bg-[#ff8c14] text-black" : "border border-white/15 bg-white/5 text-black"}`}>
                {THEMES[t][0]} {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Difficulty">
            {(Object.keys(SIZES) as Size[]).map((s) => (
              <button key={s} type="button" role="radio" aria-checked={size === s} onClick={() => setSize(s)} className={`min-h-12 rounded-2xl px-4 text-[16px] font-bold ${size === s ? "bg-sky-400 text-black" : "border border-white/15 bg-white/5 text-white"}`}>
                {s} · {SIZES[s]} pairs
              </button>
            ))}
          </div>
          <button type="button" onClick={start} className="min-h-14 w-full rounded-2xl bg-green-400 text-[20px] font-black text-black">Start</button>
        </>
      )}

      {cards && (
        <>
          <div className="flex justify-between text-[16px] font-bold text-white">
            <span>Moves: {moves}</span>
            <span>Pairs: {found.size}/{pairs}</span>
          </div>
          <div className={`grid gap-2 ${cols}`}>
            {cards.map((c, i) => {
              const shown = open.includes(i) || found.has(c.face);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => flip(i)}
                  aria-label={shown ? c.face : "Hidden card"}
                  className={`aspect-square rounded-2xl text-[36px] transition sm:text-[44px] ${shown ? "bg-white/90" : "bg-gradient-to-br from-[#ff8c14] to-pink-500 hover:scale-[1.03]"} ${found.has(c.face) ? "opacity-60" : ""}`}
                >
                  {shown ? c.face : ""}
                </button>
              );
            })}
          </div>
          {won && (
            <div className="text-center">
              <p className="text-[26px] font-black text-white">You found them all in {moves} moves! {newBest && "🏆 New best!"}</p>
              {best && !newBest && <p className="text-[15px] text-brand-muted">Your best on {size}: {best} moves</p>}
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={start} className="min-h-12 rounded-full bg-[#ff8c14] px-6 text-[15px] font-bold text-black">{won ? "Play again" : "Restart"}</button>
            <button type="button" onClick={() => setCards(null)} className="min-h-12 rounded-full border border-white/15 px-6 text-[15px] font-semibold text-white">Change game</button>
          </div>
        </>
      )}
    </div>
  );
}
