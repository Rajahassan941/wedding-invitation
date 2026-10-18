/** Google Maps helpers — none of these require an API key. */

/** Directions link: uses the configured share link, or builds one from the address. */
export function getDirectionsUrl(address: string, mapsUrl?: string): string {
  if (mapsUrl && /^https:\/\//.test(mapsUrl.trim())) return mapsUrl.trim();
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

/** Only official Google Maps embed URLs are rendered in an iframe. */
export function getSafeEmbedUrl(embedUrl: string): string | null {
  const url = embedUrl.trim();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const isGoogleEmbed =
      parsed.protocol === "https:" &&
      parsed.hostname === "www.google.com" &&
      parsed.pathname.startsWith("/maps/embed");
    return isGoogleEmbed ? parsed.toString() : null;
  } catch {
    return null;
  }
}
