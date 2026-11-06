import { currentStreak, dayKey, nextStreak, type Streak } from "@/lib/kids/daily";
import type { ListedEpisode } from "./feeds";

/** Listening progress lives in this browser only, like the game streaks. */
const KEY = "dt-listen";
const KEEP = 20;

export type Track = { id: string; title: string; audio: string; art: string; showSlug: string; showName: string; seconds: number };
export type Saved = Track & { at: number; duration: number; updated: number };
export type ListenState = { positions: Record<string, Saved>; streak: Streak | null; listened: number };

export const toTrack = ({ episode: e, showSlug, showName, art }: ListedEpisode): Track => ({ id: e.id, title: e.title, audio: e.audio, art, showSlug, showName, seconds: e.seconds });

const EMPTY: ListenState = { positions: {}, streak: null, listened: 0 };

export function loadListen(): ListenState {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return EMPTY;
  }
}

function store(s: ListenState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode or full storage: progress just isn't kept */
  }
}

export function savePosition(track: Track, at: number, duration: number) {
  const s = loadListen();
  const positions = { ...s.positions };
  if (duration > 0 && at >= duration - 30) delete positions[track.id];
  else if (at >= 5) positions[track.id] = { ...track, at, duration, updated: Date.now() };
  const kept = Object.values(positions).sort((a, b) => b.updated - a.updated).slice(0, KEEP);
  store({ ...s, positions: Object.fromEntries(kept.map((p) => [p.id, p])) });
}

export function addListened(seconds: number) {
  const s = loadListen();
  store({ ...s, listened: s.listened + seconds, streak: nextStreak(s.streak, dayKey()) });
}

export const listenStreak = (s: ListenState) => currentStreak(s.streak, dayKey());

export function clock(total: number) {
  const t = Math.max(0, Math.floor(total));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = String(t % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}
