/**
 * Daily puzzles for the kids section. Everyone gets the same puzzle on the same day
 * (seeded by the date), so children can compare scores with friends and come back tomorrow.
 * Nothing is sent anywhere: progress lives in the browser.
 */

export type Level = "starter" | "explorer" | "champion";
export const LEVELS: { id: Level; label: string; ages: string }[] = [
  { id: "starter", label: "Starter", ages: "Ages 5–7" },
  { id: "explorer", label: "Explorer", ages: "Ages 8–10" },
  { id: "champion", label: "Champion", ages: "Ages 11–13" },
];

/** Local calendar date as yyyy-mm-dd. */
export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Deterministic random numbers in [0, 1) from a text seed (mulberry32 over a string hash). */
export function seeded(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (rnd: () => number, lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));

export type MathsQuestion = { text: string; answer: number };

/** One arithmetic question for a level. */
export function mathsQuestion(rnd: () => number, level: Level): MathsQuestion {
  const kind = Math.floor(rnd() * 4);
  if (level === "starter") {
    if (kind < 2) {
      const a = between(rnd, 1, 10), b = between(rnd, 1, 10);
      return { text: `${a} + ${b}`, answer: a + b };
    }
    const a = between(rnd, 5, 20), b = between(rnd, 1, a);
    return { text: `${a} − ${b}`, answer: a - b };
  }
  if (level === "explorer") {
    if (kind === 0) { const a = between(rnd, 10, 99), b = between(rnd, 10, 99); return { text: `${a} + ${b}`, answer: a + b }; }
    if (kind === 1) { const a = between(rnd, 30, 150), b = between(rnd, 5, a); return { text: `${a} − ${b}`, answer: a - b }; }
    if (kind === 2) { const a = between(rnd, 2, 12), b = between(rnd, 2, 12); return { text: `${a} × ${b}`, answer: a * b }; }
    const b = between(rnd, 2, 10), q = between(rnd, 2, 10);
    return { text: `${b * q} ÷ ${b}`, answer: q };
  }
  if (kind === 0) { const a = between(rnd, 12, 25), b = between(rnd, 3, 15); return { text: `${a} × ${b}`, answer: a * b }; }
  if (kind === 1) { const b = between(rnd, 3, 15), q = between(rnd, 6, 30); return { text: `${b * q} ÷ ${b}`, answer: q }; }
  if (kind === 2) { const p = [10, 20, 25, 50][between(rnd, 0, 3)], n = between(rnd, 1, 20) * 20; return { text: `${p}% of ${n}`, answer: (p * n) / 100 }; }
  const a = between(rnd, 2, 9), b = between(rnd, 2, 9), c = between(rnd, 1, 20);
  return { text: `${a} × ${b} + ${c}`, answer: a * b + c };
}

/** Today's ten maths questions for a level. */
export function dailyMaths(day: string, level: Level, count = 10): MathsQuestion[] {
  const rnd = seeded(`maths:${day}:${level}`);
  return Array.from({ length: count }, () => mathsQuestion(rnd, level));
}

/** Words by level and topic; the topic is the clue. */
export const WORDS: Record<Level, Record<string, string[]>> = {
  starter: {
    Animals: ["cat", "dog", "hen", "goat", "fish", "lion", "duck", "frog", "bear", "cow"],
    Food: ["rice", "egg", "bread", "yam", "milk", "cake", "bean", "corn", "pear", "jam"],
    Home: ["bed", "door", "cup", "lamp", "chair", "sofa", "bowl", "fan", "mat", "roof"],
    Nature: ["sun", "tree", "rain", "moon", "star", "leaf", "sand", "rock", "wind", "sea"],
    School: ["pen", "book", "desk", "bag", "map", "class", "ruler", "chalk", "test", "song"],
  },
  explorer: {
    Animals: ["rabbit", "monkey", "parrot", "turtle", "zebra", "giraffe", "eagle", "camel", "spider", "dolphin"],
    Food: ["banana", "orange", "pepper", "tomato", "carrot", "noodles", "mango", "plantain", "cereal", "biscuit"],
    Body: ["finger", "elbow", "shoulder", "ankle", "tongue", "stomach", "knee", "eyebrow", "thumb", "cheek"],
    Transport: ["bicycle", "train", "rocket", "canoe", "lorry", "airport", "engine", "station", "ferry", "tricycle"],
    Jobs: ["doctor", "farmer", "pilot", "teacher", "tailor", "nurse", "driver", "baker", "lawyer", "chef"],
  },
  champion: {
    Science: ["gravity", "molecule", "magnet", "oxygen", "volcano", "electric", "fossil", "climate", "nucleus", "habitat"],
    Geography: ["continent", "equator", "desert", "plateau", "harbour", "savannah", "capital", "island", "tropical", "glacier"],
    Maths: ["fraction", "triangle", "decimal", "perimeter", "diameter", "average", "quotient", "symmetry", "polygon", "estimate"],
    Technology: ["keyboard", "website", "internet", "software", "password", "robotics", "battery", "printer", "satellite", "download"],
    Feelings: ["grateful", "confident", "curious", "patient", "nervous", "generous", "cheerful", "honest", "jealous", "brave"],
  },
};

export type WordPuzzle = { word: string; scrambled: string; clue: string };

function scramble(rnd: () => number, word: string) {
  if (new Set(word).size < 2) return word;
  let out = word;
  while (out === word) {
    const a = word.split("");
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    out = a.join("");
  }
  return out;
}

/** Today's scrambled words for a level, each with its topic as a clue. */
export function dailyWords(day: string, level: Level, count = 5): WordPuzzle[] {
  const rnd = seeded(`words:${day}:${level}`);
  const pool = Object.entries(WORDS[level]).flatMap(([clue, words]) => words.map((word) => ({ word, clue })));
  const picked: WordPuzzle[] = [];
  const used = new Set<number>();
  while (picked.length < count && used.size < pool.length) {
    const i = Math.floor(rnd() * pool.length);
    if (used.has(i)) continue;
    used.add(i);
    picked.push({ ...pool[i], scrambled: scramble(rnd, pool[i].word) });
  }
  return picked;
}

export type Streak = { last: string; count: number; best: number };

/** Streak after playing on `today`: continues from yesterday, restarts after a gap, unchanged if already played. */
export function nextStreak(prev: Streak | null, today: string): Streak {
  if (!prev) return { last: today, count: 1, best: 1 };
  if (prev.last === today) return prev;
  const y = new Date(today + "T12:00:00");
  y.setDate(y.getDate() - 1);
  const count = prev.last === dayKey(y) ? prev.count + 1 : 1;
  return { last: today, count, best: Math.max(prev.best, count) };
}

/** Streak to show today: zero once a day has been missed. */
export function currentStreak(prev: Streak | null, today: string): number {
  if (!prev) return 0;
  if (prev.last === today) return prev.count;
  const y = new Date(today + "T12:00:00");
  y.setDate(y.getDate() - 1);
  return prev.last === dayKey(y) ? prev.count : 0;
}
