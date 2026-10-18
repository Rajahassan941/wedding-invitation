import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface IslamicPatternProps {
  className?: string;
  /** Tailwind background class for the pattern colour, e.g. "bg-gold". */
  tone?: string;
  /** Tile size in px. */
  size?: number;
  opacity?: number;
  /** Fade the pattern out towards the edges for a softer look. */
  vignette?: boolean;
}

/**
 * Eight-point star tessellation rendered as a CSS mask — one tiny inline SVG,
 * no extra DOM nodes, and it inherits theme colours.
 */
export function IslamicPattern({
  className,
  tone = "bg-gold",
  size = 56,
  opacity = 0.12,
  vignette = true,
}: IslamicPatternProps) {
  const style = { "--pattern-size": `${size}px`, opacity } as CSSProperties;
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0",
        vignette && "[mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]",
        className,
      )}
    >
      <div className={cn("islamic-pattern absolute inset-0", tone)} style={style} />
    </div>
  );
}
