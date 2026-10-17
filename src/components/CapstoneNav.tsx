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
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Capstone</h2>
      <ol className="space-y-px border-l border-neutral-200 dark:border-neutral-800">
        {capstonePages.map((page) => {
          const href = capstoneHref(page.slug);
          const isActive = pathname === href;
          return (
            <li key={page.slug}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "-ml-px block border-l border-blue-600 py-1 pl-3 text-sm font-medium text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "block border-l border-transparent py-1 pl-3 text-sm text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                }
              >
                {page.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
