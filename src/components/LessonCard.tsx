import { Link } from "react-router-dom";
import { ArrowUpRight, BookMarked, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { useProgress } from "@/engine/progress";
import { useBookmarks } from "@/engine/bookmarks";
import { useI18n, useFormatMinutes } from "@/engine/i18n";
import { useLocalize } from "@/engine/localize";
import { courseTheme } from "@/engine/courseTheme";
import type { FlatLesson } from "@/engine/content";

export function LessonCard({ entry }: { entry: FlatLesson }) {
  const { isCompleted } = useProgress();
  const { isBookmarked } = useBookmarks();
  const { t } = useI18n();
  const loc = useLocalize();
  const formatMinutes = useFormatMinutes();
  const done = isCompleted(entry.id);
  const marked = isBookmarked(entry.id);
  const course = loc.course(entry.course);
  const lesson = loc.lesson(entry.course.id, entry.lesson);
  const { hue } = courseTheme(entry.course.id);

  return (
    <Link
      to={`/courses/${entry.course.id}/${entry.lesson.slug}`}
      className="group block h-full rounded-2xl"
    >
      <Card interactive className="relative flex h-full flex-col overflow-hidden p-5">
        {/* Course identity stripe — supports recognition, never carries meaning alone */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] opacity-70 transition-opacity duration-base ease-out group-hover:opacity-100"
          style={{ backgroundColor: `hsl(${hue} 62% 45%)` }}
        />

        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
          <Badge>{course.title}</Badge>
          <DifficultyBadge level={entry.lesson.difficulty} />

          <span className="ml-auto flex shrink-0 items-center gap-1.5">
            {marked && (
              <BookMarked
                className="h-4 w-4 text-accent"
                aria-label={t("lesson.bookmarked")}
              />
            )}
            {done && (
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white"
                aria-label={t("lesson.completed")}
              >
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              </span>
            )}
          </span>
        </div>

        <h3
          className={cn(
            "font-semibold leading-snug tracking-tight",
            "transition-colors duration-fast ease-out group-hover:text-accent"
          )}
        >
          {lesson.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {lesson.description}
        </p>

        <div className="mt-4 flex items-center gap-1.5 pt-1 text-xs text-ink-faint">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="tabular">
            {formatMinutes(entry.minutes)} {t("unit.read")}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className={cn(
              "ml-auto h-4 w-4 text-ink-faint",
              "transition-[transform,color] duration-base ease-out",
              "group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            )}
          />
        </div>
      </Card>
    </Link>
  );
}
