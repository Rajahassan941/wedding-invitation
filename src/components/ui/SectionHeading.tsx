import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "./AnimatedSection";
import { OrnamentalDivider } from "./OrnamentalDivider";

interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  /** Light text for dark (emerald) sections. */
  inverted?: boolean;
  className?: string;
}

export function SectionHeading({ id, eyebrow, title, intro, inverted, className }: SectionHeadingProps) {
  return (
    <RevealGroup className={cn("mx-auto max-w-2xl text-center", className)}>
      <RevealItem>
        <p className={cn("eyebrow", inverted ? "text-gold" : "text-gold-ink")}>{eyebrow}</p>
      </RevealItem>
      <RevealItem>
        <h2
          id={id}
          className={cn(
            "mt-4 font-serif text-4xl font-light leading-tight text-balance sm:text-5xl lg:text-6xl",
            inverted ? "text-ivory" : "text-emerald",
          )}
        >
          {title}
        </h2>
      </RevealItem>
      <RevealItem>
        <OrnamentalDivider className="mt-6" />
      </RevealItem>
      {intro && (
        <RevealItem>
          <p
            className={cn(
              "mx-auto mt-6 max-w-xl text-base text-pretty sm:text-lg",
              inverted ? "text-ivory/80" : "text-ink-muted",
            )}
          >
            {intro}
          </p>
        </RevealItem>
      )}
    </RevealGroup>
  );
}
