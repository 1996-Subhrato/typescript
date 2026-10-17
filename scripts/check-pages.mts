/**
 * Smoke test for rendered pages. Requires a running server (`npm run dev` or
 * `npm run start`). For every topic it checks:
 *   - HTTP 200
 *   - the table of contents links to exactly the headings that were rendered
 *   - previous/next navigation is present
 *   - every internal /docs/... link written in the article body points at a topic that exists
 *
 * Usage:
 *   npm run check:pages                       # every topic in src/content, localhost:3000
 *   npm run check:pages -- narrowing classes  # selected slugs
 *   BASE_URL=http://localhost:3001 npm run check:pages
 */
import { readdirSync } from "node:fs";
import path from "node:path";
import { parseSearchIndex, search } from "../src/lib/search.ts";

const BASE_URL = process.env["BASE_URL"] ?? "http://localhost:3000";
const CONTENT_DIR = path.join(process.cwd(), "src", "content");

function allSlugs(): string[] {
  return readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length))
    .sort();
}

function matchAll(html: string, pattern: RegExp): string[] {
  return [...html.matchAll(pattern)].flatMap((match) => (match[1] ? [match[1]] : []));
}

const requested = process.argv.slice(2);
const knownSlugs = new Set(allSlugs());
const slugs = requested.length > 0 ? requested : [...knownSlugs];
let failures = 0;
let linkCount = 0;

for (const slug of slugs) {
  const response = await fetch(`${BASE_URL}/docs/${slug}`);
  const html = await response.text();

  const headingIds = matchAll(html, /<h[23][^>]*id="([^"]+)"/g);
  const nav = /aria-label="On this page".*?<\/nav>/s.exec(html)?.[0] ?? "";
  const tocIds = matchAll(nav, /href="#([^"]+)"/g);

  const missingFromPage = tocIds.filter((id) => !headingIds.includes(id));
  const missingFromToc = headingIds.filter((id) => !tocIds.includes(id));
  const hasPrevNext = html.includes('aria-label="Topic navigation"');

  // Links inside the article (body text and the prev/next cards), not the sidebar or header.
  const article = /<article\b.*?<\/article>/s.exec(html)?.[0] ?? "";
  const bodyLinks = matchAll(article, /href="\/docs\/([a-z0-9-]+)"/g);
  linkCount += bodyLinks.length;
  const brokenLinks = bodyLinks.filter((target) => !knownSlugs.has(target));

  const ok =
    response.status === 200 &&
    missingFromPage.length === 0 &&
    missingFromToc.length === 0 &&
    hasPrevNext &&
    brokenLinks.length === 0;
  if (!ok) failures += 1;

  const detail = [
    response.status !== 200 ? `http=${response.status}` : "",
    missingFromPage.length > 0 ? `tocLinksWithNoHeading=${missingFromPage.join(",")}` : "",
    missingFromToc.length > 0 ? `headingsNotInToc=${missingFromToc.join(",")}` : "",
    hasPrevNext ? "" : "noPrevNext",
    brokenLinks.length > 0 ? `brokenLinks=${brokenLinks.join(",")}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  console.log(`${ok ? "OK  " : "FAIL"} ${slug.padEnd(32)} toc=${tocIds.length} ${detail}`.trimEnd());
}

console.log(
  failures === 0
    ? `\nALL ${slugs.length} PAGES OK (${linkCount} internal links inside articles, none broken)`
    : `\n${failures} OF ${slugs.length} PAGE(S) FAILED`,
);

/**
 * The search index is served as JSON (`/search-index.json`). Check that it is valid, covers every
 * topic, and that a few real queries land on the right page. Skipped when specific slugs were asked
 * for, since it is not about any one page.
 */
async function checkSearchIndex(): Promise<number> {
  const response = await fetch(`${BASE_URL}/search-index.json`);
  const body: unknown = await response.json().catch(() => undefined);
  const index = parseSearchIndex(body);

  if (!response.ok || index === null) {
    console.log(`FAIL search-index.json: http=${response.status}, valid=${index !== null}`);
    return 1;
  }

  let failed = 0;
  const indexed = new Set(index.map((entry) => entry.slug));
  const missing = [...knownSlugs].filter((slug) => !indexed.has(slug));
  if (missing.length > 0) {
    failed += 1;
    console.log(`FAIL search index is missing topics: ${missing.join(", ")}`);
  }

  // [query, a slug that must be the top hit]
  const expectations: readonly (readonly [string, string])[] = [
    ["keyof", "generic-constraints"],
    ["satisfies", "type-assertions"],
    ["TS2345", "compiler-errors"],
    ["exactOptionalPropertyTypes", "strictness-flags"],
    ["useActionState", "nextjs-server-actions"],
    ["esModuleInterop", "paths-and-output"],
  ];
  for (const [query, expected] of expectations) {
    const top = search(index, query, 1)[0]?.entry.slug;
    if (top !== expected) {
      failed += 1;
      console.log(`FAIL search "${query}": expected ${expected} first, got ${top ?? "nothing"}`);
    }
  }
  if (search(index, "qzxwvutsr", 1).length !== 0) {
    failed += 1;
    console.log('FAIL search "qzxwvutsr" should return nothing');
  }

  console.log(
    failed === 0
      ? `SEARCH OK (${index.length} topics indexed, ${expectations.length} sample queries land on the right page)`
      : `${failed} SEARCH CHECK(S) FAILED`,
  );
  return failed;
}

const searchFailures = requested.length === 0 ? await checkSearchIndex() : 0;
process.exitCode = failures === 0 && searchFailures === 0 ? 0 : 1;
