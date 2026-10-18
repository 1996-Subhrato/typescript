import assert from "node:assert/strict";
import { test } from "node:test";
import { isTheme, STORAGE_KEY, THEME_BOOT_SCRIPT } from "../src/lib/theme.ts";

/** What the boot script touches: `localStorage.getItem` and `document.documentElement.setAttribute`. */
interface FakeEnvironment {
  readonly attributes: Map<string, string>;
  run(): void;
}

function fakeEnvironment(stored: string | null | "throws"): FakeEnvironment {
  const attributes = new Map<string, string>();
  const localStorage = {
    getItem(key: string): string | null {
      if (stored === "throws") throw new Error("storage blocked");
      return key === STORAGE_KEY ? stored : null;
    },
  };
  const document = {
    documentElement: {
      setAttribute(name: string, value: string): void {
        attributes.set(name, value);
      },
    },
  };
  return {
    attributes,
    run() {
      new Function("localStorage", "document", THEME_BOOT_SCRIPT)(localStorage, document);
    },
  };
}

test("isTheme accepts only the two themes", () => {
  assert.equal(isTheme("light"), true);
  assert.equal(isTheme("dark"), true);
  assert.equal(isTheme("system"), false);
  assert.equal(isTheme(null), false);
  assert.equal(isTheme(undefined), false);
});

test("the boot script applies a stored theme", () => {
  for (const theme of ["light", "dark"] as const) {
    const env = fakeEnvironment(theme);
    env.run();
    assert.equal(env.attributes.get("data-theme"), theme);
  }
});

test("the boot script sets nothing when there is no stored choice", () => {
  const env = fakeEnvironment(null);
  env.run();
  assert.equal(env.attributes.size, 0);
});

test("the boot script ignores a stored value it does not recognise", () => {
  const env = fakeEnvironment("<script>alert(1)</script>");
  env.run();
  assert.equal(env.attributes.size, 0);
});

test("the boot script survives storage throwing", () => {
  const env = fakeEnvironment("throws");
  assert.doesNotThrow(() => env.run());
  assert.equal(env.attributes.size, 0);
});
