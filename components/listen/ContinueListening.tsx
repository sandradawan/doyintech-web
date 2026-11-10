"use client";

import { useEffect, useState } from "react";
import { PlayButton } from "@/components/listen/EpisodeList";
import { clock, listenStreak, loadListen, type Saved } from "@/lib/listen/progress";

/** "Pick up where you left off", plus this listener's streak. Shows nothing on a first visit. */
export default function ContinueListening() {
  const [items, setItems] = useState<Saved[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const s = loadListen();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- progress lives in this browser and is only readable after mount
    setItems(Object.values(s.positions).sort((a, b) => b.updated - a.updated).slice(0, 3));
    setStreak(listenStreak(s));
  }, []);

  if (!items.length) return null;
  return (
    <section aria-labelledby="continue-heading" className="mt-10">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="continue-heading" className="text-[22px] font-semibold text-brand-ink">Continue listening</h2>
        {streak > 0 && <span className="rounded-full bg-brand-link/15 px-2 py-0.5 text-[12px] font-semibold text-brand-link">🔥 {streak}-day streak</span>}
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-brand-ink/10 bg-brand-surface p-3">
            <PlayButton track={p} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-semibold text-brand-ink">{p.title}</span>
              <span className="block truncate text-[13px] text-brand-muted">{p.showName} · stopped at {clock(p.at)}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
