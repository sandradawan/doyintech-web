"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPause, FaPlay } from "react-icons/fa";
import { usePlayer } from "@/components/listen/PlayerProvider";
import type { ListedEpisode } from "@/lib/listen/feeds";
import { loadListen, toTrack, type Saved, type Track } from "@/lib/listen/progress";
import { absoluteUrl } from "@/lib/site";

function when(date: string) {
  return date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "";
}

export function PlayButton({ track, label }: { track: Track; label?: string }) {
  const { track: current, playing, toggle } = usePlayer();
  const active = current?.id === track.id && playing;
  const name = `${active ? "Pause" : "Play"} ${track.title}`;
  if (label) {
    return (
      <button type="button" onClick={() => toggle(track)} aria-label={name} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-accent px-6 text-[15px] font-semibold text-black">
        {active ? <FaPause aria-hidden /> : <FaPlay aria-hidden />} {active ? "Pause" : label}
      </button>
    );
  }
  return (
    <button type="button" onClick={() => toggle(track)} aria-label={name} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-accent text-black">
      {active ? <FaPause aria-hidden /> : <FaPlay aria-hidden />}
    </button>
  );
}

/** Episode rows. On a show page it also opens the episode named in a shared link. */
export default function EpisodeList({ items, showNames = false, openShared = false }: { items: ListedEpisode[]; showNames?: boolean; openShared?: boolean }) {
  const { cue } = usePlayer();
  const [saved, setSaved] = useState<Record<string, Saved>>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- progress lives in this browser and is only readable after mount
    setSaved(loadListen().positions);
    if (!openShared) return;
    const link = new URLSearchParams(window.location.search);
    const shared = items.find((i) => i.episode.id === link.get("e"));
    if (!shared) return;
    cue(toTrack(shared), Math.max(0, Number(link.get("t")) || 0));
    document.getElementById(`ep-${shared.episode.id}`)?.scrollIntoView({ block: "center" });
  }, [items, openShared, cue]);

  return (
    <ul className="divide-y divide-brand-ink/10">
      {items.map((item) => {
        const { episode: e } = item;
        const place = saved[e.id];
        const share = `Listen to "${e.title}" on ${item.showName} ${absoluteUrl(`/listen/${item.showSlug}?e=${e.id}`)}`;
        return (
          <li key={`${item.showSlug}-${e.id}`} id={`ep-${e.id}`} className="flex gap-3 py-4">
            <PlayButton track={toTrack(item)} />
            <div className="min-w-0 flex-1">
              {showNames && <Link href={`/listen/${item.showSlug}`} className="text-[13px] font-semibold text-brand-link hover:underline">{item.showName}</Link>}
              <h3 className="text-[16px] font-semibold leading-snug text-brand-ink">{e.title}</h3>
              <p className="mt-0.5 text-[13px] text-brand-muted">
                {[when(e.date), e.seconds ? `${Math.max(1, Math.round(e.seconds / 60))} min` : ""].filter(Boolean).join(" · ")}
              </p>
              {e.summary && <p className="mt-1 line-clamp-2 text-[14px] text-brand-soft">{e.summary}</p>}
              {place && place.duration > 0 && (
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-brand-ink/10" role="img" aria-label={`${Math.round((place.at / place.duration) * 100)}% played`}>
                  <div className="h-full bg-brand-accent" style={{ width: `${(place.at / place.duration) * 100}%` }} />
                </div>
              )}
              <a href={`https://wa.me/?text=${encodeURIComponent(share)}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center text-[14px] font-semibold text-brand-link hover:underline">Share on WhatsApp</a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
