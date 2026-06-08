"use client";

import { motion } from "framer-motion";

export default function MotionBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Background image layer (you can replace the URL later) */}
      <motion.div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "url('/bg-grid.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        animate={{ scale: [1, 1.05, 1], rotate: [0, 0.2, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Gradient overlay (luxury look) */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-background/50 to-background" />

      {/* Soft glow blobs */}
      <motion.div
        className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
        animate={{ x: [0, 25, 0], y: [0, 18, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-accent/18 blur-3xl"
        animate={{ x: [0, -22, 0], y: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
