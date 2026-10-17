import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { capstoneHref, capstonePages } from "../src/lib/capstone.ts";

const CAPSTONE_DIR = path.join(process.cwd(), "src", "capstone");

function pageFiles(): string[] {
  return readdirSync(CAPSTONE_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length))
    .sort();
}

function firstHeading(slug: string): string | undefined {
  const source = readFileSync(path.join(CAPSTONE_DIR, `${slug}.mdx`), "utf8");
  return /^# (.+?)\s*$/m.exec(source)?.[1];
}

test("the capstone page list and the files in src/capstone are the same set", () => {
  assert.deepEqual([...capstonePages.map((page) => page.slug)].sort(), pageFiles());
});

test("each registered title equals the page's own h1", () => {
  for (const page of capstonePages) {
    assert.equal(firstHeading(page.slug), page.title, `${page.slug}.mdx`);
  }
});

test("the overview is first and is served at /capstone", () => {
  assert.equal(capstonePages[0].slug, "overview");
  assert.equal(capstoneHref("overview"), "/capstone");
  assert.equal(capstoneHref("01-domain"), "/capstone/01-domain");
});

test("the overview links to every step", () => {
  const source = readFileSync(path.join(CAPSTONE_DIR, "overview.mdx"), "utf8");
  for (const page of capstonePages) {
    if (page.slug === "overview") continue;
    assert.ok(source.includes(`(/capstone/${page.slug})`), `overview does not link to ${page.slug}`);
  }
});

test("summaries are non-empty single sentences", () => {
  for (const page of capstonePages) {
    assert.ok(page.summary.length > 10 && page.summary.endsWith("."), page.slug);
  }
});
