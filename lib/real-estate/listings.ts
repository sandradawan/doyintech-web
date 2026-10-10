/**
 * Curated property listings for DoyinTech Real Estate search.
 * Google Maps scraping is not used (violates Google ToS).
 * Expand this catalog, connect a CRM, or add Google Places API later for nearby POIs only.
 */

export type DealType = "rent" | "buy";
export type PropertyType =
  | "flat"
  | "bungalow"
  | "duplex"
  | "terrace"
  | "mansion"
  | "studio"
  | "commercial";

export type PropertyListing = {
  id: string;
  title: string;
  dealType: DealType;
  propertyType: PropertyType;
  location: string;
  city: string;
  state: string;
  beds: number;
  baths: number;
  /** Display price in USD (site standard) */
  priceUsd: number;
  /** Optional original NGN for agent reference */
  priceNgn?: number;
  pricePeriod?: "month" | "year" | "total";
  description: string;
  features: string[];
  imageUrl: string;
  /** YouTube / external walkthrough */
  videoUrl?: string;
  agentName: string;
  agentPhone: string;
  agentWhatsApp: string;
  verified?: boolean;
};

export const PROPERTY_TYPES: { value: PropertyType | "any"; label: string }[] = [
  { value: "any", label: "Any type" },
  { value: "flat", label: "Flat / Apartment" },
  { value: "bungalow", label: "Bungalow" },
  { value: "duplex", label: "Duplex" },
  { value: "terrace", label: "Terrace" },
  { value: "mansion", label: "Mansion" },
  { value: "studio", label: "Studio" },
  { value: "commercial", label: "Commercial" },
];

/** Seed listings — replace/extend with live inventory */
export const LISTINGS: PropertyListing[] = [
  {
    id: "re-lag-001",
    title: "Modern 3-bed flat · Lekki Phase 1",
    dealType: "rent",
    propertyType: "flat",
    location: "Lekki Phase 1, Lagos",
    city: "Lagos",
    state: "Lagos",
    beds: 3,
    baths: 3,
    priceUsd: 1200,
    priceNgn: 1_860_000,
    pricePeriod: "year",
    description:
      "Bright apartment with fitted kitchen, prepaid meter, and estate security. Close to shops and the expressway.",
    features: ["Fitted kitchen", "Prepaid meter", "24/7 security", "POP ceiling"],
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    agentName: "Ada Property Desk",
    agentPhone: "+2348085343926",
    agentWhatsApp: "2348085343926",
    verified: true,
  },
  {
    id: "re-lag-002",
    title: "4-bed duplex for sale · Ikeja GRA",
    dealType: "buy",
    propertyType: "duplex",
    location: "Ikeja GRA, Lagos",
    city: "Lagos",
    state: "Lagos",
    beds: 4,
    baths: 4,
    priceUsd: 185000,
    priceNgn: 286_750_000,
    pricePeriod: "total",
    description:
      "Family duplex with BQ, ample parking, and solid finishing. Title documents available for serious buyers.",
    features: ["BQ", "Parking for 3", "Generator house", "Title docs ready"],
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    agentName: "GRA Homes Agency",
    agentPhone: "+2348085343926",
    agentWhatsApp: "2348085343926",
    verified: true,
  },
  {
    id: "re-abj-001",
    title: "2-bed furnished flat · Jabi",
    dealType: "rent",
    propertyType: "flat",
    location: "Jabi, Abuja",
    city: "Abuja",
    state: "FCT",
    beds: 2,
    baths: 2,
    priceUsd: 650,
    priceNgn: 1_007_500,
    pricePeriod: "year",
    description:
      "Furnished unit near Jabi Lake. Ideal for professionals. Water and power backup in compound.",
    features: ["Furnished", "Backup power", "Water treatment", "Estate road"],
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    agentName: "Capital Nest Realty",
    agentPhone: "+2348085343926",
    agentWhatsApp: "2348085343926",
    verified: true,
  },
  {
    id: "re-abj-002",
    title: "5-bed mansion · Maitama",
    dealType: "buy",
    propertyType: "mansion",
    location: "Maitama, Abuja",
    city: "Abuja",
    state: "FCT",
    beds: 5,
    baths: 6,
    priceUsd: 420000,
    priceNgn: 651_000_000,
    pricePeriod: "total",
    description:
      "Prestigious Maitama home with landscaped grounds, smart access, and premium finishes.",
    features: ["Smart access", "Garden", "Staff quarters", "CCTV"],
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    agentName: "Maitama Select",
    agentPhone: "+2348085343926",
    agentWhatsApp: "2348085343926",
    verified: true,
  },
  {
    id: "re-jos-001",
    title: "3-bed bungalow · Rayfield",
    dealType: "rent",
    propertyType: "bungalow",
    location: "Rayfield, Jos",
    city: "Jos",
    state: "Plateau",
    beds: 3,
    baths: 2,
    priceUsd: 280,
    priceNgn: 434_000,
    pricePeriod: "year",
    description:
      "Quiet bungalow with compound space. Good access road and nearby schools.",
    features: ["Compound space", "Borehole", "Tiled floors", "Quiet street"],
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    agentName: "Jos Homes Hub",
    agentPhone: "+2348085343926",
    agentWhatsApp: "2348085343926",
    verified: true,
  },
  {
    id: "re-jos-002",
    title: "4-bed terrace for sale · Rantya",
    dealType: "buy",
    propertyType: "terrace",
    location: "Rantya, Jos",
    city: "Jos",
    state: "Plateau",
    beds: 4,
    baths: 3,
    priceUsd: 42000,
    priceNgn: 65_100_000,
    pricePeriod: "total",
    description:
      "Newly finished terrace unit. Ideal starter home or investment property.",
    features: ["New finish", "Parking", "Kitchen cabinets", "Good drainage"],
    imageUrl:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
    agentName: "Plateau Properties",
    agentPhone: "+2348085343926",
    agentWhatsApp: "2348085343926",
  },
  {
    id: "re-ph-001",
    title: "Studio apartment · GRA Port Harcourt",
    dealType: "rent",
    propertyType: "studio",
    location: "GRA, Port Harcourt",
    city: "Port Harcourt",
    state: "Rivers",
    beds: 1,
    baths: 1,
    priceUsd: 320,
    priceNgn: 496_000,
    pricePeriod: "year",
    description: "Compact studio for singles or short stays. Secure compound.",
    features: ["Self-contained", "Secure gate", "Water heater"],
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    agentName: "PH Urban Lets",
    agentPhone: "+2348085343926",
    agentWhatsApp: "2348085343926",
  },
  {
    id: "re-en-001",
    title: "Commercial shop space · Ogui Road",
    dealType: "rent",
    propertyType: "commercial",
    location: "Ogui Road, Enugu",
    city: "Enugu",
    state: "Enugu",
    beds: 0,
    baths: 1,
    priceUsd: 400,
    priceNgn: 620_000,
    pricePeriod: "year",
    description: "Street-facing shop with high foot traffic. Suitable for retail or services.",
    features: ["Street front", "Roll-up shutter", "Metered power"],
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    agentName: "Eastern Commercial Desk",
    agentPhone: "+2348085343926",
    agentWhatsApp: "2348085343926",
  },
  {
    id: "re-ib-001",
    title: "5-bed duplex · Bodija",
    dealType: "buy",
    propertyType: "duplex",
    location: "Bodija, Ibadan",
    city: "Ibadan",
    state: "Oyo",
    beds: 5,
    baths: 5,
    priceUsd: 95000,
    priceNgn: 147_250_000,
    pricePeriod: "total",
    description: "Spacious Bodija duplex with family layout and outdoor space.",
    features: ["Outdoor space", "BQ", "Parking", "Quiet neighbourhood"],
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    agentName: "Ibadan Family Homes",
    agentPhone: "+2348085343926",
    agentWhatsApp: "2348085343926",
    verified: true,
  },
];

