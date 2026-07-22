import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { courses, courseMinutes } from "@/engine/content";
import { useProgress } from "@/engine/progress";
import { useI18n, useFormatMinutes } from "@/engine/i18n";
import { useLocalize } from "@/engine/localize";
import { courseTheme } from "@/engine/courseTheme";

export function Courses() {
  const { coursePercent } = useProgress();
  const { t } = useI18n();
  const loc = useLocalize();
  const formatMinutes = useFormatMinutes();
  const reduce = useReducedMotion();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="text-title font-extrabold">{t("courses.title")}</h1>
        <p className="mt-3 leading-relaxed text-ink-soft text-pretty">
          {t("courses.subtitle")}
        </p>
      </header>

      {/* Ordered: the list encodes the recommended learning sequence. */}
      <ol className="mt-10 space-y-5">
        {courses.map((course, i) => {
          const lessonCount = course.sections.reduce((n, s) => n + s.lessons.length, 0);
          const lc = loc.course(course);
          const { hue, monogram } = courseTheme(course.id);
          const percent = coursePercent(course.id);
          const done = percent === 100;

          return (
            <motion.li
              key={course.id}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                // Cap the stagger so the last course isn't a second late.
                delay: Math.min(i * 0.06, 0.3),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link to={`/courses/${course.id}`} className="group block rounded-2xl">
                <Card interactive className="relative overflow-hidden p-6 sm:p-7">
                  {/* Course identity rail */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1 opacity-80 transition-opacity duration-base ease-out group-hover:opacity-100"
                    style={{ backgroundColor: `hsl(${hue} 62% 45%)` }}
                  />

                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex max-w-2xl gap-4">
                      <span
                        aria-hidden="true"
                        className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold tracking-tight sm:flex"
                        style={{
                          backgroundColor: `hsl(${hue} 60% 45% / 0.12)`,
                          color: `hsl(${hue} 55% 38%)`,
                        }}
                      >
                        {monogram}
                      </span>

                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                            {t("unit.step")} {i + 1}
                          </p>
                          <span aria-hidden="true" className="text-ink-faint">
                            ·
                          </span>
                          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                            {lc.level}
                          </p>
                        </div>

                        <h2 className="text-xl font-bold tracking-tight transition-colors duration-fast ease-out group-hover:text-accent sm:text-2xl">
                          {lc.title}
                        </h2>
                        <p className="mt-2 leading-relaxed text-ink-soft text-pretty">
                          {lc.description}
                        </p>
                        <p className="mt-4 flex items-center gap-2 text-sm text-ink-faint">
                          <Layers className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span className="tabular">
                            {course.sections.length} {t("unit.sections")} · {lessonCount}{" "}
                            {t("unit.lessons")} · {formatMinutes(courseMinutes(course.id))}{" "}
                            {t("unit.ofReading")}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="w-full shrink-0 sm:w-48">
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-ink-faint">{t("courses.progress")}</span>
                        <span
                          className={cn(
                            "tabular font-semibold",
                            done ? "text-success" : "text-ink-soft"
                          )}
                        >
                          {percent}%
                        </span>
                      </div>
                      <ProgressBar value={percent} label={lc.title} />

                      <span
                        className={cn(
                          "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold",
                          done ? "text-success" : "text-accent"
                        )}
                      >
                        {done ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                            {t("unit.complete")}
                          </>
                        ) : (
                          <>
                            {t("courses.open")}
                            <ArrowRight
                              className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
