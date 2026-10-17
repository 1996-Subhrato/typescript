"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { allTopics, type TopicEntry } from "@/lib/docs";

/** Case-insensitive substring match over title, summary and level name. */
function matches(entry: TopicEntry, query: string): boolean {
  const haystack =
    `${entry.topic.title} ${entry.topic.summary} ${entry.levelTitle}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function Search() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  /**
   * Resetting state belongs here, in the event path that closes the palette —
   * NOT in an effect watching `open`. Doing it in an effect means React renders
   * once with the stale query, then immediately re-renders with the cleared one.
   * The `react-hooks/set-state-in-effect` lint rule catches exactly that.
   */
  function close() {
    setOpen(false);
    setQuery("");
    setHighlighted(0);
  }

  const results = useMemo(() => {
    const trimmed = query.trim();
    const pool = trimmed === "" ? allTopics : allTopics.filter((e) => matches(e, trimmed));
    return pool.slice(0, 8);
  }, [query]);

  // Ctrl/Cmd+K toggles the palette from anywhere on the page.
  // This effect only SUBSCRIBES to an external system (the window) — calling
  // setState from inside the listener callback is the intended pattern.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (open) close();
        else setOpen(true);
      }
      if (event.key === "Escape") close();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // `open` is a dependency because the handler branches on it; the listener
    // is swapped on toggle, which is cheap and keeps the closure current.
  }, [open]);

  function go(entry: TopicEntry) {
    if (entry.topic.status !== "published") return;
    close();
    router.push(`/docs/${entry.topic.slug}`);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      // Indexed access is `TopicEntry | undefined` under
      // `noUncheckedIndexedAccess`, so the optional call is required.
      const entry = results[highlighted];
      if (entry) go(entry);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm text-neutral-500 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
      >
        <span>Search</span>
        <kbd className="hidden rounded border border-neutral-200 px-1 text-[10px] sm:inline dark:border-neutral-700">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh]"
          onClick={close}
          role="presentation"
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search topics"
          >
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setHighlighted(0);
              }}
              onKeyDown={onInputKeyDown}
              placeholder="Search topics..."
              className="w-full border-b border-neutral-200 bg-transparent px-4 py-3 text-sm outline-none dark:border-neutral-800"
            />

            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-neutral-500">
                  No topics match &ldquo;{query}&rdquo;
                </li>
              )}

              {results.map((entry, index) => {
                const isPublished = entry.topic.status === "published";
                return (
                  <li key={entry.topic.slug}>
                    <button
                      type="button"
                      disabled={!isPublished}
                      onMouseEnter={() => setHighlighted(index)}
                      onClick={() => go(entry)}
                      className={`w-full rounded-md px-3 py-2 text-left ${
                        index === highlighted && isPublished
                          ? "bg-neutral-100 dark:bg-neutral-900"
                          : ""
                      } ${isPublished ? "" : "cursor-not-allowed opacity-45"}`}
                    >
                      <span className="block text-sm font-medium">
                        {entry.topic.title}
                        {!isPublished && (
                          <span className="ml-2 text-xs font-normal">soon</span>
                        )}
                      </span>
                      <span className="block truncate text-xs text-neutral-500">
                        {entry.levelTitle} &middot; {entry.topic.summary}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
