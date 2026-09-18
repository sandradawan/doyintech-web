/**
 * DoyinTech outreach playbook
 * Map prospect weakness → offer → message angle
 * You send the messages; this is the operating system.
 */

export type WeaknessId =
  | "no_website"
  | "outdated_site"
  | "no_mobile"
  | "no_whatsapp_cta"
  | "no_booking"
  | "no_online_pay"
  | "weak_google"
  | "manual_ops"
  | "no_security"
  | "content_chaos"
  | "needs_learning";

export type OfferId =
  | "free_audit"
  | "landing_starter"
  | "local_website"
  | "growth_website"
  | "whatsapp_booking"
  | "ai_automation"
  | "security"
  | "doyinops"
  | "sme_bundle"
  | "ebooks"
  | "components"
  | "hire";

export type WeaknessOffer = {
  id: WeaknessId;
  label: string;
  howToSpot: string[];
  primaryOffer: OfferId;
  secondaryOffer?: OfferId;
  productUrl: string;
  serviceUrl: string;
  pitchOneLiner: string;
};

const SITE = "https://doyintech.vercel.app";

export const WEAKNESS_MAP: WeaknessOffer[] = [
  {
    id: "no_website",
    label: "No website",
    howToSpot: ["Google Business only", "Instagram-only", "WhatsApp number in bio, no domain"],
    primaryOffer: "landing_starter",
    secondaryOffer: "sme_bundle",
    productUrl: `${SITE}/products`,
    serviceUrl: `${SITE}/hire`,
    pitchOneLiner: "Customers search you and find nothing professional — a one-page site that sends them to WhatsApp fixes that.",
  },
  {
    id: "outdated_site",
    label: "Outdated / broken site",
    howToSpot: ["Looks 2015", "Flashy junk", "Broken links", "Slow load", "Desktop-only layout"],
    primaryOffer: "local_website",
    secondaryOffer: "free_audit",
    productUrl: `${SITE}/free-audit`,
    serviceUrl: `${SITE}/hire`,
    pitchOneLiner: "Your site is costing trust — a clean rebuild with clear CTAs recovers enquiries.",
  },
  {
    id: "no_mobile",
    label: "Not mobile-friendly",
    howToSpot: ["Tiny text on phone", "Horizontal scroll", "Buttons hard to tap"],
    primaryOffer: "local_website",
    secondaryOffer: "free_audit",
    productUrl: `${SITE}/free-audit`,
    serviceUrl: `${SITE}/hire`,
    pitchOneLiner: "Most of your customers are on phones — if the site fails there, leads never arrive.",
  },
  {
    id: "no_whatsapp_cta",
    label: "No clear WhatsApp / contact path",
    howToSpot: ["Contact form only", "Email buried", "No click-to-chat"],
    primaryOffer: "whatsapp_booking",
    secondaryOffer: "landing_starter",
    productUrl: `${SITE}/hire`,
    serviceUrl: `${SITE}/hire`,
    pitchOneLiner: "Make the next step one tap: WhatsApp + clear offer on every page.",
  },
  {
    id: "no_booking",
    label: "No online booking",
    howToSpot: ["Salon/clinic/hotel with call-only", "Book via DM only"],
    primaryOffer: "whatsapp_booking",
    secondaryOffer: "local_website",
    productUrl: `${SITE}/hire`,
    serviceUrl: `${SITE}/hire`,
    pitchOneLiner: "Turn DMs into structured bookings so you stop losing appointments in chat chaos.",
  },
  {
    id: "no_online_pay",
    label: "No online payment / invoices",
    howToSpot: ["Bank transfer only", "No receipts", "Manual invoicing"],
    primaryOffer: "doyinops",
    secondaryOffer: "local_website",
    productUrl: `${SITE}/ops`,
    serviceUrl: `${SITE}/hire`,
    pitchOneLiner: "Track clients, quotes, and invoices in one place — less chasing, faster paid.",
  },
  {
    id: "weak_google",
    label: "Weak Google presence",
    howToSpot: ["No GBP", "Wrong NAP", "Zero reviews", "Site not indexed"],
    primaryOffer: "free_audit",
    secondaryOffer: "local_website",
    productUrl: `${SITE}/free-audit`,
    serviceUrl: `${SITE}/hire`,
    pitchOneLiner: "People search near you and never find you — we fix the digital storefront first.",
  },
  {
    id: "manual_ops",
    label: "Everything is manual",
    howToSpot: ["Excel only", "Forgot follow-ups", "No pipeline"],
    primaryOffer: "doyinops",
    secondaryOffer: "ai_automation",
    productUrl: `${SITE}/ops`,
    serviceUrl: `${SITE}/services`,
    pitchOneLiner: "Run follow-ups, quotes, and invoices without living in your head or WhatsApp archive.",
  },
  {
    id: "no_security",
    label: "Security / trust risk",
    howToSpot: ["No HTTPS", "Mixed content", "Old WordPress", "Customer data on forms"],
    primaryOffer: "security",
    secondaryOffer: "free_audit",
    productUrl: `${SITE}/tools`,
    serviceUrl: `${SITE}/services`,
    pitchOneLiner: "A basic security pass protects customers and your reputation before a problem hits.",
  },
  {
    id: "content_chaos",
    label: "Posts but no system",
    howToSpot: ["Random Status", "No captions plan", "Inconsistent brand"],
    primaryOffer: "sme_bundle",
    secondaryOffer: "ebooks",
    productUrl: `${SITE}/products`,
    serviceUrl: `${SITE}/products`,
    pitchOneLiner: "Stop guessing what to post — use a 30-day Status system built for Nigerian SMEs.",
  },
  {
    id: "needs_learning",
    label: "Wants skills, not a full build",
    howToSpot: ["Asks how-to", "Student/VA/affiliate", "Budget under ₦20k"],
    primaryOffer: "ebooks",
    secondaryOffer: "components",
    productUrl: `${SITE}/ebooks`,
    serviceUrl: `${SITE}/products`,
    pitchOneLiner: "Practical guides you can use this week — digital marketing, WhatsApp, VA, affiliate.",
  },
];

