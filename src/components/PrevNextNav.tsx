import { PrevNextCard } from "@/components/PrevNextCard";
import type { AdjacentTopics, TopicEntry } from "@/lib/docs";

/**
 * A Server Component — no `"use client"`. It renders once on the server and
 * ships zero JavaScript to the browser.
 */
export function PrevNextNav({ prev, next }: AdjacentTopics) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Topic navigation" className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
      <Card entry={prev} direction="prev" />
      <Card entry={next} direction="next" />
    </nav>
  );
}

function Card({ entry, direction }: { readonly entry: TopicEntry | null; readonly direction: "prev" | "next" }) {
  // An empty cell keeps the grid columns aligned at the ends of the sequence.
  if (!entry) return <div />;

  const { topic } = entry;

  // A "planned" topic has no page, so it must not be a link — `dynamicParams`
  // is false, and linking to it would 404.
  const published = topic.status === "published";
  return (
    <PrevNextCard
      href={published ? `/docs/${topic.slug}` : null}
      direction={direction}
      title={topic.title}
      note={published ? undefined : "Not written yet"}
    />
  );
}
