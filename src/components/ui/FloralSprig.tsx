import { cn } from "@/lib/utils";

interface FloralSprigProps {
  className?: string;
  /** Mirror horizontally. */
  flip?: boolean;
  /** Tailwind text colour for stems and outlines. */
  tone?: string;
  /** Tailwind fill colour class for leaves, e.g. "fill-sage/40". */
  leafFill?: string;
}

const LEAF = "M0 0C7-9 21-9 28 0C21 9 7 9 0 0Z";

const LEAVES: Array<{ x: number; y: number; r: number; s: number }> = [
  { x: 38, y: 178, r: -40, s: 0.9 },
  { x: 46, y: 150, r: -150, s: 0.85 },
  { x: 58, y: 126, r: -35, s: 1 },
  { x: 64, y: 100, r: -145, s: 0.9 },
  { x: 74, y: 76, r: -30, s: 0.95 },
  { x: 82, y: 54, r: -140, s: 0.8 },
  { x: 96, y: 34, r: -25, s: 0.75 },
];

/** A hand-drawn style botanical sprig — delicate stems, leaves and buds. */
export function FloralSprig({
  className,
  flip = false,
  tone = "text-gold",
  leafFill = "fill-sage/35",
}: FloralSprigProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 200"
      className={cn("pointer-events-none", tone, flip && "-scale-x-100", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
    >
      <path d="M30 200C40 160 50 130 62 100S88 40 118 8" />
      <path d="M62 100C78 96 92 86 104 70" opacity="0.7" />
      <path d="M46 148C34 140 22 138 10 142" opacity="0.7" />
      {LEAVES.map((leaf, i) => (
        <path
          key={i}
          d={LEAF}
          className={leafFill}
          transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}
        />
      ))}
      <path d={LEAF} className={leafFill} transform="translate(104 70) rotate(-60) scale(0.7)" />
      <path d={LEAF} className={leafFill} transform="translate(10 142) rotate(160) scale(0.65)" />
      <g className="fill-current" stroke="none">
        <circle cx="118" cy="8" r="2.6" />
        <circle cx="110" cy="18" r="1.6" opacity="0.8" />
        <circle cx="124" cy="20" r="1.3" opacity="0.6" />
      </g>
      <g strokeWidth="0.8">
        <circle cx="122" cy="62" r="6" />
        <path d="M122 56v12M116 62h12M117.8 57.8l8.4 8.4M126.2 57.8l-8.4 8.4" opacity="0.6" />
      </g>
    </svg>
  );
}
