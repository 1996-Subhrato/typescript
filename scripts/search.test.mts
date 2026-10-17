/**
 * Unit tests for the pure search code: `src/lib/search.ts` and `src/lib/mdx-text.ts`.
 *
 *   npm test
 *
 * Uses Node's built-in test runner, so there is no test framework to install. The modules
 * under test deliberately have no `@/` value imports, which is what lets Node load them here.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { extractText } from "../src/lib/mdx-text.ts";
import { parseSearchIndex, search, tokenise } from "../src/lib/search.ts";
import type { SearchEntry } from "../src/types/docs.ts";

function entry(overrides: Partial<SearchEntry> & Pick<SearchEntry, "slug" | "title">): SearchEntry {
  return {
    href: `/docs/${overrides.slug}`,
    levelTitle: "Level",
    summary: "",
    headings: [],
    text: "",
    ...overrides,
  };
}

/* ---------------------------------- extractText --------------------------------- */

test("extractText drops fenced code blocks", () => {
  const text = extractText("Before.\n\n```ts\nconst secret = 1;\n```\n\nAfter.");
  assert.equal(text, "Before. After.");
});

test("extractText keeps the content of inline code", () => {
  assert.equal(extractText("Use `keyof` and `satisfies` here."), "Use keyof and satisfies here.");
});

test("extractText keeps link text and drops the target", () => {
  assert.equal(extractText("See [*Narrowing*](/docs/narrowing) next."), "See Narrowing next.");
});

test("extractText removes MDX comments, heading markers and emphasis", () => {
  const text = extractText("{/* check:skip */}\n## A **bold** heading\n\nSome *italic* text.");
  assert.equal(text, "A bold heading Some italic text.");
});

test("extractText keeps table cell text but not the separator row", () => {
  const text = extractText("| Code | Meaning |\n| ---- | ------- |\n| TS2345 | Bad argument |");
  assert.match(text, /TS2345/);
  assert.match(text, /Bad argument/);
  assert.doesNotMatch(text, /---/);
});

/* ---------------------------------- parseSearchIndex ---------------------------- */

test("parseSearchIndex accepts a well-formed index", () => {
  const index = [entry({ slug: "a", title: "A", headings: [{ id: "x", title: "X" }] })];
  assert.deepEqual(parseSearchIndex(index), index);
});

test("parseSearchIndex rejects malformed data", () => {
  assert.equal(parseSearchIndex(null), null);
  assert.equal(parseSearchIndex({}), null);
  assert.equal(parseSearchIndex([{ slug: "a" }]), null);
  assert.equal(parseSearchIndex([{ ...entry({ slug: "a", title: "A" }), headings: [{ id: 1, title: "X" }] }]), null);
  assert.equal(parseSearchIndex([{ ...entry({ slug: "a", title: "A" }), text: 42 }]), null);
});

/* ---------------------------------- search ------------------------------------- */

test("tokenise lower-cases and splits on whitespace", () => {
  assert.deepEqual(tokenise("  KeyOf   Generic "), ["keyof", "generic"]);
  assert.deepEqual(tokenise("   "), []);
});

test("an empty query returns nothing", () => {
  assert.deepEqual(search([entry({ slug: "a", title: "A" })], "   "), []);
});

test("every word must match somewhere (AND, not OR)", () => {
  const index = [entry({ slug: "a", title: "Unions", text: "unions combine types" })];
  assert.equal(search(index, "unions zebra").length, 0);
  assert.equal(search(index, "unions types").length, 1);
});

test("a whole word in the title outranks a mention in the prose", () => {
  const index = [
    entry({ slug: "mentions", title: "Other topic", text: "narrowing narrowing is mentioned here" }),
    entry({ slug: "titled", title: "Narrowing", text: "" }),
  ];
  assert.equal(search(index, "narrowing")[0]?.entry.slug, "titled");
});

test("a whole-word title match outranks a partial one, whatever the order", () => {
  const index = [
    entry({ slug: "partial", title: "Unionised things" }), // 'union' only inside a longer word
    entry({ slug: "whole", title: "Union types" }), // 'union' as a word of its own
  ];
  assert.equal(search(index, "union")[0]?.entry.slug, "whole");
});

test("ties keep learning order", () => {
  const index = [
    entry({ slug: "first", title: "Alpha", text: "keyword" }),
    entry({ slug: "second", title: "Beta", text: "keyword" }),
  ];
  assert.deepEqual(
    search(index, "keyword").map((hit) => hit.entry.slug),
    ["first", "second"],
  );
});

test("the matching heading is reported", () => {
  const index = [
    entry({
      slug: "a",
      title: "Strictness",
      headings: [
        { id: "intro", title: "Introduction" },
        { id: "exact", title: "exactOptionalPropertyTypes" },
      ],
    }),
  ];
  assert.deepEqual(search(index, "exactoptionalpropertytypes")[0]?.heading, { id: "exact", title: "exactOptionalPropertyTypes" });
});

test("a snippet surrounds the first match and is ellipsised", () => {
  const filler = "lorem ipsum ".repeat(30);
  const index = [entry({ slug: "a", title: "A", text: `${filler}the needle sits here ${filler}` })];
  const snippet = search(index, "needle")[0]?.snippet;
  assert.ok(snippet?.includes("needle"));
  assert.ok(snippet?.startsWith("..."));
  assert.ok(snippet?.endsWith("..."));
});

test("matching is case-insensitive", () => {
  const index = [entry({ slug: "a", title: "A", text: "The Awaited type" })];
  assert.equal(search(index, "AWAITED").length, 1);
});

test("regular-expression characters in a query are treated literally", () => {
  const index = [entry({ slug: "a", title: "A", text: "uses Promise<T> and (parentheses) and [brackets]" })];
  assert.doesNotThrow(() => search(index, "a(b"));
  assert.doesNotThrow(() => search(index, "[x"));
  assert.doesNotThrow(() => search(index, "*+?"));
  assert.equal(search(index, "(parentheses)").length, 1);
});

test("the limit caps the number of results", () => {
  const index = Array.from({ length: 20 }, (_, n) => entry({ slug: `t${n}`, title: `Topic ${n}`, text: "common" }));
  assert.equal(search(index, "common", 5).length, 5);
});
