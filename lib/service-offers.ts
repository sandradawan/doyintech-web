export type ServiceOffer = {
  id: string;
  name: string;
  tagline: string;
  totalNgn: string;
  depositNgn: string;
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
    totalNgn: "₦100,000",
    depositNgn: "₦50,000",
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
    totalNgn: "₦250,000",
    depositNgn: "₦125,000",
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
    totalNgn: "₦450,000",
    depositNgn: "₦225,000",
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
    idealFor: "SMEs that need leads, not only a brochure",
    delivery: "50% deposit online · balance before final handoff",
  },
];

export function getServiceOffer(id: string): ServiceOffer | undefined {
  return SERVICE_OFFERS.find((o) => o.id === id);
}

export function serviceWhatsAppLink(offer: ServiceOffer): string {
  const text = `Hi DoyinTech, I want the "${offer.name}" package (${offer.totalNgn}). I can pay the ${offer.depositNgn} deposit. Let's confirm scope.`;
  return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
}
