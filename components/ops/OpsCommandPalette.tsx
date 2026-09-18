"use client";

import { useEffect, useMemo, useState } from "react";

export type PaletteAction = {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
};

export default function OpsCommandPalette({
  open,
  onClose,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  actions: PaletteAction[];
}) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(qq) ||
        (a.hint || "").toLowerCase().includes(qq)
    );
  }, [actions, q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 px-4 pt-[12vh]">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close" />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0c1220] shadow-2xl">
        <div className="border-b border-white/[0.06] px-4 py-3">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command…"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && filtered[0]) {
                filtered[0].run();
                onClose();
              }
            }}
          />
        </div>
        <ul className="max-h-72 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-white/40">No matches</li>
          )}
          {filtered.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-white/5"
                onClick={() => {
                  a.run();
                  onClose();
                }}
              >
                <span className="text-sm text-white">{a.label}</span>
                {a.hint && <span className="text-[11px] text-white/35">{a.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
        <p className="border-t border-white/[0.06] px-4 py-2 text-[10px] text-white/30">
          Tip: press <kbd className="rounded border border-white/15 px-1">⌘</kbd>/
          <kbd className="rounded border border-white/15 px-1">Ctrl</kbd>+
          <kbd className="rounded border border-white/15 px-1">K</kbd>
        </p>
      </div>
    </div>
  );
}
