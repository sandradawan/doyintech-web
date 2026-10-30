import type { Metadata } from "next";
import Link from "next/link";
import ServiceLanding, { type Faq } from "@/components/services/ServiceLanding";

export const revalidate = 3600;

const TITLE = "Business Name Registration in Nigeria (CAC) — Done for You";
const DESCRIPTION =
  "Register your business name with the Corporate Affairs Commission without the stress. We search, reserve and file for you and send your certificate. Fixed service fee, CAC fee at cost.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/business-name-registration-nigeria" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/business-name-registration-nigeria" },
};

const FAQS: Faq[] = [
  {
    q: "How much does CAC business name registration cost?",
    a: "There are two parts: the CAC government fee (name reservation and registration) and our service fee. The government fee changes from time to time, so we confirm the exact amount from the CAC portal before filing and you pay it at cost. Our service fee is fixed.",
  },
  {
    q: "How long does it take?",
    a: "Most business names are approved within 2–7 working days after we have your details. Delays usually come from a name being rejected, which is why we check alternatives first.",
  },
  {
    q: "What do I need?",
    a: "Two or three name options, the nature of your business, your business address, and for each proprietor: full name, date of birth, phone, email, residential address, a valid ID (NIN slip, voter's card, driver's licence or international passport), a passport photo and a signature.",
  },
  {
    q: "Business name or limited company?",
    a: "A business name suits a sole trader or partnership and is cheaper and simpler. A limited company (Ltd) is a separate legal entity, better for raising investment, bigger contracts or limiting personal liability. Ask us on WhatsApp if you're unsure.",
  },
  {
    q: "Can I do it myself?",
    a: "Yes, on the CAC portal. Many people pay us to avoid name rejections, wrong business classifications and back-and-forth, and to get it done while they focus on the business.",
  },
];

export default function BusinessNameRegistrationPage() {
  return (
    <ServiceLanding
      path="/business-name-registration-nigeria"
      eyebrow="CAC registration"
      h1="Register your business name with the CAC, done for you"
      intro="A registered business name lets you open a business bank account, issue proper invoices, apply for contracts and loans, and build trust with customers. We handle the search, reservation and filing and send you the certificate."
      addonId="service-addon-business-name"
      steps={[
        "Pay the service fee and send your details on WhatsApp.",
        "We check name availability and reserve the best option.",
        "We confirm the CAC fee and file your registration.",
        "You receive your certificate and status report.",
      ]}
      faqs={FAQS}
      related={[
        ["/business-email-domain-nigeria", "Get a domain and business email"],
        ["/google-business-profile-setup", "Get on Google Maps"],
        ["/hire", "Get a website"],
        ["/tools/business-name-generator", "Free business name ideas"],
      ]}
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Why register your business name?</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Open a corporate bank account in your business name.</li>
          <li>Accept payments through Paystack and other gateways as a business.</li>
          <li>Qualify for government grants, loans and supplier registration.</li>
          <li>Protect your name in Nigeria so nobody else registers it.</li>
        </ul>
        <p className="mt-4">
          Still choosing a name? Try the{" "}
          <Link href="/tools/business-name-generator" className="text-[#ff8c14] hover:underline">
            free business name generator
          </Link>{" "}
          and send us your top three.
        </p>
      </section>
    </ServiceLanding>
  );
}
