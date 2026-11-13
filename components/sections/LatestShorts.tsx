"use client";

import Image from "next/image";
import { useState } from "react";
import type { YoutubeVideo } from "@/lib/youtube";

const cleanTitle = (title: string) => title.replace(/\s*#\w+/g, "").trim() || title;

/** The channel's newest Shorts as tall cards. A card plays in place when tapped. */
export default function LatestShorts({ videos, shortsUrl }: { videos: YoutubeVideo[]; shortsUrl: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  if (!videos.length) return null;

  return (
    <section aria-labelledby="shorts-heading" className="mt-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-link">New on YouTube</p>
          <h2 id="shorts-heading" className="mt-1 text-[28px] font-semibold tracking-tight text-brand-ink sm:text-[34px]">
            Latest Shorts
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-brand-muted">
            Quick tips from our channel. This updates by itself whenever we post a new Short.
          </p>
        </div>
        <a href={shortsUrl} target="_blank" rel="noopener noreferrer" className="apple-link text-[14px]">
          All Shorts on YouTube ›
        </a>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {videos.map((v) => (
          <li key={v.id} className="apple-card group overflow-hidden">
            <div className="relative aspect-[9/16] bg-black">
              {activeId === v.id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={cleanTitle(v.title)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <button type="button" onClick={() => setActiveId(v.id)} aria-label={`Play ${cleanTitle(v.title)}`} className="absolute inset-0">
                  <Image
                    src={v.thumbnail}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 230px"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff8c14] text-black shadow-lg transition group-hover:scale-110">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-3 text-left">
                    <span className="line-clamp-3 text-[13px] font-semibold leading-snug text-white">{cleanTitle(v.title)}</span>
                    {v.published && (
                      <span className="mt-1 block text-[11px] text-white/70">
                        {new Date(v.published).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    )}
                  </span>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
