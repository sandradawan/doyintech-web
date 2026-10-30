/** Custom-system landing pages for high-intent searches. Prices are quoted after a scoping call. */
import type { SolutionPage } from "@/components/services/SolutionLanding";

const QUOTE_NOTE =
  "Every project gets a fixed price after a free 15-minute scoping call, before you pay anything. You pay 50% to start and 50% at launch, and you own the system and its data.";

export const SCHOOL: SolutionPage = {
  path: "/school-management-software-nigeria",
  product: "School management software",
  eyebrow: "For schools",
  h1: "School management software for Nigerian schools",
  intro:
    "Run admissions, fees, results and parent communication from one system your staff can actually use: built for Nigerian nursery, primary and secondary schools, with Paystack fee payments and result checking for parents.",
  outcomes: [
    "Parents pay fees online and get receipts automatically",
    "Teachers enter scores once; report cards generate themselves",
    "Parents check results with a PIN, no more printing scratch cards",
    "Admissions handled online, from enquiry to acceptance",
  ],
  pricing: QUOTE_NOTE,
  modules: [
    { title: "Admissions", items: ["Online application forms", "Entrance exam scheduling", "Admission letters", "Applicant pipeline"] },
    { title: "Fees and payments", items: ["Fee schedules by class and term", "Paystack card and transfer payments", "Automatic receipts", "Debtors list and reminders"] },
    { title: "Results and report cards", items: ["Score entry by subject teacher", "Automatic grading and positions", "Printable report cards", "Result checker for parents"] },
    { title: "Students and staff", items: ["Student records and class lists", "Attendance", "Staff records and roles", "Timetables"] },
    { title: "Parent communication", items: ["SMS and email notices", "WhatsApp-friendly links", "Events and newsletters", "Parent portal"] },
    { title: "CBT exams (optional)", items: ["Computer-based tests", "Question banks", "Auto-marking", "Practice for WAEC, NECO and JAMB"] },
  ],
  prompts: ["Fees and payments", "Report cards", "Result checker", "Admissions", "CBT exams", "School website"],
  faqs: [
    { q: "Do we need internet in the school?", a: "Staff need internet to enter scores and payments, but the system works on phones and low-bandwidth connections, and parents use it on their phones." },
    { q: "Can you move our existing records in?", a: "Yes. We import students, classes and fee balances from Excel or your current system." },
    { q: "Can parents pay school fees online?", a: "Yes, through Paystack by card, bank transfer or USSD. Each payment is matched to the student and a receipt is issued automatically." },
    { q: "Do you also build school websites?", a: "Yes, and the website can share the same login for parents. See our school websites page for examples." },
  ],
  related: [
    ["/websites/schools", "School websites"],
    ["/case-studies/arqademy-cbt", "Our CBT platform case study"],
    ["/hire", "Website packages"],
  ],
};

