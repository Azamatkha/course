import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search as SearchIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { glossary } from "@/data/glossary";

export function GlossaryPage() {
  const [filter, setFilter] = useState("");

  const terms = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
    if (!q) return sorted;
    return sorted.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [filter]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Glossary</h1>
      <p className="mt-2 text-ink-soft">
        {glossary.length} core backend-engineering terms, each linked to the
        lesson that covers it in depth.
      </p>

      <div className="relative mt-6">
        <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter terms…"
          className="w-full rounded-xl border border-line bg-surface-raised py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="mt-8 space-y-3">
        {terms.map((t) => (
          <Card key={t.term} className="p-5">
            <h2 className="font-mono text-sm font-semibold text-accent">
              {t.term}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {t.definition}
            </p>
            {t.lesson && (
              <Link
                to={`/courses/${t.lesson}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                Read the lesson <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </Card>
        ))}
        {terms.length === 0 && (
          <p className="py-10 text-center text-ink-soft">
            No terms match “{filter}”.
          </p>
        )}
      </div>
    </div>
  );
}
