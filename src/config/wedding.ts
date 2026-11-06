import type { WeddingConfig } from "@/types/wedding";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — the only file you need to edit.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Everything below is PLACEHOLDER content. Replace every value marked with
 *  "Bride Name", "Groom Name", "Venue Name", etc. before sharing the invitation.
 *
 *  Images: drop your photos into /public/images and update the `src` paths.
 *  Dates:  always include the UTC offset (e.g. +05:30) so times are correct
 *          for every guest, wherever they open the invitation.
 */
export const weddingConfig: WeddingConfig = {
  meta: {
    title: "Rinsha & Rafid — Nikah Invitation",
    description: "With gratitude to Allah, Rinsha and Rafid invite you to celebrate their Nikah.",
    siteUrl: "https://example.com",
    locale: "en-GB",
    lang: "en",
    allowIndexing: false,
    ogImageAlt: "Nikah invitation for Rinsha and Rafid",
  },

  theme: {
    colors: {
      ivory: "#FAF7F0",
      gold: "#C6A76B",
      emerald: "#173F35",
      sage: "#A8B5A0",
      beige: "#E9DFD0",
      text: "#292A25",
    },
  },

  greeting: {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    transliteration: "Bismillah ir-Rahman ir-Rahim",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful",
  },

  couple: {
    bride: {
      fullName: "Rinsha.K",
      displayName: "Rinsha",
      role: "The Bride",
      parentsLabel: "Daughter of",
      parents: "Mr. Unneedu.K & Mrs. Hafsath.K",
    },
    groom: {
      fullName: "Ahamed Rafid",
      displayName: "Rafid",
      role: "The Groom",
      parentsLabel: "Son of",
      parents: "Mr. Asainar & Mrs. Nigar Sulthan",
    },
    order: "bride-first",
    joiner: "&",
  },

  wedding: {
    date: "2026-11-29T10:30:00+05:30",
    timezone: "Asia/Kolkata",
    timezoneLabel: "IST",
    title: "Nikah Invitation",
    message:
      "With gratitude to Allah and the blessings of our families, we invite you to celebrate our Nikah.",
  },

  cover: {
    heading: "Together with their families",
    message: "request the honour of your presence and prayers as they begin their journey together",
    buttonLabel: "Open Invitation",
  },

  hero: {
    label: "Nikah Invitation",
    message: "Two hearts, one faith, and a lifetime of mercy and love.",
    overlayOpacity: 0.55,
    scrollLabel: "Scroll",
  },

  coupleSection: {
    eyebrow: "The Couple",
    heading: "Bride & Groom",
    intro: "Brought together by the will of Allah and the love of our families.",
  },

  countdown: {
    eyebrow: "Counting the moments",
    heading: "Until our Nikah",
    completedMessage: "Alhamdulillah, the Nikah celebration has begun.",
    labels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
  },

  events: {
    eyebrow: "The Celebrations",
    heading: "Wedding Events",
    intro: "We would be honoured by your presence at both celebrations.",
    items: [
      {
        id: "nikah",
        label: "Ceremony",
        name: "Nikah",
        start: "2026-11-29T10:30:00+05:30",
        end: "2026-11-29T13:00:00+05:30",
        venueName: "Metro Auditorium",
        address: "Aravankara, Pookkottur",
        mapsUrl: "https://maps.app.goo.gl/tspipkSt2gFWtwmz6",
      },
      {
        id: "walima",
        label: "Reception",
        name: "Walima",
        start: "2026-11-29T16:00:00+05:30",
        venueName: "MI Auditorium",
        address: "Narokkavu",
        mapsUrl: "https://maps.app.goo.gl/gsTTadAnPo85nMUK6",
      },
    ],
  },

  islamicMessage: {
    eyebrow: "A Sacred Union",
    heading: "Love, Mercy & Tranquillity",
    body: [
      "Marriage is a blessing — a bond of companionship, kindness and faith that unites not only two people, but two families.",
      "We are deeply grateful to Allah for bringing us together, and to our families for their endless love, prayers and support.",
    ],
    // The verse is DISABLED by default. Ar-Rum 30:21 is commonly recited for marriage.
    // Copy the Arabic, translation and reference from a trusted source (e.g. quran.com/30/21),
    // have it checked, then set `verified: true` and `features.verse: true`.
    verse: {
      verified: false,
      arabic: "",
      translation: "",
      reference: "",
      translationSource: "",
    },
  },

  story: {
    eyebrow: "Our Story",
    heading: "How It Began",
    paragraphs: [
      "Placeholder story — share how you met, how your families came together, or a few words written by a parent. Keep it short and heartfelt.",
      "A second paragraph can describe the proposal, a shared memory, or your hopes for the life ahead. Disable this section with `features.story: false`.",
    ],
    signature: "With love, Rinsha & Rafid",
  },

  gallery: {
    eyebrow: "Moments",
    heading: "Gallery",
    intro: "Placeholder images — replace them with your own photographs.",
    images: [
      { src: "/images/gallery-1.svg", alt: "Gallery placeholder 1", width: 800, height: 1000, caption: "Placeholder caption" },
      { src: "/images/gallery-2.svg", alt: "Gallery placeholder 2", width: 1200, height: 800 },
      { src: "/images/gallery-3.svg", alt: "Gallery placeholder 3", width: 800, height: 800 },
      { src: "/images/gallery-4.svg", alt: "Gallery placeholder 4", width: 800, height: 1100 },
      { src: "/images/gallery-5.svg", alt: "Gallery placeholder 5", width: 1200, height: 900 },
      { src: "/images/gallery-6.svg", alt: "Gallery placeholder 6", width: 800, height: 1000 },
    ],
  },

  venue: {
    eyebrow: "Location",
    heading: "Venues & Directions",
  },

  rsvp: {
    eyebrow: "Kindly Reply",
    heading: "RSVP",
    intro: "Your presence and prayers would mean the world to us.",
    deadline: "Kindly respond by 15 November 2026",
    maxGuests: 4,
    acceptLabel: "Joyfully accepts",
    declineLabel: "Regretfully declines",
    submitLabel: "Send Response",
    successAttending: "JazakAllahu khayran! We can't wait to celebrate with you.",
    successDeclined: "Thank you for letting us know. You will be in our thoughts and prayers.",
    fields: {
      contact: true,
      notes: true,
      message: true,
    },
  },

  closing: {
    heading: "Your presence and prayers would mean the world to us.",
    message: "We look forward to celebrating this blessed day with you.",
    gratitude: "With love and gratitude, from our families to yours.",
  },

  footer: {
    madeWith: "Made with love",
    credit: "for Rinsha & Rafid",
  },

  navigation: [
    { href: "#couple", label: "Couple", feature: "couple" },
    { href: "#events", label: "Events", feature: "events" },
    { href: "#story", label: "Story", feature: "story" },
    { href: "#gallery", label: "Gallery", feature: "gallery" },
    { href: "#venue", label: "Venues", feature: "venue" },
    { href: "#rsvp", label: "RSVP", feature: "rsvp" },
  ],

  features: {
    cover: true,
    countdown: true,
    couple: true,
    events: true,
    islamicMessage: true,
    verse: false,
    story: false,
    gallery: false,
    venue: true,
    rsvp: false,
    scrollProgress: true,
  },
};
