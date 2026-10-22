import type { Metadata } from "next";
import Link from "next/link";
import InvoiceGenerator from "@/components/tools/InvoiceGenerator";
import SeoToolPage, { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Free Receipt Generator Nigeria — Payment Receipts in Naira (PDF)";
const DESCRIPTION =
  "Make a payment receipt in naira for any sale, service, rent or fee. Add items, amount paid and payment date, then print or save as PDF for free. Branded receipts with your logo available.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/receipt-generator-nigeria" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/receipt-generator-nigeria" },
};

const FAQS: Faq[] = [
  {
    q: "What should a receipt include?",
    a: "Your business name and contact details, the customer's name, a receipt number, the date of payment, what was paid for (items or services), the amount paid in naira, and how it was paid — cash, transfer, POS or card.",
  },
  {
    q: "Is a receipt the same as an invoice?",
    a: "No. An invoice asks for payment; a receipt confirms payment has been made. Many businesses send an invoice first and a receipt after the money arrives.",
  },
  {
    q: "Can I use this for rent, school fees or church dues receipts?",
    a: "Yes. Describe the payment as the line item — for example 'Rent, January–December 2026' or 'First term school fees' — and enter the amount received.",
  },
  {
    q: "How do I send the receipt to a customer?",
    a: "Click Print / Save PDF, choose Save as PDF, and share the file on WhatsApp or email. On a phone, use the print or share menu and select Save as PDF.",
  },
  {
    q: "Is it free?",
    a: "Yes, unlimited receipts. The optional branded version adds your logo and colour and removes our credit line.",
  },
];

const jsonLd = [
  faqJsonLd(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Receipt Generator Nigeria",
    url: absoluteUrl("/tools/receipt-generator-nigeria"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
  },
];

export default function ReceiptGeneratorNigeriaPage() {
  return (
    <SeoToolPage
      h1="Free receipt generator for Nigerian businesses"
      intro="Confirm a payment with a professional receipt in naira — for sales, services, rent or fees. Print or save as PDF in seconds."
      jsonLd={jsonLd}
      tool={<InvoiceGenerator initialDocType="Receipt" />}
      faqs={FAQS}
      newsletterSource="receipt-generator"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Issue receipts automatically</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            When customers pay on your own website, receipts go out by email without you lifting
            a finger.{" "}
            <Link href="/hire" className="text-[#ff8c14] hover:underline">
              See our website packages with Paystack checkout
            </Link>
            , or get branded receipts and every premium tool with DoyinTech Pro.
          </p>
          <Link href="/pro" className="mt-4 inline-flex rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
            See DoyinTech Pro
          </Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">How to write a receipt</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Fill in your business details once — they&apos;re remembered next time.</li>
          <li>Enter the customer&apos;s name and what they paid for.</li>
          <li>Set the payment date and method (transfer, cash, POS).</li>
          <li>Print or save as PDF and send it to the customer.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-[22px] font-semibold text-white">Why receipts matter</h2>
        <p className="mt-3">
          Receipts protect both sides: your customer has proof of payment, and you have a clear
          record for bookkeeping and tax. Keeping numbered receipts also makes it easy to match
          bank transfers to sales. Need to bill first? Use the{" "}
          <Link href="/tools/invoice-generator-nigeria" className="text-[#ff8c14] hover:underline">
            invoice generator
          </Link>
          .
        </p>
      </section>
    </SeoToolPage>
  );
}
