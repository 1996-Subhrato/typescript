import Link from "next/link";

export interface PrevNextCardProps {
  /** `null` renders a muted, non-link card (a topic that is not written yet). */
  readonly href: string | null;
  readonly direction: "prev" | "next";
  readonly title: string;
  /** Small line under a non-link card, e.g. "Not written yet". */
  readonly note?: string;
}

/**
 * One half of a previous/next pair. Shared by the topic pages and the capstone pages so both
 * look identical. A Server Component: no state, no JavaScript shipped.
 */
export function PrevNextCard({ href, direction, title, note }: PrevNextCardProps) {
  const isNext = direction === "next";
  const alignment = isNext ? "sm:col-start-2 sm:text-right" : "";

  const body = (
    <>
      <span
        className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-subtle ${
          isNext ? "sm:justify-end" : ""
        }`}
      >
        {!isNext && <span aria-hidden="true">&larr;</span>}
        {isNext ? "Next" : "Previous"}
        {isNext && <span aria-hidden="true">&rarr;</span>}
      </span>
      <span className="mt-1.5 block font-medium leading-snug">{title}</span>
    </>
  );

  if (href === null) {
    return (
      <div className={`rounded-xl border border-dashed border-line px-4 py-3.5 text-subtle ${alignment}`}>
        {body}
        {note !== undefined && <span className="mt-0.5 block text-xs">{note}</span>}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`group rounded-xl border border-line px-4 py-3.5 transition-all hover:border-accent hover:bg-accent-soft ${alignment}`}
    >
      {body}
    </Link>
  );
}
