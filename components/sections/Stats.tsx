"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";

const stats = [
  { value: 25, suffix: "+", label: "Projects delivered" },
  { value: 4, suffix: "+", label: "Years experience" },
  { value: 12, suffix: "+", label: "Happy clients" },
  { value: 99.9, suffix: "%", label: "Uptime systems" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(value); // start with final value to avoid "0" flash
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!isInView || animated) return;

    if (reduce) {
      setCount(value);
      setAnimated(true);
      return;
    }

    // Reset to 0 only when animation actually starts
    setCount(0);
    let start = 0;
    const duration = 1400;
    let frame: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Number((eased * value).toFixed(value % 1 === 0 ? 0 : 1));
      setCount(next);
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setCount(value);
        setAnimated(true);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, reduce, animated]);

  return (
    <span
      ref={ref}
      className="text-[40px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[48px]"
    >
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="border-y border-white/10 bg-black py-16">
      <div className="mx-auto max-w-[980px] px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} direction="up" delay={i * 0.06}>
              <div className="text-center">
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-[14px] text-[#a1a1a6]">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
