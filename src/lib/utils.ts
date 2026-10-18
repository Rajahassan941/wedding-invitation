/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Shared easing curve — a soft "expo out" that feels calm rather than springy. */
export const EASE_LUXE = [0.22, 1, 0.36, 1] as const;
