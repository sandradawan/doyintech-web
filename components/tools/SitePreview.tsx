"use client";

import { useEffect, useMemo, useState } from "react";

/** Build ordered screenshot provider URLs for a page */
export function previewCandidates(pageUrl: string): string[] {
  const u = encodeURIComponent(pageUrl);
  return [
    // WordPress mShots — free full-page snapshots
    `https://s0.wp.com/mshots/v1/${u}?w=1400`,
    // thum.io
    `https://image.thum.io/get/width/1400/crop/900/noanimate/${pageUrl}`,
    // microlink screenshot (public)
    `https://api.microlink.io/?url=${u}&screenshot=true&meta=false&embed=screenshot.url`,
  ];
}

type Props = {
  url: string;
  className?: string;
  onReady?: () => void;
};

/**
 * Always tries to show the real website visually.
 * Browsers block most live iframes (X-Frame-Options / CSP).
 * We use real page screenshots from public snapshot services,
 * with automatic failover between providers.
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

  const src = candidates[index];

  return (
    <div className={`relative h-full w-full bg-[#e8eef5] ${className}`}>
      {/* Toolbar */}
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
              <p className="max-w-xs text-center text-[10px] text-gray-500">
                Capturing {url}
              </p>
            </div>
          )}

          {failedAll ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm font-semibold text-gray-800">
                Preview service busy — site is still scanned
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white"
              >
                Open {url} in new tab
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
            Many sites block live embeds (security headers). If this stays blank, use{" "}
            <strong>Page snapshot</strong> or <strong>Open real site</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
