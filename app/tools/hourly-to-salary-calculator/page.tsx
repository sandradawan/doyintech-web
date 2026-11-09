import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import HourlySalaryCalculator from "@/components/tools/HourlySalaryCalculator";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Hourly to Salary Calculator: Daily, Weekly and Yearly Pay";
const DESCRIPTION = "Convert an hourly wage to a yearly salary, or a salary to an hourly rate, in any currency. Set your hours, days and paid weeks for an exact figure.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/hourly-to-salary-calculator" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/hourly-to-salary-calculator" },
};

const FAQS = [
  { q: "How do I convert an hourly wage to a yearly salary?", a: "Multiply the hourly rate by the hours you work a week, then by the weeks you are paid a year. At 40 hours and 52 weeks, $25 an hour is $25 × 40 × 52 = $52,000 a year." },
  { q: "How do I work out my hourly rate from my salary?", a: "Divide the yearly salary by your hours a week times your paid weeks a year. A $60,000 salary over 40 hours and 52 weeks is $60,000 ÷ 2,080 = $28.85 an hour." },
  { q: "How many working hours are in a year?", a: "2,080 for a 40-hour week over 52 weeks, 1,950 for 37.5 hours, and 1,820 for 35 hours." },
  { q: "Is this before or after tax?", a: "Before tax (gross). Use the salary calculator for your country to see take-home pay." },
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Hourly to salary calculator", url: absoluteUrl("/tools/hourly-to-salary-calculator"), applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="Hourly to salary calculator"
      intro="Turn an hourly wage into daily, weekly, monthly and yearly pay, or work backwards from a salary to your hourly rate. Works in any currency."
      jsonLd={jsonLd}
      tool={<HourlySalaryCalculator />}
      faqs={FAQS}
      newsletterSource="hourly-to-salary"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">What will you take home?</h2>
          <p className="mt-2 text-[14px] text-brand-muted">See income tax and contributions for the UK, US, Canada, Ireland, India, Australia, South Africa, Kenya and Nigeria.</p>
          <Link href="/salary-calculator" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">Salary after tax</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Common conversions (40 hours, 52 weeks)</h2>
        <table className="mt-4 w-full text-left text-[15px]">
          <thead><tr className="border-b border-white/10 text-brand-muted"><th className="py-2 font-medium">Hourly</th><th className="py-2 font-medium">Monthly</th><th className="py-2 font-medium">Yearly</th></tr></thead>
          <tbody>
            {[15, 20, 25, 30, 40, 50].map((h) => (
              <tr key={h} className="border-b border-white/5"><td className="py-2 text-white">{h}</td><td className="py-2">{((h * 2080) / 12).toLocaleString("en", { maximumFractionDigits: 0 })}</td><td className="py-2">{(h * 2080).toLocaleString("en")}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3">The figures work in any currency: 25 an hour is 52,000 a year whether it is dollars, pounds or euros.</p>
      </section>
    </SeoToolPage>
  );
}
