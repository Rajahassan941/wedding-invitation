"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/AnimatedSection";
import { FloralSprig } from "@/components/ui/FloralSprig";
import { IslamicPattern } from "@/components/ui/IslamicPattern";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import { getTimeRemaining, type TimeRemaining } from "@/lib/date";
import { EASE_LUXE } from "@/lib/utils";

interface CountdownProps {
  target: string;
  eyebrow: string;
  heading: string;
  dateLabel: string;
  completedMessage: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
}

/** A single digit group that slides gently when its value changes. */
function CountUnit({ value, label, pad = 2 }: { value: number | null; label: string; pad?: number }) {
  const display = value === null ? "––" : String(value).padStart(pad, "0");
  return (
    <div className="relative flex flex-col items-center rounded-t-full border border-gold/40 px-2 pb-5 pt-8 sm:px-4 sm:pb-6 sm:pt-10">
      <div className="relative h-[1.1em] overflow-hidden font-serif text-4xl font-light lining-nums tabular-nums leading-none text-ivory sm:text-6xl lg:text-7xl">
        {/* Invisible sizer keeps width stable while digits animate */}
        <span className="invisible">{display}</span>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={display}
            className="absolute inset-0 text-center"
            initial={{ y: "-60%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "60%", opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE_LUXE }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="eyebrow mt-3 text-[0.58rem] text-gold sm:text-[0.65rem]">{label}</span>
    </div>
  );
}

export function Countdown({ target, eyebrow, heading, dateLabel, completedMessage, labels }: CountdownProps) {
  // `null` until mounted so server and client markup match.
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const targetMs = new Date(target).getTime();
    let timer: number | undefined;
    const tick = () => {
      const next = getTimeRemaining(targetMs);
      setRemaining(next);
      if (next.total > 0) {
        // Align ticks to the next whole second.
        timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 10);
      }
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [target]);

  const isComplete = remaining?.total === 0;
  const units: Array<[keyof typeof labels, number | null]> = [
    ["days", remaining?.days ?? null],
    ["hours", remaining?.hours ?? null],
    ["minutes", remaining?.minutes ?? null],
    ["seconds", remaining?.seconds ?? null],
  ];

  return (
    <section
      id="countdown"
      aria-labelledby="countdown-title"
      className="relative overflow-hidden bg-emerald py-24 text-ivory sm:py-28"
    >
      <IslamicPattern opacity={0.08} size={64} />
      <FloralSprig className="absolute -bottom-6 -left-4 w-28 opacity-50 sm:w-36" leafFill="fill-sage/20" />
      <FloralSprig flip className="absolute -top-6 -right-4 w-28 rotate-180 opacity-50 sm:w-36" leafFill="fill-sage/20" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h2 id="countdown-title" className="mt-4 font-serif text-4xl font-light sm:text-5xl">
            {heading}
          </h2>
          <OrnamentalDivider className="mt-6" />
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          {isComplete ? (
            <p className="mx-auto max-w-xl font-serif text-3xl italic leading-snug text-gold text-balance sm:text-4xl">
              {completedMessage}
            </p>
          ) : (
            <div
              role="timer"
              aria-live="off"
              aria-label={
                remaining
                  ? `${remaining.days} ${labels.days}, ${remaining.hours} ${labels.hours}, ${remaining.minutes} ${labels.minutes} remaining`
                  : undefined
              }
              className="mx-auto grid max-w-3xl grid-cols-4 gap-2 sm:gap-5"
            >
              {units.map(([key, value]) => (
                <CountUnit key={key} value={value} label={labels[key]} />
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.25}>
          <p className="eyebrow mt-12 text-ivory/80">{dateLabel}</p>
        </Reveal>
      </div>
    </section>
  );
}
