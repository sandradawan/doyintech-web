import type { Metadata } from "next";
import ServiceLanding, { type Faq } from "@/components/services/ServiceLanding";

export const revalidate = 3600;

const TITLE = "Business Email and Domain in Nigeria — you@yourbusiness.com Setup";
const DESCRIPTION =
  "Get a .com.ng or .com domain in your name and professional email like hello@yourbusiness.com on Zoho Mail or Google Workspace, set up on your phone. Fixed setup price.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/business-email-domain-nigeria" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/business-email-domain-nigeria" },
};

const FAQS: Faq[] = [
  {
    q: "Why not just use Gmail?",
    a: "Customers, banks and big companies take hello@yourbusiness.com more seriously than a free Gmail address, and it keeps working when staff leave because the business owns it.",
  },
  {
    q: "Which domain should I choose, .com.ng or .com?",
    a: ".com.ng tells customers you're a Nigerian business and is often easier to get; .com is global. Many businesses register both and point one to the other. We'll check which are available for your name.",
  },
  {
    q: "What does it cost after setup?",
    a: "The domain renews yearly at the registrar's price, and email is either free (Zoho Mail's free plan for small teams, where available) or a monthly fee per mailbox (Google Workspace). We register everything in your name and add no markup.",
  },
  {
    q: "Will it work on my phone?",
    a: "Yes. We set it up in the Gmail or Zoho Mail app on your phone and on your laptop, and test sending and receiving.",
  },
  {
    q: "Will my emails land in spam?",
    a: "We set up SPF, DKIM and DMARC records, which tell email providers your messages are genuine. That's the main reason new business emails land in spam.",
  },
];

export default function BusinessEmailPage() {
  return (
    <ServiceLanding
      path="/business-email-domain-nigeria"
      eyebrow="Domain and email"
      h1="Professional business email on your own domain"
      intro="Get a domain in your business's name and email addresses like hello@ and sales@yourbusiness.com, working on your phone within days. We do the technical setup so your emails land in the inbox, not spam."
      addonId="service-addon-business-email"
      steps={[
        "Pay the setup fee and send your preferred domain names.",
        "We check availability and register the domain in your name.",
        "We set up mailboxes and the records that keep you out of spam.",
        "We connect it to your phone and laptop and test it with you.",
      ]}
      faqs={FAQS}
      related={[
        ["/hire", "Get a website on the same domain"],
        ["/tools/email-signature", "Free email signature generator"],
        ["/business-name-registration-nigeria", "Register your business name"],
        ["/google-business-profile-setup", "Get on Google Maps"],
      ]}
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">What you get</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>A domain registered in your name, so you own it.</li>
          <li>Up to five mailboxes, for example hello@, sales@ and your own name.</li>
          <li>Spam-protection records set correctly (SPF, DKIM, DMARC).</li>
          <li>A matching email signature from our free signature tool.</li>
        </ul>
      </section>
    </ServiceLanding>
  );
}
