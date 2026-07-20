import { BookMarked } from "lucide-react";
import { LessonCard } from "@/components/LessonCard";
import { allLessons } from "@/engine/content";
import { useBookmarks } from "@/engine/bookmarks";

export function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  const lessons = allLessons();
  const entries = bookmarks
    .map((id) => lessons.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Bookmarks</h1>
      <p className="mt-2 text-ink-soft">
        Lessons you saved to revisit. Stored locally in this browser.
      </p>

      {entries.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <BookMarked className="h-10 w-10 text-ink-faint" />
          <p className="mt-4 font-medium">No bookmarks yet</p>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">
            Use the “Bookmark” button at the top of any lesson to save it here.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <LessonCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
