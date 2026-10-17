/**
 * Tests for the exercises parser (`src/lib/exercises-parse.ts`) and the progress storage helpers
 * (`src/lib/exercise-progress.ts`), plus a few invariants about the real content.
 *
 *   npm test
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { exerciseId, parseCompleted, serialiseCompleted } from "../src/lib/exercise-progress.ts";
import { extractExercises } from "../src/lib/exercises-parse.ts";

/* ----------------------------------- parser ---------------------------------- */

test("a numbered list gives one exercise per item", () => {
  const source = "## Practice\n\n1. First thing.\n2. Second thing,\n   continued here.\n3. Third.\n";
  const exercises = extractExercises(source);
  assert.deepEqual(
    exercises.map((exercise) => exercise.text),
    ["First thing.", "Second thing, continued here.", "Third."],
  );
});

test("a passage without a list is one exercise", () => {
  const exercises = extractExercises("## Practice\n\nWrite a function.\n\nThen test it.\n");
  assert.equal(exercises.length, 1);
  assert.equal(exercises[0]?.text, "Write a function. Then test it.");
});

test("bullets become points of the exercise", () => {
  const source = "## Practice\n\nModel a notification:\n\n- email, with an address\n- sms, with a number\n  and a country\n";
  const exercise = extractExercises(source)[0];
  assert.equal(exercise?.text, "Model a notification:");
  assert.deepEqual(exercise?.points, ["email, with an address", "sms, with a number and a country"]);
});

test("code blocks are noted but not copied into the text", () => {
  const source = "## Practice\n\nTry this:\n\n```ts\nconst secret = 1;\n```\n\nThen explain it.\n";
  const exercise = extractExercises(source)[0];
  assert.equal(exercise?.hasCode, true);
  assert.equal(exercise?.text, "Try this: Then explain it.");
  assert.doesNotMatch(exercise?.text ?? "", /secret/);
});

test("a code block inside a numbered item stays with that item", () => {
  const source = "## Practice\n\n1. Rewrite these:\n\n   ```ts\n   const a = 1;\n   ```\n\n2. Second.\n";
  const [first, second] = extractExercises(source);
  assert.equal(first?.text, "Rewrite these:");
  assert.equal(first?.hasCode, true);
  assert.equal(second?.hasCode, false);
});

test("the section ends at the next level-2 heading", () => {
  const source = "## Practice\n\n1. Mine.\n\n## Later heading\n\n1. Not an exercise.\n";
  assert.deepEqual(
    extractExercises(source).map((exercise) => exercise.text),
    ["Mine."],
  );
});

test("a topic with no Practice section yields nothing", () => {
  assert.deepEqual(extractExercises("## What\n\nSomething.\n"), []);
});

test("inline code and links are preserved for the renderer", () => {
  const text = extractExercises("## Practice\n\n1. Use `keyof` and read [*Narrowing*](/docs/narrowing).\n")[0]?.text;
  assert.equal(text, "Use `keyof` and read [*Narrowing*](/docs/narrowing).");
});

/* ------------------------------- stored progress ----------------------------- */

test("parseCompleted tolerates missing or corrupt storage", () => {
  assert.equal(parseCompleted(null).size, 0);
  assert.equal(parseCompleted("").size, 0);
  assert.equal(parseCompleted("not json").size, 0);
  assert.equal(parseCompleted("{}").size, 0);
  assert.equal(parseCompleted("[1, 2]").size, 0); // numbers are not exercise ids
  assert.equal(parseCompleted('["a", 2]').size, 0); // one bad element rejects the whole list
});

test("parseCompleted reads a valid list", () => {
  assert.deepEqual([...parseCompleted('["narrowing:0","classes:1"]')].sort(), ["classes:1", "narrowing:0"]);
});

test("serialiseCompleted round-trips and is stable", () => {
  const original = new Set(["b:1", "a:0"]);
  assert.equal(serialiseCompleted(original), '["a:0","b:1"]');
  assert.deepEqual(parseCompleted(serialiseCompleted(original)), original);
});

test("exerciseId combines the topic and the position", () => {
  assert.equal(exerciseId("narrowing", 2), "narrowing:2");
});

/* ------------------------------- the real content ---------------------------- */

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const topics = readdirSync(CONTENT_DIR)
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => ({ slug: file.slice(0, -4), source: readFileSync(path.join(CONTENT_DIR, file), "utf8") }));

test("every topic ends with at least one exercise", () => {
  const without = topics.filter(({ source }) => extractExercises(source).length === 0).map(({ slug }) => slug);
  assert.deepEqual(without, []);
});

test("no exercise leaked a code fence or a heading marker into its text", () => {
  for (const { slug, source } of topics) {
    for (const exercise of extractExercises(source)) {
      assert.doesNotMatch(exercise.text, /```|^#{1,6}\s/, `${slug}: ${exercise.text}`);
    }
  }
});

test("the parser finds as many exercises as an independent count of numbered items", () => {
  let expected = 0;
  let actual = 0;
  for (const { source } of topics) {
    const section = source.split(/\r?\n/);
    const start = section.findIndex((line) => line.trim() === "## Practice");
    const body: string[] = [];
    for (const line of section.slice(start + 1)) {
      if (/^## /.test(line)) break;
      body.push(line);
    }
    const numbered = body.filter((line) => /^\d+\.\s/.test(line)).length;
    expected += numbered > 0 ? numbered : 1; // a passage with no list counts as one exercise
    actual += extractExercises(source).length;
  }
  assert.equal(actual, expected);
});
