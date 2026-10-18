"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { WeddingImage } from "@/components/ui/WeddingImage";
import { useHydrated } from "@/lib/useHydrated";
import { EASE_LUXE } from "@/lib/utils";
import type { GalleryImage } from "@/types/wedding";

/** Image reveals from behind a soft ivory veil as it scrolls into view. */
function GalleryTile({ image, index, onOpen }: { image: GalleryImage; index: number; onOpen: () => void }) {
  return (
    <motion.li
      data-reveal=""
      className="mb-3 break-inside-avoid sm:mb-5"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, ease: EASE_LUXE, delay: (index % 3) * 0.08 }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group relative block w-full overflow-hidden rounded-[2px] bg-beige"
        aria-label={`Open photo ${index + 1}${image.caption ? `: ${image.caption}` : ""}`}
      >
        <WeddingImage
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
          className="h-auto w-full transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-emerald-deep/0 transition-colors duration-700 group-hover:bg-emerald-deep/25"
        />
        <span
          aria-hidden="true"
          className="absolute inset-3 border border-ivory/0 transition-colors duration-700 group-hover:border-ivory/60"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-4 right-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-ivory/90 text-emerald opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          <Expand className="h-4 w-4" strokeWidth={1.5} />
        </span>
        {image.caption && (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-deep/70 to-transparent px-4 pb-3 pt-10 text-left font-serif text-base italic text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {image.caption}
          </span>
        )}
      </button>
    </motion.li>
  );
}

interface LightboxProps {
  images: GalleryImage[];
  index: number;
  direction: number;
  onClose: () => void;
  onNavigate: (step: number) => void;
}

function Lightbox({ images, index, direction, onClose, onNavigate }: LightboxProps) {
  const image = images[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowRight") onNavigate(1);
    else if (e.key === "ArrowLeft") onNavigate(-1);
    else if (e.key === "Tab") {
      // Keep focus inside the dialog.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) onNavigate(1);
    else if (info.offset.x > 60) onNavigate(-1);
  };

  const navButton =
    "absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-emerald-deep/60 text-ivory backdrop-blur transition-colors hover:bg-gold hover:text-emerald-deep";

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${images.length}`}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-emerald-deep/95 p-4 backdrop-blur-sm sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-ivory transition-colors hover:bg-gold hover:text-emerald-deep"
      >
        <X className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {images.length > 1 && (
        <>
          <button type="button" onClick={() => onNavigate(-1)} aria-label="Previous photo" className={`${navButton} left-3 sm:left-6`}>
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => onNavigate(1)} aria-label="Next photo" className={`${navButton} right-3 sm:right-6`}>
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </>
      )}

      <figure className="pointer-events-none flex max-h-full w-full max-w-5xl flex-col items-center">
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            className="pointer-events-auto relative flex max-h-[78svh] w-full justify-center"
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.5, ease: EASE_LUXE }}
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
          >
            <WeddingImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 64rem, 100vw"
              loading="eager"
              className="h-auto max-h-[78svh] w-auto max-w-full select-none object-contain shadow-2xl"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
        <figcaption className="mt-5 text-center text-ivory/80" aria-live="polite">
          {image.caption && <span className="block font-serif text-lg italic">{image.caption}</span>}
          <span className="eyebrow text-[0.6rem] text-gold">
            {index + 1} / {images.length}
          </span>
        </figcaption>
      </figure>
    </motion.div>
  );
}

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const mounted = useHydrated();
  const triggerRef = useRef<HTMLElement | null>(null);

  const openAt = (i: number) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setDirection(0);
    setActive(i);
  };

  const close = useCallback(() => {
    setActive(null);
    // Return focus to the photo that opened the lightbox.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const navigate = useCallback(
    (step: number) => {
      setDirection(step);
      setActive((i) => (i === null ? i : (i + step + images.length) % images.length));
    },
    [images.length],
  );

  return (
    <>
      <ul className="mt-14 columns-2 gap-3 sm:mt-16 sm:gap-5 lg:columns-3">
        {images.map((image, i) => (
          <GalleryTile key={image.src + i} image={image} index={i} onOpen={() => openAt(i)} />
        ))}
      </ul>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {active !== null && (
              <Lightbox
                key="lightbox"
                images={images}
                index={active}
                direction={direction}
                onClose={close}
                onNavigate={navigate}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
