import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import LoanCalculator from "@/components/tools/LoanCalculator";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Loan Calculator — Monthly Repayment (EMI) and Total Interest";
const DESCRIPTION = "Work out the monthly repayment, total interest and year-by-year balance on a fixed-rate loan, in naira, dollars, pounds or any currency.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/loan-emi-calculator" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/loan-emi-calculator" },
};

const FAQS = [
  { q: "How is a monthly loan repayment (EMI) calculated?", a: "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the amount borrowed, r is the yearly rate divided by 12, and n is the number of months. 10,000 over 3 years at 8% is about 313.36 a month." },
  { q: "Why do I pay more interest at the start?", a: "Interest is charged on the balance still owed. Early on the balance is highest, so more of each payment goes to interest and less to the loan itself. The year-by-year table shows this shift." },
  { q: "Does a longer term save money?", a: "A longer term lowers the monthly payment but raises the total interest, because you owe money for longer. Compare a few terms to find the balance you can afford." },
  { q: "Does this work for Nigerian bank loans?", a: "Yes, for loans with a fixed rate and equal monthly payments. Pick NGN as the currency. Some lenders charge flat-rate interest or extra fees, which make the real cost higher, so ask for the total repayable in writing." },
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Loan EMI calculator", url: absoluteUrl("/tools/loan-emi-calculator"), applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="Loan repayment calculator"
      intro="See your monthly payment, the total interest, and how the balance falls each year, for any fixed-rate loan in any currency."
      jsonLd={jsonLd}
      tool={<LoanCalculator />}
      faqs={FAQS}
      newsletterSource="loan-calculator"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Will the loan pay for itself?</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">Check how many sales you need to cover the repayments with the break-even calculator.</p>
          <Link href="/tools/break-even-calculator" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">Break-even calculator</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Flat rate or reducing balance?</h2>
        <p className="mt-3">This calculator uses reducing balance: interest is charged only on what you still owe, as most banks do. Some lenders quote a flat rate, charging interest on the full amount for the whole term, which means nearly twice the interest at the same headline rate.</p>
        <p className="mt-3">Taking a loan to grow a business? Check it covers itself with the <Link href="/tools/break-even-calculator" className="text-[#ff8c14] underline">break-even calculator</Link>.</p>
      </section>
    </SeoToolPage>
  );
}
