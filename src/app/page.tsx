import Link from "next/link";
import { allLevels, getProgress } from "@/lib/docs";

export default function RoadmapPage() {
  const { published, total } = getProgress();
  const percent = Math.round((published / total) * 100);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">
        TypeScript, for JavaScript developers
      </h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        A concise reference built while learning. Every topic is short, code-first,
        and framed as a JavaScript &rarr; TypeScript comparison where that helps.
      </p>

      <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        Ready to practise? The{" "}
        <Link href="/exercises" className="text-blue-600 underline underline-offset-2 dark:text-blue-400">
          exercises page
        </Link>{" "}
        collects every Practice section in one place, with a progress tracker.
      </p>

      <div className="mt-8">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-neutral-500">
            {published} of {total} topics published
          </span>
          <span className="text-neutral-500">{percent}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-blue-600 dark:bg-blue-400"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="mt-12 space-y-10">
        {allLevels.map((level) => {
          const done = level.topics.filter(
            (topic) => topic.status === "published",
          ).length;

          return (
            <section key={level.id}>
              <div className="flex items-baseline gap-3">
                <h2 className="text-lg font-medium">{level.title}</h2>
                <span className="text-xs text-neutral-500">
                  {done}/{level.topics.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-500">{level.summary}</p>

              <ul className="mt-4 space-y-2">
                {level.topics.map((topic) =>
                  topic.status === "published" ? (
                    <li key={topic.slug}>
                      <Link
                        href={`/docs/${topic.slug}`}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {topic.title}
                      </Link>
                      <span className="ml-2 text-sm text-neutral-500">
                        {topic.summary}
                      </span>
                    </li>
                  ) : (
                    <li key={topic.slug} className="text-neutral-400 dark:text-neutral-600">
                      {topic.title}
                      <span className="ml-2 text-sm">{topic.summary}</span>
                    </li>
                  ),
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
