# Nikah Invitation — Luxury Wedding Website Template

A premium, reusable Muslim wedding invitation website built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4** and **Motion for React**.

Everything you see on the page (names, dates, events, photos, colours, text and which sections appear) comes from **one file**: [`src/config/wedding.ts`](src/config/wedding.ts).

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — see "RSVP setup"
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build && npm start
```

Deploys to Vercel, Netlify or any Node host with no extra configuration.

---

## Customising the invitation

Open `src/config/wedding.ts`. Every field is typed (see `src/types/wedding.ts`) so your editor will autocomplete and flag mistakes.

| What | Where in the config |
| --- | --- |
| Names, parents, bios, portraits | `couple.bride`, `couple.groom`, `couple.order` |
| Wedding date & countdown target | `wedding.date` (ISO 8601 **with UTC offset**) and `wedding.timezone` |
| Opening envelope & letter text | `cover` (disable with `features.cover`) |
| Hero label, message, background image | `hero` |
| Events (add / remove / reorder freely) | `events.items` |
| Islamic message & optional verse | `islamicMessage` |
| Optional story | `story` + `features.story` |
| Gallery | `gallery.images` |
| Venue, map & directions | `venue` |
| RSVP labels & guest limit | `rsvp` |
| Colours | `theme.colors` |
| Social title / description | `meta` |
| Hide / show sections | `features` |

> **All shipped content is placeholder.** Search the config for “Bride Name”, “Groom Name” and “Venue Name” and replace every occurrence before sharing.

### Dates and timezones

Always include the offset, e.g. `"2026-11-29T10:00:00+05:30"`. Every date on the site is displayed in `wedding.timezone`, so guests abroad still see the local time of the ceremony. `wedding.timezoneLabel` (e.g. `IST`) is shown next to event times.

### Photos

1. Put images in `public/images/` (JPG/WebP/AVIF recommended, ≈2000px on the long edge for the hero, ≈1200px for portraits and gallery).
2. Update the `src` paths in the config.
3. For gallery images, set the real `width` and `height` so the layout reserves space and never shifts.
4. Use `position: "50% 30%"` to keep the important part of a photo in frame.

Photographs are never required:

- Remove `image` from a person to show an elegant monogram instead.
- Remove `hero.image` to use the ornamental emerald background.
- The hero works with portraits, venue photos, florals or abstract imagery.

Remote images (e.g. from a CDN) must be allowed in `next.config.ts` → `images.remotePatterns`.

### Colours

Change `theme.colors`. They’re injected as CSS variables at the root, so every component — including the derived darker/lighter tones — follows automatically.

### Quranic verse (disabled by default)

The template never ships unverified scripture. To show a verse (Surah Ar-Rum 30:21 is commonly used for marriage):

1. Copy the Arabic, an English translation and the reference from a trusted source such as [quran.com/30/21](https://quran.com/30/21).
2. Have it checked by someone you trust.
3. Fill `islamicMessage.verse`, set `verified: true` **and** `features.verse: true`.

The verse only renders when all three conditions are met.

---

## RSVP setup

The RSVP form posts to `src/app/api/rsvp/route.ts`, which **always validates on the server** (lengths, attendance, guest limit, honeypot, basic rate limiting) and never logs or stores guest data in the browser.

### Demo mode (default)

With no `RSVP_WEBHOOK_URL`, responses are validated but **not saved**. The form shows a clear “Demo mode” notice and the success screen tells the guest their response was not sent. Configure a backend before sharing the invitation.

### Webhook mode

Set `RSVP_WEBHOOK_URL` (https only) in `.env.local` or your host’s environment variables. Each valid RSVP is forwarded as JSON:

```json
{
  "name": "Guest Name",
  "contact": "guest@example.com",
  "attendance": "accept",
  "guests": 2,
  "notes": "Vegetarian",
  "message": "Mabrook!",
  "submittedAt": "2026-11-02T10:15:00.000Z",
  "source": "wedding-invitation",
  "secret": "only if RSVP_WEBHOOK_SECRET is set"
}
```

If `RSVP_WEBHOOK_SECRET` is set it’s sent both as `Authorization: Bearer <secret>` and in the body (for tools that can’t read headers). Only a 2xx response from your webhook counts as saved; otherwise the guest sees an error and can retry.

> The RSVP mode is read when the page is built — redeploy after changing these variables.

#### Example: Google Sheets (free, no server)

1. Create a Google Sheet with headers: `submittedAt, name, contact, attendance, guests, notes, message`.
2. **Extensions → Apps Script**, paste:

   ```js
   const SECRET = "choose-a-long-random-string";

   function doPost(e) {
     const data = JSON.parse(e.postData.contents);
     if (data.secret !== SECRET) {
       return ContentService.createTextOutput("forbidden");
     }
     SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([
       data.submittedAt, data.name, data.contact, data.attendance,
       data.guests, data.notes, data.message,
     ]);
     return ContentService.createTextOutput("ok");
   }
   ```

3. **Deploy → New deployment → Web app**, execute as *Me*, access *Anyone*. Copy the URL.
4. Set `RSVP_WEBHOOK_URL=<that URL>` and `RSVP_WEBHOOK_SECRET=<same secret>`.

Zapier, Make, n8n, Airtable automations or your own API work the same way.

### Using a database instead

Replace the webhook block in `src/app/api/rsvp/route.ts` with a write to your database (Postgres, Supabase, etc.). Keep credentials in environment variables and keep the existing `validateRsvp` call — it’s the trust boundary.

---

## Privacy & SEO

- `meta.allowIndexing` is **false** by default: invitations contain private details (family names, venues, times), so search engines are asked not to index the site (`robots.txt` + meta robots). Set it to `true` if you want it discoverable; structured event data (JSON-LD) is then emitted for non-placeholder events.
- Social previews (WhatsApp, iMessage, etc.) use an Open Graph image generated from the config (`src/app/opengraph-image.tsx`). Set `NEXT_PUBLIC_SITE_URL` to your real domain so preview links resolve.

---

## Accessibility & motion

- All animation uses transforms and opacity, runs once on scroll (IntersectionObserver), and respects **prefers-reduced-motion**.
- The landing page is a scroll-driven envelope: the wax seal breaks, the flap folds back and the letter slides out as the guest scrolls. An **Open Invitation** button plays the same sequence automatically (and stops the moment the guest scrolls themselves).
- With reduced motion enabled the letter is shown without the envelope choreography; without JavaScript the envelope is skipped and all content is visible.
- The mobile menu and lightbox manage focus and close with <kbd>Esc</kbd>; the gallery supports arrow keys and swipe.
- Gold text uses a darkened tone on light backgrounds to keep WCAG contrast.

---

## Project structure

```
src/
  app/
    layout.tsx            fonts, theme variables, metadata
    page.tsx              composes sections from the config
    globals.css           Tailwind theme, paper texture, geometric pattern
    opengraph-image.tsx   generated social preview
    robots.ts
    api/rsvp/route.ts     server-validated RSVP endpoint
  components/
    invitation/           one component per section (+ small client islands)
    layout/               Navbar, Footer, ScrollProgress
    ui/                   Reveal animations, ornaments, arch, florals, buttons
  config/wedding.ts       ← edit this
  types/wedding.ts        configuration types
  lib/                    dates, calendar (.ics / Google / Outlook), maps, RSVP validation
public/images/            placeholder artwork — replace with your photos
```

Made with love. May Allah bless every couple who uses it.
