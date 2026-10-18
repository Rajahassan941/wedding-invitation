"use client";

import { CalendarPlus, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import {
  downloadIcs,
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  type CalendarEvent,
} from "@/lib/calendar";
import { EASE_LUXE } from "@/lib/utils";

const itemClass =
  "flex w-full items-center rounded-md px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-beige focus-visible:bg-beige";

export function AddToCalendar({ event }: { event: CalendarEvent }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/70 px-4 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-emerald transition-colors hover:bg-emerald hover:text-ivory"
      >
        <CalendarPlus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        Add to calendar
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            className="absolute bottom-full left-0 z-20 mb-2 w-56 rounded-xl border border-gold/40 bg-ivory p-1.5 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.35)]"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE_LUXE }}
          >
            <a
              className={itemClass}
              href={getGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              Google Calendar
            </a>
            <button
              type="button"
              className={itemClass}
              onClick={() => {
                downloadIcs(event);
                setOpen(false);
              }}
            >
              Apple / Outlook (.ics)
            </button>
            <a
              className={itemClass}
              href={getOutlookCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              Outlook.com
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
