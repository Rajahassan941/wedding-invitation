import { weddingConfig } from "@/config/wedding";
import type { PersonProfile, WeddingConfig } from "@/types/wedding";

/** Returns the two partners in the configured display order. */
export function getOrderedCouple(
  config: WeddingConfig = weddingConfig,
): [PersonProfile, PersonProfile] {
  const { bride, groom, order } = config.couple;
  return order === "bride-first" ? [bride, groom] : [groom, bride];
}

/** "Bride Name & Groom Name" */
export function getCoupleNames(config: WeddingConfig = weddingConfig): string {
  const [first, second] = getOrderedCouple(config);
  return `${first.displayName} ${config.couple.joiner} ${second.displayName}`;
}

/** First letter of each name, e.g. ["B", "G"]. Handles non-Latin scripts. */
export function getInitials(config: WeddingConfig = weddingConfig): [string, string] {
  const [first, second] = getOrderedCouple(config);
  return [getInitial(first.displayName), getInitial(second.displayName)];
}

export function getInitial(name: string): string {
  return Array.from(name.trim())[0]?.toUpperCase() ?? "";
}

/** Whether the Quranic verse block is allowed to render. */
export function isVerseReady(config: WeddingConfig = weddingConfig): boolean {
  const { verse } = config.islamicMessage;
  return Boolean(
    config.features.verse &&
      verse.verified &&
      verse.arabic.trim() &&
      verse.translation.trim() &&
      verse.reference.trim(),
  );
}

/** Canonical site URL, preferring the deployment environment variable. */
export function getSiteUrl(config: WeddingConfig = weddingConfig): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return fromEnv || config.meta.siteUrl;
}

/** Navigation items whose sections are enabled. */
export function getVisibleNavigation(config: WeddingConfig = weddingConfig) {
  return config.navigation.filter((item) => config.features[item.feature]);
}
