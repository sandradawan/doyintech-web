import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import DiscountCalculator from "@/components/tools/DiscountCalculator";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Discount Calculator — Sale Price, Savings and Percent Off";
const DESCRIPTION = "Work out the sale price and how much you save from any percent off, stack an extra discount, or find the original price from a sale price. Any currency.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/discount-calculator" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/discount-calculator" },
};

const FAQS = [
  { q: "How do I calculate a discount?", a: "Multiply the price by the percent off and divide by 100 to get the saving, then take that from the price. 25% off 120 is 120 × 25 ÷ 100 = 30 off, so the sale price is 90." },
  { q: "Is 20% off then 10% off the same as 30% off?", a: "No. The second discount comes off the already reduced price, so 20% then 10% is 28% off in total. 100 becomes 80, then 72." },
  { q: "How do I find the original price from a sale price?", a: "Divide the sale price by what is left after the discount. If something costs 90 after 25% off, the original price was 90 ÷ 0.75 = 120." },
  { q: "Does this work for my currency?", a: "Yes. Pick any of 73 currencies; the maths is the same in all of them." },
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Discount calculator", url: absoluteUrl("/tools/discount-calculator"), applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="Discount calculator"
      intro="Find the sale price and your saving from any percent off, add a second discount on top, or work back to the original price."
      jsonLd={jsonLd}
      tool={<DiscountCalculator />}
      faqs={FAQS}
      newsletterSource="discount-calculator"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-brand-ink">Running a sale?</h2>
          <p className="mt-2 text-[14px] text-brand-muted">We build online stores with discount codes, sale prices and card payments built in.</p>
          <Link href="/stores" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">Get a website</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">Quick percent-off table (price 100)</h2>
        <table className="mt-4 w-full text-left text-[15px]">
          <thead><tr className="border-b border-brand-ink/10 text-brand-muted"><th className="py-2 font-medium">Discount</th><th className="py-2 font-medium">You save</th><th className="py-2 font-medium">You pay</th></tr></thead>
          <tbody>
            {[10, 15, 20, 25, 30, 40, 50, 70].map((d) => (
              <tr key={d} className="border-b border-brand-ink/5"><td className="py-2 text-brand-ink">{d}%</td><td className="py-2">{d}</td><td className="py-2">{100 - d}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </SeoToolPage>
  );
}
