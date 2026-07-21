import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
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
import { cn } from "@/lib/utils";
import { NotFound } from "./NotFound";

export function LessonPage() {
  const { courseId = "", slug = "" } = useParams();
  const ref = getLesson(courseId, slug);
  const { isCompleted, toggleCompleted } = useProgress();
  const { isBookmarked, toggle } = useBookmarks();
  const { t } = useI18n();
  const loc = useLocalize();
  const formatMinutes = useFormatMinutes();

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

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto flex max-w-7xl gap-10 px-4 py-10 sm:px-6">
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="min-w-0 max-w-content flex-1"
        >
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-ink-faint">
            <Link to="/courses" className="hover:text-ink">
              {t("lesson.breadcrumbCourses")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={`/courses/${ref.course.id}`} className="hover:text-ink">
              {lc.title}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-ink-soft">{ls.title}</span>
          </nav>

          {/* Meta header */}
          <header className="mb-8 border-b border-line pb-8">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {ll.title}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">
              {ll.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <DifficultyBadge level={ref.lesson.difficulty} />
              <span className="flex items-center gap-1.5 text-sm text-ink-faint">
                <Clock className="h-4 w-4" />
                {formatMinutes(ref.minutes)} {t("unit.read")}
              </span>
              <span className="text-sm text-ink-faint">
                {t("lesson.of", { index: ref.index, total: ref.total })}
              </span>
              <span className="ml-auto flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggle(lessonId)}
                  aria-pressed={marked}
                >
                  <BookMarked
                    className={cn("h-4 w-4", marked && "fill-accent text-accent")}
                  />
                  {marked ? t("lesson.bookmarked") : t("lesson.bookmark")}
                </Button>
                <Button
                  variant={done ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => toggleCompleted(lessonId)}
                >
                  <CheckCircle2
                    className={cn("h-4 w-4", done && "text-emerald-500")}
                  />
                  {done ? t("lesson.completed") : t("lesson.markComplete")}
                </Button>
              </span>
            </div>
          </header>

          <Markdown body={ref.body} />

          {/* Prev / next */}
          <nav className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            {ref.prev ? (
              <Link
                to={`/courses/${ref.prev.courseId}/${ref.prev.slug}`}
                className="group rounded-2xl border border-line bg-surface-raised p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="flex items-center gap-1.5 text-xs text-ink-faint">
                  <ArrowLeft className="h-3.5 w-3.5" /> {t("lesson.previous")}
                </p>
                <p className="mt-1 font-semibold group-hover:text-accent">
                  {loc.lessonTitle(ref.prev.courseId, ref.prev.slug, ref.prev.title)}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {ref.next && (
              <Link
                to={`/courses/${ref.next.courseId}/${ref.next.slug}`}
                className="group rounded-2xl border border-line bg-surface-raised p-5 text-right transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="flex items-center justify-end gap-1.5 text-xs text-ink-faint">
                  {t("lesson.next")} <ArrowRight className="h-3.5 w-3.5" />
                </p>
                <p className="mt-1 font-semibold group-hover:text-accent">
                  {loc.lessonTitle(ref.next.courseId, ref.next.slug, ref.next.title)}
                </p>
              </Link>
            )}
          </nav>
        </motion.article>

        {/* Sticky TOC */}
        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8">
            <TableOfContents markdown={ref.body} />
          </div>
        </aside>
      </div>
    </>
  );
}
