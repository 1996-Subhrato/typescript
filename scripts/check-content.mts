/**
 * Content quality gate: compiles every ```ts / ```tsx block in src/content/*.mdx and the capstone
 * pages in src/capstone/*.mdx.
 *
 * Convention:
 *   - a line EXPECTED to fail carries a trailing `// Error` comment
 *   - every real compiler error must land on such a line   -> otherwise UNEXPECTED
 *   - every such line must produce a compiler error        -> otherwise STALE CLAIM
 *
 * Each block is compiled as its own module, so snippets must be self-contained.
 * Flags mirror the project's tsconfig (strict + noUncheckedIndexedAccess + ...).
 *
 * Per-block compiler options: leading `// @option: value` lines override the base options for
 * THAT block only, the same convention TypeScript's own test suite uses. Lists are comma
 * separated (`// @lib: es2015,dom`), an empty list is written `// @types:`, and the value `default`
 * removes the base option entirely.
 * Names and values are validated by TypeScript's own option parser, so a typo fails loudly
 * (BAD DIRECTIVE). Blocks sharing an option set are compiled together in one tsc run. The
 * directive lines stay in the block, so line numbers still map 1:1.
 *
 * Project files (capstone pages only): a fence with a path, such as ```ts title="src/domain/order.ts",
 * is a FILE of one project rather than an isolated snippet. All such blocks, across every capstone
 * page, are written to their paths and compiled together, so imports between them resolve. Each
 * file may appear once, must be a module, and is compiled with the base options.
 *
 * Skipping: a block that genuinely cannot compile standalone (it depends on types
 * Next.js generates from the real route tree, such as `PageProps<"/blog/[slug]">`)
 * may be preceded by a line containing exactly `{/* check:skip *\/}`. Skips are
 * counted and printed, so they cannot hide.
 *
 * Usage:
 *   npm run check:content                          # every topic and capstone page
 *   npm run check:content -- narrowing             # selected topics by slug
 *   npm run check:content -- capstone/01-domain    # a capstone page (its project files compile together)
 *
 * Runs directly under Node's type stripping, so it avoids enums and parameter
 * properties (anything that would need real transformation).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

type Language = "ts" | "tsx";

interface Block {
  readonly slug: string;
  readonly language: Language;
  /** 1-based line in the .mdx file where the block's first code line sits. */
  readonly mdxLine: number;
  readonly lines: readonly string[];
  /** Set for project files: the path from the fence's `title="..."`. */
  readonly projectPath: string | undefined;
}

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content");
const CAPSTONE_DIR = path.join(ROOT, "src", "capstone");
const CAPSTONE_PREFIX = "capstone/";
const TSC = path.join(ROOT, "node_modules", "typescript", "bin", "tsc");
const EXPECTED_ERROR = /\/\/\s*Error\b/;
const SKIP_MARKER = "{/* check:skip */}";

/**
 * The scratch directory lives INSIDE node_modules so that `import "react"`,
 * `"express"` and `"next"` resolve by walking up to the project's packages.
 * node_modules is excluded from the project tsconfig, ESLint and git.
 */
const WORK_DIR = path.join(ROOT, "node_modules", ".cache", "content-check");

function mdxNames(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length))
    .sort();
}

/** Topic slugs, then `capstone/<name>` for each capstone page. */
function allSlugs(): string[] {
  return [...mdxNames(CONTENT_DIR), ...mdxNames(CAPSTONE_DIR).map((name) => `${CAPSTONE_PREFIX}${name}`)];
}

function sourceFile(slug: string): string {
  return slug.startsWith(CAPSTONE_PREFIX)
    ? path.join(CAPSTONE_DIR, `${slug.slice(CAPSTONE_PREFIX.length)}.mdx`)
    : path.join(CONTENT_DIR, `${slug}.mdx`);
}

function asLanguage(value: string): Language | null {
  return value === "ts" || value === "tsx" ? value : null;
}

interface Extracted {
  readonly blocks: Block[];
  readonly skipped: number;
  /** MDX-level mistakes in the prose (not the code), as "file:line message". */
  readonly proseIssues: string[];
}

