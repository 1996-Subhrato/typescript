/**
 * Which exercises the reader has ticked off, stored in the browser's localStorage.
 *
 * The pure parts (`parseCompleted`, `serialiseCompleted`) have no browser dependency and are
 * unit-tested. Everything stored in localStorage is untrusted input (the user, an older version
 * of this site, or another tab may have written it), so it is validated before use.
 */

/** Bump the suffix if the stored format ever changes. */
export const STORAGE_KEY = "ts-docs:exercises:v1";

/** Reads the stored value defensively: anything that is not a list of strings counts as empty. */
export function parseCompleted(raw: string | null): ReadonlySet<string> {
  if (raw === null || raw === "") return new Set();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((item: unknown) => typeof item === "string")) {
      return new Set<string>(parsed);
    }
  } catch {
    // fall through to the empty set
  }
  return new Set();
}

export function serialiseCompleted(completed: ReadonlySet<string>): string {
  return JSON.stringify([...completed].sort());
}

/** The id of one exercise: its topic and its position in that topic's Practice section. */
export function exerciseId(slug: string, position: number): string {
  return `${slug}:${position}`;
}
