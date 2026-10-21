/**
 * Industry landing pages (/websites/[industry]) targeting buyer searches such as
 * "school website design in Nigeria". Each entry is written for that industry so pages
 * aren't thin duplicates. Package ids come from lib/service-offers.ts; price ranges for
 * bigger builds come from WEBSITE_TYPES in lib/tools/pricing.ts.
 *
 * Rule: only claim what the fixed packages include (pages, WhatsApp, enquiry forms, SEO
 * basics). Payments, booking engines and portals are listed as quoted add-ons.
 */

export type IndustryFeature = { title: string; why: string; addOn?: boolean };

export type Industry = {
  slug: string;
  /** Plural, for menus and headings: "Schools". */
  name: string;
  /** Search title (≤ ~60 chars before the site suffix). */
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  problems: string[];
  features: IndustryFeature[];
  /** Recommended fixed package (lib/service-offers.ts id). */
  packageId: string;
  packageReason: string;
  /** WEBSITE_TYPES id for the full-featured option. */
  fullBuildTypeId: string;
  fullBuildLabel: string;
  caseStudy?: { href: string; label: string };
  guide?: { href: string; label: string };
  faqs: { q: string; a: string }[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "schools",
    name: "Schools",
    seoTitle: "School Website Design in Nigeria — Fixed Price",
    seoDescription:
      "School websites for Nigerian nursery, primary and secondary schools: admissions enquiries, fees information, news and gallery, WhatsApp for parents. Fixed price, 50% deposit.",
    h1: "School website design in Nigeria",
    intro:
      "Parents check a school online before they visit. A clear, fast website with admissions information and an easy way to ask questions turns that research into enrolment enquiries.",
    problems: [
      "Parents can't find fees, admission steps or term dates without calling.",
      "Admission enquiries arrive scattered across phone calls and DMs and get lost.",
      "An outdated or missing site makes a good school look less established than competitors.",
    ],
    features: [
      { title: "Admissions page with clear steps", why: "Answers the questions parents ask most, before they call." },
      { title: "Enquiry form and WhatsApp for parents", why: "Every admission enquiry lands in one place you can follow up." },
      { title: "Fees, uniforms and term calendar", why: "Cuts repetitive calls to the front desk." },
      { title: "News, events and photo gallery", why: "Shows an active, well-run school — the strongest trust signal for parents." },
      { title: "Staff and facilities pages", why: "Helps parents compare you with other schools." },
      { title: "Online fee payment (Paystack)", why: "Parents pay fees and forms online; you get instant records.", addOn: true },
      { title: "Student portal, results and CBT exams", why: "Results, assignments and computer-based tests in one login.", addOn: true },
    ],
    packageId: "service-growth-website-deposit",
    packageReason: "Up to 10 pages covers admissions, fees, calendar, news and gallery, with enquiry forms and WhatsApp.",
    fullBuildTypeId: "school",
    fullBuildLabel: "School portal with payments, results and CBT",
    caseStudy: { href: "/case-studies/arqademy-cbt", label: "Arqademy CBT platform" },
    faqs: [
      {
        q: "How much does a school website cost in Nigeria?",
        a: "An informational school website with admissions, fees, news and gallery fits our Growth Website at a fixed price. Portals with online fee payment, results and CBT exams are custom builds, typically quoted from the school-portal range shown on this page.",
      },
      {
        q: "Can parents pay school fees on the website?",
        a: "Yes. We can add Paystack fee payment so parents pay online and the school gets instant payment records. It is quoted as an add-on because it depends on your fee structure.",
      },
      {
        q: "Can you add a student portal or CBT exams later?",
        a: "Yes. Many schools start with the website, then add a portal for results, assignments or computer-based tests once the site is live.",
      },
      {
        q: "Who updates the news and gallery?",
        a: "We can set it up so your staff can update it, or handle updates for you on a monthly care plan.",
      },
    ],
  },
  {
    slug: "clinics",
    name: "Clinics & hospitals",
    seoTitle: "Clinic & Hospital Website Design in Nigeria",
    seoDescription:
      "Websites for clinics, hospitals, dental and eye centres in Nigeria: services, doctors, opening hours, HMOs accepted and WhatsApp appointment requests. Fixed price, live in days.",
    h1: "Clinic and hospital website design in Nigeria",
    intro:
      "Patients search for a clinic when they need one now. Your website has to show what you treat, when you're open and how to book — in seconds, on a phone.",
    problems: [
      "Patients can't tell which services, specialists or HMOs you accept.",
      "Front desk phones are busy with questions the website could answer.",
      "Appointment requests arrive as missed calls and unanswered messages.",
    ],
    features: [
      { title: "Services and specialists pages", why: "Patients find the exact care they need and the right doctor." },
      { title: "Opening hours, location and map", why: "The first thing patients look for — make it one tap away." },
      { title: "WhatsApp appointment requests", why: "Patients request a slot in one message; your staff confirm it." },
      { title: "HMO and insurance list", why: "Answers the most common question before patients call." },
      { title: "Health tips and clinic updates", why: "Builds trust and helps the site appear in local Google searches." },
      { title: "Online booking calendar", why: "Patients pick a time slot themselves; reminders reduce no-shows.", addOn: true },
    ],
    packageId: "service-local-website-deposit",
    packageReason: "Up to 5 pages covers services, doctors, HMOs and contact, with WhatsApp on every page.",
    fullBuildTypeId: "booking",
    fullBuildLabel: "Clinic website with online booking calendar",
    guide: { href: "/blog/website-for-clinic-nigeria", label: "Guide: a clinic website that gets appointments" },
    faqs: [
      {
        q: "How much does a clinic website cost in Nigeria?",
        a: "A clinic website with services, doctors, HMOs and WhatsApp appointment requests fits our Local Business Website at a fixed price. A full online booking calendar with reminders is a larger build, priced from the booking-platform range on this page.",
      },
      {
        q: "Can patients book appointments online?",
        a: "Yes. The simplest option is WhatsApp appointment requests, included in the package. A self-service booking calendar can be added when you're ready.",
      },
      {
        q: "Do you handle patient records?",
        a: "The website handles enquiries and appointment requests, not medical records. Patient data stays in your clinic's own systems.",
      },
      {
        q: "Will my clinic show up on Google?",
        a: "Every site includes on-page SEO basics and a sitemap. Pairing it with an up-to-date Google Business Profile is the fastest way to appear in local searches.",
      },
    ],
  },
  {
    slug: "churches",
    name: "Churches",
    seoTitle: "Church Website Design in Nigeria — Fixed Price",
    seoDescription:
      "Church websites in Nigeria: service times, location, sermons and livestream links, events, ministries and online giving with Paystack. Fixed price, 50% deposit.",
    h1: "Church website design in Nigeria",
    intro:
      "New visitors look up a church before their first Sunday, and members want sermons and announcements during the week. A simple, warm website serves both.",
    problems: [
      "First-time visitors can't find service times or directions.",
      "Sermons, livestreams and announcements are scattered across platforms.",
      "Members abroad and at home want an easy, trustworthy way to give.",
    ],
    features: [
      { title: "Service times, location and map", why: "The first thing a new visitor needs." },
      { title: "Sermons and livestream links", why: "One home for YouTube, Facebook Live and audio messages." },
      { title: "Events and announcements", why: "Members check one place instead of long WhatsApp threads." },
      { title: "Ministries and leadership pages", why: "Helps newcomers find where they belong." },
      { title: "Prayer requests and contact via WhatsApp", why: "A simple, private way to reach the church." },
      { title: "Online giving (Paystack)", why: "Tithes and offerings by card or transfer, with receipts.", addOn: true },
    ],
    packageId: "service-local-website-deposit",
    packageReason: "Up to 5 pages covers service times, sermons, events and ministries, with WhatsApp contact.",
    fullBuildTypeId: "membership",
    fullBuildLabel: "Church platform with online giving and member area",
    guide: { href: "/blog/website-for-church-event-nigeria", label: "Guide: websites for churches and event centres" },
    faqs: [
      {
        q: "How much does a church website cost in Nigeria?",
        a: "A church website with service times, sermons, events and ministries fits our Local Business Website at a fixed price. Online giving and member areas are quoted as add-ons.",
      },
      {
        q: "Can members give tithes and offerings online?",
        a: "Yes. We integrate Paystack so members can give by card, bank transfer or USSD, including from abroad, and receive a receipt.",
      },
      {
        q: "Can the website show our livestream?",
        a: "Yes. We embed or link your YouTube or Facebook livestream so members can watch from the website.",
      },
      {
        q: "Can our media team update it?",
        a: "Yes. We can set up simple editing for announcements and sermons, or handle updates on a monthly care plan.",
      },
    ],
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    seoTitle: "Restaurant Website Design in Nigeria",
    seoDescription:
      "Restaurant websites in Nigeria: menu with prices, location and opening hours, WhatsApp orders and reservations, delivery areas and Google Maps. Fixed price, live in days.",
    h1: "Restaurant website design in Nigeria",
    intro:
      "Hungry customers decide in seconds. Show your menu, prices and how to order or reserve — and make the WhatsApp button impossible to miss.",
    problems: [
      "Customers DM to ask for the menu and prices every day.",
      "Orders through delivery apps cost you commission on every plate.",
      "People can't find your opening hours or exact location.",
    ],
    features: [
      { title: "Mobile menu with prices and photos", why: "The page customers open most — answers 'how much?' instantly." },
      { title: "Order and reserve on WhatsApp", why: "Direct orders with no app commission." },
      { title: "Opening hours, location and map", why: "Customers find you and know when you're open." },
      { title: "Delivery areas and fees", why: "Fewer back-and-forth messages before an order." },
      { title: "Events, catering and private bookings page", why: "Captures bigger, higher-value orders." },
      { title: "Online ordering with payment", why: "Customers order and pay online; you get a clean order list.", addOn: true },
    ],
    packageId: "service-local-website-deposit",
    packageReason: "Up to 5 pages covers menu, ordering via WhatsApp, location, catering and contact.",
    fullBuildTypeId: "ecommerce",
    fullBuildLabel: "Restaurant website with online ordering and payment",
    guide: { href: "/blog/website-for-restaurant-nigeria", label: "Guide: a restaurant website that brings orders" },
    faqs: [
      {
        q: "How much does a restaurant website cost in Nigeria?",
        a: "A restaurant website with menu, WhatsApp ordering, location and catering fits our Local Business Website at a fixed price. Full online ordering with payment is a larger build from the e-commerce range on this page.",
      },
      {
        q: "Can customers order directly from the website?",
        a: "Yes. The included option sends orders to your WhatsApp with the items chosen. Online ordering with card payment can be added later.",
      },
      {
        q: "Can I update the menu and prices myself?",
        a: "Yes. We can set up simple menu editing, or update it for you on a monthly care plan.",
      },
      {
        q: "Will it work with my Instagram page?",
        a: "Yes. We link your Instagram and can show recent posts, and your Instagram bio can point to your menu page.",
      },
    ],
  },
  {
    slug: "hotels",
    name: "Hotels & short-lets",
    seoTitle: "Hotel & Shortlet Website Design in Nigeria",
    seoDescription:
      "Websites for hotels, guest houses and shortlet apartments in Nigeria: rooms with photos and rates, booking requests on WhatsApp, deposits with Paystack and Google Maps. Fixed price.",
    h1: "Hotel and shortlet website design in Nigeria",
    intro:
      "Every booking through a listing platform costs commission. Your own website lets returning and referred guests book you directly — and shows new guests you're legitimate.",
    problems: [
      "Booking platforms take a commission on every reservation.",
      "Guests ask the same questions about rooms, rates and amenities.",
      "Without a proper website, guests worry whether the property is real.",
    ],
    features: [
      { title: "Rooms and apartments with photos and rates", why: "Guests compare options without messaging you first." },
      { title: "Booking requests on WhatsApp", why: "Direct bookings with no platform commission." },
      { title: "Amenities, policies and check-in details", why: "Answers questions before they're asked and sets expectations." },
      { title: "Location, map and nearby attractions", why: "Helps guests choose you for the area they need." },
      { title: "Guest reviews and photo gallery", why: "The trust signal that turns lookers into bookers." },
      { title: "Online deposits with Paystack", why: "Secure a booking with a payment before check-in.", addOn: true },
      { title: "Availability calendar and booking engine", why: "Guests see open dates and book instantly.", addOn: true },
    ],
    packageId: "service-growth-website-deposit",
    packageReason: "Up to 10 pages covers rooms, rates, amenities, gallery and location, with WhatsApp booking and a lead form.",
    fullBuildTypeId: "booking",
    fullBuildLabel: "Hotel website with availability calendar and deposits",
    guide: { href: "/blog/whatsapp-booking-system-nigeria", label: "Guide: WhatsApp booking systems" },
    faqs: [
      {
        q: "How much does a hotel or shortlet website cost in Nigeria?",
        a: "A hotel or shortlet website with rooms, rates, gallery and WhatsApp booking requests fits our Growth Website at a fixed price. An availability calendar with online deposits is a larger build from the booking-platform range on this page.",
      },
      {
        q: "Can guests pay a deposit online?",
        a: "Yes. We add Paystack so guests pay a deposit or full amount by card or transfer, quoted as an add-on.",
      },
      {
        q: "Will my own website replace booking platforms?",
        a: "Most properties use both: platforms bring new guests, and your website captures direct bookings from returning guests, referrals and social media — without commission.",
      },
      {
        q: "Can you show live room availability?",
        a: "Yes, with a booking engine add-on. The included version takes booking requests on WhatsApp, which most smaller properties start with.",
      },
    ],
  },
  {
    slug: "real-estate",
    name: "Real estate agents",
    seoTitle: "Real Estate Website Design in Nigeria",
    seoDescription:
      "Websites for real estate agents and developers in Nigeria: property listings with photos, enquiry forms and WhatsApp, inspection booking and a portfolio of past projects. Fixed price.",
    h1: "Real estate website design in Nigeria",
    intro:
      "Serious buyers and tenants want to see listings, prices and proof you're credible before they call. A professional property website does that and captures their details.",
    problems: [
      "Listings are scattered across WhatsApp statuses and social posts and are hard to share.",
      "Buyers worry about fraud and want proof the agency is real.",
      "Enquiries come in without the details you need to qualify them.",
    ],
    features: [
      { title: "Property listings with photos and prices", why: "One shareable link per property instead of resending pictures." },
      { title: "Enquiry form and WhatsApp on every listing", why: "Captures name, budget and timeline before you call back." },
      { title: "Inspection booking requests", why: "Turns interest into scheduled viewings." },
      { title: "Past projects, testimonials and registration details", why: "The credibility buyers look for before they pay anything." },
      { title: "Areas you cover", why: "Helps you appear when buyers search for a specific location." },
      { title: "Searchable listings with filters and admin panel", why: "Buyers filter by location, type and budget; your team adds listings.", addOn: true },
    ],
    packageId: "service-growth-website-deposit",
    packageReason: "Up to 10 pages covers featured listings, areas, past projects and contact, with WhatsApp and enquiry forms.",
    fullBuildTypeId: "realestate",
    fullBuildLabel: "Property platform with searchable listings and admin",
    caseStudy: { href: "/case-studies/imperial-villa", label: "Imperial Villa property platform" },
    guide: { href: "/blog/property-website-nigeria", label: "Guide: property websites in Nigeria" },
    faqs: [
      {
        q: "How much does a real estate website cost in Nigeria?",
        a: "An agency website with featured listings, areas, past projects and enquiry forms fits our Growth Website at a fixed price. A full property platform with searchable listings and an admin panel is priced from the real-estate range on this page.",
      },
      {
        q: "Can I add and update listings myself?",
        a: "Yes. With the property platform add-on your team gets an admin panel to add, edit and mark listings as sold or let.",
      },
      {
        q: "How does a website help with fraud concerns?",
        a: "A professional site with your registration details, office address, past projects and reviews gives buyers the verification they look for before paying.",
      },
      {
        q: "Have you built property websites before?",
        a: "Yes — see our Imperial Villa case study: a corporate website, client portal and internal management system for a property developer.",
      },
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
