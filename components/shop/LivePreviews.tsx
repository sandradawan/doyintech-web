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
  const [faq, setFaq] = useState(0);

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
        {slug === "agency-ui-kit" && (
          <p className="mt-3 text-center text-[11px] text-orange-400">Full kit · all 14 components</p>
        )}
      </DemoFrame>
    );
  }

  if (slug === "pricing-cards") {
    const plans = [
      { name: "Starter", price: "₦45k" },
      { name: "Growth", price: "₦120k" },
      { name: "Pro", price: "₦250k" },
    ];
    return (
      <DemoFrame label="components/pricing-cards.tsx">
        <div className="grid grid-cols-3 gap-1.5">
          {plans.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setPlan(i)}
              className={`rounded-lg border p-2 text-left ${
                plan === i
                  ? "border-orange-400 bg-orange-400/15"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <p className="text-[9px] text-white/50">{p.name}</p>
              <p className="text-[12px] font-semibold text-white">{p.price}</p>
            </button>
          ))}
        </div>
      </DemoFrame>
    );
  }

  if (slug === "whatsapp-float-cta") {
    return (
      <DemoFrame label="components/whatsapp-float.tsx">
        <div className="relative h-[120px] rounded-lg border border-white/5 bg-white/[0.03] p-3">
          <p className="text-[11px] text-white/50">Page content</p>
          <a
            href="https://wa.me/2348085343926"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-lg"
          >
            💬
          </a>
        </div>
      </DemoFrame>
    );
  }

  if (slug === "dual-cta-contact") {
    return (
      <DemoFrame label="components/dual-cta-contact.tsx">
        <div className="text-center">
          <p className="text-[13px] font-semibold text-white">Ready to start?</p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="rounded-full border border-white/20 px-4 py-2 text-[11px] text-white">Email</span>
            <span className="rounded-full bg-[#25D366] px-4 py-2 text-[11px] font-semibold text-white">
              Book a call
            </span>
          </div>
        </div>
      </DemoFrame>
    );
  }

  if (slug === "animated-stats-row") {
    return (
      <DemoFrame label="components/stats-row.tsx">
        <div className="grid grid-cols-3 gap-2 border-y border-white/10 py-4 text-center">
          {[
            ["50+", "Clients"],
            ["100+", "Projects"],
            ["5", "Years"],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="text-[18px] font-semibold text-white">{v}</p>
              <p className="text-[9px] text-white/40">{l}</p>
            </div>
          ))}
        </div>
      </DemoFrame>
    );
  }

  if (slug === "hero-split-cta") {
    return (
      <DemoFrame label="components/hero-split.tsx">
        <div className="text-center">
          <p className="text-[9px] font-semibold text-orange-400">For growing SMEs</p>
          <p className="mt-1 text-[14px] font-semibold text-white">Websites that get clients</p>
          <div className="mt-3 flex justify-center gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-black">
              Packages
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] text-white">
              Book call
            </span>
          </div>
        </div>
      </DemoFrame>
    );
  }

  if (slug === "faq-accordion") {
    const items = ["How long does it take?", "Do you use WhatsApp?", "How do we pay?"];
    return (
      <DemoFrame label="components/faq-accordion.tsx">
        <div className="space-y-1.5">
          {items.map((q, i) => (
            <button
              key={q}
              type="button"
              onClick={() => setFaq(faq === i ? -1 : i)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-[11px] text-white"
            >
              <span className="flex justify-between">
                {q} <span>{faq === i ? "−" : "+"}</span>
              </span>
              {faq === i && (
                <p className="mt-1 text-[10px] text-white/50">Clear answer goes here for buyers.</p>
              )}
            </button>
          ))}
        </div>
      </DemoFrame>
    );
  }

  if (slug === "testimonial-cards") {
    return (
      <DemoFrame label="components/testimonials.tsx">
        <div className="grid grid-cols-3 gap-1.5">
          {["Ada", "James", "Mary"].map((n) => (
            <div key={n} className="rounded-lg border border-white/10 bg-white/5 p-2">
              <p className="text-[9px] text-white/60">“Great results.”</p>
              <p className="mt-1 text-[10px] font-semibold text-white">{n}</p>
            </div>
          ))}
        </div>
      </DemoFrame>
    );
  }

  if (slug === "feature-grid-3") {
    return (
      <DemoFrame label="components/feature-grid.tsx">
        <div className="grid grid-cols-3 gap-1.5">
          {["Fast", "WhatsApp", "Mobile"].map((t) => (
            <div key={t} className="rounded-lg border border-white/10 p-2 text-center text-[10px] text-white">
              {t}
            </div>
          ))}
        </div>
      </DemoFrame>
    );
  }

  if (slug === "logo-cloud") {
    return (
      <DemoFrame label="components/logo-cloud.tsx">
        <p className="mb-2 text-center text-[9px] uppercase text-white/40">Trusted by</p>
        <div className="flex flex-wrap justify-center gap-3 text-[11px] font-semibold text-white/35">
          {["Acme", "Northwind", "Globex", "Initech"].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </DemoFrame>
    );
  }

  if (slug === "newsletter-cta") {
    return (
      <DemoFrame label="components/newsletter.tsx">
        <p className="text-center text-[12px] font-semibold text-white">Get the checklist</p>
        <div className="mt-3 flex gap-1.5">
          <div className="flex-1 rounded-full border border-white/15 px-3 py-2 text-[10px] text-white/40">
            you@email.com
          </div>
          <span className="rounded-full bg-orange-500 px-3 py-2 text-[10px] font-semibold text-black">
            Go
          </span>
        </div>
      </DemoFrame>
    );
  }

  if (slug === "process-steps") {
    return (
      <DemoFrame label="components/process-steps.tsx">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["1", "Call"],
            ["2", "Build"],
            ["3", "Launch"],
          ].map(([n, t]) => (
            <div key={n}>
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-black">
                {n}
              </div>
              <p className="mt-1 text-[10px] text-white">{t}</p>
            </div>
          ))}
        </div>
      </DemoFrame>
    );
  }

  if (slug === "footer-simple") {
    return (
      <DemoFrame label="components/footer.tsx">
        <div className="grid grid-cols-3 gap-2 text-[10px] text-white/50">
          <div>
            <p className="font-semibold text-white">Brand</p>
            <p className="mt-1">Sites that sell</p>
          </div>
          <div>
            <p className="font-semibold text-white">Explore</p>
            <p className="mt-1">Services</p>
          </div>
          <div>
            <p className="font-semibold text-white">Contact</p>
            <p className="mt-1">hello@…</p>
          </div>
        </div>
      </DemoFrame>
    );
  }

  if (slug === "blog-card-grid") {
    return (
      <DemoFrame label="components/blog-cards.tsx">
        <div className="grid grid-cols-3 gap-1.5">
          {["Menus", "Pricing", "Audit"].map((t) => (
            <div key={t} className="rounded-lg border border-white/10 p-2">
              <div className="mb-1.5 h-8 rounded bg-white/10" />
              <p className="text-[10px] font-semibold text-white">{t}</p>
            </div>
          ))}
        </div>
      </DemoFrame>
    );
  }

  return (
    <DemoFrame label="component demo">
      <div className="flex h-[100px] items-center justify-center rounded-lg border border-dashed border-white/15 text-[12px] text-white/40">
        Interactive preview
      </div>
    </DemoFrame>
  );
}

export function TemplateLivePreview({ slug }: { slug: string }) {
  if (slug === "saas-waitlist-landing") {
    return (
      <DemoFrame label="templates/saas-waitlist">
        <div className="space-y-2 text-center">
          <p className="text-[14px] font-semibold text-white">Ship replies faster</p>
          <button type="button" className="rounded-full bg-violet-500 px-4 py-2 text-[11px] font-semibold text-white">
            Join waitlist
          </button>
        </div>
      </DemoFrame>
    );
  }
  if (slug === "local-business-site") {
    return (
      <DemoFrame label="templates/local-business">
        <p className="text-center text-[14px] font-semibold text-white">Quality service near you</p>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {["Cut", "Color", "Spa"].map((s) => (
            <div key={s} className="rounded-md border border-white/10 py-2 text-center text-[10px] text-white/70">
              {s}
            </div>
          ))}
        </div>
      </DemoFrame>
    );
  }
  if (slug === "freelancer-portfolio") {
    return (
      <DemoFrame label="templates/portfolio">
        <p className="text-[13px] font-semibold text-white">I build products that pay</p>
      </DemoFrame>
    );
  }
  if (slug === "digital-product-sales-page") {
    return (
      <DemoFrame label="templates/sales-page">
        <div className="text-center">
          <p className="text-[13px] font-semibold text-white">More clients from WhatsApp</p>
          <p className="mt-2 text-[18px] font-bold text-white">₦7,500</p>
        </div>
      </DemoFrame>
    );
  }
  return (
    <DemoFrame label="templates/dark-agency">
      <p className="text-center text-[14px] font-semibold text-white">Sites and systems that get clients</p>
      <div className="mt-3 flex justify-center gap-2">
        <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-black">Free call</span>
        <span className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] text-white">Services</span>
      </div>
    </DemoFrame>
  );
}
