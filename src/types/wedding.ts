/**
 * Type definitions for the wedding template configuration.
 * Every value rendered on the site comes from an object that satisfies `WeddingConfig`.
 */

/** A local (`/images/...`) or approved remote image. */
export interface ImageAsset {
  src: string;
  /** Describe the image for screen readers. Use "" only for purely decorative images. */
  alt: string;
  /** Intrinsic width — required for gallery images so the layout can reserve space. */
  width?: number;
  /** Intrinsic height — required for gallery images so the layout can reserve space. */
  height?: number;
  /** CSS object-position, e.g. "50% 30%" to keep a face in frame. */
  position?: string;
}

export interface PersonProfile {
  /** Full name, as it should appear on the invitation. */
  fullName: string;
  /** Short name used in large display typography (e.g. first name). */
  displayName: string;
  /** Small label above the name, e.g. "The Bride". */
  role: string;
  /** Lead-in for the parents line, e.g. "Daughter of" / "Son of". */
  parentsLabel: string;
  /** Parents' names. */
  parents: string;
  /** Optional extra family details (grandparents, hometown, siblings…). */
  familyDetails?: string;
  /** Short biography or personal message. */
  bio: string;
  /**
   * Optional portrait. Leave undefined to show an ornamental monogram instead —
   * the template never assumes a photograph should be shown.
   */
  image?: ImageAsset;
}

export interface ThemeColors {
  ivory: string;
  gold: string;
  emerald: string;
  sage: string;
  beige: string;
  text: string;
}

export interface WeddingEvent {
  /** Stable unique id — used for calendar UIDs and React keys. */
  id: string;
  name: string;
  /** Small label above the event name, e.g. "Ceremony". */
  label?: string;
  /** ISO 8601 with UTC offset, e.g. "2027-01-15T10:00:00+05:30". */
  start: string;
  /** ISO 8601 with UTC offset. */
  end: string;
  venueName: string;
  address: string;
  /** Google Maps link. If omitted, a directions link is generated from the address. */
  mapsUrl?: string;
  dressCode?: string;
  description?: string;
  /** Shows a "Sample event" tag so placeholder content is never mistaken for real details. */
  isPlaceholder?: boolean;
}

export interface GalleryImage extends ImageAsset {
  width: number;
  height: number;
  caption?: string;
}

export interface VerseConfig {
  /**
   * Must be set to true by a person who has checked the Arabic text, translation and
   * reference against a trusted source (e.g. https://quran.com). The verse never renders
   * unless this is true AND `features.verse` is enabled AND all fields are filled.
   */
  verified: boolean;
  arabic: string;
  translation: string;
  /** e.g. "Surah Ar-Rum 30:21" */
  reference: string;
  /** e.g. "Translation: Sahih International" */
  translationSource?: string;
}

export interface FeatureFlags {
  cover: boolean;
  countdown: boolean;
  couple: boolean;
  events: boolean;
  islamicMessage: boolean;
  verse: boolean;
  story: boolean;
  gallery: boolean;
  venue: boolean;
  rsvp: boolean;
  scrollProgress: boolean;
}

export interface NavItem {
  /** Section id to scroll to. */
  href: `#${string}`;
  label: string;
  /** The nav item is hidden when this feature is disabled. */
  feature: keyof FeatureFlags;
}

export interface WeddingConfig {
  meta: {
    /** Browser tab and social title. */
    title: string;
    description: string;
    /** Canonical URL of the deployed site. Can be overridden by NEXT_PUBLIC_SITE_URL. */
    siteUrl: string;
    /** BCP 47 locale used for date and time formatting, e.g. "en-GB". */
    locale: string;
    /** HTML lang attribute. */
    lang: string;
    /**
     * Wedding invitations usually contain private details (venues, times, family names).
     * Keep false unless you want search engines to index the site.
     */
    allowIndexing: boolean;
    /** Social preview image text. The image itself is generated from this config. */
    ogImageAlt: string;
  };

  theme: {
    colors: ThemeColors;
  };

  greeting: {
    /** Arabic greeting. Uses correct Unicode Arabic and renders with the Amiri typeface. */
    arabic: string;
    transliteration: string;
    translation: string;
  };

  couple: {
    bride: PersonProfile;
    groom: PersonProfile;
    /** Which name appears first throughout the site. */
    order: "bride-first" | "groom-first";
    /** Character or word between names, e.g. "&" or "and". */
    joiner: string;
  };

  wedding: {
    /** Countdown target. ISO 8601 with UTC offset. */
    date: string;
    /** IANA timezone used for every displayed date, e.g. "Asia/Kolkata". */
    timezone: string;
    /** Short human-readable timezone label shown next to event times, e.g. "IST". */
    timezoneLabel: string;
    title: string;
    message: string;
    hashtag?: string;
  };

  cover: {
    heading: string;
    message: string;
    buttonLabel: string;
  };

  hero: {
    label: string;
    message: string;
    /** Optional background image. Without one, an ornamental emerald background is used. */
    image?: ImageAsset;
    /** 0–1 strength of the dark overlay over the hero image. */
    overlayOpacity: number;
    scrollLabel: string;
  };

  coupleSection: {
    eyebrow: string;
    heading: string;
    intro: string;
  };

  countdown: {
    eyebrow: string;
    heading: string;
    /** Shown once the countdown reaches zero. */
    completedMessage: string;
    labels: { days: string; hours: string; minutes: string; seconds: string };
  };

  events: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: WeddingEvent[];
  };

  islamicMessage: {
    eyebrow: string;
    heading: string;
    /** Non-scriptural message about family, gratitude and marriage. */
    body: string[];
    verse: VerseConfig;
  };

  story: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    signature?: string;
    image?: ImageAsset;
  };

  gallery: {
    eyebrow: string;
    heading: string;
    intro: string;
    images: GalleryImage[];
  };

  venue: {
    eyebrow: string;
    heading: string;
    name: string;
    address: string;
    /** Google Maps share link. If empty, a directions link is generated from the address. */
    mapsUrl: string;
    /**
     * Google Maps embed URL (from Maps → Share → Embed a map → copy the `src`).
     * Must start with https://www.google.com/maps/embed — otherwise no iframe is rendered.
     */
    embedUrl: string;
    notes?: string;
    image?: ImageAsset;
  };

  rsvp: {
    eyebrow: string;
    heading: string;
    intro: string;
    /** Human-readable deadline, e.g. "Kindly respond by 15 December 2026". */
    deadline?: string;
    /** Maximum party size a single response may include (including the guest). */
    maxGuests: number;
    acceptLabel: string;
    declineLabel: string;
    submitLabel: string;
    successAttending: string;
    successDeclined: string;
    fields: {
      contact: boolean;
      notes: boolean;
      message: boolean;
    };
  };

  closing: {
    heading: string;
    message: string;
    gratitude: string;
  };

  footer: {
    madeWith: string;
    credit?: string;
  };

  navigation: NavItem[];

  features: FeatureFlags;
}
