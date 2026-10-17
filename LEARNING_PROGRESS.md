# TypeScript Learning Progress

> **Read this file first** at the start of every session. It is the persistent state
> of this project. Do not re-derive progress from the codebase; trust this file, then
> confirm against `src/lib/registry.ts` (topic `status` fields are the second source
> of truth for what is actually written).

---

## Current Phase

**Phase 6 — Node.js + Express** &nbsp;·&nbsp; Status: ✅ **Complete**

## Current Topic

None in progress. Levels 1-3, React and Node/Express are fully written.

## Current Status

The user asked for Phases 4, 5, 6 and 7 in one request; they are built back to back as separate,
individually verified and individually committed phases. Phases 4, 5 and 6 are done and committed.
Default behaviour still stands: **one phase per request, then stop**, unless the user asks for more.

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

### Phase 4 — Advanced Types ✅

Ten topics written; **Level 3 is 10/10**: `utility-types-objects`, `utility-types-unions`,
`conditional-types`, `mapped-types`, `template-literal-types`, `recursive-types`,
`structural-typing`, `branded-types`, `result-types`, `declaration-files`.

Covers every Level 3 syllabus keyword (all utility types incl. `Awaited`, conditional types,
`infer`, mapped types and modifiers, key remapping, template literal types, recursive types,
type-level transformations, structural typing, compatibility, variance basics, branded types,
discriminated state modelling, `Result` types, declaration merging, module/global augmentation,
`.d.ts`, ambient declarations, `declare`, third-party typing).

**Promises from earlier phases honoured:** `Partial` and `Record` are taught first in
`utility-types-objects`; `DeepPartial` is built in `recursive-types`.

**Tooling added this phase (commit `fe0f31e`):** the gate now compiles `tsx`, resolves `react` /
`express` / `zod` / `next`, supports a counted `{/* check:skip */}` marker, and `npm run check:pages`
smoke-tests rendered pages. Dev dependencies `@types/express` and `zod` were added solely so
documentation examples can be type-checked.

**Gate hardening found by a real failure:** `next build` crashed on `${string}` written inside a
nested-backtick inline code span (MDX read it as a live expression). The gate only compiled code,
so it could not see it. It now also lints prose for stray `{ }` and `<tag`, regression-tested by
reintroducing the exact bug.

### Phase 5 — React + TypeScript ✅

Seven topics written: `react-props`, `react-state`, `react-refs-context`, `react-events-forms`,
`react-custom-hooks`, `react-generic-components`, `react-async-data`.

Covers: props / `children` / `ReactNode` / `ComponentProps` / discriminated props, `useState` inference vs
explicit, `useReducer` with action unions, `useRef` (DOM vs mutable) and React 19 `ref`-as-prop, context with
a guard hook, event types and typed forms (`FormData`, form `action`), custom-hook return shapes (`as const`),
generic hooks, generic components (`List<T>`, `Select<T>`, `Table<T>`), async state as a discriminated union,
a `useFetch<T>` that validates with a `parse` function, and `use` + Suspense.

**Verified against the installed React 19 types, not memory:** `useRef` requires an argument; `FC` has no
implicit `children`; global `JSX` is gone (`React.JSX` remains); `<Context.Provider>` still compiles;
`ComponentProps<"input">` carries `ref`.

**Lint-checked against the project's own ESLint:** every React block was extracted and linted. The first pass
found real defects in my examples (hook calls at module top level; `setState`/`dispatch` called during render;
a ref written during render). All were fixed so examples are valid React, not merely valid types. Final result:
zero `react-hooks/*` findings.

### Phase 6 — Node.js + Express ✅

Six topics written: `express-request-response`, `express-middleware`, `express-layers`,
`dtos-and-validation`, `env-and-config`, `database-models`.

Covers: `Request<Params, ResBody, ReqBody, ReqQuery>` and `Response<T>`, route-param inference from the path
string, `req.body` being `any`, query narrowing, async handlers (Express 5), `RequestHandler` /
`ErrorRequestHandler`, middleware factories, `HttpError`, augmenting `Express.Request`, a type-predicate
`withUser` wrapper, controller / service / repository layering with `Result` and exhaustive status mapping,
test doubles via structural typing, "a type is not a check", hand-written guards vs Zod (`z.infer`,
`z.input` / `z.output`, `z.coerce`), validated `env` objects, row / insert / update / public types,
branded ids, `Pick` over `Omit` for secrets, and a `Serialized<T>` mapped type (Date → string).

