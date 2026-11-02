import type { Metadata } from "next";
import KidsShell, { SAFETY_FAQ } from "@/components/kids/KidsShell";
import MemoryMatch from "@/components/kids/MemoryMatch";

const TITLE = "Memory Match Game for Kids — Find the Pairs (Free, No Download)";
const DESCRIPTION = "Free memory card game for children: find matching pairs of animals, fruits or space pictures. Three levels, stars and best scores. Works on phones.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/kids/memory-game" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/kids/memory-game" },
};

const FAQS = [
  { q: "How do you play?", a: "Tap two cards to turn them over. If they match, they stay face up. If not, they turn back. Find all the pairs in as few moves as you can." },
  { q: "What does it help with?", a: "Memory games build concentration, short-term memory and patience, and they are a calm break between homework and screen time." },
  { q: "Which level is right?", a: "Easy (6 pairs) suits ages 4–6, Medium (8 pairs) ages 6–9, and Hard (12 pairs) is a good challenge for older children and adults." },
  SAFETY_FAQ,
];

export default function Page() {
  return (
    <KidsShell
      h1="Memory match"
      intro="Turn over two cards at a time and find all the pairs. Fewer moves earns more stars!"
      tool={<MemoryMatch />}
      faqs={FAQS}
      appName="Memory match game for kids"
      path="/kids/memory-game"
    />
  );
}
