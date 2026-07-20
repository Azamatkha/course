import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { getCourse, courseLessons, courseMinutes } from "@/engine/content";
import { useProgress } from "@/engine/progress";
import { formatMinutes } from "@/lib/utils";
import { NotFound } from "./NotFound";

export function CoursePage() {
  const { courseId = "" } = useParams();
  const course = getCourse(courseId);
  const { isCompleted, coursePercent } = useProgress();

  if (!course) return <NotFound />;
  const lessons = courseLessons(course.id);
  const minutesBySlug = new Map(lessons.map((l) => [l.lesson.slug, l.minutes]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
        {course.level}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
        {course.title}
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
        {course.description}
      </p>
      <div className="mt-6 max-w-md">
        <div className="mb-1.5 flex justify-between text-sm text-ink-soft">
          <span>
            {lessons.length} lessons · {formatMinutes(courseMinutes(course.id))}
          </span>
          <span>{coursePercent(course.id)}% complete</span>
        </div>
        <ProgressBar value={coursePercent(course.id)} />
      </div>

      <div className="mt-10 space-y-8">
        {course.sections.map((section, si) => (
          <section key={section.id}>
            <h2 className="text-lg font-bold tracking-tight">
              <span className="mr-2 text-ink-faint">
                {String(si + 1).padStart(2, "0")}
              </span>
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">{section.description}</p>
            <div className="mt-4 space-y-3">
              {section.lessons.map((lesson) => {
                const id = `${course.id}/${lesson.slug}`;
                const done = isCompleted(id);
                return (
                  <Link key={lesson.slug} to={`/courses/${course.id}/${lesson.slug}`}>
                    <Card className="group mb-3 flex items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                      {done ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-ink-faint" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold tracking-tight group-hover:text-accent">
                            {lesson.title}
                          </h3>
                          <DifficultyBadge level={lesson.difficulty} />
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                          {lesson.description}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-faint">
                          <Clock className="h-3.5 w-3.5" />
                          {formatMinutes(minutesBySlug.get(lesson.slug) ?? 0)} read
                        </p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
