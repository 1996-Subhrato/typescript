import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/CodeBlock";

/**
 * Global component overrides for every MDX file in `src/content`.
 *
 * TypeScript note: `MDXComponents` is a map of tag name -> React component.
 * Returning `{ ...components, ...overrides }` keeps the caller's defaults and
 * lets ours win, and the return type is checked against `MDXComponents` so a
 * typo like `h7` or a wrong prop type is a compile error, not a silent no-op.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Swaps the native <pre> for one with a copy button. rehype-pretty-code's
    // data-* attributes are forwarded untouched, so highlighting still works.
    pre: CodeBlock,
  };
}
