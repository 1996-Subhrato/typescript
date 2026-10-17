"use client";

import { useEffect, useMemo, useState } from "react";
import type { TocNode } from "@/types/docs";

export interface TableOfContentsProps {
  readonly nodes: readonly TocNode[];
}

/** Flattens the recursive tree into the heading IDs, in document order. */
function collectIds(nodes: readonly TocNode[]): string[] {
  return nodes.flatMap((node) => [node.id, ...collectIds(node.children)]);
}

/**
 * Highlights the heading currently nearest the top of the viewport.
 *
 * `IntersectionObserver` reports which headings are on screen; we keep the
 * first one. `useState<string | null>` is annotated explicitly because
 * `useState(null)` alone would infer the type as `null` and reject every
 * string we later set.
 */
function useActiveHeading(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const first = visible[0];
        if (first) setActiveId(first.target.id);
      },
      // Only count a heading as "current" once it is in the top third.
      { rootMargin: "0px 0px -66% 0px", threshold: 0 },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

export function TableOfContents({ nodes }: TableOfContentsProps) {
  // `useMemo` is load-bearing, not an optimisation: `collectIds` returns a NEW
  // array every call, and that array is an effect dependency inside
  // `useActiveHeading`. Without memoisation each state update would produce a
  // new reference, re-running the effect and tearing down the observer forever.
  const ids = useMemo(() => collectIds(nodes), [nodes]);
  const activeId = useActiveHeading(ids);

  if (nodes.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        On this page
      </p>
      <TocList nodes={nodes} activeId={activeId} />
    </nav>
  );
}

/**
 * Renders itself for `children`, mirroring the recursion in `TocNode`.
 * A recursive type is most naturally consumed by a recursive component.
 */
function TocList({
  nodes,
  activeId,
}: {
  readonly nodes: readonly TocNode[];
  readonly activeId: string | null;
}) {
  return (
    <ul className="space-y-1.5">
      {nodes.map((node) => (
        <li key={node.id}>
          <a
            href={`#${node.id}`}
            className={
              node.id === activeId
                ? "block text-blue-600 dark:text-blue-400"
                : "block text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
            }
          >
            {node.title}
          </a>
          {node.children.length > 0 && (
            <div className="mt-1.5 pl-3">
              <TocList nodes={node.children} activeId={activeId} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
