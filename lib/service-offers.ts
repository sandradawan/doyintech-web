export type ServiceOffer = {
  id: string;
  name: string;
  tagline: string;
  totalNgn: string;
  depositNgn: string;
  totalUsd: string;
  depositUsd: string;
  amountKobo: number;
  timeline: string;
  badge?: string;
  scope: string[];
  notIncluded: string[];
  idealFor: string;
  delivery: string;
};

/** Fixed-price offers — 50% deposit via Paystack locks the slot */
export const SERVICE_OFFERS: ServiceOffer[] = [
  {
    id: "service-landing-page-deposit",
    name: "Landing Page Starter",
    tagline: "One sharp page that sells one offer. Live in about a week.",
    totalNgn: "$65",
    totalUsd: "$65",
    depositNgn: "$32",
    depositUsd: "$32",
    amountKobo: 5000000,
    timeline: "5–10 days after content + deposit",
    badge: "New · entry price",
    scope: [
      "Single high-converting landing page",
      "Mobile-first layout (headline, offer, proof, CTA)",
      "WhatsApp click-to-chat button",
      "Basic SEO (title, meta, fast load)",
      "1 structured revision round",
      "5 days post-launch WhatsApp support",
    ],
    notIncluded: [
      "Multi-page website",
      "Blog or CMS",
      "Custom web app / login",
      "Ads management",
      "Extra revision rounds",
    ],
    idealFor: "Coaches, freelancers, new shops testing one offer",
    delivery: "50% deposit online · balance before final handoff",
  },
  {
    id: "service-local-website-deposit",
    name: "Local Business Website",
    tagline: "Live in 7–14 days. WhatsApp-ready. Built to get enquiries.",
    totalNgn: "$161",
    totalUsd: "$161",
    depositNgn: "$81",
    depositUsd: "$81",
    amountKobo: 12500000,
    timeline: "7–14 days after content + deposit",
    badge: "Fixed price",
    scope: [
      "Up to 5 pages (Home, About, Services, Contact + 1 extra)",
      "Mobile-first design (dark or brand colours)",
      "WhatsApp click-to-chat on every page",
      "Contact / enquiry path that is obvious",
      "Basic SEO (titles, meta, sitemap, speed hygiene)",
      "1 structured revision round",
      "7 days post-launch WhatsApp support",
    ],
    notIncluded: [
      "Custom web app / login systems",
      "Ongoing ads management",
      "Content writing marathon (you supply text & photos)",
      "Extra revision rounds (billed separately)",
    ],
    idealFor: "Salons, clinics, property, cleaners, coaches, local shops",
    delivery: "50% deposit online · balance before final handoff",
  },
  {
    id: "service-growth-website-deposit",
    name: "Growth Website",
    tagline: "More pages, stronger conversion, ready to rank and measure.",
    totalNgn: "$290",
    totalUsd: "$290",
    depositNgn: "$145",
    depositUsd: "$145",
    amountKobo: 22500000,
    timeline: "2–4 weeks after content + deposit",
    badge: "Most booked",
    scope: [
      "Up to 10 pages + blog setup",
      "Conversion-focused layout (offer, proof, CTA)",
      "WhatsApp + lead form",
      "Speed & on-page SEO basics",
      "Analytics / pixel-ready hooks",
      "2 revision rounds",
      "14 days post-launch support",
    ],
    notIncluded: [
      "Monthly content retainer",
      "Paid ads spend",
      "Custom CRM build",
    ],
    idealFor: "Businesses that need leads, not only a brochure",
    delivery: "50% deposit online · balance before final handoff",
  },
];

export function getServiceOffer(id: string): ServiceOffer | undefined {
  return SERVICE_OFFERS.find((o) => o.id === id);
}

export function serviceWhatsAppLink(offer: ServiceOffer): string {
  const text = `Hi DoyinTech, I want the "${offer.name}" package (${offer.totalUsd}). I can pay the ${offer.depositUsd} deposit. Let's confirm scope.`;
  return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
}

/** Fixed-price extras bought on their own or alongside a package (paid in full, not a deposit). */
export type ServiceAddon = {
  id: string;
  name: string;
  blurb: string;
  amountKobo: number;
  includes: string[];
  delivery: string;
};

export const SERVICE_ADDONS: ServiceAddon[] = [
  {
    id: "service-addon-google-business",
    name: "Google Business Profile setup",
    blurb: "Show up on Google Maps and local search with photos, hours and a WhatsApp link.",
    amountKobo: 2_500_000,
    includes: ["Profile created or claimed and verified", "Photos, hours, services and categories", "WhatsApp and website links", "3 starter posts"],
    delivery: "Done within 5 working days of your details",
  },
  {
    id: "service-addon-whatsapp-business",
    name: "WhatsApp Business setup",
    blurb: "A catalogue, greeting, away message and quick replies so you answer faster.",
    amountKobo: 1_500_000,
    includes: ["Business profile and catalogue", "Greeting and away messages", "10 quick replies for common questions", "Labels for orders and follow-ups"],
    delivery: "Done on a 45-minute call",
  },
  {
    id: "service-addon-logo-kit",
    name: "Logo and brand kit",
    blurb: "A clean logo with colours and fonts that look right on your site, WhatsApp and Instagram.",
    amountKobo: 3_500_000,
    includes: ["Logo in 2 concepts, 1 revision round", "Colour palette and fonts", "Profile images for WhatsApp, Instagram and Facebook", "Files in PNG, SVG and PDF"],
    delivery: "First concepts in 3–5 working days",
  },
  {
    id: "service-addon-copywriting",
    name: "Website copywriting (up to 5 pages)",
    blurb: "We write the words for your pages so they're clear, local and get enquiries.",
    amountKobo: 3_000_000,
    includes: ["Short interview about your business", "Headlines, services and calls to action", "SEO titles and descriptions", "1 revision round"],
    delivery: "Draft in 5 working days",
  },
  {
    id: "service-addon-extra-page",
    name: "Extra website page",
    blurb: "Add one more page to any package: a service, gallery, menu or FAQ page.",
    amountKobo: 1_500_000,
    includes: ["Designed to match your site", "Mobile-first", "Linked from your menu", "Basic SEO"],
    delivery: "Added during your build",
  },
];

export function getServiceAddon(id: string): ServiceAddon | undefined {
  return SERVICE_ADDONS.find((a) => a.id === id);
}
