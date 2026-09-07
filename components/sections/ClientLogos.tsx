"use client";

import ScrollReveal from "../animations/ScrollReveal";

const clients = [
  { name: "Imperial Villa", tag: "Property & Fintech" },
  { name: "DoyinMart", tag: "Marketplace" },
  { name: "LegacyPlay", tag: "Gaming Lounge" },
  { name: "JennyGlams", tag: "Beauty Brand" },
  { name: "Arqademy", tag: "Education / CBT" },
  { name: "IPVL", tag: "Operations" },
  { name: "DoyinSoft", tag: "Software" },
  { name: "DoyinTech Academy", tag: "Training" },
];

function Row() {
  return (
    <>
      {clients.map((client) => (
        <div
          key={client.name + Math.random()}
          className="mx-6 flex shrink-0 flex-col items-center text-center sm:mx-10"
        >
          <span className="font-display text-lg font-bold text-gray-400 transition-colors hover:text-white md:text-xl">
            {client.name}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wider text-gray-600">
            {client.tag}
          </span>
        </div>
      ))}
    </>
  );
}

export default function ClientLogos() {
  return (
    <section className="border-y border-white/5 bg-[#080A0F] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up">
          <p className="mb-10 text-center text-sm font-semibold uppercase tracking-wider text-gray-500">
            Trusted by growing businesses & brands
          </p>
        </ScrollReveal>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#080A0F] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#080A0F] to-transparent sm:w-28" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          <div className="flex items-center">
            <Row />
            <Row />
          </div>
          <div className="flex items-center" aria-hidden>
            <Row />
            <Row />
          </div>
        </div>
      </div>
    </section>
  );
}
