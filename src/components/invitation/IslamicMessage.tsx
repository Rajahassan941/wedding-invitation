import { weddingConfig } from "@/config/wedding";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/AnimatedSection";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import { isVerseReady } from "@/lib/wedding";
import { ParallaxPattern } from "./ParallaxPattern";

export function IslamicMessage() {
  const { islamicMessage, greeting } = weddingConfig;
  const { verse } = islamicMessage;
  const showVerse = isVerseReady();

  return (
    <section
      id="blessing"
      aria-labelledby="blessing-title"
      className="paper relative overflow-hidden py-24 sm:py-32"
    >
      <ParallaxPattern />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal y={40}>
          <div className="relative mx-auto px-6 pb-14 pt-24 text-center sm:px-16 sm:pb-20 sm:pt-32">
            <ArchFrame fillClassName="fill-beige/45" />

            <RevealGroup className="relative">
              <RevealItem>
                <p lang="ar" className="arabic text-3xl text-emerald sm:text-4xl">
                  {greeting.arabic}
                </p>
                <p className="mt-2 text-xs italic text-ink-muted">
                  {greeting.transliteration} — {greeting.translation}
                </p>
              </RevealItem>

              <RevealItem>
                <p className="eyebrow mt-10 text-gold-ink">{islamicMessage.eyebrow}</p>
                <h2 id="blessing-title" className="mt-4 font-serif text-4xl font-light text-emerald text-balance sm:text-5xl">
                  {islamicMessage.heading}
                </h2>
                <OrnamentalDivider className="mt-6" />
              </RevealItem>

              {islamicMessage.body.map((paragraph, i) => (
                <RevealItem key={i}>
                  <p className="mx-auto mt-6 max-w-lg font-serif text-xl leading-relaxed text-ink text-pretty sm:text-2xl">
                    {paragraph}
                  </p>
                </RevealItem>
              ))}

              {showVerse && (
                <RevealItem>
                  <figure className="mx-auto mt-12 max-w-xl border-t border-gold/40 pt-10">
                    <blockquote>
                      <p lang="ar" className="arabic text-2xl text-emerald sm:text-3xl">
                        {verse.arabic}
                      </p>
                      <p className="mt-5 font-serif text-lg italic leading-relaxed text-ink-muted">
                        “{verse.translation}”
                      </p>
                    </blockquote>
                    <figcaption className="eyebrow mt-5 text-gold-ink">
                      {verse.reference}
                      {verse.translationSource && (
                        <span className="mt-1 block text-[0.6rem] normal-case tracking-normal text-ink-muted">
                          {verse.translationSource}
                        </span>
                      )}
                    </figcaption>
                  </figure>
                </RevealItem>
              )}
            </RevealGroup>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
