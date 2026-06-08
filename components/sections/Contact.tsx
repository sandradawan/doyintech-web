"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Contact() {
  return (
    <section id="contact" className="py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-10 md:p-14"
        >
          {/* Founder avatar badge */}
          <div className="inline-flex items-center gap-3.5 mb-6 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
            <div className="relative h-9 w-9 rounded-full border border-white/15 overflow-hidden">
              <Image
                src="/founder.png"
                alt="Silas Doyin Jonathan"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Silas D. Jonathan</span>
              <span className="text-[9px] text-green-400 flex items-center gap-1 font-semibold uppercase tracking-wider mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Available for projects
              </span>
            </div>
          </div>

          <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            Let’s build something that scales.
          </h3>
          <p className="mt-3 text-gray-400 max-w-2xl">
            Tell me what you’re building — I’ll help you plan, architect, and
            ship it with premium quality.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:doyintechnology@outlook.com"
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition text-center"
            >
              Email DoyinTech
            </a>
            <a
              href="/services"
              className="px-6 py-3 rounded-lg border border-white/15 hover:border-primary transition text-center"
            >
              View Services
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
