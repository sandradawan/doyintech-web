import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import PitchGenerator from "@/components/ai/PitchGenerator";

export const metadata: Metadata = {
  title: "SME Pitch Deck Generator",
  description:
    "Turn your project description and product URL into a professional pitch deck with a live website screenshot.",
};

export default function PitchPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
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
          <p className="section-eyebrow mt-4">SME · Pitch</p>
          <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[42px]">
            Pitch deck with live product snapshot
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Describe your project, paste a public URL, and get a six-slide pitch
            structure plus a real screenshot of your site when capture succeeds.
          </p>
          <PitchGenerator />
        </div>
      </main>
      <Footer />
    </>
  );
}