**Verified, not assumed:** Express 5 typings read from `@types/express` 5.0.6 (handlers return `unknown`;
`req.body` defaults to `any`; `Express.Request` is the global augmentation point); the claim that a handler
typed with a stricter request cannot be passed to `app.get` was reproduced; Zod 4.6.7 type claims asserted
with an `Equal` probe AND Zod behaviour (defaults, coercion, rejection) executed for real.

**Gate improvement:** prose lint now works per paragraph (inline code may wrap across lines); re-verified it
still catches the original `${string}` crash.

---

## Pending Phases

| Phase | Name | Topics | Notes |
| ----- | ---- | ------ | ----- |
| 7 | Next.js + TypeScript | 5 | Uses this repo as the worked example |
| 8 | Real-World API Typing | 6 | |
| 9 | Config + Professional | 10 | Config (3) + Professional (7) |
| 10 | Review, Exercises & Capstone | — | Exercise pages, search polish, final pass |

Full topic list: [`ROADMAP.md`](./ROADMAP.md). Machine-readable version: `src/lib/registry.ts`.

**Content progress: 43 / 64 topics published** (Level 1: 11/11 · Level 2: 9/9 · Level 3: 10/10 · React: 7/7 · Node/Express: 6/6 · rest 0).

---

## Next Topic

**Phase 7 — Next.js + TypeScript.** Five topics, in registry order:

