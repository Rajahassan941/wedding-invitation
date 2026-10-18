import { cn } from "@/lib/utils";

interface ArchFrameProps {
  className?: string;
  /** Tailwind text colour class for the stroke. */
  tone?: string;
  /** Draw a second, inset outline for a richer frame. */
  double?: boolean;
  /** Optional Tailwind fill class to tint the inside of the arch, e.g. "fill-beige/40". */
  fillClassName?: string;
}

const OUTER = "M4 300V118C4 66 44 38 100 4c56 34 96 62 96 114v182";
const INNER = "M12 300V121C12 74 48 48 100 14c52 34 88 60 88 107v179";

/**
 * A pointed Islamic arch outline that stretches to fill its parent while keeping
 * hairline strokes crisp (non-scaling strokes).
 */
export function ArchFrame({ className, tone = "text-gold", double = true, fillClassName }: ArchFrameProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 300"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", tone, className)}
      fill="none"
      stroke="currentColor"
    >
      {fillClassName && <path d={`${INNER}Z`} className={fillClassName} stroke="none" />}
      <path d={OUTER} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {double && <path d={INNER} strokeWidth="1" opacity="0.55" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}
