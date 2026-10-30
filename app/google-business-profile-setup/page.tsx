import type { Metadata } from "next";
import ServiceLanding, { type Faq } from "@/components/services/ServiceLanding";

export const revalidate = 3600;

const TITLE = "Put Your Business on Google Maps — Google Business Profile Setup in Nigeria";
const DESCRIPTION =
  "Show up when people search for businesses near them. We create or claim, verify and optimise your Google Business Profile with photos, hours, WhatsApp and first posts. Fixed price.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/google-business-profile-setup" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/google-business-profile-setup" },
};

const FAQS: Faq[] = [
  {
    q: "How do I put my business on Google Maps?",
    a: "Through a free Google Business Profile. You create it, choose the right categories, add your address or service area, and verify that you own the business. Google then shows it on Maps and in local search results.",
  },
  {
    q: "Is Google Business Profile free?",
    a: "Yes, Google doesn't charge for it. You pay us only for setting it up properly and getting it verified, which is where most people get stuck.",
  },
  {
    q: "How does verification work?",
    a: "Google chooses the method: usually a short video of your premises, a phone or email code, or occasionally a postcard. We guide you through whichever Google asks for.",
  },
  {
    q: "I don't have a shop. Can I still be on Google?",
    a: "Yes. Service businesses can hide their address and show a service area instead, for example ‘Serves Lagos Island and Lekki’.",
  },
  {
    q: "How do I rank higher on Google Maps?",
    a: "Complete every section, choose accurate categories, add real photos, keep hours correct, post updates, and ask happy customers for reviews. We set all of that up and show you how to keep reviews coming.",
  },
];

export default function GoogleBusinessProfilePage() {
  return (
    <ServiceLanding
      path="/google-business-profile-setup"
      eyebrow="Google Maps"
      h1="Get your business on Google Maps and local search"
      intro="When someone searches ‘pharmacy near me’ or ‘caterer in Abuja’, Google shows businesses with a Business Profile first, with photos, reviews, hours and a call button. We set yours up, get it verified and make it look its best."
      addonId="service-addon-google-business"
      steps={[
        "Pay and send your business details and photos on WhatsApp.",
        "We create or claim your profile and set categories, hours and services.",
        "We guide you through Google's verification.",
        "We add photos, your WhatsApp and website links, and first posts.",
      ]}
      faqs={FAQS}
      related={[
        ["/hire", "Get a website to link from your profile"],
        ["/tools/qr-generator", "QR code for Google reviews"],
        ["/business-name-registration-nigeria", "Register your business name"],
        ["/business-email-domain-nigeria", "Business email"],
      ]}
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">What customers see</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Your business on the map with directions.</li>
          <li>A call button and a link to WhatsApp or your website.</li>
          <li>Photos, opening hours, services and prices.</li>
          <li>Reviews from customers, which win the next customer.</li>
        </ul>
        <p className="mt-4">
          Tip: put a QR code linking to your review page on your counter or receipts. Make one with our free QR code generator.
        </p>
      </section>
    </ServiceLanding>
  );
}
