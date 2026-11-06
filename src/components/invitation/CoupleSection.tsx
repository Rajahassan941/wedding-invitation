import { weddingConfig } from "@/config/wedding";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/AnimatedSection";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { FloralSprig } from "@/components/ui/FloralSprig";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WeddingImage } from "@/components/ui/WeddingImage";
import { getOrderedCouple } from "@/lib/wedding";
import type { ImageAsset, PersonProfile } from "@/types/wedding";

/** Optional portrait — only rendered when an image is configured. */
function Portrait({ image }: { image: ImageAsset }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[17rem] sm:max-w-[19rem]">
      {/* Offset gold outline */}
      <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-full border border-gold/60" />
      <div className="group relative h-full overflow-hidden rounded-t-full bg-emerald">
        <WeddingImage
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 640px) 19rem, 17rem"
          className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none"
          style={{ objectPosition: image.position ?? "50% 30%" }}
        />
        <div aria-hidden="true" className="absolute inset-3 rounded-t-full border border-ivory/30" />
      </div>
    </div>
  );
}

function ProfileCard({ person }: { person: PersonProfile }) {
  return (
    <RevealGroup className="flex flex-col items-center text-center" stagger={0.1}>
      {person.image && (
        <RevealItem className="mb-12 w-full">
          <Portrait image={person.image} />
        </RevealItem>
      )}
      <RevealItem>
        <p className="eyebrow text-gold-ink">{person.role}</p>
      </RevealItem>
      <RevealItem>
        <h3 className="display-name mt-3 text-5xl text-emerald sm:text-6xl">{person.displayName}</h3>
      </RevealItem>
      <RevealItem>
        <p className="mt-3 font-serif text-lg text-ink">{person.fullName}</p>
      </RevealItem>
      <RevealItem>
        <p className="mt-5 text-sm text-ink-muted">
          <span className="italic">{person.parentsLabel}</span>
          <br />
          <span className="font-medium text-ink">{person.parents}</span>
        </p>
      </RevealItem>
      {person.familyDetails && (
        <RevealItem>
          <p className="mt-2 text-xs tracking-wide text-ink-muted">{person.familyDetails}</p>
        </RevealItem>
      )}
      {person.bio && (
        <RevealItem>
          <p className="mx-auto mt-6 max-w-sm text-pretty text-[0.95rem] text-ink-muted">{person.bio}</p>
        </RevealItem>
      )}
    </RevealGroup>
  );
}

export function CoupleSection() {
  const { coupleSection, couple } = weddingConfig;
  const [first, second] = getOrderedCouple();

  return (
    <section id="couple" aria-labelledby="couple-title" className="paper relative overflow-hidden py-24 sm:py-32">
      <FloralSprig className="absolute -left-6 top-10 w-28 opacity-70 sm:w-40" />
      <FloralSprig flip className="absolute -right-6 bottom-10 w-28 rotate-180 opacity-70 sm:w-40" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="couple-title"
          eyebrow={coupleSection.eyebrow}
          title={coupleSection.heading}
          intro={coupleSection.intro}
        />

        <div className="mt-16 grid gap-10 sm:mt-20 md:grid-cols-[1fr_auto_1fr] md:gap-10 lg:gap-16">
          <ProfileCard person={first} />

          <Reveal className="flex items-center justify-center" delay={0.3}>
            <div className="relative flex h-28 w-16 items-center justify-center md:h-40 md:w-24">
              <ArchFrame />
              <span className="relative font-serif text-4xl italic text-gold md:text-5xl" aria-hidden="true">
                {couple.joiner}
              </span>
            </div>
          </Reveal>

          <ProfileCard person={second} />
        </div>
      </div>
    </section>
  );
}
