"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  scale?: number;
  blur?: boolean;
  className?: string;
  once?: boolean;
  amount?: number;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.65,
  distance = 24,
  scale = 0.98,
  blur = false,
  className = "",
  once = true,
  amount = 0.18,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getDirectionOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getDirectionOffset();

  const variants = {
    hidden: {
      opacity: 0,
      ...offset,
      scale: scale,
      filter: blur ? "blur(8px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1] as const,
        delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
