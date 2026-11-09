import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import FreelanceRateCalculator from "@/components/tools/FreelanceRateCalculator";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Freelance Rate Calculator: What Should You Charge?";
const DESCRIPTION = "Work out the hourly and day rate you need as a freelancer or consultant to hit your income after tax, business costs and time off. Free, any currency.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/freelance-rate-calculator" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/freelance-rate-calculator" },
};

const FAQS = [
  { q: "How do I calculate my freelance hourly rate?", a: "Add the income you want to keep, grossed up for tax, to your yearly business costs. Divide that by the hours you can really bill in a year (billable hours a week × working weeks). That is the least you should charge per hour." },
  { q: "Why is my freelance rate so much higher than my old hourly wage?", a: "As an employee your employer paid for holidays, equipment, pension and the hours you spend on admin. As a freelancer you cover those yourself and can only bill part of each week, so the same income needs a higher rate." },
  { q: "How many hours a week can a freelancer bill?", a: "Usually 20–30. The rest of the week goes on finding clients, quotes, invoicing and email." },
  { q: "Should I charge by the hour or by the project?", a: "Use the hourly rate to price, then quote a fixed project fee where you can: estimate the hours, multiply by your rate and add a margin for changes. Clients prefer a known price." },
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Freelance rate calculator", url: absoluteUrl("/tools/freelance-rate-calculator"), applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="Freelance rate calculator"
      intro="Find the hourly and day rate you need to earn your target income after tax, business costs and time off, so every quote you send pays you properly."
      jsonLd={jsonLd}
      tool={<FreelanceRateCalculator />}
      faqs={FAQS}
      newsletterSource="freelance-rate"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Look the part to clients</h2>
          <p className="mt-2 text-[14px] text-brand-muted">A portfolio website with your services, prices and a booking button, at a fixed price.</p>
          <Link href="/hire" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">Get a website</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">A worked example</h2>
        <p className="mt-3">You want to keep 60,000 a year, your costs are 6,000 and about 25% goes on tax. You need 60,000 ÷ 0.75 + 6,000 = 86,000 in revenue. Billing 25 hours a week for 46 weeks gives 1,150 billable hours, so you should charge at least 86,000 ÷ 1,150 ≈ 75 an hour, or about 523 for a 7-hour day.</p>
      </section>
      <section>
        <h2 className="text-[22px] font-semibold text-white">Raise your rate without losing clients</h2>
        <p className="mt-3">Raise rates for new clients first, give existing clients a month’s notice, and tie the increase to results you have delivered. Quoting fixed project prices also makes your hourly rate less visible.</p>
      </section>
    </SeoToolPage>
  );
}