export const HOTEL: SolutionPage = {
  path: "/hotel-booking-website-nigeria",
  product: "Hotel booking website",
  eyebrow: "For hotels and short-lets",
  h1: "Hotel booking websites that take reservations directly",
  intro:
    "Stop paying agent commission on every booking and missing late-night WhatsApp enquiries. Guests see your rooms, prices and availability, then book and pay a deposit on your own website.",
  outcomes: [
    "Direct bookings with Paystack deposits or full payment",
    "Live room availability, so no double bookings",
    "Instant booking alerts to you and confirmation to the guest",
    "Your rooms, photos and reviews on your own brand",
  ],
  pricing: QUOTE_NOTE,
  modules: [
    { title: "Rooms and rates", items: ["Room types with photos", "Seasonal and weekend rates", "Discount codes", "Extra services (airport pickup, breakfast)"] },
    { title: "Booking engine", items: ["Availability calendar", "Deposit or full payment via Paystack", "Booking confirmation emails", "WhatsApp booking option"] },
    { title: "Front desk dashboard", items: ["Today's arrivals and departures", "Walk-in bookings", "Booking history and guests", "Revenue reports"] },
    { title: "Halls and events", items: ["Event hall listings", "Quote requests", "Deposits for events", "Calendar blocking"] },
    { title: "Short-let apartments", items: ["Multiple properties", "Caution deposits", "House rules and check-in guides", "Owner reports"] },
    { title: "Visibility", items: ["Google Business Profile", "Fast mobile pages", "Reviews section", "SEO for '<city> hotel' searches"] },
  ],
  prompts: ["Room booking", "Deposits online", "Front desk dashboard", "Event hall", "Short-let apartments", "Google Maps listing"],
  faqs: [
    { q: "Can I still take bookings on Booking.com and others?", a: "Yes. Many hotels keep agents for reach and use their own site to win repeat and direct guests without commission." },
    { q: "Can guests pay only a deposit?", a: "Yes. You choose a deposit percentage or full prepayment, and the balance is paid at check-in." },
    { q: "Does it work for a small guest house?", a: "Yes. We scale it down to a few rooms with simple WhatsApp-first booking if that suits you better." },
  ],
  related: [
    ["/websites/hotels", "Hotel websites"],
    ["/case-studies/imperial-villa", "Imperial Villa case study"],
    ["/google-business-profile-setup", "Get on Google Maps"],
  ],
};

export const ECOMMERCE: SolutionPage = {
  path: "/ecommerce-website-nigeria",
  product: "Ecommerce website",
  eyebrow: "For online stores",
  h1: "Ecommerce websites for Nigerian brands",
  intro:
    "Your own online store with your domain and brand: products, cart, Paystack checkout, delivery fees by location and an order dashboard. Built for brands outgrowing Instagram DMs and marketplace fees.",
  outcomes: [
    "Customers pay by card, transfer or USSD and you get the order instantly",
    "Delivery fees calculated by area at checkout",
    "Stock, orders and customers in one dashboard",
    "Fast mobile pages that turn Instagram traffic into sales",
  ],
  pricing: `${QUOTE_NOTE} Selling a handful of products? Start with a free DoyinTech shop and upgrade when you're ready.`,
  modules: [
    { title: "Catalogue", items: ["Products with variants (size, colour)", "Categories and search", "Stock tracking", "Bulk upload from Excel"] },
    { title: "Checkout", items: ["Paystack payments", "Delivery fees by state or area", "Discount codes", "Guest checkout"] },
    { title: "Orders", items: ["Order dashboard", "Status updates by email and WhatsApp", "Invoices and receipts", "Returns notes"] },
    { title: "Marketing", items: ["Meta Pixel and Google Analytics", "Abandoned cart emails", "Email sign-ups", "SEO-friendly product pages"] },
    { title: "Wholesale (optional)", items: ["Trade price lists", "Minimum order quantities", "Quote requests", "Distributor accounts"] },
    { title: "Your brand", items: ["Your own domain", "Custom design", "Business email", "Google Business Profile"] },
  ],
  prompts: ["Paystack checkout", "Delivery fees", "Product variants", "Wholesale prices", "Instagram shopping", "Migrate from another platform"],
  faqs: [
    { q: "How is this different from the free DoyinTech shop?", a: "The free shop is a ready-made page on doyintech.com for getting started. An ecommerce website is your own store on your domain with your design, variants, stock, marketing tools and integrations." },
    { q: "Who handles delivery?", a: "You keep your own dispatch riders or logistics partner. The site calculates delivery fees by area and sends order details to whoever delivers." },
    { q: "Can you move my products from Instagram or another platform?", a: "Yes. Send a spreadsheet or your current store export and we import products, prices and images." },
  ],
  related: [
    ["/stores", "Start with a free shop"],
    ["/case-studies/doyinmart", "DoyinMart case study"],
    ["/business-email-domain-nigeria", "Domain and business email"],
  ],
};
