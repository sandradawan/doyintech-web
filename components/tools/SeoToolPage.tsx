import Link from "next/link";
import Footer from "@/components/ui/Footer";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

export type Faq = { q: string; a: string };

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Layout for search-landing tool pages: H1 + intro, the tool, then server-rendered
 * guide content and FAQ (what Google reads), an upsell and the email signup.
 */
export default function SeoToolPage({
  h1,
  intro,
  jsonLd,
  tool,
  children,
  faqs,
  upsell,
  newsletterSource,
}: {
  h1: string;
  intro: string;
  jsonLd: object[];
  tool: React.ReactNode;
  children: React.ReactNode;
  faqs: Faq[];
  upsell: React.ReactNode;
  newsletterSource: string;
}) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/tools" className="text-[14px] text-[#ff8c14] hover:underline">
            ← All tools
          </Link>
          <h1 className="mt-4 text-[32px] font-semibold tracking-tight text-white sm:text-[40px]">{h1}</h1>
          <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#a1a1a6]">{intro}</p>

          <div className="mt-8">{tool}</div>

          <article className="mx-auto mt-16 max-w-3xl space-y-10 text-[15px] leading-relaxed text-[#c7cdd8]">
            {children}

            <section>
              <h2 className="text-[22px] font-semibold text-white">Frequently asked questions</h2>
              <dl className="mt-4 space-y-5">
                {faqs.map((f) => (
                  <div key={f.q}>
                    <dt className="font-semibold text-white">{f.q}</dt>
                    <dd className="mt-1">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#141a28] p-6">{upsell}</section>

            <section>
              <NewsletterSignup source={newsletterSource} />
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
