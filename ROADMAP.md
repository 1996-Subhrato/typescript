# Learning Roadmap

64 topics across 9 levels, ordered so that nothing depends on a concept taught later.
The machine-readable version lives in [`src/lib/registry.ts`](./src/lib/registry.ts) and
drives the site's navigation — this file is the human-readable companion.

**Grouping note:** the source syllabus listed ~150 individual keywords. Shipping one
page per keyword would produce a reference nobody reads. Closely related items are
grouped into a single page instead (`typeof` / `in` / `instanceof` / equality /
control-flow analysis all live on **Narrowing**), which keeps each page short enough
to revisit during a workday. Every keyword from the syllabus is covered.

---

## Level 1 — TypeScript Fundamentals · *Phase 2* · 11 topics

The type system you need before anything else makes sense.

1. **What TypeScript Is** — TS vs JS, compile-time erasure, what ships ✅
2. **Annotations & Inference** — when to annotate, when to let inference win ✅
3. **Primitive Types** — `string`, `number`, `boolean`, `bigint`, `symbol`, and the surprises ✅
4. **Arrays & Tuples** — `T[]`, `readonly T[]`, fixed-length positional data ✅
5. **Object Types** — shapes, optional (`?`) and `readonly` properties, excess property checks ✅
6. **Functions** — parameter types, return types, optional, default, rest params ✅
7. **Type Aliases & Interfaces** — both forms, plus `interface` vs `type` ✅
8. **Unions, Literals & Intersections** — `|`, literal types, `&` ✅
9. **Narrowing** — `typeof`, `in`, `instanceof`, equality narrowing, control-flow analysis ✅
10. **null & undefined** — `strictNullChecks`, `?.`, `??` ✅
11. **any, unknown, never, void** — the four special types and when each is correct ✅

## Level 2 — Practical TypeScript · *Phase 3* · 9 topics

The features you hit in week one of a real TypeScript codebase.

1. **Enums & as const** — numeric/string enums, `const` objects, why `as const` usually wins ✅
2. **Type Assertions** — `as`, the non-null `!`, and what you give up ✅
3. **Discriminated Unions** — the most useful modelling pattern in the language ✅
4. **Type Guards & Predicates** — `x is T`, custom guards, exhaustiveness via `never` ✅
5. **Function Overloads** — multiple signatures, and the usual better alternative ✅
6. **Classes** — `public` / `private` / `protected`, `readonly`, getters, setters, statics ✅
7. **Abstract Classes & implements** — `abstract`, `implements`, `extends`, composition ✅
8. **Generics: The Basics** — generic functions, interfaces, type aliases ✅
9. **Constraints, keyof & Indexed Access** — `extends`, `keyof`, `typeof`, `T[K]`, defaults ✅

## Level 3 — Advanced Types · *Phase 4* · 10 topics

Type-level programming: transforming types instead of values.

