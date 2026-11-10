"use client";

import { useMemo, useState } from "react";

export default function TextCleanerTool() {
  const [raw, setRaw] = useState("");

  const cleaned = useMemo(() => {
    return raw
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => line.replace(/[\t ]+/g, " ").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }, [raw]);

  return (
    <div className="space-y-4">
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={8}
        placeholder="Paste messy text here…"
        className="w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-sm text-brand-ink outline-none"
      />
      <div className="rounded-xl border border-brand-ink/10 bg-brand-ink/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-subtle">Cleaned</p>
        <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-200">{cleaned || "—"}</pre>
      </div>
      <button
        type="button"
        disabled={!cleaned}
        onClick={() => navigator.clipboard?.writeText(cleaned)}
        className="w-full rounded-full bg-brand-ink py-3 text-sm font-semibold text-brand-deep disabled:opacity-40"
      >
        Copy cleaned text
      </button>
    </div>
  );
}
