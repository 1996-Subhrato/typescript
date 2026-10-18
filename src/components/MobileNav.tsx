"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavLinkItem } from "@/components/NavLinks";
import { Sidebar } from "@/components/Sidebar";

/**
 * The navigation as a drawer on small screens: the site's main links first, then the full
 * topic list.
 *
 * `Sidebar` takes an `onNavigate` callback so this component can close the
 * drawer when a link is followed — the child does not need to know a drawer
 * exists, which keeps it usable in both layouts.
 */
export function MobileNav({ links }: { readonly links: readonly NavLinkItem[] }) {
  const [open, setOpen] = useState(false);

  // Escape closes the drawer. The effect only subscribes to the window; setState is called
  // from inside the listener, which is the intended pattern.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        className="grid size-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:bg-surface-2 hover:text-fg"
      >
        <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="flex h-full w-80 max-w-[88%] flex-col border-r border-line bg-bg shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3">
              <span className="text-sm font-semibold">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="mb-6 grid grid-cols-3 gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-line px-2 py-2 text-center text-sm font-medium text-muted hover:bg-surface-2 hover:text-fg"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