1. `nextjs-pages-layouts` — `PageProps<"/route">` / `LayoutProps<"/route">` (globals generated by `next dev` / `build` / `typegen`), async `params` and `searchParams`, `generateMetadata`, `generateStaticParams`. **Use this very repo as the worked example** (`src/app/docs/[slug]/page.tsx`, `src/app/docs/layout.tsx`).
2. `nextjs-server-client` — Server vs Client Components, `"use client"`, what props may cross the boundary (serialisable only), `server-only`, why `lib/toc.ts` is separate from `lib/docs.ts` (decision #10)
3. `nextjs-route-handlers` — `app/**/route.ts`, `NextRequest` / `NextResponse`, typed `GET` / `POST`, `RouteContext<"/route">` for params, validating bodies (links to `dtos-and-validation`)
4. `nextjs-server-actions` — `"use server"`, `useActionState`, typed form state, `FormData`, validation with Zod (links to `react-events-forms`)
5. `nextjs-config` — `next.config.ts` (`NextConfig`), `Metadata`, `Viewport`, env typing (links to `env-and-config`), generated route types

**MANDATORY before writing (AGENTS.md):** this is NOT the Next.js you know. Read the matching guides in
`node_modules/next/dist/docs/01-app/` first — especially `01-getting-started/` (layouts-and-pages, server-and-client-components,
mutating-data, route-handlers, metadata) and `03-api-reference/03-file-conventions/` + `04-functions/`. Installed: `next` 16.3.1.
Check every API name against the installed types, not memory.

**Gate notes:** `PageProps<...>`, `LayoutProps<...>` and `RouteContext<...>` are generated from the REAL route tree, so snippets using
them cannot compile standalone — precede such blocks with `{/* check:skip */}` and say why in the prose. Where a snippet can
be written with explicit types (`params: Promise<{ slug: string }>`), prefer that so it IS compiled. `next/server`, `next/navigation`,
`next/headers` and `next` resolve from the project's `node_modules`.

### Later phases at a glance

| Phase | Topics |
| ----- | ------ |
| 8 Real-World API Typing | `typing-api-responses`, `generic-api-client`, `pagination-and-envelopes`, `unknown-at-the-boundary`, `api-contract-modelling`, `api-error-modelling` |
| 9 Config + Professional | `tsconfig-essentials`, `strictness-flags`, `paths-and-output`, `interface-vs-type`, `avoiding-any`, `designing-types`, `reading-complex-types`, `compiler-errors`, `migrating-js-to-ts`, `anti-patterns` |
| 10 Review & Capstone | Consolidated exercises, capstone, final pass |

### Open forward references

`result-types` → *Error Modelling* (Phase 8) · `type-assertions` → *unknown at the Boundary* (Phase 8) ·
`generics-basics` → *A Generic API Client* (Phase 8) · `react-async-data` (its `parse` function) → *unknown at the Boundary* (Phase 8) ·
`react-custom-hooks` (SSR caution) → *Server & Client Components* (Phase 7) · `react-events-forms` (form `action`) → *Server Actions & Forms* (Phase 7) ·
`dtos-and-validation` / `env-and-config` (public vs server env) → *Typed Configuration* (Phase 7) ·
`database-models` (`Serialized<T>`) → *Typing API Responses* (Phase 8) ·
`type-aliases-and-interfaces` → *interface vs type in Practice* (Phase 9) ·
`strictness-flags` must finally explain `exactOptionalPropertyTypes` (decision #6).

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

17. **The gate also lints prose for MDX hazards.** *(Phase 4)* In MDX a stray `{...}` or `<Tag` outside
    code is evaluated/parsed as JavaScript/JSX. A `${string}` inside a nested-backtick inline span crashed
    `next build` while every code block compiled. `check-content` now strips fences and inline code and
    flags what remains. To write backticks inside inline code use a double-backtick span:
    ``` `` `/api/${string}` `` ```. Always run `npm run build` before committing content.

18. **Type-level result comments are not machine-checked by the gate.** *(Phase 4)* The gate proves
    claimed *errors*; it cannot prove a comment like `// "userId" | "postId"`. Before publishing type-level
    topics, assert the claims with an ad-hoc `Equal<A, B>` probe (and a negative control that must fail).
    16 claims were verified this way in Phase 4. Consider a permanent mechanism if this recurs.

19. **Scratch files for checks live in `node_modules/.cache/`.** *(Phases 4+)* It resolves `react`,
    `express`, `zod` and `next`, is excluded from the project tsconfig, ESLint and git, and is deleted
    after every run.

20. **React examples are linted, not just compiled.** *(Phase 5)* The project's ESLint (`react-hooks/*`, incl. the
    React Compiler rules `set-state-in-effect`, `refs`, `set-state-in-render`) rejected several of my first examples.
    Rule: never teach a pattern this repo's own linter refuses. Hook usages go inside components; state setters and
    `dispatch` go in handlers or effects, never in render; refs are mutated only in handlers/effects. Method: extract
    the react-* blocks to a temp folder under `src/`, `eslint --format json`, filter `react-hooks/*`, delete the folder.
    (`@typescript-eslint/no-unused-vars` noise on demo snippets is expected.)

21. **`useFetch` derives "loading" instead of storing it.** *(Phase 5)* Only settled results (`success` / `error`, tagged with
    their `url`) are stored; loading is derived by comparing the stored `url` with the current one. This avoids
    synchronous `setState` in an effect and teaches "derive, don't sync". `parse` must be a stable (module-level) function.

22. **Prose lint is per paragraph.** *(Phase 6)* Inline code may wrap across source lines, so linting line by line produced
    a false positive. Paragraphs (consecutive non-blank prose lines) are joined first. Re-verified against the original bug.

23. **Backend examples only type-check; they never run.** *(Phase 6)* `express` is not installed — only `@types/express`.
    Claims about Express runtime behaviour (arity-based error handlers, Express 5 forwarding rejected promises,
    `req.body` being `undefined` without a parser) come from documented behaviour, not from running Express. Zod IS
    installed, so Zod behaviour claims were executed.

24. **Secrets use allow-lists.** *(Phase 6)* Public shapes are built with `Pick` (new columns hidden until added on purpose),
    not `Omit` (new columns exposed automatically), and row→domain mappers construct objects field by field instead of spreading.

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
│   ├── content/                 # 43 MDX topics — one file per registry slug
│   ├── lib/
│   │   ├── registry.ts          # Source of truth: levels, topics, order, status
│   │   ├── docs.ts              # Derived helpers — SAFE for client components
│   │   └── toc.ts               # Heading parser — SERVER ONLY (node:fs)
│   ├── types/docs.ts            # Navigation model + recursive TocNode
│   └── mdx-components.tsx       # Global MDX overrides (pre -> CodeBlock)
├── scripts/
│   ├── check-content.mts        # Content gate: compiles code, lints MDX prose
│   └── check-pages.mts          # Page smoke test (needs a running server)
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

**End-of-phase checklist:** `npm run typecheck` · `npm run lint` · `npm run check:content` ·
`npm run build` · update this file · update the **Curriculum table and "N of 64" count in
`README.md`** (it is hand-written and goes stale) · tick finished topics in `ROADMAP.md` · commit.

**Gate conventions (decision #14):** self-contained `ts` blocks; `// Error: ...` on the exact
failing line; use ```` ```js ```` for JavaScript, which is not compiled.

---

## Last Development Work

Phase 6 — Node.js + Express (6 topics).

**Verification (all green):** `typecheck` · `lint` · `check:content` → 43 topics · 317 blocks · 2 skipped · 106/106 claimed errors
real · 0 problems · `build` → 47 static pages · `check:pages` → all 43 pages OK.

**Probes:** Express 5 typings read from source; the stricter-request-handler claim reproduced; Zod/`Serialized` type claims asserted
exactly; Zod runtime behaviour executed (default applied, bad input rejected, `z.coerce` → `{ page: 3, pageSize: 20 }`).

**Defect found:** a pseudo-code signature outline sat in a compiled `ts` fence — changed to `text`. **Gate fix:** prose lint false positive on
wrapped inline code → now per paragraph. `declaration-files` gained a pointer to the global `Express.Request` hook.

---

## Issues / Blockers

- None blocking.
- **Scroll-spy is still unverified.** The TOC's `IntersectionObserver` highlighting has never been seen
  working: the in-app browser pane does not composite frames. Please eyeball it on a long page.
- **Prose claims are not machine-checked** (see decision #18 for type-level comments). Claims like
  "Node's type stripping cannot run enums" come from knowledge — skim them.
- **`npm audit` reports high-severity advisories in the dev toolchain** (`braces`, `brace-expansion`,
  `micromatch`, `fast-glob` via ESLint). Not runtime dependencies. The only offered fix is `--force`,
  which would downgrade `eslint-config-next` to v14 — a breaking change, deliberately not applied.
  A non-breaking `npm audit fix` may resolve part of it; try it when convenient.
- Screenshots / smooth-scroll are unavailable in the preview pane; visual/design review is on the user.
- **Git:** baseline `9bec822` plus one commit per phase since. `origin` is configured but **nothing has
  been pushed** (not requested). Windows prints LF→CRLF warnings; a `.gitattributes` would silence them.

---

## Next Recommended Action

1. Run the site: `npm run dev`. Read `conditional-types`, `mapped-types` and `recursive-types` (the densest).
2. **Attempt the Practice sections** — the Level 3 ones are hard on purpose. Share attempts and I will review
   them before showing solutions.
3. Run the checks yourself: `npm run typecheck && npm run lint && npm run check:content && npm run build`.
4. Optionally push: `git push -u origin main`.
5. Continue with **Phase 5 — React + TypeScript** (if not already built in this session).

---

## Session Log

| Date | Phase | Work |
| ---- | ----- | ---- |
| 2026-08-19 | 0 | Foundation: scaffold, strict config, MDX pipeline, registry, first topic. |
| 2026-08-19 | 0 | Fix: extension-induced hydration warning on `<body>` (suppressHydrationWarning). |
| 2026-08-23 | 1 | Docs shell: sidebar, mobile drawer, header, search palette, TOC, prev/next, copy buttons, prose styling. Corrected topic count 66 → 64. |
| 2026-10-17 | 2 | 10 Level 1 topics. Built the content compile gate; fixed 2 defects it found in Phase 0 content. |
| 2026-10-17 | 3 | 9 Level 2 topics. Moved the gate into `scripts/` as TypeScript + `npm run check:content`; mutation-tested it. |
| 2026-10-17 | - | Initialised git, baseline commit `9bec822`. Rewrote `README.md` (curriculum table, scripts, quality gate, how to add a topic). Added `npm run typecheck` (`next typegen && tsc --noEmit`) because bare `tsc` fails on a fresh clone. |
| 2026-10-17 | - | Tooling: gate compiles `tsx`, resolves react/express/zod/next, counted skip marker; `check:pages` added. Commit `fe0f31e`. |
| 2026-10-17 | 4 | 10 Advanced Types topics; prose lint added to the gate after an MDX render crash; 16 type-level claims asserted with an Equal probe. |
| 2026-10-17 | 5 | 7 React topics; examples linted against the repo's react-hooks rules and fixed; React 19 typings verified against installed types. |
| 2026-10-17 | 6 | 6 Node/Express topics; Express 5 typings verified from source; Zod behaviour executed; prose lint made paragraph-aware. |
