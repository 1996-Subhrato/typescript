"use client";

import { useLayoutEffect } from "react";
import { currentTheme, readStoredTheme, storeTheme } from "@/lib/theme";

/**
 * Light/dark switch.
 *
 * Both icons are always in the DOM and CSS chooses which one shows, driven by the same
 * selectors as the rest of the page. That keeps the server HTML and the first client render
 * identical (no hydration mismatch) and means the icon is right before any JavaScript runs.
 */
export function ThemeToggle() {
  // In development React's Strict Mode remounts the tree and resets attributes on <html>,
  // wiping what the boot script set. Re-apply the stored choice before paint. A no-op in
  // production. (Described in the Next.js "preventing flash before hydration" guide.)
  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (stored !== null) document.documentElement.setAttribute("data-theme", stored);
  }, []);

  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    storeTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      title="Toggle theme"
      className="grid size-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      <svg className="theme-icon-sun size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="theme-icon-moon size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
    </button>
  );
}
