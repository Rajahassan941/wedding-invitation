/**
 * RSVP contract shared by the form (client) and the API route (server).
 * The server always re-validates — client validation is only for user feedback.
 */

export type Attendance = "accept" | "decline";

/** How the server handles submissions. Determined by environment variables. */
export type RsvpBackendMode = "demo" | "webhook";

export interface RsvpPayload {
  name: string;
  contact: string;
  attendance: Attendance;
  guests: number;
  notes: string;
  message: string;
  /** Honeypot — must stay empty. Bots tend to fill every field. */
  website: string;
}

export type RsvpField = Exclude<keyof RsvpPayload, "website">;
export type RsvpErrors = Partial<Record<RsvpField, string>>;

export type RsvpResponse =
  | { ok: true; persisted: boolean; mode: RsvpBackendMode }
  | { ok: false; error: string; fieldErrors?: RsvpErrors };

export const RSVP_LIMITS = {
  name: 100,
  contact: 120,
  notes: 500,
  message: 1000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/;

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export type ValidationResult =
  | { success: true; data: Omit<RsvpPayload, "website"> }
  | { success: false; errors: RsvpErrors; isSpam?: boolean };

/** Validates and normalises untrusted input. */
export function validateRsvp(input: unknown, maxGuests: number): ValidationResult {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const errors: RsvpErrors = {};

  if (asTrimmedString(raw.website)) {
    return { success: false, errors: {}, isSpam: true };
  }

  const name = asTrimmedString(raw.name).replace(/\s+/g, " ");
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > RSVP_LIMITS.name) errors.name = "Please shorten your name.";

  const contact = asTrimmedString(raw.contact);
  if (contact) {
    if (contact.length > RSVP_LIMITS.contact) errors.contact = "This contact detail is too long.";
    else if (!EMAIL_PATTERN.test(contact) && !PHONE_PATTERN.test(contact))
      errors.contact = "Enter a valid email address or phone number.";
  }

  const attendance = raw.attendance;
  if (attendance !== "accept" && attendance !== "decline") {
    errors.attendance = "Please let us know if you can attend.";
  }

  let guests = 0;
  if (attendance === "accept") {
    const parsed = typeof raw.guests === "number" ? raw.guests : Number(raw.guests);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > maxGuests) {
      errors.guests = `Please choose between 1 and ${maxGuests} guests.`;
    } else {
      guests = parsed;
    }
  }

  const notes = asTrimmedString(raw.notes);
  if (notes.length > RSVP_LIMITS.notes) errors.notes = `Please keep notes under ${RSVP_LIMITS.notes} characters.`;

  const message = asTrimmedString(raw.message);
  if (message.length > RSVP_LIMITS.message)
    errors.message = `Please keep your message under ${RSVP_LIMITS.message} characters.`;

  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    data: { name, contact, attendance: attendance as Attendance, guests, notes, message },
  };
}
