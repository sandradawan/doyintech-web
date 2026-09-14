/**
 * DoyinTech 30-day revenue focus (CEO operating plan).
 * Cash now = services + low-ticket digital. Traffic = free audit + tools.
 */

export const REVENUE_OFFERS = [
  {
    id: "service-growth",
    path: "Cash this week",
    title: "Growth Website",
    price: "From ₦350,000",
    href: "/pricing",
    wa: "Hi DoyinTech, I want the Growth Website package. Book me a discovery call.",
    pitch: "Custom site + leads + WhatsApp. Ideal for SMEs ready to pay for results.",
  },
  {
    id: "product-prompt",
    path: "Sell while you sleep",
    title: "AI Business Prompt Pack",
    price: "₦12,000",
    href: "/products",
    wa: "Hi DoyinTech, I want the ChatGPT + Claude Business Prompt Pack.",
    pitch: "What freelancers paste into ChatGPT/Claude daily — proposals, ads, WhatsApp.",
  },
  {
    id: "product-whatsapp",
    path: "Best digital seller",
    title: "WhatsApp Growth Pack",
    price: "₦25,000",
    href: "/products",
    wa: "Hi DoyinTech, I want the WhatsApp Business Growth Pack.",
    pitch: "Scripts, menus, follow-ups for shops and service businesses.",
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
    price: "From ₦5,000",
    href: "/components",
    wa: "Hi DoyinTech, I want a Next.js component or template.",
    pitch: "Real demos, full source after Paystack — registry for AI agents too.",
  },
  {
    id: "audit",
    path: "Traffic magnet",
    title: "Free 3-minute Website Audit",
    price: "Free",
    href: "/free-audit",
    wa: "Hi DoyinTech, I want a free website audit. My URL is: ",
    pitch: "Hook for US/UK/NG businesses — problems first, then paid fix.",
  },
] as const;

export function waLink(message: string) {
  return "https://wa.me/2348085343926?text=" + encodeURIComponent(message);
}
