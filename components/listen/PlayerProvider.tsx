"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FaPause, FaPlay, FaTimes, FaWhatsapp } from "react-icons/fa";
import { addListened, clock, loadListen, savePosition, type Track } from "@/lib/listen/progress";
import { absoluteUrl } from "@/lib/site";

type Player = {
  track: Track | null;
  playing: boolean;
  /** Plays a track from where this listener stopped, or toggles it if it is already loaded. */
  toggle: (t: Track) => void;
  /** Loads a shared episode without playing: browsers block sound until the visitor taps. */
  cue: (t: Track, at: number) => void;
};

const PlayerContext = createContext<Player | null>(null);

export function usePlayer() {
  const p = useContext(PlayerContext);
  if (!p) throw new Error("usePlayer must be used inside PlayerProvider");
  return p;
}

const SPEEDS = [1, 1.25, 1.5, 2];
const SAVE_EVERY = 10;

/** Holds the one audio element for the Listen pages, so playback survives moving between them. */
export default function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const seekTo = useRef(0);
  const lastTick = useRef(0);
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [failed, setFailed] = useState(false);

  const load = useCallback((t: Track, at: number, autoplay: boolean) => {
    const el = audio.current;
    if (!el) return;
    setTrack(t);
    setFailed(false);
    setTime(at);
    setDuration(t.seconds);
    seekTo.current = at;
    lastTick.current = at;
    el.src = t.audio;
    el.load();
    if (autoplay) el.play().catch(() => setPlaying(false));
  }, []);

  const toggle = useCallback(
    (t: Track) => {
      const el = audio.current;
      if (!el) return;
      if (track?.id !== t.id) return load(t, loadListen().positions[t.id]?.at ?? 0, true);
      if (el.paused) el.play().catch(() => setPlaying(false));
      else el.pause();
    },
    [track, load],
  );

  const cue = useCallback((t: Track, at: number) => load(t, at, false), [load]);

  const skip = useCallback((by: number) => {
    const el = audio.current;
    if (el) el.currentTime = Math.max(0, el.currentTime + by);
  }, []);

  const onTime = () => {
    const el = audio.current;
    if (!el || !track) return;
    setTime(el.currentTime);
    const gap = el.currentTime - lastTick.current;
    if (gap >= SAVE_EVERY || gap < 0) {
      lastTick.current = el.currentTime;
      savePosition(track, el.currentTime, el.duration || track.seconds);
      if (gap > 0 && gap < SAVE_EVERY * 3 && !el.paused) addListened(Math.round(gap));
    }
  };

  const onMeta = () => {
    const el = audio.current;
    if (!el) return;
    if (Number.isFinite(el.duration)) setDuration(el.duration);
    el.playbackRate = speed;
    if (seekTo.current > 0) el.currentTime = seekTo.current;
    seekTo.current = 0;
  };

  const onPause = () => {
    setPlaying(false);
    const el = audio.current;
    if (el && track) savePosition(track, el.currentTime, el.duration || track.seconds);
  };

  const changeSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audio.current) audio.current.playbackRate = next;
  };

  const close = () => {
    audio.current?.pause();
    setTrack(null);
  };

  // Lock-screen and headphone controls on phones.
  useEffect(() => {
    if (!track || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: track.title, artist: track.showName, artwork: track.art ? [{ src: track.art }] : [] });
    navigator.mediaSession.setActionHandler("play", () => void audio.current?.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.current?.pause());
    navigator.mediaSession.setActionHandler("seekbackward", () => skip(-15));
    navigator.mediaSession.setActionHandler("seekforward", () => skip(30));
  }, [track, skip]);

  const value = useMemo(() => ({ track, playing, toggle, cue }), [track, playing, toggle, cue]);
  const shareLink = track ? absoluteUrl(`/listen/${track.showSlug}?e=${track.id}&t=${Math.floor(time)}`) : "";
  const shareText = track ? `Listen to this from ${clock(time)}: "${track.title}" on ${track.showName} ${shareLink}` : "";
  const button = "flex h-11 min-w-11 items-center justify-center rounded-full text-[14px] font-semibold text-white hover:bg-white/10";

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audio} preload="metadata" onLoadedMetadata={onMeta} onTimeUpdate={onTime} onPlay={() => setPlaying(true)} onPause={onPause} onError={() => track && setFailed(true)} />
      {track && (
        <>
          <div className="h-32" aria-hidden />
          <section aria-label="Audio player" className="fixed inset-x-0 bottom-0 z-[110] border-t border-white/10 bg-[#141a28] px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center gap-2 text-[12px] tabular-nums text-[#a1a1a6]">
                <span>{clock(time)}</span>
                <input
                  type="range"
                  aria-label="Position in episode"
                  min={0}
                  max={Math.max(duration, 1)}
                  value={Math.min(time, Math.max(duration, 1))}
                  onChange={(e) => {
                    if (audio.current) audio.current.currentTime = Number(e.target.value);
                    setTime(Number(e.target.value));
                  }}
                  className="h-6 min-w-0 flex-1 accent-[#ff8c14]"
                />
                <span>{clock(duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/listen/${track.showSlug}`} className="min-w-0 flex-1 pr-1">
                  <span className="block truncate text-[14px] font-semibold text-white">{track.title}</span>
                  <span className="block truncate text-[12px] text-[#a1a1a6]">{failed ? "This episode won't play here right now." : track.showName}</span>
                </Link>
                <button type="button" onClick={() => skip(-15)} aria-label="Back 15 seconds" className={button}>−15</button>
                <button type="button" onClick={() => toggle(track)} aria-label={playing ? "Pause" : "Play"} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff8c14] text-black">
                  {playing ? <FaPause aria-hidden /> : <FaPlay aria-hidden />}
                </button>
                <button type="button" onClick={() => skip(30)} aria-label="Forward 30 seconds" className={button}>+30</button>
                <button type="button" onClick={changeSpeed} aria-label={`Playback speed ${speed} times`} className={`${button} hidden sm:flex`}>{speed}×</button>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" aria-label="Share this moment on WhatsApp" className={`${button} hidden sm:flex`}><FaWhatsapp aria-hidden /></a>
                <button type="button" onClick={close} aria-label="Close player" className={button}><FaTimes aria-hidden /></button>
              </div>
            </div>
          </section>
        </>
      )}
    </PlayerContext.Provider>
  );
}