1. **Utility Types: Objects** — `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record` ✅
2. **Utility Types: Unions & Functions** — `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `ConstructorParameters`, `InstanceType` ✅
3. **Conditional Types & infer** — `T extends U ? X : Y`, distributivity, `infer` ✅
4. **Mapped Types & Key Remapping** — `[K in keyof T]`, modifiers, `as` clauses ✅
5. **Template Literal Types** — string manipulation at the type level ✅
6. **Recursive Types** — JSON, `DeepPartial`, nested key paths ✅
7. **Structural Typing & Compatibility** — shape over name, variance basics ✅
8. **Branded Types** — making `UserId` and `OrderId` incompatible on purpose ✅
9. **Result & Error Types** — modelling failure in types instead of throwing ✅
10. **Declaration Files & Augmentation** — `.d.ts`, `declare`, ambient declarations, declaration merging, module augmentation, typing third-party libraries ✅

## Level 4a — React + TypeScript · *Phase 5* · 7 topics

1. **Component Props** — props, `children`, reusable prop contracts ✅
2. **useState & useReducer** — inferred vs explicit state, typed reducers and actions ✅
3. **useRef & useContext** — DOM refs vs mutable refs, context without null checks everywhere ✅
4. **Events & Forms** — the event types you actually need, typed form handling ✅
5. **Custom Hooks** — return-type design, tuple vs object, generic hooks ✅
6. **Generic Components** — lists, tables and selects that preserve their item type ✅
7. **Async Data in Components** — loading/error/success as a discriminated union ✅

## Level 4b — Node.js + Express · *Phase 6* · 6 topics

1. **Request & Response Typing** — typed params, body, query, response payloads ✅
2. **Middleware & Error Handling** — typed middleware, augmenting `Request`, error middleware ✅
3. **Controllers, Services, Repositories** — where types belong in a layered backend ✅
4. **DTOs & Runtime Validation** — why a type is not a check, and how to bridge the gap ✅
5. **Environment & Config** — type-safe env vars that fail loudly at boot ✅
6. **Database Models** — row types vs insert types, keeping them in sync ✅

## Level 4c — Next.js + TypeScript · *Phase 7* · 5 topics

Taught using this repository as the worked example.

1. **Pages, Layouts & Route Params** — `PageProps`, `LayoutProps`, async `params` ✅
2. **Server & Client Components** — what may cross the boundary, and what types enforce ✅
3. **Route Handlers** — typed API endpoints in the App Router ✅
4. **Server Actions & Forms** — typed mutations and form state ✅
5. **Typed Configuration** — `next.config.ts`, metadata, generated route types ✅

## Level 4d — Real-World API Typing · *Phase 8* · 6 topics

1. **Typing API Responses** — nested objects, arrays, optional vs nullable fields ✅
2. **A Generic API Client** — one typed `fetch` wrapper for a whole application ✅
3. **Pagination & Response Envelopes** — generic wrappers for paged/wrapped payloads ✅
4. **unknown at the Boundary** — treat every response as untrusted, then narrow ✅
5. **Modelling an API Contract** — shared request/response types across client and server ✅
6. **Error Modelling** — typed error responses callers are forced to handle ✅

## Level 5 — TypeScript Configuration · *Phase 9* · 3 topics

Only the options that change how you write code.

1. **tsconfig Essentials** — `target`, `module`, `moduleResolution`, `lib`, `include`/`exclude`
2. **Strictness Flags** — what `strict` turns on, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`
3. **Paths, Interop & Output** — `baseUrl`, `paths`, `esModuleInterop`, `allowJs`, source maps, declaration generation

## Level 6 — Professional TypeScript · *Phase 9* · 7 topics

Judgement calls rather than syntax.

1. **interface vs type in Practice** — a decision rule, not a debate
2. **Avoiding any** — acceptable escape hatches vs the ones that rot a codebase; `unknown` vs `any`
3. **Designing Reusable Types** — composition, and knowing when to stop being clever
4. **Reading Complex Types** — a method for decoding types someone else wrote
5. **Understanding Compiler Errors** — reading long errors from the inside out
6. **Migrating JavaScript to TypeScript** — an incremental strategy that does not stall
7. **Anti-Patterns** — common mistakes worth unlearning early

---

## Why this order

- **Narrowing before discriminated unions.** Discriminated unions are only useful once
  you can narrow; narrowing needs unions and literal types first.
- **Generics before utility types.** `Partial<T>` is unreadable until `T` means something.
- **`keyof` / `typeof` / indexed access before conditional and mapped types.** Every
  advanced type is built from those three.
- **Framework levels after Level 3.** Typing a React or Express codebase pulls in
  generics, unions and utility types constantly — teaching them earlier would mean
  hand-waving.
- **Configuration late.** `tsconfig` flags only make sense once you have felt the errors
  they produce.
- **Professional judgement last.** "When *not* to write a clever type" requires knowing
  how to write one.