/**
 * In MDX, `{...}` outside code is a JavaScript expression and `<Tag>` is JSX. A stray
 * `${string}` or `Array<string>` in prose therefore crashes at render time even though
 * every code block compiles. Strip inline code (any backtick-run length) and flag what is
 * left. The skip marker is the one deliberate exception.
 */
function proseIssuesIn(slug: string, line: string, lineNumber: number): string[] {
  const withoutCode = line.replace(/(`+)[\s\S]*?\1/g, "").replace(SKIP_MARKER, "");
  const issues: string[] = [];
  if (/[{}]/.test(withoutCode)) {
    issues.push(`${slug}.mdx:${lineNumber} unescaped { or } in prose (MDX expression): ${line.trim()}`);
  }
  if (/<[A-Za-z/]/.test(withoutCode)) {
    issues.push(`${slug}.mdx:${lineNumber} unescaped < in prose (MDX JSX): ${line.trim()}`);
  }
  return issues;
}

/** Pulls every ts/tsx fence out of one MDX file. */
function extractBlocks(slug: string): Extracted {
  const isCapstone = slug.startsWith(CAPSTONE_PREFIX);
  const mdx = readFileSync(sourceFile(slug), "utf8").split(/\r?\n/);
  const blocks: Block[] = [];
  const proseIssues: string[] = [];
  let skipped = 0;

  let fence: string | null = null; // language of the fence we are inside, else null
  let fenceTitle: string | undefined;
  let startLine = 0;
  let buffer: string[] = [];
  let skipNext = false;
  let lastNonEmpty = "";
  // Prose is linted per PARAGRAPH: inline code may legitimately wrap across source lines.
  let paragraph: string[] = [];
  let paragraphStart = 0;

  const flushParagraph = (): void => {
    if (paragraph.length > 0) {
      proseIssues.push(...proseIssuesIn(slug, paragraph.join(" "), paragraphStart));
      paragraph = [];
    }
  };

  mdx.forEach((line, index) => {
    const opening = /^```(\w*)(.*)$/.exec(line);

    if (fence === null && opening) {
      flushParagraph();
      fence = opening[1] ?? "";
      fenceTitle = /title="([^"]+)"/.exec(opening[2] ?? "")?.[1];
      startLine = index + 2;
      buffer = [];
      skipNext = lastNonEmpty.trim() === SKIP_MARKER;
    } else if (fence !== null && /^```\s*$/.test(line)) {
      const language = asLanguage(fence);
      if (language) {
        if (skipNext) skipped += 1;
        else {
          // Only capstone pages treat a titled fence as a file of the project.
          const projectPath = isCapstone ? fenceTitle : undefined;
          blocks.push({ slug, language, mdxLine: startLine, lines: buffer, projectPath });
        }
      }
      fence = null;
      lastNonEmpty = "";
    } else if (fence !== null) {
      buffer.push(line);
    } else if (line.trim() === "") {
      flushParagraph();
    } else {
      lastNonEmpty = line;
      if (paragraph.length === 0) paragraphStart = index + 1;
      paragraph.push(line.trim());
    }
  });
  flushParagraph();

  return { blocks, skipped, proseIssues };
}

const BASE_OPTIONS: Record<string, unknown> = {
  target: "ES2022",
  module: "esnext",
  moduleResolution: "bundler",
  lib: ["ES2023", "DOM", "DOM.Iterable"],
  types: ["node"],
  jsx: "react-jsx",
  esModuleInterop: true,
  strict: true,
  noUncheckedIndexedAccess: true,
  noImplicitOverride: true,
  noFallthroughCasesInSwitch: true,
  verbatimModuleSyntax: true,
  noEmit: true,
  skipLibCheck: true,
};

/** Options whose value is a list, so a single value must be wrapped in an array. */
const LIST_OPTIONS = new Set(["lib", "types"]);

const DIRECTIVE = /^\/\/\s*@([A-Za-z]+)\s*:\s*(.*?)\s*$/;

function coerceValue(name: string, raw: string): unknown {
  if (LIST_OPTIONS.has(name)) return raw === "" ? [] : raw.split(",").map((part) => part.trim());
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^-?\d+$/.test(raw)) return Number(raw);
  return raw;
}

interface Directives {
  readonly overrides: Record<string, unknown>;
  readonly problems: string[];
}

/** Reads the leading `// @option: value` lines of a block. */
function parseDirectives(block: Block): Directives {
  const overrides: Record<string, unknown> = {};
  const problems: string[] = [];

  for (const [index, line] of block.lines.entries()) {
    const match = DIRECTIVE.exec(line.trim());
    if (!match) break; // directives must lead the block; `// @ts-expect-error` has no colon, so it ends them
    const [, name, raw] = match;
    if (name === undefined || raw === undefined) break;
    overrides[name] = raw === "default" ? "default" : coerceValue(name, raw);

    const { errors } = ts.convertCompilerOptionsFromJson({ [name]: overrides[name] === "default" ? undefined : overrides[name] }, ROOT);
    for (const error of errors) {
      const text = ts.flattenDiagnosticMessageText(error.messageText, " ");
      problems.push(`${block.slug}.mdx:${block.mdxLine + index} ${text}`);
    }
  }
  return { overrides, problems };
}

function optionsFor(overrides: Record<string, unknown>): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...BASE_OPTIONS, ...overrides };
  for (const [name, value] of Object.entries(merged)) {
    if (value === "default") delete merged[name];
  }
  return merged;
}

