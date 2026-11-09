import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import BreakEvenCalculator from "@/components/tools/BreakEvenCalculator";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Break-Even Calculator — Units and Sales to Cover Your Costs";
const DESCRIPTION = "Find how many units you must sell, and how much revenue you need, to cover fixed costs or reach a profit target. Free, in any currency.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/break-even-calculator" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/break-even-calculator" },
};

const FAQS = [
  { q: "How do I calculate the break-even point?", a: "Take the variable cost from the price to get the contribution per unit, then divide your fixed costs by it. With 5,000 of fixed costs, a price of 40 and a variable cost of 15, you need 5,000 ÷ 25 = 200 sales." },
  { q: "What are fixed and variable costs?", a: "Fixed costs stay the same whatever you sell, such as rent, salaries and software. Variable costs rise with every sale, such as stock, packaging, delivery and payment fees." },
  { q: "How do I include a profit target?", a: "Add the profit you want to your fixed costs before dividing by the contribution per unit. The calculator does this when you fill in the profit box." },
  { q: "How can I break even sooner?", a: "Raise the price, cut the cost of each sale, or lower fixed costs. A small price rise often moves the break-even point more than you expect, because all of it goes to contribution." },
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Break-even calculator", url: absoluteUrl("/tools/break-even-calculator"), applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="Break-even calculator"
      intro="Find the number of sales that covers your costs, and how many more you need for the profit you want."
      jsonLd={jsonLd}
      tool={<BreakEvenCalculator />}
      faqs={FAQS}
      newsletterSource="break-even"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Need more sales to break even?</h2>
          <p className="mt-2 text-[14px] text-brand-muted">A fast website that ranks on Google and takes payments brings in customers while you sleep.</p>
          <Link href="/hire" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">Get a website</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">The formula</h2>
        <p className="mt-3">Break-even units = fixed costs ÷ (price per unit − variable cost per unit).</p>
        <p className="mt-3">Break-even revenue = break-even units × price per unit.</p>
        <p className="mt-3">
          Plan your cash month by month with the <Link href="/tools/cash-flow-forecast" className="text-[#ff8c14] underline">cash flow forecast</Link>, and check your pricing with the{" "}
          <Link href="/tools/profit-margin-calculator" className="text-[#ff8c14] underline">profit margin calculator</Link>.
        </p>
      </section>
    </SeoToolPage>
  );
}
