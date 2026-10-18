"use client";

import { AlertCircle, Info, Loader2, Minus, Plus, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Reveal } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { FloralSprig } from "@/components/ui/FloralSprig";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import {
  RSVP_LIMITS,
  validateRsvp,
  type Attendance,
  type RsvpBackendMode,
  type RsvpErrors,
  type RsvpResponse,
} from "@/lib/rsvp";
import { cn, EASE_LUXE } from "@/lib/utils";
import type { WeddingConfig } from "@/types/wedding";

type RsvpSettings = WeddingConfig["rsvp"];

interface RSVPSectionProps {
  settings: RsvpSettings;
  mode: RsvpBackendMode;
}

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; persisted: boolean; attendance: Attendance }
  | { kind: "error"; message: string };

const inputClass =
  "block w-full rounded-none border-0 border-b border-gold/60 bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink-muted/60 transition-colors focus:border-emerald focus:outline-none focus:ring-0 focus-visible:outline-none aria-[invalid=true]:border-red-700";

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block text-[0.62rem] text-gold-ink">
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal text-ink-muted">(optional)</span>}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="mt-2 flex items-center gap-1.5 text-sm text-red-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuccessMark() {
  return (
    <svg viewBox="0 0 80 80" className="mx-auto h-20 w-20 text-gold" fill="none" stroke="currentColor" aria-hidden="true">
      <motion.circle
        cx="40"
        cy="40"
        r="36"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: EASE_LUXE }}
      />
      <motion.path
        d="M26 41l9 9 19-20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: EASE_LUXE, delay: 0.7 }}
      />
    </svg>
  );
}

