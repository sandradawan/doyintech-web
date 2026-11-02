/** Picking and scoring trivia questions for the daily round and for family quiz night. */

import { TRIVIA, type Category, type Difficulty, type Trivia } from "@/lib/trivia/bank";
import { currentStreak, dayKey, nextStreak, seeded, type Streak } from "@/lib/kids/daily";

export type Asked = Trivia & { shuffled: string[]; correct: number };

export const SECONDS_PER_QUESTION = 20;

function shuffle<T>(items: T[], rnd: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ask(t: Trivia, rnd: () => number): Asked {
  const order = shuffle([0, 1, 2, 3], rnd);
  return { ...t, shuffled: order.map((o) => t.options[o]), correct: order.indexOf(0) };
}

/** Each difficulty walked in a fixed shuffled order, so days do not repeat until a pool runs out. */
const POOLS = ([1, 2, 3] as Difficulty[]).map((d) => shuffle(TRIVIA.filter((t) => t.d === d), seeded(`trivia-pool-${d}`)));
const DAILY_MIX: Record<Difficulty, number> = { 1: 3, 2: 4, 3: 3 };

/** Today's ten questions, easy to hard, the same for everyone. */
export function dailyRound(day: string): Asked[] {
  const n = Math.floor(Date.parse(day + "T00:00:00Z") / 86400000);
  const rnd = seeded(`trivia:${day}`);
  return ([1, 2, 3] as Difficulty[]).flatMap((d) => {
    const pool = POOLS[d - 1];
    const k = DAILY_MIX[d];
    return Array.from({ length: k }, (_, i) => ask(pool[(n * k + i) % pool.length], rnd));
  });
}

/** Questions for a quiz night: chosen categories, up to a difficulty, no repeats within the game. */
export function partyQuestions(cats: Category[], maxDifficulty: Difficulty, count: number, rnd: () => number = Math.random): Asked[] {
  const pool = TRIVIA.filter((t) => cats.includes(t.cat) && t.d <= maxDifficulty);
  return shuffle(pool, rnd).slice(0, count).map((t) => ask(t, rnd));
}

/** 100 for a right answer plus up to 50 for speed; nothing for a wrong one. */
export function points(right: boolean, secondsLeft: number) {
  return right ? 100 + Math.round((50 * Math.max(0, secondsLeft)) / SECONDS_PER_QUESTION) : 0;
}

const KEY = "dt-trivia";
export type TriviaProgress = { streak: Streak | null; today: { day: string; score: number; right: number } | null; best: number; played: number };

export function loadTrivia(): TriviaProgress {
  const empty: TriviaProgress = { streak: null, today: null, best: 0, played: 0 };
  try {
    const p = { ...empty, ...JSON.parse(window.localStorage.getItem(KEY) || "{}") } as TriviaProgress;
    if (p.today && p.today.day !== dayKey()) p.today = null;
    return p;
  } catch {
    return empty;
  }
}

/** Saves the first finished daily round of the day. */
export function finishDaily(score: number, right: number): TriviaProgress {
  const p = loadTrivia();
  if (p.today) return p;
  const day = dayKey();
  const next: TriviaProgress = { streak: nextStreak(p.streak, day), today: { day, score, right }, best: Math.max(p.best, score), played: p.played + 1 };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function triviaStreak(p: TriviaProgress) {
  return currentStreak(p.streak, dayKey());
}
