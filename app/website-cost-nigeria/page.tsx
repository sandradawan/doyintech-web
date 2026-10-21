import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import WebsiteCalculator from "@/components/tools/WebsiteCalculator";
import { WEBSITE_TYPES } from "@/lib/tools/pricing";
import { naira as formatNgn } from "@/lib/tax/paye2026";
import { SERVICE_OFFERS } from "@/lib/service-offers";
import { PRIMARY_CTA } from "@/lib/cta";
import { absoluteUrl } from "@/lib/site";

const TITLE = "How Much Does a Website Cost in Nigeria? (2026 Price Guide)";
const DESCRIPTION =
  "Website prices in Nigeria for 2026: landing pages, business websites, e-commerce stores and web apps, what drives the cost, ongoing fees, and a free calculator for your exact project.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/website-cost-nigeria" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/website-cost-nigeria" },
};

// Fixed DoyinTech packages: the offer stores the 50% deposit, so the full price is double.
const PACKAGES = SERVICE_OFFERS.map((o) => ({
  name: o.name,
  totalNgn: (o.amountKobo * 2) / 100,
  depositNgn: o.amountKobo / 100,
}));

const range = (id: string) => {
  const t = WEBSITE_TYPES.find((w) => w.id === id);
  return t ? `${formatNgn(t.baseMin)} – ${formatNgn(t.baseMax)}` : "";
};

const FAQ = [
  {
    q: "How much does a website cost in Nigeria in 2026?",
    a: `Most small-business websites in Nigeria cost between ${range("landing")} for a one-page landing page and ${range(
      "business"
    )} for a multi-page business website. Online stores typically cost ${range("ecommerce")}, and custom web applications start around ${formatNgn(
      WEBSITE_TYPES.find((w) => w.id === "custom")?.baseMin ?? 800_000
    )}.`,
  },
  {
    q: "Why do website prices in Nigeria vary so much?",
    a: "Price depends on the number of pages, features such as online payments, booking or user accounts, whether content and copywriting are included, the quality of design, and who builds it. A template set up by a freelancer costs far less than a custom site with ongoing support from an agency.",
  },
  {
    q: "What ongoing costs come after the website is built?",
    a: "Expect yearly domain name and hosting renewals, plus maintenance: security updates, backups and content changes. Many businesses pay a monthly care plan so the site stays secure and keeps improving.",
  },
  {
    q: "How long does it take to build a website?",
    a: "A landing page usually takes 1–2 weeks and a standard business website 2–5 weeks. E-commerce sites and custom platforms take longer, typically 4–12 weeks, depending on features and how quickly content is ready.",
  },
  {
    q: "Should I pay the full amount upfront?",
    a: "No. A common and fair structure is a 50% deposit to start and the balance before final handover, with a written scope of what is included. Be wary of anyone who wants full payment before showing any work.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
  url: absoluteUrl("/website-cost-nigeria"),
};

export default function WebsiteCostNigeriaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            2026 price guide
          </p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-white sm:text-[40px]">
            How much does a website cost in Nigeria?
          </h1>
          <p className="mt-3 text-[17px] leading-relaxed text-[#a1a1a6]">
            Typical prices for each type of website, what pushes the cost up or down, and the
            ongoing fees nobody mentions — plus a calculator for your exact project.
          </p>

          <section className="mt-10">
            <h2 className="text-[22px] font-semibold text-white">Website prices in Nigeria at a glance</h2>
            <table className="mt-4 w-full overflow-hidden rounded-xl border border-white/10 text-left text-[14px] text-[#c7cdd8]">
              <thead className="bg-white/[0.05] text-white">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Type of website</th>
                  <th className="px-4 py-2.5 font-semibold">Typical price</th>
                  <th className="px-4 py-2.5 font-semibold">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {WEBSITE_TYPES.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2.5">{t.label}</td>
                    <td className="px-4 py-2.5">
                      {formatNgn(t.baseMin)} – {formatNgn(t.baseMax)}
                    </td>
                    <td className="px-4 py-2.5">
                      {t.weeks[0]}–{t.weeks[1]} weeks
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-[12px] text-[#86868b]">
              Ranges for professionally built sites before extra features. Your quote depends on
              scope.
            </p>
          </section>

          <section className="mt-10 rounded-2xl border border-[#ff8c14]/30 bg-[#141a28] p-6">
            <h2 className="text-[20px] font-semibold text-white">Our fixed prices</h2>
            <p className="mt-2 text-[14px] text-[#a1a1a6]">
              No vague quotes: pay a 50% deposit online to start, the balance before handover.
            </p>
            <ul className="mt-4 divide-y divide-white/10">
              {PACKAGES.map((p) => (
                <li key={p.name} className="flex items-baseline justify-between gap-4 py-2.5 text-[15px]">
                  <span className="text-white">{p.name}</span>
                  <span className="text-[#c7cdd8]">
                    {formatNgn(p.totalNgn)}{" "}
                    <span className="text-[12px] text-[#86868b]">({formatNgn(p.depositNgn)} deposit)</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={PRIMARY_CTA.href}
              className="mt-5 inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black"
            >
              {PRIMARY_CTA.label}
            </Link>
          </section>

          <section className="mt-12">
            <h2 className="text-[22px] font-semibold text-white">Calculate your website cost</h2>
            <p className="mt-2 text-[15px] text-[#a1a1a6]">
              Pick your business, website type and features to get an estimate and timeline.
            </p>
            <div className="mt-6">
              <WebsiteCalculator currency="NGN" />
            </div>
          </section>

          <article className="mt-14 space-y-10 text-[15px] leading-relaxed text-[#c7cdd8]">
            <section>
              <h2 className="text-[22px] font-semibold text-white">What drives the price</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li><strong className="text-white">Number of pages</strong> — each page needs design, content and testing.</li>
                <li><strong className="text-white">Features</strong> — online payments, booking, user accounts and dashboards add the most cost.</li>
                <li><strong className="text-white">Content</strong> — whether copywriting, product uploads and photos are included.</li>
                <li><strong className="text-white">Design</strong> — a customised template costs less than a fully bespoke design.</li>
                <li><strong className="text-white">Speed</strong> — rush timelines usually cost more.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[22px] font-semibold text-white">Ongoing costs after launch</h2>
              <p className="mt-3">
                Budget for yearly domain and hosting renewals, and for maintenance. Websites need
                security updates, backups and small content changes to keep working and bringing
                enquiries. Our{" "}
                <Link href="/care-plans" className="text-[#ff8c14] hover:underline">
                  website care plans
                </Link>{" "}
                cover this from ₦50,000/month.
              </p>
            </section>

            <section>
              <h2 className="text-[22px] font-semibold text-white">Frequently asked questions</h2>
              <dl className="mt-4 space-y-5">
                {FAQ.map((f) => (
                  <div key={f.q}>
                    <dt className="font-semibold text-white">{f.q}</dt>
                    <dd className="mt-1">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <h2 className="text-[20px] font-semibold text-white">Not sure what you need?</h2>
              <p className="mt-2 text-[14px] text-[#a1a1a6]">
                Send us your current site or idea and we&apos;ll reply with 2–3 specific
                recommendations, free.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link href={PRIMARY_CTA.href} className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
                  See packages
                </Link>
                <Link href="/free-audit" className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white">
                  Free website audit
                </Link>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
