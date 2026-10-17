import Link from "next/link";
import { CapstoneNav } from "@/components/CapstoneNav";
import { TableOfContents } from "@/components/TableOfContents";
import { adjacentCapstonePages, capstoneHref, capstonePages, type CapstoneSlug } from "@/lib/capstone";
import { getTableOfContents } from "@/lib/toc";

export interface CapstoneViewProps {
  readonly slug: CapstoneSlug;
}

/**
 * Renders one capstone page. A Server Component shared by `/capstone` (the overview) and
 * `/capstone/[step]`, so both look and behave the same.
 *
 * The dynamic import path is a template literal over a `CapstoneSlug`, so the bundler knows
 * every file it could resolve to and includes exactly those.
 */
export async function CapstoneView({ slug }: CapstoneViewProps) {
  const [{ default: Content }, toc] = await Promise.all([
    import(`@/capstone/${slug}.mdx`),
    getTableOfContents(slug, "capstone"),
  ]);
  const { prev, next } = adjacentCapstonePages(slug);

  return (
    <div className="mx-auto flex w-full max-w-[90rem] gap-10 px-6">
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto py-10 lg:block">
        <CapstoneNav />
      </aside>

      <div className="flex min-w-0 flex-1 gap-12 py-10">
        <article className="min-w-0 max-w-3xl flex-1">
          <details className="mb-6 rounded-md border border-neutral-200 px-3 py-2 text-sm lg:hidden dark:border-neutral-800">
            <summary className="cursor-pointer font-medium">All capstone steps</summary>
            <ol className="mt-2 space-y-1">
              {capstonePages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={capstoneHref(page.slug)}
                    aria-current={page.slug === slug ? "page" : undefined}
                    className={page.slug === slug ? "font-medium text-blue-600 dark:text-blue-400" : "underline"}
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ol>
          </details>

          <div className="prose">
            <Content />
          </div>

          <nav
            aria-label="Capstone navigation"
            className="mt-16 grid gap-4 border-t border-neutral-200 pt-8 sm:grid-cols-2 dark:border-neutral-800"
          >
            {prev ? (
              <Link
                href={capstoneHref(prev.slug)}
                className="rounded-lg border border-neutral-200 px-4 py-3 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
              >
                <span className="block text-xs uppercase tracking-wider text-neutral-500">Previous</span>
                <span className="mt-1 block font-medium">{prev.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={capstoneHref(next.slug)}
                className="rounded-lg border border-neutral-200 px-4 py-3 transition-colors hover:border-neutral-300 hover:bg-neutral-50 sm:col-start-2 sm:text-right dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
              >
                <span className="block text-xs uppercase tracking-wider text-neutral-500">Next</span>
                <span className="mt-1 block font-medium">{next.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </article>

        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-2 xl:block">
          <TableOfContents nodes={toc} />
        </aside>
      </div>
    </div>
  );
}