/** Runs tsc over one directory and returns its report, whether or not it found errors. */
function runTsc(dir: string): string {
  try {
    return execFileSync("node", [TSC, "-p", dir, "--pretty", "false"], { encoding: "utf8" });
  } catch (error: unknown) {
    // tsc exits non-zero when it finds errors; its report is on stdout.
    const failure = error as { stdout?: string; stderr?: string };
    return `${failure.stdout ?? ""}${failure.stderr ?? ""}`;
  }
}

const requested = process.argv.slice(2);
const slugs = requested.length > 0 ? requested : allSlugs();

rmSync(WORK_DIR, { recursive: true, force: true });
mkdirSync(WORK_DIR, { recursive: true });

/** Keyed by path relative to WORK_DIR, e.g. "group-0/narrowing__01.ts" or "project/src/a.ts". */
const compiled = new Map<string, Block>();
let skippedTotal = 0;
const proseIssues: string[] = [];
const directiveProblems: string[] = [];
const projectProblems: string[] = [];
let groupCount = 0;
let projectFileCount = 0;

try {
  // Isolated snippets are bucketed by their distinct option set; project files go to one project.
  const groups = new Map<string, { overrides: Record<string, unknown>; dir: string }>();
  const projectDir = path.join(WORK_DIR, "project");

  for (const slug of slugs) {
    const { blocks, skipped, proseIssues: issues } = extractBlocks(slug);
    skippedTotal += skipped;
    proseIssues.push(...issues);

    let snippetNumber = 0;
    for (const block of blocks) {
      const where = `${block.slug}.mdx:${block.mdxLine}`;

      if (block.projectPath !== undefined) {
        const relPath = `project/${block.projectPath}`;
        if (compiled.has(relPath)) {
          projectProblems.push(`${where} DUPLICATE PROJECT FILE ${block.projectPath} (each file may appear once)`);
          continue;
        }
        if (!block.lines.some((line) => /^(import|export)\b/.test(line))) {
          projectProblems.push(`${where} PROJECT FILE ${block.projectPath} must be a module (needs an import or export)`);
        }
        const target = path.join(projectDir, block.projectPath);
        mkdirSync(path.dirname(target), { recursive: true });
        // Project files are written exactly as shown: no appended line, so line N is line N.
        writeFileSync(target, `${block.lines.join("\n")}\n`);
        compiled.set(relPath, block);
        projectFileCount += 1;
        continue;
      }

      snippetNumber += 1;
      const { overrides, problems } = parseDirectives(block);
      directiveProblems.push(...problems);

      const key = JSON.stringify(Object.entries(overrides).sort(([a], [b]) => a.localeCompare(b)));
      let group = groups.get(key);
      if (!group) {
        group = { overrides, dir: `group-${groups.size}` };
        groups.set(key, group);
      }

      const fileName = `${slug.replace("/", "__")}__${String(snippetNumber).padStart(2, "0")}.${block.language}`;
      mkdirSync(path.join(WORK_DIR, group.dir), { recursive: true });
      // `export {}` goes at the END so block line N is file line N.
      writeFileSync(path.join(WORK_DIR, group.dir, fileName), `${block.lines.join("\n")}\nexport {};\n`);
      compiled.set(`${group.dir}/${fileName}`, block);
    }
  }

  groupCount = groups.size;
  const errors = new Map<string, string>(); // "relative/path:line" -> message

  const collect = (output: string): void => {
    for (const match of output.matchAll(/^(.+?\.tsx?)\((\d+),\d+\): error (TS\d+): (.*)$/gm)) {
      const [, file, line, code, message] = match;
      if (!file || !line) continue;
      const relative = path.relative(WORK_DIR, path.resolve(ROOT, file)).split(path.sep).join("/");
      errors.set(`${relative}:${line}`, `${code} ${message}`);
    }
  };

  for (const group of groups.values()) {
    const dir = path.join(WORK_DIR, group.dir);
    writeFileSync(
      path.join(dir, "tsconfig.json"),
      JSON.stringify({ compilerOptions: optionsFor(group.overrides), include: ["*.ts", "*.tsx"] }),
    );
    collect(runTsc(dir));
  }

  if (projectFileCount > 0) {
    writeFileSync(
      path.join(projectDir, "tsconfig.json"),
      JSON.stringify({ compilerOptions: BASE_OPTIONS, include: ["**/*.ts", "**/*.tsx"] }),
    );
    collect(runTsc(projectDir));
  }

  let problems = 0;
  let claimed = 0;

  for (const [relPath, block] of compiled) {
    block.lines.forEach((text, index) => {
      const real = errors.get(`${relPath}:${index + 1}`);
      const isClaimed = EXPECTED_ERROR.test(text);
      const label = block.projectPath === undefined ? "" : `[${block.projectPath}] `;
      const where = `${block.slug}.mdx:${block.mdxLine + index}`;

      if (isClaimed) claimed += 1;
      if (real && !isClaimed) {
        problems += 1;
        console.log(`UNEXPECTED   ${where} ${label}\n    ${text.trim()}\n    -> ${real}`);
      }
      if (isClaimed && !real) {
        problems += 1;
        console.log(`STALE CLAIM  ${where} ${label}\n    ${text.trim()}`);
      }
    });
  }

  for (const issue of projectProblems) {
    problems += 1;
    console.log(`PROJECT      ${issue}`);
  }

  for (const issue of directiveProblems) {
    problems += 1;
    console.log(`BAD DIRECTIVE ${issue}`);
  }

  for (const issue of proseIssues) {
    problems += 1;
    console.log(`MDX PROSE    ${issue}`);
  }

  // Errors that did not land on any block line (bad import, trailing `export {}`, a file nobody claims...).
  for (const [key, message] of errors) {
    const separator = key.lastIndexOf(":");
    const relPath = key.slice(0, separator);
    const line = Number(key.slice(separator + 1));
    const block = compiled.get(relPath);
    if (!block) {
      problems += 1;
      console.log(`UNCLAIMED    ${key} -> ${message}`);
    } else if (line > block.lines.length) {
      problems += 1;
      console.log(`OUT OF RANGE ${key} -> ${message}`);
    }
  }

  console.log(
    `\npages: ${slugs.length} | blocks: ${compiled.size} (project files: ${projectFileCount}) | option sets: ${groupCount} | ` +
      `skipped: ${skippedTotal} | expected-error lines: ${claimed} | compiler errors: ${errors.size} | problems: ${problems}`,
  );
  process.exitCode = problems === 0 ? 0 : 1;
} finally {
  rmSync(WORK_DIR, { recursive: true, force: true });
}
