"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef } from "react";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { IslamicPattern } from "@/components/ui/IslamicPattern";
import { WeddingImage } from "@/components/ui/WeddingImage";
import { EASE_LUXE } from "@/lib/utils";
import type { ImageAsset } from "@/types/wedding";
import { useInvitation } from "./InvitationProvider";

interface HeroSectionProps {
  label: string;
  names: [string, string];
  joiner: string;
  date: string;
  dateTime: string;
  message: string;
  image?: ImageAsset;
  overlayOpacity: number;
  scrollLabel: string;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.55 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE_LUXE } },
};

export function HeroSection(props: HeroSectionProps) {
  const { isOpen } = useInvitation();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduceMotion ? 1 : 0]);

  const state = isOpen ? "visible" : "hidden";

  return (
    <section
      ref={ref}
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-emerald-deep text-ivory"
    >
      {/* Background — photograph with slow settle zoom, or ornamental fallback */}
      <motion.div aria-hidden={!props.image} className="absolute inset-0 -z-10" style={{ y: imageY }}>
        {props.image ? (
          <motion.div
            className="absolute inset-[-4%]"
            initial={{ scale: 1.12 }}
            animate={{ scale: isOpen ? 1 : 1.12 }}
            transition={{ duration: 2.8, ease: EASE_LUXE }}
          >
            <WeddingImage
              src={props.image.src}
              alt={props.image.alt}
              fill
              preload
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: props.image.position ?? "50% 50%" }}
            />
          </motion.div>
        ) : (
          <IslamicPattern opacity={0.14} size={72} />
        )}
      </motion.div>

      {/* Readability overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-emerald-deep"
        style={{ opacity: props.image ? props.overlayOpacity : 0.2 }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-deep/60 via-transparent to-emerald-deep/80"
      />

      {/* Decorative arch around the names */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[78svh] max-h-[46rem] w-[min(88vw,30rem)] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0.55 : 0 }}
        transition={{ duration: 2, ease: EASE_LUXE, delay: 0.4 }}
      >
        <ArchFrame />
      </motion.div>

      <motion.div
        className="relative mx-auto max-w-4xl px-6 py-28 text-center"
        style={{ opacity: contentOpacity }}
        variants={container}
        initial="hidden"
        animate={state}
      >
        <motion.p data-reveal="" variants={line} className="flex items-center justify-center gap-4 eyebrow text-gold">
          <span aria-hidden="true" className="h-px w-8 bg-gold/70 sm:w-14" />
          {props.label}
          <span aria-hidden="true" className="h-px w-8 bg-gold/70 sm:w-14" />
        </motion.p>

        <h1 id="hero-title" className="mt-8">
          <motion.span data-reveal="" variants={line} className="display-name block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl">
            {props.names[0]}
          </motion.span>
          <motion.span
            data-reveal=""
            variants={line}
            className="my-3 block font-serif text-3xl italic text-gold sm:my-4 sm:text-4xl"
            aria-label="and"
          >
            {props.joiner}
          </motion.span>
          <motion.span data-reveal="" variants={line} className="display-name block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl">
            {props.names[1]}
          </motion.span>
        </h1>

        <motion.p data-reveal="" variants={line} className="mt-10">
          <time dateTime={props.dateTime} className="eyebrow text-ivory/90 sm:text-xs">
            {props.date}
          </time>
        </motion.p>

        <motion.p
          data-reveal=""
          variants={line}
          className="mx-auto mt-6 max-w-md font-serif text-xl font-light italic leading-snug text-ivory/85 text-balance sm:text-2xl"
        >
          {props.message}
        </motion.p>
      </motion.div>

      {/* Scroll indicator — bobs a few times, then rests (no endless animation) */}
      <motion.a
        href="#couple"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/70 transition-colors hover:text-gold"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <span className="eyebrow text-[0.6rem]">{props.scrollLabel}</span>
        <motion.span
          aria-hidden="true"
          animate={isOpen && !reduceMotion ? { y: [0, 6, 0] } : undefined}
          transition={{ duration: 1.8, repeat: 4, ease: "easeInOut", delay: 2.2 }}
        >
          <ChevronDown className="h-5 w-5" strokeWidth={1.25} />
        </motion.span>
      </motion.a>
    </section>
  );
}
