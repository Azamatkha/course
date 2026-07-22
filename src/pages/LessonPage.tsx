import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/ui/badge";
import { Markdown } from "@/components/Markdown";
import { TableOfContents } from "@/components/TableOfContents";
import { ReadingProgress } from "@/components/ReadingProgress";
import { getLesson } from "@/engine/content";
import { recordVisit, useProgress } from "@/engine/progress";
import { useBookmarks } from "@/engine/bookmarks";
import { useI18n, useFormatMinutes } from "@/engine/i18n";
import { useLocalize } from "@/engine/localize";
import { courseTheme } from "@/engine/courseTheme";
import { cn } from "@/lib/utils";
import { NotFound } from "./NotFound";

export function LessonPage() {
  const { courseId = "", slug = "" } = useParams();
  const { t, lang } = useI18n();
  const ref = getLesson(courseId, slug, lang);
  const { isCompleted, toggleCompleted } = useProgress();
  const { isBookmarked, toggle } = useBookmarks();
  const loc = useLocalize();
  const formatMinutes = useFormatMinutes();
  const reduce = useReducedMotion();

  const lessonId = `${courseId}/${slug}`;

  const exists = Boolean(ref);
  useEffect(() => {
    if (exists) recordVisit(lessonId);
  }, [lessonId, exists]);

  if (!ref) return <NotFound />;
  const done = isCompleted(lessonId);
  const marked = isBookmarked(lessonId);
  const lc = loc.course(ref.course);
  const ls = loc.section(ref.course.id, ref.section);
  const ll = loc.lesson(ref.course.id, ref.lesson);
  const { hue } = courseTheme(ref.course.id);
  const positionPercent = (ref.index / ref.total) * 100;

  return (
    <>
      <ReadingProgress />

      <div className="mx-auto flex max-w-7xl gap-10 px-4 py-10 sm:px-6">
        <motion.article
          key={lessonId}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0 max-w-content flex-1"
        >
          {/* ---------- Breadcrumb ---------- */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-ink-faint"
          >
            <Link
              to="/courses"
              className="rounded transition-colors duration-fast hover:text-ink"
            >
              {t("lesson.breadcrumbCourses")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <Link
              to={`/courses/${ref.course.id}`}
              className="rounded font-medium transition-colors duration-fast hover:text-ink"
              style={{ color: `hsl(${hue} 50% 40%)` }}
            >
              {lc.title}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="text-ink-soft">{ls.title}</span>
          </nav>

          {/* ---------- Meta header ---------- */}
          <header className="mb-8 border-b border-line pb-8">
            <h1 className="text-title font-extrabold text-balance">{ll.title}</h1>
            <p className="mt-3.5 text-lg leading-relaxed text-ink-soft text-pretty">
              {ll.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
              <DifficultyBadge level={ref.lesson.difficulty} />
              <span className="flex items-center gap-1.5 text-sm text-ink-faint">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span className="tabular">
                  {formatMinutes(ref.minutes)} {t("unit.read")}
                </span>
              </span>

              {/* Position within the course, shown as text + a matching bar */}
              <span className="flex items-center gap-2 text-sm text-ink-faint">
                <span className="tabular">
                  {t("lesson.of", { index: ref.index, total: ref.total })}
                </span>
                <span
                  aria-hidden="true"
                  className="h-1 w-16 overflow-hidden rounded-full bg-surface-sunken"
                >
                  <span
                    className="block h-full rounded-full bg-accent/60"
                    style={{ width: `${positionPercent}%` }}
                  />
                </span>
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggle(lessonId)}
                aria-pressed={marked}
              >
                <BookMarked
                  className={cn("h-4 w-4", marked && "fill-accent text-accent")}
                  aria-hidden="true"
                />
                {marked ? t("lesson.bookmarked") : t("lesson.bookmark")}
              </Button>
              <Button
                variant={done ? "secondary" : "primary"}
                size="sm"
                onClick={() => toggleCompleted(lessonId)}
                aria-pressed={done}
              >
                <CheckCircle2
                  className={cn("h-4 w-4", done && "text-success")}
                  aria-hidden="true"
                />
                {done ? t("lesson.completed") : t("lesson.markComplete")}
              </Button>
            </div>
          </header>

          <Markdown body={ref.body} />

          {/* ---------- End-of-lesson completion CTA ----------
              Placed where readers actually finish, so marking done doesn't
              require scrolling back up. */}
          <div
            className={cn(
              "mt-14 flex flex-col items-start gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between",
              done
                ? "border-success/25 bg-success-soft/60"
                : "border-line bg-surface-sunken/60"
            )}
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  done ? "bg-success text-white" : "bg-surface-raised text-ink-faint shadow-sm"
                )}
              >
                <Check className="h-5 w-5" strokeWidth={done ? 3 : 2} />
              </span>
              <div>
                <p className="font-semibold">
                  {done ? t("lesson.doneTitle") : t("lesson.finishTitle")}
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {done ? t("lesson.doneHint") : t("lesson.finishHint")}
                </p>
              </div>
            </div>

            <Button
              variant={done ? "outline" : "primary"}
              onClick={() => toggleCompleted(lessonId)}
              className="w-full shrink-0 sm:w-auto"
            >
              {done ? t("lesson.markIncomplete") : t("lesson.markComplete")}
            </Button>
          </div>

          {/* ---------- Prev / next ---------- */}
          <nav
            aria-label={t("lesson.pager")}
            className="mt-8 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
          >
            {ref.prev ? (
              <Link
                to={`/courses/${ref.prev.courseId}/${ref.prev.slug}`}
                className={cn(
                  "group rounded-2xl border border-line bg-surface-raised p-5 shadow-sm",
                  "transition-[box-shadow,border-color,transform] duration-base ease-out",
                  "hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md"
                )}
              >
                <p className="flex items-center gap-1.5 text-xs font-medium text-ink-faint">
                  <ArrowLeft
                    className="h-3.5 w-3.5 transition-transform duration-base ease-out group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                  {t("lesson.previous")}
                </p>
                <p className="mt-1.5 line-clamp-2 font-semibold leading-snug transition-colors duration-fast group-hover:text-accent">
                  {loc.lessonTitle(ref.prev.courseId, ref.prev.slug, ref.prev.title)}
                </p>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}

            {ref.next && (
              <Link
                to={`/courses/${ref.next.courseId}/${ref.next.slug}`}
                className={cn(
                  "group rounded-2xl border border-line bg-surface-raised p-5 text-right shadow-sm",
                  "transition-[box-shadow,border-color,transform] duration-base ease-out",
                  "hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md"
                )}
              >
                <p className="flex items-center justify-end gap-1.5 text-xs font-medium text-ink-faint">
                  {t("lesson.next")}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-base ease-out group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </p>
                <p className="mt-1.5 line-clamp-2 font-semibold leading-snug transition-colors duration-fast group-hover:text-accent">
                  {loc.lessonTitle(ref.next.courseId, ref.next.slug, ref.next.title)}
                </p>
              </Link>
            )}
          </nav>
        </motion.article>

        {/* ---------- Sticky TOC ---------- */}
        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto pb-8">
            <TableOfContents markdown={ref.body} />
          </div>
        </aside>
      </div>
    </>
  );
}
