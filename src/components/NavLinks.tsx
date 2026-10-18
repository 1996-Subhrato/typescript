"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLinkItem {
  readonly href: string;
  readonly label: string;
  /** Path prefix that keeps the link highlighted, e.g. every page under `/docs`. */
  readonly match: string;
}

/**
 * The header's primary links, with the current section highlighted.
 * A Client Component only because `usePathname` is a hook.
 */
export function NavLinks({ items }: { readonly items: readonly NavLinkItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Site" className="hidden items-center gap-1 md:flex">
      {items.map((item) => {
        const active = pathname === item.match || pathname.startsWith(`${item.match}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-fg"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
