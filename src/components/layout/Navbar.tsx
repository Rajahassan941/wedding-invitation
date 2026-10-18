"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useInvitation } from "@/components/invitation/InvitationProvider";
import { cn, EASE_LUXE } from "@/lib/utils";
import type { NavItem } from "@/types/wedding";

interface NavbarProps {
  items: NavItem[];
  initials: [string, string];
  joiner: string;
}

export function Navbar({ items, initials, joiner }: NavbarProps) {
  const { isOpen } = useInvitation();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 60));

  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Close the mobile menu when switching to desktop width.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500",
          solid
            ? "border-b border-gold/25 bg-ivory/85 shadow-[0_10px_30px_-20px_rgb(0_0_0/0.3)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
        initial={{ y: "-100%", opacity: 0 }}
        animate={isOpen ? { y: "0%", opacity: 1 } : { y: "-100%", opacity: 0 }}
        transition={{ duration: 0.9, ease: EASE_LUXE, delay: isOpen ? 1.2 : 0 }}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-[var(--nav-height)] max-w-6xl items-center justify-between px-5 sm:px-8"
        >
          <a
            href="#home"
            className={cn(
              "flex items-center gap-1.5 font-serif text-2xl italic transition-colors duration-500",
              solid ? "text-emerald" : "text-ivory",
            )}
            aria-label="Back to top"
          >
            <span>{initials[0]}</span>
            <span className="text-base text-gold">{joiner}</span>
            <span>{initials[1]}</span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "group relative py-2 text-[0.7rem] font-medium uppercase tracking-[0.24em] transition-colors duration-500",
                    solid ? "text-ink hover:text-emerald" : "text-ivory/85 hover:text-ivory",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>

          <button
            ref={menuButtonRef}
            type="button"
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border transition-colors md:hidden",
              solid ? "border-gold/50 text-emerald" : "border-ivory/40 text-ivory",
            )}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </nav>
      </motion.header>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="paper fixed inset-x-0 bottom-0 top-[var(--nav-height)] z-40 overflow-y-auto border-t border-gold/25 md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE_LUXE }}
          >
            <motion.ul
              className="flex flex-col items-center gap-2 px-6 py-12"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            >
              {items.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: EASE_LUXE }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-3 font-serif text-3xl text-emerald transition-colors hover:text-gold-ink"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
