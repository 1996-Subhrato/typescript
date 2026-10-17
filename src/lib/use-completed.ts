"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseCompleted, serialiseCompleted, STORAGE_KEY } from "@/lib/exercise-progress";

/**
 * A tiny external store over localStorage, read with `useSyncExternalStore`.
 *
 * Why not `useState` plus an effect? The server has no localStorage, so the first render must
 * produce the same HTML as the server did, and only afterwards switch to the stored value.
 * `useSyncExternalStore` does exactly that: the third argument is the server snapshot, and React
 * reconciles to the real snapshot after hydration without a mismatch warning.
 *
 * The snapshot is the raw stored STRING, not a parsed Set. A string compares by value, so React
 * only re-renders when the stored text actually changes; returning a fresh Set each time would
 * look "changed" on every call.
 */

const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange); // changes made in another tab
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return ""; // storage can be blocked (private windows, strict settings)
  }
}

function getServerSnapshot(): string {
  return "";
}

function write(next: ReadonlySet<string>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, serialiseCompleted(next));
  } catch {
    // ignore: progress simply will not persist
  }
  for (const listener of listeners) listener();
}

export function toggleCompleted(id: string): void {
  const next = new Set(parseCompleted(getSnapshot()));
  if (next.has(id)) next.delete(id);
  else next.add(id);
  write(next);
}

export function resetCompleted(): void {
  write(new Set());
}

export function useCompleted(): ReadonlySet<string> {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parseCompleted(raw), [raw]);
}
