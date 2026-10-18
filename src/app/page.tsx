import Link from "next/link";
import { capstonePages } from "@/lib/capstone";
import { allLevels, getProgress } from "@/lib/docs";
import { getExerciseGroups } from "@/lib/exercises";
import { firstTopicHref } from "@/lib/site";

const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

const FEATURES = [
  {
    title: "Short and code-first",
    body: "Each page explains one idea with realistic examples, and compares it with the JavaScript you already write.",
  },
  {
    title: "Every sample is compiled",
    body: "A quality gate type-checks every code block, and verifies that each marked error really happens.",
  },
  {
    title: "Practice without spoilers",
    body: "Every topic ends with exercises and no answers. Tick them off as you go; progress stays in your browser.",
  },
] as const;

export default async function HomePage() {
  const { published, total } = getProgress();
  const exerciseGroups = await getExerciseGroups();
  const exerciseCount = exerciseGroups.reduce(
    (sum, level) => sum + level.topics.reduce((inner, topic) => inner + topic.exercises.length, 0),
    0,
  );
  const stats = [
    { value: published, label: "Topics" },
    { value: allLevels.length, label: "Levels" },
    { value: exerciseCount, label: "Exercises" },
    { value: capstonePages.length - 1, label: "Capstone steps" },
  ] as const;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 28rem at 50% -8rem, var(--c-glow), transparent 70%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-24">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-medium text-muted">
            <span className="size-1.5 rounded-full bg-accent-solid" aria-hidden="true" />
            {published === total ? `All ${total} topics published` : `${published} of ${total} topics published`}
          </p>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            <span className="text-accent">TypeScript</span>, for JavaScript developers
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            A concise, code-first reference and course. Learn the type system the way professional codebases use
            it, then build a complete typed project with it.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={firstTopicHref()}
              className="inline-flex h-11 items-center rounded-lg bg-accent-solid px-5 text-sm font-semibold text-accent-solid-fg shadow-card transition-opacity hover:opacity-90"
            >
              Start learning
            </Link>
            <Link
              href="/capstone"
              className="inline-flex h-11 items-center rounded-lg border border-line-strong bg-bg px-5 text-sm font-semibold transition-colors hover:bg-surface-2"
            >
              Build the capstone
            </Link>
            <Link
              href="/exercises"
              className="inline-flex h-11 items-center rounded-lg px-4 text-sm font-semibold text-muted transition-colors hover:text-fg"
            >
              Browse exercises &rarr;
            </Link>
          </div>

          <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-line bg-bg/70 px-4 py-4 backdrop-blur">
                <dt className="text-xs font-medium uppercase tracking-wider text-subtle">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Why this reference */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-line bg-surface p-5">
              <h2 className="font-semibold tracking-tight">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">The curriculum</h2>
          <p className="mt-2 text-muted">
            Nine levels, in an order where nothing depends on an idea taught later.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {allLevels.map((level, position) => {
            const done = level.topics.filter((topic) => topic.status === "published").length;
            return (
              <section key={level.id} className="rounded-2xl border border-line p-5 transition-colors hover:border-line-strong">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft font-mono text-xs font-semibold text-accent">
                      {String(position + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-semibold leading-tight tracking-tight">{level.title}</h3>
                  </div>
                  <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium text-subtle">
                    {DIFFICULTY_LABEL[level.difficulty]}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{level.summary}</p>

                <ul className="mt-4 space-y-1 border-t border-line pt-4">
                  {level.topics.map((topic) =>
                    topic.status === "published" ? (
                      <li key={topic.slug}>
                        <Link
                          href={`/docs/${topic.slug}`}
                          className="-mx-2 block rounded-md px-2 py-1 text-sm text-fg transition-colors hover:bg-accent-soft hover:text-accent"
                        >
                          {topic.title}
                        </Link>
                      </li>
                    ) : (
                      <li key={topic.slug} className="-mx-2 px-2 py-1 text-sm text-subtle opacity-60">
                        {topic.title} <span className="text-xs">(soon)</span>
                      </li>
                    ),
                  )}
                </ul>
                <p className="mt-3 text-xs text-subtle">
                  {done} of {level.topics.length} topics
                </p>
              </section>
            );
          })}
        </div>
      </section>

      {/* Capstone */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-8 pt-8 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Capstone project</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">Put it all together: the Orders Desk</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Build a small typed system end to end in seven steps: domain model, validated wire format, a
              contract shared by client and server, and a UI driven by a state machine.
            </p>
          </div>
          <Link
            href="/capstone"
            className="inline-flex h-11 shrink-0 items-center rounded-lg bg-accent-solid px-5 text-sm font-semibold text-accent-solid-fg transition-opacity hover:opacity-90"
          >
            Start the capstone
          </Link>
        </div>
      </section>
    </div>
  );
}
