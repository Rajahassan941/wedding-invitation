/**
 * Date helpers. All formatting is pinned to the wedding's timezone so every guest
 * sees the local time of the event, regardless of where they open the invitation.
 *
 * Formatting runs in Server Components; client components receive ready-made
 * strings to avoid hydration differences between server and browser ICU data.
 */

function formatter(locale: string, timeZone: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, { timeZone, ...options });
}

/** "Friday, 15 January 2027" */
export function formatLongDate(iso: string, locale: string, timeZone: string): string {
  return formatter(locale, timeZone, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** "15 January 2027" */
export function formatDate(iso: string, locale: string, timeZone: string): string {
  return formatter(locale, timeZone, { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}

/** "15 · 01 · 2027" — compact ornamental style for hero and closing. */
export function formatDotDate(iso: string, locale: string, timeZone: string): string {
  const parts = formatter(locale, timeZone, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")} · ${get("month")} · ${get("year")}`;
}

/** "10:00 am" */
export function formatTime(iso: string, locale: string, timeZone: string): string {
  return formatter(locale, timeZone, { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

/** "10:00 am – 12:30 pm" */
export function formatTimeRange(start: string, end: string, locale: string, timeZone: string): string {
  return `${formatTime(start, locale, timeZone)} – ${formatTime(end, locale, timeZone)}`;
}

/** Machine-readable parts for <time> elements: weekday short, day and month. */
export function getDateBadge(iso: string, locale: string, timeZone: string) {
  const date = new Date(iso);
  return {
    day: formatter(locale, timeZone, { day: "2-digit" }).format(date),
    month: formatter(locale, timeZone, { month: "short" }).format(date),
    weekday: formatter(locale, timeZone, { weekday: "long" }).format(date),
  };
}

export interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function getTimeRemaining(targetMs: number, nowMs: number = Date.now()): TimeRemaining {
  const total = Math.max(0, targetMs - nowMs);
  const seconds = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(seconds / 86_400),
    hours: Math.floor((seconds % 86_400) / 3_600),
    minutes: Math.floor((seconds % 3_600) / 60),
    seconds: seconds % 60,
  };
}
