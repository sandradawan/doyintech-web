"use client";

import React, { useState } from "react";

type Props = {
  title: string;
  path: string;
};

export default function ShareBar({ title, path }: Props) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : `https://www.doyintech.com${path}`;

  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-brand-ink/10 pt-6 mt-10">
      <span className="text-xs font-semibold uppercase tracking-wider text-brand-subtle">
        Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-3 py-1.5 rounded-lg border border-brand-ink/10 text-brand-soft hover:border-primary hover:text-brand-ink transition"
      >
        X / Twitter
      </a>
      <a
        href={`https://wa.me/?text=${text}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-3 py-1.5 rounded-lg border border-brand-ink/10 text-brand-soft hover:border-primary hover:text-brand-ink transition"
      >
        WhatsApp
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-3 py-1.5 rounded-lg border border-brand-ink/10 text-brand-soft hover:border-primary hover:text-brand-ink transition"
      >
        LinkedIn
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="text-xs px-3 py-1.5 rounded-lg border border-brand-ink/10 text-brand-soft hover:border-primary hover:text-brand-ink transition"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
