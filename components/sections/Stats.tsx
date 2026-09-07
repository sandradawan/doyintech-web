"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";

const stats = [
  { value: 25, suffix: "+", label: "Projects Delivered" },
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 12, suffix: "+", label: "Happy Clients" },
  { value: 99.9, suffix: "%", label: "Uptime Systems" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reduce) {
      setCount(value);
      return;
    }
    let start = 0;
    const duration = 1600;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Number((eased * value).toFixed(value % 1 === 0 ? 0 : 1)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value, reduce]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-white md:text-5xl">
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="border-y border-white/5 bg-[#080A0F] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} direction="up" delay={i * 0.08}>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-6 text-center transition hover:border-primary/25">
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-400 md:text-sm">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
