export type YoutubeVideo = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
  isShort?: boolean;
};

// DoyinTech official channel (@doyintechfoundation)
const CHANNEL_ID =
  process.env.YOUTUBE_CHANNEL_ID || "UCzZeP2RV2VuS2ymtoaealGQ";

/** Introduction To Web Development playlist */
const PLAYLIST_ID =
  process.env.YOUTUBE_PLAYLIST_ID || "PLb1kWUJelqlw";

const API_KEY = process.env.YOUTUBE_API_KEY || "";

/**
 * Curated fallback from playlist "Introduction To Web Development".
 * Used when YouTube RSS/API is blocked from the server.
 */
const FALLBACK_PLAYLIST: YoutubeVideo[] = [
  {
    id: "CTiMiM99wSE",
    title: "Introduction To Web Development",
    published: "2026-09-01T00:00:00+00:00",
    thumbnail: "https://i.ytimg.com/vi/CTiMiM99wSE/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=CTiMiM99wSE",
  },
  {
    id: "u7QxB-woWX0",
    title: "Day 2",
    published: "2026-09-02T00:00:00+00:00",
    thumbnail: "https://i.ytimg.com/vi/u7QxB-woWX0/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=u7QxB-woWX0",
  },
  {
    id: "uJ7dUicwQOU",
    title: "Day 3",
    published: "2026-09-03T00:00:00+00:00",
    thumbnail: "https://i.ytimg.com/vi/uJ7dUicwQOU/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=uJ7dUicwQOU",
  },
  {
    id: "Um0cfZB9Lmc",
    title: "Day 4",
    published: "2026-09-04T00:00:00+00:00",
    thumbnail: "https://i.ytimg.com/vi/Um0cfZB9Lmc/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=Um0cfZB9Lmc",
  },
  {
    id: "V2YAF2DrFyY",
    title: "Day 5",
    published: "2026-09-05T00:00:00+00:00",
    thumbnail: "https://i.ytimg.com/vi/V2YAF2DrFyY/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=V2YAF2DrFyY",
  },
  {
    id: "TLPVp39aS0E",
    title: "Day 6",
    published: "2026-09-06T00:00:00+00:00",
    thumbnail: "https://i.ytimg.com/vi/TLPVp39aS0E/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=TLPVp39aS0E",
  },
  {
    id: "9xBtaGI8uns",
    title: "Day 7",
    published: "2026-09-07T00:00:00+00:00",
    thumbnail: "https://i.ytimg.com/vi/9xBtaGI8uns/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=9xBtaGI8uns",
  },
  {
    id: "1A2nbj1-XBY",
    title: "Day 8",
    published: "2026-09-08T00:00:00+00:00",
    thumbnail: "https://i.ytimg.com/vi/1A2nbj1-XBY/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=1A2nbj1-XBY",
  },
  {
    id: "CVD8p-Wc-fY",
    title: "Day 9",
    published: "2026-09-09T00:00:00+00:00",
    thumbnail: "https://i.ytimg.com/vi/CVD8p-Wc-fY/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=CVD8p-Wc-fY",
  },
  {
    id: "Ts2VHzCyjfY",
    title: "Day 10",
    published: "2026-09-10T00:00:00+00:00",
    thumbnail: "https://i.ytimg.com/vi/Ts2VHzCyjfY/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=Ts2VHzCyjfY",
  },
];

function decodeTitle(raw: string): string {
  return raw
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function mapEntry(entry: string): YoutubeVideo | null {
  const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
  const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
  const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
  if (!idMatch || !titleMatch) return null;

  const id = idMatch[1].trim();
  const title = decodeTitle(titleMatch[1]);
  const isShort = /#shorts|\bshorts?\b/i.test(title);

  return {
    id,
    title,
    published: publishedMatch?.[1] || "",
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    url: isShort
      ? `https://www.youtube.com/shorts/${id}`
      : `https://www.youtube.com/watch?v=${id}`,
    isShort,
  };
}

async function fetchPlaylistFromRss(limit = 10): Promise<YoutubeVideo[]> {
  if (!PLAYLIST_ID) return [];
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`,
      {
        next: { revalidate: 1800 },
        headers: {
          Accept: "application/atom+xml, application/xml, text/xml, */*",
          "User-Agent":
            "Mozilla/5.0 (compatible; DoyinTechBot/1.0; +https://doyintech.vercel.app)",
        },
      }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    if (!xml.includes("<entry>")) return [];
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
    const videos: YoutubeVideo[] = [];
    for (const entry of entries.slice(0, limit)) {
      const v = mapEntry(entry);
      if (v) videos.push(v);
    }
    return videos;
  } catch {
    return [];
  }
}

async function fetchPlaylistFromApi(limit = 10): Promise<YoutubeVideo[]> {
  if (!PLAYLIST_ID || !API_KEY) return [];
  try {
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=${limit}&key=${API_KEY}`,
      { next: { revalidate: 1800 } }
    );
    if (!playlistRes.ok) return [];
    const playlistData = await playlistRes.json();
    const items = playlistData?.items || [];
    return items.map((item: any) => {
      const id = item.snippet?.resourceId?.videoId as string;
      const title = (item.snippet?.title as string) || "Untitled";
      const isShort = /#shorts|\bshorts?\b/i.test(title);
      return {
        id,
        title,
        published: item.snippet?.publishedAt || "",
        thumbnail:
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        url: isShort
          ? `https://www.youtube.com/shorts/${id}`
          : `https://www.youtube.com/watch?v=${id}`,
        isShort,
      } as YoutubeVideo;
    });
  } catch {
    return [];
  }
}

/** Latest videos from the configured playlist (default: Introduction To Web Development). */
export async function getPlaylistVideos(limit = 10): Promise<YoutubeVideo[]> {
  if (API_KEY) {
    const apiVideos = await fetchPlaylistFromApi(limit);
    if (apiVideos.length > 0) return apiVideos.slice(0, limit);
  }
  const rssVideos = await fetchPlaylistFromRss(limit);
  if (rssVideos.length > 0) return rssVideos.slice(0, limit);
  return FALLBACK_PLAYLIST.slice(0, limit);
}

/** Channel uploads (legacy helper). */
export async function getLatestYoutubeVideos(
  limit = 10
): Promise<YoutubeVideo[]> {
  return getPlaylistVideos(limit);
}

export function getYoutubeChannelUrl(): string {
  return "https://www.youtube.com/@doyintechfoundation";
}

export function getYoutubePlaylistUrl(): string {
  return `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;
}

export function getYoutubePlaylistTitle(): string {
  return "Introduction To Web Development";
}
