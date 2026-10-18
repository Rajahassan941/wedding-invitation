import { MapPin, Navigation } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { Reveal } from "@/components/ui/AnimatedSection";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { ButtonLink } from "@/components/ui/Button";
import { IslamicPattern } from "@/components/ui/IslamicPattern";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WeddingImage } from "@/components/ui/WeddingImage";
import { getDirectionsUrl, getSafeEmbedUrl } from "@/lib/maps";
import { CopyAddressButton } from "./CopyAddressButton";

/** Shown when no embed URL is configured — an ornamental "map" card, not a fake map. */
function MapPlaceholder({ name }: { name: string }) {
  return (
    <div className="relative flex h-full min-h-80 flex-col items-center justify-center overflow-hidden bg-emerald text-center text-ivory">
      <IslamicPattern opacity={0.12} size={52} />
      <div className="relative flex h-44 w-32 items-center justify-center">
        <ArchFrame />
        <MapPin className="relative h-10 w-10 text-gold" strokeWidth={1.2} aria-hidden="true" />
      </div>
      <p className="relative mt-6 font-serif text-2xl">{name}</p>
      <p className="relative mt-2 max-w-xs px-6 text-xs text-ivory/70">
        Add a Google Maps embed URL in the configuration to show an interactive map here.
      </p>
    </div>
  );
}

export function VenueSection() {
  const { venue } = weddingConfig;
  const embedUrl = getSafeEmbedUrl(venue.embedUrl);
  const directionsUrl = getDirectionsUrl(venue.address, venue.mapsUrl);

  return (
    <section id="venue" aria-labelledby="venue-title" className="paper-beige relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="venue-title" eyebrow={venue.eyebrow} title={venue.heading} />

        <Reveal className="mt-14 sm:mt-16" y={32}>
          <div className="grid overflow-hidden rounded-t-[2px] border border-gold/50 bg-ivory shadow-[0_40px_80px_-50px_rgb(0_0_0/0.45)] lg:grid-cols-[1fr_1.2fr]">
            <div className="relative px-6 py-12 text-center sm:px-12 sm:py-16 lg:text-left">
              <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-gold/20" />
              <p className="eyebrow text-gold-ink">The Venue</p>
              <h3 className="mt-4 font-serif text-4xl text-emerald sm:text-5xl">{venue.name}</h3>
              <OrnamentalDivider className="mt-6 lg:justify-start" />
              <address className="mt-6 not-italic text-ink">
                <span className="flex items-start justify-center gap-2.5 lg:justify-start">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
                  <span>{venue.address}</span>
                </span>
              </address>
              {venue.notes && <p className="mt-5 text-sm text-ink-muted">{venue.notes}</p>}

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <ButtonLink href={directionsUrl} external>
                  <Navigation className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
                  Get Directions
                </ButtonLink>
                <CopyAddressButton address={`${venue.name}, ${venue.address}`} />
              </div>
            </div>

            <div className="relative min-h-80 border-t border-gold/40 lg:border-l lg:border-t-0">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`Map showing ${venue.name}`}
                  className="absolute inset-0 h-full w-full grayscale-[30%] sepia-[15%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : venue.image ? (
                <WeddingImage
                  src={venue.image.src}
                  alt={venue.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40rem, 100vw"
                  className="object-cover"
                />
              ) : (
                <MapPlaceholder name={venue.name} />
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
