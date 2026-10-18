import Link from "next/link";
import { CapstoneNav } from "@/components/CapstoneNav";
import { PrevNextCard } from "@/components/PrevNextCard";
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
  const position = capstonePages.findIndex((page) => page.slug === slug);
  const steps = capstonePages.length - 1;

  return (
    <div className="mx-auto flex w-full max-w-[90rem] gap-10 px-4 sm:px-6">
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto py-10 lg:block">
        <CapstoneNav />
      </aside>

      <div className="flex min-w-0 flex-1 gap-12 py-10">
        <article className="min-w-0 max-w-3xl flex-1">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="size-1.5 rounded-full bg-accent-solid" aria-hidden="true" />
            {position === 0 ? "Capstone project" : `Capstone · Step ${position} of ${steps}`}
          </p>

          <details className="mb-6 rounded-lg border border-line bg-surface px-3 py-2 text-sm lg:hidden">
            <summary className="cursor-pointer font-medium">All capstone steps</summary>
            <ol className="mt-2 space-y-1">
              {capstonePages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={capstoneHref(page.slug)}
                    aria-current={page.slug === slug ? "page" : undefined}
                    className={page.slug === slug ? "font-medium text-accent" : "text-muted hover:text-fg"}
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

          <nav aria-label="Capstone navigation" className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
            {prev ? <PrevNextCard href={capstoneHref(prev.slug)} direction="prev" title={prev.title} /> : <div />}
            {next ? <PrevNextCard href={capstoneHref(next.slug)} direction="next" title={next.title} /> : <div />}
          </nav>
        </article>

        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-2 xl:block">
          <TableOfContents nodes={toc} />
        </aside>
      </div>
    </div>
  );
}
