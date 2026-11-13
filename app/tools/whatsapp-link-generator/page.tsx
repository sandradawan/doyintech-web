import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import { WhatsAppLinkGeneratorTool } from "@/components/tools/SearchDemandTools";
import { absoluteUrl } from "@/lib/site";

const TITLE = "WhatsApp Link Generator: Create a Free wa.me Chat Link";
const DESCRIPTION = "Free WA link generator. Enter your number and an optional message to get a wa.me click-to-chat link for your bio, website, flyers and ads. No sign-up.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/whatsapp-link-generator" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/whatsapp-link-generator" },
};

const FAQS = [
  { q: "What is a WhatsApp link?", a: "It is a web link that opens a chat with your number when someone taps it. They do not need to save your number first. It looks like wa.me followed by your number." },
  { q: "How do I create a WhatsApp link?", a: "Enter your phone number with the country code, add a message if you want one, and copy the link. You can also write it by hand as https://wa.me/ followed by your full number." },
  { q: "How should I write my phone number?", a: "Use the international format with the country code and without the plus sign, spaces or the leading zero. A Nigerian number 0808 534 3926 becomes 2348085343926." },
  { q: "Can the link open with a message already typed?", a: "Yes. Add your message in the tool and the customer sees it ready to send, such as \"Hello, I want to order.\" They can still edit it before sending." },
  { q: "Does it work with WhatsApp Business?", a: "Yes. The same link works for WhatsApp and WhatsApp Business numbers, on phones and on WhatsApp Web." },
  { q: "Is the WhatsApp link generator free?", a: "Yes. It is free, there is no sign-up, and the link does not expire." },
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "WhatsApp link generator", url: absoluteUrl("/tools/whatsapp-link-generator"), applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="WhatsApp link generator"
      intro="Turn your phone number into a wa.me link that opens a chat with you in one tap, with an optional message already typed."
      jsonLd={jsonLd}
      tool={<WhatsAppLinkGeneratorTool />}
      faqs={FAQS}
      newsletterSource="whatsapp-link"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-brand-ink">Put a WhatsApp button on your own website</h2>
          <p className="mt-2 text-[14px] text-brand-muted">We build fixed-price business websites with WhatsApp booking and ordering built in.</p>
          <Link href="/hire" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">Get a website</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">The wa.me link format</h2>
        <p className="mt-3">A basic link is <strong className="text-brand-ink">https://wa.me/2348085343926</strong>, where the number is written in full international format.</p>
        <p className="mt-3">To add a message, put <strong className="text-brand-ink">?text=</strong> after the number, followed by your message with spaces written as %20: https://wa.me/2348085343926?text=Hello%20I%20want%20to%20order. The generator does this encoding for you.</p>
      </section>
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">Where to use your link</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Your Instagram, TikTok and Facebook bio, so followers can message you directly.</li>
          <li>A &quot;Chat on WhatsApp&quot; button on your website or online store.</li>
          <li>Flyers, receipts and packaging, as a QR code customers can scan.</li>
          <li>Ads and status posts, with a different message for each so you know where a customer came from.</li>
        </ul>
        <p className="mt-3">Our <Link href="/tools/qr-generator" className="text-brand-link hover:underline">free QR code generator</Link> turns the link into a code you can print.</p>
      </section>
    </SeoToolPage>
  );
}
