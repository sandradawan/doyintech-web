"use client";

import { useEffect, useState } from "react";
import { loadProgress, streakNow, type Progress } from "@/lib/kids/progress";

/** Streak and star count from this device; refreshes when a game records progress. */
export default function StreakBar({ progress }: { progress?: Progress | null }) {
  const [own, setOwn] = useState<Progress | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- progress is stored in the browser, only readable after mount
    setOwn(loadProgress());
  }, []);
  const p = progress ?? own;
  const streak = p ? streakNow(p) : 0;
  return (
    <div className="flex flex-wrap items-center gap-2 text-[14px] font-semibold" aria-live="polite">
      <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#ff8c14]/15 px-3 text-[#ffb366]">
        <span aria-hidden>🔥</span> {streak} day{streak === 1 ? "" : "s"} streak
      </span>
      <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-yellow-400/15 px-3 text-yellow-200">
        <span aria-hidden>⭐</span> {p?.stars ?? 0} stars
      </span>
      {p?.streak && p.streak.best > 1 && <span className="text-[13px] font-normal text-[#a1a1a6]">Best streak: {p.streak.best}</span>}
    </div>
  );
}
