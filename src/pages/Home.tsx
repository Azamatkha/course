import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Flame,
  Lightbulb,
  Map,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { LessonCard } from "@/components/LessonCard";
import { allLessons, courses, courseMinutes } from "@/engine/content";
import { useProgress } from "@/engine/progress";
import { useI18n, useFormatMinutes } from "@/engine/i18n";
import { useLocalize } from "@/engine/localize";
import { courseTheme } from "@/engine/courseTheme";

/** Section wrapper: one consistent entrance, disabled under reduced-motion. */
function Section({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.42, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({
  icon: Icon,
  iconClass,
  title,
  hint,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  iconClass?: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="flex items-center gap-2 text-title font-bold">
        {Icon && <Icon className={cn("h-5 w-5 shrink-0", iconClass)} />}
        {title}
      </h2>
      {hint && <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{hint}</p>}
    </div>
  );
}

export function Home() {
  const { state, streak, completedCount, totalCount, coursePercent } = useProgress();
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

  const overallPercent = totalCount ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="relative">
      {/* Ambient hero wash — decorative, sits behind content and never traps clicks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {/* ---------- Hero ---------- */}
        <Section className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs font-medium text-ink-soft shadow-sm">
            <BookOpen className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span className="tabular">
              {t("home.badge", {
                lessons: lessons.length,
                time: formatMinutes(totalMinutes),
              })}
            </span>
          </p>

          <h1 className="text-display font-extrabold text-balance">
            {t("home.title.pre")}{" "}
            <span className="relative whitespace-nowrap text-accent">
              {t("home.title.accent")}
              {/* Hand-drawn-ish underline: adds character without extra assets */}
              <svg
                aria-hidden="true"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-2.5 w-full text-accent/35"
              >
                <path
                  d="M2 8c40-5 90-6 196-3"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
            {t("home.title.post")}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
            {t("home.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={
                lastVisited
                  ? `/courses/${lastVisited.course.id}/${lastVisited.lesson.slug}`
                  : "/courses/python-noldan/python-nima"
              }
            >
              <Button size="lg">
                <PlayCircle className="h-5 w-5" aria-hidden="true" />
                {lastVisited ? t("home.continue") : t("home.start")}
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline">
                {t("home.browse")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Section>

        {/* ---------- Stats ---------- */}
        <Section delay={0.05} className="mt-14 grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-ink-soft">
              <BookOpen className="h-4 w-4 text-accent" aria-hidden="true" />
              {t("home.stat.completed")}
            </p>
            <p className="mt-2 text-3xl font-bold tabular">
              {completedCount}
              <span className="text-base font-medium text-ink-faint"> / {totalCount}</span>
            </p>
            <ProgressBar
              className="mt-3"
              value={overallPercent}
              label={t("home.stat.completed")}
            />
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-ink-soft">
              <Flame className="h-4 w-4 text-warning" aria-hidden="true" />
              {t("home.stat.streak")}
            </p>
            <p className="mt-2 text-3xl font-bold tabular">
              {streak}
              <span className="text-base font-medium text-ink-faint">
                {" "}
                {streak === 1 ? t("unit.day") : t("unit.days")}
              </span>
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              {t("home.stat.streakHint")}
            </p>
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-ink-soft">
              <Clock className="h-4 w-4 text-info" aria-hidden="true" />
              {t("home.stat.curriculum")}
            </p>
            <p className="mt-2 text-3xl font-bold tabular">{formatMinutes(totalMinutes)}</p>
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              {t("home.stat.curriculumHint")}
            </p>
          </Card>
        </Section>

        {/* ---------- Continue ---------- */}
        {lastVisited && (
          <Section delay={0.05} className="mt-14">
            <SectionHeading title={t("home.continueHeading")} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <LessonCard entry={lastVisited} />
            </div>
          </Section>
        )}

        {/* ---------- Roadmap ---------- */}
        <Section delay={0.05} className="mt-16">
          <SectionHeading
            icon={Map}
            iconClass="text-accent"
            title={t("home.roadmap")}
            hint={t("home.roadmapHint")}
          />
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => {
              const lc = loc.course(course);
              const { hue, monogram } = courseTheme(course.id);
              const percent = coursePercent(course.id);
              const lessonCount = course.sections.reduce(
                (n, s) => n + s.lessons.length,
                0
              );

              return (
                <li key={course.id}>
                  <Link to={`/courses/${course.id}`} className="group block h-full rounded-2xl">
                    <Card interactive className="flex h-full flex-col p-5">
                      <div className="mb-3.5 flex items-start justify-between gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold tracking-tight"
                          style={{
                            backgroundColor: `hsl(${hue} 60% 45% / 0.12)`,
                            color: `hsl(${hue} 55% 38%)`,
                          }}
                        >
                          {monogram}
                        </span>
                        <div className="text-right">
                          <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                            {t("unit.step")} {i + 1}
                          </span>
                          <span className="mt-0.5 block text-xs font-medium text-ink-soft">
                            {lc.level}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold leading-snug tracking-tight transition-colors duration-fast ease-out group-hover:text-accent">
                        {lc.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                        {lc.tagline}
                      </p>

                      <div className="mt-auto pt-4">
                        <div className="mb-2 flex items-center justify-between text-xs text-ink-faint">
                          <span className="tabular">
                            {lessonCount} {t("unit.lessons")} ·{" "}
                            {formatMinutes(courseMinutes(course.id))}
                          </span>
                          <span
                            className={cn(
                              "tabular font-semibold",
                              percent === 100 ? "text-success" : "text-ink-soft"
                            )}
                          >
                            {percent}%
                          </span>
                        </div>
                        <ProgressBar value={percent} label={lc.title} />
                      </div>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Section>

        {/* ---------- Featured ---------- */}
        <Section delay={0.05} className="mt-16">
          <SectionHeading title={t("home.featured")} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((entry) => (
              <LessonCard key={entry.id} entry={entry} />
            ))}
          </div>
        </Section>

        {/* ---------- Tips ---------- */}
        <Section delay={0.05} className="mt-16">
          <SectionHeading
            icon={Lightbulb}
            iconClass="text-warning"
            title={t("home.tipsHeading")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {tips.map((tip, i) => (
              <Card key={tip} className="flex gap-4 p-5">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-xs font-bold text-accent"
                >
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-ink-soft">{tip}</p>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
