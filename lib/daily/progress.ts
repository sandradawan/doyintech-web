/** Daily quiz progress kept in this browser only: streak, today's score and totals. */

import { currentStreak, dayKey, nextStreak, type Streak } from "@/lib/kids/daily";

const KEY = "dt-daily-quiz";

export type QuizProgress = {
  streak: Streak | null;
  today: { day: string; score: number; answers: number[] } | null;
  played: number;
  correct: number;
};

const empty = (): QuizProgress => ({ streak: null, today: null, played: 0, correct: 0 });

export function loadQuiz(): QuizProgress {
  try {
    const raw = window.localStorage.getItem(KEY);
    const p = raw ? { ...empty(), ...JSON.parse(raw) } : empty();
    if (p.today && p.today.day !== dayKey()) p.today = null;
    return p;
  } catch {
    return empty();
  }
}

/** Saves today's finished quiz once; replays the same day do not change totals. */
export function finishQuiz(score: number, answers: number[]): QuizProgress {
  const p = loadQuiz();
  if (p.today) return p;
  const day = dayKey();
  const next: QuizProgress = {
    streak: nextStreak(p.streak, day),
    today: { day, score, answers },
    played: p.played + 1,
    correct: p.correct + score,
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the quiz still works, it just will not remember.
  }
  return next;
}

export function quizStreak(p: QuizProgress) {
  return currentStreak(p.streak, dayKey());
}