export function RSVPSection({ settings, mode }: RSVPSectionProps) {
  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    contact: `${uid}-contact`,
    guests: `${uid}-guests`,
    notes: `${uid}-notes`,
    message: `${uid}-message`,
    website: `${uid}-website`,
  };

  const [values, setValues] = useState({
    name: "",
    contact: "",
    attendance: "" as Attendance | "",
    guests: 1,
    notes: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  const update = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as keyof RsvpErrors]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const focusFirstError = (errs: RsvpErrors) => {
    const order: Array<keyof RsvpErrors> = ["name", "contact", "attendance", "guests", "notes", "message"];
    const first = order.find((k) => errs[k]);
    if (!first) return;
    const target =
      first === "attendance"
        ? formRef.current?.querySelector<HTMLElement>('input[name="attendance"]')
        : document.getElementById(ids[first as keyof typeof ids]);
    target?.focus();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const result = validateRsvp(values, settings.maxGuests);
    if (!result.success) {
      setErrors(result.errors);
      focusFirstError(result.errors);
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as RsvpResponse | null;

      if (!data) throw new Error("Unexpected response from the server.");
      if (!data.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
          focusFirstError(data.fieldErrors);
        }
        setStatus({ kind: "error", message: data.error });
        return;
      }
      setStatus({ kind: "success", persisted: data.persisted, attendance: result.data.attendance });
    } catch {
      setStatus({
        kind: "error",
        message: "We couldn't send your response. Please check your connection and try again.",
      });
    }
  }

  const describedBy = (key: keyof RsvpErrors) => (errors[key] ? `${ids[key as keyof typeof ids]}-error` : undefined);
  const attending = values.attendance === "accept";

  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="paper relative overflow-hidden py-24 sm:py-32">
      <FloralSprig className="absolute -left-6 bottom-16 w-28 opacity-60 sm:w-40" />
      <FloralSprig flip className="absolute -right-6 top-16 w-28 opacity-60 sm:w-40" />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-8">
        <Reveal y={36}>
          <div className="relative border border-gold/60 bg-ivory/90 px-5 py-14 shadow-[0_40px_80px_-50px_rgb(0_0_0/0.45)] sm:px-14 sm:py-16">
            <div aria-hidden="true" className="pointer-events-none absolute inset-2 border border-gold/25" />

            <div className="relative text-center">
              <p className="eyebrow text-gold-ink">{settings.eyebrow}</p>
              <h2 id="rsvp-title" className="mt-4 font-serif text-5xl font-light text-emerald sm:text-6xl">
                {settings.heading}
              </h2>
              <OrnamentalDivider className="mt-6" />
              <p className="mx-auto mt-6 max-w-md font-serif text-xl italic text-ink-muted">{settings.intro}</p>
              {settings.deadline && <p className="eyebrow mt-4 text-[0.62rem] text-emerald">{settings.deadline}</p>}
            </div>

            {mode === "demo" && (
              <div className="relative mt-8 flex items-start gap-3 rounded-sm border border-gold/50 bg-beige/60 p-4 text-sm text-ink">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
                <p>
                  <strong className="font-medium">Demo mode:</strong> responses are validated but{" "}
                  <strong className="font-medium">not saved</strong>. Configure an RSVP backend before sharing this
                  invitation.
                </p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {status.kind === "success" ? (
                <motion.div
                  key="success"
                  role="status"
                  className="relative mt-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE_LUXE }}
                >
                  <SuccessMark />
                  <p className="mt-6 font-serif text-3xl text-emerald">
                    {status.attendance === "accept" ? settings.successAttending : settings.successDeclined}
                  </p>
                  {!status.persisted && (
                    <p className="mx-auto mt-5 max-w-sm text-sm text-ink-muted">
                      This was a demo submission — your response has <strong>not</strong> been saved or sent to the
                      hosts.
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-6"
                    onClick={() => {
                      setStatus({ kind: "idle" });
                    }}
                  >
                    Edit response
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={onSubmit}
                  className="relative mt-10 space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  aria-busy={status.kind === "submitting"}
                >
                  <Field id={ids.name} label="Full name" error={errors.name}>
                    <input
                      id={ids.name}
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={RSVP_LIMITS.name}
                      value={values.name}
                      onChange={(e) => update("name", e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={describedBy("name")}
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </Field>

                  {settings.fields.contact && (
                    <Field id={ids.contact} label="Email or phone" optional error={errors.contact}>
                      <input
                        id={ids.contact}
                        name="contact"
                        autoComplete="email"
                        inputMode="email"
                        maxLength={RSVP_LIMITS.contact}
                        value={values.contact}
                        onChange={(e) => update("contact", e.target.value)}
                        aria-invalid={Boolean(errors.contact)}
                        aria-describedby={describedBy("contact")}
                        className={inputClass}
                        placeholder="So we can reach you if plans change"
                      />
                    </Field>
                  )}

                  <fieldset aria-describedby={errors.attendance ? `${uid}-attendance-error` : undefined}>
                    <legend className="eyebrow text-[0.62rem] text-gold-ink">Will you attend?</legend>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          ["accept", settings.acceptLabel],
                          ["decline", settings.declineLabel],
                        ] as const
                      ).map(([value, label]) => {
                        const checked = values.attendance === value;
                        return (
                          <label
                            key={value}
                            className={cn(
                              "relative flex min-h-14 cursor-pointer items-center justify-center rounded-full border px-5 text-center font-serif text-lg transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
                              checked
                                ? "border-emerald bg-emerald text-ivory"
                                : "border-gold/60 text-ink hover:border-emerald",
                            )}
                          >
                            <input
                              type="radio"
                              name="attendance"
                              value={value}
                              checked={checked}
                              onChange={() => update("attendance", value)}
                              className="sr-only"
                            />
                            {label}
                          </label>
                        );
                      })}
                    </div>
                    {errors.attendance && (
                      <p id={`${uid}-attendance-error`} className="mt-2 flex items-center gap-1.5 text-sm text-red-800">
                        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        {errors.attendance}
                      </p>
                    )}
                  </fieldset>

                  <AnimatePresence initial={false}>
                    {attending && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.45, ease: EASE_LUXE }}
                        className="overflow-hidden"
                      >
                        <Field id={ids.guests} label={`Number of guests (max ${settings.maxGuests})`} error={errors.guests}>
                          <div className="mt-3 flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => update("guests", Math.max(1, values.guests - 1))}
                              disabled={values.guests <= 1}
                              aria-label="Decrease guests"
                              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-emerald transition-colors hover:bg-emerald hover:text-ivory disabled:opacity-40"
                            >
                              <Minus className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <input
                              id={ids.guests}
                              name="guests"
                              type="number"
                              inputMode="numeric"
                              min={1}
                              max={settings.maxGuests}
                              value={values.guests}
                              onChange={(e) =>
                                update("guests", Math.min(settings.maxGuests, Math.max(1, Number(e.target.value) || 1)))
                              }
                              aria-invalid={Boolean(errors.guests)}
                              aria-describedby={describedBy("guests")}
                              className="w-16 border-0 border-b border-gold/60 bg-transparent py-2 text-center font-serif text-3xl lining-nums tabular-nums text-emerald focus:border-emerald focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <button
                              type="button"
                              onClick={() => update("guests", Math.min(settings.maxGuests, values.guests + 1))}
                              disabled={values.guests >= settings.maxGuests}
                              aria-label="Increase guests"
                              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-emerald transition-colors hover:bg-emerald hover:text-ivory disabled:opacity-40"
                            >
                              <Plus className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {settings.fields.notes && attending && (
                    <Field id={ids.notes} label="Dietary or accessibility needs" optional error={errors.notes}>
                      <textarea
                        id={ids.notes}
                        name="notes"
                        rows={2}
                        maxLength={RSVP_LIMITS.notes}
                        value={values.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        aria-invalid={Boolean(errors.notes)}
                        aria-describedby={describedBy("notes")}
                        className={cn(inputClass, "resize-none")}
                        placeholder="Allergies, wheelchair access, seating needs…"
                      />
                    </Field>
                  )}

                  {settings.fields.message && (
                    <Field id={ids.message} label="Message for the couple" optional error={errors.message}>
                      <textarea
                        id={ids.message}
                        name="message"
                        rows={3}
                        maxLength={RSVP_LIMITS.message}
                        value={values.message}
                        onChange={(e) => update("message", e.target.value)}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={describedBy("message")}
                        className={cn(inputClass, "resize-none")}
                        placeholder="Duas and good wishes…"
                      />
                    </Field>
                  )}

                  {/* Honeypot — hidden from people, tempting for bots */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor={ids.website}>Website</label>
                    <input
                      id={ids.website}
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.website}
                      onChange={(e) => update("website", e.target.value)}
                    />
                  </div>

                  <AnimatePresence>
                    {status.kind === "error" && (
                      <motion.div
                        role="alert"
                        className="flex items-start gap-3 rounded-sm border border-red-800/30 bg-red-50 p-4 text-sm text-red-900"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        {status.message}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-2 text-center">
                    <Button type="submit" size="lg" disabled={status.kind === "submitting"} className="w-full sm:w-auto">
                      {status.kind === "submitting" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-gold" aria-hidden="true" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
                          {settings.submitLabel}
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
