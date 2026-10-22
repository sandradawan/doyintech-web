import type { Metadata } from "next";
import Link from "next/link";
import FreelancerTaxCalculator from "@/components/tools/FreelancerTaxCalculator";
import SeoToolPage, { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Freelancer & Self-Employed Tax Calculator Nigeria (2027 Filing)";
const DESCRIPTION =
  "Work out income tax on freelance, remote-work and business income under the Nigeria Tax Act 2025. Deduct expenses and rent relief, see what to set aside monthly, and file by 31 March 2027.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/freelancer-tax-calculator-nigeria" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/freelancer-tax-calculator-nigeria" },
};

const FAQS: Faq[] = [
  {
    q: "Do freelancers and remote workers pay tax in Nigeria?",
    a: "Yes. Nigerian tax residents are taxed on worldwide income, including payments from foreign clients and platforms. Under the Nigeria Tax Act 2025 the same progressive rates apply as for employees, from 0% on the first ₦800,000 of taxable income up to 25%.",
  },
  {
    q: "When is the deadline to file my 2026 tax return?",
    a: "Self-employed people file a self-assessment return by 31 March of the following year, so income earned in 2026 is filed by 31 March 2027, with the State Internal Revenue Service where you live. Late filing attracts penalties — reported at ₦100,000 for the first month and ₦50,000 for each further month under the Nigeria Tax Administration Act 2025.",
  },
  {
    q: "What expenses can I deduct?",
    a: "Costs incurred wholly and exclusively for your work — for example internet and data, software subscriptions, equipment, workspace and professional fees. Keep receipts: you may be asked to prove deductions. Personal spending is not deductible.",
  },
  {
    q: "Do I pay tax if I earn under ₦800,000?",
    a: "If your taxable income after expenses and reliefs is ₦800,000 or less, the tax is ₦0 — but you should still file a return to declare your income.",
  },
  {
    q: "How much should I set aside each month?",
    a: "Divide your estimated annual tax by 12 and move that amount into a separate account each month, so the bill doesn't arrive all at once at filing time. The calculator shows this figure.",
  },
];

const jsonLd = [
  faqJsonLd(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Freelancer Tax Calculator Nigeria",
    url: absoluteUrl("/tools/freelancer-tax-calculator-nigeria"),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
  },
];

export default function FreelancerTaxCalculatorPage() {
  return (
    <SeoToolPage
      h1="Freelancer & self-employed tax calculator (Nigeria)"
      intro="Estimate the income tax on your freelance, remote-work or business income under the new tax law — and how much to set aside before the 31 March 2027 filing deadline."
      jsonLd={jsonLd}
      tool={<FreelancerTaxCalculator />}
      faqs={FAQS}
      newsletterSource="freelancer-tax"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Look established to clients</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            A portfolio website with your services and a way to pay you online wins better
            clients than a WhatsApp number alone.{" "}
            <Link href="/hire" className="text-[#ff8c14] hover:underline">
              See fixed-price website packages
            </Link>
            , or get branded invoices, contracts and proposals with DoyinTech Pro.
          </p>
          <Link href="/hire" className="mt-4 inline-flex rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
            Get a fixed-price website
          </Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">How freelancer tax works in 2026</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Add up all your income for the year, including foreign payments converted to naira.</li>
          <li>Subtract business expenses to get your profit.</li>
          <li>Subtract reliefs: rent relief (20% of rent, max ₦500,000), pension and health insurance.</li>
          <li>Apply the bands: 0% on the first ₦800,000, then 15%, 18%, 21%, 23% and 25%.</li>
          <li>File a self-assessment return with your State IRS by 31 March and pay the balance.</li>
        </ol>
        <p className="mt-3">
          Employed as well? Your salary is taxed through PAYE — see the{" "}
          <Link href="/tools/paye-calculator-nigeria" className="text-[#ff8c14] hover:underline">
            PAYE calculator
          </Link>
          . Running a registered company instead? Check the{" "}
          <Link href="/tools/small-company-tax-checker" className="text-[#ff8c14] hover:underline">
            small company tax checker
          </Link>
          .
        </p>
      </section>
      <p className="text-[12px] text-[#86868b]">
        Planning estimate, not tax advice. Rules reviewed October 2026 from the Nigeria Tax Act
        2025 and reporting by{" "}
        <a className="underline" href="https://techpoint.africa/insight/freelancers-and-remote-workers-nigerias-tax-laws/" rel="noopener noreferrer" target="_blank">Techpoint</a> and{" "}
        <a className="underline" href="https://businessday.ng/news/article/personal-income-tax-march-31-deadline-puts-nigerias-new-tax-system-to-test/" rel="noopener noreferrer" target="_blank">BusinessDay</a>.
      </p>
    </SeoToolPage>
  );
}
