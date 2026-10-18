import { weddingConfig } from "@/config/wedding";
import { RevealGroup, RevealItem } from "@/components/ui/AnimatedSection";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { FloralSprig } from "@/components/ui/FloralSprig";
import { IslamicPattern } from "@/components/ui/IslamicPattern";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import { formatDotDate } from "@/lib/date";
import { getOrderedCouple } from "@/lib/wedding";

export function ClosingSection() {
  const { closing, couple, wedding, meta } = weddingConfig;
  const [first, second] = getOrderedCouple();

  return (
    <section
      id="closing"
      aria-labelledby="closing-title"
      className="relative overflow-hidden bg-emerald pb-20 pt-28 text-center text-ivory sm:pb-24 sm:pt-36"
    >
      <IslamicPattern opacity={0.08} size={64} />
      <FloralSprig className="absolute bottom-0 left-0 w-32 opacity-60 sm:w-48" leafFill="fill-sage/25" />
      <FloralSprig flip className="absolute bottom-0 right-0 w-32 opacity-60 sm:w-48" leafFill="fill-sage/25" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <RevealGroup stagger={0.15}>
          <RevealItem>
            <h2
              id="closing-title"
              className="mx-auto max-w-2xl font-serif text-3xl font-light italic leading-snug text-balance sm:text-5xl"
            >
              {closing.heading}
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mx-auto mt-6 max-w-md text-ivory/75">{closing.message}</p>
          </RevealItem>

          <RevealItem>
            <div className="relative mx-auto mt-16 flex w-full max-w-sm flex-col items-center px-8 pb-12 pt-20">
              <ArchFrame />
              <p className="eyebrow relative text-gold">{wedding.title}</p>
              <p className="display-name relative mt-6 text-5xl sm:text-6xl">{first.displayName}</p>
              <p className="relative my-2 font-serif text-2xl italic text-gold" aria-hidden="true">
                {couple.joiner}
              </p>
              <p className="display-name relative text-5xl sm:text-6xl">{second.displayName}</p>
              <OrnamentalDivider className="relative mt-8" />
              <p className="eyebrow relative mt-6 text-ivory/85">
                <time dateTime={wedding.date}>{formatDotDate(wedding.date, meta.locale, wedding.timezone)}</time>
              </p>
            </div>
          </RevealItem>

          <RevealItem>
            <p className="mx-auto mt-10 max-w-md font-serif text-xl italic text-ivory/85">{closing.gratitude}</p>
          </RevealItem>
          {wedding.hashtag && (
            <RevealItem>
              <p className="eyebrow mt-6 text-gold">{wedding.hashtag}</p>
            </RevealItem>
          )}
        </RevealGroup>
      </div>
    </section>
  );
}
