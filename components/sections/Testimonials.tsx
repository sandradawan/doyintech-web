"use client";

import ScrollReveal from "../animations/ScrollReveal";

const testimonials = [
  {
    quote:
      "Our property site went live in under two weeks. WhatsApp leads started coming the same day — clearer offer, faster replies, more viewings booked.",
    name: "Imperial Villa Property",
    role: "Property Development · Jos",
    result: "Leads in week 1",
  },
  {
    quote:
      "Fixed price, clear timeline, no surprises. The marketplace platform is clean, fast, and easy for our team to update without calling a developer every time.",
    name: "DoyinMart",
    role: "Software Marketplace",
    result: "Self-serve updates",
  },
  {
    quote:
      "From briefing to launch, communication was excellent. The gaming lounge site looks premium on mobile and converts walk-ins into bookings.",
    name: "LegacyPlay",
    role: "Gaming Lounge",
    result: "More bookings",
  },
];

export default function Testimonials() {
  return (
    <section className="apple-section apple-section-black">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2997ff]">
              Social proof
            </p>
            <h2 className="apple-headline mt-2">Results clients talk about.</h2>
            <p className="apple-subhead mx-auto mt-3 max-w-xl">
              Real feedback from Nigerian businesses we built for — not vanity metrics.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} direction="up" delay={i * 0.08}>
              <figure className="apple-card flex h-full flex-col p-8">
                <span className="mb-4 inline-flex w-fit rounded-full bg-[#2997ff]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2997ff]">
                  {t.result}
                </span>
                <blockquote className="flex-1 text-[16px] leading-relaxed text-[#f5f5f7]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-[14px] font-semibold text-[#f5f5f7]">{t.name}</p>
                  <p className="text-[13px] text-[#a1a1a6]">{t.role}</p>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="mt-10 text-center">
            <a
              href="/portfolio"
              className="apple-link text-[15px]"
            >
              See live projects & case studies ›
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
