import type { Metadata } from "next";
import Link from "next/link";
import SmallCompanyTaxChecker from "@/components/tools/SmallCompanyTaxChecker";
import SeoToolPage, { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Small Company Tax Checker Nigeria 2026 — Do You Pay 0% Company Tax?";
const DESCRIPTION =
  "Check if your business qualifies as a small company under the Nigeria Tax Act 2025: ₦50m turnover and ₦250m fixed-asset limits, 0% company tax, no development levy. Estimate tax if you don't.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/small-company-tax-checker" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/small-company-tax-checker" },
};

const FAQS: Faq[] = [
  {
    q: "What is a small company under the Nigeria Tax Act 2025?",
    a: "A company with gross annual turnover of ₦50 million or less and total fixed assets of ₦250 million or less, that does not provide professional services. Both limits must be met.",
  },
  {
    q: "Is the small company turnover limit ₦50 million or ₦100 million?",
    a: "The signed Nigeria Tax Act 2025 uses ₦50 million. The ₦100 million figure that appears in some articles came from the earlier draft bill. Check the latest guidance from the Nigeria Revenue Service if you are close to the limit.",
  },
  {
    q: "What tax do small companies pay?",
    a: "Small companies pay 0% companies income tax and are exempt from the 4% development levy and capital gains tax. They still need to register for tax, keep proper records and file annual returns.",
  },
  {
    q: "What tax do other companies pay in 2026?",
    a: "Companies that are not small pay companies income tax at 30% of assessable profit, plus a 4% development levy that replaced the old tertiary education tax, IT levy, NASENI levy and Police Trust Fund levy.",
  },
  {
    q: "Why are professional services excluded?",
    a: "The Act specifically removes professional services businesses — such as law, accounting and consulting firms — from the small company definition, so they pay company tax even if their turnover is under ₦50 million.",
  },
];

const jsonLd = [
  faqJsonLd(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Small Company Tax Checker Nigeria 2026",
    url: absoluteUrl("/tools/small-company-tax-checker"),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
  },
];

export default function SmallCompanyTaxCheckerPage() {
  return (
    <SeoToolPage
      h1="Small company tax checker (Nigeria 2026)"
      intro="Find out in seconds whether your company qualifies for 0% company tax under the Nigeria Tax Act 2025 — and what you'd pay if it doesn't."
      jsonLd={jsonLd}
      tool={<SmallCompanyTaxChecker />}
      faqs={FAQS}
      newsletterSource="small-company-tax"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Growing past the small-company limit?</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            Clean records make tax time painless. DoyinTech Pro gives you branded invoices,
            receipts, payslips and contracts for ₦5,000/month, and{" "}
            <Link href="/hire" className="text-[#ff8c14] hover:underline">
              we build websites that take payments online
            </Link>
            .
          </p>
          <Link href="/pro" className="mt-4 inline-flex rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
            See DoyinTech Pro
          </Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">The 2026 company tax rules at a glance</h2>
        <table className="mt-4 w-full overflow-hidden rounded-xl border border-white/10 text-left text-[14px]">
          <thead className="bg-white/[0.05] text-white">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Company</th>
              <th className="px-4 py-2.5 font-semibold">Income tax</th>
              <th className="px-4 py-2.5 font-semibold">Development levy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            <tr>
              <td className="px-4 py-2.5">Small (≤ ₦50m turnover, ≤ ₦250m fixed assets, not professional services)</td>
              <td className="px-4 py-2.5">0%</td>
              <td className="px-4 py-2.5">Exempt</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5">All other resident companies</td>
              <td className="px-4 py-2.5">30%</td>
              <td className="px-4 py-2.5">4% of assessable profit</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-[13px] text-[#86868b]">
          VAT remains 7.5% on VATable supplies. Whether you must register for and charge VAT
          depends on your turnover — confirm current thresholds with the Nigeria Revenue Service.
        </p>
      </section>

      <p className="text-[12px] text-[#86868b]">
        Planning estimate, not tax advice. Based on the Nigeria Tax Act 2025 as summarised by{" "}
        <a className="underline" href="https://www.ey.com/en_gl/technical/tax-alerts/nigeria-tax-act-2025-has-been-signed-highlights" rel="noopener noreferrer" target="_blank">EY</a> and{" "}
        <a className="underline" href="https://www.pwc.com/ng/en/publications/the-nigerian-tax-reform-acts.html" rel="noopener noreferrer" target="_blank">PwC Nigeria</a>. Rules last reviewed October 2026.
      </p>
    </SeoToolPage>
  );
}
