import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import {
  EbookBuyPanel,
  EbookCover,
  EbookGatedReader,
} from "@/components/ebooks/EbookShop";
import { formatEbookPrice } from "@/lib/ebooks";
import { ALL_EBOOKS, findAnyEbook } from "@/lib/ebooks-catalog";
import { publicEbook } from "@/lib/shop/public";
import { absoluteUrl } from "@/lib/site";
import { EBOOK_SEO } from "@/lib/ebooks-seo";
import RelatedLinks from "@/components/ui/RelatedLinks";

type Props = { params: Promise<{ slug: string }> };

const EBOOK_TOOLS: Record<string, { href: string; label: string }[]> = {
  Business: [{ href: "/tools/business-plan-generator", label: "Business plan generator" }, { href: "/tools/invoice-generator-nigeria", label: "Invoice generator in naira" }, { href: "/tools/business-name-generator", label: "Business name generator" }],
  Finance: [{ href: "/tools/paye-calculator-nigeria", label: "PAYE calculator Nigeria" }, { href: "/tools/savings-goal-tracker", label: "Savings goal tracker" }, { href: "/tools/loan-emi-calculator", label: "Loan calculator" }],
  Wealth: [{ href: "/tools/savings-goal-tracker", label: "Savings goal tracker" }, { href: "/tools/loan-emi-calculator", label: "Loan calculator" }, { href: "/tools/paye-calculator-nigeria", label: "PAYE calculator Nigeria" }],
  Marketing: [{ href: "/tools/whatsapp-link-generator", label: "WhatsApp link generator" }, { href: "/tools/qr-generator", label: "QR code generator" }, { href: "/tools/meta-tag-generator", label: "SEO meta tag generator" }],
  Sales: [{ href: "/tools/quotation-generator-nigeria", label: "Quotation generator" }, { href: "/tools/discount-calculator", label: "Discount calculator" }, { href: "/tools/profit-margin-calculator", label: "Profit margin calculator" }],
  Freelancing: [{ href: "/tools/freelance-rate-calculator", label: "Freelance rate calculator" }, { href: "/tools/freelancer-tax-calculator-nigeria", label: "Freelancer tax calculator" }, { href: "/tools/invoice-generator-nigeria", label: "Invoice generator in naira" }],
  Career: [{ href: "/tools/cv-builder", label: "Free CV builder" }, { href: "/tools/cover-letter", label: "Cover letter generator" }, { href: "/tools/letter-generator", label: "Letter generator" }],
  Income: [{ href: "/tools/freelance-rate-calculator", label: "Freelance rate calculator" }, { href: "/tools/whatsapp-link-generator", label: "WhatsApp link generator" }, { href: "/tools/invoice-generator-nigeria", label: "Invoice generator in naira" }],
  Education: [{ href: "/tools/cgpa-calculator", label: "CGPA calculator" }, { href: "/tools/study-timetable-planner", label: "Study timetable planner" }, { href: "/students/citations", label: "Citation generator" }],
  Security: [{ href: "/tools/sme-security-checklist", label: "Small business security checklist" }, { href: "/tools/password-generator", label: "Strong password generator" }, { href: "/tools/breach-hygiene", label: "What to do after a data breach" }],
  Productivity: [{ href: "/tools/pomodoro-timer", label: "Pomodoro focus timer" }, { href: "/tools/daily-checklist", label: "Daily checklist" }, { href: "/tools/meeting-cost-calculator", label: "Meeting cost calculator" }],
  "AI & Productivity": [{ href: "/tools/ai-usecase", label: "AI use-case finder" }, { href: "/tools/pomodoro-timer", label: "Pomodoro focus timer" }, { href: "/tools/daily-checklist", label: "Daily checklist" }],
  Fitness: [{ href: "/tools/daily-checklist", label: "Daily checklist" }, { href: "/tools/countdown-timer", label: "Countdown timer" }, { href: "/tools/pomodoro-timer", label: "Pomodoro timer" }],
  Food: [{ href: "/tools/savings-goal-tracker", label: "Savings goal tracker" }, { href: "/tools/percentage-calculator", label: "Percentage calculator" }, { href: "/tools/daily-checklist", label: "Daily checklist" }],
  Culture: [{ href: "/community", label: "DoyinTech Community" }, { href: "/listen", label: "Listen to African podcasts" }, { href: "/trivia", label: "Daily trivia quiz" }],
};

