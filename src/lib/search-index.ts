import { readFile } from "node:fs/promises";
import path from "node:path";
import { publishedTopics } from "@/lib/docs";
import { extractText } from "@/lib/mdx-text";
import { buildToc } from "@/lib/toc";
import type { SearchHeading, SearchIndex, TocNode } from "@/types/docs";

/**
 * Builds the full-text search index from the MDX sources.
 *
 * SERVER-ONLY (it reads files), like `lib/toc.ts`. The search UI never imports this; it
 * fetches the result from the `/search-index.json` route instead, which keeps `node:fs`
 * out of the browser bundle.
 */

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

/** Flattens the recursive table-of-contents tree into a plain list of headings. */
function flattenHeadings(nodes: readonly TocNode[]): SearchHeading[] {
  return nodes.flatMap((node) => [{ id: node.id, title: node.title }, ...flattenHeadings(node.children)]);
}

export async function buildSearchIndex(): Promise<SearchIndex> {
  return Promise.all(
    publishedTopics.map(async ({ topic, levelTitle }) => {
      const source = await readFile(path.join(CONTENT_DIR, `${topic.slug}.mdx`), "utf8");
      return {
        slug: topic.slug,
        title: topic.title,
        levelTitle,
        summary: topic.summary,
        headings: flattenHeadings(buildToc(source)),
        text: extractText(source),
      };
    }),
  );
}
