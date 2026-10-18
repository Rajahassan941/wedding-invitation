"use client";

import { ChevronDown, MailOpen } from "lucide-react";
import {
  animate,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { FloralSprig } from "@/components/ui/FloralSprig";
import { IslamicPattern } from "@/components/ui/IslamicPattern";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import { useHydrated } from "@/lib/useHydrated";
import { cn } from "@/lib/utils";
import { useInvitation } from "./InvitationProvider";

interface InvitationCoverProps {
  greetingArabic: string;
  greetingTranslation: string;
  heading: string;
  names: [string, string];
  initials: [string, string];
  joiner: string;
  message: string;
  date: string;
  buttonLabel: string;
}

/*
 * Scroll-driven envelope opening.
 *
 * Geometry (all derived from the card width --w):
 *   card      w × 1.4w, centred in the viewport in its final state
 *   envelope  1.08w × 0.756w, its centre sits 22% of the card height below the viewport centre
 * Card translateY is expressed in % of the card's own height, so every value
 * below is resolution-independent.
 *
 * Scroll timeline (progress of the 320svh intro section):
 *   0.00–0.08  hint fades out
 *   0.05–0.14  wax seal breaks
 *   0.10–0.32  flap folds back (3D)
 *   0.30–0.60  letter slides up out of the envelope
 *   0.60–0.85  envelope falls away, letter settles in the centre
 *   0.90       invitation marked open → hero & navigation animate in
 */
const CARD_START = 49.3; // card hidden inside the envelope (27.3% + ENVELOPE_OFFSET)
const CARD_PULLED = -8; // half the card out of the envelope
const ENVELOPE_OFFSET = 0.22; // envelope centre below viewport centre, in card heights

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  size: 2 + (i % 3),
  duration: `${13 + (i % 5) * 2.5}s`,
  delay: `${-(i * 1.9)}s`,
  drift: `${(i % 2 ? 1 : -1) * (8 + (i % 4) * 6)}px`,
  opacity: 0.3 + (i % 4) * 0.1,
}));

/** The invitation card itself. Typography scales with the card via container units. */
function InvitationCard(props: InvitationCoverProps & { titleId: string }) {
  return (
    <div className="@container paper relative h-full w-full overflow-hidden rounded-[2px] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-[3cqw] border border-gold/70" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[5cqw] border border-gold/30" />
      <FloralSprig className="absolute -left-[3cqw] -top-[3cqw] w-[22cqw]" />
      <FloralSprig flip className="absolute -right-[3cqw] -top-[3cqw] w-[22cqw]" />
      <FloralSprig className="absolute -bottom-[3cqw] -left-[3cqw] w-[18cqw] rotate-180 -scale-x-100 opacity-80" />
      <FloralSprig className="absolute -bottom-[3cqw] -right-[3cqw] w-[18cqw] rotate-180 opacity-80" />

      <div className="relative flex h-full flex-col items-center justify-center px-[10cqw] text-center">
        <p lang="ar" className="arabic text-[6.6cqw] leading-[1.7] text-emerald">
          {props.greetingArabic}
        </p>
        <p className="mt-[0.5cqw] text-[2.6cqw] italic leading-snug text-ink-muted">{props.greetingTranslation}</p>

        <OrnamentalDivider className="mt-[4cqw] scale-90" />

        <p className="mt-[4cqw] text-[2.7cqw] font-medium uppercase tracking-[0.3em] text-gold-ink">{props.heading}</p>

        <h1 id={props.titleId} className="mt-[4cqw] text-emerald">
          <span className="display-name block text-[13cqw]">{props.names[0]}</span>
          <span className="my-[1.5cqw] block font-serif text-[6.5cqw] italic text-gold" aria-label="and">
            {props.joiner}
          </span>
          <span className="display-name block text-[13cqw]">{props.names[1]}</span>
        </h1>

        <p className="mx-auto mt-[4cqw] max-w-[80cqw] font-serif text-[4.4cqw] leading-snug text-ink-muted">
          {props.message}
        </p>

        <p className="mt-[4cqw] text-[2.9cqw] font-medium uppercase tracking-[0.3em] text-emerald">{props.date}</p>
      </div>
    </div>
  );
}

