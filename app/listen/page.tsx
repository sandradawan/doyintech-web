import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { faqJsonLd } from "@/components/tools/SeoToolPage";
import ContinueListening from "@/components/listen/ContinueListening";
import EpisodeList, { PlayButton } from "@/components/listen/EpisodeList";
import SubmitShowForm from "@/components/listen/SubmitShowForm";
import { freshEpisodes, loadAllShows, todaysPick } from "@/lib/listen/feeds";
import { toTrack } from "@/lib/listen/progress";
import { SHOW_CATEGORIES } from "@/lib/listen/shows";

export const revalidate = 3600;

const TITLE = "Listen to Nigerian and African Podcasts Free Online";
const DESCRIPTION = "Listen free to podcasts on business, money, tech and news, plus African stories for children. No app or account needed, it plays in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/listen" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/listen" },
};

const FAQS = [
  { q: "Is it free?", a: "Yes. You don't need an app or an account. Your data provider may charge for the data you use, so use Wi-Fi for long episodes if you can." },
  { q: "Where do the episodes come from?", a: "Each show publishes its episodes in a public podcast feed. We play them from the show's own host, so every listen still counts for the creator." },
  { q: "Is it safe for children?", a: "We leave out episodes marked explicit. Shows in Kids & family are made for children, but other shows are made for adults, so please listen with younger children." },
  { q: "Will it remember where I stopped?", a: "Yes, in this browser. Your place and listening streak stay on this device and are not sent to us." },
  { q: "My show is listed and I want it removed.", a: "Use the contact page and we'll take it down." },
];

export default async function Page() {
  const all = await loadAllShows();
  const pick = todaysPick(all);
  const fresh = freshEpisodes(all);
  const live = all.filter((s) => s.feed);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="text-[34px] font-black tracking-tight text-white sm:text-[44px]">DoyinTech Listen</h1>
          <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-[#c7cdd8]">Podcasts on business, money, tech and ideas, plus African stories for children. Press play: no app needed.</p>

          {pick && (
            <section aria-labelledby="pick-heading" className="mt-6 flex flex-col gap-4 rounded-3xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-5 sm:flex-row sm:items-center">
              {pick.art && (
                // eslint-disable-next-line @next/next/no-img-element -- cover art comes from each show's own host
                <img src={pick.art} alt={`${pick.showName} podcast artwork`} width={120} height={120} className="h-[120px] w-[120px] rounded-2xl object-cover" />
              )}
              <div className="min-w-0">
                <p id="pick-heading" className="t-eyebrow">Today&apos;s pick</p>
                <h2 className="mt-1 text-[20px] font-semibold leading-snug text-white">{pick.episode.title}</h2>
                <Link href={`/listen/${pick.showSlug}`} className="text-[14px] text-[#ffb366] hover:underline">{pick.showName}</Link>
                <div className="mt-3"><PlayButton track={toTrack(pick)} label="Play today's pick" /></div>
              </div>
            </section>
          )}

          <ContinueListening />

          {fresh.length > 0 ? (
            <section aria-labelledby="fresh-heading" className="mt-10">
              <h2 id="fresh-heading" className="text-[22px] font-semibold text-white">New episodes</h2>
              <EpisodeList items={fresh} showNames />
            </section>
          ) : (
            <p className="mt-8 text-[15px] text-[#c7cdd8]">We can&apos;t load new episodes right now. Please check back soon.</p>
          )}

          {SHOW_CATEGORIES.map((cat) => {
            const shows = live.filter((s) => s.show.category === cat);
            if (!shows.length) return null;
            return (
              <section key={cat} aria-label={cat} className="mt-10">
                <h2 className="text-[22px] font-semibold text-white">{cat}</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {shows.map(({ show, feed }) => (
                    <Link key={show.slug} href={`/listen/${show.slug}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141a28] p-3 hover:border-[#ff8c14]">
                      {/* eslint-disable-next-line @next/next/no-img-element -- cover art comes from each show's own host */}
                      <img src={show.art || feed?.image} alt={`${show.name} podcast artwork`} width={72} height={72} loading="lazy" className="h-[72px] w-[72px] shrink-0 rounded-xl object-cover" />
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-white">{show.name}</span>
                        <span className="mt-0.5 block text-[14px] leading-snug text-[#a1a1a6]">{show.blurb}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          <article className="mx-auto mt-14 max-w-3xl space-y-10 text-[15px] leading-relaxed text-[#c7cdd8]">
            <section className="rounded-3xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-6">
              <p className="t-eyebrow">Want your own show?</p>
              <h2 className="mt-2 text-[22px] font-semibold text-white">Podcast Starter Kit</h2>
              <p className="mt-2">Plan, record and publish your first episodes with a phone: show planner, episode scripts, a guest message, a launch checklist and ways to earn from your show.</p>
              <Link href="/products/podcast-starter-kit" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">Get the kit · ₦3,000</Link>
            </section>
            <section id="submit">
              <h2 className="text-[22px] font-semibold text-white">Get your podcast on Listen</h2>
              <p className="mb-4 mt-2">Run a podcast, or know a great one? Tell us about it. We listen to every show before adding it, and listings are free. Want more listeners? Ask about a paid featured spot.</p>
              <SubmitShowForm />
            </section>
            <section>
              <h2 className="text-[22px] font-semibold text-white">Questions</h2>
              <dl className="mt-4 space-y-5">
                {FAQS.map((f) => (
                  <div key={f.q}>
                    <dt className="text-[16px] font-semibold text-white">{f.q}</dt>
                    <dd className="mt-1">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
