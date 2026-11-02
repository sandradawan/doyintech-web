import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import StreakBar from "@/components/kids/StreakBar";
import { KIDS_GAMES, ParentPacks } from "@/components/kids/KidsShell";
import { faqJsonLd } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Kids Zone — Free Learning Games, Daily Challenges and Worksheets";
const DESCRIPTION = "Free educational games for children aged 5–13: a daily maths and word challenge, times tables race, memory match and printable worksheets. Safe, no sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/kids" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/kids" },
};

const FAQS = [
  { q: "Is the Kids zone free?", a: "Yes. All the games, the daily challenge and the worksheet maker are free with no sign-up. We sell optional printable packs for parents." },
  { q: "Is it safe for children?", a: "There are no accounts, chats, adverts aimed at children or links to strangers. Scores, stars and streaks stay in this browser and are never sent to us." },
  { q: "What ages is it for?", a: "Ages 5 to 13. The daily challenge has Starter (5–7), Explorer (8–10) and Champion (11–13) levels." },
];

export default function KidsPage() {
  const jsonLd = [
    faqJsonLd(FAQS),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Free learning games for kids",
      itemListElement: KIDS_GAMES.map((g, i) => ({ "@type": "ListItem", position: i + 1, name: g.name, url: absoluteUrl(g.href) })),
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,140,20,0.25),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(74,222,128,0.15),transparent_45%)]" />
          <div className="relative mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16">
            <p className="text-[48px]" aria-hidden>🚀🧮🧠⭐</p>
            <h1 className="mt-2 text-[40px] font-black tracking-tight text-white sm:text-[56px]">Kids zone</h1>
            <p className="mx-auto mt-3 max-w-xl text-[18px] leading-relaxed text-[#c7cdd8]">Fun maths and word games, new puzzles every day, and stars to collect. Free and safe, no sign-up.</p>
            <div className="mt-5 flex justify-center"><StreakBar /></div>
            <Link href="/kids/daily-challenge" className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-full bg-[#ff8c14] px-8 text-[18px] font-black text-black shadow-lg shadow-[#ff8c14]/30 transition hover:scale-[1.03]">
              Play today&apos;s challenge <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="sr-only">Games</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {KIDS_GAMES.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className={`flex min-h-36 items-center gap-5 rounded-3xl bg-gradient-to-br ${g.color} p-6 text-black transition hover:scale-[1.02]`}>
                  <span className="text-[56px]" aria-hidden>{g.icon}</span>
                  <span>
                    <span className="block text-[22px] font-black">{g.name}</span>
                    <span className="mt-1 block text-[15px] font-medium text-black/75">{g.desc}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mx-auto mt-14 max-w-3xl space-y-10 px-4 text-[15px] leading-relaxed text-[#c7cdd8] sm:px-6">
          <ParentPacks />
          <section>
            <h2 className="text-[22px] font-semibold text-white">Questions from parents</h2>
            <dl className="mt-4 space-y-5">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="text-[16px] font-semibold text-white">{f.q}</dt>
                  <dd className="mt-1">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
