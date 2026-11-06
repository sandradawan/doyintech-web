/** Minimal podcast RSS reader. Feed text is untrusted: everything comes out as plain text or an https URL. */

export type Episode = {
  id: string;
  title: string;
  date: string;
  audio: string;
  seconds: number;
  summary: string;
  explicit: boolean;
  image: string;
};

export type Feed = { title: string; author: string; image: string; summary: string; link: string; explicit: boolean; episodes: Episode[] };

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decode(s: string) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] !== "#") return ENTITIES[e.toLowerCase()] ?? m;
    const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
  });
}

function unwrap(s: string) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}

/** Strips markup, including markup that was entity-escaped inside the feed. */
export function plainText(s: string) {
  const once = decode(unwrap(s));
  return decode(once.replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]*>/g, " "))
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(xml: string, name: string) {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
}

function attr(xml: string, name: string, key: string) {
  const el = xml.match(new RegExp(`<${name}\\s[^>]*>`, "i"));
  const m = el?.[0].match(new RegExp(`\\s${key}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[1] ?? m[2] ?? "") : "";
}

/** http links are upgraded because the site is https only; anything else is dropped. */
export function safeUrl(u: string) {
  const t = decode(unwrap(u)).trim();
  if (/^https:\/\//i.test(t)) return t;
  if (/^http:\/\//i.test(t)) return `https://${t.slice(7)}`;
  return "";
}

export function parseDuration(raw: string) {
  const t = plainText(raw);
  if (!t) return 0;
  if (!t.includes(":")) return Math.max(0, Math.floor(Number(t)) || 0);
  return t.split(":").reduce((a, p) => a * 60 + (Number(p) || 0), 0);
}

/** Short stable id for share links, from the episode's guid. */
export function episodeId(guid: string) {
  let h = 2166136261;
  for (let i = 0; i < guid.length; i++) {
    h ^= guid.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

const isYes = (s: string) => /^(yes|true|explicit)$/i.test(plainText(s));

function trimSummary(s: string, max = 320) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : max)}…`;
}

export function parseFeed(xml: string, limit = 30): Feed {
  const firstItem = xml.search(/<item[\s>]/i);
  const head = firstItem > 0 ? xml.slice(0, firstItem) : xml;
  const image = safeUrl(attr(head, "itunes:image", "href")) || safeUrl(tag(tag(head, "image"), "url"));
  const episodes: Episode[] = [];

  for (const m of xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)) {
    if (episodes.length >= limit) break;
    const it = m[0];
    const audio = safeUrl(attr(it, "enclosure", "url"));
    const type = attr(it, "enclosure", "type");
    if (!audio || (type && !type.startsWith("audio"))) continue;
    const time = Date.parse(plainText(tag(it, "pubDate")));
    episodes.push({
      id: episodeId(plainText(tag(it, "guid")) || audio),
      title: plainText(tag(it, "title")),
      date: Number.isNaN(time) ? "" : new Date(time).toISOString(),
      audio,
      seconds: parseDuration(tag(it, "itunes:duration")),
      summary: trimSummary(plainText(tag(it, "itunes:summary") || tag(it, "description"))),
      explicit: isYes(tag(it, "itunes:explicit")),
      image: safeUrl(attr(it, "itunes:image", "href")) || image,
    });
  }

  return {
    title: plainText(tag(head, "title")),
    author: plainText(tag(head, "itunes:author")),
    image,
    summary: trimSummary(plainText(tag(head, "itunes:summary") || tag(head, "description")), 500),
    link: safeUrl(tag(head, "link")),
    explicit: isYes(tag(head, "itunes:explicit")),
    episodes,
  };
}
