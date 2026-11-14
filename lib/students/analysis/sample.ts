/** A realistic demo survey (Google Forms style) so students can try the tool before uploading their own. */

export const SAMPLE_TITLE = "Influence of Social Media Use on the Academic Performance of Undergraduate Students";

const LIKERT = ["Strongly Disagree", "Disagree", "Undecided", "Agree", "Strongly Agree"];

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Extent of social media use among students",
    items: [
      "I check social media several times during lectures",
      "I spend more than three hours daily on social media",
      "I use social media late into the night",
      "I find it hard to stay off social media while studying",
      "Social media is the first thing I check when I wake up",
    ],
  },
  {
    title: "Effect of social media on study habits",
    items: [
      "Social media reduces the time I spend reading",
      "I submit assignments late because of social media",
      "Social media distracts me when I prepare for exams",
      "I use social media to discuss course work with classmates",
      "My concentration in class has dropped because of social media",
    ],
  },
  {
    title: "Academic performance of students",
    items: [
      "My grades have dropped since I started using social media heavily",
      "I perform below my expectations in tests and exams",
      "I struggle to complete my reading before exams",
      "I often carry over courses",
      "My CGPA does not reflect my true ability",
    ],
  },
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function sampleCsv(): string {
  const r = rng(20261114);
  const pick = <T,>(xs: T[], ws: number[]) => {
    const t = ws.reduce((a, b) => a + b, 0);
    let x = r() * t;
    for (let i = 0; i < xs.length; i++) if ((x -= ws[i]) < 0) return xs[i];
    return xs[xs.length - 1];
  };
  const header = [
    "Timestamp",
    "Gender",
    "Age",
    "Level",
    "Faculty",
    "Hours spent on social media daily",
    ...SECTIONS.flatMap((s) => s.items.map((it) => `${s.title} [${it}]`)),
  ];
  const lines = [header];
  for (let i = 0; i < 120; i++) {
    const gender = pick(["Male", "Female"], [46, 54]);
    const age = pick(["16-20", "21-25", "26-30", "31 and above"], [30, 52, 13, 5]);
    const level = pick(["100", "200", "300", "400"], [20, 26, 28, 26]);
    const faculty = pick(["Sciences", "Social Sciences", "Arts", "Management Sciences", "Education"], [26, 22, 15, 21, 16]);
    const heavy = r() + (gender === "Female" ? 0.08 : 0) + (age === "16-20" ? 0.12 : 0);
    const hours = Math.max(1, Math.round(2 + heavy * 6 + r() * 2));
    const base = 2.4 + heavy * 2.1; // heavier users agree more
    const answer = (shift: number) => {
      const v = Math.round(base + shift + (r() - 0.5) * 2.2);
      return LIKERT[Math.min(5, Math.max(1, v)) - 1];
    };
    const day = 1 + (i % 28);
    lines.push([
      `2026/10/${String(day).padStart(2, "0")} 10:${String(i % 60).padStart(2, "0")}:00`,
      gender,
      age,
      level,
      faculty,
      String(hours),
      ...SECTIONS[0].items.map(() => answer(0.2)),
      ...SECTIONS[1].items.map((_, j) => answer(j === 3 ? 0.6 : 0)),
      ...SECTIONS[2].items.map(() => answer(-0.35)),
    ]);
  }
  return lines.map((row) => row.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(",")).join("\n");
}
