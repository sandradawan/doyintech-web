"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadQuiz, quizStreak } from "@/lib/daily/progress";
import { loadProgress, streakNow } from "@/lib/kids/progress";

type State = { quizDone: boolean; quizStreak: number; kidsDone: boolean; kidsStreak: number };

/** Homepage "Today" row: the daily quiz and kids challenge, with the visitor's streaks once known. */
export default function TodayStrip() {
  const [s, setS] = useState<State | null>(null);
  useEffect(() => {
    const q = loadQuiz();
    const k = loadProgress();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- streaks live in this browser and are only readable after mount
    setS({ quizDone: q.today !== null, quizStreak: quizStreak(q), kidsDone: Object.keys(k.today.scores).length > 0, kidsStreak: streakNow(k) });
  }, []);

  const cards = [
    {
      href: "/daily-quiz",
      icon: "💡",
      title: "Daily Money Quiz",
      text: s?.quizDone ? "Done today. New questions at midnight." : "5 quick questions on money and business.",
      streak: s?.quizStreak ?? 0,
      cta: s?.quizDone ? "See today's answers" : "Play today's quiz",
    },
    {
      href: "/kids/daily-challenge",
      icon: "🧮",
      title: "Kids' daily challenge",
      text: s?.kidsDone ? "Done today. Try the times tables race." : "New maths and word puzzles for ages 5–13.",
      streak: s?.kidsStreak ?? 0,
      cta: s?.kidsDone ? "Open the Kids zone" : "Play today's challenge",
    },
  ];

  return (
    <section aria-labelledby="today-heading" className="bg-black py-10">
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="today-heading" className="t-eyebrow">Today on DoyinTech</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#141a28] p-5 transition hover:border-[#ff8c14]">
              <span className="text-[40px]" aria-hidden>{c.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[17px] font-semibold text-white">{c.title}</span>
                  {c.streak > 0 && <span className="rounded-full bg-[#ff8c14]/15 px-2 py-0.5 text-[12px] font-semibold text-[#ffb366]">🔥 {c.streak}-day streak</span>}
                </span>
                <span className="mt-0.5 block text-[14px] text-[#a1a1a6]">{c.text}</span>
                <span className="mt-2 block text-[14px] font-semibold text-[#ff8c14] group-hover:underline">{c.cta} →</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
