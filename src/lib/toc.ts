import { readFile } from "node:fs/promises";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { HeadingDepth, TocNode } from "@/types/docs";

/**
 * Builds a table of contents by parsing the MDX *source*.
 *
 * Why not a remark plugin? Next 16 runs Turbopack, which cannot receive
 * JavaScript functions in `next.config.ts` — plugins must be named strings with
 * serializable options, so a bespoke inline plugin is not an option. Reading the
 * file is simpler and has no build wiring at all.
 *
 * The IDs must match what `rehype-slug` generated on the rendered headings.
 * They do, because `rehype-slug` uses this exact `github-slugger` package,
 * including its de-duplication counter for repeated headings.
 *
 * This module uses `node:fs` and is therefore SERVER-ONLY. It is deliberately
 * separate from `lib/docs.ts`, which is imported by Client Components.
 */

/** `## Heading` or `### Heading` — captures the hashes and the text. */
const HEADING_RE = /^(#{2,3})\s+(.+?)\s*$/;

/** Opening or closing fence of a code block. */
const FENCE_RE = /^\s*(?:```|~~~)/;

/**
 * Strips inline Markdown so the slug matches the *rendered* text.
 *
 * `## Using \`keyof\` well` renders as "Using keyof well", so rehype-slug
 * produces `using-keyof-well`. Slugging the raw source instead would give
 * `using-keyof-well` only by luck — backticks and asterisks must go first.
 */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1") // code spans
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // italics
    .trim();
}

export function buildToc(source: string): readonly TocNode[] {
  const slugger = new GithubSlugger();
  const roots: TocNode[] = [];
  let currentChildren: TocNode[] | null = null;
  let inFence = false;

  for (const line of source.split(/\r?\n/)) {
    // A `## ` inside a fenced code block is example code, not a heading.
    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = HEADING_RE.exec(line);
    if (!match) continue;

    // `noUncheckedIndexedAccess` makes these `string | undefined`, even though
    // the regex guarantees both groups matched. Guarding is cheap; asserting
    // with `!` would be a lie the compiler could not check.
    const [, hashes, rawTitle] = match;
    if (hashes === undefined || rawTitle === undefined) continue;

    const title = stripInlineMarkdown(rawTitle);
    const depth: HeadingDepth = hashes.length === 2 ? 2 : 3;
    const node: TocNode = { id: slugger.slug(title), title, depth, children: [] };

    if (depth === 2) {
      const children: TocNode[] = [];
      roots.push({ ...node, children });
      currentChildren = children;
    } else {
      // An `###` before any `##` is promoted to the top level rather than dropped.
      (currentChildren ?? roots).push(node);
    }
  }

  return roots;
}

/** Where an MDX page lives: the topics, or the guided capstone. */
export type ContentFolder = "content" | "capstone";

export async function getTableOfContents(
  slug: string,
  folder: ContentFolder = "content",
): Promise<readonly TocNode[]> {
  const directory = path.join(process.cwd(), "src", folder);
  const source = await readFile(path.join(directory, `${slug}.mdx`), "utf8");
  return buildToc(source);
}
