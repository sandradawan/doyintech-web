"use client";

import { discoveryCallLink } from "@/lib/packages";

export default function Footer() {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: "Shop",
      links: [
        ["/products", "Digital products"],
        ["/ebooks", "Ebooks"],
        ["/components", "UI components"],
        ["/templates", "Page templates"],
        ["/store", "App store"],
      ],
    },
    {
      title: "Services",
      links: [
        ["/ops", "DoyinOps"],
        ["/hire", "Hire — fixed price"],
        ["/services", "Services"],
        ["/pricing", "Packages & pricing"],
        ["/free-audit", "Free website audit"],
        ["/portfolio", "Portfolio"],
      ],
    },
    {
      title: "Company",
      links: [
        ["/about", "About"],
        ["/contact", "Contact"],
        ["/blog", "Blog"],
        ["/privacy", "Privacy"],
        ["/terms", "Terms"],
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-black text-[12px] text-[#a1a1a6]">
      <div className="mx-auto max-w-[980px] px-6 py-10">
        <div className="rounded-[28px] bg-[#1d1d1f] px-8 py-12 text-center text-[#f5f5f7] sm:px-12">
          <h2 className="text-[32px] font-semibold tracking-tight sm:text-[40px]">
            Sell this month. Build systems next month.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[17px] text-[#a1a1a6]">
            Run DoyinOps free, book a fixed-price website, or buy a pack and use it today.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/ops/app"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-[15px] font-semibold text-white"
            >
              Open DoyinOps
            </a>
            <a
              href="/hire"
              className="inline-flex items-center justify-center rounded-full bg-[#ff8c14] px-6 py-3 text-[15px] font-semibold text-black"
            >
              Hire — fixed price
            </a>
            <a
              href={discoveryCallLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
            >
              Book free call
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 font-semibold text-[#f5f5f7]">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <a href={href} className="text-[#a1a1a6] hover:text-[#f5f5f7] hover:underline">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p>
            WhatsApp{" "}
            <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="apple-link">
              +234 808 534 3926
            </a>
            {" "}·{" "}
            <a href="mailto:doyintechnology@outlook.com" className="apple-link">
              doyintechnology@outlook.com
            </a>
          </p>
          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-[12px] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[#a1a1a6]">Copyright © {year} DoyinTech. All rights reserved.</p>
            <p className="text-[#a1a1a6]">Jos, Nigeria · doyintech.vercel.app</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
