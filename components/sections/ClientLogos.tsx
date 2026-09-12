"use client";

const clients = [
  "Imperial Villa",
  "DoyinMart",
  "LegacyPlay",
  "JennyGlams",
  "Arqademy",
  "IPVL",
  "DoyinSoft",
  "DoyinTech Academy",
];

function Row({ prefix }: { prefix: string }) {
  return (
    <>
      {clients.map((name) => (
        <span
          key={`${prefix}-${name}`}
          className="mx-8 shrink-0 text-[17px] font-semibold tracking-tight text-[#f5f5f7]/70 sm:mx-12 sm:text-[21px]"
        >
          {name}
        </span>
      ))}
    </>
  );
}

export default function ClientLogos() {
  return (
    <section className="bg-black py-14">
      <p className="mb-8 text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#a1a1a6]">
        Trusted by growing businesses
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent sm:w-24" />
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          <div className="flex items-center">
            <Row prefix="a" />
            <Row prefix="b" />
          </div>
          <div className="flex items-center" aria-hidden>
            <Row prefix="c" />
            <Row prefix="d" />
          </div>
        </div>
      </div>
    </section>
  );
}
