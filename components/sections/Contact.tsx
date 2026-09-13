"use client";

import Image from "next/image";
import ScrollReveal from "../animations/ScrollReveal";
import ContactCta from "@/components/ui/ContactCta";

export default function Contact() {
  return (
    <section id="contact" className="apple-section apple-section-black">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="rounded-[28px] bg-[#1d1d1f] px-8 py-14 text-center sm:px-12">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/15">
                <Image
                  src="/founder.png"
                  alt="Silas Doyin Jonathan"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="text-left">
                <p className="text-[12px] font-semibold text-[#f5f5f7]">Silas D. Jonathan</p>
                <p className="text-[10px] font-medium text-emerald-400">Available for projects</p>
              </div>
            </div>

            <h2 className="text-[32px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[40px]">
              Let’s build something that scales.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[17px] text-[#a1a1a6]">
              No forms. Email us or book a call.
            </p>

            <div className="mx-auto mt-8 max-w-md">
              <ContactCta compact />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
