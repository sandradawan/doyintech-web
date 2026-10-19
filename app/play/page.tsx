import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import SignalRunnerGame from "@/components/game/SignalRunnerGame";

export const metadata: Metadata = {
  title: "Signal Runner — Play offline while you wait",
  description:
    "Play DoyinTech Signal Runner when the network is slow. Jump, dodge lag, collect packets. Cached for offline use so Chrome does not replace it with the dinosaur game.",
  alternates: { canonical: "/play" },
};

export default function PlayPage() {
  return (
    <>
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Home
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
            Signal Runner
          </h1>
          <p className="mt-3 text-gray-400">
            Network acting up? Play our game — not Chrome's dinosaur. This page is saved on your
            device after you open it once online. Music is built-in (or add{" "}
            <code className="text-gray-300">game-bg.mp3</code>). High score stays on this device.
          </p>
          <p className="mt-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
            Offline tip: visit this page while connected, wait a few seconds, then you can open{" "}
            <strong>/play</strong> again with no network and Signal Runner still loads.
          </p>
          <div className="mt-8">
            <SignalRunnerGame />
          </div>
          <section className="mt-12 rounded-3xl border border-white/10 bg-black/30 p-6">
            <h2 className="font-display text-xl font-bold text-white">Come back tools</h2>
            <p className="mt-2 text-sm text-gray-400">
              Bookmark free tools that save on this device — focus timer, checklist, savings goal,
              and more.
            </p>
            <Link href="/tools" className="mt-4 inline-block text-sm text-primary hover:underline">
              Browse all tools →
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
