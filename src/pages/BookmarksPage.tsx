import { BookMarked } from "lucide-react";
import { LessonCard } from "@/components/LessonCard";
import { allLessons } from "@/engine/content";
import { useBookmarks } from "@/engine/bookmarks";
import { useI18n } from "@/engine/i18n";

export function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  const { t } = useI18n();
  const lessons = allLessons();
  const entries = bookmarks
    .map((id) => lessons.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{t("bookmarks.title")}</h1>
      <p className="mt-2 text-ink-soft">{t("bookmarks.subtitle")}</p>

      {entries.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <BookMarked className="h-10 w-10 text-ink-faint" />
          <p className="mt-4 font-medium">{t("bookmarks.empty")}</p>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">
            {t("bookmarks.emptyHint")}
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
