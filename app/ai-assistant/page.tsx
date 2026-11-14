import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import LeadForm from "@/components/ui/LeadForm";

const TITLE = "AI Customer Assistant for Your Business Website and WhatsApp";
const DESCRIPTION =
  "An AI assistant that answers customer questions, collects booking requests and captures leads on your website and WhatsApp. Setup from ₦75,000, support from ₦25,000 a month.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/ai-assistant" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/ai-assistant" },
};

const DOES = [
  { t: "Answers questions", d: "Prices, opening hours, location, services and policies, from information you give us." },
  { t: "Takes booking requests", d: "Collects the date, time and details, then your staff confirm. It never double-books on its own." },
  { t: "Captures leads", d: "Gets the name and number of every serious enquiry and sends it to you straight away." },
  { t: "Sends quotes and follow-ups", d: "Drafts quotations from your price list and reminds people who went quiet." },
  { t: "Hands over to a person", d: "Passes the chat to your team when a customer asks, or when it does not know the answer." },
  { t: "Reports every month", d: "What customers asked, how many leads came in, and what to add to its knowledge." },
];

const PLANS = [
  {
    name: "Basic",
    setup: "₦75,000 – ₦150,000",
    fit: "One website chat assistant trained on your FAQs, prices and services.",
    items: ["Website chat", "Up to 50 questions and answers", "Lead capture to email", "1 round of changes"],
  },
  {
    name: "Business",
    setup: "₦150,000 – ₦350,000",
    fit: "Website and WhatsApp, with booking requests and quotes.",
    items: ["Website chat and WhatsApp Business", "Booking and quote requests", "Leads to email and a dashboard", "Staff handover"],
    featured: true,
  },
  {
    name: "Advanced",
    setup: "₦350,000 – ₦750,000",
    fit: "Connected to your booking, CRM or stock system.",
    items: ["Everything in Business", "Integration with your systems", "Several branches or departments", "Custom reports"],
  },
];

const FOR = ["Hotels and short lets", "Restaurants", "Salons and spas", "Schools and training centres", "Clinics", "Property and estate agents"];

export default function AiAssistantPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
          <p className="section-eyebrow">DoyinTech AI Assistant</p>
          <h1 className="mt-3 max-w-3xl text-[36px] font-semibold leading-[1.08] tracking-tight text-brand-ink sm:text-[52px]">
            Answer every customer, even when you are busy.
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-brand-muted">
            An AI assistant on your website and WhatsApp that answers questions, collects booking requests and sends you every lead. Your team
            stays in charge: it never confirms a booking or a payment on its own.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#quote" className="apple-btn apple-btn-primary">Get a quote</a>
            <Link href="/book-call" className="apple-btn apple-btn-secondary">Book a free call</Link>
          </div>
          <p className="mt-6 text-[14px] text-brand-subtle">Built for: {FOR.join(" · ")}</p>

          <section className="mt-16">
            <h2 className="text-[28px] font-semibold tracking-tight text-brand-ink sm:text-[36px]">What it does</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DOES.map((x) => (
                <li key={x.t} className="apple-card p-6">
                  <p className="text-[18px] font-semibold text-brand-ink">{x.t}</p>
                  <p className="mt-2 text-[15px] leading-snug text-brand-muted">{x.d}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-20" aria-labelledby="ai-pricing">
            <h2 id="ai-pricing" className="text-[28px] font-semibold tracking-tight text-brand-ink sm:text-[36px]">Pricing</h2>
            <p className="mt-3 max-w-2xl text-[16px] text-brand-muted">
              A one-off setup fee, then a monthly plan from ₦25,000 that covers hosting, AI usage within an agreed limit, updates and support.
              You get a fixed quote before you pay anything.
            </p>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {PLANS.map((p) => (
                <article key={p.name} className={`apple-card relative flex flex-col p-6 ${p.featured ? "ring-1 ring-brand-link/50" : ""}`}>
                  {p.featured && (
                    <span className="absolute -top-3 left-6 rounded-full bg-brand-accent px-3 py-1 text-[11px] font-semibold text-black">Most chosen</span>
                  )}
                  <h3 className="text-[20px] font-semibold text-brand-ink">{p.name}</h3>
                  <p className="mt-3 text-[24px] font-semibold tracking-tight text-brand-ink">{p.setup}</p>
                  <p className="text-[13px] text-brand-subtle">one-off setup · then from ₦25,000/month</p>
                  <p className="mt-4 text-[14px] text-brand-muted">{p.fit}</p>
                  <ul className="mt-4 space-y-2">
                    {p.items.map((i) => (
                      <li key={i} className="flex gap-2 text-[14px] text-brand-ink/90">
                        <span className="text-brand-link">✓</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <p className="mt-4 text-[13px] text-brand-subtle">
              WhatsApp Business messaging fees from Meta are billed at cost. Heavy use above your plan&apos;s limit is quoted before it is charged.
            </p>
          </section>

          <section id="quote" className="mt-20 grid scroll-mt-28 gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight text-brand-ink sm:text-[36px]">Get a quote</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-brand-muted">
                Tell us about your business and where customers contact you. We reply within one working day with a fixed price and a
                timeline, usually 1–2 weeks.
              </p>
            </div>
            <LeadForm
              product="AI Assistant"
              source="ai-assistant"
              button="Get my quote"
              choice={{ label: "Plan", options: ["Basic", "Business", "Advanced", "Not sure yet"] }}
              messageLabel="Your business and what customers ask most"
              messagePlaceholder="E.g. a 20-room hotel in Jos; guests ask about prices and availability on WhatsApp"
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
