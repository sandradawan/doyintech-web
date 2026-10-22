import type { Metadata } from "next";
import Link from "next/link";
import InvoiceGenerator from "@/components/tools/InvoiceGenerator";
import SeoToolPage, { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Free Invoice Generator Nigeria — Naira Invoices with VAT (PDF)";
const DESCRIPTION =
  "Create a professional invoice in naira in minutes: line items, 7.5% VAT, bank details and due date. Print or save as PDF for free. Add your logo and brand colour for a branded invoice.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/invoice-generator-nigeria" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/invoice-generator-nigeria" },
};

const FAQS: Faq[] = [
  {
    q: "What should an invoice include in Nigeria?",
    a: "Your business name and address, your CAC registration or Tax Identification Number (TIN) if you have one, the client's details, a unique invoice number and date, a description of each item with quantity and price, any VAT charged, the total in naira, the due date and how to pay (bank name, account name and account number).",
  },
  {
    q: "Should I add 7.5% VAT to my invoice?",
    a: "Only if your business is registered for VAT and the goods or services are VATable. VAT in Nigeria is 7.5%. If you charge it, show it as a separate line so your client can claim it. Small businesses that are not required to charge VAT should leave the tax at 0%.",
  },
  {
    q: "Is this invoice generator really free?",
    a: "Yes. Create, print and save as many invoices, quotes and receipts as PDF as you like. The optional branded version adds your logo and brand colour and removes our credit line.",
  },
  {
    q: "How do I save the invoice as a PDF?",
    a: "Click Print / Save PDF, then choose 'Save as PDF' as the printer. On a phone, use the share or print option and select Save as PDF. Only the invoice prints, not the website.",
  },
  {
    q: "Are my business details saved?",
    a: "Your business and payment details are saved in your own browser so the next invoice is faster. Nothing is sent to our servers.",
  },
];

const jsonLd = [
  faqJsonLd(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Invoice Generator Nigeria",
    url: absoluteUrl("/tools/invoice-generator-nigeria"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
  },
];

export default function InvoiceGeneratorNigeriaPage() {
  return (
    <SeoToolPage
      h1="Free invoice generator for Nigerian businesses"
      intro="Create a clean invoice in naira with VAT, bank details and a due date, then print or save it as a PDF. No sign-up needed."
      jsonLd={jsonLd}
      tool={<InvoiceGenerator initialDocType="Invoice" />}
      faqs={FAQS}
      newsletterSource="invoice-generator"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Sending invoices every week?</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            DoyinTech Pro gives you branded invoices, receipts, payslips, contracts and every
            premium tool for ₦5,000/month. Or let clients pay you online —{" "}
            <Link href="/hire" className="text-[#ff8c14] hover:underline">
              we build websites with Paystack checkout
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
        <h2 className="text-[22px] font-semibold text-white">How to make an invoice in 4 steps</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Enter your business name, address, phone and CAC or TIN number.</li>
          <li>Add your client and each item or service with quantity and unit price.</li>
          <li>Add VAT (7.5%) if you are VAT-registered, any discount, and your bank details.</li>
          <li>Click Print / Save PDF and send the PDF to your client on WhatsApp or email.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-[22px] font-semibold text-white">Invoice, quote or receipt?</h2>
        <p className="mt-3">
          Send a <strong className="text-white">quote</strong> before the work so the client
          agrees the price, an <strong className="text-white">invoice</strong> to request payment,
          and a <strong className="text-white">receipt</strong> once you&apos;ve been paid. The
          generator does all three — switch the document type at the top, or use{" "}
          <Link href="/tools/receipt-generator-nigeria" className="text-[#ff8c14] hover:underline">
            the receipt generator
          </Link>
          .
        </p>
      </section>
    </SeoToolPage>
  );
}
