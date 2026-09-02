"use client";

import { useState } from "react";
import { trackToolEvent } from "@/lib/tools/analytics";
import { whatsappUrl } from "@/lib/tools/config";

export default function ShareActions({
  tool,
  shareText,
  onRestart,
}: {
  tool: string;
  shareText: string;
  onRestart?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function printPage() {
    trackToolEvent("pdf_downloaded", { tool });
    window.print();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-gray-300 hover:border-primary/40 hover:text-white"
      >
        {copied ? "Copied" : "Copy result"}
      </button>
      <a
        href={whatsappUrl(shareText)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackToolEvent("whatsapp_clicked", { tool })}
        className="rounded-full border border-[#25D366]/40 px-4 py-2 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/10"
      >
        Share on WhatsApp
      </a>
      <button
        type="button"
        onClick={printPage}
        className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-gray-300 hover:border-primary/40 hover:text-white"
      >
        Download / Print
      </button>
      {onRestart && (
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-gray-300 hover:border-primary/40 hover:text-white"
        >
          Start again
        </button>
      )}
    </div>
  );
}
