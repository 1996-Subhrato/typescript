import Link from "next/link";
import { firstTopicHref } from "@/lib/site";

/** Shown for any URL that does not exist, including topics that are not published. */
export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm font-semibold text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">That page does not exist</h1>
      <p className="mt-3 text-muted">
        The link may be mistyped, or the topic may not be written yet. Try search (Ctrl K) or start from the
        beginning.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-lg bg-accent-solid px-4 text-sm font-semibold text-accent-solid-fg hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          href={firstTopicHref()}
          className="inline-flex h-10 items-center rounded-lg border border-line-strong px-4 text-sm font-semibold hover:bg-surface-2"
        >
          Start learning
        </Link>
      </div>
    </div>
  );
}
