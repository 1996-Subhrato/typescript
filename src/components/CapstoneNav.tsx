"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { capstoneHref, capstonePages } from "@/lib/capstone";

/**
 * The capstone's list of steps, with the current one highlighted.
 *
 * A Client Component only because `usePathname` is a hook. The list itself is a tiny
 * constant, so importing it here costs a few hundred bytes.
 */
export function CapstoneNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Capstone steps">
      <h2 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">
        Capstone
      </h2>
      <ol className="space-y-0.5">
        {capstonePages.map((page, position) => {
          const href = capstoneHref(page.slug);
          const isActive = pathname === href;
          return (
            <li key={page.slug}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-baseline gap-2.5 rounded-md px-3 py-1.5 text-[13.5px] transition-colors ${
                  isActive ? "bg-accent-soft font-medium text-accent" : "text-muted hover:bg-surface-2 hover:text-fg"
                }`}
              >
                <span className="w-4 shrink-0 text-right font-mono text-[11px] text-subtle">
                  {position === 0 ? "" : position}
                </span>
                <span>{page.title.replace(/^Step \d+: /, "")}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
