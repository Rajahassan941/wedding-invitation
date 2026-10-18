"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { IslamicPattern } from "@/components/ui/IslamicPattern";

/** Geometric background that drifts slowly against the scroll direction. */
export function ParallaxPattern({ opacity = 0.14 }: { opacity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-x-0 -inset-y-[12%]" style={{ y }}>
        <IslamicPattern opacity={opacity} size={64} />
      </motion.div>
    </div>
  );
}
