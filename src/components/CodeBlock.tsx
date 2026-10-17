"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";

/**
 * Replaces the `<pre>` element in every MDX file (wired up in
 * `src/mdx-components.tsx`) to add a copy button.
 *
 * `ComponentPropsWithoutRef<"pre">` is the props of a native `<pre>` minus
 * `ref` — className, children, and every data-* attribute rehype-pretty-code
 * emits. Spreading `...props` therefore stays type-checked instead of falling
 * back to `any`.
 */
type CodeBlockProps = ComponentPropsWithoutRef<"pre">;

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    // `preRef.current` is `HTMLPreElement | null` — React cannot know the
    // element is mounted, so the null check is required, not ceremony.
    const text = preRef.current?.textContent;
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group relative">
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute right-2 top-2 rounded-md border border-neutral-300 bg-white/80 px-2 py-1 text-xs text-neutral-600 opacity-0 backdrop-blur transition group-hover:opacity-100 focus-visible:opacity-100 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-400 dark:hover:text-white"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
