import { Link } from "react-router-dom";
import { BookMarked, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { useProgress } from "@/engine/progress";
import { useBookmarks } from "@/engine/bookmarks";
import { useI18n, useFormatMinutes } from "@/engine/i18n";
import type { FlatLesson } from "@/engine/content";

export function LessonCard({ entry }: { entry: FlatLesson }) {
  const { isCompleted } = useProgress();
  const { isBookmarked } = useBookmarks();
  const { t } = useI18n();
  const formatMinutes = useFormatMinutes();
  const done = isCompleted(entry.id);
  const marked = isBookmarked(entry.id);

  return (
    <Link to={`/courses/${entry.course.id}/${entry.lesson.slug}`}>
      <Card className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="mb-2 flex items-center gap-2">
          <Badge>{entry.course.title}</Badge>
          <DifficultyBadge level={entry.lesson.difficulty} />
          <span className="ml-auto flex items-center gap-2 text-ink-faint">
            {marked && <BookMarked className="h-4 w-4 text-accent" />}
            {done && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          </span>
        </div>
        <h3 className="font-semibold leading-snug tracking-tight group-hover:text-accent">
          {entry.lesson.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">
          {entry.lesson.description}
        </p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-faint">
          <Clock className="h-3.5 w-3.5" />
          {formatMinutes(entry.minutes)} {t("unit.read")}
        </p>
      </Card>
    </Link>
  );
}
