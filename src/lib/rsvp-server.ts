import "server-only";
import type { RsvpBackendMode } from "./rsvp";

/** Webhook mode activates automatically once RSVP_WEBHOOK_URL is a valid https URL. */
export function getRsvpMode(): RsvpBackendMode {
  const url = process.env.RSVP_WEBHOOK_URL?.trim();
  if (!url) return "demo";
  try {
    return new URL(url).protocol === "https:" ? "webhook" : "demo";
  } catch {
    return "demo";
  }
}
