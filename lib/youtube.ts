export type YoutubeVideo = {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
  isShort?: boolean;
};

// Default: DoyinTech official channel (@doyintechfoundation)
// Override anytime with YOUTUBE_CHANNEL_ID env var
const CHANNEL_ID =
  process.env.YOUTUBE_CHANNEL_ID || "UCzZeP2RV2VuS2ymtoaealGQ";
const API_KEY = process.env.YOUTUBE_API_KEY || "";

/**
 * Parse YouTube Atom RSS feed (no API key required).
 * Works for both regular videos and Shorts.
 */
async function fetchFromRss(limit = 8): Promise<YoutubeVideo[]> {
  if (!CHANNEL_ID) return [];

  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
    {
      next: { revalidate: 3600 }, // cache 1 hour
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DoyinTechBot/1.0; +https://doyintech.vercel.app)",
      },
    }
  );

  if (!res.ok) return [];

  const xml = await res.text();

  // Extract <entry> blocks
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  const videos: YoutubeVideo[] = [];

  for (const entry of entries.slice(0, limit)) {
    const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
    const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
    const linkMatch = entry.match(/href="([^"]+)"/);

    if (!idMatch || !titleMatch) continue;

    const id = idMatch[1].trim();
    const title = titleMatch[1]
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    const link = linkMatch?.[1] || `https://www.youtube.com/watch?v=${id}`;
    const isShort =
      link.includes("/shorts/") ||
      /#shorts|\bshorts?\b/i.test(title);

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
}

/**
 * Optional: Use YouTube Data API v3 for better Shorts filtering.
 * Requires YOUTUBE_API_KEY in env.
 */
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
      { next: { revalidate: 3600 } }
    );
    if (!playlistRes.ok) return [];

    const playlistData = await playlistRes.json();
    const items = playlistData?.items || [];

    return items.map((item: any) => {
      const id = item.snippet?.resourceId?.videoId;
      const title = item.snippet?.title || "Untitled";
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
 * Main entry — prefers Data API when key is present, otherwise RSS.
 */
export async function getLatestYoutubeVideos(
  limit = 6
): Promise<YoutubeVideo[]> {
  if (!CHANNEL_ID) return [];

  if (API_KEY) {
    const apiVideos = await fetchFromApi(limit);
    if (apiVideos.length > 0) return apiVideos;
  }

  return fetchFromRss(limit);
}

export function getYoutubeChannelUrl(): string {
  return "https://www.youtube.com/@doyintechfoundation";
}
