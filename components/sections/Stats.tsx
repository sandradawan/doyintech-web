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
    const duration = 1400;
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
    <span ref={ref} className="text-[40px] font-semibold tracking-tight text-[#1d1d1f] sm:text-[48px]">
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="apple-section-white border-y border-black/5 py-16">
      <div className="mx-auto max-w-[980px] px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} direction="up" delay={i * 0.06}>
              <div className="text-center">
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-[14px] text-[#6e6e73]">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
