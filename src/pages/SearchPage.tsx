import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { search } from "@/engine/search";
import { useI18n } from "@/engine/i18n";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setParams(query ? { q: query } : {}, { replace: true });
    }, 250);
    return () => clearTimeout(t);
  }, [query, setParams]);

  const hits = useMemo(() => search(query), [query]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{t("search.title")}</h1>
      <p className="mt-2 text-ink-soft">{t("search.subtitle")}</p>

      <div className="relative mt-6">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="h-13 w-full rounded-2xl border border-line bg-surface-raised py-3.5 pl-12 pr-4 text-base shadow-sm outline-none transition-shadow placeholder:text-ink-faint focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="mt-8 space-y-3">
        {query.trim().length >= 2 && hits.length === 0 && (
          <p className="py-10 text-center text-ink-soft">
            {t("search.noResults", { query })}
          </p>
        )}
        {hits.map(({ entry, snippet }) => (
          <Link
            key={entry.id}
            to={`/courses/${entry.course.id}/${entry.lesson.slug}`}
            className="block"
          >
            <Card className="group p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{entry.course.title}</Badge>
                <DifficultyBadge level={entry.lesson.difficulty} />
              </div>
              <h3 className="mt-2 font-semibold tracking-tight group-hover:text-accent">
                {entry.lesson.title}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                {snippet ?? entry.lesson.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
