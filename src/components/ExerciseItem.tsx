"use client";

import type { ReactNode } from "react";
import { resetCompleted, toggleCompleted, useCompleted } from "@/lib/use-completed";

/**
 * One exercise with a "done" checkbox.
 *
 * The exercise text arrives as `children`: it is rendered on the SERVER and handed to this
 * Client Component as finished output, so only the checkbox ships JavaScript. That is the
 * composition pattern from *Server & Client Components*, in a real component.
 */
export function ExerciseItem({ id, children }: { id: string; children: ReactNode }) {
  const completed = useCompleted();
  const done = completed.has(id);

  return (
    <li className="flex gap-3 py-2.5">
      <input
        type="checkbox"
        checked={done}
        onChange={() => toggleCompleted(id)}
        aria-label="Mark this exercise as done"
        className="mt-1 size-4 shrink-0 cursor-pointer accent-[var(--c-accent-solid)]"
      />
      <div className={done ? "text-subtle line-through decoration-line-strong" : ""}>
        {children}
      </div>
    </li>
  );
}

/** "12 of 165 done", a progress bar, and a reset button. */
export function ExerciseProgress({ ids }: { ids: readonly string[] }) {
  const completed = useCompleted();
  const done = ids.filter((id) => completed.has(id)).length;
  const percent = ids.length === 0 ? 0 : Math.round((done / ids.length) * 100);

  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between text-sm text-muted">
        <span>
          {done} of {ids.length} exercises done
        </span>
        {done > 0 && (
          <button type="button" onClick={resetCompleted} className="underline underline-offset-2 hover:text-fg">
            Reset
          </button>
        )}
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={ids.length}
        aria-valuenow={done}
        aria-label="Exercises completed"
      >
        <div className="h-full rounded-full bg-accent-solid transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
