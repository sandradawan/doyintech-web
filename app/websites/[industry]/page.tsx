import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { INDUSTRIES, getIndustry } from "@/lib/industries";
import { getServiceOffer } from "@/lib/service-offers";
import { WEBSITE_TYPES } from "@/lib/tools/pricing";
import { naira } from "@/lib/tax/paye2026";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/cta";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ industry: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params;
  const i = getIndustry(industry);
  if (!i) return {};
  const path = `/websites/${i.slug}`;
  return {
    title: i.seoTitle,
    description: i.seoDescription,
    alternates: { canonical: path },
    openGraph: { title: i.seoTitle, description: i.seoDescription, url: path },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { industry } = await params;
  const i = getIndustry(industry);
  if (!i) notFound();

  const offer = getServiceOffer(i.packageId);
  // Offers store the 50% deposit in kobo; the full fixed price is double.
  const packagePrice = offer ? (offer.amountKobo * 2) / 100 : null;
  const full = WEBSITE_TYPES.find((w) => w.id === i.fullBuildTypeId);
  const others = INDUSTRIES.filter((x) => x.slug !== i.slug);
  const url = absoluteUrl(`/websites/${i.slug}`);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: i.h1,
      serviceType: "Website design",
      areaServed: { "@type": "Country", name: "Nigeria" },
      provider: { "@type": "Organization", name: "DoyinTech", url: absoluteUrl("/") },
      url,
      ...(packagePrice
        ? { offers: { "@type": "Offer", price: String(packagePrice), priceCurrency: "NGN", url: absoluteUrl("/hire") } }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: i.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Websites", item: absoluteUrl("/websites") },
        { "@type": "ListItem", position: 2, name: i.name, item: url },
      ],
    },
  ];

  const included = i.features.filter((f) => !f.addOn);
  const addOns = i.features.filter((f) => f.addOn);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-3xl px-6">
          <nav aria-label="Breadcrumb" className="text-[13px] text-[#86868b]">
            <Link href="/websites" className="hover:text-white">
              Websites
            </Link>{" "}
            / <span className="text-[#c7cdd8]">{i.name}</span>
          </nav>

          <h1 className="mt-4 text-[32px] font-semibold tracking-tight text-white sm:text-[42px]">{i.h1}</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#a1a1a6]">{i.intro}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={PRIMARY_CTA.href}
              className="inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[15px] font-semibold text-black hover:brightness-110"
            >
              {PRIMARY_CTA.label}
            </Link>
            <Link
              href={SECONDARY_CTA.href}
              className="inline-flex rounded-full border border-white/20 px-6 py-3 text-[15px] font-semibold text-white hover:border-white/40"
            >
              {SECONDARY_CTA.label}
            </Link>
          </div>
          {packagePrice && (
            <p className="mt-3 text-[13px] text-[#86868b]">
              From {naira(packagePrice)} fixed · 50% deposit · {offer?.timeline}
            </p>
          )}

          <section className="mt-14">
            <h2 className="text-[22px] font-semibold text-white">The problem we fix</h2>
            <ul className="mt-4 space-y-3">
              {i.problems.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-[#c7cdd8]">
                  <span className="mt-1 text-[#ff8c14]" aria-hidden>
                    ✕
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="text-[22px] font-semibold text-white">What your website includes</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {included.map((f) => (
                <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-[15px] font-semibold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[#a1a1a6]">{f.why}</p>
                </div>
              ))}
            </div>
            {addOns.length > 0 && (
              <>
                <h3 className="mt-8 text-[16px] font-semibold text-white">Add when you&apos;re ready</h3>
                <ul className="mt-3 space-y-2">
                  {addOns.map((f) => (
                    <li key={f.title} className="text-[14px] leading-relaxed text-[#c7cdd8]">
                      <strong className="text-white">{f.title}</strong> — {f.why}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className="mt-14 rounded-2xl border border-[#ff8c14]/30 bg-[#141a28] p-6">
            <h2 className="text-[20px] font-semibold text-white">Price</h2>
            {offer && packagePrice && (
              <div className="mt-4">
                <p className="text-[15px] text-white">
                  <strong>{offer.name}</strong> — {naira(packagePrice)} fixed
                </p>
                <p className="mt-1 text-[14px] text-[#a1a1a6]">{i.packageReason}</p>
                <p className="mt-1 text-[13px] text-[#86868b]">
                  {naira(packagePrice / 2)} deposit to start · {offer.timeline}
                </p>
              </div>
            )}
            {full && (
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[15px] text-white">
                  <strong>{i.fullBuildLabel}</strong> — typically {naira(full.baseMin)} – {naira(full.baseMax)}
                </p>
                <p className="mt-1 text-[13px] text-[#86868b]">
                  Custom quote · {full.weeks[0]}–{full.weeks[1]} weeks
                </p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={PRIMARY_CTA.href} className="inline-flex rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
                Start with a deposit
              </Link>
              <Link href="/website-cost-nigeria" className="inline-flex rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white">
                Estimate a custom build
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-[#86868b]">
              Keep it secure and up to date after launch with a{" "}
              <Link href="/care-plans" className="text-[#ff8c14] hover:underline">
                care plan
              </Link>
              .
            </p>
          </section>

          {(i.caseStudy || i.guide) && (
            <section className="mt-14">
              <h2 className="text-[22px] font-semibold text-white">See it in practice</h2>
              <ul className="mt-4 space-y-2 text-[15px]">
                {i.caseStudy && (
                  <li>
                    <Link href={i.caseStudy.href} className="text-[#ff8c14] hover:underline">
                      Case study: {i.caseStudy.label} →
                    </Link>
                  </li>
                )}
                {i.guide && (
                  <li>
                    <Link href={i.guide.href} className="text-[#ff8c14] hover:underline">
                      {i.guide.label} →
                    </Link>
                  </li>
                )}
              </ul>
            </section>
          )}

          <section className="mt-14">
            <h2 className="text-[22px] font-semibold text-white">Questions</h2>
            <dl className="mt-4 space-y-5">
              {i.faqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-[15px] font-semibold text-white">{f.q}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#c7cdd8]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <h2 className="text-[20px] font-semibold text-white">Ready for a website that brings enquiries?</h2>
            <p className="mt-2 text-[14px] text-[#a1a1a6]">
              Fixed price, 50% deposit online, and a site you can share within weeks.
            </p>
            <Link
              href={PRIMARY_CTA.href}
              className="mt-5 inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[15px] font-semibold text-black"
            >
              {PRIMARY_CTA.label}
            </Link>
          </section>

          <section className="mt-14">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[#86868b]">Other industries</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/websites/${o.slug}`}
                    className="inline-flex rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white hover:border-[#ff8c14]/50"
                  >
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
