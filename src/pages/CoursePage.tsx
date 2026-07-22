import { Link, useParams } from "react-router-dom";
import { Check, ChevronRight, Circle, Clock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { getCourse, courseLessons, courseMinutes } from "@/engine/content";
import { useProgress } from "@/engine/progress";
import { useI18n, useFormatMinutes } from "@/engine/i18n";
import { useLocalize } from "@/engine/localize";
import { courseTheme } from "@/engine/courseTheme";
import { NotFound } from "./NotFound";

export function CoursePage() {
  const { courseId = "" } = useParams();
  const course = getCourse(courseId);
  const { isCompleted, coursePercent } = useProgress();
  const { t } = useI18n();
  const loc = useLocalize();
  const formatMinutes = useFormatMinutes();

  if (!course) return <NotFound />;
  const lc = loc.course(course);
  const lessons = courseLessons(course.id);
  const minutesBySlug = new Map(lessons.map((l) => [l.lesson.slug, l.minutes]));
  const { hue, monogram } = courseTheme(course.id);
  const percent = coursePercent(course.id);

  // Resume point: first unfinished lesson, else the very first.
  const nextUp = lessons.find((l) => !isCompleted(l.id)) ?? lessons[0];
  const startedAny = lessons.some((l) => isCompleted(l.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* ---------- Course header ---------- */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-bold tracking-tight"
          style={{
            backgroundColor: `hsl(${hue} 60% 45% / 0.12)`,
            color: `hsl(${hue} 55% 38%)`,
          }}
        >
          {monogram}
        </span>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {lc.level}
          </p>
          <h1 className="mt-1.5 text-title font-extrabold text-balance">{lc.title}</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft text-pretty">
            {lc.description}
          </p>
        </div>
      </header>

      {/* ---------- Progress + resume ---------- */}
      <Card className="mt-8 flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="tabular text-ink-soft">
              {lessons.length} {t("unit.lessons")} · {formatMinutes(courseMinutes(course.id))}
            </span>
            <span
              className={cn(
                "tabular font-semibold",
                percent === 100 ? "text-success" : "text-ink"
              )}
            >
              {percent}% {t("course.completeSuffix")}
            </span>
          </div>
          <ProgressBar value={percent} label={lc.title} />
        </div>

        {nextUp && percent < 100 && (
          <Link to={`/courses/${course.id}/${nextUp.lesson.slug}`} className="shrink-0">
            <Button className="w-full sm:w-auto">
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              {startedAny ? t("course.resume") : t("course.start")}
            </Button>
          </Link>
        )}
      </Card>

      {/* ---------- Sections ---------- */}
      <div className="mt-12 space-y-10">
        {course.sections.map((section, si) => {
          const ls = loc.section(course.id, section);
          const sectionIds = section.lessons.map((l) => `${course.id}/${l.slug}`);
          const sectionDone = sectionIds.filter(isCompleted).length;

          return (
            <section key={section.id}>
              <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-3">
                <span
                  aria-hidden="true"
                  className="tabular text-sm font-bold text-ink-faint"
                >
                  {String(si + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold tracking-tight">{ls.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {ls.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "tabular shrink-0 text-xs font-medium",
                    sectionDone === section.lessons.length
                      ? "text-success"
                      : "text-ink-faint"
                  )}
                >
                  {sectionDone}/{section.lessons.length}
                </span>
              </div>

              <ol className="space-y-3">
                {section.lessons.map((lesson) => {
                  const id = `${course.id}/${lesson.slug}`;
                  const done = isCompleted(id);
                  const ll = loc.lesson(course.id, lesson);
                  const isNext = nextUp?.lesson.slug === lesson.slug;

                  return (
                    <li key={lesson.slug}>
                      <Link
                        to={`/courses/${course.id}/${lesson.slug}`}
                        className="group block rounded-2xl"
                      >
                        <Card
                          interactive
                          className={cn(
                            "flex items-start gap-4 p-5",
                            isNext && "ring-1 ring-accent/40"
                          )}
                        >
                          {/* Status marker: shape + colour, so it reads without colour */}
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                              done && "bg-success text-white"
                            )}
                          >
                            {done ? (
                              <Check className="h-3 w-3" strokeWidth={3} />
                            ) : (
                              <Circle className="h-5 w-5 text-ink-faint" />
                            )}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold tracking-tight transition-colors duration-fast group-hover:text-accent">
                                {ll.title}
                              </h3>
                              <DifficultyBadge level={lesson.difficulty} />
                              {isNext && (
                                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
                                  {t("course.upNext")}
                                </span>
                              )}
                            </div>

                            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                              {ll.description}
                            </p>

                            <p className="mt-2.5 flex items-center gap-1.5 text-xs text-ink-faint">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="tabular">
                                {formatMinutes(minutesBySlug.get(lesson.slug) ?? 0)}{" "}
                                {t("unit.read")}
                              </span>
                            </p>
                          </div>

                          <ChevronRight
                            aria-hidden="true"
                            className="mt-0.5 h-5 w-5 shrink-0 text-ink-faint transition-[transform,color] duration-base ease-out group-hover:translate-x-0.5 group-hover:text-accent"
                          />
                        </Card>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
