import type { DocLevel } from "@/types/docs";

/**
 * The single source of truth for site navigation and learning order.
 *
 * Two TypeScript features are doing real work on the last line of this array:
 *
 *   `as const`   freezes every string to its *literal* type ("what-is-typescript"
 *                instead of the wider `string`) and makes every array readonly.
 *   `satisfies`  checks the value against `readonly DocLevel[]` WITHOUT widening
 *                it to that type. A plain `: readonly DocLevel[]` annotation
 *                would type-check just as well but would throw the literals
 *                away, and `TopicSlug` below would collapse to `string`.
 *
 * The payoff: a typo in any topic link becomes a compile error.
 */
export const levels = [
  {
    id: "fundamentals",
    title: "TypeScript Fundamentals",
    summary: "The type system you need before anything else makes sense.",
    difficulty: "beginner",
    topics: [
      { slug: "what-is-typescript", title: "What TypeScript Is", summary: "How TS relates to JS, and what actually runs in production.", status: "published" },
      { slug: "annotations-and-inference", title: "Annotations & Inference", summary: "When to write a type and when to let TypeScript work it out.", status: "published" },
      { slug: "primitive-types", title: "Primitive Types", summary: "string, number, boolean, and the ones that surprise JS developers.", status: "published" },
      { slug: "arrays-and-tuples", title: "Arrays & Tuples", summary: "Typed lists, and fixed-length positional data.", status: "published" },
      { slug: "object-types", title: "Object Types", summary: "Object shapes, optional properties, readonly properties.", status: "published" },
      { slug: "functions", title: "Functions", summary: "Parameter types, return types, optional, default and rest params.", status: "published" },
      { slug: "type-aliases-and-interfaces", title: "Type Aliases & Interfaces", summary: "Two ways to name a shape, and which to reach for.", status: "published" },
      { slug: "unions-and-literals", title: "Unions, Literals & Intersections", summary: "Modelling one-of and all-of values.", status: "published" },
      { slug: "narrowing", title: "Narrowing", summary: "typeof, in, instanceof, equality and control-flow analysis.", status: "published" },
      { slug: "null-and-undefined", title: "null and undefined", summary: "strictNullChecks, optional chaining, nullish coalescing.", status: "published" },
      { slug: "any-unknown-never-void", title: "any, unknown, never, void", summary: "The four special types, and when each is the right answer.", status: "published" },
    ],
  },
  {
    id: "practical",
    title: "Practical TypeScript",
    summary: "The features you hit in week one of a real TypeScript codebase.",
    difficulty: "intermediate",
    topics: [
      { slug: "enums-and-as-const", title: "Enums and as const", summary: "Named constant sets, and why as const often wins.", status: "published" },
      { slug: "type-assertions", title: "Type Assertions", summary: "as, the non-null !, and the risk you take with both.", status: "published" },
      { slug: "discriminated-unions", title: "Discriminated Unions", summary: "The single most useful modelling pattern in TypeScript.", status: "published" },
      { slug: "type-guards", title: "Type Guards and Predicates", summary: "Custom x is T functions and exhaustiveness checks.", status: "published" },
      { slug: "function-overloads", title: "Function Overloads", summary: "Multiple call signatures, and the usual better alternative.", status: "published" },
      { slug: "classes", title: "Classes", summary: "public/private/protected, readonly, getters, setters, statics.", status: "published" },
      { slug: "abstract-and-interfaces", title: "Abstract Classes and implements", summary: "Extending, implementing, and preferring composition.", status: "published" },
      { slug: "generics-basics", title: "Generics: The Basics", summary: "Generic functions, interfaces and type aliases.", status: "published" },
      { slug: "generic-constraints", title: "Constraints, keyof and Indexed Access", summary: "extends, keyof, typeof, T[K] and generic defaults.", status: "published" },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Types",
    summary: "Type-level programming: transforming types instead of values.",
    difficulty: "advanced",
    topics: [
      { slug: "utility-types-objects", title: "Utility Types: Objects", summary: "Partial, Required, Readonly, Pick, Omit, Record.", status: "planned" },
      { slug: "utility-types-unions", title: "Utility Types: Unions and Functions", summary: "Exclude, Extract, NonNullable, ReturnType, Parameters, InstanceType.", status: "planned" },
      { slug: "conditional-types", title: "Conditional Types and infer", summary: "Types that branch, and pulling types out of other types.", status: "planned" },
      { slug: "mapped-types", title: "Mapped Types and Key Remapping", summary: "Building a new object type from an existing one.", status: "planned" },
      { slug: "template-literal-types", title: "Template Literal Types", summary: "String manipulation at the type level.", status: "planned" },
      { slug: "recursive-types", title: "Recursive Types", summary: "JSON, deep partials, nested key paths.", status: "planned" },
      { slug: "structural-typing", title: "Structural Typing and Compatibility", summary: "Why shape beats name, plus variance basics.", status: "planned" },
      { slug: "branded-types", title: "Branded Types", summary: "Making UserId and OrderId incompatible on purpose.", status: "planned" },
      { slug: "result-types", title: "Result and Error Types", summary: "Modelling failure in the type system instead of throwing.", status: "planned" },
      { slug: "declaration-files", title: "Declaration Files and Augmentation", summary: "d.ts, declare, declaration merging, typing third-party libs.", status: "planned" },
    ],
  },
  {
    id: "react",
    title: "React + TypeScript",
    summary: "Typing components, hooks, events and forms.",
    difficulty: "intermediate",
    topics: [
      { slug: "react-props", title: "Component Props", summary: "Typing props, children, and reusable prop contracts.", status: "planned" },
      { slug: "react-state", title: "useState and useReducer", summary: "Inferred state, explicit state, and typed reducers.", status: "planned" },
      { slug: "react-refs-context", title: "useRef and useContext", summary: "DOM refs, mutable refs, and context without null checks everywhere.", status: "planned" },
      { slug: "react-events-forms", title: "Events and Forms", summary: "The event types you actually need, and typed form handling.", status: "planned" },
      { slug: "react-custom-hooks", title: "Custom Hooks", summary: "Return-type design, tuples vs objects, generic hooks.", status: "planned" },
      { slug: "react-generic-components", title: "Generic Components", summary: "Typed lists, tables and selects that keep their item type.", status: "planned" },
      { slug: "react-async-data", title: "Async Data in Components", summary: "Loading/error/success as a discriminated union.", status: "planned" },
    ],
  },
  {
    id: "node",
    title: "Node.js + Express",
    summary: "Typing a backend end to end.",
    difficulty: "intermediate",
    topics: [
      { slug: "express-request-response", title: "Request and Response Typing", summary: "Typed params, body, query and response payloads.", status: "planned" },
      { slug: "express-middleware", title: "Middleware and Error Handling", summary: "Typed middleware, augmenting Request, error middleware.", status: "planned" },
      { slug: "express-layers", title: "Controllers, Services, Repositories", summary: "Where types belong in a layered backend.", status: "planned" },
      { slug: "dtos-and-validation", title: "DTOs and Runtime Validation", summary: "Why a type is not a check, and how to bridge the gap.", status: "planned" },
      { slug: "env-and-config", title: "Environment and Config", summary: "Type-safe env vars that fail loudly at boot.", status: "planned" },
      { slug: "database-models", title: "Database Models", summary: "Row types, insert types, and keeping them in sync.", status: "planned" },
    ],
  },
  {
    id: "nextjs",
    title: "Next.js + TypeScript",
    summary: "App Router typing, using this very site as the example.",
    difficulty: "intermediate",
    topics: [
      { slug: "nextjs-pages-layouts", title: "Pages, Layouts and Route Params", summary: "PageProps, LayoutProps, and async params.", status: "planned" },
      { slug: "nextjs-server-client", title: "Server and Client Components", summary: "What crosses the boundary, and what the types enforce.", status: "planned" },
      { slug: "nextjs-route-handlers", title: "Route Handlers", summary: "Typed API endpoints in the App Router.", status: "planned" },
      { slug: "nextjs-server-actions", title: "Server Actions and Forms", summary: "Typed mutations and form state.", status: "planned" },
      { slug: "nextjs-config", title: "Typed Configuration", summary: "next.config.ts, metadata, and generated route types.", status: "planned" },
    ],
  },
  {
    id: "api",
    title: "Real-World API Typing",
    summary: "The patterns that stop bad data from becoming runtime bugs.",
    difficulty: "advanced",
    topics: [
      { slug: "typing-api-responses", title: "Typing API Responses", summary: "Nested objects, arrays, optional and nullable fields.", status: "planned" },
      { slug: "generic-api-client", title: "A Generic API Client", summary: "One typed fetch wrapper for a whole application.", status: "planned" },
      { slug: "pagination-and-envelopes", title: "Pagination and Response Envelopes", summary: "Generic wrappers for paged and wrapped payloads.", status: "planned" },
      { slug: "unknown-at-the-boundary", title: "unknown at the Boundary", summary: "Treating every network response as untrusted, then narrowing.", status: "planned" },
      { slug: "api-contract-modelling", title: "Modelling an API Contract", summary: "Shared request/response types between client and server.", status: "planned" },
      { slug: "api-error-modelling", title: "Error Modelling", summary: "Typed error responses that callers must handle.", status: "planned" },
    ],
  },
  {
    id: "config",
    title: "TypeScript Configuration",
    summary: "Only the tsconfig options that change how you write code.",
    difficulty: "intermediate",
    topics: [
      { slug: "tsconfig-essentials", title: "tsconfig Essentials", summary: "target, module, moduleResolution, lib, include/exclude.", status: "planned" },
      { slug: "strictness-flags", title: "Strictness Flags", summary: "What strict turns on, plus noUncheckedIndexedAccess and friends.", status: "planned" },
      { slug: "paths-and-output", title: "Paths, Interop and Output", summary: "baseUrl, paths, esModuleInterop, source maps, declarations.", status: "planned" },
    ],
  },
  {
    id: "professional",
    title: "Professional TypeScript",
    summary: "Judgement calls: what experienced TypeScript developers do differently.",
    difficulty: "advanced",
    topics: [
      { slug: "interface-vs-type", title: "interface vs type in Practice", summary: "A decision rule, not a debate.", status: "planned" },
      { slug: "avoiding-any", title: "Avoiding any", summary: "The escape hatches that are fine, and the ones that rot a codebase.", status: "planned" },
      { slug: "designing-types", title: "Designing Reusable Types", summary: "Composition, and knowing when to stop being clever.", status: "planned" },
      { slug: "reading-complex-types", title: "Reading Complex Types", summary: "A method for decoding types someone else wrote.", status: "planned" },
      { slug: "compiler-errors", title: "Understanding Compiler Errors", summary: "Reading long errors from the inside out.", status: "planned" },
      { slug: "migrating-js-to-ts", title: "Migrating JavaScript to TypeScript", summary: "An incremental strategy that does not stall.", status: "planned" },
      { slug: "anti-patterns", title: "Anti-Patterns", summary: "Common TypeScript mistakes worth unlearning early.", status: "planned" },
    ],
  },
] as const satisfies readonly DocLevel[];

/**
 * Every slug in the registry, as a union of string literals.
 *
 * Read it inside out:
 *   typeof levels               the frozen array's type
 *   [number]                    indexed access -> any element (a level)
 *   ["topics"][number]["slug"]  -> any topic's slug
 *
 * Because of `as const` this is "what-is-typescript" | "narrowing" | ... , not `string`.
 */
export type TopicSlug = (typeof levels)[number]["topics"][number]["slug"];
