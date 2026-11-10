import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Compose from "@/components/community/Compose";
import PostList from "@/components/community/PostList";
import { RULES } from "@/lib/community/rules";
import { listPosts } from "@/lib/community/server";

export const revalidate = 60;

const TITLE = "Community: Ask Questions About Business, Money and Tech";
const DESCRIPTION = "A friendly place for Nigerian and African business owners, students, parents and creators to ask questions and share what they know. Free to join.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/community" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/community" },
};

export default async function Page() {
  const posts = await listPosts();

  return (
    <>
      <main className="min-h-screen bg-brand-deep pb-24 pt-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-[34px] font-black tracking-tight text-brand-ink sm:text-[44px]">DoyinTech Community</h1>
          <p className="mt-2 text-[17px] leading-relaxed text-brand-soft">Ask a question, share what you&apos;ve learned and help someone else. We check every post, so it stays useful and free of scams.</p>
          {posts && <a href="#ask" className="mt-4 inline-flex min-h-12 items-center rounded-full bg-brand-accent px-6 text-[15px] font-semibold text-black">Ask a question</a>}

          <section aria-labelledby="latest-heading" className="mt-8">
            <h2 id="latest-heading" className="text-[22px] font-semibold text-brand-ink">Latest questions</h2>
            {posts ? <PostList posts={posts} /> : <p className="mt-3 text-[15px] text-brand-soft">The community is opening soon. Please check back shortly.</p>}
          </section>

          {posts && (
            <section id="ask" aria-labelledby="ask-heading" className="mt-10 rounded-3xl border border-brand-ink/10 bg-brand-surface p-5">
              <h2 id="ask-heading" className="mb-3 text-[22px] font-semibold text-brand-ink">Ask a question</h2>
              <Compose />
            </section>
          )}

          <section aria-labelledby="rules-heading" className="mt-10 text-[15px] leading-relaxed text-brand-soft">
            <h2 id="rules-heading" className="text-[22px] font-semibold text-brand-ink">Community rules</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {RULES.map((r) => <li key={r}>{r}</li>)}
            </ul>
            <p className="mt-3">We may refuse or remove any post. To have your own post removed, use the contact page.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
