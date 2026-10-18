import { NextResponse } from "next/server";
import { weddingConfig } from "@/config/wedding";
import { getRsvpMode } from "@/lib/rsvp-server";
import { validateRsvp, type RsvpResponse } from "@/lib/rsvp";

/**
 * RSVP endpoint.
 *
 *  • demo    (default)              — validates input and responds `persisted: false`.
 *                                     Nothing is stored; the UI says so explicitly.
 *  • webhook (RSVP_WEBHOOK_URL set) — forwards the validated response to your backend
 *                                     (Google Apps Script → Sheets, Zapier, Make, your own API…).
 *
 * Guest data is never logged and never stored in the browser.
 */

const MAX_BODY_BYTES = 8_192;
const RATE_LIMIT = { windowMs: 60_000, max: 5 };

// Best-effort in-memory rate limit (per server instance). Use a shared store
// such as Upstash/Redis if you need strict limits across serverless instances.
const hits = new Map<string, { count: number; reset: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + RATE_LIMIT.windowMs });
    if (hits.size > 5_000) {
      for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

function json(body: RsvpResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!weddingConfig.features.rsvp) {
    return json({ ok: false, error: "RSVPs are currently closed." }, 403);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json({ ok: false, error: "Unsupported request format." }, 415);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return json({ ok: false, error: "Too many responses — please wait a minute and try again." }, 429);
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
      return json({ ok: false, error: "Your response is too long." }, 413);
    }
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "We couldn't read your response. Please try again." }, 400);
  }

  const result = validateRsvp(raw, weddingConfig.rsvp.maxGuests);
  if (!result.success) {
    if (result.isSpam) {
      // Pretend success to bots without storing anything.
      return json({ ok: true, persisted: false, mode: "demo" });
    }
    return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors: result.errors }, 422);
  }

  const mode = getRsvpMode();

  if (mode === "demo") {
    return json({ ok: true, persisted: false, mode });
  }

  try {
    const secret = process.env.RSVP_WEBHOOK_SECRET;
    const response = await fetch(process.env.RSVP_WEBHOOK_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
      },
      body: JSON.stringify({
        ...result.data,
        // Some no-code tools (e.g. Google Apps Script) cannot read headers, so the
        // secret is also sent in the body. Never expose it to the client.
        ...(secret ? { secret } : {}),
        submittedAt: new Date().toISOString(),
        source: "wedding-invitation",
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);
    return json({ ok: true, persisted: true, mode });
  } catch (error) {
    console.error("[rsvp] Failed to forward RSVP:", error instanceof Error ? error.message : "unknown error");
    return json(
      { ok: false, error: "We couldn't save your response right now. Please try again shortly." },
      502,
    );
  }
}
