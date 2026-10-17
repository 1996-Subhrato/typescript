# TypeScript Learning Progress

> **Read this file first** at the start of every session. It is the persistent state
> of this project. Do not re-derive progress from the codebase; trust this file, then
> confirm against `src/lib/registry.ts` (topic `status` fields are the second source
> of truth for what is actually written).

---

## Current Phase

**Phase 8 — Real-World API Typing** &nbsp;·&nbsp; Status: ✅ **Complete**

## Current Topic

None in progress. Everything except Config + Professional (Phase 9) and the Phase 10 review is written.

## Current Status

Phase 8 is complete, verified and committed. Awaiting user go-ahead to begin **Phase 9 — Config + Professional**.
Default behaviour: **one phase per request, then stop**, unless the user explicitly asks for more.

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

### Phase 7 — Next.js + TypeScript ✅

Five topics written: `nextjs-pages-layouts`, `nextjs-server-client`, `nextjs-route-handlers`,
`nextjs-server-actions`, `nextjs-config`.

Covers: async `params` / `searchParams`, `notFound(): never` narrowing, generated `PageProps` / `LayoutProps` /
`RouteContext`, dynamic segment shapes, `generateStaticParams`, `Metadata` / `Viewport`; the server/client boundary,
a type-level `Serializable` check for client props (and why `interface` fails it), composition via `children`,
`server-only`; `NextRequest` / `NextResponse<T>`, `unknown` request bodies validated with Zod, async `cookies()`;
Server Actions with a discriminated `FormState`, `useActionState` inference, `bind`, "actions are public endpoints",
`redirect` / `revalidatePath`; `NextConfig`, function-form config, `typedRoutes`, `NEXT_PUBLIC_` inlining and what it means
for a typed `publicEnv`, and the tsconfig pieces a Next project needs. This repo's own files are the worked examples.

**Read from the bundled Next 16.3.1 docs first (AGENTS.md), then verified:** `params` is a Promise; `RouteContext` /
`PageProps` / `LayoutProps` are generated; Server Functions cannot be defined in Client Components; `redirect` throws;
actions are reachable by direct POST; only literal `process.env.NEXT_PUBLIC_*` reads are inlined; `typedRoutes` is stable.

**Probe result worth remembering:** `useActionState(action, initial)` infers `State` from the *action*, so `state` is the
full union even with an unannotated initial value, and the initial value is checked against it. My first draft claimed
otherwise; a probe corrected it before publishing.

**Lint-checked** (react-hooks rules) like Phase 5: no findings; one odd `export default [...]` in an error demo replaced.

### Phase 8 — Real-World API Typing ✅

Six topics written: `typing-api-responses`, `generic-api-client`, `pagination-and-envelopes`, `unknown-at-the-boundary`,
`api-contract-modelling`, `api-error-modelling`. Running domain: an e-commerce API (users, products, orders).

Covers: wire type vs domain type and the mapper between them; optional (`?`) vs nullable (`| null`) vs both; unions in
payloads; values that may grow; why a generic that appears only in a return type is a claim (`getJson<T>`), a `request<T>`
that takes a `parse` function, a Zod-driven `createApiClient` whose response type is derived from the schema; envelopes,
offset vs cursor pagination, opaque branded cursors, `mapPage`, `ItemOf`, an `AsyncGenerator` page iterator, a
`cursorPageSchema` factory; the "`unknown` until checked" rule and four narrowing techniques with a comparison, `z.input`
vs `z.output`, lenient vs strict parsing; a typed contract (`keyof`, indexed access, template-literal path params, a
variadic-argument `call`, a server `Handlers` mapped type, schema-first contracts); an `ApiError` discriminated union,
parsing error bodies from `unknown`, exhaustive `messageFor` / `isRetryable`, `Extract`, typed field errors,
`ApiRequestError`, and a server-side `toErrorResponse`.

