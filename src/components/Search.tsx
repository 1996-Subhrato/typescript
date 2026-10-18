"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { allTopics, type TopicEntry } from "@/lib/docs";
import { parseSearchIndex, search } from "@/lib/search";
import type { SearchIndex } from "@/types/docs";

/** One line in the results list, whichever way it was found. */
interface Row {
  readonly slug: string;
  readonly title: string;
  readonly href: string;
  readonly published: boolean;
  /** "Level · excerpt or summary" */
  readonly detail: string;
  /** The best-matching section of the page, when the query matched a heading. */
  readonly heading: string | undefined;
}

function rowFromTopic(entry: TopicEntry): Row {
  return {
    slug: entry.topic.slug,
    title: entry.topic.title,
    href: `/docs/${entry.topic.slug}`,
    published: entry.topic.status === "published",
    detail: `${entry.levelTitle} · ${entry.topic.summary}`,
    heading: undefined,
  };
}

/** Case-insensitive substring match over title, summary and level name (the quick fallback). */
function matchesTitleOrSummary(entry: TopicEntry, query: string): boolean {
  const haystack = `${entry.topic.title} ${entry.topic.summary} ${entry.levelTitle}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

/**
 * The full-text index is fetched once, the first time the palette opens, and shared by every
 * later open. What comes back over the network starts as `unknown` and is validated before it
 * is used (the same rule the API topics teach). A failed load is forgotten so the next open
 * can retry.
 */
let indexRequest: Promise<SearchIndex | null> | undefined;

function loadIndex(): Promise<SearchIndex | null> {
  indexRequest ??= fetch("/search-index.json")
    .then((response) => (response.ok ? (response.json() as Promise<unknown>) : null))
    .then((body) => (body === null ? null : parseSearchIndex(body)))
    .catch(() => null)
    .then((index) => {
      if (index === null) indexRequest = undefined;
      return index;
    });
  return indexRequest;
}

export function Search() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const [index, setIndex] = useState<SearchIndex | null>(null);

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

  // Load the index the first time the palette opens. `setIndex` runs inside the promise
  // callback, not synchronously in the effect body, which is what the lint rule allows.
  useEffect(() => {
    if (!open || index !== null) return;
    let cancelled = false;
    void loadIndex().then((loaded) => {
      if (!cancelled) setIndex(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [open, index]);

  const trimmed = query.trim();

  const rows = useMemo((): Row[] => {
    if (trimmed === "") return allTopics.slice(0, 8).map(rowFromTopic);

    if (index !== null) {
      return search(index, trimmed, 8).map(({ entry, heading, snippet }) => ({
        slug: entry.slug,
        title: entry.title,
        href: heading ? `${entry.href}#${heading.id}` : entry.href,
        published: true,
        detail: `${entry.levelTitle} · ${snippet ?? entry.summary}`,
        heading: heading?.title,
      }));
    }

    // The index has not arrived yet: titles and summaries only.
    return allTopics
      .filter((entry) => matchesTitleOrSummary(entry, trimmed))
      .slice(0, 8)
      .map(rowFromTopic);
  }, [trimmed, index]);

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

  function go(row: Row) {
    if (!row.published) return;
    close();
    router.push(row.href);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((i) => Math.min(i + 1, rows.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      // Indexed access is `Row | undefined` under `noUncheckedIndexedAccess`.
      const row = rows[highlighted];
      if (row) go(row);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the documentation"
        className="flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-sm text-subtle transition-colors hover:border-line-strong hover:text-muted sm:w-52 sm:px-3"
      >
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="hidden flex-1 text-left sm:inline">Search</span>
        <kbd className="hidden rounded border border-line bg-bg px-1.5 py-0.5 text-[10px] leading-none text-subtle sm:inline">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[10vh] backdrop-blur-sm"
          onClick={close}
          role="presentation"
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-bg shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search topics"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <svg className="size-4 shrink-0 text-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setHighlighted(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search topics, keywords, error codes..."
                aria-label="Search"
                className="w-full bg-transparent py-3.5 text-[15px] outline-none placeholder:text-subtle"
              />
            </div>

            {trimmed !== "" && index === null && (
              <p className="border-b border-line px-4 py-1.5 text-xs text-subtle">
                Searching titles only while the full-text index loads...
              </p>
            )}

            <ul className="max-h-[22rem] overflow-y-auto p-2">
              {rows.length === 0 && (
                <li className="px-3 py-10 text-center text-sm text-subtle">
                  Nothing matches &ldquo;{query}&rdquo;
                </li>
              )}

              {rows.map((row, position) => (
                <li key={row.slug}>
                  <button
                    type="button"
                    disabled={!row.published}
                    onMouseEnter={() => setHighlighted(position)}
                    onClick={() => go(row)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left ${
                      position === highlighted && row.published ? "bg-accent-soft" : ""
                    } ${row.published ? "" : "cursor-not-allowed opacity-45"}`}
                  >
                    <span className="block text-sm font-medium">
                      {row.title}
                      {row.heading !== undefined && (
                        <span className="ml-2 text-xs font-normal text-accent">
                          &rsaquo; {row.heading}
                        </span>
                      )}
                      {!row.published && <span className="ml-2 text-xs font-normal">soon</span>}
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted">{row.detail}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="hidden items-center gap-4 border-t border-line bg-surface px-4 py-2 text-[11px] text-subtle sm:flex">
              <span>
                <kbd className="rounded border border-line bg-bg px-1">&uarr;</kbd>{" "}
                <kbd className="rounded border border-line bg-bg px-1">&darr;</kbd> to navigate
              </span>
              <span>
                <kbd className="rounded border border-line bg-bg px-1">Enter</kbd> to open
              </span>
              <span>
                <kbd className="rounded border border-line bg-bg px-1">Esc</kbd> to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
