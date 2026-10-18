import { Clock, MapPin, Shirt } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { Reveal } from "@/components/ui/AnimatedSection";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { toCalendarEvent } from "@/lib/calendar";
import { formatLongDate, formatTimeRange, getDateBadge } from "@/lib/date";
import { getDirectionsUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";
import { getCoupleNames } from "@/lib/wedding";
import type { WeddingEvent } from "@/types/wedding";
import { AddToCalendar } from "./AddToCalendar";

function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const { locale } = weddingConfig.meta;
  const { timezone, timezoneLabel } = weddingConfig.wedding;
  const badge = getDateBadge(event.start, locale, timezone);
  const isEven = index % 2 === 0;

  return (
    <li className="relative grid gap-6 pl-12 md:grid-cols-2 md:gap-16 md:pl-0">
      {/* Timeline node */}
      <span
        aria-hidden="true"
        className="absolute left-[0.6rem] top-8 z-10 h-3.5 w-3.5 rotate-45 border border-gold bg-ivory md:left-1/2 md:-translate-x-1/2"
      />

      {/* Date badge — opposite side to the card on desktop */}
      <Reveal
        className={cn("hidden items-start md:flex", isEven ? "md:order-1 md:justify-end" : "md:order-2")}
        y={16}
      >
        <div className={cn("pt-3", isEven ? "text-right" : "text-left")}>
          <p className="font-serif text-6xl font-light leading-none text-emerald lining-nums">{badge.day}</p>
          <p className="eyebrow mt-2 text-gold-ink">
            {badge.month} · {badge.weekday}
          </p>
        </div>
      </Reveal>

      <Reveal className={cn(isEven ? "md:order-2" : "md:order-1")} delay={0.1}>
        <article className="group relative rounded-t-[10rem] border border-gold/50 bg-ivory/80 px-6 pb-8 pt-16 text-center shadow-[0_30px_60px_-40px_rgb(0_0_0/0.35)] backdrop-blur-sm transition-shadow duration-700 hover:shadow-[0_40px_70px_-40px_rgb(0_0_0/0.45)] sm:px-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-t-[10rem] border border-gold/20" />

          {event.isPlaceholder && (
            <span className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-beige px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ink-muted">
              Sample event
            </span>
          )}

          {event.label && <p className="eyebrow text-gold-ink">{event.label}</p>}
          <h3 className="mt-3 font-serif text-3xl text-emerald sm:text-4xl">{event.name}</h3>

          <dl className="mt-6 space-y-3 text-sm text-ink">
            <div className="flex items-start justify-center gap-2.5">
              <dt className="sr-only">Date and time</dt>
              <Clock className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <dd>
                <time dateTime={event.start}>{formatLongDate(event.start, locale, timezone)}</time>
                <br />
                <span className="text-ink-muted">
                  {formatTimeRange(event.start, event.end, locale, timezone)} {timezoneLabel}
                </span>
              </dd>
            </div>
            <div className="flex items-start justify-center gap-2.5">
              <dt className="sr-only">Venue</dt>
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <dd>
                <span className="font-medium">{event.venueName}</span>
                <br />
                <span className="text-ink-muted">{event.address}</span>
              </dd>
            </div>
            {event.dressCode && (
              <div className="flex items-start justify-center gap-2.5">
                <dt className="sr-only">Dress code</dt>
                <Shirt className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
                <dd className="text-ink-muted">{event.dressCode}</dd>
              </div>
            )}
          </dl>

          {event.description && (
            <p className="mx-auto mt-5 max-w-sm border-t border-gold/30 pt-5 font-serif text-lg italic leading-snug text-ink-muted">
              {event.description}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink
              href={getDirectionsUrl(event.address, event.mapsUrl)}
              external
              variant="outline"
              size="sm"
              className="min-h-11"
            >
              <MapPin className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Map
            </ButtonLink>
            <AddToCalendar event={toCalendarEvent(event, getCoupleNames())} />
          </div>
        </article>
      </Reveal>
    </li>
  );
}

export function EventsSection() {
  const { events } = weddingConfig;
  if (events.items.length === 0) return null;

  return (
    <section id="events" aria-labelledby="events-title" className="paper-beige relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading id="events-title" eyebrow={events.eyebrow} title={events.heading} intro={events.intro} />

        <div className="relative mt-16 sm:mt-20">
          {/* Timeline spine */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-[1.03rem] top-0 w-px bg-gradient-to-b from-transparent via-gold/70 to-transparent md:left-1/2"
          />
          <ol className="relative space-y-14 md:space-y-20">
            {events.items.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