**Promises kept:** `generics-basics` ("returns to" the assertion problem), `type-assertions` and `result-types` (runtime
validation), `react-async-data` (`parse`), `database-models` (`Serialized<T>` -> wire/domain mapping), `nextjs-route-handlers`
(shared contract), `result-types` (error modelling).

**Verified beyond the compile gate:** 9 contract-derived types asserted exactly with an `Equal` probe; 3 pagination/schema
types asserted; and EXECUTED for real — `withQuery` output, the `iterateAll` generator over fake pages, Zod defaults / date
transform / key stripping / `.strict()` rejection, and the exact message `"email: Invalid email address"`.

**Integrity fixes during review:** an `as Record<string, string[]>` inside the error-body parser (in a topic arguing against
assertions) was replaced with a real `isFieldErrors` guard; the covariance sentence in pagination was corrected after a probe
showed mutable arrays are also assignable (unsoundly).

---

## Pending Phases

| Phase | Name | Topics | Notes |
| ----- | ---- | ------ | ----- |
| 9 | Config + Professional | 10 | Config (3) + Professional (7) |
| 10 | Review, Exercises & Capstone | — | Exercise pages, search polish, final pass |

Full topic list: [`ROADMAP.md`](./ROADMAP.md). Machine-readable version: `src/lib/registry.ts`.

**Content progress: 54 / 64 topics published** (Levels 1-3: 30/30 · React 7/7 · Node/Express 6/6 · Next.js 5/5 · API typing 6/6 · Config 0/3 · Professional 0/7).

---

## Next Topic

**Phase 9 — Config + Professional.** Ten topics (Level 5: 3, Level 6: 7), in registry order. **Split into 9a (config) and 9b (professional)
if it runs long** — they are independent, and 9a needs tooling work first.

