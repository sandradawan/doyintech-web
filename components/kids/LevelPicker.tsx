"use client";

import { useEffect, useState } from "react";
import { LEVELS, type Level } from "@/lib/kids/daily";

const KEY = "dt-kids-level";

/** The child's level, remembered on this device. */
export function useLevel() {
  const [level, setLevel] = useState<Level>("explorer");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY) as Level | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- saved level is only readable after mount
      if (saved && LEVELS.some((l) => l.id === saved)) setLevel(saved);
    } catch {}
  }, []);
  const choose = (l: Level) => {
    setLevel(l);
    try {
      window.localStorage.setItem(KEY, l);
    } catch {}
  };
  return [level, choose] as const;
}

export default function LevelPicker({ value, onChange }: { value: Level; onChange: (l: Level) => void }) {
  return (
    <div role="radiogroup" aria-label="Level" className="grid grid-cols-3 gap-2">
      {LEVELS.map((l) => (
        <button
          key={l.id}
          type="button"
          role="radio"
          aria-checked={value === l.id}
          onClick={() => onChange(l.id)}
          className={`min-h-14 rounded-2xl px-2 text-center transition ${value === l.id ? "bg-[#ff8c14] text-black" : "border border-white/15 bg-white/5 text-black hover:border-white/35"}`}
        >
          <span className="block text-[15px] font-bold">{l.label}</span>
          <span className={`block text-[12px] ${value === l.id ? "text-black/70" : "text-brand-muted"}`}>{l.ages}</span>
        </button>
      ))}
    </div>
  );
}
