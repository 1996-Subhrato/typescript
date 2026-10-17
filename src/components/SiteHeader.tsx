import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { Search } from "@/components/Search";

/**
 * A Server Component that renders two Client Components.
 *
 * This is the normal direction: server components may render client ones. The
 * reverse is not allowed — a Client Component cannot import a Server Component
 * and have it stay on the server.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-14 w-full max-w-[90rem] items-center gap-4 px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          TypeScript Reference
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <Search />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
