import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import GiftCardBuyForm from "@/components/giftcards/GiftCardBuyForm";
import { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";

const TITLE = "DoyinTech Gift Cards — Give a website, tools or templates";
const DESCRIPTION =
  "Send a DoyinTech gift card by email or WhatsApp in a minute. Spend it on website packages, business tools, templates and ebooks. ₦2,000 to ₦500,000, valid for 3 years.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/gift-cards" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/gift-cards" },
};

const FAQS: Faq[] = [
  {
    q: "What can the gift card be spent on?",
    a: "Anything sold by DoyinTech: website package deposits and add-ons, premium tools (branded invoices, payslips, branded QR codes, PDF Studio), page templates, UI components, business kits and ebooks.",
  },
  {
    q: "What if the purchase costs more than the card?",
    a: "The card pays first and you pay the rest with Paystack in the same checkout. Any balance you don't use stays on the card.",
  },
  {
    q: "How is the card delivered?",
    a: "By email the moment payment is confirmed: to you, and to the recipient if you add their email. You also get a page with the code to copy, send on WhatsApp or print.",
  },
  {
    q: "How long is it valid?",
    a: "Three years from purchase. Check the balance any time on the redeem page.",
  },
  {
    q: "Can it be exchanged for cash or used in seller shops?",
    a: "No. DoyinTech gift cards can only be spent on DoyinTech's own products and services, not withdrawn as cash or used in independent shops listed on DoyinTech.",
  },
  {
    q: "Buying for a team or clients?",
    a: "Message us on WhatsApp for bulk gift cards with your company's message, from 10 cards.",
  },
];

export default function GiftCardsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">Gift cards</p>
              <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-white sm:text-[40px]">Give the gift of a better business</h1>
              <p className="mt-3 max-w-2xl text-[17px] text-[#a1a1a6]">
                A website deposit, premium tools, templates or ebooks: let them choose. Delivered by email in seconds.
              </p>
            </div>
            <Link href="/gift-cards/redeem" className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-white/5">
              Have a gift card? Check balance
            </Link>
          </div>

          <div className="mt-10">
            <GiftCardBuyForm />
          </div>

          <section className="mt-16 max-w-3xl">
            <h2 className="text-[22px] font-semibold text-white">Questions</h2>
            <dl className="mt-4 space-y-5">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="text-[15px] font-semibold text-white">{f.q}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-[#c7cdd8]">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
