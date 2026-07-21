import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  Lightbulb,
  Map,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { LessonCard } from "@/components/LessonCard";
import { allLessons, courses, courseMinutes } from "@/engine/content";
import { useProgress } from "@/engine/progress";
import { useI18n, useFormatMinutes } from "@/engine/i18n";
import { useLocalize } from "@/engine/localize";

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export function Home() {
  const { state, streak, completedCount, totalCount, coursePercent } =
    useProgress();
  const { t } = useI18n();
  const loc = useLocalize();
  const formatMinutes = useFormatMinutes();
  const tips = [t("home.tip1"), t("home.tip2"), t("home.tip3"), t("home.tip4")];

  const lessons = allLessons();
  const totalMinutes = lessons.reduce((s, l) => s + l.minutes, 0);
  const lastVisited = state.lastVisited
    ? lessons.find((l) => l.id === state.lastVisited)
    : undefined;
  const featured = [
    lessons.find((l) => l.lesson.slug === "decorators"),
    lessons.find((l) => l.lesson.slug === "queryset-optimization"),
    lessons.find((l) => l.lesson.slug === "dependency-injection"),
  ].filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <motion.section {...fade} transition={{ duration: 0.5 }} className="max-w-3xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-xs font-medium text-ink-soft">
          <BookOpen className="h-3.5 w-3.5" />
          {t("home.badge", {
            lessons: lessons.length,
            time: formatMinutes(totalMinutes),
          })}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t("home.title.pre")}{" "}
          <span className="text-accent">{t("home.title.accent")}</span>
          {t("home.title.post")}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {t("home.subtitle")}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to={lastVisited ? `/courses/${lastVisited.course.id}/${lastVisited.lesson.slug}` : "/courses/python/python-execution-model"}>
            <Button size="lg">
              <PlayCircle className="h-5 w-5" />
              {lastVisited ? t("home.continue") : t("home.start")}
            </Button>
          </Link>
          <Link to="/courses">
            <Button size="lg" variant="outline">
              {t("home.browse")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        {...fade}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-12 grid gap-4 sm:grid-cols-3"
      >
        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <BookOpen className="h-4 w-4" /> {t("home.stat.completed")}
          </p>
          <p className="mt-1 text-3xl font-bold">
            {completedCount}
            <span className="text-base font-medium text-ink-faint">
              {" "}/ {totalCount}
            </span>
          </p>
          <ProgressBar
            className="mt-3"
            value={totalCount ? (completedCount / totalCount) * 100 : 0}
          />
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <Flame className="h-4 w-4 text-orange-500" /> {t("home.stat.streak")}
          </p>
          <p className="mt-1 text-3xl font-bold">
            {streak}
            <span className="text-base font-medium text-ink-faint">
              {" "}
              {streak === 1 ? t("unit.day") : t("unit.days")}
            </span>
          </p>
          <p className="mt-3 text-xs text-ink-faint">
            {t("home.stat.streakHint")}
          </p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <Clock className="h-4 w-4" /> {t("home.stat.curriculum")}
          </p>
          <p className="mt-1 text-3xl font-bold">{formatMinutes(totalMinutes)}</p>
          <p className="mt-3 text-xs text-ink-faint">
            {t("home.stat.curriculumHint")}
          </p>
        </Card>
      </motion.section>

      {/* Continue learning */}
      {lastVisited && (
        <motion.section {...fade} transition={{ duration: 0.5, delay: 0.15 }} className="mt-14">
          <h2 className="mb-4 text-xl font-bold tracking-tight">{t("home.continueHeading")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <LessonCard entry={lastVisited} />
          </div>
        </motion.section>
      )}

      {/* Roadmap */}
      <motion.section {...fade} transition={{ duration: 0.5, delay: 0.2 }} className="mt-14">
        <h2 className="mb-1 flex items-center gap-2 text-xl font-bold tracking-tight">
          <Map className="h-5 w-5 text-accent" /> {t("home.roadmap")}
        </h2>
        <p className="mb-5 text-sm text-ink-soft">{t("home.roadmapHint")}</p>
        <div className="grid gap-4 lg:grid-cols-3">
          {courses.map((course, i) => {
            const lc = loc.course(course);
            return (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card className="group h-full p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-sunken text-sm font-bold text-ink-soft">
                    {i + 1}
                  </span>
                  <span className="text-xs font-medium text-ink-faint">
                    {lc.level}
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight group-hover:text-accent">
                  {lc.title}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">{lc.tagline}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-faint">
                  <span>
                    {course.sections.reduce((n, s) => n + s.lessons.length, 0)}{" "}
                    {t("unit.lessons")} · {formatMinutes(courseMinutes(course.id))}
                  </span>
                  <span>{coursePercent(course.id)}%</span>
                </div>
                <ProgressBar className="mt-2" value={coursePercent(course.id)} />
              </Card>
            </Link>
            );
          })}
        </div>
      </motion.section>

      {/* Featured */}
      <motion.section {...fade} transition={{ duration: 0.5, delay: 0.25 }} className="mt-14">
        <h2 className="mb-4 text-xl font-bold tracking-tight">{t("home.featured")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((entry) => (
            <LessonCard key={entry.id} entry={entry} />
          ))}
        </div>
      </motion.section>

      {/* Tips */}
      <motion.section {...fade} transition={{ duration: 0.5, delay: 0.3 }} className="mt-14">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold tracking-tight">
          <Lightbulb className="h-5 w-5 text-amber-500" /> {t("home.tipsHeading")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip) => (
            <Card key={tip} className="p-5 text-sm leading-relaxed text-ink-soft">
              {tip}
            </Card>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
