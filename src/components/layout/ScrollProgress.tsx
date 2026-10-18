"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useInvitation } from "@/components/invitation/InvitationProvider";

/** A hairline gold bar at the top of the viewport showing reading progress. */
export function ScrollProgress() {
  const { isOpen } = useInvitation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  if (!isOpen) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-gradient-to-r from-gold/60 via-gold to-gold/60"
      style={{ scaleX }}
    />
  );
}
