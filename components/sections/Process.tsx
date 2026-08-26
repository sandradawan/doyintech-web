"use client";

import ScrollReveal from "../animations/ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Discovery & Scope",
    description:
      "We start with a deep conversation to understand your goals, users, constraints and success metrics. Clear scope, timeline and budget follow.",
  },
  {
    number: "02",
    title: "Architecture & Design",
    description:
      "We design the system architecture, data models, API contracts and UI flows before writing production code. Solid foundations prevent costly rework.",
  },
  {
    number: "03",
    title: "Build & Iterate",
    description:
      "Agile development with regular demos. You see progress weekly. We write clean, documented, testable code that is easy to maintain and scale.",
  },
  {
    number: "04",
    title: "Launch & Support",
    description:
      "Deployment, monitoring, documentation and handover. Optional ongoing support and iteration so your product keeps improving after launch.",
  },
];

export default function Process() {
  return (
    <section className="py-28 bg-[#0B0E14] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal direction="up">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              How We Work
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              A clear process that delivers
            </h2>
            <p className="mt-4 text-gray-400">
              No surprises. Transparent communication and a proven workflow from first call to production.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} direction="up" delay={i * 0.1}>
              <div className="relative h-full rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-primary/30 transition-colors duration-300">
                <span className="font-display text-4xl font-bold text-primary/20">
                  {step.number}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
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
