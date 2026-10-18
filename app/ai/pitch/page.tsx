import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import PitchGenerator from "@/components/ai/PitchGenerator";

export const metadata: Metadata = {
  title: "AI Pitch Deck Generator — Animated 16:9 slides",
  description:
    "Generate a cinematic, boardroom-ready pitch deck with animated transitions, professional typography, and a live website screenshot of your product.",
};

export default function PitchPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-6">
          <p className="text-[13px] text-[#a1a1a6]">
            <Link href="/" className="text-[#2997ff] hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/ai" className="text-[#2997ff] hover:underline">
              AI Tools
            </Link>{" "}
            / Pitch deck
          </p>
          <p className="section-eyebrow mt-4">SME · Cinematic pitch</p>
          <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[42px]">
            Animated pitch decks that explain — and persuade
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Seven 16:9 slides with motion transitions, boardroom typography, brand
            color, numbered insight cards, and a live product screenshot. Built for
            founders who need clarity that feels premium.
          </p>
          <PitchGenerator />
        </div>
      </main>
      <Footer />
    </>
  );
}
