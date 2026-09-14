"use client";

import { useState } from "react";

function DemoFrame({
  children,
  label = "Live demo",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0f18]">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/40 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate text-[10px] text-white/40">{label}</span>
      </div>
      <div className="relative min-h-[160px] p-3 sm:p-4">{children}</div>
    </div>
  );
}

export function ComponentLivePreview({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState(1);

  if (slug === "glass-navbar" || slug === "agency-ui-kit") {
    return (
      <DemoFrame label="components/glass-navbar.tsx">
        <header className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-white">YourBrand</span>
            <div className="hidden gap-3 text-[10px] text-white/70 sm:flex">
              <span>Services</span>
              <span>Pricing</span>
              <span>Contact</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-full bg-[#25D366] px-2.5 py-1 text-[10px] font-semibold text-white sm:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
            <span className="hidden rounded-full bg-[#25D366] px-2.5 py-1 text-[10px] font-semibold text-white sm:inline">
              Book call
            </span>
          </div>
          {open && (
            <div className="mt-2 space-y-1 border-t border-white/10 pt-2 sm:hidden">
              {["Services", "Pricing", "Contact"].map((l) => (
                <div key={l} className="rounded px-2 py-1.5 text-[11px] text-white/80">
                  {l}
                </div>
              ))}
            </div>
          )}
        </header>
        <p className="mt-3 text-[10px] text-white/40">Interactive demo · open Menu on narrow width</p>
      </DemoFrame>
    );
  }

  if (slug === "pricing-cards") {
    const plans = [
      { name: "Starter", price: "₦45k", f: ["5-page site", "WhatsApp CTA"] },
      { name: "Growth", price: "₦120k", f: ["Custom design", "SEO basics"] },
      { name: "Pro", price: "₦250k", f: ["Full product", "Priority"] },
    ];
    return (
      <DemoFrame label="components/pricing-cards.tsx">
        <div className="grid grid-cols-3 gap-1.5">
          {plans.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setPlan(i)}
              className={`rounded-lg border p-2 text-left transition ${
                plan === i
                  ? "border-orange-400 bg-orange-400/15 ring-1 ring-orange-400/40"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <p className="text-[9px] text-white/50">{p.name}</p>
              <p className="text-[12px] font-semibold text-white">{p.price}</p>
              <ul className="mt-1 space-y-0.5 text-[8px] text-white/45">
                {p.f.map((x) => (
                  <li key={x}>✓ {x}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-white/40">Click a plan · real selection state</p>
      </DemoFrame>
    );
  }

  if (slug === "whatsapp-float-cta") {
    return (
      <DemoFrame label="components/whatsapp-float.tsx">
        <div className="relative h-[120px] rounded-lg border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent p-3">
          <p className="text-[11px] text-white/50">Page content area</p>
          <a
            href="https://wa.me/2348085343926?text=Hi%20from%20demo"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-lg shadow-lg transition hover:scale-105"
            aria-label="WhatsApp"
          >
            💬
          </a>
        </div>
        <p className="mt-2 text-[10px] text-white/40">Real button · opens WhatsApp</p>
      </DemoFrame>
    );
  }

  if (slug === "dual-cta-contact") {
    return (
      <DemoFrame label="components/dual-cta-contact.tsx">
        <div className="text-center">
          <p className="text-[13px] font-semibold text-white">Ready to start?</p>
          <p className="mt-1 text-[10px] text-white/45">No long forms. Pick one.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <a
              href="mailto:doyintechnology@outlook.com"
              className="rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold text-white hover:bg-white/5"
            >
              Email us
            </a>
            <a
              href="https://wa.me/2348085343926?text=Book%20a%20call"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-4 py-2 text-[11px] font-semibold text-white"
            >
              Book a call
            </a>
          </div>
        </div>
      </DemoFrame>
    );
  }

  if (slug === "animated-stats-row") {
    return (
      <DemoFrame label="components/stats-row.tsx">
        <div className="grid grid-cols-3 gap-2 border-y border-white/10 bg-white/[0.03] py-4 text-center">
          {[
            ["50+", "Clients"],
            ["100+", "Projects"],
            ["5", "Years"],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="text-[18px] font-semibold text-white">{v}</p>
              <p className="text-[9px] uppercase tracking-wide text-white/40">{l}</p>
            </div>
          ))}
        </div>
      </DemoFrame>
    );
  }

  return (
    <DemoFrame label="component demo">
      <div className="flex h-[100px] items-center justify-center rounded-lg border border-dashed border-white/15 text-[12px] text-white/40">
        Full demo on product page
      </div>
    </DemoFrame>
  );
}

export function TemplateLivePreview({ slug }: { slug: string }) {
  if (slug === "saas-waitlist-landing") {
    return (
      <DemoFrame label="templates/saas-waitlist · page.tsx">
        <div className="space-y-3 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-violet-400">Coming soon</p>
          <p className="text-[14px] font-semibold text-white">Ship replies faster</p>
          <p className="text-[10px] text-white/45">Founder pricing for early users</p>
          <button type="button" className="rounded-full bg-violet-500 px-4 py-2 text-[11px] font-semibold text-white">
            Join waitlist
          </button>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {["Auto replies", "Leads", "Analytics"].map((f) => (
              <div key={f} className="rounded-md border border-white/10 py-2 text-[9px] text-white/70">
                {f}
              </div>
            ))}
          </div>
        </div>
      </DemoFrame>
    );
  }

  if (slug === "local-business-site") {
    return (
      <DemoFrame label="templates/local-business · page.tsx">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-white">YourBusiness</span>
            <span className="rounded-full bg-[#25D366] px-2 py-0.5 text-[9px] font-semibold text-white">Book</span>
          </div>
          <p className="text-center text-[14px] font-semibold text-white">Quality service near you</p>
          <div className="grid grid-cols-3 gap-1.5">
            {["Cut", "Color", "Spa"].map((s) => (
              <div key={s} className="rounded-md border border-white/10 p-2 text-center text-[10px] text-white/70">
                {s}
              </div>
            ))}
          </div>
        </div>
      </DemoFrame>
    );
  }

  if (slug === "freelancer-portfolio") {
    return (
      <DemoFrame label="templates/portfolio · page.tsx">
        <p className="text-[10px] text-orange-400">Available for projects</p>
        <p className="mt-1 text-[13px] font-semibold text-white">I build products that pay</p>
        <div className="mt-3 space-y-1.5">
          {["SME Website", "Booking Portal"].map((t) => (
            <div key={t} className="rounded-md border border-white/10 px-2 py-1.5 text-[10px] text-white/70">
              {t}
            </div>
          ))}
        </div>
      </DemoFrame>
    );
  }

  if (slug === "digital-product-sales-page") {
    return (
      <DemoFrame label="templates/sales-page · page.tsx">
        <p className="text-center text-[9px] font-semibold uppercase text-orange-400">Digital product</p>
        <p className="mt-1 text-center text-[13px] font-semibold text-white">More clients from WhatsApp</p>
        <div className="mx-auto mt-3 max-w-[200px] rounded-xl border border-orange-400/30 bg-orange-400/10 p-3 text-center">
          <p className="text-[18px] font-bold text-white">₦7,500</p>
          <button type="button" className="mt-2 w-full rounded-full bg-orange-500 py-1.5 text-[10px] font-semibold text-black">
            Buy now
          </button>
        </div>
      </DemoFrame>
    );
  }

  return (
    <DemoFrame label="templates/dark-agency · page.tsx">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-semibold text-white">YourAgency</span>
          <span className="rounded-full bg-[#25D366] px-2 py-0.5 font-semibold text-white">Book call</span>
        </div>
        <p className="text-center text-[14px] font-semibold leading-snug text-white">
          Sites and systems that get clients
        </p>
        <p className="text-center text-[10px] text-white/45">For SMEs who need results</p>
        <div className="flex justify-center gap-2">
          <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-black">Free call</span>
          <span className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] text-white">Services</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {["Websites", "Apps", "Automation"].map((s) => (
            <div key={s} className="rounded-md border border-white/10 py-2 text-center text-[9px] text-white/70">
              {s}
            </div>
          ))}
        </div>
      </div>
    </DemoFrame>
  );
}
