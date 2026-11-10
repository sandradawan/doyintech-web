import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import EpisodeList from "@/components/listen/EpisodeList";
import { listed, loadFeed } from "@/lib/listen/feeds";
import { showBySlug } from "@/lib/listen/shows";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

/** Pages are built on first visit, so one slow feed can't hold up a deploy. */
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const show = showBySlug((await params).slug);
  if (!show) return {};
  const title = `${show.name} — Listen Free Online`;
  const path = `/listen/${show.slug}`;
  return { title, description: `${show.blurb} Listen free in your browser on DoyinTech Listen, no app needed.`, alternates: { canonical: path }, openGraph: { images: ["/opengraph-image"], title, description: show.blurb, url: path } };
}

export default async function Page({ params }: Props) {
  const show = showBySlug((await params).slug);
  if (!show) notFound();
  const feed = await loadFeed(show);
  const art = show.art || feed?.image;
  const jsonLd = { "@context": "https://schema.org", "@type": "PodcastSeries", name: show.name, description: show.blurb, url: absoluteUrl(`/listen/${show.slug}`), webFeed: show.feed };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-brand-deep pb-24 pt-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link href="/listen" className="inline-flex min-h-11 items-center text-[14px] font-semibold text-brand-link hover:underline">← All shows</Link>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
            {art && (
              // eslint-disable-next-line @next/next/no-img-element -- cover art comes from each show's own host
              <img src={art} alt={`${show.name} podcast artwork`} width={140} height={140} className="h-[140px] w-[140px] rounded-2xl object-cover" />
            )}
            <div className="min-w-0">
              <p className="t-eyebrow">{show.category}</p>
              <h1 className="mt-1 text-[30px] font-black tracking-tight text-brand-ink sm:text-[38px]">{show.name}</h1>
              <p className="mt-1 text-[16px] text-brand-soft">{show.blurb}</p>
              {feed?.author && <p className="mt-1 text-[14px] text-brand-muted">By {feed.author}</p>}
            </div>
          </div>

          <section aria-label="Episodes" className="mt-8">
            {feed ? (
              <EpisodeList items={feed.episodes.map((e) => listed(show, feed, e))} openShared />
            ) : (
              <p className="text-[15px] text-brand-soft">We can&apos;t load this show&apos;s episodes right now. Please try again soon.</p>
            )}
          </section>
          {feed?.link && (
            <p className="mt-6 text-[14px] text-brand-muted">
              Episodes belong to their creators. <a href={feed.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-link hover:underline">Visit the show&apos;s website</a>
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
