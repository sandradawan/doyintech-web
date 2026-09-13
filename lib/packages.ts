export type ServicePackage = {
  id: string;
  name: string;
  tagline: string;
  priceUsd: string;
  priceNgn: string;
  timeline: string;
  featured?: boolean;
  badge?: string;
  features: string[];
  idealFor: string;
  ctaLabel: string;
};

/**
 * Productized offers for conversion.
 * USD for international clients; NGN for local Nigerian market.
 * Prices are starting ranges — final quote after discovery.
 */
export const PACKAGES: ServicePackage[] = [
  {
    id: "starter-website",
    name: "Starter Business Website",
    tagline: "A professional site that makes you look established.",
    priceUsd: "From $450",
    priceNgn: "₦180,000 – ₦350,000",
    timeline: "7–14 days",
    features: [
      "Up to 5 pages (Home, About, Services, Portfolio, Contact)",
      "Mobile-responsive design",
      "WhatsApp click-to-chat",
      "Contact form + basic SEO",
      "1 revision round",
      "1 week post-launch support",
    ],
    idealFor: "New businesses, freelancers, and small shops",
    ctaLabel: "Get Starter Website",
  },
  {
    id: "growth-website",
    name: "Growth Website",
    tagline: "More pages, stronger conversion, ready to rank.",
    priceUsd: "From $900",
    priceNgn: "₦350,000 – ₦650,000",
    timeline: "2–4 weeks",
    featured: true,
    badge: "Most popular",
    features: [
      "Up to 10 pages + blog setup",
      "Custom design matching your brand",
      "Lead form + WhatsApp integration",
      "Speed & SEO optimization",
      "Google Analytics / Meta pixel ready",
      "2 revision rounds + 2 weeks support",
    ],
    idealFor: "Growing SMEs that need leads, not just a brochure",
    ctaLabel: "Get Growth Website",
  },
  {
    id: "whatsapp-booking",
    name: "WhatsApp + Booking System",
    tagline: "Customers book and chat without friction.",
    priceUsd: "From $600",
    priceNgn: "₦250,000 – ₦600,000",
    timeline: "2–3 weeks",
    features: [
      "Booking / appointment flow",
      "WhatsApp notifications",
      "Admin dashboard for bookings",
      "Optional payments link integration",
      "Mobile-first experience",
      "Staff training handover",
    ],
    idealFor: "Clinics, hotels, salons, restaurants, service businesses",
    ctaLabel: "Build Booking System",
  },
  {
    id: "webapp-crm",
    name: "Web App / CRM",
    tagline: "Custom systems that run your operations.",
    priceUsd: "From $2,000",
    priceNgn: "₦800,000 – ₦2,500,000+",
    timeline: "4–12 weeks",
    features: [
      "Custom dashboards & roles",
      "Client / staff management",
      "Secure auth & database design",
      "API integrations as needed",
      "Admin panel + documentation",
      "Launch support & training",
    ],
    idealFor: "Property, fintech, logistics, multi-branch businesses",
    ctaLabel: "Scope My Web App",
  },
];

export const MAINTENANCE = {
  id: "maintenance",
  name: "Monthly Care Plan",
  tagline: "Keep your site fast, secure, and updated.",
  priceUsd: "From $80 / month",
  priceNgn: "₦50,000 – ₦150,000 / month",
  features: [
    "Security updates & backups",
    "Uptime monitoring",
    "Small content changes",
    "Priority WhatsApp support",
    "Monthly performance check",
  ],
};

export function packageWhatsAppLink(packageName: string): string {
  const text = `Hi DoyinTech, I'm interested in the "${packageName}" package. I'd like a free discovery call.`;
  return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
}

export function discoveryCallLink(): string {
  const text =
    "Hi DoyinTech, I'd like to book a free 15-minute discovery call about a project.";
  return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
}
