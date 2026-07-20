import { pythonCourse } from "./courses/python";
import { djangoCourse } from "./courses/django";
import { fastapiCourse } from "./courses/fastapi";
import type { Course, LessonMeta, LessonRef, Section } from "./types";
import { readingTime } from "@/lib/utils";

export const courses: Course[] = [pythonCourse, djangoCourse, fastapiCourse];

/** All lesson markdown, bundled statically by Vite at build time. */
const files = import.meta.glob("../content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function bodyFor(courseId: string, slug: string): string | undefined {
  return files[`../content/${courseId}/${slug}.md`];
}

export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export interface FlatLesson {
  course: Course;
  section: Section;
  lesson: LessonMeta;
  minutes: number;
  /** `${courseId}/${slug}` — the canonical lesson id used by progress/bookmarks. */
  id: string;
}

let flatCache: FlatLesson[] | null = null;

export function allLessons(): FlatLesson[] {
  if (flatCache) return flatCache;
  flatCache = courses.flatMap((course) =>
    course.sections.flatMap((section) =>
      section.lessons.map((lesson) => ({
        course,
        section,
        lesson,
        id: `${course.id}/${lesson.slug}`,
        minutes: readingTime(bodyFor(course.id, lesson.slug) ?? ""),
      }))
    )
  );
  return flatCache;
}

export function courseLessons(courseId: string): FlatLesson[] {
  return allLessons().filter((l) => l.course.id === courseId);
}

export function courseMinutes(courseId: string): number {
  return courseLessons(courseId).reduce((sum, l) => sum + l.minutes, 0);
}

export function getLesson(courseId: string, slug: string): LessonRef | undefined {
  const list = courseLessons(courseId);
  const idx = list.findIndex((l) => l.lesson.slug === slug);
  if (idx === -1) return undefined;
  const entry = list[idx];
  const body = bodyFor(courseId, slug);
  if (body == null) return undefined;
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx < list.length - 1 ? list[idx + 1] : null;
  return {
    course: entry.course,
    section: entry.section,
    lesson: entry.lesson,
    body,
    minutes: entry.minutes,
    index: idx + 1,
    total: list.length,
    prev: prev && { courseId, slug: prev.lesson.slug, title: prev.lesson.title },
    next: next && { courseId, slug: next.lesson.slug, title: next.lesson.title },
  };
}

export function lessonBody(courseId: string, slug: string): string | undefined {
  return bodyFor(courseId, slug);
}
