import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrevNextNav } from "@/components/PrevNextNav";
import { TableOfContents } from "@/components/TableOfContents";
import { allLevels, findTopic, getAdjacentTopics, publishedTopics } from "@/lib/docs";
import { getTableOfContents } from "@/lib/toc";

/**
 * `PageProps<"/docs/[slug]">` is a GLOBAL type Next.js generates from the folder
 * structure — no import needed. It knows this route has a `slug`, and that
 * `params` is a Promise in the App Router, so both are checked for us.
 */
export default async function DocPage(props: PageProps<"/docs/[slug]">) {
  const { slug } = await props.params;

  const entry = findTopic(slug);
  if (!entry || entry.topic.status !== "published") {
    notFound();
  }

  // `notFound()` returns `never`, so control flow analysis knows `entry` is
  // defined from here on. No non-null assertion needed.
  const [{ default: Content }, toc] = await Promise.all([
    import(`@/content/${slug}.mdx`),
    getTableOfContents(slug),
  ]);

  const { prev, next } = getAdjacentTopics(slug);

  // "Topic 9 of 11": where this page sits inside its level.
  const levelTopics = allLevels.find((level) => level.id === entry.levelId)?.topics ?? [];
  const position = levelTopics.findIndex((topic) => topic.slug === slug) + 1;

  return (
    <div className="flex gap-12 py-10">
      <article className="min-w-0 max-w-3xl flex-1">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
          <span className="size-1.5 rounded-full bg-accent-solid" aria-hidden="true" />
          {entry.levelTitle}
          {position > 0 && <span className="text-subtle">· Topic {position} of {levelTopics.length}</span>}
        </p>
        <div className="prose">
          <Content />
        </div>
        <PrevNextNav prev={prev} next={next} />
      </article>

      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-2 xl:block">
        <TableOfContents nodes={toc} />
      </aside>
    </div>
  );
}

/** Per-page `<title>`, slotted into the template set in the root layout. */
export async function generateMetadata(
  props: PageProps<"/docs/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const entry = findTopic(slug);
  if (!entry) return {};

  return {
    title: entry.topic.title,
    description: entry.topic.summary,
  };
}

/** Prerender every published topic. */
export function generateStaticParams(): Array<{ slug: string }> {
  return publishedTopics.map((entry) => ({ slug: entry.topic.slug }));
}

/** Any slug not returned above 404s instead of being rendered on demand. */
export const dynamicParams = false;
