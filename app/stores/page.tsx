import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import PlanCard from "@/components/subscriptions/PlanCard";
import { plansInFamily } from "@/lib/subscriptions/plans";
import { FREE_PLAN_FEE_PERCENT, FREE_PRODUCT_LIMIT } from "@/lib/storefront/shared";
import { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";

const TITLE = "Free Online Store for WhatsApp Sellers in Nigeria — DoyinTech Store";
const DESCRIPTION =
  "Create a free online shop in minutes: product photos, prices, delivery fees and a shareable link. Customers order on WhatsApp or pay with Paystack straight to your bank. Send payment links for invoices. No website needed.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/stores" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/stores" },
};

const STEPS = [
  { title: "Create your shop", body: "Pick a name and your link, e.g. doyintech.com/s/your-shop. Free, in two minutes." },
  { title: "Add products", body: "Upload photos, set prices and mark items in or out of stock from your phone." },
  { title: "Share one link", body: "Put it in your WhatsApp status, Instagram bio and TikTok. Customers browse without DMing for prices." },
  { title: "Get orders", body: "Orders arrive on WhatsApp with items, delivery and totals. Connect your bank and customers can pay online too." },
];

const FAQS: Faq[] = [
  {
    q: "Is DoyinTech Store really free?",
    a: `Yes. The free plan includes a shop page with up to ${FREE_PRODUCT_LIMIT} products and WhatsApp ordering, with a small "Powered by DoyinTech" note. Free shops can take online payments too, for a ${FREE_PLAN_FEE_PERCENT}% fee per payment. Upgrade any time for unlimited products, no fee and discount codes.`,
  },
  {
    q: "How do I receive payments?",
    a: `Connect your bank account in your dashboard. Customers pay by card, bank transfer or USSD through Paystack and the money settles directly to your account, minus Paystack's standard fees. On the free plan DoyinTech keeps ${FREE_PLAN_FEE_PERCENT}% of each online payment; on the Store plan there's no DoyinTech fee. DoyinTech never holds your money.`,
  },
  {
    q: "Can I send a payment link for an invoice?",
    a: "Yes. Create a payment link with the amount and due date and send it on WhatsApp or by email. If you add the customer's email we remind them the day before, on, and three days after the due date, and you're emailed as soon as they pay.",
  },
  {
    q: "Why is there a review before payments go live?",
    a: "To protect buyers and sellers, we check each shop before switching on online payments — usually within one business day. WhatsApp ordering works immediately.",
  },
  {
    q: "Do I need a website?",
    a: "No. Your shop link works on its own. When you're ready for a full branded website with your own domain, we build that too.",
  },
  {
    q: "Can I cancel?",
    a: "Yes, any time from your account page. Your shop drops back to the free plan; your products stay.",
  },
];

export default function StoresPage() {
  const plans = plansInFamily("store");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([faqJsonLd(FAQS)]) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-[1000px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">DoyinTech Store</p>
          <h1 className="mt-2 max-w-3xl text-[34px] font-semibold tracking-tight text-white sm:text-[46px]">
            Your online shop in two minutes. Free.
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-[#a1a1a6]">
            Stop sending price lists in DMs. Share one link with your products, prices and photos —
            customers order on WhatsApp or pay online straight to your bank.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/stores/dashboard" className="inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[15px] font-semibold text-black">
              Create my free shop
            </Link>
            <a href="#pricing" className="inline-flex rounded-full border border-white/20 px-6 py-3 text-[15px] font-semibold text-white">
              See pricing
            </a>
          </div>

          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <span className="text-[13px] font-semibold text-[#ff8c14]">Step {i + 1}</span>
                <h2 className="mt-1 text-[16px] font-semibold text-white">{s.title}</h2>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#a1a1a6]">{s.body}</p>
              </li>
            ))}
          </ol>

          <section id="pricing" className="mt-16">
            <h2 className="text-[24px] font-semibold text-white">Pricing</h2>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <div className="flex flex-col rounded-[22px] border border-white/10 bg-[#141a28] p-6">
                <h3 className="text-[19px] font-semibold text-white">Free</h3>
                <p className="mt-1 text-[14px] text-[#a1a1a6]">Everything you need to start.</p>
                <p className="mt-5 text-[34px] font-semibold text-white">₦0</p>
                <ul className="mt-5 flex-1 space-y-2.5 text-[14px] text-[#c7cdd8]">
                  <li>✓ Shop page with your own link</li>
                  <li>✓ Up to {FREE_PRODUCT_LIMIT} products with photos</li>
                  <li>✓ Orders on WhatsApp with item list and total</li>
                  <li>✓ Delivery fees by area</li>
                  <li>✓ Online payments and invoice payment links, {FREE_PLAN_FEE_PERCENT}% per payment</li>
                  <li>✓ &quot;Powered by DoyinTech&quot; note</li>
                </ul>
                <Link href="/stores/dashboard" className="mt-6 inline-flex justify-center rounded-full border border-white/20 py-3 text-[14px] font-semibold text-white">
                  Start free
                </Link>
              </div>
              {plans.map((p) => (
                <PlanCard key={p.id} plan={p} highlight={p.id === "store-monthly"} />
              ))}
            </div>
          </section>

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
