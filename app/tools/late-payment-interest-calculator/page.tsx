import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import LatePaymentCalculator from "@/components/tools/LatePaymentCalculator";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Late Payment Interest Calculator UK: Statutory Interest";
const DESCRIPTION = "Work out the interest and fixed compensation you can claim on an unpaid invoice: UK statutory 8% plus base rate, or your own contract rate in any currency.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/late-payment-interest-calculator" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/late-payment-interest-calculator" },
};

const FAQS = [
  { q: "How much interest can I charge on a late invoice in the UK?", a: "Business-to-business, you can claim statutory interest of 8% a year plus the Bank of England base rate, unless your contract sets another rate. The base rate used is the one on 30 June for debts that fall due July to December, and 31 December for January to June." },
  { q: "How is late payment interest worked out?", a: "Multiply the amount owed by the yearly rate, divide by 365 for the daily interest, then multiply by the number of days late. £2,500 at 11.75% is about £0.80 a day, so 45 days late is about £36.22." },
  { q: "What is the fixed compensation for late payment?", a: "On top of interest, UK businesses can claim £40 for debts under £1,000, £70 for £1,000 to £9,999.99, and £100 for £10,000 or more, per invoice." },
  { q: "Does this apply to consumers or other countries?", a: "UK statutory interest only covers business-to-business debts. Elsewhere, use your contract rate or the legal rate in your country with the My contract rate option." },
  { q: "Is this legal advice?", a: "No. It is a calculator. Check the current base rate and your contract terms, and take advice before court action." },
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Late payment interest calculator", url: absoluteUrl("/tools/late-payment-interest-calculator"), applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" } },
  ];
  return (
    <SeoToolPage
      h1="Late payment interest calculator"
      intro="See the interest and compensation you can add to an overdue invoice, using UK statutory interest or your own contract rate."
      jsonLd={jsonLd}
      tool={<LatePaymentCalculator />}
      faqs={FAQS}
      newsletterSource="late-payment-interest"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-brand-ink">Send invoices that get paid</h2>
          <p className="mt-2 text-[14px] text-brand-muted">Make a professional invoice in any currency and state your late payment terms on it.</p>
          <Link href="/tools/invoice-generator" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">Free invoice generator</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">UK fixed compensation</h2>
        <table className="mt-4 w-full text-left text-[15px]">
          <thead><tr className="border-b border-brand-ink/10 text-brand-muted"><th className="py-2 font-medium">Amount owed</th><th className="py-2 font-medium">Compensation</th></tr></thead>
          <tbody>
            <tr className="border-b border-brand-ink/5"><td className="py-2 text-brand-ink">Under £1,000</td><td className="py-2">£40</td></tr>
            <tr className="border-b border-brand-ink/5"><td className="py-2 text-brand-ink">£1,000 to £9,999.99</td><td className="py-2">£70</td></tr>
            <tr className="border-b border-brand-ink/5"><td className="py-2 text-brand-ink">£10,000 or more</td><td className="py-2">£100</td></tr>
          </tbody>
        </table>
        <p className="mt-3">You can also claim reasonable recovery costs above these amounts if you can show them.</p>
      </section>
    </SeoToolPage>
  );
}