export function generateStaticParams() {
  return ALL_EBOOKS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = findAnyEbook(slug);
  if (!book) return { title: "Ebook" };
  const seo = EBOOK_SEO[book.slug];
  const title = seo?.title ?? `${book.title} (PDF Ebook)`;
  const description = seo?.description ?? book.blurb.slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/ebooks/${book.slug}` },
    openGraph: { title, description, url: `/ebooks/${book.slug}`, images: [book.coverImage] },
  };
}

export default async function EbookDetailPage({ params }: Props) {
  const { slug } = await params;
  const found = findAnyEbook(slug);
  if (!found) notFound();
  const book = publicEbook(found);
  const url = absoluteUrl(`/ebooks/${book.slug}`);
  // Same category first, then the next books in the catalogue, so every book is linked from others.
  const here = ALL_EBOOKS.findIndex((e) => e.slug === book.slug);
  const ring = [...ALL_EBOOKS.slice(here + 1), ...ALL_EBOOKS.slice(0, here)];
  const related = [...ring.slice(0, 3), ...ring.slice(3).filter((e) => e.category === book.category), ...ring.slice(3)]
    .filter((e, i, all) => all.indexOf(e) === i)
    .slice(0, 6)
    .map((e) => ({ href: `/ebooks/${e.slug}`, label: e.title }));
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": ["Book", "Product"],
      name: book.title,
      alternativeHeadline: book.subtitle,
      description: book.blurb,
      author: { "@type": "Organization", name: book.author },
      publisher: { "@type": "Organization", name: "DoyinTech Press" },
      bookFormat: "https://schema.org/EBook",
      inLanguage: "en-NG",
      genre: book.category,
      image: absoluteUrl(book.coverImage),
      url,
      offers: { "@type": "Offer", price: String(book.priceNgn), priceCurrency: "NGN", availability: book.onSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ebooks", item: absoluteUrl("/ebooks") },
        { "@type": "ListItem", position: 2, name: book.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-brand-deep pb-24 pt-24">
        <div className="mx-auto max-w-[980px] px-6">
          <Link href="/ebooks" className="text-[14px] text-brand-link hover:underline">
            ← All ebooks
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
            <div className="flex justify-center lg:justify-start">
              <EbookCover book={book} size="lg" />
            </div>
            <div>
              {book.badge && (
                <span className="rounded-full bg-brand-link/15 px-2.5 py-1 text-[11px] font-semibold text-brand-link">
                  {book.badge}
                </span>
              )}
              <h1 className="mt-3 text-[30px] font-semibold tracking-tight text-brand-ink sm:text-[36px]">
                {book.title}
              </h1>
              <p className="mt-2 text-[16px] text-brand-muted">{book.subtitle}</p>
              <p className="mt-3 text-[13px] text-brand-subtle">
                {book.author} · {book.pagesLabel} · {book.category}
                {book.onSale && <> · {formatEbookPrice(book.priceNgn)}</>}
              </p>
              <p className="mt-6 text-[15px] leading-relaxed text-brand-soft">{book.blurb}</p>
              <ul className="mt-6 space-y-2">
                {book.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-[14px] text-brand-ink">
                    <span className="text-brand-link">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              {found.chapters.length > 0 && (
                <section aria-labelledby="contents-heading" className="mb-10">
                  <h2 id="contents-heading" className="text-[22px] font-semibold text-brand-ink">What&apos;s inside</h2>
                  <ol className="mt-3 space-y-1.5 text-[15px] text-brand-soft">
                    {found.chapters.map((ch) => <li key={ch.title}>{ch.title}</li>)}
                  </ol>
                </section>
              )}
              <h2 className="text-[13px] font-semibold uppercase tracking-wide text-brand-subtle">
                Read a sample
              </h2>
              <div className="mt-4">
                <EbookGatedReader book={book} />
              </div>
            </div>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <EbookBuyPanel book={book} />
            </div>
          </div>
          <RelatedLinks heading="You may also like" links={related} />
          <RelatedLinks heading="Free tools that go with this book" links={EBOOK_TOOLS[book.category] ?? EBOOK_TOOLS.Business} />
        </div>
      </main>
      <Footer />
    </>
  );
}
