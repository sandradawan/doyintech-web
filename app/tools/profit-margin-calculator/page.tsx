import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import MarginCalculator from "@/components/tools/MarginCalculator";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Profit Margin Calculator — Margin, Markup and Selling Price";
const DESCRIPTION = "Work out profit margin and markup from cost and price, or the selling price you need for a target margin or markup. Free, in any currency.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/profit-margin-calculator" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/profit-margin-calculator" },
};

const FAQS = [
  { q: "How do I calculate profit margin?", a: "Take the cost from the selling price to get the profit, then divide the profit by the selling price and multiply by 100. Something that costs 60 and sells for 100 makes 40 profit, a 40% margin." },
  { q: "What is the difference between margin and markup?", a: "Margin is profit as a share of the selling price. Markup is profit as a share of the cost. The same 60 cost and 100 price is a 40% margin but a 66.7% markup." },
  { q: "How do I price for a target margin?", a: "Divide the cost by 1 minus the margin. For a 40% margin on a 60 cost, the price is 60 ÷ 0.6 = 100." },
  { q: "What is a good profit margin?", a: "It depends on the trade. Retail and food often run on 20–50% gross margin, while services and digital products can go much higher. The margin still has to cover rent, staff and other overheads." },
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Profit margin calculator", url: absoluteUrl("/tools/profit-margin-calculator"), applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="Profit margin calculator"
      intro="See your margin and markup from cost and price, or find the price that gives you the margin you want."
      jsonLd={jsonLd}
      tool={<MarginCalculator />}
      faqs={FAQS}
      newsletterSource="profit-margin"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Sell at your new price online</h2>
          <p className="mt-2 text-[14px] text-brand-muted">We build online stores that take card and transfer payments, so customers can order any time.</p>
          <Link href="/stores" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">Get a website</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Margin and markup side by side</h2>
        <table className="mt-4 w-full text-left text-[15px]">
          <thead><tr className="border-b border-white/10 text-brand-muted"><th className="py-2 font-medium">Margin</th><th className="py-2 font-medium">Same as markup</th><th className="py-2 font-medium">Price for a cost of 100</th></tr></thead>
          <tbody>
            {[10, 20, 25, 30, 40, 50, 60].map((m) => (
              <tr key={m} className="border-b border-white/5"><td className="py-2 text-white">{m}%</td><td className="py-2">{((m / (100 - m)) * 100).toFixed(1)}%</td><td className="py-2">{(100 / (1 - m / 100)).toFixed(2)}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </SeoToolPage>
  );
}
