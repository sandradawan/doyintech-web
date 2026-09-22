"use client";

import { useState } from "react";

type Props = {
  text: string;
  url?: string;
  label?: string;
  className?: string;
  compact?: boolean;
};

function buildMessage(text: string, url?: string) {
  const u = url || (typeof window !== "undefined" ? window.location.href : "https://doyintech.vercel.app");
  return `${text.trim()}\n\n${u}`;
}

export default function ViralShare({
  text,
  url,
  label = "Share",
  className = "",
  compact = false,
}: Props) {
  const [copied, setCopied] = useState(false);

  const message = () => buildMessage(text, url);

  async function copy() {
    try {
      await navigator.clipboard.writeText(message());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const waHref = () =>
    "https://wa.me/?text=" + encodeURIComponent(message());

  if (compact) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <button
          type="button"
          onClick={copy}
          className="rounded-full border border-white/15 px-3 py-1.5 text-[12px] font-semibold text-[#c7cdd8] hover:border-[#ff8c14]/40 hover:text-white"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
        <a
          href={waHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[#25D366]/40 px-3 py-1.5 text-[12px] font-semibold text-[#25D366] hover:bg-[#25D366]/10"
        >
          WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white hover:border-[#ff8c14]/50"
      >
        {copied ? "Copied ✓" : `Copy ${label}`}
      </button>
      <a
        href={waHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-2.5 text-[13px] font-semibold text-white"
      >
        Share on WhatsApp
      </a>
    </div>
  );
}