export type SearchFilters = {
  location?: string;
  propertyType?: PropertyType | "any" | "";
  dealType?: DealType | "any" | "";
  minBeds?: number;
  maxPriceUsd?: number;
};

export function searchListings(filters: SearchFilters): PropertyListing[] {
  const loc = (filters.location || "").trim().toLowerCase();
  const type = filters.propertyType || "any";
  const deal = filters.dealType || "any";
  const minBeds = filters.minBeds ?? 0;
  const maxPrice = filters.maxPriceUsd ?? Number.POSITIVE_INFINITY;

  return LISTINGS.filter((l) => {
    if (deal !== "any" && deal && l.dealType !== deal) return false;
    if (type !== "any" && type && l.propertyType !== type) return false;
    if (l.beds < minBeds) return false;
    if (l.priceUsd > maxPrice) return false;
    if (loc) {
      const hay = `${l.location} ${l.city} ${l.state} ${l.title}`.toLowerCase();
      if (!hay.includes(loc)) return false;
    }
    return true;
  }).sort((a, b) => a.priceUsd - b.priceUsd);
}

export function formatListingPrice(l: PropertyListing): string {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(l.priceUsd);

  if (l.dealType === "rent") {
    if (l.pricePeriod === "month") return `${amount}/mo`;
    return `${amount}/yr`;
  }
  return amount;
}

export function whatsappListingLink(l: PropertyListing): string {
  const text = encodeURIComponent(
    `Hi ${l.agentName}, I saw "${l.title}" (${l.id}) on DoyinTech. Is it still available?`
  );
  const phone = l.agentWhatsApp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${text}`;
}
