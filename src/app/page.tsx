import { weddingConfig } from "@/config/wedding";
import { ClosingSection } from "@/components/invitation/ClosingSection";
import { CoupleSection } from "@/components/invitation/CoupleSection";
import { Countdown } from "@/components/invitation/Countdown";
import { EventsSection } from "@/components/invitation/EventsSection";
import { GallerySection } from "@/components/invitation/GallerySection";
import { HeroSection } from "@/components/invitation/HeroSection";
import { InvitationCover } from "@/components/invitation/InvitationCover";
import { InvitationProvider } from "@/components/invitation/InvitationProvider";
import { IslamicMessage } from "@/components/invitation/IslamicMessage";
import { RSVPSection } from "@/components/invitation/RSVPSection";
import { StorySection } from "@/components/invitation/StorySection";
import { VenueSection } from "@/components/invitation/VenueSection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { formatDotDate, formatLongDate } from "@/lib/date";
import { getRsvpMode } from "@/lib/rsvp-server";
import { getCoupleNames, getInitials, getOrderedCouple, getSiteUrl, getVisibleNavigation } from "@/lib/wedding";

/** Structured data so search engines (if indexing is enabled) understand the events. */
function EventJsonLd() {
  const { events, meta } = weddingConfig;
  if (!meta.allowIndexing) return null;
  const data = events.items
    .filter((e) => !e.isPlaceholder)
    .map((e) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: `${e.name} — ${getCoupleNames()}`,
      startDate: e.start,
      endDate: e.end,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: e.venueName, address: e.address },
      url: getSiteUrl(),
    }));
  if (data.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for "<" to keep the script tag safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function Home() {
  const config = weddingConfig;
  const { features, wedding, meta, couple, greeting } = config;
  const [first, second] = getOrderedCouple();
  const names: [string, string] = [first.displayName, second.displayName];
  const longDate = formatLongDate(wedding.date, meta.locale, wedding.timezone);
  const dotDate = formatDotDate(wedding.date, meta.locale, wedding.timezone);

  return (
    <InvitationProvider coverEnabled={features.cover}>
      <EventJsonLd />

      {features.scrollProgress && <ScrollProgress />}
      <Navbar items={getVisibleNavigation()} initials={getInitials()} joiner={couple.joiner} />

      {features.cover && (
        <InvitationCover
          greetingArabic={greeting.arabic}
          greetingTranslation={greeting.translation}
          heading={config.cover.heading}
          names={names}
          initials={getInitials()}
          joiner={couple.joiner}
          message={config.cover.message}
          date={longDate}
          buttonLabel={config.cover.buttonLabel}
        />
      )}

      <main id="main">
        <HeroSection
          label={config.hero.label}
          names={names}
          joiner={couple.joiner}
          date={dotDate}
          dateTime={wedding.date}
          message={config.hero.message}
          image={config.hero.image}
          overlayOpacity={config.hero.overlayOpacity}
          scrollLabel={config.hero.scrollLabel}
        />

        {features.couple && <CoupleSection />}

        {features.countdown && (
          <Countdown
            target={wedding.date}
            eyebrow={config.countdown.eyebrow}
            heading={config.countdown.heading}
            dateLabel={longDate}
            completedMessage={config.countdown.completedMessage}
            labels={config.countdown.labels}
          />
        )}

        {features.events && <EventsSection />}
        {features.islamicMessage && <IslamicMessage />}
        {features.story && <StorySection />}
        {features.gallery && <GallerySection />}
        {features.venue && <VenueSection />}
        {features.rsvp && <RSVPSection settings={config.rsvp} mode={getRsvpMode()} />}

        <ClosingSection />
      </main>

      <Footer />
    </InvitationProvider>
  );
}
