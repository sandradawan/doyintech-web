import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { faqJsonLd } from "@/components/tools/SeoToolPage";
import { VAT_COUNTRIES, VAT_REGIONS, vatHref } from "@/lib/global/vat-rates";
import { absoluteUrl } from "@/lib/site";

const TITLE = `VAT & GST Calculator by Country 2026 — Rates for ${VAT_COUNTRIES.length} Countries`;
const DESCRIPTION = `Free VAT and GST calculators for ${VAT_COUNTRIES.length} countries: UK, EU, Africa, India, Australia, Canada, the Gulf and Latin America. Add or remove tax at the current rates and invoice in the local currency.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/vat-calculator" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/vat-calculator" },
};

const FAQS = [
  { q: "Which country has the highest VAT rate?", a: "Hungary, at 27%. Several Nordic countries and Croatia charge 25%, and Finland 25.5%." },
  { q: "What is the difference between VAT and GST?", a: "They work the same way: a tax on consumption charged at each stage of supply, with businesses reclaiming the tax they paid on inputs. Australia, New Zealand, Singapore, India and Canada call it GST; the UK, EU, Africa and the Gulf call it VAT." },
  { q: "How do I remove VAT from a price?", a: "Divide the VAT-inclusive price by 1 plus the rate. At 20%, divide by 1.2: £120 including VAT is £100 net and £20 VAT." },
];

export default function VatHub() {
  const jsonLd = [
    faqJsonLd(FAQS),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "VAT and GST calculators by country",
      itemListElement: VAT_COUNTRIES.map((v, i) => ({ "@type": "ListItem", position: i + 1, name: `${v.country} ${v.tax} calculator`, url: absoluteUrl(vatHref(v)) })),
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-black pb-16 pt-24">
        <header className="mx-auto max-w-[760px] px-6 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">{VAT_COUNTRIES.length} countries · free · no sign-up</p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">VAT and GST calculator for every country</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#c7cdd8]">Pick your country to add or remove tax at the current rates, then invoice your customer in the local currency.</p>
        </header>

        <div className="mx-auto mt-10 max-w-[1100px] space-y-10 px-6">
          {VAT_REGIONS.map((region) => (
            <section key={region}>
              <h2 className="text-[20px] font-semibold text-white">{region}</h2>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {VAT_COUNTRIES.filter((v) => v.region === region).map((v) => (
                  <li key={v.slug}>
                    <Link href={vatHref(v)} className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#141a28] px-4 text-[14px] text-white hover:border-[#ff8c14]">
                      <span>{v.country}</span>
                      <span className="text-[13px] text-[#a1a1a6]">{v.tax} {v.standard}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mx-auto mt-14 max-w-[760px] px-6">
          <div className="rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/5 p-6">
            <h2 className="text-[20px] font-semibold text-white">Invoice in any currency</h2>
            <p className="mt-2 text-[15px] text-[#c7cdd8]">The free invoice generator handles VAT or GST, 30+ currencies and a clean PDF, with your logo on the branded upgrade.</p>
            <Link href="/tools/invoice-generator" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-6 text-[14px] font-semibold text-black">Make an invoice</Link>
          </div>
          <h2 className="mt-12 text-[24px] font-semibold text-white">Questions</h2>
          <dl className="mt-4 space-y-5">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="text-[16px] font-semibold text-white">{f.q}</dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-[#c7cdd8]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
