"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { YoutubeVideo } from "@/lib/youtube";

type Props = {
  videos: YoutubeVideo[];
  channelUrl?: string | null;
};

export default function YouTubeShorts({ videos, channelUrl }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!videos || videos.length === 0) {
    return (
      <section className="mt-20">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              From YouTube
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Latest Shorts & Videos
            </h2>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Connect your YouTube channel to auto-pull the latest Shorts here.
          </p>
          <p className="mt-3 text-xs text-gray-500">
            Add <code className="text-primary">YOUTUBE_CHANNEL_ID</code> (and
            optionally <code className="text-primary">YOUTUBE_API_KEY</code>) in
            your Vercel environment variables.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            From YouTube
          </p>
          <h2 className="mt-1 font-display text-2xl md:text-3xl font-bold text-white">
            Latest Shorts & Videos
          </h2>
          <p className="mt-2 text-sm text-gray-400 max-w-lg">
            Fresh engineering tips, build updates and quick insights — pulled
            automatically from our channel.
          </p>
        </div>

        {channelUrl && (
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline shrink-0"
          >
            Watch on YouTube
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group relative rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] hover:border-primary/40 transition"
          >
            {/* Thumbnail / Embed */}
            <div className="relative aspect-[9/16] bg-black">
              {activeId === video.id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <>
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {/* Play overlay */}
                  <button
                    type="button"
                    onClick={() => setActiveId(video.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition"
                    aria-label={`Play ${video.title}`}
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/40 group-hover:scale-110 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6 ml-0.5"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>

                  {video.isShort && (
                    <span className="absolute top-3 left-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      Short
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Title */}
            <div className="p-3">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium text-white line-clamp-2 group-hover:text-primary transition"
              >
                {video.title}
              </a>
              {video.published && (
                <p className="mt-1 text-[11px] text-gray-500">
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
