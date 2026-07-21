import { Flame, RotateCcw, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { LessonCard } from "@/components/LessonCard";
import { allLessons, courses } from "@/engine/content";
import { useProgress } from "@/engine/progress";
import { useI18n } from "@/engine/i18n";
import { useLocalize } from "@/engine/localize";

export function ProgressPage() {
  const {
    state,
    streak,
    completedCount,
    totalCount,
    coursePercent,
    resetProgress,
  } = useProgress();
  const { t } = useI18n();
  const loc = useLocalize();

  const lessons = allLessons();
  const completedEntries = lessons
    .filter((l) => state.completed[l.id])
    .sort(
      (a, b) =>
        new Date(state.completed[b.id]).getTime() -
        new Date(state.completed[a.id]).getTime()
    );

  const handleReset = () => {
    if (window.confirm(t("progress.resetConfirm"))) {
      resetProgress();
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t("progress.title")}</h1>
          <p className="mt-2 text-ink-soft">{t("progress.subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" /> {t("progress.reset")}
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <Trophy className="h-4 w-4 text-amber-500" /> {t("progress.overall")}
          </p>
          <p className="mt-1 text-4xl font-bold">
            {totalCount ? Math.round((completedCount / totalCount) * 100) : 0}%
          </p>
          <ProgressBar
            className="mt-4"
            value={totalCount ? (completedCount / totalCount) * 100 : 0}
          />
          <p className="mt-2 text-sm text-ink-faint">
            {t("progress.completedOf", { done: completedCount, total: totalCount })}
          </p>
        </Card>
        <Card className="p-6">
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <Flame className="h-4 w-4 text-orange-500" /> {t("home.stat.streak")}
          </p>
          <p className="mt-1 text-4xl font-bold">
            {streak} {streak === 1 ? t("unit.day") : t("unit.days")}
          </p>
          <p className="mt-4 text-sm text-ink-faint">
            {t(
              state.activeDays.length === 1
                ? "progress.activeDay"
                : "progress.activeDays",
              { n: state.activeDays.length }
            )}
          </p>
        </Card>
      </div>

      <h2 className="mt-12 text-xl font-bold tracking-tight">{t("progress.byCourse")}</h2>
      <div className="mt-4 space-y-3">
        {courses.map((course) => (
          <Card key={course.id} className="flex items-center gap-6 p-5">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{loc.course(course).title}</p>
              <ProgressBar className="mt-2" value={coursePercent(course.id)} />
            </div>
            <span className="text-lg font-bold text-ink-soft">
              {coursePercent(course.id)}%
            </span>
          </Card>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold tracking-tight">
        {t("progress.recentlyCompleted")}
      </h2>
      {completedEntries.length === 0 ? (
        <p className="mt-4 text-ink-soft">{t("progress.nothingCompleted")}</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {completedEntries.slice(0, 9).map((entry) => (
            <LessonCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
