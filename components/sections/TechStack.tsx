"use client";

import ScrollReveal from "../animations/ScrollReveal";

const technologies = [
  { name: "Next.js", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Flutter", category: "Mobile" },
  { name: "Laravel", category: "Backend" },
  { name: "PHP", category: "Backend" },
  { name: "Node.js", category: "Backend" },
  { name: "MySQL", category: "Database" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Redis", category: "Cache" },
  { name: "AI Automation", category: "AI" },
  { name: "Docker", category: "DevOps" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer Motion", category: "Animation" },
  { name: "Resend", category: "Email" },
  { name: "Vercel", category: "Hosting" },
];

export default function TechStack() {
  return (
    <section className="py-24 bg-[#0B0E14]">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Technology
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
              Modern stack. Production-ready tools.
            </h2>
            <p className="mt-4 text-gray-400">
              We choose technologies that scale, stay maintainable, and deliver real performance — from classic PHP/Laravel systems to modern AI-powered automation.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] text-sm font-medium text-gray-300 hover:border-primary/40 hover:text-white transition-colors duration-300"
              >
                {tech.name}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
