# TypeScript Learning Progress

> **Read this file first** at the start of every session. It is the persistent state
> of this project. Do not re-derive progress from the codebase; trust this file, then
> confirm against `src/lib/registry.ts` (topic `status` fields are the second source
> of truth for what is actually written).

---

## Current Phase

**Phase 3 — Practical TypeScript** &nbsp;·&nbsp; Status: ✅ **Complete**

## Current Topic

None in progress. Levels 1 and 2 (Fundamentals + Practical) are fully written.

## Current Status

Awaiting user go-ahead to begin **Phase 4 — Advanced Types**.

The user asked for Phases 2 and 3 in a single request and they were built back to back
as two separate, individually verified phases. Default behaviour still stands: **one
phase per session, then stop** — unless the user explicitly asks for more.

---

## Completed Phases

### Phase 0 — Foundation ✅

- Next.js 16.3.1 + React 19.2 + TypeScript 5.9 + Tailwind 4 scaffolded (App Router, `src/`, `@/*` alias).
- Strict `tsconfig.json` (see *Important Decisions*).
- MDX content pipeline: `@next/mdx` + `remark-gfm` + `rehype-slug` + `rehype-pretty-code` (Shiki, dual light/dark theme).
- Typed content registry (`src/lib/registry.ts`) covering the full 64-topic roadmap.
- Walking-skeleton routes: roadmap index (`/`) and one MDX topic (`/docs/[slug]`).
- First topic written: **What TypeScript Is**.

**TypeScript concepts used:** `interface`, type aliases, string literal unions,
`readonly` properties and arrays, `as const`, `satisfies`, indexed access types
(`T[number]["slug"]`), `import type`, and Next.js's generated `PageProps<"/route">` /
`LayoutProps<"/">` helpers.

### Phase 1 — Documentation Shell ✅

Built the site chrome. No lesson content; the TypeScript teaching lived in the components.

- `src/app/docs/layout.tsx` — persistent sidebar shell for all `/docs/*` routes.
- `Sidebar` (client, `usePathname`), `MobileNav` (drawer), `SiteHeader` (server),
  `Search` (Ctrl/Cmd+K palette), `TableOfContents` (recursive, `IntersectionObserver`
  scroll-spy), `PrevNextNav` (server), `CodeBlock` (copy button via `mdx-components.tsx`).
- `src/lib/toc.ts` — server-only MDX heading parser matching `rehype-slug` IDs exactly.
- `getAdjacentTopics`, recursive `TocNode` type, `generateMetadata`, progress bar,
  prose/code-block styling (incl. `title=` captions and `{1,3-5}` line highlighting).

**TypeScript concepts used:** recursive interfaces, `"use client"` and the server/client
boundary, `ComponentPropsWithoutRef<"pre">`, `useState<string | null>`, typed React event
handlers, `useRef<HTMLPreElement>`, type-predicate filters, `noUncheckedIndexedAccess`.

### Phase 2 — TypeScript Fundamentals ✅

Ten topics written; **Level 1 is 11/11**:
`annotations-and-inference`, `primitive-types`, `arrays-and-tuples`, `object-types`,
`functions`, `type-aliases-and-interfaces`, `unions-and-literals`, `narrowing`,
`null-and-undefined`, `any-unknown-never-void`.

Covers every Level 1 syllabus keyword (annotations, inference, primitives, arrays, tuples,
objects, optional/readonly properties, function parameter/return/optional/default/rest,
aliases, interfaces, interface vs type, unions, literals, intersections, narrowing via
`typeof`/`in`/`instanceof`/equality/control-flow, `null`/`undefined`, `?.`, `??`, `any`,
`unknown`, `never`, `void`).

### Phase 3 — Practical TypeScript ✅

Nine topics written; **Level 2 is 9/9**:
`enums-and-as-const`, `type-assertions`, `discriminated-unions`, `type-guards`,
`function-overloads`, `classes`, `abstract-and-interfaces`, `generics-basics`,
`generic-constraints`.

Covers every Level 2 syllabus keyword (enums, assertions, `!`, `as const`, `satisfies`,
discriminated unions, type guards/predicates/`asserts`, overloads, classes, all access
modifiers, `readonly`, getters/setters, abstract, static, `implements`, `extends`,
`override`, composition, generics in functions/interfaces/aliases, constraints, `keyof`,
`typeof` in type position, indexed access, generic defaults).

