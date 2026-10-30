import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { CITIES, getCity } from "@/lib/cities";
import { SERVICE_OFFERS } from "@/lib/service-offers";
import { discoveryCallLink } from "@/lib/packages";
import { absoluteUrl } from "@/lib/site";

const naira = (kobo: number) => "₦" + Math.round(kobo / 100).toLocaleString("en-NG");
/** Packages are sold as a 50% deposit; the full price is twice the deposit. */
const packages = SERVICE_OFFERS.map((o) => ({ name: o.name, total: naira(o.amountKobo * 2), timeline: o.timeline }));

const SHARED_FAQS = [
  {
    q: "How much does a website cost?",
    a: `Our fixed prices start at ${packages[0]?.total} for a landing page and ${packages[1]?.total} for a full business website. You pay 50% to start and 50% when you're happy. See the full breakdown on our website cost guide.`,
  },
  {
    q: "How long does it take?",
    a: "Most landing pages go live in 5–10 days and business websites in 7–14 days after we receive your content and deposit.",
  },
  {
    q: "Will customers find me on Google?",
    a: "Every site includes basic SEO: page titles, descriptions, a sitemap and fast loading. For local searches we also recommend setting up your Google Business Profile, which we can do for you.",
  },
];

export function cityMetadata(slug: string): Metadata {
  const c = getCity(slug)!;
  const title = `Web Design ${c.name} — Fixed-price websites for ${c.name} businesses`;
  const description = `Website design for businesses in ${c.name}, ${c.state}. Fixed prices from ${packages[0]?.total}, WhatsApp and Paystack built in, live in days. Free website audit.`;
  return {
    title,
    description,
    alternates: { canonical: `/web-design-${c.slug}` },
    openGraph: { title, description, url: `/web-design-${c.slug}` },
  };
}

/** Shared layout for /web-design-<city> pages. */
export default function CityWebDesign({ slug }: { slug: string }) {
  const c = getCity(slug)!;
  const faqs = [...c.faqs, ...SHARED_FAQS];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Web design in ${c.name}`,
      serviceType: "Website design and development",
      provider: { "@type": "Organization", name: "DoyinTech", url: absoluteUrl("/") },
      areaServed: { "@type": "City", name: c.name, containedInPlace: { "@type": "State", name: c.state } },
      url: absoluteUrl(`/web-design-${c.slug}`),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  const others = [...CITIES.filter((o) => o.slug !== c.slug).map((o) => [o.slug, o.name]), ["jos", "Jos"], ["abuja", "Abuja"]];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-[900px] px-5 sm:px-6">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">
            {c.name} · {c.state}
          </p>
          <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-tight text-white sm:text-[42px]">{c.headline}</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#a1a1a6]">{c.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/hire" className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black">
              See packages and prices
            </Link>
            <Link href="/free-audit" className="rounded-full border border-white/20 px-6 py-3 text-[14px] font-semibold text-white">
              Free website audit
            </Link>
            <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 text-[14px] font-semibold text-white">
              Chat on WhatsApp
            </a>
          </div>

          <section className="mt-14 grid gap-4 sm:grid-cols-3">
            {packages.map((p) => (
              <div key={p.name} className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
                <p className="text-[14px] font-semibold text-white">{p.name}</p>
                <p className="mt-2 text-[26px] font-semibold text-white">{p.total}</p>
                <p className="mt-1 text-[12px] text-[#86868b]">50% deposit · {p.timeline}</p>
              </div>
            ))}
          </section>

          <section className="mt-14">
            <h2 className="text-[24px] font-semibold text-white">{c.angle.title}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-[#c7cdd8]">{c.angle.body}</p>
          </section>

          <section className="mt-12 grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-[18px] font-semibold text-white">Who we build for in {c.name}</h2>
              <ul className="mt-3 space-y-2 text-[15px] text-[#c7cdd8]">
                {c.businesses.map((b) => (
                  <li key={b}>✓ {b}</li>
                ))}
              </ul>
              <Link href="/websites" className="mt-3 inline-block text-[14px] text-[#ff8c14] hover:underline">
                Websites by industry →
              </Link>
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-white">Areas we serve</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#c7cdd8]">
                {c.areas.join(", ")} and everywhere else in {c.name}. Projects run over WhatsApp and video calls, so location never slows us down.
              </p>
              <h2 className="mt-6 text-[18px] font-semibold text-white">Every site includes</h2>
              <ul className="mt-3 space-y-2 text-[15px] text-[#c7cdd8]">
                <li>✓ Mobile-first design that loads fast on data</li>
                <li>✓ WhatsApp chat and enquiry buttons</li>
                <li>✓ Paystack payments where you need them</li>
                <li>✓ Basic SEO so Google can find you</li>
              </ul>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-[22px] font-semibold text-white">Questions from {c.name} businesses</h2>
            <dl className="mt-4 space-y-5">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-[15px] font-semibold text-white">{f.q}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#c7cdd8]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-14 rounded-2xl border border-white/10 bg-[#141a28] p-6">
            <h2 className="text-[18px] font-semibold text-white">Also useful</h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
              <Link href="/google-business-profile-setup" className="text-[#ff8c14] hover:underline">
                Get on Google Maps
              </Link>
              <Link href="/business-name-registration-nigeria" className="text-[#ff8c14] hover:underline">
                Register your business name
              </Link>
              <Link href="/business-email-domain-nigeria" className="text-[#ff8c14] hover:underline">
                Domain and business email
              </Link>
              <Link href="/website-cost-nigeria" className="text-[#ff8c14] hover:underline">
                What a website costs in 2026
              </Link>
            </div>
            <p className="mt-5 text-[13px] text-[#86868b]">
              Web design in other cities:{" "}
              {others.map(([s, n], i) => (
                <span key={s}>
                  <Link href={`/web-design-${s}`} className="hover:text-white hover:underline">
                    {n}
                  </Link>
                  {i < others.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
