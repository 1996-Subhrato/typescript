# TypeScript Reference

A concise, code-first TypeScript documentation site for JavaScript developers, built
with strict TypeScript and Next.js. Building the site is the practice; the site is the
reference.

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript 5.9 strict](https://img.shields.io/badge/TypeScript-5.9%20strict-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)

## Overview

Most TypeScript material either re-teaches programming or buries the useful part in
theory. This project assumes you already write JavaScript, React and Node, and teaches
TypeScript the way it is used in professional codebases: short pages, realistic
examples (users, orders, API responses, forms, services), JavaScript → TypeScript
comparisons, common mistakes, and a practice exercise.

Two things happen at once:

1. **The content** is a quick-reference you can revisit mid-task.
2. **The site** is itself a strict TypeScript + Next.js application, so the concepts are
   applied in real code (server/client components, recursive types, generics,
   type-level utilities) rather than only described.

> This is a learning project, not a production documentation platform. Content
> correctness matters more than visual polish.

## Curriculum

64 topics in nine levels, ordered so nothing depends on a concept taught later. The
full list is in [`ROADMAP.md`](./ROADMAP.md).

| Level | Topics | Status |
| ----- | :----: | ------ |
| TypeScript Fundamentals | 11 | ✅ Complete |
| Practical TypeScript | 9 | ✅ Complete |
| Advanced Types | 10 | ✅ Complete |
| React + TypeScript | 7 | ⏳ Next |
| Node.js + Express | 6 | Planned |
| Next.js + TypeScript | 5 | Planned |
| Real-World API Typing | 6 | Planned |
| TypeScript Configuration | 3 | Planned |
| Professional TypeScript | 7 | Planned |

**30 of 64 topics published.** Unwritten topics appear greyed out in the sidebar so the
whole path is visible up front.

## Features

- **Registry-driven navigation**: one typed source of truth for levels, order and status
- **Sidebar** with active-link highlighting, and a **mobile drawer**
- **Search palette** (`Ctrl/Cmd + K`) over topic titles and summaries
- **Table of contents** generated from each page's headings
- **Previous / next** navigation across the whole learning sequence
- **Syntax highlighting** via Shiki with light and dark themes, plus a **copy button**
- **Static generation**: every published topic is prerendered
- **Verified code samples**: every `ts` block in the docs is compiled by a quality gate
  (see [Quality checks](#quality-checks))

## Tech stack

| Concern | Choice |
| ------- | ------ |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript 5.9, strict, no `any` |
| Content | MDX via `@next/mdx`, `remark-gfm`, `rehype-slug` |
| Highlighting | Shiki via `rehype-pretty-code` |

## Getting started

**Prerequisites:** Node.js 20.9 or later (developed on Node 24) and npm.

```bash
git clone <repository-url>
cd <repository-folder>
npm install
npm run dev
```

Then open <http://localhost:3000>.

### Scripts

| Command | What it does |
| ------- | ------------ |
| `npm run dev` | Start the development server |
| `npm run build` | Production build (type-checks and prerenders every topic) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Generate Next's route types, then run `tsc --noEmit` |
| `npm run check:content` | Compile every code sample in the docs |

> **Why `typecheck` and not plain `tsc`?** `PageProps` and `LayoutProps` are global
> types that Next.js *generates* from the folder structure. On a fresh clone a bare
> `tsc --noEmit` fails until they exist; `npm run typecheck` creates them first.

## Quality checks

Before a change is considered done, all of these pass:

```bash
npm run typecheck
npm run lint
npm run check:content
npm run build
```

### Content quality gate

`npm run check:content` extracts every `ts` and `tsx` fence from `src/content/*.mdx`,
compiles each as an isolated module under the project's strict flags, lints the prose for
MDX hazards (a stray `{` or `<Tag` outside code crashes rendering), and enforces two rules:

- A line that is **meant to fail** carries a trailing `// Error: ...` comment.
- Every real compiler error must be claimed, and every claim must be a real error.

So the documentation cannot show an error that does not happen, or hide one that does.
To check selected topics only: `npm run check:content -- narrowing`. A snippet that genuinely
cannot compile standalone can be preceded by a `{/* check:skip */}` line; skips are counted and
printed. With a dev server running, `npm run check:pages` smoke-tests every rendered page.

## Project structure

```text
src/
├── app/
│   ├── layout.tsx               # Root layout, fonts, metadata, header
│   ├── page.tsx                 # Roadmap index with progress
│   ├── globals.css              # Prose and code-block styling
│   └── docs/
│       ├── layout.tsx           # Sidebar shell for all topic pages
│       └── [slug]/page.tsx      # Renders one MDX topic, TOC, prev/next
├── components/                  # SiteHeader, Sidebar, MobileNav, Search,
│                                # TableOfContents, PrevNextNav, CodeBlock
├── content/                     # One .mdx file per topic slug
├── lib/
│   ├── registry.ts              # Source of truth: levels, topics, order, status
│   ├── docs.ts                  # Derived helpers (safe for client components)
│   └── toc.ts                   # Heading parser (server-only)
├── types/docs.ts                # Navigation model types
└── mdx-components.tsx           # Global MDX overrides
scripts/
└── check-content.mts            # Content quality gate
```

**Content is separate from UI.** The registry decides *what exists and in what order*;
`src/content` holds the prose; `app` and `components` only render. Dependencies flow one
way: `app` → `components` → `lib` → `types`.

## Adding a topic

1. Create `src/content/<slug>.mdx`. The slug must match the registry entry.
2. Run `npm run check:content -- <slug>` and fix anything it reports.
3. In `src/lib/registry.ts`, change that topic's `status` from `"planned"` to
   `"published"`.
4. Run the [quality checks](#quality-checks).

The sidebar, search, table of contents, previous/next links and static generation all
derive from the registry, so nothing else needs editing.

### Writing conventions

- Short, practical, scannable: *what*, *why*, syntax, a realistic example, common
  mistakes, a practice exercise. Only sections that earn their place.
- Realistic domains, never `let x: string = "hello"`.
- Practice exercises never ship with solutions.
- Code blocks must be **self-contained** (declare the types they use) so the quality
  gate can compile them. Use ` ```js ` for JavaScript, which is not compiled.

## Engineering rules

- **Everything is TypeScript.** `.ts` / `.tsx` (or `.mts` for scripts); no JavaScript
  source files.
- **No `any`.** Use `unknown` and narrow.
- **Strictness is never relaxed to silence an error.** The error is understood and fixed.
  The config goes beyond `strict`: `noUncheckedIndexedAccess`, `noImplicitOverride`,
  `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`,
  `verbatimModuleSyntax`.
- **Prove, don't assert.** Prefer narrowing over `as` and `!`.

## Project state

Development is phased. Current phase, architectural
decisions, known issues and the exact next task live in
[`LEARNING_PROGRESS.md`](./LEARNING_PROGRESS.md).