**9a — TypeScript Configuration**
1. `tsconfig-essentials` — `target`, `module`, `moduleResolution` (`bundler` vs `node16`/`nodenext`), `lib`, `jsx`, `include` / `exclude`, `noEmit`; walk through THIS repo's `tsconfig.json`
2. `strictness-flags` — what `strict` turns on (`noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `useUnknownInCatchVariables`, `alwaysStrict`, `noImplicitThis`), plus `noUncheckedIndexedAccess`, `noUnusedLocals` / `noUnusedParameters`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, and **`exactOptionalPropertyTypes`** (promised since decision #6 — finally explain why it is off here); adopting strictness incrementally
3. `paths-and-output` — `baseUrl`, `paths`, `esModuleInterop`, `allowJs` / `checkJs`, `sourceMap`, `declaration`, `isolatedModules`, `skipLibCheck`, `resolveJsonModule`

**9b — Professional TypeScript**
4. `interface-vs-type` (a decision rule; settle the question `type-aliases-and-interfaces` deferred) · 5. `avoiding-any` · 6. `designing-types` ·
7. `reading-complex-types` · 8. `compiler-errors` · 9. `migrating-js-to-ts` · 10. `anti-patterns`

**TOOLING TO BUILD FIRST (9a):** the strictness topics need blocks compiled WITH A FLAG ON and then OFF (e.g. `exactOptionalPropertyTypes`,
`strictNullChecks: false`). The gate currently uses one fixed option set. Add per-block options via leading directive comments, as TypeScript's own
test harness does (`// @exactOptionalPropertyTypes: true`), grouping blocks by distinct option set into one `tsc` run each; unknown directives must
fail loudly. Cover it with a mutation test like the others. Verify every config claim by running `tsc` with that exact option, and use
`tsc --showConfig` / `tsc --help --all` against the installed TypeScript 5.9.3 rather than memory. ```jsonc fences are not compiled — back each
config claim with a compiled demonstration. Mark any `exactOptionalPropertyTypes` demo clearly: it is OFF in this repo.

**Process per topic:** write `src/content/<slug>.mdx`, `npm run check:content -- <slug>`, publish at the end of the phase, then `typecheck` /
`lint` / `check:content` / `build` / `check:pages`, update docs (README, ROADMAP, this file), commit.

### Later phases at a glance

| Phase | Topics |
| ----- | ------ |
| 10 Review & Capstone | Consolidated exercises (all Practice sections, graded), a capstone project, search polish, final consistency pass (topic order, forward references, README) |

### Open forward references

`type-aliases-and-interfaces` → *interface vs type in Practice* · `nextjs-config` (tsconfig pieces) → *tsconfig Essentials* ·
`strictness-flags` must explain `exactOptionalPropertyTypes` (decision #6) · `database-models` / `typing-api-responses` mention OpenAPI
generators and tRPC lightly — `migrating-js-to-ts` and `designing-types` may point back.

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

25. **Skipped snippets are rare, visible and explained.** *(Phase 7)* Six blocks carry `{/* check:skip */}`: two `.d.ts` script files
    (cannot be modules), three using Next-generated globals (`PageProps`, `LayoutProps`, `RouteContext`) and one using `typedRoutes`
    types. Each has its reason in the prose. Prefer an explicit-type version that IS compiled alongside (done for `params`).

26. **Verify framework behaviour against the installed package, then probe.** *(Phase 7)* Read `node_modules/next/dist/docs/` before writing
    (AGENTS.md), then test the surprising claims. This caught a wrong claim about `useActionState` inference and a two-errors-in-one-literal
    assumption (TypeScript reports only the first error per assignment).

27. **Generics in return position only are claims.** *(Phase 8)* `getJson<T>(url): Promise<T>` cannot be checked because `T` is unrelated to any
    argument. The house rule taught in `generic-api-client`: tie `T` to a runtime parser (`parse: (data: unknown) => T`) or derive it from a
    schema (`z.output<S>`), so the type is inferred and cannot be wrong.

28. **Wire types and domain types are separate, mapped once at the edge.** *(Phase 8)* Wire types mirror the payload (snake_case, ISO-string dates,
    `null`s); domain types are what the app wants (camelCase, `Date`, `undefined`). Optional (`?`) means the key may be missing; nullable (`| null`)
    means present but empty; the two are never interchangeable.

29. **Error values over error strings.** *(Phase 8)* One `ApiError` discriminated union carries every failure (network, HTTP, validation, malformed
    body); handled with exhaustive `switch` + `assertNever`; error bodies are parsed from `unknown` and unknown codes degrade to `unexpected`.

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
│   ├── content/                 # 54 MDX topics — one file per registry slug
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

Phase 8 — Real-World API Typing (6 topics).

**Verification (all green):** `typecheck` · `lint` · `check:content` -> 54 topics · 394 blocks · 6 skipped · 133/133 claimed errors real · 0 problems ·
`build` -> 58 static pages · `check:pages` -> all 54 pages OK. No React in this phase, so no hooks-lint pass was needed.

**Probes:** contract/pagination types asserted exactly; Zod behaviour and `iterateAll` / `withQuery` executed. **Corrections before publishing:** an assertion
inside the error-body parser replaced by a real guard; the covariance sentence made precise.

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

1. Run the site (`npm run dev`) and read `unknown-at-the-boundary`, `api-contract-modelling` and `api-error-modelling` — the three that tie Levels 3-6 together.
2. **Attempt the Practice sections** (the `call` / contract ones are the hardest) and share them; I will review before showing solutions.
3. Run the checks yourself: `npm run typecheck && npm run lint && npm run check:content && npm run build`.
4. Push when ready: `git push -u origin main` (nothing has been pushed; 10 commits since the baseline).
5. Say **"start Phase 9"** for Config + Professional (I will build the per-block compiler-options tooling first).

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
| 2026-10-17 | 7 | 5 Next.js topics; bundled Next 16.3.1 docs read first; useActionState inference corrected by probe; React-hooks lint pass. |
| 2026-10-17 | 8 | 6 API-typing topics; contract + pagination types asserted with Equal probes; Zod, query-builder and async-generator behaviour executed; one assertion replaced by a real guard. |
