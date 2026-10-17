/**
 * Cross-reference checker for src/content/*.mdx.
 *
 * Pages cite each other by title in italics (*Narrowing*, *A Generic API Client*). This script
 * keeps those references honest:
 *
 *   NEAR MISS  an italic phrase that is almost, but not exactly, a topic title
 *              (a typo, or a title that was renamed) -> error
 *   UNLINKED   an italic phrase that exactly matches a topic title but is not a link -> error
 *   (info)     level names and short forms (*Utility Types*, *Node.js + Express*) are
 *              allowed as plain italics; they have no single page to link to
 *
 * It also lists wording that may have gone stale ("later in this level", "the next topic", ...)
 * as warnings for a human to review. Warnings never fail the check.
 *
 * Usage:
 *   npm run check:links            check
 *   npm run check:links -- --fix   rewrite every UNLINKED reference as a real link
 *
 * Runs directly under Node's type stripping, so it avoids enums and parameter properties.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

interface Topic {
  readonly slug: string;
  readonly title: string;
}

interface Level {
  readonly title: string;
  readonly topics: readonly Topic[];
}

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content");
const FIX = process.argv.includes("--fix");

function isTopic(value: unknown): value is Topic {
  return (
    typeof value === "object" &&
    value !== null &&
    "slug" in value &&
    typeof value.slug === "string" &&
    "title" in value &&
    typeof value.title === "string"
  );
}

function isLevels(value: unknown): value is readonly Level[] {
  return (
    Array.isArray(value) &&
    value.every(
      (level: unknown) =>
        typeof level === "object" &&
        level !== null &&
        "title" in level &&
        typeof level.title === "string" &&
        "topics" in level &&
        Array.isArray(level.topics) &&
        level.topics.every(isTopic),
    )
  );
}

/** The registry is TypeScript; Node's type stripping can import it directly. */
async function loadLevels(): Promise<readonly Level[]> {
  const url = pathToFileURL(path.join(ROOT, "src", "lib", "registry.ts")).href;
  const loaded: unknown = await import(url);
  if (typeof loaded !== "object" || loaded === null || !("levels" in loaded) || !isLevels(loaded.levels)) {
    throw new Error("src/lib/registry.ts did not export a valid `levels` array");
  }
  return loaded.levels;
}

/** Case-, punctuation- and `&`-insensitive form used for comparing titles. */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[`*_>]/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function distance(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0] ?? 0;
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = previous[j] ?? 0;
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      previous[j] = Math.min(above + 1, (previous[j - 1] ?? 0) + 1, diagonal + cost);
      diagonal = above;
    }
  }
  return previous[b.length] ?? 0;
}

/** Blank out everything that is not prose, keeping newlines so offsets and line numbers survive. */
function maskNonProse(source: string): string {
  const blank = (text: string): string => text.replace(/[^\n]/g, " ");
  return source
    .replace(/^```[\s\S]*?^```[^\n]*$/gm, blank) // fenced code blocks
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, blank) // MDX comments, including check:skip
    .replace(/^#{1,6} .*$/gm, blank) // headings (their ids feed the table of contents)
    .replace(/(`+)[\s\S]*?\1/g, blank); // inline code
}

/** `*emphasis*` with an optional single line break inside, never `**bold**`. */
const ITALIC = /(?<![*\w])\*([^*\s](?:[^*]|\n(?!\s*\n))*?)\*(?![*\w])/g;

const STALE_PHRASES: readonly RegExp[] = [
  /\blater in this level\b/i,
  /\bin the next level\b/i,
  /\bthe next topic\b/i,
  /\bnext-but-one\b/i,
  /\bcovered later\b/i,
  /\bcomes? later\b/i,
  /\bin a later (?:topic|phase|level)\b/i,
  /\bshortly\b/i,
];

const levels = await loadLevels();
const topics = levels.flatMap((level) => level.topics);

const topicByTitle = new Map<string, Topic>();
for (const topic of topics) topicByTitle.set(normalise(topic.title), topic);

// Allowed unlinked forms: level names, and the leading part of a title ("Utility Types").
const allowedPlain = new Set<string>(levels.map((level) => normalise(level.title)));
for (const topic of topics) {
  const lead = topic.title.split(/\s*(?:[&:,]|\band\b)\s*/)[0];
  if (lead && normalise(lead) !== normalise(topic.title)) allowedPlain.add(normalise(lead));
}

const titleKeys = [...topicByTitle.keys()];
let problems = 0;
let linkedAlready = 0;
let fixed = 0;
const warnings: string[] = [];

for (const file of readdirSync(CONTENT_DIR).filter((name) => name.endsWith(".mdx")).sort()) {
  const slug = file.slice(0, -".mdx".length);
  const filePath = path.join(CONTENT_DIR, file);
  const source = readFileSync(filePath, "utf8");
  const masked = maskNonProse(source);
  const lineAt = (offset: number): number => source.slice(0, offset).split("\n").length;

  const edits: { start: number; end: number; slug: string }[] = [];

  for (const match of masked.matchAll(ITALIC)) {
    const start = match.index;
    const text = match[1];
    if (text === undefined) continue;
    const end = start + match[0].length;
    const key = normalise(text);
    const where = `${slug}.mdx:${lineAt(start)}`;

    const topic = topicByTitle.get(key);
    if (topic) {
      if (topic.slug === slug) continue; // a page naming itself needs no link
      const linked = source[start - 1] === "[" && source.slice(end, end + 2) === "](";
      if (linked) {
        linkedAlready += 1;
      } else if (FIX) {
        edits.push({ start, end, slug: topic.slug });
      } else {
        problems += 1;
        console.log(`UNLINKED   ${where}  *${text.replace(/\s+/g, " ")}*  ->  /docs/${topic.slug}`);
      }
      continue;
    }

    if (allowedPlain.has(key) || key.length < 8) continue;

    const nearest = titleKeys
      .map((titleKey) => ({ titleKey, gap: distance(key, titleKey) }))
      .sort((a, b) => a.gap - b.gap)[0];
    if (nearest && nearest.gap <= 2) {
      problems += 1;
      const intended = topicByTitle.get(nearest.titleKey)?.title ?? nearest.titleKey;
      console.log(`NEAR MISS  ${where}  *${text.replace(/\s+/g, " ")}*  looks like  *${intended}*`);
    }
  }

  if (FIX && edits.length > 0) {
    let rewritten = source;
    for (const edit of [...edits].sort((a, b) => b.start - a.start)) {
      const original = rewritten.slice(edit.start, edit.end);
      rewritten = `${rewritten.slice(0, edit.start)}[${original}](/docs/${edit.slug})${rewritten.slice(edit.end)}`;
    }
    writeFileSync(filePath, rewritten);
    fixed += edits.length;
  }

  for (const pattern of STALE_PHRASES) {
    for (const hit of masked.matchAll(new RegExp(pattern.source, `${pattern.flags}g`))) {
      const line = source.split("\n")[lineAt(hit.index) - 1]?.trim() ?? "";
      warnings.push(`${slug}.mdx:${lineAt(hit.index)}  "${hit[0]}"  ${line.slice(0, 110)}`);
    }
  }
}

if (warnings.length > 0) {
  console.log(`\nREVIEW (${warnings.length}) wording that may have gone stale, for a human to check:`);
  for (const warning of warnings) console.log(`  ${warning}`);
}

console.log(
  `\ntopics: ${topics.length} | links already in place: ${linkedAlready}` +
    `${FIX ? ` | rewritten as links: ${fixed}` : ""} | problems: ${problems}`,
);
process.exitCode = problems === 0 ? 0 : 1;
