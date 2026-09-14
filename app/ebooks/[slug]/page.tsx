import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import {
  EbookBuyPanel,
  EbookCover,
  EbookGatedReader,
} from "@/components/ebooks/EbookShop";
import { EBOOKS, getEbook, formatEbookPrice } from "@/lib/ebooks";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EBOOKS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = getEbook(slug);
  if (!book) return { title: "Ebook" };
  return {
    title: `${book.title} · Ebook`,
    description: book.blurb,
  };
}

export default async function EbookDetailPage({ params }: Props) {
  const { slug } = await params;
  const book = getEbook(slug);
  if (!book) notFound();

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[980px] px-6">
          <Link href="/ebooks" className="text-[14px] text-[#ff8c14] hover:underline">
            ← All ebooks
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
            <div className="flex justify-center lg:justify-start">
              <EbookCover book={book} size="lg" />
            </div>
            <div>
              {book.badge && (
                <span className="rounded-full bg-[#ff8c14]/15 px-2.5 py-1 text-[11px] font-semibold text-[#ff8c14]">
                  {book.badge}
                </span>
              )}
              <h1 className="mt-3 text-[30px] font-semibold tracking-tight text-white sm:text-[36px]">
                {book.title}
              </h1>
              <p className="mt-2 text-[16px] text-[#a1a1a6]">{book.subtitle}</p>
              <p className="mt-3 text-[13px] text-[#86868b]">
                {book.author} · {book.pagesLabel} · {book.category} ·{" "}
                {formatEbookPrice(book.priceNgn)}
              </p>
              <p className="mt-6 text-[15px] leading-relaxed text-[#c7cdd8]">{book.blurb}</p>
              <ul className="mt-6 space-y-2">
                {book.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-[14px] text-white">
                    <span className="text-[#ff8c14]">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[#86868b]">
                Inside the ebook
              </h2>
              <div className="mt-4">
                <EbookGatedReader book={book} />
              </div>
            </div>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <EbookBuyPanel book={book} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
