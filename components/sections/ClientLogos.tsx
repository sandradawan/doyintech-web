"use client";

import ScrollReveal from "../animations/ScrollReveal";

const clients = [
  { name: "Imperial Villa", tag: "Property & Fintech" },
  { name: "DoyinMart", tag: "Marketplace" },
  { name: "LegacyPlay", tag: "Gaming Lounge" },
  { name: "JennyGlams", tag: "Beauty Brand" },
  { name: "Arqademy", tag: "Education / CBT" },
  { name: "IPVL", tag: "Operations" },
];

export default function ClientLogos() {
  return (
    <section className="py-16 bg-[#080A0F] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500 mb-10">
            Trusted by growing businesses & brands
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
            {clients.map((client) => (
              <div
                key={client.name}
                className="group flex flex-col items-center text-center"
              >
                <span className="text-lg md:text-xl font-display font-bold text-gray-400 group-hover:text-white transition-colors duration-300">
                  {client.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-gray-600 mt-1">
                  {client.tag}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
