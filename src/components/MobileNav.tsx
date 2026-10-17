"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

/**
 * The sidebar as a drawer on small screens.
 *
 * `Sidebar` takes an `onNavigate` callback so this component can close the
 * drawer when a link is followed — the child does not need to know a drawer
 * exists, which keeps it usable in both layouts.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        className="rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm dark:border-neutral-800"
      >
        Menu
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="h-full w-72 max-w-[85%] overflow-y-auto border-r border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold">Contents</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="text-sm text-neutral-500"
              >
                Close
              </button>
            </div>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
