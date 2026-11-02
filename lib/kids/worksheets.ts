/** Printable maths worksheets. A sheet code re-creates the exact same sheet. */

import { seeded } from "@/lib/kids/daily";

export const TOPICS = {
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Times tables",
  division: "Division",
  mixed: "Mixed practice",
} as const;
export type Topic = keyof typeof TOPICS;

export const DIFFICULTY = {
  1: "Easy (numbers to 20)",
  2: "Medium (numbers to 100)",
  3: "Hard (bigger numbers)",
} as const;
export type Difficulty = 1 | 2 | 3;

export type Sum = { text: string; answer: number };

const between = (rnd: () => number, lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));

function sum(rnd: () => number, topic: Exclude<Topic, "mixed">, d: Difficulty): Sum {
  const max = d === 1 ? 10 : d === 2 ? 50 : 500;
  if (topic === "addition") {
    const a = between(rnd, 1, max), b = between(rnd, 1, max);
    return { text: `${a} + ${b}`, answer: a + b };
  }
  if (topic === "subtraction") {
    const a = between(rnd, 2, max * 2), b = between(rnd, 1, a);
    return { text: `${a} − ${b}`, answer: a - b };
  }
  const hi = d === 1 ? 5 : d === 2 ? 12 : 25;
  const a = between(rnd, 2, hi), b = between(rnd, 2, d === 3 ? 12 : hi);
  return topic === "multiplication" ? { text: `${a} × ${b}`, answer: a * b } : { text: `${a * b} ÷ ${a}`, answer: b };
}

/** `count` questions for a sheet. */
export function worksheet(code: string, topic: Topic, d: Difficulty, count = 30): Sum[] {
  const rnd = seeded(`sheet:${code}:${topic}:${d}`);
  const kinds = ["addition", "subtraction", "multiplication", "division"] as const;
  return Array.from({ length: count }, () => sum(rnd, topic === "mixed" ? kinds[Math.floor(rnd() * 4)] : topic, d));
}

/** A short code a parent can note down to print the same sheet again. */
export function newCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}
