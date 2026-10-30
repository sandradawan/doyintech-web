import Link from "next/link";
import Footer from "@/components/ui/Footer";
import QuoteRequestForm from "@/components/services/QuoteRequestForm";
import { absoluteUrl } from "@/lib/site";

export type SolutionPage = {
  path: string;
  product: string; // lead product label
  eyebrow: string;
  h1: string;
  intro: string;
  modules: { title: string; items: string[] }[];
  outcomes: string[];
  pricing: string;
  prompts: string[];
  faqs: { q: string; a: string }[];
  related: [string, string][];
};

/** Landing page for custom systems (school, hotel, ecommerce): modules, outcomes, pricing note, quote form. */
export default function SolutionLanding({ page }: { page: SolutionPage }) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.product,
      description: page.intro,
      provider: { "@type": "Organization", name: "DoyinTech", url: absoluteUrl("/") },
      areaServed: { "@type": "Country", name: "Nigeria" },
      url: absoluteUrl(page.path),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">{page.eyebrow}</p>
          <div className="mt-2 grid gap-10 lg:grid-cols-[1fr_400px]">
            <div>
              <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-white sm:text-[44px]">{page.h1}</h1>
              <p className="mt-4 text-[17px] leading-relaxed text-[#a1a1a6]">{page.intro}</p>
              <ul className="mt-6 space-y-2">
                {page.outcomes.map((o) => (
                  <li key={o} className="flex gap-2 text-[15px] text-[#e8eaed]">
                    <span className="text-[#ff8c14]">✓</span> {o}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[14px] leading-relaxed text-[#c7cdd8]">{page.pricing}</p>
            </div>
            <div id="quote" className="scroll-mt-28">
              <QuoteRequestForm product={page.product} prompts={page.prompts} />
            </div>
          </div>

          <section className="mt-16">
            <h2 className="text-[24px] font-semibold text-white">What&apos;s included</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.modules.map((m) => (
                <div key={m.title} className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
                  <h3 className="text-[16px] font-semibold text-white">{m.title}</h3>
                  <ul className="mt-3 space-y-1.5 text-[14px] text-[#c7cdd8]">
                    {m.items.map((i) => (
                      <li key={i}>· {i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 max-w-3xl">
            <h2 className="text-[22px] font-semibold text-white">Questions</h2>
            <dl className="mt-4 space-y-5">
              {page.faqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-[15px] font-semibold text-white">{f.q}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#c7cdd8]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#141a28] p-6">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
              {page.related.map(([href, label]) => (
                <Link key={href} href={href} className="text-[#ff8c14] hover:underline">
                  {label}
                </Link>
              ))}
            </div>
            <a href="#quote" className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
              Get my quote
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
