import { cn } from "@/lib/utils";

interface OrnamentalDividerProps {
  className?: string;
  /** Tailwind text colour class — the ornament uses currentColor. */
  tone?: string;
}

/** A hairline with a small eight-point star at its centre. */
export function OrnamentalDivider({ className, tone = "text-gold" }: OrnamentalDividerProps) {
  return (
    <div aria-hidden="true" className={cn("flex items-center justify-center gap-3", tone, className)}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-current sm:w-20" />
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 1.5 15 9 22.5 12 15 15 12 22.5 9 15 1.5 12 9 9Z" />
        <path d="M5.6 5.6h12.8v12.8H5.6Z" strokeWidth="0.75" opacity="0.7" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      </svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-current sm:w-20" />
    </div>
  );
}
