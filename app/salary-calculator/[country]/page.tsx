import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import SalaryCalculator from "@/components/tools/SalaryCalculator";
import { SALARY_COUNTRIES, getSalaryCountry, type SalaryCountry } from "@/lib/global/salary";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SALARY_COUNTRIES.map((c) => ({ country: c.slug }));
}

type Params = { params: Promise<{ country: string }> };

const money = (c: SalaryCountry, n: number) =>
  new Intl.NumberFormat(c.locale, { style: "currency", currency: c.currency, maximumFractionDigits: 0 }).format(n);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getSalaryCountry((await params).country);
  if (!c) return {};
  const title = `${c.short} Salary Calculator ${c.taxYear}: Net Take-Home Pay After Tax`;
  const r = c.calc(c.example);
  const description = `Free ${c.country} take-home pay calculator for ${c.taxYear}. On ${money(c, c.example)} a year you take home ${money(c, r.net)} (${money(c, r.net / 12)} a month). See every deduction, yearly and monthly.`;
  const url = `/salary-calculator/${c.slug}`;
  return { title, description, alternates: { canonical: url }, openGraph: { images: ["/opengraph-image"], title, description, url } };
}

export default async function SalaryCountryPage({ params }: Params) {
  const c = getSalaryCountry((await params).country);
  if (!c) notFound();

  const r = c.calc(c.example);
  const levels = [0.5, 1, 1.5, 2, 3].map((k) => Math.round((c.example * k) / 1000) * 1000);
  const others = SALARY_COUNTRIES.filter((x) => x.slug !== c.slug);

  const faqs = [
    { q: `How much is ${money(c, c.example)} a year after tax in ${c.country}?`, a: `About ${money(c, r.net)} a year, or ${money(c, r.net / 12)} a month, for the ${c.taxYear} tax year. Deductions: ${r.lines.map((l) => `${l.label} ${money(c, l.amount)}`).join(", ")}.` },
    { q: "What does this calculator include?", a: `It includes ${c.covers}.` },
    { q: "What does it leave out?", a: `It leaves out ${c.excludes}. Check your payslip or ${c.authority} for your exact figures.` },
    { q: "Is it free?", a: "Yes. It runs in your browser with no sign-up and nothing is stored." },
  ];

  const jsonLd = [
    faqJsonLd(faqs),
    { "@context": "https://schema.org", "@type": "WebApplication", name: `${c.short} salary calculator ${c.taxYear}`, url: absoluteUrl(`/salary-calculator/${c.slug}`), applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Salary calculators", item: absoluteUrl("/salary-calculator") },
        { "@type": "ListItem", position: 2, name: c.country, item: absoluteUrl(`/salary-calculator/${c.slug}`) },
      ],
    },
  ];

  return (
    <SeoToolPage
      h1={`${c.short} salary calculator ${c.taxYear}: take-home pay after tax`}
      intro={`Enter your gross salary to see what you take home in ${c.country} each year, month and week, with every deduction listed.`}
      jsonLd={jsonLd}
      tool={<SalaryCalculator slug={c.slug} />}
      faqs={faqs}
      newsletterSource={`salary-${c.slug}`}
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-brand-ink">Earn more on the side</h2>
          <p className="mt-2 text-[14px] text-brand-muted">Open a free online shop, send invoices in {c.currency} and get paid by link.</p>
          <Link href="/stores" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">Open a free shop</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">Take-home pay at common salaries ({c.taxYear})</h2>
        <table className="mt-4 w-full text-left text-[15px]">
          <thead>
            <tr className="border-b border-brand-ink/10 text-brand-muted"><th className="py-2 font-medium">Gross a year</th><th className="py-2 font-medium">Take-home a year</th><th className="py-2 font-medium">Take-home a month</th></tr>
          </thead>
          <tbody>
            {levels.map((g) => {
              const n = c.calc(g).net;
              return (
                <tr key={g} className="border-b border-brand-ink/5"><td className="py-2 text-brand-ink">{money(c, g)}</td><td className="py-2">{money(c, n)}</td><td className="py-2">{money(c, n / 12)}</td></tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-3">Figures cover {c.covers}. They leave out {c.excludes}.</p>
      </section>
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">Other countries</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}><Link href={`/salary-calculator/${o.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-brand-ink/15 px-4 text-[13px] text-brand-ink hover:border-brand-link">{o.country}</Link></li>
          ))}
          <li><Link href="/tools/paye-calculator-nigeria" className="inline-flex min-h-10 items-center rounded-full border border-brand-ink/15 px-4 text-[13px] text-brand-ink hover:border-brand-link">Nigeria (PAYE)</Link></li>
          <li><Link href="/salary-calculator" className="inline-flex min-h-10 items-center rounded-full border border-brand-ink/15 px-4 text-[13px] text-brand-link">All countries</Link></li>
        </ul>
      </section>
    </SeoToolPage>
  );
}
