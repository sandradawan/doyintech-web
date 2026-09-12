"use client";

import ScrollReveal from "../animations/ScrollReveal";

const testimonials = [
  {
    quote:
      "DoyinTech delivered our property management and client portal system on time and with excellent quality.",
    name: "Imperial Villa Property",
    role: "Property Development",
  },
  {
    quote:
      "Professional, responsive and technically strong. The marketplace platform was built cleanly and is easy to maintain.",
    name: "DoyinMart Client",
    role: "Software Marketplace",
  },
  {
    quote:
      "From design to deployment, the gaming lounge website was handled with great attention to detail.",
    name: "LegacyPlay",
    role: "Gaming Lounge",
  },
];

export default function Testimonials() {
  return (
    <section className="apple-section apple-section-white">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <h2 className="apple-headline">Loved by teams.</h2>
            <p className="apple-subhead mx-auto mt-3 max-w-xl">
              Real feedback from founders and operators we work with.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} direction="up" delay={i * 0.08}>
              <figure className="apple-card flex h-full flex-col p-8">
                <blockquote className="flex-1 text-[17px] leading-relaxed text-[#1d1d1f]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-black/5 pt-5">
                  <p className="text-[14px] font-semibold text-[#1d1d1f]">{t.name}</p>
                  <p className="text-[13px] text-[#6e6e73]">{t.role}</p>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
