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
const API_KEY = process.env.YOUTUBE_API_KEY || "";

/**
 * Curated fallback — real videos from @doyintechfoundation.
 * Used when YouTube RSS/API is blocked from the server (common on Vercel).
 */
const FALLBACK_VIDEOS: YoutubeVideo[] = [
  {
    id: "sx0Yu3ijcTw",
    title: "DoyinTech portfolio Episode 5",
    published: "2026-08-19T13:38:10+00:00",
    thumbnail: "https://i.ytimg.com/vi/sx0Yu3ijcTw/hqdefault.jpg",
    url: "https://www.youtube.com/shorts/sx0Yu3ijcTw",
    isShort: true,
  },
  {
    id: "fX9xcouoibc",
    title: "You definitely need Website",
    published: "2026-08-14T18:24:37+00:00",
    thumbnail: "https://i.ytimg.com/vi/fX9xcouoibc/hqdefault.jpg",
    url: "https://www.youtube.com/shorts/fX9xcouoibc",
    isShort: true,
  },
  {
    id: "_R8BaFLLUKk",
    title: "How To Automate With AI",
    published: "2026-07-26T08:13:55+00:00",
    thumbnail: "https://i.ytimg.com/vi/_R8BaFLLUKk/hqdefault.jpg",
    url: "https://www.youtube.com/shorts/_R8BaFLLUKk",
    isShort: true,
  },
  {
    id: "gHzJHQ-9FIA",
    title: "Android & iOS Apps",
    published: "2026-07-06T21:41:36+00:00",
    thumbnail: "https://i.ytimg.com/vi/gHzJHQ-9FIA/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=gHzJHQ-9FIA",
    isShort: false,
  },
  {
    id: "4n4X2PRvwnI",
    title: "We Design all Ads",
    published: "2026-07-06T07:12:53+00:00",
    thumbnail: "https://i.ytimg.com/vi/4n4X2PRvwnI/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=4n4X2PRvwnI",
    isShort: false,
  },
  {
    id: "gHlW21NtaWQ",
    title: "Welcome to July — Productive, Progressive & Prosperous Month",
    published: "2026-07-01T09:02:48+00:00",
    thumbnail: "https://i.ytimg.com/vi/gHlW21NtaWQ/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=gHlW21NtaWQ",
    isShort: false,
  },
  {
    id: "Tc2zsEDE3SE",
    title: "June 2, 2026",
    published: "2026-06-02T22:44:18+00:00",
    thumbnail: "https://i.ytimg.com/vi/Tc2zsEDE3SE/hqdefault.jpg",
    url: "https://www.youtube.com/shorts/Tc2zsEDE3SE",
    isShort: true,
  },
  {
    id: "sLm8t9-5XTE",
    title: "Coding life moments",
    published: "2026-04-14T15:37:11+00:00",
    thumbnail: "https://i.ytimg.com/vi/sLm8t9-5XTE/hqdefault.jpg",
    url: "https://www.youtube.com/shorts/sLm8t9-5XTE",
    isShort: true,
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

async function fetchFromRss(limit = 8): Promise<YoutubeVideo[]> {
  if (!CHANNEL_ID) return [];

  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      {
        // Avoid caching empty/error responses for long
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
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const linkMatch = entry.match(/href="(https:\/\/www\.youtube\.com\/[^"]+)"/);

      if (!idMatch || !titleMatch) continue;

      const id = idMatch[1].trim();
      const title = decodeTitle(titleMatch[1]);
      const link =
        linkMatch?.[1] || `https://www.youtube.com/watch?v=${id}`;
      const isShort =
        link.includes("/shorts/") || /#shorts|\bshorts?\b/i.test(title);

      videos.push({
        id,
        title,
        published: publishedMatch?.[1] || "",
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        url: isShort
          ? `https://www.youtube.com/shorts/${id}`
          : `https://www.youtube.com/watch?v=${id}`,
        isShort,
      });
    }

    return videos;
  } catch {
    return [];
  }
}

async function fetchFromApi(limit = 8): Promise<YoutubeVideo[]> {
  if (!CHANNEL_ID || !API_KEY) return [];

  try {
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    );
    if (!channelRes.ok) return [];

    const channelData = await channelRes.json();
    const uploadsId =
      channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId) return [];

    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=${limit}&key=${API_KEY}`,
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

/**
 * Prefers live API → live RSS → curated fallback (always shows content).
 */
export async function getLatestYoutubeVideos(
  limit = 6
): Promise<YoutubeVideo[]> {
  if (API_KEY) {
    const apiVideos = await fetchFromApi(limit);
    if (apiVideos.length > 0) return apiVideos.slice(0, limit);
  }

  const rssVideos = await fetchFromRss(limit);
  if (rssVideos.length > 0) return rssVideos.slice(0, limit);

  // Vercel / some hosts block YouTube RSS — show real channel videos
  return FALLBACK_VIDEOS.slice(0, limit);
}

export function getYoutubeChannelUrl(): string {
  return "https://www.youtube.com/@doyintechfoundation";
}
