"use client";

import { useEffect, useMemo, useState } from "react";

/** Ordered real-page snapshot providers (direct image URLs) */
export function previewCandidates(pageUrl: string): string[] {
  const encoded = encodeURIComponent(pageUrl);
  return [
    `https://s0.wp.com/mshots/v1/${encoded}?w=1400`,
    `https://image.thum.io/get/width/1400/crop/1000/noanimate/${pageUrl}`,
    `https://image.thum.io/get/width/1400/${pageUrl}`,
  ];
}

type Props = {
  url: string;
  className?: string;
  onReady?: () => void;
};

/**
 * Shows the real website for any public URL.
 * Live iframes are blocked by most sites (X-Frame-Options / CSP).
 * We capture real page snapshots instead, with provider failover.
 */
export default function SitePreview({ url, className = "", onReady }: Props) {
  const candidates = useMemo(() => previewCandidates(url), [url]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failedAll, setFailedAll] = useState(false);
  const [mode, setMode] = useState<"snapshot" | "iframe">("snapshot");

  useEffect(() => {
    setIndex(0);
    setLoaded(false);
    setFailedAll(false);
    setMode("snapshot");
  }, [url]);

  const src = candidates[Math.min(index, candidates.length - 1)];

  return (
    <div className={`relative h-full w-full bg-[#e8eef5] ${className}`}>
      <div className="absolute left-2 top-2 z-30 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setMode("snapshot")}
          className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
            mode === "snapshot"
              ? "bg-primary text-white"
              : "bg-black/50 text-gray-200"
          }`}
        >
          Page snapshot
        </button>
        <button
          type="button"
          onClick={() => setMode("iframe")}
          className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
            mode === "iframe"
              ? "bg-primary text-white"
              : "bg-black/50 text-gray-200"
          }`}
        >
          Try live embed
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-black/50 px-2 py-1 text-[10px] font-semibold text-green-300 hover:bg-black/70"
        >
          Open real site ↗
        </a>
      </div>

      {mode === "snapshot" && (
        <>
          {!loaded && !failedAll && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#0b1220]/80">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-gray-300">Loading real page preview…</p>
              <p className="max-w-xs truncate px-4 text-center text-[10px] text-gray-500">
                {url}
              </p>
            </div>
          )}

          {failedAll ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm font-semibold text-gray-800">
                Snapshot providers busy — your scan still uses the real URL
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white"
              >
                Open site in new tab
              </a>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={`Preview of ${url}`}
              className="h-full w-full object-cover object-top"
              onLoad={() => {
                setLoaded(true);
                onReady?.();
              }}
              onError={() => {
                if (index < candidates.length - 1) {
                  setIndex((i) => i + 1);
                  setLoaded(false);
                } else {
                  setFailedAll(true);
                }
              }}
            />
          )}
        </>
      )}

      {mode === "iframe" && (
        <div className="relative h-full w-full">
          <iframe
            key={url}
            src={url}
            title="Live embed"
            className="h-full w-full bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
          <p className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/75 px-2 py-1 text-[10px] text-gray-300">
            If this stays blank, the site blocks embedding. Switch to{" "}
            <strong>Page snapshot</strong> or open the real site.
          </p>
        </div>
      )}
    </div>
  );
}
