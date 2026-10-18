import Link from "next/link";
import { firstTopicHref } from "@/lib/site";

/** Site-wide footer. A Server Component with no state. */
export function SiteFooter() {
  const links = [
    { href: firstTopicHref(), label: "Docs" },
    { href: "/capstone", label: "Capstone" },
    { href: "/exercises", label: "Exercises" },
  ] as const;

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="max-w-xl">
          A TypeScript reference for JavaScript developers, written as a learning project and built with
          Next.js, strict TypeScript and MDX.
        </p>
        <nav aria-label="Footer" className="flex items-center gap-5">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-fg">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
