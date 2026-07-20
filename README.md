# PyForge — Advanced Python Backend Engineering

A complete, **frontend-only** learning platform for becoming an advanced Python backend
engineer. Three book-quality courses — Python internals, Django, and FastAPI — with deep
written lessons, Mermaid diagrams, annotated code, interview questions, exercises, and
quizzes. No backend, no database, no accounts: all content ships statically and all
progress lives in your browser's localStorage.

## Features

- **24 in-depth chapters** across 3 courses (Python · Django · FastAPI), each with
  objectives, prerequisites, deep theory, diagrams, line-by-line code, common mistakes,
  best practices, performance & memory notes, production tips, interview questions,
  summary, tiered exercises (easy → hard, debugging, refactoring, mini project), and a
  quiz with answers.
- **Progress tracking** — completed lessons, per-course percentage, daily streak (localStorage).
- **Bookmarks**, **full-text search** (titles, tags, headings, body — `Ctrl/⌘+K`),
  **glossary** of 30+ terms linked to lessons.
- **Reading experience** — table of contents with scroll-spy, reading progress bar,
  estimated reading time, syntax-highlighted code blocks with copy buttons, Mermaid
  diagrams, prev/next navigation.
- **Dark / light theme** with persistence and no flash-of-wrong-theme.
- Responsive, minimal, Apple-ish design. Framer Motion micro-animations.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · react-markdown
(remark-gfm, rehype-slug, rehype-raw) · react-syntax-highlighter (Prism) · Mermaid ·
Framer Motion · Lucide icons. No state library — a tiny `useSyncExternalStore` engine
over localStorage.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks then builds to dist/
npm run preview    # serve the production build locally
```

## Deploying to Vercel

Zero configuration needed — import the repo and deploy. `vercel.json` contains the SPA
rewrite so deep links (e.g. `/courses/python/decorators`) resolve. Any static host works:
serve `dist/` with all routes falling back to `index.html`.

## Project structure

```
src/
├── engine/            # the platform "backend", all client-side
│   ├── content.ts     # loads markdown via import.meta.glob, flattens curriculum
│   ├── courses/       # course manifests (sections, lessons, metadata)
│   ├── search.ts      # in-memory full-text index + scoring
│   ├── progress.ts    # completion + streak store (localStorage)
│   ├── bookmarks.ts   # bookmark store
│   └── theme.tsx      # dark/light theme provider
├── content/           # the actual lessons — one .md file per lesson
│   ├── python/  (12)
│   ├── django/  (6)
│   └── fastapi/ (6)
├── components/        # Markdown renderer, CodeBlock, Mermaid, TOC, layout, ui/
├── pages/             # Home, Courses, Course, Lesson, Progress, Bookmarks,
│                      # Search, Glossary, About, 404
└── data/glossary.ts
```

## Adding a lesson

1. Write `src/content/<course>/<slug>.md`.
2. Add its metadata (slug, title, description, difficulty, tags) to the right section in
   `src/engine/courses/<course>.ts`.

That's it — routing, search indexing, reading time, TOC, and progress tracking pick it
up automatically.
