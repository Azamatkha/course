import { Card } from "@/components/ui/card";

const principles = [
  {
    title: "Depth over coverage",
    body: "Each lesson reads like a chapter of a serious engineering book: internals, tradeoffs, failure modes, and production context — not a syntax cheat sheet.",
  },
  {
    title: "Explain why, not just how",
    body: "Knowing that select_related exists is trivia. Knowing when the ORM emits an extra query per row — and why — is engineering.",
  },
  {
    title: "Interview- and production-ready",
    body: "Every lesson ends with real interview questions and production scenarios, because that is where this knowledge is actually tested.",
  },
  {
    title: "Fully local",
    body: "The whole platform is a static site. Lessons ship as markdown in the bundle; progress and bookmarks live in localStorage. No accounts, no tracking, no server.",
  },
];

export function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">About PyForge</h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        PyForge is a written-first learning platform for engineers who want to
        go from “I can write Python” to “I understand what Python is doing.”
        The curriculum covers three tracks — Python internals, Django, and
        FastAPI — and is aimed at intermediate developers heading toward senior
        backend roles.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {principles.map((p) => (
          <Card key={p.title} className="p-6">
            <h2 className="font-bold tracking-tight">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold tracking-tight">How lessons are structured</h2>
      <p className="mt-3 leading-relaxed text-ink-soft">
        Every lesson follows the same spine: learning objectives and
        prerequisites, deep theory with diagrams, annotated code, common
        mistakes, best practices, performance and memory notes, production
        tips, interview questions, a summary, and a full exercise block —
        easy through hard, debugging, refactoring, a mini project, and a quiz
        with answers.
      </p>

      <h2 className="mt-10 text-xl font-bold tracking-tight">Tech</h2>
      <p className="mt-3 leading-relaxed text-ink-soft">
        Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, React
        Markdown, Prism, and Mermaid. Deploys as a static bundle to any host —
        Vercel works with zero configuration.
      </p>
    </div>
  );
}
