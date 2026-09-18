"use client";

import Image from "next/image";

type Client = {
  name: string;
  href?: string;
  /** Local public path or remote URL allowed in next.config */
  logo: string;
  /** Prefer object-contain for full logos; cover for icon-only marks */
  fit?: "contain" | "cover";
};

/**
 * Logos extracted from each brand's live site (not invented names).
 * Imperial Villa, LegacyPlay, JennyGlams, DoyinMart — real brand marks.
 */
const clients: Client[] = [
  {
    name: "Imperial Villa",
    href: "https://www.imperialvillapropertydevelopment.com",
    logo: "https://www.imperialvillapropertydevelopment.com/images/log.png",
    fit: "contain",
  },
  {
    name: "DoyinMart",
    href: "https://doyinsoft.vercel.app",
    logo: "/clients/doyinmart.svg",
    fit: "contain",
  },
  {
    name: "LegacyPlay",
    href: "https://legacyplay.vercel.app",
    logo: "/clients/legacyplay.svg",
    fit: "contain",
  },
  {
    name: "JennyGlams",
    href: "https://jennyglams.vercel.app",
    logo: "https://jennyglams.vercel.app/icon.png",
    fit: "contain",
  },
  {
    name: "Imperial Villa",
    href: "https://www.imperialvillapropertydevelopment.com",
    logo: "https://www.imperialvillapropertydevelopment.com/images/logo.png",
    fit: "contain",
  },
  {
    name: "DoyinTech",
    href: "https://doyintech.vercel.app",
    logo: "/logo.png",
    fit: "contain",
  },
];

function LogoChip({ client, prefix }: { client: Client; prefix: string }) {
  const inner = (
    <span className="mx-6 flex shrink-0 items-center gap-3 sm:mx-10">
      <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:h-11 sm:w-11">
        <Image
          src={client.logo}
          alt=""
          width={44}
          height={44}
          className={
            client.fit === "cover"
              ? "h-full w-full object-cover"
              : "h-[70%] w-[70%] object-contain"
          }
          unoptimized={client.logo.startsWith("http")}
        />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-[#f5f5f7]/85 sm:text-[17px]">
        {client.name}
      </span>
    </span>
  );

  if (client.href) {
    return (
      <a
        key={`${prefix}-${client.name}-${client.logo}`}
        href={client.href}
        target="_blank"
        rel="noopener noreferrer"
        className="transition hover:opacity-100 opacity-90"
        title={client.name}
      >
        {inner}
      </a>
    );
  }

  return <span key={`${prefix}-${client.name}`}>{inner}</span>;
}

function Row({ prefix }: { prefix: string }) {
  return (
    <>
      {clients.map((c, i) => (
        <LogoChip key={`${prefix}-${i}`} client={c} prefix={`${prefix}-${i}`} />
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