/** Wax seal with the couple's monogram. */
function WaxSeal({ initials, joiner }: { initials: [string, string]; joiner: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,color-mix(in_oklab,var(--color-gold)_70%,white),var(--color-gold)_45%,color-mix(in_oklab,var(--color-gold)_60%,black))] shadow-[0_6px_14px_-4px_rgb(0_0_0/0.55),inset_0_-3px_6px_rgb(0_0_0/0.25),inset_0_2px_4px_rgb(255_255_255/0.35)]">
      <div className="absolute inset-[9%] rounded-full border border-emerald-deep/30" />
      <span className="flex items-baseline font-serif italic leading-none text-emerald-deep [font-size:calc(var(--w)*0.075)]">
        {initials[0]}
        <span className="mx-[0.08em] text-[0.6em]">{joiner}</span>
        {initials[1]}
      </span>
    </div>
  );
}

const layer = "pointer-events-none absolute left-1/2";
/** Envelope box: 1.08w × 0.756w, centred ENVELOPE_OFFSET card-heights below the viewport centre. */
const envelopeBox: CSSProperties = {
  width: "calc(var(--w) * 1.08)",
  height: "calc(var(--w) * 0.756)",
  marginLeft: "calc(var(--w) * -0.54)",
  top: `calc(50% + var(--w) * ${(ENVELOPE_OFFSET * 1.4).toFixed(3)} - var(--w) * 0.378)`,
};

function EnvelopeLayer({
  y,
  opacity,
  zIndex,
  className,
  children,
}: {
  y: MotionValue<string>;
  opacity: MotionValue<number>;
  zIndex: number | MotionValue<number>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div aria-hidden="true" className={cn(layer, className)} style={{ ...envelopeBox, y, opacity, zIndex }}>
      {children}
    </motion.div>
  );
}

