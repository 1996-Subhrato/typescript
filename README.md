# TypeScript Reference

A concise, code-first TypeScript documentation site — built as the vehicle for
learning TypeScript itself.

Two things are happening at once:

1. **The content** is a personal TypeScript quick-reference, written for someone who
   already knows JavaScript, React and Node, and is now working in a TypeScript
   codebase professionally.
2. **The site** is a strict TypeScript + Next.js application, so building it is the
   practice. Concepts are applied in the codebase before or alongside being documented.

This is a learning project, not a production documentation platform. Content quality
and correctness matter more than visual design.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 (strict+) · Tailwind CSS 4 ·
MDX via `@next/mdx` · Shiki syntax highlighting via `rehype-pretty-code`.

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

Other commands:

```bash
npm run build
```

```bash
npx tsc --noEmit
```

```bash
npm run check:content
```

`check:content` is the content quality gate: it compiles every `ts` code block in
`src/content/*.mdx` under the project's strict flags. A line that is meant to fail
carries a trailing `// Error` comment; the gate fails if a real compiler error is not
claimed, or a claimed error does not exist. Pass slugs to check only some topics:
`npm run check:content -- narrowing`.

## How the site is organised

```text
src/
├── app/                     # Routes only, kept thin
│   ├── page.tsx             # Roadmap index
│   └── docs/[slug]/page.tsx # Renders one MDX topic
├── components/              # UI (from Phase 1)
├── content/                 # MDX lesson bodies, one file per topic slug
├── lib/
│   ├── registry.ts          # Source of truth: levels, topics, learning order
│   └── docs.ts              # Derived helpers over the registry
├── types/docs.ts            # Navigation model types
└── mdx-components.tsx       # Global MDX component overrides
scripts/
└── check-content.mts        # Compiles the code blocks in every topic
```

**Content is separated from UI.** `src/lib/registry.ts` declares *what topics exist and
in what order*; `src/content/*.mdx` holds the prose; `src/app` and `src/components`
only render. Adding a topic means adding an MDX file and flipping its registry entry
from `"planned"` to `"published"`.

**Layering rule:** `app/` → `lib/` → `types/`, never the reverse.

## Writing conventions for topic pages

Short, practical, code-focused, scannable. A typical page covers *what* it is, *why*
it exists, syntax, a realistic example, real-world usage, a common mistake, and a
practice exercise — but only the sections that earn their place.

Examples use realistic domains (users, products, orders, API responses, auth, forms,
controllers, components), never `let x: string = "hello"`.

## Project rules

- Everything is `.ts` / `.tsx`. No JavaScript source files.
- No `any`. If a value's type is genuinely unknown, use `unknown` and narrow it.
- Strictness is never relaxed to silence an error — the error gets understood and fixed.

## Progress

Development runs in phases. Current state, decisions, blockers and the exact next task
live in [`LEARNING_PROGRESS.md`](./LEARNING_PROGRESS.md) — **read that first** when
resuming work.

The full topic list is in [`ROADMAP.md`](./ROADMAP.md).
