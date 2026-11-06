import { MapPin, Navigation } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { RevealGroup, RevealItem } from "@/components/ui/AnimatedSection";
import { ButtonLink } from "@/components/ui/Button";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatTimeRange } from "@/lib/date";
import { getDirectionsUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";
import type { WeddingEvent } from "@/types/wedding";
import { CopyAddressButton } from "./CopyAddressButton";

/** Groups events by venue so a venue shared by several events appears once. */
function getVenues(events: WeddingEvent[]) {
  const venues = new Map<string, { name: string; address: string; mapsUrl?: string; events: WeddingEvent[] }>();
  for (const event of events) {
    const key = `${event.venueName}|${event.address}`;
    const venue = venues.get(key) ?? { name: event.venueName, address: event.address, mapsUrl: event.mapsUrl, events: [] };
    venue.events.push(event);
    venues.set(key, venue);
  }
  return [...venues.values()];
}

export function VenueSection() {
  const { venue, events, meta, wedding } = weddingConfig;
  const venues = getVenues(events.items);
  if (venues.length === 0) return null;

  return (
    <section id="venue" aria-labelledby="venue-title" className="paper-beige relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="venue-title" eyebrow={venue.eyebrow} title={venue.heading} />

        <RevealGroup
          className={cn(
            "mx-auto mt-14 grid gap-8 sm:mt-16",
            venues.length > 1 ? "max-w-5xl md:grid-cols-2" : "max-w-xl",
          )}
        >
          {venues.map((v) => (
            <RevealItem key={`${v.name}|${v.address}`}>
              <article className="relative flex h-full flex-col items-center border border-gold/50 bg-ivory px-6 py-12 text-center shadow-[0_40px_80px_-50px_rgb(0_0_0/0.45)] sm:px-10">
                <div aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-gold/20" />

                <p className="eyebrow relative text-gold-ink">
                  {v.events
                    .map((e) => `${e.name} · ${formatTimeRange(e.start, e.end, meta.locale, wedding.timezone)}`)
                    .join("  /  ")}
                </p>
                <h3 className="relative mt-4 font-serif text-4xl text-emerald sm:text-5xl">{v.name}</h3>
                <OrnamentalDivider className="relative mt-6" />

                <address className="relative mt-6 flex items-start justify-center gap-2.5 not-italic text-ink">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
                  <span>{v.address}</span>
                </address>

                <div className="relative mt-auto flex flex-col items-center gap-3 pt-9 sm:flex-row sm:justify-center">
                  <ButtonLink href={getDirectionsUrl(v.address, v.mapsUrl)} external>
                    <Navigation className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
                    Get Directions
                  </ButtonLink>
                  <CopyAddressButton address={`${v.name}, ${v.address}`} />
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
