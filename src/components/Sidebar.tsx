"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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
  // `HTMLAnchorElement | null`: React cannot know the link is mounted, so the null check is real.
  const activeRef = useRef<HTMLAnchorElement>(null);

  // On a long list the current topic can be far below the fold; bring it into view.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <nav aria-label="Documentation">
      <ul className="space-y-7">
        {allLevels.map((level) => (
          <li key={level.id}>
            <h2 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">
              {level.title}
            </h2>
            <ul className="space-y-0.5">
              {level.topics.map((topic) => {
                const href = `/docs/${topic.slug}`;
                const isActive = pathname === href;

                if (topic.status !== "published") {
                  return (
                    <li key={topic.slug}>
                      <span
                        className="block rounded-md px-3 py-1.5 text-[13.5px] text-subtle opacity-60"
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
                      ref={isActive ? activeRef : undefined}
                      href={href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded-md px-3 py-1.5 text-[13.5px] transition-colors ${
                        isActive
                          ? "bg-accent-soft font-medium text-accent"
                          : "text-muted hover:bg-surface-2 hover:text-fg"
                      }`}
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
