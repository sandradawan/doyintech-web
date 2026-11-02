import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

/** Layout for the trivia pages: game first, then the host pack offer, other games and FAQs. */
export default function TriviaShell({ h1, intro, game, faqs, path, appName, children }: { h1: string; intro: string; game: React.ReactNode; faqs: Faq[]; path: string; appName: string; children?: React.ReactNode }) {
  const jsonLd = [
    faqJsonLd(faqs),
    { "@context": "https://schema.org", "@type": "WebApplication", name: appName, url: absoluteUrl(path), applicationCategory: "GameApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" } },
  ];
  const others = [
    { href: "/trivia", icon: "🧠", name: "Daily trivia" },
    { href: "/trivia/family-quiz-night", icon: "🎉", name: "Family quiz night" },
    { href: "/daily-quiz", icon: "💡", name: "Daily Money Quiz" },
    { href: "/kids", icon: "🧮", name: "Kids zone" },
  ].filter((o) => o.href !== path);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="text-[34px] font-black tracking-tight text-white sm:text-[44px]">{h1}</h1>
          <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-[#c7cdd8]">{intro}</p>
          <div className="mt-6">{game}</div>

          <nav aria-label="More games" className="mt-8 grid grid-cols-3 gap-3">
            {others.map((o) => (
              <Link key={o.href} href={o.href} className="rounded-2xl border border-white/10 bg-[#141a28] p-4 text-center hover:border-[#ff8c14]">
                <span className="text-[28px]" aria-hidden>{o.icon}</span>
                <span className="mt-1 block text-[14px] font-semibold text-white">{o.name}</span>
              </Link>
            ))}
          </nav>

          <article className="mx-auto mt-14 max-w-3xl space-y-10 text-[15px] leading-relaxed text-[#c7cdd8]">
            {children}
            <section className="rounded-3xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-6">
              <p className="t-eyebrow">Hosting a quiz?</p>
              <h2 className="mt-2 text-[22px] font-semibold text-white">Quiz Night Host Pack</h2>
              <p className="mt-2">Over 130 questions in ready-made rounds, answer sheets, a scorecard and a host script. Perfect for church socials, school events, office parties and family gatherings.</p>
              <Link href="/products/quiz-night-host-pack" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">Get the pack · ₦2,000</Link>
            </section>
            <section>
              <h2 className="text-[22px] font-semibold text-white">Questions</h2>
              <dl className="mt-4 space-y-5">
                {faqs.map((f) => (
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
