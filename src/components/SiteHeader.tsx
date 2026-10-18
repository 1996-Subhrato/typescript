import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { NavLinks, type NavLinkItem } from "@/components/NavLinks";
import { Search } from "@/components/Search";
import { ThemeToggle } from "@/components/ThemeToggle";
import { firstTopicHref } from "@/lib/site";

/**
 * A Server Component that renders Client Components (search, theme toggle, menu, active links).
 *
 * This is the normal direction: server components may render client ones. The
 * reverse is not allowed — a Client Component cannot import a Server Component
 * and have it stay on the server.
 */
export function SiteHeader() {
  const items: readonly NavLinkItem[] = [
    { href: firstTopicHref(), label: "Docs", match: "/docs" },
    { href: "/capstone", label: "Capstone", match: "/capstone" },
    { href: "/exercises", label: "Exercises", match: "/exercises" },
  ];

  // The blur lives on its own layer, not on <header>: `backdrop-filter` makes an element the
  // containing block for `position: fixed` descendants, which would shrink the menu drawer and
  // the search overlay (both fixed, both rendered inside the header) to the header's height.
  return (
    <header className="sticky top-0 z-40">
      <div aria-hidden="true" className="absolute inset-0 -z-10 border-b border-line bg-bg/80 backdrop-blur-md" />
      <div className="mx-auto flex h-14 w-full max-w-[90rem] items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-md pr-1" aria-label="TypeScript Reference, home">
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-md bg-accent-solid font-mono text-[11px] font-bold leading-none text-accent-solid-fg"
          >
            TS
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">TypeScript Reference</span>
        </Link>

        <NavLinks items={items} />

        <div className="ml-auto flex items-center gap-2">
          <Search />
          <ThemeToggle />
          <MobileNav links={items} />
        </div>
      </div>
    </header>
  );
}
