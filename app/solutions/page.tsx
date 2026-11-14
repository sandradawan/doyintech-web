import type { Metadata } from "next";
import DivisionHub from "@/components/sections/DivisionHub";
import LeadForm from "@/components/ui/LeadForm";
import { getDivision } from "@/lib/divisions";

const TITLE = "Websites, Business Software and AI Automation in Nigeria";
const DESCRIPTION =
  "DoyinTech Solutions builds websites, booking systems, school and property management software, CRMs and AI assistants for businesses in Nigeria and abroad.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/solutions" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/solutions" },
};

const PROPERTY = [
  "Property listings with photos and verified agents",
  "Tenant records, leases and rent due dates",
  "Rent reminders by WhatsApp and email",
  "Payment tracking and arrears reports",
  "Maintenance requests from tenants",
  "Landlord and agent dashboards",
];

export default function SolutionsPage() {
  return (
    <DivisionHub division={getDivision("solutions")}>
      <section id="property" className="mt-20 scroll-mt-28 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="section-eyebrow">For landlords, agents and estates</p>
          <h2 className="mt-3 text-[28px] font-semibold tracking-tight text-brand-ink sm:text-[36px]">Property management system</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-brand-muted">
            Stop tracking rent in notebooks and WhatsApp chats. We set up a system for your properties, tenants and payments, built around
            how you already work.
          </p>
          <ul className="mt-5 space-y-2">
            {PROPERTY.map((p) => (
              <li key={p} className="flex gap-2 text-[15px] text-brand-ink/90">
                <span className="text-brand-link">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <LeadForm
          product="Property management system"
          source="solutions-property"
          button="Ask for a quote"
          choice={{ label: "How many units do you manage?", options: ["1–10", "11–50", "51–200", "More than 200"] }}
          messagePlaceholder="E.g. 3 estates in Abuja, rent collected monthly"
        />
      </section>

      <section className="mt-20 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="section-eyebrow">Something else?</p>
          <h2 className="mt-3 text-[28px] font-semibold tracking-tight text-brand-ink sm:text-[36px]">Tell us what you need built</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-brand-muted">
            Web apps, CRMs, APIs, mobile apps, payment integrations and internal tools. We reply with a fixed quote and timeline. Custom
            projects start with a 60% deposit, and changes to the agreed scope are quoted separately.
          </p>
        </div>
        <LeadForm
          product="Custom software project"
          source="solutions"
          button="Get a quote"
          choice={{ label: "Your budget", options: ["Under ₦250,000", "₦250,000–₦600,000", "₦600,000–₦2,500,000", "Above ₦2,500,000", "Not sure yet"] }}
          messageLabel="What should it do?"
          messagePlaceholder="E.g. a booking system for 3 branches with staff logins"
        />
      </section>
    </DivisionHub>
  );
}
