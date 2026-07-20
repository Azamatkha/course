import { allLessons, lessonBody, type FlatLesson } from "./content";

export interface SearchHit {
  entry: FlatLesson;
  score: number;
  /** Short body excerpt around the first match, if any. */
  snippet: string | null;
}

interface IndexEntry {
  entry: FlatLesson;
  title: string;
  description: string;
  tags: string;
  headings: string;
  body: string;
  bodyRaw: string;
}

let index: IndexEntry[] | null = null;

function buildIndex(): IndexEntry[] {
  if (index) return index;
  index = allLessons().map((entry) => {
    const raw = lessonBody(entry.course.id, entry.lesson.slug) ?? "";
    const headings = raw
      .split("\n")
      .filter((l) => l.startsWith("#"))
      .join(" ")
      .toLowerCase();
    return {
      entry,
      title: entry.lesson.title.toLowerCase(),
      description: entry.lesson.description.toLowerCase(),
      tags: entry.lesson.tags.join(" ").toLowerCase(),
      headings,
      body: raw.toLowerCase(),
      bodyRaw: raw,
    };
  });
  return index;
}

function makeSnippet(bodyRaw: string, term: string): string | null {
  const at = bodyRaw.toLowerCase().indexOf(term);
  if (at === -1) return null;
  const start = Math.max(0, at - 60);
  const end = Math.min(bodyRaw.length, at + term.length + 120);
  let text = bodyRaw.slice(start, end).replace(/[#>*`|]/g, " ").replace(/\s+/g, " ").trim();
  if (start > 0) text = "…" + text;
  if (end < bodyRaw.length) text = text + "…";
  return text;
}

export function search(query: string, limit = 20): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const hits: SearchHit[] = [];
  for (const doc of buildIndex()) {
    let score = 0;
    let firstBodyTerm: string | null = null;
    for (const term of terms) {
      let termScore = 0;
      if (doc.title.includes(term)) termScore += 30;
      if (doc.tags.includes(term)) termScore += 18;
      if (doc.description.includes(term)) termScore += 10;
      if (doc.headings.includes(term)) termScore += 8;
      if (doc.body.includes(term)) {
        termScore += 3;
        if (!firstBodyTerm) firstBodyTerm = term;
      }
      if (termScore === 0) {
        score = 0;
        break; // every term must match somewhere
      }
      score += termScore;
    }
    if (score > 0) {
      hits.push({
        entry: doc.entry,
        score,
        snippet: firstBodyTerm ? makeSnippet(doc.bodyRaw, firstBodyTerm) : null,
      });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
