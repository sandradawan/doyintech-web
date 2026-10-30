/** City landing pages for "web design in <city>" searches. Each city has its own copy so pages aren't duplicates. */

export type City = {
  slug: string; // used in /web-design-<slug>
  name: string;
  state: string;
  headline: string;
  intro: string;
  businesses: string[]; // the local mix we build for
  areas: string[];
  angle: { title: string; body: string };
  faqs: { q: string; a: string }[];
};

export const CITIES: City[] = [
  {
    slug: "lagos",
    name: "Lagos",
    state: "Lagos State",
    headline: "Web design in Lagos for businesses that need enquiries, not just a pretty site",
    intro:
      "Lagos customers compare three options on their phone before they call anyone. We build fixed-price websites that load fast on mobile data, show your prices and reviews, and turn visits into WhatsApp chats and Paystack payments.",
    businesses: ["Restaurants and food vendors", "Fashion, beauty and salons", "Real estate and short-let apartments", "Clinics and pharmacies", "Logistics and dispatch", "Schools and training centres"],
    areas: ["Ikeja", "Lekki", "Victoria Island", "Yaba", "Surulere", "Ajah", "Ikorodu", "Festac"],
    angle: {
      title: "Built for a crowded market",
      body: "In Lagos your website competes with Instagram pages, marketplaces and dozens of similar businesses. We lead with what makes you different, put the WhatsApp button where thumbs reach it, and set up Google Business Profile so you show up when someone searches near Lekki or Ikeja.",
    },
    faqs: [
      { q: "Do you have an office in Lagos?", a: "We're based in Jos and work with Lagos clients remotely: calls, WhatsApp and shared drafts. Most clients never need a physical meeting, and it keeps our prices fixed and fair." },
      { q: "Can you build a short-let or real estate website?", a: "Yes: listings with photos, availability, WhatsApp enquiry and optional Paystack deposits. See our real estate page for examples." },
    ],
  },
  {
    slug: "port-harcourt",
    name: "Port Harcourt",
    state: "Rivers State",
    headline: "Web design in Port Harcourt for service companies and local businesses",
    intro:
      "From oil and gas service firms that need to look credible to procurement teams, to restaurants, hotels and salons in GRA, we build fixed-price websites that win trust and bring enquiries.",
    businesses: ["Oil and gas service and engineering firms", "Hotels and lounges", "Restaurants", "Clinics and labs", "Logistics and haulage", "Schools"],
    areas: ["GRA", "Trans-Amadi", "Rumuola", "Rumuokoro", "Old Port Harcourt Township", "Choba", "Woji"],
    angle: {
      title: "Credibility for B2B buyers",
      body: "Procurement teams check your website before they shortlist you. We build company profiles with services, certifications, project history and a clear contact path, plus a downloadable company profile PDF.",
    },
    faqs: [
      { q: "Can you build a company profile website for vendor registration?", a: "Yes. We structure the site the way procurement teams read it: services, HSE and certifications, past projects, key personnel and contact, with a downloadable PDF profile." },
      { q: "Do you work with Port Harcourt clients remotely?", a: "Yes. We're based in Jos and run projects over calls and WhatsApp, with fixed prices and a 50% deposit." },
    ],
  },
  {
    slug: "ibadan",
    name: "Ibadan",
    state: "Oyo State",
    headline: "Web design in Ibadan for schools, clinics and growing businesses",
    intro:
      "Ibadan's schools, clinics, churches and family businesses are moving their customers online. We build affordable fixed-price websites that parents, patients and customers can find on Google and contact on WhatsApp.",
    businesses: ["Private schools and tutorial centres", "Hospitals and clinics", "Churches and ministries", "Bakeries and restaurants", "Agro businesses", "Retail shops"],
    areas: ["Bodija", "Ring Road", "Challenge", "Dugbe", "Mokola", "Akobo", "Jericho", "Samonda"],
    angle: {
      title: "Websites parents and patients trust",
      body: "Schools need admission information, fees and a photo gallery parents can share; clinics need services, hours and booking. We build those pages first and keep the site simple for your team to update.",
    },
    faqs: [
      { q: "Can you build a school website with admissions?", a: "Yes: admission requirements, an online enquiry or application form, fees, gallery and news. See our school websites page." },
      { q: "Is there a cheaper option to start?", a: "A one-page landing page starts our range and can grow into a full site later." },
    ],
  },
  {
    slug: "kano",
    name: "Kano",
    state: "Kano State",
    headline: "Web design in Kano for traders, distributors and growing brands",
    intro:
      "Kano is Northern Nigeria's commercial hub. We build fixed-price websites and online catalogues that let distributors, wholesalers and brands show their products and take orders from customers across the region on WhatsApp.",
    businesses: ["Wholesalers and distributors", "Textiles and fashion", "Agro-processing and food", "Hospitals and pharmacies", "Schools and Islamiyya schools", "Logistics"],
    areas: ["Sabon Gari", "Nassarawa GRA", "Bompai", "Kano Municipal", "Tarauni", "Gyadi-Gyadi", "Fagge"],
    angle: {
      title: "Catalogues that take orders",
      body: "For traders, a product catalogue with prices and a WhatsApp order button often beats a full online store. Customers in Kaduna, Katsina or Abuja can browse and order without a phone call.",
    },
    faqs: [
      { q: "Can my website show prices that change often?", a: "Yes. You can update prices yourself, or use a free DoyinTech shop page alongside your website for products that change daily." },
      { q: "Do you work with Kano clients remotely?", a: "Yes. We're based in Jos and run projects over calls and WhatsApp with fixed prices." },
    ],
  },
  {
    slug: "enugu",
    name: "Enugu",
    state: "Enugu State",
    headline: "Web design in Enugu for businesses, clinics and professionals",
    intro:
      "Enugu's professionals, clinics, hotels and young tech-savvy businesses deserve websites that look as good as their work. We build fixed-price sites with clear services, reviews and a direct line to WhatsApp.",
    businesses: ["Law firms and consultants", "Hospitals and clinics", "Hotels and event centres", "Restaurants", "Real estate", "Schools"],
    areas: ["Independence Layout", "GRA", "New Haven", "Trans-Ekulu", "Abakpa", "Uwani", "Achara Layout"],
    angle: {
      title: "Professional services that win clients online",
      body: "Lawyers, accountants and consultants are hired on trust. We build sites that show expertise: practice areas, team profiles, case highlights and a consultation request form.",
    },
    faqs: [
      { q: "Can you build a website for a law firm or consultancy?", a: "Yes: practice areas, team bios, articles and a consultation form, written to stay within professional advertising rules." },
      { q: "Do you work with Enugu clients remotely?", a: "Yes. We're based in Jos and work over calls and WhatsApp with fixed prices and a 50% deposit." },
    ],
  },
  {
    slug: "benin-city",
    name: "Benin City",
    state: "Edo State",
    headline: "Web design in Benin City for hotels, schools and local businesses",
    intro:
      "Benin City's hotels, event centres, schools and shops win customers who search on Google first. We build fixed-price websites with photos, prices and booking on WhatsApp so they choose you.",
    businesses: ["Hotels and event centres", "Schools", "Restaurants and lounges", "Art, crafts and fashion", "Hospitals and clinics", "Churches"],
    areas: ["GRA", "Ring Road", "Ugbowo", "Sapele Road", "Airport Road", "Ekenwan Road", "Uselu"],
    angle: {
      title: "Bookings without the back-and-forth",
      body: "Hotels and event centres lose bookings when guests can't see rooms, halls and prices. We show them clearly, with availability enquiries on WhatsApp and optional Paystack deposits.",
    },
    faqs: [
      { q: "Can guests book and pay a deposit online?", a: "Yes. We can add Paystack deposits for rooms or halls, or keep it to WhatsApp enquiries if you prefer to confirm manually." },
      { q: "Do you work with Benin City clients remotely?", a: "Yes. We're based in Jos and run projects over calls and WhatsApp with fixed prices." },
    ],
  },
];

export function getCity(slug: string) {
  return CITIES.find((c) => c.slug === slug);
}
