import { readFile } from "node:fs/promises";
import path from "node:path";
import { allLevels } from "@/lib/docs";
import { exerciseId } from "@/lib/exercise-progress";
import { extractExercises, type Exercise } from "@/lib/exercises-parse";
import type { Difficulty, LevelId } from "@/types/docs";

/**
 * Collects every topic's Practice section for the exercises page.
 *
 * SERVER-ONLY (it reads files), like `lib/toc.ts` and `lib/search-index.ts`.
 */

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

export interface IndexedExercise {
  /** Stable id used to remember that the reader finished it. */
  readonly id: string;
  readonly exercise: Exercise;
}

export interface TopicExercises {
  readonly slug: string;
  readonly title: string;
  readonly exercises: readonly IndexedExercise[];
}

export interface LevelExercises {
  readonly id: LevelId;
  readonly title: string;
  readonly difficulty: Difficulty;
  readonly topics: readonly TopicExercises[];
}

export async function getExerciseGroups(): Promise<LevelExercises[]> {
  return Promise.all(
    allLevels.map(async (level) => {
      const topics = await Promise.all(
        level.topics
          .filter((topic) => topic.status === "published")
          .map(async (topic): Promise<TopicExercises> => {
            const source = await readFile(path.join(CONTENT_DIR, `${topic.slug}.mdx`), "utf8");
            return {
              slug: topic.slug,
              title: topic.title,
              exercises: extractExercises(source).map((exercise, position) => ({
                id: exerciseId(topic.slug, position),
                exercise,
              })),
            };
          }),
      );
      return { id: level.id, title: level.title, difficulty: level.difficulty, topics };
    }),
  );
}
