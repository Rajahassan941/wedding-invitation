"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { EASE_LUXE } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds before the reveal starts once in view. */
  delay?: number;
  /** Upward travel distance in px. */
  y?: number;
  /** Fraction of the element that must be visible before revealing. */
  amount?: number;
}

/**
 * Fades and lifts content into place when it enters the viewport
 * (IntersectionObserver via `whileInView`). Runs once per element.
 * Reduced-motion users get the fade only — see <MotionConfig reducedMotion="user">.
 */
export function Reveal({ children, className, delay = 0, y = 24, amount = 0.25 }: RevealProps) {
  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: EASE_LUXE, delay }}
    >
      {children}
    </motion.div>
  );
}

const groupVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({ transition: { staggerChildren: stagger, delayChildren: 0.05 } }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_LUXE } },
};

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  amount?: number;
}

/** Staggers the reveal of its <RevealItem> children. */
export function RevealGroup({ children, className, stagger = 0.12, amount = 0.2 }: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      variants={groupVariants}
      custom={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div data-reveal="" className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
