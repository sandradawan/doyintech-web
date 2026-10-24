import type { Metadata } from "next";
import Link from "next/link";
import QrStudio from "@/components/tools/QrStudio";
import SeoToolPage, { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Free QR Code Generator — WhatsApp, Wi-Fi, Links & Contact Cards";
const DESCRIPTION =
  "Make QR codes for your website, WhatsApp chat, Wi-Fi, contact card or menu. Free PNG and SVG downloads that never expire. Add your logo and a “Scan to order” frame.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/qr-generator" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/qr-generator" },
};

const FAQS: Faq[] = [
  {
    q: "Do these QR codes expire?",
    a: "No. They are static codes: the link or details are stored inside the code itself, so they keep working for as long as the link does. Nothing depends on our servers.",
  },
  {
    q: "How do I make a WhatsApp QR code?",
    a: "Choose WhatsApp, enter your number (0803… is fine) and an optional first message. When a customer scans it, WhatsApp opens a chat with you with that message ready to send.",
  },
  {
    q: "Can guests join my Wi-Fi by scanning?",
    a: "Yes. Choose Wi-Fi, enter the network name and password, and print the code. Most iPhones and Android phones join the network straight from the camera app.",
  },
  {
    q: "What size should I print it?",
    a: "At least 2 × 2 cm for close scanning (business cards, packaging) and larger for posters: roughly one-tenth of the distance people will scan from. Use the SVG download for print shops; it stays sharp at any size.",
  },
  {
    q: "Can I add my logo?",
    a: "Yes. Branded QR codes put your logo in the centre and an optional caption like “Scan to order” in your colour. It's a one-off ₦1,500 unlock, or included with DoyinTech Pro.",
  },
];

const jsonLd = [
  faqJsonLd(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DoyinTech QR Code Generator",
    url: absoluteUrl("/tools/qr-generator"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
  },
];

export default function QrGeneratorPage() {
  return (
    <SeoToolPage
      h1="Free QR code generator"
      intro="QR codes for your website, WhatsApp chat, Wi-Fi, contact card or menu. Download PNG or print-ready SVG. Codes never expire."
      jsonLd={jsonLd}
      tool={<QrStudio />}
      faqs={FAQS}
      newsletterSource="qr-generator"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Point your QR code at a shop that takes orders</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            A QR code on your counter, packaging or flyer works best when it opens somewhere customers can buy. Open a{" "}
            <Link href="/stores" className="text-[#ff8c14] hover:underline">
              free DoyinTech shop
            </Link>{" "}
            with your products and prices, then make a QR code for your shop link.
          </p>
          <Link href="/stores" className="mt-4 inline-flex rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
            Open my free shop
          </Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Where businesses use QR codes</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white">Restaurants and cafés:</strong> a menu or order link on every table.
          </li>
          <li>
            <strong className="text-white">Shops and market stalls:</strong> a WhatsApp code so customers can message you later.
          </li>
          <li>
            <strong className="text-white">Hotels, salons and offices:</strong> Wi-Fi codes so guests stop asking for the password.
          </li>
          <li>
            <strong className="text-white">Business cards and flyers:</strong> a contact card that saves your number in one scan.
          </li>
          <li>
            <strong className="text-white">Invoices and receipts:</strong> a link to pay online or to leave a review.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-[22px] font-semibold text-white">Tips so every scan works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Keep strong contrast: a dark code on a light background.</li>
          <li>Leave the white border around the code; scanners need it.</li>
          <li>Test with two different phones before you print hundreds.</li>
          <li>Short links make simpler codes that scan faster from further away.</li>
        </ol>
      </section>
    </SeoToolPage>
  );
}
