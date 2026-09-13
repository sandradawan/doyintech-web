"use client";

import ScrollReveal from "../animations/ScrollReveal";
import ContactCta from "@/components/ui/ContactCta";

export default function LeadMagnet() {
  return (
    <section className="apple-section apple-section-black py-16">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="grid items-center gap-8 rounded-[28px] border border-white/10 bg-[#1d1d1f] p-8 md:grid-cols-2 md:p-10">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2997ff]">
                Free help
              </p>
              <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[34px]">
                SME Digital Ops Checklist
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-[#a1a1a6]">
                Want the checklist or a walkthrough? No signup form — email us or book a
                short call and we’ll send it.
              </p>
              <ul className="mt-4 space-y-1 text-[14px] text-[#f5f5f7]">
                <li>✓ Website must-haves</li>
                <li>✓ WhatsApp business setup</li>
                <li>✓ Backup & security basics</li>
              </ul>
            </div>
            <ContactCta
              title="Get the checklist"
              subtitle="Email or book a call — we’ll send the PDF."
              emailSubject="Please send SME Digital Ops Checklist"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
