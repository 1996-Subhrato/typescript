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
    <li className="flex gap-3 py-2">
      <input
        type="checkbox"
        checked={done}
        onChange={() => toggleCompleted(id)}
        aria-label="Mark this exercise as done"
        className="mt-1.5 size-4 shrink-0 accent-blue-600"
      />
      <div className={done ? "text-neutral-500 line-through decoration-neutral-300 dark:decoration-neutral-700" : ""}>
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
      <div className="flex items-baseline justify-between text-sm text-neutral-500">
        <span>
          {done} of {ids.length} exercises done
        </span>
        {done > 0 && (
          <button type="button" onClick={resetCompleted} className="underline underline-offset-2 hover:text-neutral-800 dark:hover:text-neutral-200">
            Reset
          </button>
        )}
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div className="h-full rounded-full bg-blue-600 dark:bg-blue-400" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