**Content quality gate (new, built in Phase 2, extended in Phase 3):**
`npm run check:content` compiles every ` ```ts ` block under the project's strict flags.
Current result across all 20 published topics: **150 blocks · 47 expected-error lines ·
47 real compiler errors · 0 mismatches.** The gate was mutation-tested in both directions
(removing a real `// Error` marker → `UNEXPECTED`; adding a false one → `STALE CLAIM`).
It also caught two defects in the Phase 0 page, which were fixed.

---

## Pending Phases

| Phase | Name | Topics | Notes |
| ----- | ---- | ------ | ----- |
| 4 | Advanced Types | 10 | Split into 4a (5 topics) + 4b (5 topics) if it runs long |
| 5 | React + TypeScript | 7 | |
| 6 | Node.js + Express | 6 | |
| 7 | Next.js + TypeScript | 5 | Uses this repo as the worked example |
| 8 | Real-World API Typing | 6 | |
| 9 | Config + Professional | 10 | Config (3) + Professional (7) |
| 10 | Review, Exercises & Capstone | — | Exercise pages, search polish, final pass |

Full topic list: [`ROADMAP.md`](./ROADMAP.md). Machine-readable version: `src/lib/registry.ts`.

**Content progress: 20 / 64 topics published** (Level 1: 11/11 · Level 2: 9/9 · rest 0).

---

## Next Topic

**Phase 4 — Advanced Types.** Ten topics, in registry order:

