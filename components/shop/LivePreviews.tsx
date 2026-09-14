"use client";

import { motion } from "framer-motion";

function Frame({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#070b12]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] text-white/35">{label || "Live preview"}</span>
      </div>
      <div className="relative min-h-[148px] p-3">{children}</div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#070b12] to-transparent" />
    </div>
  );
}

export function ComponentLivePreview({ slug }: { slug: string }) {
  if (slug === "glass-navbar" || slug === "agency-ui-kit") {
    return (
      <Frame label="Navbar · in motion">
        <motion.div
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 1.4 }}
          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 backdrop-blur"
        >
          <span className="text-[11px] font-semibold text-white">Brand</span>
          <div className="flex gap-3 text-[10px] text-white/50">
            <span>Work</span>
            <span>Pricing</span>
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="rounded-full bg-[#25D366] px-2 py-0.5 text-[9px] font-semibold text-white"
            >
              Call
            </motion.span>
          </div>
        </motion.div>
        <div className="mt-3 h-16 rounded-lg bg-gradient-to-br from-white/5 to-transparent" />
      </Frame>
    );
  }

  if (slug === "pricing-cards") {
    return (
      <Frame label="Pricing · in motion">
        <div className="grid grid-cols-3 gap-1.5">
          {["45k", "120k", "250k"].map((p, i) => (
            <motion.div
              key={p}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 1.6 }}
              className={`rounded-lg border p-2 ${
                i === 1 ? "border-orange-400/60 bg-orange-400/10" : "border-white/10 bg-white/5"
              }`}
            >
              <p className="text-[9px] text-white/50">{i === 1 ? "Growth" : i === 0 ? "Start" : "Pro"}</p>
              <p className="text-[12px] font-semibold text-white">₦{p}</p>
            </motion.div>
          ))}
        </div>
      </Frame>
    );
  }

  if (slug === "whatsapp-float-cta") {
    return (
      <Frame label="WhatsApp CTA · in motion">
        <div className="h-20 rounded-lg bg-white/[0.03]" />
        <motion.div
          animate={{ y: [0, -8, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-lg shadow-lg shadow-green-900/40"
        >
          💬
        </motion.div>
      </Frame>
    );
  }

  if (slug === "dual-cta-contact") {
    return (
      <Frame label="Contact CTAs · in motion">
        <p className="text-center text-[11px] text-white/70">Ready to start?</p>
        <div className="mt-3 flex justify-center gap-2">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] text-white"
          >
            Email
          </motion.span>
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="rounded-full bg-[#25D366] px-3 py-1.5 text-[10px] font-semibold text-white"
          >
            Book a call
          </motion.span>
        </div>
      </Frame>
    );
  }

  if (slug === "animated-stats-row") {
    return (
      <Frame label="Stats · in motion">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["50+", "Clients"],
            ["100+", "Projects"],
            ["5", "Years"],
          ].map(([v, l], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 1.2 }}
            >
              <p className="text-[16px] font-semibold text-white">{v}</p>
              <p className="text-[9px] uppercase tracking-wide text-white/40">{l}</p>
            </motion.div>
          ))}
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="h-24 rounded-lg bg-gradient-to-r from-[#1a2030] via-[#ff8c14]/20 to-[#1a2030] bg-[length:200%_100%]"
      />
    </Frame>
  );
}

export function TemplateLivePreview({ slug }: { slug: string }) {
  const rows =
    slug === "saas-waitlist-landing"
      ? ["Waitlist hero", "3 features", "FAQ + CTA"]
      : slug === "local-business-site"
        ? ["Book now hero", "3 services", "WhatsApp"]
        : slug === "freelancer-portfolio"
          ? ["Hire me", "Selected work", "Skills"]
          : slug === "digital-product-sales-page"
            ? ["Promise", "Benefits", "Buy ₦"]
            : slug === "all-templates-bundle"
              ? ["5 templates", "page.tsx packs", "Client license"]
              : ["Agency hero", "Services", "Pricing + WA"];

  return (
    <Frame label="Template output · scrolling">
      <motion.div
        animate={{ y: [0, -46, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="space-y-2"
      >
        <div className="rounded-md bg-gradient-to-r from-[#ff8c14]/30 to-transparent px-3 py-4">
          <motion.p
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[12px] font-semibold text-white"
          >
            {rows[0]}
          </motion.p>
          <div className="mt-2 h-1.5 w-24 rounded bg-white/20" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, delay: i * 0.2, repeat: Infinity }}
              className="h-10 rounded-md border border-white/10 bg-white/5"
            />
          ))}
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 px-3 py-3">
          <p className="text-[10px] text-white/60">{rows[1]}</p>
          <p className="mt-1 text-[10px] text-[#ff8c14]">{rows[2]}</p>
        </div>
        <div className="h-8 rounded-full bg-[#25D366]/80" />
      </motion.div>
    </Frame>
  );
}
