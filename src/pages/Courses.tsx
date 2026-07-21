import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { courses, courseMinutes } from "@/engine/content";
import { useProgress } from "@/engine/progress";
import { useI18n, useFormatMinutes } from "@/engine/i18n";

export function Courses() {
  const { coursePercent } = useProgress();
  const { t } = useI18n();
  const formatMinutes = useFormatMinutes();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{t("courses.title")}</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">{t("courses.subtitle")}</p>

      <div className="mt-10 space-y-6">
        {courses.map((course, i) => {
          const lessonCount = course.sections.reduce(
            (n, s) => n + s.lessons.length,
            0
          );
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link to={`/courses/${course.id}`}>
                <Card className="group p-7 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-2xl">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
                        {course.level}
                      </p>
                      <h2 className="text-2xl font-bold tracking-tight group-hover:text-accent">
                        {course.title}
                      </h2>
                      <p className="mt-2 leading-relaxed text-ink-soft">
                        {course.description}
                      </p>
                      <p className="mt-4 flex items-center gap-2 text-sm text-ink-faint">
                        <Layers className="h-4 w-4" />
                        {course.sections.length} {t("unit.sections")} · {lessonCount}{" "}
                        {t("unit.lessons")} · {formatMinutes(courseMinutes(course.id))}{" "}
                        {t("unit.ofReading")}
                      </p>
                    </div>
                    <div className="w-full sm:w-48">
                      <div className="mb-1.5 flex justify-between text-xs text-ink-faint">
                        <span>{t("courses.progress")}</span>
                        <span>{coursePercent(course.id)}%</span>
                      </div>
                      <ProgressBar value={coursePercent(course.id)} />
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                        {t("courses.open")} <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
