import Link from "next/link";
import type { AdjacentTopics, TopicEntry } from "@/lib/docs";

/**
 * A Server Component — no `"use client"`. It renders once on the server and
 * ships zero JavaScript to the browser.
 */
export function PrevNextNav({ prev, next }: AdjacentTopics) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Topic navigation"
      className="mt-16 grid gap-4 border-t border-neutral-200 pt-8 sm:grid-cols-2 dark:border-neutral-800"
    >
      <NavCard entry={prev} direction="prev" />
      <NavCard entry={next} direction="next" />
    </nav>
  );
}

interface NavCardProps {
  readonly entry: TopicEntry | null;
  readonly direction: "prev" | "next";
}

function NavCard({ entry, direction }: NavCardProps) {
  const isNext = direction === "next";
  const label = isNext ? "Next" : "Previous";
  const alignment = isNext ? "sm:text-right sm:col-start-2" : "";

  // An empty cell keeps the grid columns aligned at the ends of the sequence.
  if (!entry) return <div className={alignment} />;

  const { topic } = entry;
  const body = (
    <>
      <span className="block text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <span className="mt-1 block font-medium">{topic.title}</span>
    </>
  );

  // A "planned" topic has no page, so it must not be a link — `dynamicParams`
  // is false, and linking to it would 404.
  if (topic.status !== "published") {
    return (
      <div
        className={`rounded-lg border border-dashed border-neutral-200 px-4 py-3 text-neutral-400 dark:border-neutral-800 dark:text-neutral-600 ${alignment}`}
      >
        {body}
        <span className="mt-0.5 block text-xs">Not written yet</span>
      </div>
    );
  }

  return (
    <Link
      href={`/docs/${topic.slug}`}
      className={`rounded-lg border border-neutral-200 px-4 py-3 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 ${alignment}`}
    >
      {body}
    </Link>
  );
}
