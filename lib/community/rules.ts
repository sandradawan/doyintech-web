/** Shared by the forms and the API, so both apply the same limits. */

export const TOPICS = ["Business", "Money", "Websites & tech", "Marketing", "Careers & students", "Parents & family", "General"] as const;
export type Topic = (typeof TOPICS)[number];

export const LIMITS = { name: [2, 40], title: [10, 140], body: [20, 4000], reply: [5, 2000], postsPerDay: 5, repliesPerDay: 20 } as const;

export const RULES = [
  "You must be 18 or over to post.",
  "Be kind. No insults, hate or harassment.",
  "No scams, investment schemes, loan offers or adverts.",
  "Don't share anyone's phone number, address, bank details or other private information, including your own.",
  "Answers are other members' opinions. For legal, tax, medical or investment decisions, ask a qualified professional.",
];

export type PublicPost = { id: number; display_name: string; topic: string; title: string; body: string; reply_count: number; created_at: string };
export type PublicReply = { id: number; display_name: string; body: string; created_at: string };

const RESERVED = /doyin\s*tech|admin|moderator|official|support/i;

/** Removes control characters. Line breaks are kept only where a field allows them. */
function clean(s: unknown, lines: boolean) {
  const text = String(s ?? "").replace(/\r\n?/g, "\n");
  const stripped = [...text].filter((c) => c === "\n" || c.charCodeAt(0) >= 32).join("");
  return lines ? stripped.replace(/\n{3,}/g, "\n\n").trim() : stripped.replace(/\s+/g, " ").trim();
}

function between(s: string, [min, max]: readonly [number, number]) {
  return s.length >= min && s.length <= max;
}

export function checkName(raw: unknown): { name: string } | { error: string } {
  const name = clean(raw, false);
  if (!between(name, LIMITS.name)) return { error: "Please use a display name of 2 to 40 characters." };
  if (RESERVED.test(name)) return { error: "Please choose a different display name." };
  return { name };
}

export function checkPost(input: { name?: unknown; topic?: unknown; title?: unknown; body?: unknown; adult?: unknown }) {
  const who = checkName(input.name);
  if ("error" in who) return who;
  const topic = String(input.topic ?? "");
  const title = clean(input.title, false);
  const body = clean(input.body, true);
  if (input.adult !== true) return { error: "Please confirm you are 18 or over and accept the rules." };
  if (!TOPICS.includes(topic as Topic)) return { error: "Please choose a topic." };
  if (!between(title, LIMITS.title)) return { error: "Your question should be 10 to 140 characters." };
  if (!between(body, LIMITS.body)) return { error: "Please add more detail: at least 20 characters, and at most 4,000." };
  return { name: who.name, topic, title, body };
}

export function checkReply(input: { name?: unknown; body?: unknown; adult?: unknown }) {
  const who = checkName(input.name);
  if ("error" in who) return who;
  const body = clean(input.body, true);
  if (input.adult !== true) return { error: "Please confirm you are 18 or over and accept the rules." };
  if (!between(body, LIMITS.reply)) return { error: "Your reply should be 5 to 2,000 characters." };
  return { name: who.name, body };
}

export function postPath(post: { id: number; title: string }) {
  const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/, "");
  return `/community/${post.id}${slug ? `-${slug}` : ""}`;
}

export function postIdFromSlug(slug: string) {
  const m = slug.match(/^(\d{1,15})(?:-|$)/);
  return m ? Number(m[1]) : null;
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
