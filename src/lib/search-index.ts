import { readFile } from "node:fs/promises";
import path from "node:path";
import { capstoneHref, capstonePages } from "@/lib/capstone";
import { publishedTopics } from "@/lib/docs";
import { extractText } from "@/lib/mdx-text";
import { buildToc } from "@/lib/toc";
import type { SearchEntry, SearchHeading, SearchIndex, TocNode } from "@/types/docs";

/**
 * Builds the full-text search index from the MDX sources.
 *
 * SERVER-ONLY (it reads files), like `lib/toc.ts`. The search UI never imports this; it
 * fetches the result from the `/search-index.json` route instead, which keeps `node:fs`
 * out of the browser bundle.
 */

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const CAPSTONE_DIR = path.join(process.cwd(), "src", "capstone");

/** Flattens the recursive table-of-contents tree into a plain list of headings. */
function flattenHeadings(nodes: readonly TocNode[]): SearchHeading[] {
  return nodes.flatMap((node) => [{ id: node.id, title: node.title }, ...flattenHeadings(node.children)]);
}

export async function buildSearchIndex(): Promise<SearchIndex> {
  const topics = publishedTopics.map(async ({ topic, levelTitle }): Promise<SearchEntry> => {
    const source = await readFile(path.join(CONTENT_DIR, `${topic.slug}.mdx`), "utf8");
    return {
      slug: topic.slug,
      href: `/docs/${topic.slug}`,
      title: topic.title,
      levelTitle,
      summary: topic.summary,
      headings: flattenHeadings(buildToc(source)),
      text: extractText(source),
    };
  });

  // Capstone slugs like `overview` could collide with a topic, so they are namespaced.
  const capstone = capstonePages.map(async (page): Promise<SearchEntry> => {
    const source = await readFile(path.join(CAPSTONE_DIR, `${page.slug}.mdx`), "utf8");
    return {
      slug: `capstone/${page.slug}`,
      href: capstoneHref(page.slug),
      title: page.title,
      levelTitle: "Capstone",
      summary: page.summary,
      headings: flattenHeadings(buildToc(source)),
      text: extractText(source),
    };
  });

  return Promise.all([...topics, ...capstone]);
}
