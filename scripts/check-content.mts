/**
 * Content quality gate: compiles every ```ts block in src/content/*.mdx.
 *
 * Convention:
 *   - a line EXPECTED to fail carries a trailing `// Error` comment
 *   - every real compiler error must land on such a line   -> otherwise UNEXPECTED
 *   - every such line must produce a compiler error        -> otherwise STALE CLAIM
 *
 * Each block is compiled as its own module, so snippets must be self-contained.
 * Flags mirror the project's tsconfig (strict + noUncheckedIndexedAccess + ...).
 *
 * Usage:
 *   npm run check:content                 # every topic
 *   npm run check:content -- narrowing    # selected topics by slug
 *
 * Runs directly under Node's type stripping, so it avoids enums and parameter
 * properties (anything that would need real transformation).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

interface Block {
  readonly slug: string;
  /** 1-based line in the .mdx file where the block's first code line sits. */
  readonly mdxLine: number;
  readonly lines: readonly string[];
}

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content");
const TSC = path.join(ROOT, "node_modules", "typescript", "bin", "tsc");
const EXPECTED_ERROR = /\/\/\s*Error\b/;

function allSlugs(): string[] {
  return readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length))
    .sort();
}

/** Pulls every ```ts fence out of one MDX file. */
function extractBlocks(slug: string): Block[] {
  const mdx = readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8").split(/\r?\n/);
  const blocks: Block[] = [];

  let language: string | null = null;
  let startLine = 0;
  let buffer: string[] = [];

  mdx.forEach((line, index) => {
    const opening = /^```(\w*)/.exec(line);

    if (language === null && opening) {
      language = opening[1] ?? "";
      startLine = index + 2;
      buffer = [];
    } else if (language !== null && /^```\s*$/.test(line)) {
      if (language === "ts") blocks.push({ slug, mdxLine: startLine, lines: buffer });
      language = null;
    } else if (language !== null) {
      buffer.push(line);
    }
  });

  return blocks;
}

const requested = process.argv.slice(2);
const slugs = requested.length > 0 ? requested : allSlugs();

const workDir = mkdtempSync(path.join(tmpdir(), "ts-docs-check-"));
const compiled = new Map<string, Block>();

try {
  mkdirSync(workDir, { recursive: true });

  for (const slug of slugs) {
    extractBlocks(slug).forEach((block, index) => {
      const fileName = `${slug}__${String(index + 1).padStart(2, "0")}.ts`;
      // `export {}` goes at the END so block line N is file line N.
      writeFileSync(path.join(workDir, fileName), `${block.lines.join("\n")}\nexport {};\n`);
      compiled.set(fileName, block);
    });
  }

  writeFileSync(
    path.join(workDir, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "esnext",
        moduleResolution: "bundler",
        lib: ["ES2023", "DOM", "DOM.Iterable"],
        types: [],
        strict: true,
        noUncheckedIndexedAccess: true,
        noImplicitOverride: true,
        noFallthroughCasesInSwitch: true,
        verbatimModuleSyntax: true,
        noEmit: true,
        skipLibCheck: true,
      },
      include: ["*.ts"],
    }),
  );

  let output = "";
  try {
    output = execFileSync("node", [TSC, "-p", workDir, "--pretty", "false"], { encoding: "utf8" });
  } catch (error: unknown) {
    // tsc exits non-zero when it finds errors; its report is on stdout.
    const failure = error as { stdout?: string; stderr?: string };
    output = `${failure.stdout ?? ""}${failure.stderr ?? ""}`;
  }

  const errors = new Map<string, string>(); // "file:line" -> message
  for (const match of output.matchAll(/^(.+?\.ts)\((\d+),\d+\): error (TS\d+): (.*)$/gm)) {
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

  console.log(
    `\ntopics: ${slugs.length} | blocks: ${compiled.size} | ` +
      `expected-error lines: ${claimed} | compiler errors: ${errors.size} | problems: ${problems}`,
  );
  process.exitCode = problems === 0 ? 0 : 1;
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
