import type { Metadata } from "next";
import KidsShell, { SAFETY_FAQ } from "@/components/kids/KidsShell";
import DailyChallenge from "@/components/kids/DailyChallenge";

const TITLE = "Daily Maths & Word Challenge for Kids — New Puzzles Every Day";
const DESCRIPTION = "Free daily maths sums and word scrambles for children aged 5–13. Three levels, stars and a streak to keep them practising every day. No sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/kids/daily-challenge" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/kids/daily-challenge" },
};

const FAQS = [
  { q: "How often do the puzzles change?", a: "Every day at midnight on your device. Every child gets the same puzzles on the same day, so friends and classmates can compare scores." },
  { q: "Which level should my child pick?", a: "Starter (ages 5–7) is adding and taking away to 20 and three- or four-letter words. Explorer (8–10) adds times tables and division. Champion (11–13) covers bigger multiplication, percentages and longer words. Move up when they get 9 or 10 right three days in a row." },
  { q: "What is the streak?", a: "Playing on consecutive days builds a streak. Missing a day starts it again. Small daily practice is what builds fluency, and the streak makes it a habit." },
  SAFETY_FAQ,
];

export default function Page() {
  return (
    <KidsShell
      h1="Daily challenge"
      intro="Ten sums and five mixed-up words, new every day. Get them right, earn stars and keep your streak going!"
      tool={<DailyChallenge />}
      faqs={FAQS}
      appName="Daily maths and word challenge for kids"
      path="/kids/daily-challenge"
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Why ten minutes a day works</h2>
        <p className="mt-3">Children remember number facts and spellings best with short, regular practice rather than long sessions once a week. A daily puzzle that takes five to ten minutes, with a streak to protect, turns practice into a habit they ask for.</p>
        <p className="mt-3">Make it part of the routine: after breakfast at the weekend, or straight after homework on school days.</p>
      </section>
    </KidsShell>
  );
}
