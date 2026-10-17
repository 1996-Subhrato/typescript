/**
 * Content quality gate: compiles every ```ts / ```tsx block in src/content/*.mdx.
 *
 * Convention:
 *   - a line EXPECTED to fail carries a trailing `// Error` comment
 *   - every real compiler error must land on such a line   -> otherwise UNEXPECTED
 *   - every such line must produce a compiler error        -> otherwise STALE CLAIM
 *
 * Each block is compiled as its own module, so snippets must be self-contained.
 * Flags mirror the project's tsconfig (strict + noUncheckedIndexedAccess + ...).
 *
 * Skipping: a block that genuinely cannot compile standalone (it depends on types
 * Next.js generates from the real route tree, such as `PageProps<"/blog/[slug]">`)
 * may be preceded by a line containing exactly `{/* check:skip *\/}`. Skips are
 * counted and printed, so they cannot hide.
 *
 * Usage:
 *   npm run check:content                 # every topic
 *   npm run check:content -- narrowing    # selected topics by slug
 *
 * Runs directly under Node's type stripping, so it avoids enums and parameter
 * properties (anything that would need real transformation).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

type Language = "ts" | "tsx";

interface Block {
  readonly slug: string;
  readonly language: Language;
  /** 1-based line in the .mdx file where the block's first code line sits. */
  readonly mdxLine: number;
  readonly lines: readonly string[];
}

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content");
const TSC = path.join(ROOT, "node_modules", "typescript", "bin", "tsc");
const EXPECTED_ERROR = /\/\/\s*Error\b/;
const SKIP_MARKER = "{/* check:skip */}";

/**
 * The scratch directory lives INSIDE node_modules so that `import "react"`,
 * `"express"` and `"next"` resolve by walking up to the project's packages.
 * node_modules is excluded from the project tsconfig, ESLint and git.
 */
const WORK_DIR = path.join(ROOT, "node_modules", ".cache", "content-check");

function allSlugs(): string[] {
  return readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length))
    .sort();
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
  const mdx = readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8").split(/\r?\n/);
  const blocks: Block[] = [];
  const proseIssues: string[] = [];
  let skipped = 0;

  let fence: string | null = null; // language of the fence we are inside, else null
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
    const opening = /^```(\w*)/.exec(line);

    if (fence === null && opening) {
      flushParagraph();
      fence = opening[1] ?? "";
      startLine = index + 2;
      buffer = [];
      skipNext = lastNonEmpty.trim() === SKIP_MARKER;
    } else if (fence !== null && /^```\s*$/.test(line)) {
      const language = asLanguage(fence);
      if (language) {
        if (skipNext) skipped += 1;
        else blocks.push({ slug, language, mdxLine: startLine, lines: buffer });
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

const requested = process.argv.slice(2);
const slugs = requested.length > 0 ? requested : allSlugs();

rmSync(WORK_DIR, { recursive: true, force: true });
mkdirSync(WORK_DIR, { recursive: true });

const compiled = new Map<string, Block>();
let skippedTotal = 0;
const proseIssues: string[] = [];

try {
  for (const slug of slugs) {
    const { blocks, skipped, proseIssues: issues } = extractBlocks(slug);
    skippedTotal += skipped;
    proseIssues.push(...issues);
    blocks.forEach((block, index) => {
      const fileName = `${slug}__${String(index + 1).padStart(2, "0")}.${block.language}`;
      // `export {}` goes at the END so block line N is file line N.
      writeFileSync(path.join(WORK_DIR, fileName), `${block.lines.join("\n")}\nexport {};\n`);
      compiled.set(fileName, block);
    });
  }

  writeFileSync(
    path.join(WORK_DIR, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
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
      },
      include: ["*.ts", "*.tsx"],
    }),
  );

  let output = "";
  try {
    output = execFileSync("node", [TSC, "-p", WORK_DIR, "--pretty", "false"], { encoding: "utf8" });
  } catch (error: unknown) {
    // tsc exits non-zero when it finds errors; its report is on stdout.
    const failure = error as { stdout?: string; stderr?: string };
    output = `${failure.stdout ?? ""}${failure.stderr ?? ""}`;
  }

  const errors = new Map<string, string>(); // "file:line" -> message
  for (const match of output.matchAll(/^(.+?\.tsx?)\((\d+),\d+\): error (TS\d+): (.*)$/gm)) {
    const [, file, line, code, message] = match;
    if (file && line) errors.set(`${path.basename(file)}:${line}`, `${code} ${message}`);
  }

  let problems = 0;
  let claimed = 0;

  for (const [fileName, block] of compiled) {
    block.lines.forEach((text, index) => {
      const real = errors.get(`${fileName}:${index + 1}`);
      const isClaimed = EXPECTED_ERROR.test(text);
      const where = `${block.slug}.mdx:${block.mdxLine + index}`;

      if (isClaimed) claimed += 1;
      if (real && !isClaimed) {
        problems += 1;
        console.log(`UNEXPECTED   ${where}\n    ${text.trim()}\n    -> ${real}`);
      }
      if (isClaimed && !real) {
        problems += 1;
        console.log(`STALE CLAIM  ${where}\n    ${text.trim()}`);
      }
    });
  }

  for (const issue of proseIssues) {
    problems += 1;
    console.log(`MDX PROSE    ${issue}`);
  }

  // Errors that did not land on any block line (bad import, trailing `export {}`, ...).
  for (const [key, message] of errors) {
    const [fileName, line] = key.split(":");
    const block = fileName ? compiled.get(fileName) : undefined;
    if (block && Number(line) > block.lines.length) {
      problems += 1;
      console.log(`OUT OF RANGE ${key} -> ${message}`);
    }
  }

  console.log(
    `\ntopics: ${slugs.length} | blocks: ${compiled.size} | skipped: ${skippedTotal} | ` +
      `expected-error lines: ${claimed} | compiler errors: ${errors.size} | problems: ${problems}`,
  );
  process.exitCode = problems === 0 ? 0 : 1;
} finally {
  rmSync(WORK_DIR, { recursive: true, force: true });
}
