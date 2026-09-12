"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { YoutubeVideo } from "@/lib/youtube";

type Props = {
  videos: YoutubeVideo[];
  channelUrl?: string | null;
  playlistUrl?: string | null;
  playlistTitle?: string | null;
};

export default function YouTubeShorts({
  videos,
  channelUrl,
  playlistUrl,
  playlistTitle,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!videos || videos.length === 0) {
    return (
      <section className="mt-16">
        <h2 className="text-[28px] font-semibold tracking-tight text-[#f5f5f7]">
          From the playlist
        </h2>
        <div className="mt-6 rounded-[22px] border border-dashed border-white/15 bg-[#1d1d1f] p-8 text-center">
          <p className="text-[15px] text-[#a1a1a6]">
            Videos will appear here once the playlist feed is available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#a1a1a6]">
            YouTube playlist
          </p>
          <h2 className="mt-1 text-[28px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[34px]">
            {playlistTitle || "Latest videos"}
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#a1a1a6]">
            Latest {videos.length} videos from the playlist — newest first.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {playlistUrl && (
            <a href={playlistUrl} target="_blank" rel="noopener noreferrer" className="apple-link text-[14px]">
              Open playlist ›
            </a>
          )}
          {channelUrl && (
            <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="apple-link text-[14px]">
              Channel ›
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div key={video.id} className="apple-card group overflow-hidden">
            <div className="relative aspect-video bg-black">
              {activeId === video.id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <>
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveId(video.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/35 transition hover:bg-black/45"
                    aria-label={`Play ${video.title}`}
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff0000] text-white shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-0.5 h-6 w-6"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
                  {video.isShort && (
                    <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Short
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="p-4">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[15px] font-semibold leading-snug text-[#f5f5f7] transition hover:text-[#2997ff]"
              >
                {video.title}
              </a>
              {video.published && (
                <p className="mt-1 text-[12px] text-[#a1a1a6]">
                  {new Date(video.published).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
