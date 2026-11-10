import type { Metadata } from "next";
import TriviaShell from "@/components/trivia/TriviaShell";
import DailyTrivia from "@/components/trivia/DailyTrivia";
import { CATEGORIES } from "@/lib/trivia/bank";

const TITLE = "Daily Trivia Quiz: 10 Questions on Nigeria, Africa and the World";
const DESCRIPTION = "Free daily general knowledge quiz for all ages: Nigeria, Africa and the world, science, animals, food, sport, languages and history. Beat the clock and keep your streak.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/trivia" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/trivia" },
};

const FAQS = [
  { q: "When do the questions change?", a: "Every day at midnight on your device. Everyone gets the same ten questions on the same day, so you can compare scores with friends and family." },
  { q: "How are points scored?", a: "100 points for each right answer, plus up to 50 more for answering quickly. Each question has 20 seconds. Only your first try each day counts towards your best score." },
  { q: "Who is it for?", a: "Everyone. The first questions are easy enough for children, and the last ones will test quiz fans. For a group, try family quiz night." },
  { q: "Do I need an account?", a: "No. Your streak and best score are saved in this browser only." },
];

export default function Page() {
  return (
    <TriviaShell
      h1="Daily trivia"
      intro="Ten questions a day on Nigeria, Africa and the world. Easy to hard, 20 seconds each. How many can you get?"
      game={<DailyTrivia />}
      faqs={FAQS}
      path="/trivia"
      appName="DoyinTech Daily Trivia"
    >
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">What&apos;s in the quiz</h2>
        <p className="mt-3">Questions come from {CATEGORIES.length} categories: {CATEGORIES.join(", ")}. Every answer comes with a short fact, so even a wrong answer teaches you something.</p>
      </section>
    </TriviaShell>
  );
}
