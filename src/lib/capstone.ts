import type { CapstonePage } from "@/types/docs";

/**
 * The pages of the guided capstone, in order. Like the topic registry, the order is
 * hand-controlled: each step only imports files built in earlier steps.
 *
 * `as const satisfies` keeps the slugs as literals (so `CapstoneSlug` is a union of the real
 * names) while still checking every entry against `CapstonePage`.
 */
export const capstonePages = [
  {
    slug: "overview",
    title: "The Orders Desk",
    summary: "A small typed orders system, built end to end, using everything in the course.",
  },
  {
    slug: "01-domain",
    title: "Step 1: Model the domain",
    summary: "Branded ids and money, a status list that is also a type, and a Result for failures.",
  },
  {
    slug: "02-wire-format",
    title: "Step 2: Describe the wire format",
    summary: "Schemas that check JSON and convert it into domain types in one step.",
  },
  {
    slug: "03-contract",
    title: "Step 3: Write the contract",
    summary: "One route table, and the input and output types the compiler derives from it.",
  },
  {
    slug: "04-client",
    title: "Step 4: Build the typed client",
    summary: "A single call() whose arguments and result are decided by the route name.",
  },
  {
    slug: "05-server",
    title: "Step 5: Implement the server",
    summary: "Business rules, exhaustive error mapping, and handlers checked against the contract.",
  },
  {
    slug: "06-ui",
    title: "Step 6: Drive the UI with a state machine",
    summary: "A reducer over a discriminated union, and a component with no impossible states.",
  },
  {
    slug: "07-tighten",
    title: "Step 7: Tighten and review",
    summary: "A review checklist, what a real system would add, and where to go next.",
  },
] as const satisfies readonly CapstonePage[];

export type CapstoneSlug = (typeof capstonePages)[number]["slug"];

/** `overview` is the section's landing page; the steps live under it. */
export function capstoneHref(slug: CapstoneSlug): string {
  return slug === "overview" ? "/capstone" : `/capstone/${slug}`;
}

export function findCapstonePage(slug: string): (typeof capstonePages)[number] | undefined {
  return capstonePages.find((page) => page.slug === slug);
}

export interface AdjacentCapstonePages {
  readonly prev: (typeof capstonePages)[number] | null;
  readonly next: (typeof capstonePages)[number] | null;
}

export function adjacentCapstonePages(slug: CapstoneSlug): AdjacentCapstonePages {
  const index = capstonePages.findIndex((page) => page.slug === slug);
  return {
    prev: capstonePages[index - 1] ?? null,
    next: capstonePages[index + 1] ?? null,
  };
}
