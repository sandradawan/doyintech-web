import Link from "next/link";
import OpsUpsell from "@/components/ops/OpsUpsell";
import InvoiceGenerator from "@/components/tools/InvoiceGenerator";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import { INVOICE_CURRENCIES } from "@/lib/global/currencies";
import { absoluteUrl } from "@/lib/site";

const TITLE = `Free Invoice Generator — ${INVOICE_CURRENCIES.length}+ Currencies, VAT/GST, PDF`;
const DESCRIPTION = "Create professional invoices, quotes, receipts and purchase orders in any currency with VAT or GST. Free PDF download, no sign-up, works on your phone.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/invoice-generator" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/invoice-generator" },
};

const FAQS = [
  { q: "Is this invoice generator really free?", a: "Yes. Make as many invoices, quotes and receipts as you need and save them as PDF. The optional branded upgrade adds your logo and colour and removes the footer credit." },
  { q: "Which currencies can I invoice in?", a: `${INVOICE_CURRENCIES.length} currencies, including USD, EUR, GBP, CAD, AUD, INR, ZAR, KES, AED and NGN. The currency is set from your location and you can change it in one click.` },
  { q: "How do I add VAT or GST?", a: "Enter the tax rate as a percentage; it is added to the subtotal and shown as its own line. Not sure of the rate? Use the VAT calculator for your country first." },
  { q: "What should an invoice include?", a: "Your business name and contact details, the customer's details, a unique invoice number, the issue and due dates, each item with quantity and price, tax shown separately, the total, and how to pay." },
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Free Invoice Generator", url: absoluteUrl("/tools/invoice-generator"), applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="Free invoice generator for any currency"
      intro="Fill in your details, add items and tax, and download a clean PDF invoice in seconds. Switch to a quote, receipt, proforma or purchase order with one click."
      jsonLd={jsonLd}
      tool={<><InvoiceGenerator defaultCurrency="USD" detectCurrency /><OpsUpsell /></>}
      faqs={FAQS}
      newsletterSource="invoice-generator-global"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-brand-ink">Charging VAT or GST?</h2>
          <p className="mt-2 text-[14px] text-brand-muted">Check the current rate and work out the tax for your country before you send the invoice.</p>
          <Link href="/vat-calculator" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">VAT calculators by country</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">Invoice numbering that keeps you organised</h2>
        <p className="mt-3">Use a prefix and the year, then a running number, such as INV-2026-0042. Never reuse or skip numbers: tax authorities in most countries expect a continuous sequence, and it makes chasing payments much easier.</p>
      </section>
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">Get paid faster</h2>
        <p className="mt-3">Put the due date and payment details on every invoice, send it the day the work is done, and follow up the day after it falls due. Short terms (7 or 14 days) are paid sooner than 30-day terms.</p>
      </section>
    </SeoToolPage>
  );
}