export function InvitationCover(props: InvitationCoverProps) {
  const { isOpen, open } = useInvitation();
  const hydrated = useHydrated();
  const prefersReduced = useReducedMotion();
  const reduceMotion = hydrated && prefersReduced;
  const sectionRef = useRef<HTMLElement>(null);
  const autoScroll = useRef<{ stop: () => void } | null>(null);

  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  // Mark the invitation open once the letter has settled (also handles reloads mid-page).
  useMotionValueEvent(p, "change", (v) => {
    if (v >= 0.9 && !isOpen) open();
  });
  useEffect(() => {
    if (reduceMotion && !isOpen) open();
  }, [reduceMotion, isOpen, open]);

  // Stop the cinematic auto-scroll as soon as the guest scrolls themselves.
  useEffect(() => {
    const cancel = () => autoScroll.current?.stop();
    const events = ["wheel", "touchstart", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, cancel, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, cancel));
  }, []);

  const playOpening = () => {
    const hero = document.getElementById("home");
    if (!hero) return;
    const target = hero.getBoundingClientRect().top + window.scrollY;
    autoScroll.current?.stop();
    autoScroll.current = animate(window.scrollY, target, {
      duration: reduceMotion ? 0.01 : Math.min(5, 1.5 + (target - window.scrollY) / 900),
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
    });
  };

  // ── Scroll-linked values ───────────────────────────────────────────────
  const hintOpacity = useTransform(p, [0, 0.07], [1, 0]);
  const hintPointer = useTransform(p, (v) => (v > 0.06 ? "none" : "auto"));
  const introTextOpacity = useTransform(p, [0, 0.1], [1, 0]);
  const introTextY = useTransform(p, [0, 0.1], ["0px", "-24px"]);

  const sealScale = useTransform(p, [0.05, 0.14], [1, 1.35]);
  const sealOpacity = useTransform(p, [0.05, 0.13], [1, 0]);

  const flapRotate = useTransform(p, [0.1, 0.32], [0, 180]);
  const flapZ = useTransform(p, (v): number => (v < 0.21 ? 40 : 10));

  const cardY = useTransform(p, [0.3, 0.6, 0.85], [CARD_START, CARD_PULLED, 0]);
  const cardYPct = useTransform(cardY, (v) => `${v}%`);
  // Hide the part of the card that is still below the envelope's bottom edge.
  const cardClip = useTransform(cardY, (v) => `inset(-100% -30% ${Math.max(v + 1.5, -100)}% -30%)`);
  const cardScale = useTransform(p, [0.6, 0.85], [1, 1.02]);

  const envelopeY = useTransform(p, [0.6, 0.85], ["0svh", "75svh"]);
  const envelopeOpacity = useTransform(p, [0.66, 0.85], [1, 0]);
  const glowOpacity = useTransform(p, [0, 0.4, 0.85], [0.6, 1, 0.5]);

  const stageStyle = { "--w": "min(84vw, 380px, 60svh)" } as CSSProperties;

  // Reduced motion: the finished state — the letter, no envelope, no scroll choreography.
  if (reduceMotion) {
    return (
      <section
        data-cover=""
        aria-labelledby="cover-title"
        className="paper-beige relative flex min-h-[100svh] flex-col items-center justify-center gap-8 overflow-hidden px-4 py-16"
        style={stageStyle}
      >
        <IslamicPattern opacity={0.1} size={60} />
        <div className="relative" style={{ width: "var(--w)", height: "calc(var(--w) * 1.4)" }}>
          <InvitationCard {...props} titleId="cover-title" />
        </div>
        <Button size="lg" onClick={playOpening}>
          <MailOpen className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
          {props.buttonLabel}
        </Button>
      </section>
    );
  }

  return (
    <section ref={sectionRef} data-cover="" aria-labelledby="cover-title" className="relative h-[320svh]">
      <div className="paper-beige sticky top-0 h-[100svh] overflow-hidden" style={stageStyle}>
        <IslamicPattern opacity={0.12} size={60} />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_50%_55%,color-mix(in_oklab,var(--color-ivory)_90%,transparent),transparent_65%)]"
          style={{ opacity: glowOpacity }}
        />

        {/* Floating light particles — paused once the invitation is open */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {PARTICLES.map((pt, i) => (
            <span
              key={i}
              className={cn(
                "particle absolute bottom-[-10px] rounded-full bg-gold",
                isOpen && "[animation-play-state:paused]",
              )}
              style={
                {
                  left: pt.left,
                  width: pt.size,
                  height: pt.size,
                  "--duration": pt.duration,
                  "--delay": pt.delay,
                  "--drift": pt.drift,
                  "--particle-opacity": pt.opacity,
                } as CSSProperties
              }
            />
          ))}
        </div>

        {/* Greeting above the envelope */}
        <motion.div
          className="absolute inset-x-0 top-[7svh] z-50 px-6 text-center"
          style={{ opacity: introTextOpacity, y: introTextY }}
        >
          <motion.p
            className="eyebrow text-gold-ink"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            You are invited
          </motion.p>
          <motion.p
            className="mt-3 font-serif text-2xl italic text-emerald sm:text-3xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {props.names[0]} {props.joiner} {props.names[1]}
          </motion.p>
        </motion.div>

        {/* Entrance: the whole envelope drifts in once on load */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 1 — Envelope back with gold geometric liner */}
          <EnvelopeLayer y={envelopeY} opacity={envelopeOpacity} zIndex={0}>
            <div className="relative h-full w-full overflow-hidden rounded-[3px] bg-emerald-deep shadow-[0_40px_70px_-30px_rgb(0_0_0/0.55)]">
              <IslamicPattern opacity={0.35} size={34} vignette={false} />
            </div>
          </EnvelopeLayer>

          {/* 2 — The letter */}
          <motion.div
            className="absolute left-1/2 top-1/2 z-20"
            style={{
              width: "var(--w)",
              height: "calc(var(--w) * 1.4)",
              marginLeft: "calc(var(--w) * -0.5)",
              marginTop: "calc(var(--w) * -0.7)",
              y: cardYPct,
              scale: cardScale,
              clipPath: cardClip,
            }}
          >
            <InvitationCard {...props} titleId="cover-title" />
          </motion.div>

          {/* 3 — Front pocket */}
          <EnvelopeLayer y={envelopeY} opacity={envelopeOpacity} zIndex={30}>
            <svg viewBox="0 0 100 70" preserveAspectRatio="none" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="pocket" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--color-emerald-soft)" />
                  <stop offset="1" stopColor="var(--color-emerald)" />
                </linearGradient>
              </defs>
              <path d="M0 0L50 38L100 0V70H0Z" fill="url(#pocket)" />
              <g fill="none" stroke="var(--color-gold)" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <path d="M0 0L50 38L100 0" opacity="0.9" vectorEffect="non-scaling-stroke" />
                <path d="M0 70L42 40M100 70L58 40" opacity="0.45" vectorEffect="non-scaling-stroke" />
                <rect x="0" y="0" width="100" height="70" opacity="0.5" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>
          </EnvelopeLayer>

          {/* 4 — Flap (two faces: emerald outside, patterned liner inside) */}
          <EnvelopeLayer y={envelopeY} opacity={envelopeOpacity} zIndex={flapZ}>
            <motion.div
              className="relative h-full w-full origin-top [transform-style:preserve-3d]"
              style={{ rotateX: flapRotate, transformPerspective: 1400 }}
            >
              <svg
                viewBox="0 0 100 70"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_6px_6px_rgb(0_0_0/0.25)] [backface-visibility:hidden]"
              >
                <path d="M0 0H100L50 42Z" fill="var(--color-emerald)" />
                <path
                  d="M0 0L50 42L100 0"
                  fill="none"
                  stroke="var(--color-gold)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div
                className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]"
                // Pre-flipped so that, once the flap is folded back, the liner shares the flap's top edge.
                style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 40%)" }}
              >
                <div className="absolute inset-0 bg-emerald-deep" />
                <IslamicPattern opacity={0.5} size={30} vignette={false} />
              </div>
            </motion.div>
          </EnvelopeLayer>

          {/* 5 — Wax seal at the flap's tip */}
          <motion.div
            aria-hidden="true"
            className={layer}
            style={{
              zIndex: 45,
              width: "calc(var(--w) * 0.22)",
              height: "calc(var(--w) * 0.22)",
              marginLeft: "calc(var(--w) * -0.11)",
              top: `calc(50% + var(--w) * ${(ENVELOPE_OFFSET * 1.4).toFixed(3)} - var(--w) * 0.378 + var(--w) * 0.454 - var(--w) * 0.11)`,
              scale: sealScale,
              opacity: sealOpacity,
            }}
          >
            <WaxSeal initials={props.initials} joiner={props.joiner} />
          </motion.div>
        </motion.div>

        {/* Scroll cue + accessible shortcut */}
        <motion.div
          className="absolute inset-x-0 bottom-[4svh] z-50 flex flex-col items-center gap-3 px-6"
          style={{ opacity: hintOpacity, pointerEvents: hintPointer }}
        >
          <Button size="md" onClick={playOpening}>
            <MailOpen className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
            {props.buttonLabel}
          </Button>
          <span className="flex flex-col items-center text-gold-ink">
            <span className="eyebrow text-[0.6rem]">or scroll to open</span>
            <motion.span
              aria-hidden="true"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: 5, ease: "easeInOut", delay: 1.5 }}
            >
              <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
            </motion.span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
