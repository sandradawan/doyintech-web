"use client";

import { motion } from "framer-motion";
import Scene from "../three/Scene";
import MotionBackground from "./MotionBackground";
import DimMockup from "@/components/ui/DimMockup";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Motion background image + glows */}
      <MotionBackground />

      {/* 3D layer (behind content, above bg) */}
      <div className="absolute inset-0 z-1 opacity-80">
        <Scene />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: Brand text */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p className="text-sm text-gray-400">
              DoyinTech • Backend • Mobile • APIs
            </p>

            <h1 className="mt-4 font-display text-5xl md:text-7xl font-bold leading-tight">
              Build <span className="text-primary">Modern</span>
              <br />
              Systems that Scale
            </h1>

            <p className="mt-6 text-lg text-gray-400 max-w-xl">
              Production-grade backend engineering, scalable APIs, and mobile
              apps— crafted with premium design and solid architecture.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition text-center"
              >
                Start a Project
              </a>

              <a
                href="#services"
                className="px-6 py-3 border border-white/15 rounded-lg font-medium hover:border-primary transition text-center"
              >
                View Services
              </a>
            </div>
          </motion.div>

          {/* Right: Screens (good layout + controlled motion) */}
          <div className="relative">
            {/* Top screen */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <DimMockup
                  title="API Dashboard"
                  subtitle="Keys • Rate limits • Analytics"
                  className="shadow-2xl"
                />
              </motion.div>
            </motion.div>

            {/* Bottom screen (offset) */}
            <motion.div
              className="mt-8 lg:mt-10 lg:ml-16"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <DimMockup
                  title="Mobile Build"
                  subtitle="Flutter • Smooth UX"
                  className="shadow-2xl"
                />
              </motion.div>
            </motion.div>

            {/* Small floating badge */}
            <motion.div
              className="absolute -top-6 right-6 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs text-gray-200"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ⚡ Fast. Secure. Premium.
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
