/**
 * Theme handling shared by the inline boot script and the toggle.
 *
 * The site follows the operating system until the reader makes a choice; that choice is
 * stored under `STORAGE_KEY` and applied as `<html data-theme="light|dark">`. With no stored
 * choice there is no attribute at all, and the stylesheet falls back to `prefers-color-scheme`.
 */
export type Theme = "light" | "dark";

export const STORAGE_KEY = "theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** Reads the stored choice. Storage can throw (private windows, blocked cookies), so it is guarded. */
export function readStoredTheme(): Theme | null {
  try {
    const stored: unknown = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The choice still applies for this page view; it just will not be remembered.
  }
}

/** What the page is showing right now: the explicit choice, or else the system preference. */
export function currentTheme(): Theme {
  const explicit = document.documentElement.dataset["theme"];
  if (isTheme(explicit)) return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Runs in <head> before the first paint, so a stored choice is applied before anything is
 * drawn. Without it the page would flash the system theme and then switch.
 * (See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md.)
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
