import type { Metadata } from "next";
import Link from "next/link";
import { ExerciseItem, ExerciseProgress } from "@/components/ExerciseItem";
import { InlineMarkdown } from "@/components/InlineMarkdown";
import { getExerciseGroups } from "@/lib/exercises";

export const metadata: Metadata = {
  title: "Exercises",
  description: "Every Practice exercise from every topic, in one place, with a progress tracker.",
};

const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

export default async function ExercisesPage() {
  const groups = await getExerciseGroups();
  const allIds = groups.flatMap((level) =>
    level.topics.flatMap((topic) => topic.exercises.map((item) => item.id)),
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Exercises</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Every <em>Practice</em> section from every topic, gathered in learning order. There are no
        solutions here on purpose: attempt each one, run it through the compiler, and read what it
        says. Ticks are saved in this browser only.
      </p>

      <ExerciseProgress ids={allIds} />

      <div className="mt-14 space-y-12">
        {groups.map((level) => (
          <section key={level.id} className="rounded-2xl border border-line p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold tracking-tight">{level.title}</h2>
              <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium text-subtle">
                {DIFFICULTY_LABEL[level.difficulty]}
              </span>
            </div>

            <div className="mt-5 space-y-7">
              {level.topics.map((topic) => (
                <div key={topic.slug}>
                  <h3 className="text-sm font-semibold">
                    <Link href={`/docs/${topic.slug}#practice`} className="text-accent hover:underline">
                      {topic.title}
                    </Link>
                  </h3>
                  <ul className="mt-1 divide-y divide-line">
                    {topic.exercises.map(({ id, exercise }) => (
                      <ExerciseItem key={id} id={id}>
                        <p className="text-sm leading-relaxed">
                          <InlineMarkdown text={exercise.text} />
                        </p>
                        {exercise.points.length > 0 && (
                          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm leading-relaxed">
                            {exercise.points.map((point) => (
                              <li key={point}>
                                <InlineMarkdown text={point} />
                              </li>
                            ))}
                          </ul>
                        )}
                        {exercise.hasCode && (
                          <p className="mt-1 text-xs text-subtle">
                            Starter code is on the{" "}
                            <Link href={`/docs/${topic.slug}#practice`} className="underline underline-offset-2">
                              topic page
                            </Link>
                            .
                          </p>
                        )}
                      </ExerciseItem>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
