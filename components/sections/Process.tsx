"use client";

import ScrollReveal from "../animations/ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Discovery & Scope",
    description:
      "We understand your goals, users, and constraints. Clear scope, timeline, and budget follow.",
  },
  {
    number: "02",
    title: "Architecture & Design",
    description:
      "System design, data models, API contracts, and UI flows before production code.",
  },
  {
    number: "03",
    title: "Build & Iterate",
    description:
      "Weekly demos, clean code, and steady progress you can see and review.",
  },
  {
    number: "04",
    title: "Launch & Support",
    description:
      "Deploy, monitor, document, and hand over — with optional ongoing support.",
  },
];

export default function Process() {
  return (
    <section className="apple-section apple-section-black">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <h2 className="apple-headline">How we work.</h2>
            <p className="apple-subhead mx-auto mt-3 max-w-xl">
              A clear process from first call to production.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} direction="up" delay={i * 0.06}>
              <div className="apple-card h-full p-6">
                <span className="text-[28px] font-semibold text-[#2997ff]/80">
                  {step.number}
                </span>
                <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-[#f5f5f7]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1a6]">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
