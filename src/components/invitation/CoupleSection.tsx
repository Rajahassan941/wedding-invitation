import { weddingConfig } from "@/config/wedding";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/AnimatedSection";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { FloralSprig } from "@/components/ui/FloralSprig";
import { IslamicPattern } from "@/components/ui/IslamicPattern";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WeddingImage } from "@/components/ui/WeddingImage";
import { getInitial, getOrderedCouple } from "@/lib/wedding";
import type { PersonProfile } from "@/types/wedding";

function Portrait({ person }: { person: PersonProfile }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[17rem] sm:max-w-[19rem]">
      {/* Offset gold outline */}
      <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-full border border-gold/60" />
      <div className="group relative h-full overflow-hidden rounded-t-full bg-emerald">
        {person.image ? (
          <WeddingImage
            src={person.image.src}
            alt={person.image.alt}
            fill
            sizes="(min-width: 640px) 19rem, 17rem"
            className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none"
            style={{ objectPosition: person.image.position ?? "50% 30%" }}
          />
        ) : (
          // Monogram fallback — no photograph required
          <div className="flex h-full items-center justify-center" role="img" aria-label={`${person.displayName} monogram`}>
            <IslamicPattern opacity={0.16} size={44} />
            <span className="display-name relative text-8xl text-gold">{getInitial(person.displayName)}</span>
          </div>
        )}
        <div aria-hidden="true" className="absolute inset-3 rounded-t-full border border-ivory/30" />
      </div>
    </div>
  );
}

function ProfileCard({ person }: { person: PersonProfile }) {
  return (
    <RevealGroup className="flex flex-col items-center text-center" stagger={0.1}>
      <RevealItem className="w-full">
        <Portrait person={person} />
      </RevealItem>
      <RevealItem>
        <p className="eyebrow mt-12 text-gold-ink">{person.role}</p>
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
      <RevealItem>
        <p className="mx-auto mt-6 max-w-sm text-pretty text-[0.95rem] text-ink-muted">{person.bio}</p>
      </RevealItem>
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

        <div className="mt-16 grid gap-20 sm:mt-20 md:grid-cols-[1fr_auto_1fr] md:gap-10 lg:gap-16">
          <ProfileCard person={first} />

          <Reveal className="hidden items-center md:flex" delay={0.3}>
            <div className="relative flex h-40 w-24 items-center justify-center">
              <ArchFrame />
              <span className="relative font-serif text-5xl italic text-gold" aria-hidden="true">
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