export const OFFER_LINKS: Record<OfferId, { name: string; url: string; priceHint: string }> = {
  free_audit: { name: "Free 3-min audit", url: `${SITE}/free-audit`, priceHint: "Free" },
  landing_starter: { name: "Landing Page Starter", url: `${SITE}/hire`, priceHint: "₦100,000 (₦50k deposit)" },
  local_website: { name: "Local Business Website", url: `${SITE}/hire`, priceHint: "₦250,000" },
  growth_website: { name: "Growth Website", url: `${SITE}/hire`, priceHint: "From ~₦180k–₦350k" },
  whatsapp_booking: { name: "WhatsApp + Booking System", url: `${SITE}/hire`, priceHint: "From ₦250,000" },
  ai_automation: { name: "AI / WhatsApp automation", url: `${SITE}/services`, priceHint: "Custom" },
  security: { name: "Security & hardening", url: `${SITE}/services`, priceHint: "Custom" },
  doyinops: { name: "DoyinOps workspace", url: `${SITE}/ops`, priceHint: "Free to start" },
  sme_bundle: { name: "SME Launch Bundle", url: `${SITE}/products`, priceHint: "From ₦19,500" },
  ebooks: { name: "Practical ebooks", url: `${SITE}/ebooks`, priceHint: "From ₦6,500" },
  components: { name: "UI components / templates", url: `${SITE}/components`, priceHint: "From low ticket" },
  hire: { name: "Hire / packages", url: `${SITE}/hire`, priceHint: "Fixed packages" },
};

/** Daily operating targets */
export const OUTREACH_TARGETS = {
  prospectsPerDay: 25,
  messagesPerDay: 20,
  auditsOfferedPerDay: 10,
  followUpsPerDay: 10,
};
