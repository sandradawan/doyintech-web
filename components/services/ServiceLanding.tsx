import Link from "next/link";
import type { ReactNode } from "react";
import Footer from "@/components/ui/Footer";
import AddonBuyButton from "@/components/services/AddonBuyButton";
import { getPayItem } from "@/lib/paystack-catalog";
import { getServiceAddon } from "@/lib/service-offers";
import { discoveryCallLink } from "@/lib/packages";
import { absoluteUrl } from "@/lib/site";

export type Faq = { q: string; a: string };

const naira = (kobo: number) => "₦" + Math.round(kobo / 100).toLocaleString("en-NG");

/**
 * Search landing page for a done-for-you service: problem → what we do → price with Paystack
 * checkout (live price from the catalog) → steps → FAQ. Used for CAC, Google Maps and email setup.
 */
export default async function ServiceLanding({
  path,
  eyebrow,
  h1,
  intro,
  addonId,
  steps,
  children,
  faqs,
  related,
}: {
  path: string;
  eyebrow: string;
  h1: string;
  intro: string;
  addonId: string;
  steps: string[];
  children: ReactNode;
  faqs: Faq[];
  related: [string, string][];
}) {
  const addon = getServiceAddon(addonId)!;
  const amountKobo = (await getPayItem(addonId))?.amountKobo ?? addon.amountKobo;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: addon.name,
      description: addon.blurb,
      provider: { "@type": "Organization", name: "DoyinTech", url: absoluteUrl("/") },
      areaServed: { "@type": "Country", name: "Nigeria" },
      url: absoluteUrl(path),
      offers: { "@type": "Offer", price: String(amountKobo / 100), priceCurrency: "NGN" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-brand-deep pb-24 pt-28">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-6">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand-link">{eyebrow}</p>
          <div className="mt-2 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-brand-ink sm:text-[42px]">{h1}</h1>
              <p className="mt-4 text-[17px] leading-relaxed text-brand-muted">{intro}</p>
              <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-brand-soft">{children}</div>
            </div>
            <aside className="h-fit rounded-2xl border border-brand-link/40 bg-brand-surface p-5 lg:sticky lg:top-24">
              <p className="text-[15px] font-semibold text-brand-ink">{addon.name}</p>
              <p className="mt-2 text-[34px] font-semibold text-brand-ink">{naira(amountKobo)}</p>
              <p className="text-[12px] text-brand-subtle">Fixed price · paid securely with Paystack</p>
              <ul className="mt-4 space-y-1.5">
                {addon.includes.map((x) => (
                  <li key={x} className="flex gap-2 text-[13px] text-brand-soft">
                    <span className="text-brand-link">✓</span> {x}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12px] text-brand-subtle">{addon.delivery}</p>
              <div className="mt-4">
                <AddonBuyButton id={addon.id} name={addon.name} price={naira(amountKobo)} />
              </div>
              <a
                href={discoveryCallLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center text-[13px] text-[#25D366] hover:underline"
              >
                Questions first? Chat on WhatsApp
              </a>
            </aside>
          </div>

          <section className="mt-14">
            <h2 className="text-[22px] font-semibold text-brand-ink">How it works</h2>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s} className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-4">
                  <span className="text-[12px] font-semibold text-brand-link">Step {i + 1}</span>
                  <p className="mt-1 text-[14px] text-brand-soft">{s}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14 max-w-3xl">
            <h2 className="text-[22px] font-semibold text-brand-ink">Questions</h2>
            <dl className="mt-4 space-y-5">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-[15px] font-semibold text-brand-ink">{f.q}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-brand-soft">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-14 rounded-2xl border border-brand-ink/10 bg-brand-surface p-6">
            <h2 className="text-[18px] font-semibold text-brand-ink">Next steps for your business</h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
              {related.map(([href, label]) => (
                <Link key={href} href={href} className="text-brand-link hover:underline">
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
