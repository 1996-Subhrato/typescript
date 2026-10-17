"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { allLevels } from "@/lib/docs";

/**
 * `"use client"` is required here for one reason: `usePathname` is a hook, and
 * hooks need React state, which only exists in the browser. Everything else on
 * this page stays a Server Component.
 *
 * The registry is imported directly rather than passed down as props. That means
 * its strings are bundled into the client JavaScript — a few KB, and worth it to
 * avoid threading the whole navigation tree through every layout. If the registry
 * ever grew large, this is the first thing to reconsider.
 */
export interface SidebarProps {
  /** Called after a link is clicked — used to close the mobile drawer. */
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation">
      <ul className="space-y-7">
        {allLevels.map((level) => (
          <li key={level.id}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {level.title}
            </h2>
            <ul className="space-y-px border-l border-neutral-200 dark:border-neutral-800">
              {level.topics.map((topic) => {
                const href = `/docs/${topic.slug}`;
                const isActive = pathname === href;

                if (topic.status !== "published") {
                  return (
                    <li key={topic.slug}>
                      <span
                        className="block border-l border-transparent py-1 pl-3 text-sm text-neutral-400 dark:text-neutral-600"
                        title="Not written yet"
                      >
                        {topic.title}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={topic.slug}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        isActive
                          ? "-ml-px block border-l border-blue-600 py-1 pl-3 text-sm font-medium text-blue-600 dark:border-blue-400 dark:text-blue-400"
                          : "block border-l border-transparent py-1 pl-3 text-sm text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                      }
                    >
                      {topic.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
