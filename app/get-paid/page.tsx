import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { faqJsonLd } from "@/components/tools/SeoToolPage";
import { FREE_PLAN_FEE_PERCENT } from "@/lib/storefront/shared";

const TITLE = "Invoice Payment Links Nigeria — Get Paid Faster by Card, Transfer or USSD";
const DESCRIPTION = `Turn any invoice into a Pay now link. Customers pay by card, bank transfer or USSD through Paystack, money settles to your own bank, and reminders go out until it's paid. ${FREE_PLAN_FEE_PERCENT}% per payment, or 0% on the Store plan.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/get-paid" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/get-paid" },
};

const STEPS: [string, string][] = [
  ["Make the invoice", "Use the free invoice generator: your items, VAT, due date and your customer's email or WhatsApp number."],
  ["Create the payment link", "One click turns the invoice into a secure Pay now page with your business name and the amount."],
  ["Send it on WhatsApp or email", "Share the link in a chat, or let us email it. We remind the customer the day before, on, and after the due date."],
  ["Money lands in your bank", "Your customer pays by card, transfer or USSD through Paystack, and the money settles to the bank account you connected."],
];

const FAQS = [
  { q: "How much does it cost?", a: `Free to set up. On the free plan DoyinTech takes ${FREE_PLAN_FEE_PERCENT}% of each payment received; on the Store plan (₦3,500 a month) there is no DoyinTech fee. Paystack's own processing fee applies as usual.` },
  { q: "Where does the money go?", a: "Straight to the bank account you connect. We verify the account name with your bank, and Paystack settles each payment to it. DoyinTech never holds your money." },
  { q: "How long does approval take?", a: "Usually within one business day after you connect your bank. You can make invoices straight away and send links once approved." },
  { q: "Can customers pay by bank transfer?", a: "Yes. The Pay now page accepts card, bank transfer and USSD through Paystack, and you get a confirmation when the payment clears." },
  { q: "Do I need a website?", a: "No. You get a free business page and the payment links work on their own. If you sell products, the same account gives you an online shop with checkout." },
];

export default function GetPaidPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <main className="min-h-screen bg-black pb-16 pt-24">
        <header className="mx-auto max-w-[760px] px-6 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#3ddc97]">Payment links · Paystack · reminders</p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[46px]">Send an invoice. Get paid the same day.</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#c7cdd8]">
            Every invoice gets a Pay now link your customer can pay by card, transfer or USSD. The money goes to your bank, and we chase late payers for you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/tools/invoice-generator-nigeria" className="inline-flex min-h-11 items-center rounded-full bg-[#3ddc97] px-6 text-[15px] font-semibold text-black">Make an invoice</Link>
            <Link href="/stores/dashboard" className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-6 text-[15px] font-semibold text-white">Connect your bank</Link>
          </div>
          <p className="mt-3 text-[13px] text-[#8b919c]">Free to start · {FREE_PLAN_FEE_PERCENT}% per payment · 0% on the Store plan</p>
        </header>

        <ol className="mx-auto mt-14 grid max-w-[1000px] gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([h, body], i) => (
            <li key={h} className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
              <p className="text-[13px] font-semibold text-[#3ddc97]">Step {i + 1}</p>
              <h2 className="mt-1 text-[17px] font-semibold text-white">{h}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#c7cdd8]">{body}</p>
            </li>
          ))}
        </ol>

        <section className="mx-auto mt-14 max-w-[1000px] px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Fewer late payments", "Reminders go out automatically before and after the due date, so you stop chasing by hand."],
              ["Proof for every payment", "Each link shows paid or unpaid in your dashboard, with the date and amount."],
              ["Works with what you use", "Send on WhatsApp, Instagram DMs or email. Customers don't need an account to pay."],
            ].map(([h, b]) => (
              <div key={h} className="rounded-2xl border border-white/10 p-5">
                <h2 className="text-[16px] font-semibold text-white">{h}</h2>
                <p className="mt-2 text-[14px] text-[#c7cdd8]">{b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-[760px] px-6">
          <h2 className="text-[24px] font-semibold text-white">Questions</h2>
          <dl className="mt-4 space-y-5">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="text-[16px] font-semibold text-white">{f.q}</dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-[#c7cdd8]">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-[14px] text-[#a1a1a6]">
            Planning cash for the next three months? Try the free <Link href="/tools/cash-flow-forecast" className="text-white underline underline-offset-2">13-week cash flow forecast</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
