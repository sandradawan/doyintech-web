import type { Metadata } from "next";
import Link from "next/link";
import InvoiceGenerator from "@/components/tools/InvoiceGenerator";
import SeoToolPage, { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Free Proforma Invoice Generator Nigeria (PDF)";
const DESCRIPTION =
  "Create a proforma invoice in naira for advance payment, bank or import documentation: items, VAT, validity date and bank details. Print or save as PDF free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/proforma-invoice-generator-nigeria" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/proforma-invoice-generator-nigeria" },
};

const FAQS: Faq[] = [
  {
    q: "What is a proforma invoice?",
    a: "A preliminary invoice sent before goods are delivered or work starts. It shows exactly what the buyer will be charged so they can pay in advance, get approval, or present it to a bank, school or government office.",
  },
  {
    q: "Is a proforma invoice a demand for payment?",
    a: "No. It's an estimate the buyer can rely on. When the sale is completed you issue the final (commercial) invoice, and a receipt once paid.",
  },
  {
    q: "Who asks for a proforma invoice in Nigeria?",
    a: "Companies and government agencies processing purchase approvals, banks financing an asset, schools and NGOs budgeting, and importers who need one for Form M and foreign exchange documentation.",
  },
  {
    q: "Is it free?",
    a: "Yes. The branded version adds your logo and colour and removes our credit line.",
  },
];

const jsonLd = [
  faqJsonLd(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Proforma Invoice Generator Nigeria",
    url: absoluteUrl("/tools/proforma-invoice-generator-nigeria"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
  },
];

export default function ProformaInvoicePage() {
  return (
    <SeoToolPage
      h1="Free proforma invoice generator"
      intro="Issue a proforma invoice in naira for advance payment or approvals. Add items, VAT and a validity date, then print or save as PDF."
      jsonLd={jsonLd}
      tool={<InvoiceGenerator initialDocType="Proforma" />}
      faqs={FAQS}
      newsletterSource="proforma-invoice-generator"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Need quotes, invoices and receipts that look official?</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            Add your logo and brand colour to every document for a one-off ₦3,500, or get every premium tool with{" "}
            <Link href="/pro" className="text-[#ff8c14] hover:underline">
              DoyinTech Pro
            </Link>
            .
          </p>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Proforma invoice vs quotation vs invoice</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white">Quotation:</strong> an offer the client can accept or negotiate.
          </li>
          <li>
            <strong className="text-white">Proforma invoice:</strong> the agreed amount in invoice form, before supply, often for advance payment or approvals.
          </li>
          <li>
            <strong className="text-white">Invoice:</strong> the final bill after supply.{" "}
            <Link href="/tools/invoice-generator-nigeria" className="text-[#ff8c14] hover:underline">
              Make an invoice
            </Link>
            .
          </li>
        </ul>
      </section>
    </SeoToolPage>
  );
}
