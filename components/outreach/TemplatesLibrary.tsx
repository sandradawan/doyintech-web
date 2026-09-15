"use client";

import { useMemo, useState } from "react";
import { OUTREACH_TEMPLATES } from "@/lib/outreach-templates";

export default function TemplatesLibrary() {
  const channels = useMemo(() => {
    const set = new Set(OUTREACH_TEMPLATES.map((t) => t.channel));
    return ["All", ...Array.from(set)];
  }, []);
  const [channel, setChannel] = useState("All");
  const [copiedId, setCopiedId] = useState("");

  const list =
    channel === "All"
      ? OUTREACH_TEMPLATES
      : OUTREACH_TEMPLATES.filter((t) => t.channel === channel);

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 1500);
    } catch {
      alert("Copy failed — select text manually");
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-[#a1a1a6]">
        Personalize every [BRACKET] before sending. Do not spam the same message to lists.
      </p>
      <div className="flex flex-wrap gap-2">
        {channels.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChannel(c)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
              channel === c
                ? "bg-[#ff8c14] text-black"
                : "border border-white/15 text-[#a1a1a6]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-white/10 bg-black/30 p-4"
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                  {t.channel}
                </p>
                <p className="text-[14px] font-semibold text-white">{t.title}</p>
              </div>
              <button
                type="button"
                onClick={() => copy(t.id, t.body)}
                className="rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-white"
              >
                {copiedId === t.id ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#c7cdd8]">
              {t.body}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
