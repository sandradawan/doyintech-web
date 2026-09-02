/** Central config — edit WhatsApp, email, Academy URL, brand here */
export const TOOLS_CONFIG = {
  brand: "DoyinTech",
  siteUrl: "https://doyintech.vercel.app",
  academyUrl: "https://doyintechacademy.vercel.app",
  email: "doyintechnology@outlook.com",
  whatsappNumber: "2348085343926", // digits only, no +
  phoneDisplay: "+234 808 534 3926",
  currency: "NGN" as const,
  currencySymbol: "₦",
} as const;

export function whatsappUrl(message: string) {
  return `https://wa.me/${TOOLS_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const TOOLS_META = [
  {
    slug: "website-calculator",
    href: "/tools/website-calculator",
    title: "Website Price Calculator",
    short: "Estimate what your website project could cost.",
    description:
      "Interactive website development cost estimator for Nigerian businesses. Get an estimated project range in Naira.",
    icon: "calculator",
  },
  {
    slug: "business-audit",
    href: "/tools/business-audit",
    title: "Business Audit Tool",
    short: "Discover what's holding your business back online.",
    description:
      "Free online business digital audit. Score your website, SEO, payments, and social presence.",
    icon: "audit",
  },
  {
    slug: "cv-builder",
    href: "/tools/cv-builder",
    title: "CV & Portfolio Builder",
    short: "Create a professional CV and portfolio.",
    description:
      "Free professional CV and portfolio generator for students, developers, and job seekers in Nigeria.",
    icon: "cv",
  },
  {
    slug: "digital-readiness",
    href: "/tools/digital-readiness",
    title: "Digital Readiness Checker",
    short: "Measure how ready your business is for the digital economy.",
    description:
      "Assess your business digital transformation readiness across presence, payments, marketing, and security.",
    icon: "readiness",
  },
] as const;
