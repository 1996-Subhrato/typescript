import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders the small amount of Markdown that appears inside one line of prose: inline code,
 * links, and emphasis markers. A Server Component, and it builds React elements, never HTML
 * strings, so there is no `dangerouslySetInnerHTML` and nothing to escape.
 *
 * `String.prototype.split` with a capturing group returns the text and the matched tokens
 * interleaved, which makes the tokenising a one-liner.
 */
const TOKEN = /(``[\s\S]+?``|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

function stripEmphasis(text: string): string {
  return text.replace(/\*{1,3}/g, "");
}

export function InlineMarkdown({ text }: { text: string }) {
  const nodes: ReactNode[] = text.split(TOKEN).map((part, index): ReactNode => {
    if (part.startsWith("`")) {
      const code = part.replace(/^`+\s?/, "").replace(/\s?`+$/, "");
      return (
        <code key={index} className="rounded border border-neutral-200 bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em] dark:border-neutral-800 dark:bg-neutral-900">
          {code}
        </code>
      );
    }

    const link = LINK.exec(part);
    if (link?.[1] !== undefined && link[2] !== undefined) {
      return (
        <Link key={index} href={link[2]} className="text-blue-600 underline underline-offset-2 dark:text-blue-400">
          {stripEmphasis(link[1])}
        </Link>
      );
    }

    return <span key={index}>{stripEmphasis(part)}</span>;
  });

  return <>{nodes}</>;
}
