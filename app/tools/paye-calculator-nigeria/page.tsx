import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import PayeCalculator from "@/components/tools/PayeCalculator";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import { PAYE_BANDS_2026, computePaye, naira } from "@/lib/tax/paye2026";
import { absoluteUrl } from "@/lib/site";

const TITLE = "PAYE Calculator Nigeria 2026 — New Tax Act Bands & Take-Home Pay";
const DESCRIPTION =
  "Free 2026 PAYE calculator for Nigeria under the Nigeria Tax Act 2025: ₦800,000 tax-free band, new 15%–25% rates, rent relief and pension. See your monthly tax and take-home pay instantly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/paye-calculator-nigeria" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/paye-calculator-nigeria" },
};

const LAST_REVIEWED = "October 2026";

// Worked example rendered on the server from the same engine the calculator uses.
const EXAMPLE = computePaye({ grossAnnual: 6_000_000, annualRent: 1_200_000 });

const FAQ = [
  {
    q: "What are the new PAYE tax bands in Nigeria for 2026?",
    a: "Under the Nigeria Tax Act 2025, effective 1 January 2026, annual taxable income is taxed at 0% on the first ₦800,000, 15% on the next ₦2.2 million (up to ₦3m), 18% up to ₦12m, 21% up to ₦25m, 23% up to ₦50m, and 25% above ₦50m.",
  },
  {
    q: "Is the Consolidated Relief Allowance (CRA) still available?",
    a: "No. The Nigeria Tax Act 2025 removed the Consolidated Relief Allowance. It is replaced by rent relief of 20% of the annual rent you pay, up to a maximum of ₦500,000, which you claim by declaring your rent (with your lease or receipts) to your employer.",
  },
  {
    q: "Do minimum wage earners pay PAYE in 2026?",
    a: "In practice, no. A worker on the ₦70,000 national minimum wage earns ₦840,000 a year; after the 8% pension deduction their taxable income falls below the ₦800,000 tax-free band, so the PAYE due is zero.",
  },
  {
    q: "Which deductions reduce PAYE in 2026?",
    a: "Your pension contribution (usually 8% of basic, housing and transport), National Housing Fund contributions (2.5% of basic, where you contribute), health insurance (NHIS) premiums, life assurance premiums, and rent relief.",
  },
  {
    q: `How much PAYE will I pay on ${naira(500_000)} a month?`,
    a: `On ${naira(500_000)} a month (${naira(6_000_000)} a year) with 8% pension and ${naira(1_200_000)} annual rent, taxable income is ${naira(
      EXAMPLE.taxableIncome
    )} and annual PAYE is about ${naira(EXAMPLE.annualTax)} — roughly ${naira(EXAMPLE.monthlyTax)} a month, an effective rate of ${(
      EXAMPLE.effectiveRate * 100
    ).toFixed(1)}%.`,
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PAYE Calculator Nigeria 2026",
    url: absoluteUrl("/tools/paye-calculator-nigeria"),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
  },
];

function bandLabel(from: number, to: number) {
  return to === Infinity ? `Above ${naira(from)}` : from === 0 ? `First ${naira(to)}` : `${naira(from)} – ${naira(to)}`;
}

