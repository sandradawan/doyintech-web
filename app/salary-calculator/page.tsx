import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { faqJsonLd } from "@/components/tools/SeoToolPage";
import { SALARY_COUNTRIES } from "@/lib/global/salary";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Salary Calculator by Country 2026: Take-Home Pay After Tax";
const DESCRIPTION = "Free take-home pay calculators for the UK, US, Canada, Ireland, India, Australia, South Africa, Kenya and Nigeria. See your pay after tax.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/salary-calculator" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/salary-calculator" },
};

const FAQS = [
  { q: "What is take-home pay?", a: "Your salary after income tax and the contributions your employer deducts, such as National Insurance, Social Security or pension and health levies. It is the amount paid into your bank account." },
  { q: "Why is my payslip different?", a: "Payslips can also include pension, student loan, health insurance or other deductions, and your tax code or allowances may differ. Each calculator lists exactly what it includes." },
];

const COUNTRIES = [
  ...SALARY_COUNTRIES.map((c) => ({ href: `/salary-calculator/${c.slug}`, name: c.country, year: c.taxYear })),
  { href: "/tools/paye-calculator-nigeria", name: "Nigeria", year: "2026" },
];

export default function SalaryHub() {
  const jsonLd = [
    faqJsonLd(FAQS),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Salary calculators by country",
      itemListElement: COUNTRIES.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `${c.name} salary calculator`, url: absoluteUrl(c.href) })),
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-brand-deep pb-16 pt-24">
        <header className="mx-auto max-w-[760px] px-6 text-center">
          <p className="t-eyebrow">Free · no sign-up</p>
          <h1 className="t-h1 mt-3 text-white">Salary calculator: take-home pay after tax</h1>
          <p className="t-lead mx-auto mt-4 max-w-[600px]">Pick your country to see your income tax, contributions and net pay for 2026, by year, month and week.</p>
        </header>
        <ul className="mx-auto mt-10 grid max-w-[900px] gap-3 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTRIES.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-brand-surface px-5 text-white hover:border-[#ff8c14]">
                <span className="text-[16px] font-semibold">{c.name}</span>
                <span className="text-[13px] text-brand-muted">{c.year}</span>
              </Link>
            </li>
          ))}
        </ul>
        <section className="mx-auto mt-14 max-w-[760px] px-6">
          <h2 className="t-h3 text-white">Questions</h2>
          <dl className="mt-4 space-y-5">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="text-[16px] font-semibold text-white">{f.q}</dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-brand-soft">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
