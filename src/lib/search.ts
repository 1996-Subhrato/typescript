import type { SearchEntry, SearchHeading, SearchIndex } from "@/types/docs";

/**
 * Full-text search over the index. Pure functions only: no DOM, no network, no `@/` value
 * imports, so the same code runs in the browser and in the Node-based tests.
 */

/* -------------------------------------------------------------------------- */
/* Validating the index (it arrives over the network, so it starts as `unknown`) */
/* -------------------------------------------------------------------------- */

function isHeading(value: unknown): value is SearchHeading {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "title" in value &&
    typeof value.title === "string"
  );
}

function isEntry(value: unknown): value is SearchEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    "slug" in value &&
    typeof value.slug === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    "levelTitle" in value &&
    typeof value.levelTitle === "string" &&
    "summary" in value &&
    typeof value.summary === "string" &&
    "text" in value &&
    typeof value.text === "string" &&
    "headings" in value &&
    Array.isArray(value.headings) &&
    value.headings.every(isHeading)
  );
}

/** Returns the index if it has the expected shape, otherwise `null`. */
export function parseSearchIndex(value: unknown): SearchIndex | null {
  return Array.isArray(value) && value.every(isEntry) ? value : null;
}

/* -------------------------------------------------------------------------- */
/* Searching                                                                  */
/* -------------------------------------------------------------------------- */

export interface SearchHit {
  readonly entry: SearchEntry;
  readonly score: number;
  /** The heading that best matches the query, if any. */
  readonly heading: SearchHeading | undefined;
  /** A short excerpt of prose around the first match, if the prose matched. */
  readonly snippet: string | undefined;
}

interface Prepared {
  readonly title: string;
  readonly summary: string;
  readonly level: string;
  readonly text: string;
  readonly headings: readonly string[];
}

// Lower-casing 60 pages of prose on every keystroke would be wasteful; do it once per entry.
const prepared = new WeakMap<SearchEntry, Prepared>();

function prepare(entry: SearchEntry): Prepared {
  const existing = prepared.get(entry);
  if (existing) return existing;
  const created: Prepared = {
    title: entry.title.toLowerCase(),
    summary: entry.summary.toLowerCase(),
    level: entry.levelTitle.toLowerCase(),
    text: entry.text.toLowerCase(),
    headings: entry.headings.map((heading) => heading.title.toLowerCase()),
  };
  prepared.set(entry, created);
  return created;
}

export function tokenise(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countOccurrences(haystack: string, needle: string, cap: number): number {
  let count = 0;
  let from = 0;
  while (count < cap) {
    const at = haystack.indexOf(needle, from);
    if (at === -1) break;
    count += 1;
    from = at + needle.length;
  }
  return count;
}

function makeSnippet(original: string, lower: string, tokens: readonly string[]): string | undefined {
  let first = -1;
  for (const token of tokens) {
    const at = lower.indexOf(token);
    if (at !== -1 && (first === -1 || at < first)) first = at;
  }
  if (first === -1) return undefined;

  const start = Math.max(0, first - 50);
  const end = Math.min(original.length, first + 100);
  let excerpt = original.slice(start, end).trim();
  if (start > 0) excerpt = `...${excerpt}`;
  if (end < original.length) excerpt = `${excerpt}...`;
  return excerpt;
}

/**
 * Every query word must appear somewhere in the topic (title, summary, level, a heading or
 * the prose). Ranking, highest first: a whole word in the title, then part of the title, then
 * a heading, then the summary, then prose (more occurrences count, up to five). A whole-phrase
 * match in the title or prose earns a bonus. Ties keep learning order.
 */
export function search(index: SearchIndex, query: string, limit = 8): SearchHit[] {
  const tokens = tokenise(query);
  if (tokens.length === 0) return [];
  const phrase = tokens.join(" ");

  const hits: { hit: SearchHit; order: number }[] = [];

  index.forEach((entry, order) => {
    const p = prepare(entry);
    let score = 0;

    for (const token of tokens) {
      let tokenScore = 0;

      if (new RegExp(`(^|[^a-z0-9])${escapeRegExp(token)}($|[^a-z0-9])`).test(p.title)) tokenScore += 20;
      else if (p.title.includes(token)) tokenScore += 10;

      if (p.headings.some((heading) => heading.includes(token))) tokenScore += 6;
      if (p.summary.includes(token)) tokenScore += 4;
      if (p.level.includes(token)) tokenScore += 1;
      tokenScore += countOccurrences(p.text, token, 5);

      if (tokenScore === 0) return; // a word is missing entirely: this topic does not match
      score += tokenScore;
    }

    if (tokens.length > 1) {
      if (p.title.includes(phrase)) score += 15;
      if (p.text.includes(phrase)) score += 5;
    }

    // The heading that contains the most query words.
    let bestHeading: SearchHeading | undefined;
    let bestCount = 0;
    entry.headings.forEach((heading, headingIndex) => {
      const lower = p.headings[headingIndex] ?? "";
      const matched = tokens.filter((token) => lower.includes(token)).length;
      if (matched > bestCount) {
        bestCount = matched;
        bestHeading = heading;
      }
    });

    hits.push({
      hit: {
        entry,
        score,
        heading: bestHeading,
        snippet: makeSnippet(entry.text, p.text, tokens),
      },
      order,
    });
  });

  return hits
    .sort((a, b) => b.hit.score - a.hit.score || a.order - b.order)
    .slice(0, limit)
    .map(({ hit }) => hit);
}
