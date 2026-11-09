import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import Compose from "@/components/community/Compose";
import ReportButton from "@/components/community/ReportButton";
import { postIdFromSlug, postPath, shortDate } from "@/lib/community/rules";
import { getPost } from "@/lib/community/server";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const id = postIdFromSlug(slug);
  return id ? getPost(id) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const thread = await load((await params).slug);
  if (!thread) return {};
  const { post } = thread;
  const path = postPath(post);
  return { title: `${post.title} — DoyinTech Community`, description: post.body.slice(0, 155), alternates: { canonical: path }, openGraph: { images: ["/opengraph-image"], title: post.title, description: post.body.slice(0, 155), url: path } };
}

export default async function Page({ params }: Props) {
  const thread = await load((await params).slug);
  if (!thread) notFound();
  const { post, replies } = thread;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    url: absoluteUrl(postPath(post)),
    mainEntity: {
      "@type": "Question",
      name: post.title,
      text: post.body,
      dateCreated: post.created_at,
      author: { "@type": "Person", name: post.display_name },
      answerCount: replies.length,
      suggestedAnswer: replies.map((r) => ({ "@type": "Answer", text: r.body, dateCreated: r.created_at, author: { "@type": "Person", name: r.display_name } })),
    },
  };

  return (
    <>
      {replies.length > 0 && (
        // Members write this text, so "<" is escaped to stop it closing the script tag.
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
      <main className="min-h-screen bg-brand-deep pb-24 pt-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/community" className="inline-flex min-h-11 items-center text-[14px] font-semibold text-[#ff8c14] hover:underline">← All questions</Link>
          <p className="mt-2 text-[13px] font-semibold text-[#ffb366]">{post.topic}</p>
          <h1 className="mt-1 text-[28px] font-black leading-tight tracking-tight text-white sm:text-[34px]">{post.title}</h1>
          <p className="mt-1 text-[13px] text-brand-muted">{post.display_name} · {shortDate(post.created_at)}</p>
          <p className="mt-4 whitespace-pre-line break-words text-[16px] leading-relaxed text-brand-soft">{post.body}</p>
          <ReportButton kind="post" id={post.id} />

          <section aria-labelledby="replies-heading" className="mt-8">
            <h2 id="replies-heading" className="text-[22px] font-semibold text-white">{replies.length} {replies.length === 1 ? "reply" : "replies"}</h2>
            <ul className="mt-3 space-y-3">
              {replies.map((r) => (
                <li key={r.id} className="rounded-2xl border border-white/10 bg-brand-surface p-4">
                  <p className="text-[13px] text-brand-muted">{r.display_name} · {shortDate(r.created_at)}</p>
                  <p className="mt-1 whitespace-pre-line break-words text-[15px] leading-relaxed text-brand-soft">{r.body}</p>
                  <ReportButton kind="reply" id={r.id} />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="reply-heading" className="mt-8 rounded-3xl border border-white/10 bg-brand-surface p-5">
            <h2 id="reply-heading" className="mb-3 text-[20px] font-semibold text-white">Add your reply</h2>
            <Compose postId={post.id} />
          </section>
          <p className="mt-6 text-[13px] text-brand-muted">Replies are members&apos; opinions, not professional advice.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
