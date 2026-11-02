/** Kids progress kept in this browser only: streak, today's results and best scores. Never sent anywhere. */

import { currentStreak, dayKey, nextStreak, type Streak } from "@/lib/kids/daily";

const KEY = "dt-kids-progress";

export type Progress = {
  streak: Streak | null;
  /** Today's results by challenge id, e.g. "maths:explorer" → 8 (cleared on a new day). */
  today: { day: string; scores: Record<string, number> };
  /** Best score per game, e.g. "tables:7" → 23. */
  best: Record<string, number>;
  stars: number;
};

const empty = (): Progress => ({ streak: null, today: { day: dayKey(), scores: {} }, best: {}, stars: 0 });

export function loadProgress(): Progress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const p = { ...empty(), ...JSON.parse(raw) } as Progress;
    if (p.today?.day !== dayKey()) p.today = { day: dayKey(), scores: {} };
    return p;
  } catch {
    return empty();
  }
}

function save(p: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Private mode or storage blocked: the game still works, it just forgets.
  }
}

/** Records a finished daily challenge: extends the streak and awards stars once per challenge per day. */
export function recordDaily(id: string, score: number, stars: number): Progress {
  const p = loadProgress();
  const first = !(id in p.today.scores);
  p.today.scores[id] = Math.max(p.today.scores[id] ?? 0, score);
  p.streak = nextStreak(p.streak, dayKey());
  if (first) p.stars += stars;
  save(p);
  return p;
}

/** Records a game score; returns true when it beats the previous best. */
export function recordBest(id: string, score: number, stars = 0, lowerIsBetter = false): boolean {
  const p = loadProgress();
  const prev = p.best[id];
  const beat = prev === undefined || (lowerIsBetter ? score < prev : score > prev);
  if (beat) p.best[id] = score;
  p.stars += stars;
  save(p);
  return beat;
}

export function streakNow(p: Progress) {
  return currentStreak(p.streak, dayKey());
}