1. `utility-types-objects` — `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`
2. `utility-types-unions` — `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `ConstructorParameters`, `InstanceType`
3. `conditional-types` — `T extends U ? X : Y`, distribution, `infer`
4. `mapped-types` — `[K in keyof T]`, `readonly`/`?` modifiers (`+`/`-`), key remapping with `as`
5. `template-literal-types` — string manipulation at the type level
6. `recursive-types` — JSON, `DeepPartial`, nested key paths
7. `structural-typing` — shape over name, assignability, variance basics
8. `branded-types` — `UserId` vs `OrderId`
9. `result-types` — modelling failure in types (`Result<T, E>`)
10. `declaration-files` — `.d.ts`, `declare`, ambient declarations, declaration merging, module augmentation, typing third-party libraries

**Suggested split if long:** 4a = topics 1–5 (transforming types), 4b = topics 6–10
(modelling with types). Record the last completed slug here if it is split.

**Process per topic:** write `src/content/<slug>.mdx`, run `npm run check:content -- <slug>`,
flip the topic's `status` to `"published"` in `src/lib/registry.ts`, then `tsc` / `eslint` / `next build`.

### Promises the existing content makes about Phase 4 (must be honoured)

- `generic-constraints` calls `Partial<T>` "the first utility type in the next level" and
  uses it in an example before it has been taught — `utility-types-objects` must open with it.
- `discriminated-unions` uses `Record<string, number>` and says it is "covered in *Utility Types*".
- `generic-constraints` teaches `keyof` / `typeof` / `T[K]`; mapped and conditional types may
  now assume them. Do not re-teach.
- `unions-and-literals` and `enums-and-as-const` introduced `as const`; `recursive-types` and
  `template-literal-types` may build on it.

### Forward references elsewhere (for later phases)

`type-assertions` → *unknown at the Boundary* (Phase 8) · `generics-basics` → *A Generic
API Client* (Phase 8) · `type-guards` → *DTOs & Runtime Validation* (Phase 6) ·
`type-aliases-and-interfaces` → *interface vs type in Practice* (Phase 9) ·
`abstract-and-interfaces` → repository/service layers (Phase 6).

---

## Exercise Log

Every topic ends with a **Practice** section. No solutions are written anywhere, by design.
The user has not yet submitted attempts for any of them. When the user returns with an
attempt, review it as a mentor: explain what the compiler reports and why, and only then
show an idiomatic solution. Phase 10 should consolidate these into a graded set.

---

## Important Decisions

1. **Registry-driven navigation, not filesystem-driven.**
   `src/lib/registry.ts` declares levels and topics explicitly. Learning *order* is
   pedagogically critical and must be hand-controlled. It also makes the whole roadmap
   visible before the content exists (`status: "planned"`).

2. **`as const satisfies readonly DocLevel[]`.**
   Validates the registry against `src/types/docs.ts` while preserving literal types, so
   `TopicSlug` is a union of actual slugs rather than `string`.

3. **Content lives in `src/content/*.mdx`, not `/content`.**
   Keeps the `@/*` alias working for `` await import(`@/content/${slug}.mdx`) ``.

4. **MDX files are not routes.** `pageExtensions: ["ts", "tsx"]` excludes `md`/`mdx`.

5. **remark/rehype plugins referenced by string name.** Turbopack (Next 16 default) cannot
   receive JavaScript functions in config — only serializable options.

6. **Strict tsconfig beyond `strict: true`.** `noUncheckedIndexedAccess`, `noImplicitOverride`,
   `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`,
   `forceConsistentCasingInFileNames`; `target` ES2022. **Deliberately off:**
   `exactOptionalPropertyTypes` — friction with React prop spreading for little benefit; to
   be discussed in the *Strictness Flags* topic rather than silently enabled.

7. **`suppressHydrationWarning` on `<body>`.** Browser extensions inject attributes before
   hydration. Scoped to that one element; children are still checked.

8. **No `any` anywhere.** Use `unknown` and narrow. Strictness is never relaxed to make an
   error disappear — the error gets explained.

9. **The TOC is parsed from MDX source, not a remark plugin.** *(Phase 1)* `src/lib/toc.ts`
   slugs headings with the same `github-slugger` that `rehype-slug` uses. Verified for all
   20 published pages: TOC links and rendered heading IDs match exactly.

10. **`lib/toc.ts` is server-only, separate from `lib/docs.ts`.** *(Phase 1)* `toc.ts` imports
    `node:fs`; `docs.ts` is imported by Client Components.

11. **Prev/next walks the full sequence, including unwritten topics.** *(Phase 1)* Planned
    topics render as muted, unclickable cards. Linking them would 404 (`dynamicParams = false`).

12. **`Search` imports the registry directly rather than receiving props.** *(Phase 1)* A few
    KB in the client bundle; first thing to revisit if the registry grows.

13. **State resets on close, never in an effect.** *(Phase 1)* Fixed a
    `react-hooks/set-state-in-effect` lint error properly, not by disabling the rule.

14. **Every code block in the docs is compiled.** *(Phase 2)* `scripts/check-content.mts`
    (`npm run check:content`) extracts each ` ```ts ` fence, compiles it as an isolated module
    under strict flags, and enforces: a line expected to fail carries a trailing `// Error`
    comment; every compiler error must be claimed; every claim must be real. **Consequences
    for authoring:** snippets must be self-contained (declare the types they use); never use
    `// Error` as a comment meaning anything else (it collided once with the `Error` class —
    reworded); put a `// Error: ...` marker on the exact line the compiler flags.

15. **The checker is TypeScript, run natively.** *(Phase 3)* `scripts/check-content.mts` obeys the
    "no JavaScript source files" rule and is type-checked by `tsc`/ESLint like everything else.
    Node 24's type stripping runs it directly, so it avoids enums and parameter properties.
    Its scratch directory is `os.tmpdir()`, never the project, so it cannot leak into the build.

16. **Teaching stance recorded in the content — keep it consistent.** *(Phases 2–3)*
    - Closed sets of values: **union of literals** by default → `as const` object/array when
      runtime values are also needed → `enum` only for existing code. (`enums-and-as-const`)
    - `interface` for public object contracts and anything a class `implements`; `type` for
      unions, tuples, function types and computed types; consistency matters more than the choice.
    - Prefer proving to asserting (`instanceof`, narrowing) over `as` / `!`; `satisfies` over
      annotation when literal precision matters.
    - Prefer composition + small interfaces over inheritance; `abstract` only for genuinely
      shared skeletons.
    - Model states as **discriminated unions**, not bags of optional fields; end `switch`es with
      an `assertNever` default.

---

## Project Architecture

```text
D:\TypeScript
├── src/
│   ├── app/                     # Routes only — thin, no business logic
│   │   ├── layout.tsx           # Root layout, fonts, metadata, SiteHeader
│   │   ├── page.tsx             # Roadmap index + progress bar
│   │   ├── globals.css          # Prose + code-block styling
│   │   └── docs/
│   │       ├── layout.tsx       # Sidebar shell for all topic pages
│   │       └── [slug]/page.tsx  # Renders one MDX topic + TOC + prev/next
│   ├── components/              # SiteHeader, Sidebar, MobileNav, Search,
│   │                            # TableOfContents, PrevNextNav, CodeBlock
│   ├── content/                 # 20 MDX topics — one file per registry slug
│   ├── lib/
│   │   ├── registry.ts          # Source of truth: levels, topics, order, status
│   │   ├── docs.ts              # Derived helpers — SAFE for client components
│   │   └── toc.ts               # Heading parser — SERVER ONLY (node:fs)
│   ├── types/docs.ts            # Navigation model + recursive TocNode
│   └── mdx-components.tsx       # Global MDX overrides (pre -> CodeBlock)
├── scripts/
│   └── check-content.mts        # Content quality gate (npm run check:content)
├── next.config.ts               # MDX + remark/rehype wiring
├── tsconfig.json                # Strict configuration
├── ROADMAP.md                   # Full topic list; finished topics ticked
└── LEARNING_PROGRESS.md         # This file
```

**Layering rule:** `app/` → `components/` → `lib/` → `types/`. Never the reverse; `types/` imports nothing.

---

## Authoring Reference

**Page shape** (adapt, don't force): `# Title` → `## What` → syntax/behaviour → a realistic
example (users, products, orders, API responses) → `## Common mistakes` → `## Practice`
(no solution). JS→TS comparisons where they genuinely help. Concise, scannable.

**Shell features available to every MDX file:**
- `##` / `###` headings are auto-linked and appear in the TOC; `#` is the page title.
- Fences get Shiki highlighting and a copy button; `title="path"` adds a filename caption;
  `{2,5-7}` highlights lines. Headings inside fences are ignored by the TOC parser.
- GitHub-flavoured Markdown tables / task lists (remark-gfm).

**Gate conventions (decision #14):** self-contained `ts` blocks; `// Error: ...` on the exact
failing line; use ```` ```js ```` for JavaScript, which is not compiled.

---

## Last Development Work

Phases 2 and 3 in one session: 19 new MDX topics, the content gate, and its migration into
the project as TypeScript.

**Verification run (all green):**
- `npm run check:content` → 20 topics · 150 blocks · 47/47 claimed errors real · 0 problems
- `npx tsc --noEmit` → 0 errors (includes `scripts/check-content.mts`)
- `npx eslint .` → 0 problems
- `npx next build` → success, 24 static pages
- All 20 topic pages fetched from the dev server: HTTP 200, TOC ↔ heading-ID parity exact,
  prev/next present on every page, 0 browser console errors
- Sidebar: 20 published links + 44 planned = 64; prev/next at the Level 2 → Level 3 boundary
  correctly shows "Utility Types: Objects — Not written yet"

**Defects found by the gate and fixed:** Phase 0's `what-is-typescript` had an unmarked
expected error and a snippet using undeclared `User`/`res`; one `// Error` comment in
`narrowing` meant the `Error` class and was reworded.

---

## Issues / Blockers

- None blocking.
- **Scroll-spy is still unverified.** The TOC's `IntersectionObserver` highlighting could not
  be tested: the in-app browser pane does not composite frames, and IntersectionObserver
  delivery depends on rendering. A control observer also fired zero callbacks, which points to
  the environment rather than the code — but the feature has never been seen working.
  **Please eyeball it** on a long page such as `narrowing`.
- **Prose claims are not machine-checked.** The gate verifies code, not sentences. Claims such
  as "Node's type stripping cannot run enums" or "TS 5.5 infers type predicates" were written
  from knowledge and are worth a skim.
- Screenshots / smooth-scroll unavailable in the preview pane; visual/design review is on the user.
- **Not a git repository.** Four phases are now complete and uncommitted. `git init` has not been
  run because it was not requested; it is the single biggest risk to the work so far.

---

## Next Recommended Action

1. Run the site and read a few pages as a reader would:

   ```bash
   npm run dev
   ```

   Suggested: `narrowing`, `discriminated-unions`, `generic-constraints` (the densest three).
   Scroll one and confirm the right-hand TOC highlights the current section.

2. **Attempt the Practice sections** — especially `narrowing`, `discriminated-unions` and
   `generics-basics`. Show me your answers; I'll review them before showing solutions.

3. Run the gate yourself:

   ```bash
   npm run check:content
   ```

4. Consider `git init` + a commit per phase before continuing.

5. Say **"start Phase 4"** to begin Advanced Types.

---

## Session Log

| Date | Phase | Work |
| ---- | ----- | ---- |
| 2026-08-19 | 0 | Foundation: scaffold, strict config, MDX pipeline, registry, first topic. |
| 2026-08-19 | 0 | Fix: extension-induced hydration warning on `<body>` (suppressHydrationWarning). |
| 2026-08-23 | 1 | Docs shell: sidebar, mobile drawer, header, search palette, TOC, prev/next, copy buttons, prose styling. Corrected topic count 66 → 64. |
| 2026-10-17 | 2 | 10 Level 1 topics. Built the content compile gate; fixed 2 defects it found in Phase 0 content. |
| 2026-10-17 | 3 | 9 Level 2 topics. Moved the gate into `scripts/` as TypeScript + `npm run check:content`; mutation-tested it. |
