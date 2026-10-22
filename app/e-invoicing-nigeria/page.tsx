import type { Metadata } from "next";
import Link from "next/link";
import EInvoicingReadiness from "@/components/tools/EInvoicingReadiness";
import SeoToolPage, { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";

const TITLE = "E-Invoicing in Nigeria: 2027 Deadline for Small Businesses (NRS)";
const DESCRIPTION =
  "When does NRS e-invoicing apply to your business? Check your phase by turnover — small businesses go live 1 July 2027 — and what to do now to be ready.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/e-invoicing-nigeria" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/e-invoicing-nigeria" },
};

const FAQS: Faq[] = [
  {
    q: "What is e-invoicing in Nigeria?",
    a: "E-invoicing means issuing invoices through the Nigeria Revenue Service (NRS) electronic system, the Merchant Buyer Solution (MBS), so each invoice is validated and reported to the tax authority in real time instead of being a PDF or paper document only.",
  },
  {
    q: "When does e-invoicing apply to small businesses?",
    a: "According to the NRS phased rollout announced in February 2026, businesses with annual turnover below ₦1 billion have a pilot in April–June 2027, go-live on 1 July 2027, and enforcement from January–March 2028. Dates may be revised, so check the NRS notices.",
  },
  {
    q: "When does it apply to medium businesses?",
    a: "Businesses with turnover between ₦1 billion and ₦5 billion went live on 1 July 2026, with a review in October–November 2026 and enforcement from January–March 2027.",
  },
  {
    q: "What should I do now to get ready?",
    a: "Make sure your business is registered for tax and VAT where required, keep complete customer and product records, move to consistent digital invoicing with numbered invoices, and choose billing software or a website checkout that can connect to an NRS-accredited e-invoicing provider before your go-live date.",
  },
  {
    q: "Can my website checkout issue e-invoices?",
    a: "Yes — online sales can be connected to an accredited e-invoicing provider so invoices are generated and reported automatically when customers pay. That's something we can set up as part of a website build or upgrade.",
  },
];

const jsonLd = [faqJsonLd(FAQS)];

export default function EInvoicingNigeriaPage() {
  return (
    <SeoToolPage
      h1="E-invoicing in Nigeria: when your business must comply"
      intro="The Nigeria Revenue Service is rolling out mandatory e-invoicing by business size. Pick your turnover to see your dates — small businesses go live in July 2027."
      jsonLd={jsonLd}
      tool={<EInvoicingReadiness />}
      faqs={FAQS}
      newsletterSource="e-invoicing"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Selling online?</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            A website with Paystack checkout records every sale cleanly — the foundation for
            automatic e-invoicing. Until then, issue proper numbered invoices with the free{" "}
            <Link href="/tools/invoice-generator-nigeria" className="text-[#ff8c14] hover:underline">
              invoice generator
            </Link>
            .
          </p>
          <Link href="/hire" className="mt-4 inline-flex rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
            Get a fixed-price website
          </Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">The rollout at a glance</h2>
        <table className="mt-4 w-full overflow-hidden rounded-xl border border-white/10 text-left text-[14px]">
          <thead className="bg-white/[0.05] text-white">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Annual turnover</th>
              <th className="px-4 py-2.5 font-semibold">Go-live</th>
              <th className="px-4 py-2.5 font-semibold">Enforcement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            <tr><td className="px-4 py-2.5">Above ₦5 billion</td><td className="px-4 py-2.5">Already live</td><td className="px-4 py-2.5">2026</td></tr>
            <tr><td className="px-4 py-2.5">₦1bn – ₦5bn</td><td className="px-4 py-2.5">1 July 2026</td><td className="px-4 py-2.5">Jan–Mar 2027</td></tr>
            <tr><td className="px-4 py-2.5">Below ₦1 billion</td><td className="px-4 py-2.5">1 July 2027</td><td className="px-4 py-2.5">Jan–Mar 2028</td></tr>
          </tbody>
        </table>
      </section>
      <p className="text-[12px] text-[#86868b]">
        Based on the NRS public notice of February 2026 as summarised by{" "}
        <a className="underline" href="https://kpmg.com/us/en/taxnewsflash/news/2026/02/nigeria-phased-rollout-e-invoicing-electronic-fiscal-system.html" rel="noopener noreferrer" target="_blank">KPMG</a> and{" "}
        <a className="underline" href="https://nairametrics.com/2026/02/17/nrs-launches-phased-e-invoicing-fiscal-monitoring-system/" rel="noopener noreferrer" target="_blank">Nairametrics</a>. Timelines are official guidance and may change; confirm with the NRS. Reviewed October 2026.
      </p>
    </SeoToolPage>
  );
}
