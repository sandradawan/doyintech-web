import type { Metadata } from "next";
import Link from "next/link";
import InvoiceGenerator from "@/components/tools/InvoiceGenerator";
import SeoToolPage, { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Free Quotation Generator Nigeria — Price Quotes in Naira (PDF)";
const DESCRIPTION =
  "Make a professional quotation in naira: items, quantities, VAT, validity date and your bank details. Print or save as PDF for free, then turn it into an invoice when the client says yes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/quotation-generator-nigeria" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/quotation-generator-nigeria" },
};

const FAQS: Faq[] = [
  {
    q: "What should a quotation include?",
    a: "Your business details, the client's name, a quotation number and date, each item or service with quantity and price, VAT if you charge it, the total, how long the price is valid, and your payment terms.",
  },
  {
    q: "How long should a quotation be valid?",
    a: "Usually 7 to 30 days. With prices changing quickly in Nigeria, many businesses use 7 or 14 days so they aren't held to an old price.",
  },
  {
    q: "What's the difference between a quotation and an invoice?",
    a: "A quotation offers a price before the work; an invoice asks for payment after the client agrees or the work is done. In this tool you can switch the same document from Quotation to Invoice in one click.",
  },
  {
    q: "Is it free?",
    a: "Yes, unlimited quotations. The optional branded version adds your logo and colour and removes our credit line.",
  },
];

const jsonLd = [
  faqJsonLd(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Quotation Generator Nigeria",
    url: absoluteUrl("/tools/quotation-generator-nigeria"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
  },
];

export default function QuotationGeneratorPage() {
  return (
    <SeoToolPage
      h1="Free quotation generator for Nigerian businesses"
      intro="Send clients a clean price quote in naira with VAT and a validity date. Print or save as PDF, then convert it to an invoice when they accept."
      jsonLd={jsonLd}
      tool={<InvoiceGenerator initialDocType="Quote" />}
      faqs={FAQS}
      newsletterSource="quotation-generator"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Let clients accept and pay online</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            Send a payment link with your quote so the client can pay the deposit by card or transfer the moment they agree.{" "}
            <Link href="/stores" className="text-[#ff8c14] hover:underline">
              Payment links come free with a DoyinTech shop
            </Link>
            .
          </p>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">How to write a quotation that wins the job</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Break the work into clear line items so the client sees what they&apos;re paying for.</li>
          <li>State whether prices include VAT (7.5%).</li>
          <li>Give a short validity period and your payment terms, for example 50% upfront.</li>
          <li>Follow up within two days on WhatsApp: most quotes are won on the follow-up.</li>
        </ol>
      </section>
    </SeoToolPage>
  );
}
