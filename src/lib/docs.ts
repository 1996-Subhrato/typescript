import { levels } from "@/lib/registry";
import type { DocLevel, DocTopic, LevelId } from "@/types/docs";

/**
 * A topic plus the level it belongs to.
 *
 * The registry is nested (levels contain topics) but navigation is flat
 * (prev/next crosses level boundaries), so we flatten once here and reuse it.
 */
export interface TopicEntry {
  readonly topic: DocTopic;
  readonly levelId: LevelId;
  readonly levelTitle: string;
  /** Position in the flattened learning order, 0-based. */
  readonly index: number;
}

export const allLevels: readonly DocLevel[] = levels;

function buildTopicIndex(): readonly TopicEntry[] {
  const entries: TopicEntry[] = [];

  for (const level of levels) {
    for (const topic of level.topics) {
      entries.push({
        topic,
        levelId: level.id,
        levelTitle: level.title,
        index: entries.length,
      });
    }
  }

  return entries;
}

/** The full learning sequence, flattened across levels. */
export const allTopics: readonly TopicEntry[] = buildTopicIndex();

export const publishedTopics: readonly TopicEntry[] = allTopics.filter(
  (entry) => entry.topic.status === "published",
);

export function findTopic(slug: string): TopicEntry | undefined {
  return allTopics.find((entry) => entry.topic.slug === slug);
}

/** Progress figures for the roadmap page. */
export function getProgress(): { published: number; total: number } {
  return { published: publishedTopics.length, total: allTopics.length };
}

/** Neighbours in the learning sequence. `null` at the two ends. */
export interface AdjacentTopics {
  readonly prev: TopicEntry | null;
  readonly next: TopicEntry | null;
}

/**
 * Previous/next walk the FULL sequence, including topics still marked
 * "planned", so the footer can show what is coming next. The component decides
 * whether to render a link or muted text — see `PrevNextNav`.
 *
 * Note the `?? null`. With `noUncheckedIndexedAccess` enabled, `allTopics[-1]`
 * is typed `TopicEntry | undefined`, which is the truth: array indexing can miss.
 * Without that flag TypeScript would confidently type it `TopicEntry` and the
 * `undefined` would reach the component.
 */
export function getAdjacentTopics(slug: string): AdjacentTopics {
  const entry = findTopic(slug);
  if (!entry) return { prev: null, next: null };

  return {
    prev: allTopics[entry.index - 1] ?? null,
    next: allTopics[entry.index + 1] ?? null,
  };
}
