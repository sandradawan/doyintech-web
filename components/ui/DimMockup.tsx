"use client";

import { motion } from "framer-motion";

export default function DimMockup({
  title = "DoyinTech Console",
  subtitle = "Scalable APIs • Secure",
  className = "",
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={
        "relative rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden " +
        className
      }
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* glow */}
      <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />

      {/* header */}
      <div className="px-5 py-4 border-b border-white/10">
        <p className="font-display text-sm text-gray-200">{title}</p>
        <p className="text-[11px] text-gray-400 mt-1">{subtitle}</p>
      </div>

      {/* “fake screenshot” */}
      <div className="p-5">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-5 h-24 rounded-xl bg-white/5 border border-white/10" />
          <div className="col-span-7 h-24 rounded-xl bg-white/5 border border-white/10" />
          <div className="col-span-12 h-28 rounded-xl bg-white/5 border border-white/10" />
        </div>
      </div>
    </motion.div>
  );
}
