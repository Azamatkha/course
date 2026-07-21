import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/engine/i18n";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Slug algorithm compatible with rehype-slug (github-slugger, simplified). */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Map<string, number>();
  let inCode = false;
  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = /^(##|###)\s+(.+)$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/`/g, "").trim();
    let id = slugify(text);
    const n = seen.get(id) ?? 0;
    seen.set(id, n + 1);
    if (n > 0) id = `${id}-${n}`;
    items.push({ id, text, level: m[1] === "##" ? 2 : 3 });
  }
  return items;
}

export function TableOfContents({ markdown }: { markdown: string }) {
  const items = useMemo(() => extractToc(markdown), [markdown]);
  const [active, setActive] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={t("lesson.onThisPage")} className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {t("lesson.onThisPage")}
      </p>
      <ul className="space-y-1 border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block border-l-2 py-1 pr-2 transition-colors",
                item.level === 2 ? "pl-3" : "pl-6 text-[0.8rem]",
                active === item.id
                  ? "-ml-px border-accent font-medium text-accent"
                  : "-ml-px border-transparent text-ink-soft hover:text-ink"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
