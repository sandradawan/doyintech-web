import { dayKey, seeded } from "@/lib/kids/daily";
import { parseFeed, type Episode, type Feed } from "./rss";
import { SHOWS, type Show } from "./shows";

export type ShowFeed = { show: Show; feed: Feed | null };
export type ListedEpisode = { showSlug: string; showName: string; art: string; episode: Episode };

/** Reads one show's feed. Explicit episodes are left out because children use this site too. */
export async function loadFeed(show: Show, limit = 30): Promise<Feed | null> {
  try {
    const res = await fetch(show.feed, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(12000),
      headers: { "User-Agent": "DoyinTechListen/1.0 (+https://www.doyintech.com/listen)" },
    });
    if (!res.ok) return null;
    const feed = parseFeed(await res.text(), limit);
    const episodes = feed.episodes.filter((e) => !e.explicit);
    return episodes.length ? { ...feed, episodes } : null;
  } catch {
    return null;
  }
}

export const listed = (show: Show, feed: Feed, episode: Episode): ListedEpisode => ({
  showSlug: show.slug,
  showName: show.name,
  art: show.art || feed.image,
  episode,
});

export async function loadAllShows(): Promise<ShowFeed[]> {
  return Promise.all(SHOWS.map(async (show) => ({ show, feed: await loadFeed(show, 5) })));
}

/** The newest episode of each show, newest first, so one busy show can't fill the list. */
export function freshEpisodes(all: ShowFeed[], count = 10): ListedEpisode[] {
  return all
    .flatMap(({ show, feed }) => (feed ? [listed(show, feed, feed.episodes[0])] : []))
    .sort((a, b) => b.episode.date.localeCompare(a.episode.date))
    .slice(0, count);
}

/** One episode everyone sees today, skipping news because it dates quickly. */
export function todaysPick(all: ShowFeed[]): ListedEpisode | null {
  const pool = all.filter((s) => s.feed && s.show.category !== "News");
  if (!pool.length) return null;
  const { show, feed } = pool[Math.floor(seeded(`listen:${dayKey()}`)() * pool.length)];
  return feed ? listed(show, feed, feed.episodes[0]) : null;
}
