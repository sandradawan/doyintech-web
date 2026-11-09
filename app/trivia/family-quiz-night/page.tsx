import type { Metadata } from "next";
import TriviaShell from "@/components/trivia/TriviaShell";
import QuizNight from "@/components/trivia/QuizNight";

const TITLE = "Family Quiz Night: Free Pass-the-Phone Trivia Game";
const DESCRIPTION = "Play a quiz with family and friends on one phone: 2–6 players or teams, kids, family or expert level, and categories from Nigeria to science. Free, no app needed.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/trivia/family-quiz-night" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/trivia/family-quiz-night" },
};

const FAQS = [
  { q: "How do we play?", a: "Add 2 to 6 players or teams, pick a level and categories, then pass the phone around. Each person answers their own question against a 20-second clock. Fastest right answers score the most." },
  { q: "Can children play with adults?", a: "Yes. Choose the Kids level for easy questions only, or Family for a mix. Teams of one adult and one child work well." },
  { q: "Can we use a TV?", a: "Yes. Open this page on a laptop connected to the TV, or cast your phone screen, so everyone can see the questions." },
  { q: "Will the questions repeat?", a: "Not within a game. Each rematch deals a new random set, so a few may come round again over several games." },
];

export default function Page() {
  return (
    <TriviaShell
      h1="Family quiz night"
      intro="One phone, 2 to 6 players or teams, and questions for every age. Perfect after dinner, at parties or on long trips."
      game={<QuizNight />}
      faqs={FAQS}
      path="/trivia/family-quiz-night"
      appName="Family quiz night"
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Ideas for a great quiz night</h2>
        <p className="mt-3">Mix ages in each team so children and grandparents both get to answer. Give a small prize to the winner and a funny one for last place. Swap the phone holder each round, and keep snacks on the table: puff-puff and chin chin always help.</p>
      </section>
    </TriviaShell>
  );
}
