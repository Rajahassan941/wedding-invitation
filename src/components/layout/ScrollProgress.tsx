"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useInvitation } from "@/components/invitation/InvitationProvider";
import { BrideMiniature, GroomMiniature } from "./CoupleMiniatures";

/** Width of each miniature in px; keep in sync with the w-9 class below. */
const FIGURE_WIDTH = 36;
/** Progress at which the couple are considered to have met. */
const MEET_AT = 0.985;

/**
 * Reading progress shown as the groom and bride walking towards each other along
 * a gold line at the bottom of the screen. They meet when the reader reaches the end.
 */
export function ScrollProgress() {
  const { isOpen } = useInvitation();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const range = useRef({ start: 0, end: 1 });
  const [met, setMet] = useState(false);

  // Progress runs from the start of the invitation body (after the envelope) to the page end.
  useEffect(() => {
    const measure = () => {
      const main = document.getElementById("main");
      const start = main ? main.offsetTop - window.innerHeight * 0.5 : 0;
      const end = document.documentElement.scrollHeight - window.innerHeight;
      range.current = { start, end: Math.max(end, start + 1) };
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const raw = useTransform(scrollY, (y) => {
    const { start, end } = range.current;
    return Math.min(1, Math.max(0, (y - start) / (end - start)));
  });
  const smooth = useSpring(raw, { stiffness: 90, damping: 24, restDelta: 0.0005 });
  const progress = reduceMotion ? raw : smooth;

  useMotionValueEvent(progress, "change", (v) => setMet(v >= MEET_AT));

  const offset = useTransform(progress, (v) => `calc((50% - ${FIGURE_WIDTH + 1}px) * ${v})`);
  // A gentle step bob tied to scroll position, so they "walk" as the page moves.
  const stepGroom = useTransform(progress, (v) => (reduceMotion || v >= MEET_AT ? 0 : -Math.abs(Math.sin(v * 70)) * 2.2));
  const stepBride = useTransform(progress, (v) => (reduceMotion || v >= MEET_AT ? 0 : -Math.abs(Math.cos(v * 70)) * 2.2));
  const swayGroom = useTransform(progress, (v) => (reduceMotion || v >= MEET_AT ? 0 : Math.sin(v * 70) * 2.5));
  const swayBride = useTransform(progress, (v) => (reduceMotion || v >= MEET_AT ? 0 : Math.cos(v * 70) * -2.5));

  if (!isOpen) return null;
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-x-3 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-30 h-[4.25rem] sm:inset-x-6"
    >
      {/* Track: a faint gold line that fills from both ends towards the centre. */}
      <div className="absolute inset-x-0 bottom-1 h-px bg-gold/25" />
      <motion.div className="absolute bottom-1 left-0 h-px w-1/2 origin-left bg-gold" style={{ scaleX: progress }} />
      <motion.div className="absolute bottom-1 right-0 h-px w-1/2 origin-right bg-gold" style={{ scaleX: progress }} />

      <motion.div className="absolute bottom-0" style={{ left: offset, y: stepGroom, rotate: swayGroom, originY: 1 }}>
        <GroomMiniature className="h-16 w-9 text-gold drop-shadow-[0_2px_3px_rgb(0_0_0/0.25)]" />
      </motion.div>
      <motion.div className="absolute bottom-0" style={{ right: offset, y: stepBride, rotate: swayBride, originY: 1 }}>
        <BrideMiniature className="h-16 w-9 text-gold drop-shadow-[0_2px_3px_rgb(0_0_0/0.25)]" />
      </motion.div>

      <AnimatePresence>
        {met && (
          <motion.div
            key="together"
            className="absolute bottom-[3.9rem] left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.4, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, y: 6 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="absolute inset-0 -m-2 rounded-full bg-gold/30 blur-md" />
            <svg viewBox="0 0 24 24" className="relative h-4 w-4 text-gold">
              <path
                fill="currentColor"
                d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.6 6.6 4.6c2.2 0 3.6 1.2 5.4 3.2 1.8-2 3.2-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21Z"
              />
            </svg>
            {[-14, 14, 0].map((x, i) => (
              <motion.span
                key={x}
                className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-gold"
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], x, y: i === 2 ? -16 : -8 }}
                transition={{ duration: 1.6, delay: 0.2 + i * 0.15, repeat: Infinity, repeatDelay: 1.2 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
