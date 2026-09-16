/**
 * DoyinTech 30-day revenue focus (CEO operating plan).
 * Cash now = services + low-ticket digital. Traffic = free audit + tools.
 */

export const REVENUE_OFFERS = [
  {
    id: "service-landing",
    path: "New · entry price",
    title: "Landing Page Starter",
    price: "₦100,000",
    href: "/hire",
    wa: "Hi DoyinTech, I want the Landing Page Starter (₦100,000).",
    pitch:
      "One page that sells one offer. Deposit ₦50,000. Best starter for coaches and new shops.",
  },
  {
    id: "service-local",
    path: "Cash this week",
    title: "Local Business Website",
    price: "₦250,000",
    href: "/hire",
    wa: "Hi DoyinTech, I want the Local Business Website package.",
    pitch: "Up to 5 pages, WhatsApp-ready. Ideal for salons, property, cleaners, clinics.",
  },
  {
    id: "product-whatsapp",
    path: "Sell while you sleep",
    title: "SME Launch Bundle",
    price: "From ₦19,500",
    href: "/products",
    wa: "Hi DoyinTech, I want the SME Launch Bundle from the products page.",
    pitch: "Status calendar + captions — pay online, instant download.",
  },
  {
    id: "ebooks",
    path: "Low-ticket volume",
    title: "Practical Ebooks",
    price: "From ₦6,500",
    href: "/ebooks",
    wa: "Hi DoyinTech, I want to buy an ebook from your store.",
    pitch: "Digital marketing, affiliate, SMM, VA, WhatsApp — pay and unlock on site.",
  },
  {
    id: "components",
    path: "Developer market",
    title: "Next.js Components & Templates",
    price: "From ₦2,000",
    href: "/components",
    wa: "Hi DoyinTech, I want a Next.js component or template.",
    pitch: "Real demos, full source after Paystack.",
  },
  {
    id: "audit",
    path: "Traffic magnet",
    title: "Free 3-minute Website Audit",
    price: "Free",
    href: "/free-audit",
    wa: "Hi DoyinTech, I want a free website audit. My URL is: ",
    pitch: "Hook for businesses — problems first, then paid fix.",
  },
] as const;

export function waLink(message: string) {
  return "https://wa.me/2348085343926?text=" + encodeURIComponent(message);
}
