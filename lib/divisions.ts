/**
 * DoyinTech's three divisions (2027 plan): Solutions earns project cash, Cloud earns monthly
 * subscriptions, Digital earns product sales. The homepage, the menu and the hub pages all read
 * from here so they never disagree.
 */

export type Offer = { name: string; href: string; price: string; desc: string };
export type Division = {
  id: "solutions" | "cloud" | "digital";
  href: string;
  name: string;
  short: string;
  promise: string;
  intro: string;
  earns: string;
  offers: Offer[];
};

export const DIVISIONS: Division[] = [
  {
    id: "solutions",
    href: "/solutions",
    name: "DoyinTech Solutions",
    short: "Solutions",
    promise: "Websites, software and automation built for your business.",
    intro:
      "Fixed-price websites, booking systems, CRMs, mobile apps and AI assistants. You pay a 50% deposit, we build, and we look after it once it is live.",
    earns: "Projects and monthly care plans",
    offers: [
      { name: "Business websites", href: "/hire", price: "From ₦100,000", desc: "Landing pages and business sites, live in 1–2 weeks." },
      { name: "AI Assistant for your business", href: "/ai-assistant", price: "Setup from ₦75,000", desc: "Answers customers, takes bookings and captures leads." },
      { name: "Booking and hotel systems", href: "/hotel-booking-website-nigeria", price: "From ₦250,000", desc: "Rooms, appointments, payments and WhatsApp alerts." },
      { name: "School management software", href: "/school-management-software-nigeria", price: "Custom quote", desc: "Results, fees, attendance and a parents' portal." },
      { name: "Property management system", href: "/solutions#property", price: "Custom quote", desc: "Listings, tenants, rent reminders and agent dashboards." },
      { name: "Custom web apps and CRMs", href: "/services", price: "Custom quote", desc: "Backend, APIs, mobile apps and integrations." },
      { name: "Online shops", href: "/ecommerce-website-nigeria", price: "Quote after a call", desc: "Sell online and get paid with Paystack." },
      { name: "Website care plans", href: "/care-plans", price: "From ₦50,000/month", desc: "Security, backups, updates and fixes every month." },
      { name: "White-label for agencies", href: "/white-label", price: "Per project", desc: "We build, you sell under your brand." },
    ],
  },
  {
    id: "cloud",
    href: "/cloud",
    name: "DoyinTech Cloud",
    short: "Cloud",
    promise: "Software you subscribe to and use every day.",
    intro:
      "Run your clients, deals, invoices and follow-ups in one place, and unlock every premium DoyinTech tool with one membership.",
    earns: "Monthly and yearly subscriptions",
    offers: [
      { name: "DoyinOps business manager", href: "/ops", price: "Included in Pro", desc: "Contacts, pipeline, invoices and tasks for small businesses." },
      { name: "DoyinTech Pro", href: "/pro", price: "₦5,000/month", desc: "Every premium tool plus DoyinOps cloud sync. Cancel any time." },
      { name: "AI Assistant subscription", href: "/ai-assistant", price: "From ₦25,000/month", desc: "Your assistant kept trained, monitored and improved." },
      { name: "Client portal", href: "/client-portal", price: "For our clients", desc: "Track your project, files and payments online." },
      { name: "Report Studio", href: "/reports", price: "Per report", desc: "Brand and social presence reports for your business." },
    ],
  },
  {
    id: "digital",
    href: "/digital",
    name: "DoyinTech Digital",
    short: "Digital",
    promise: "Templates, ebooks, code and training you can use today.",
    intro:
      "Download business templates, ebooks and developer code, or learn to build software with DoyinTech Academy. Pay once with Paystack and download straight away.",
    earns: "Product sales, courses and seller commissions",
    offers: [
      { name: "Business templates and kits", href: "/products", price: "From ₦2,000", desc: "HR, payroll, office, school and student packs." },
      { name: "Ebooks", href: "/ebooks", price: "From ₦4,500", desc: "Business, Excel, bookkeeping, AI and careers." },
      { name: "Next.js website templates", href: "/templates", price: "From ₦32,000", desc: "Ready-made landing pages for developers." },
      { name: "UI components", href: "/components", price: "From ₦2,000", desc: "Next.js and Tailwind blocks to drop into your app." },
      { name: "Sell your code with us", href: "/sell", price: "Commission on sales", desc: "Developers: list scripts, templates and kits." },
      { name: "DoyinTech Academy", href: "https://doyintechacademy.vercel.app", price: "Courses and mentorship", desc: "Practical web, backend and AI development training." },
      { name: "Gift cards", href: "/gift-cards", price: "Any amount", desc: "Give a website, templates or Pro membership." },
      { name: "Free online shop", href: "/stores", price: "Free to start", desc: "Sell on WhatsApp with one link." },
    ],
  },
];

export function getDivision(id: Division["id"]): Division {
  return DIVISIONS.find((d) => d.id === id)!;
}
