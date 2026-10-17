/**
 * The shape of the documentation site's navigation model.
 *
 * These types are the contract that `src/lib/registry.ts` is checked against.
 * Nothing here describes *content* — only structure and ordering.
 */

/** Every level the roadmap is divided into. A literal union, not `string`. */
export type LevelId =
  | "fundamentals"
  | "practical"
  | "advanced"
  | "react"
  | "node"
  | "nextjs"
  | "api"
  | "config"
  | "professional";

/** Used to badge topics in the sidebar. */
export type Difficulty = "beginner" | "intermediate" | "advanced";

/**
 * `published` topics have an `.mdx` file in `src/content`.
 * `planned` topics appear in the roadmap but are not routable yet.
 */
export type TopicStatus = "published" | "planned";

export interface DocTopic {
  /** URL segment and `src/content/<slug>.mdx` filename. Must be unique site-wide. */
  readonly slug: string;
  readonly title: string;
  /** One line, shown in the sidebar tooltip and on the roadmap page. */
  readonly summary: string;
  readonly status: TopicStatus;
}

export interface DocLevel {
  readonly id: LevelId;
  readonly title: string;
  readonly summary: string;
  readonly difficulty: Difficulty;
  /** Order matters: this is the intended learning sequence. */
  readonly topics: readonly DocTopic[];
}

/* -------------------------------------------------------------------------- */
/* Table of contents                                                          */
/* -------------------------------------------------------------------------- */

/** Only `##` and `###` appear in the TOC. `#` is the page title. */
export type HeadingDepth = 2 | 3;

/**
 * A heading in a topic page.
 *
 * This is a RECURSIVE type: `TocNode` refers to itself through `children`.
 * TypeScript allows this for interfaces and object types because the reference
 * is "lazy" — it sits behind a property, so the compiler never has to expand it
 * infinitely. (A type alias like `type T = T` is rejected for exactly that reason.)
 */
export interface TocNode {
  /** Matches the `id` rehype-slug puts on the rendered heading element. */
  readonly id: string;
  readonly title: string;
  readonly depth: HeadingDepth;
  readonly children: readonly TocNode[];
}

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

export interface SearchHeading {
  readonly id: string;
  readonly title: string;
}

/** One topic as the search index sees it: metadata, headings, and plain prose. */
export interface SearchEntry {
  readonly slug: string;
  /** Where the entry lives, e.g. `/docs/narrowing` or `/capstone/01-domain`. */
  readonly href: string;
  readonly title: string;
  readonly levelTitle: string;
  readonly summary: string;
  readonly headings: readonly SearchHeading[];
  /** Prose with Markdown syntax removed. Code blocks are deliberately excluded. */
  readonly text: string;
}

export type SearchIndex = readonly SearchEntry[];

/* -------------------------------------------------------------------------- */
/* Capstone                                                                   */
/* -------------------------------------------------------------------------- */

/** One page of the guided capstone build. These are not registry topics. */
export interface CapstonePage {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
}