export default function PayeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/tools" className="text-[14px] text-[#ff8c14] hover:underline">
            ← All tools
          </Link>
          <h1 className="mt-4 text-[32px] font-semibold tracking-tight text-white sm:text-[40px]">
            PAYE Calculator Nigeria 2026
          </h1>
          <p className="mt-3 text-[17px] leading-relaxed text-[#a1a1a6]">
            Work out your monthly PAYE tax and take-home pay under the new Nigeria Tax Act 2025 —
            including the ₦800,000 tax-free band, rent relief and pension.
          </p>
          <p className="mt-2 text-[12px] text-[#86868b]">Rules last reviewed {LAST_REVIEWED}.</p>

          <div className="mt-8">
            <PayeCalculator />
          </div>

          <article className="mt-16 space-y-10 text-[15px] leading-relaxed text-[#c7cdd8]">
            <section>
              <h2 className="text-[22px] font-semibold text-white">2026 PAYE tax bands in Nigeria</h2>
              <p className="mt-3">
                From 1 January 2026, personal income tax is charged on annual taxable income (gross
                pay minus allowable deductions and reliefs) using these bands:
              </p>
              <table className="mt-4 w-full overflow-hidden rounded-xl border border-white/10 text-left text-[14px]">
                <thead className="bg-white/[0.05] text-white">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Annual taxable income</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {PAYE_BANDS_2026.map((b, i) => {
                    const from = i === 0 ? 0 : PAYE_BANDS_2026[i - 1].upTo;
                    return (
                      <tr key={b.upTo}>
                        <td className="px-4 py-2.5">{bandLabel(from, b.upTo)}</td>
                        <td className="px-4 py-2.5 text-right">{(b.rate * 100).toFixed(0)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-[22px] font-semibold text-white">What changed from the old PAYE rules</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>The tax-free threshold rose from ₦300,000 to the first ₦800,000 of taxable income.</li>
                <li>The Consolidated Relief Allowance (CRA) was abolished.</li>
                <li>Rent relief was introduced: 20% of annual rent paid, capped at ₦500,000.</li>
                <li>The top rate rose to 25%, on taxable income above ₦50 million.</li>
              </ul>
              <p className="mt-3">
                Running a business? Check whether it qualifies for 0% company tax with the{" "}
                <Link href="/tools/small-company-tax-checker" className="text-[#ff8c14] hover:underline">
                  small company tax checker
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-[22px] font-semibold text-white">Worked example: {naira(500_000)} a month</h2>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5">
                <li>Annual gross pay: {naira(EXAMPLE.grossAnnual)}</li>
                <li>Pension (8%): {naira(EXAMPLE.pension)}</li>
                <li>Rent relief on {naira(1_200_000)} rent: {naira(EXAMPLE.rentRelief)}</li>
                <li>Taxable income: {naira(EXAMPLE.taxableIncome)}</li>
                <li>
                  Tax: 0% on the first ₦800,000, 15% on the next ₦2,200,000, 18% on the remaining{" "}
                  {naira(EXAMPLE.taxableIncome - 3_000_000)} = <strong className="text-white">{naira(EXAMPLE.annualTax)}</strong> a
                  year ({naira(EXAMPLE.monthlyTax)} a month)
                </li>
              </ol>
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

            <section className="rounded-2xl border border-white/10 bg-[#141a28] p-6">
              <h2 className="text-[18px] font-semibold text-white">Run payroll for a team?</h2>
              <p className="mt-2 text-[14px] text-[#a1a1a6]">
                DoyinTech Pro includes payslips, invoices, contracts and every premium tool for
                ₦5,000/month. Need payroll built into your own website or HR system?{" "}
                <Link href="/hire" className="text-[#ff8c14] hover:underline">
                  We build that too.
                </Link>
              </p>
              <Link
                href="/pro"
                className="mt-4 inline-flex rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black"
              >
                See DoyinTech Pro
              </Link>
            </section>

            <section>
              <NewsletterSignup source="paye-calculator" />
            </section>

            <p className="text-[12px] text-[#86868b]">
              This calculator gives an estimate for planning. It is not tax advice; your employer
              or state Internal Revenue Service applies the final figures. Based on the Nigeria Tax
              Act 2025 as summarised by{" "}
              <a className="underline" href="https://kpmg.com/xx/en/our-insights/gms-flash-alert/flash-alert-2025-168.html" rel="noopener noreferrer" target="_blank">KPMG</a>,{" "}
              <a className="underline" href="https://www.ey.com/en_gl/technical/tax-alerts/nigeria-tax-act-2025-has-been-signed-highlights" rel="noopener noreferrer" target="_blank">EY</a> and{" "}
              <a className="underline" href="https://www.pwc.com/ng/en/publications/the-nigerian-tax-reform-acts.html" rel="noopener noreferrer" target="_blank">PwC Nigeria</a>.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
