import { useCallback } from "react";
import type { Course, CourseId, LessonMeta, Section } from "./types";
import { useI18n, type Locale } from "./i18n";
import { coursesUz } from "./i18n/courses-uz";

/**
 * Course metadata (titles/descriptions) localization.
 *
 * Lesson *bodies* live as markdown files; course/section/lesson *metadata*
 * lives in the course definitions (English). This layer overlays a translation
 * when one exists for the active locale, falling back to English otherwise —
 * so the whole browsing UI (home, courses, course page, lesson header, cards,
 * search) can be fully localized without touching the course definitions.
 *
 * Adding a language = add a `coursesXx` map and a branch here.
 */
export interface CourseL10n {
  title?: string;
  tagline?: string;
  description?: string;
  level?: string;
  sections?: Record<string, { title?: string; description?: string }>;
  lessons?: Record<string, { title?: string; description?: string }>;
}

function tableFor(lang: Locale): Partial<Record<CourseId, CourseL10n>> {
  return lang === "uz" ? coursesUz : {};
}

export interface LocalizedCourse {
  title: string;
  tagline: string;
  description: string;
  level: string;
}

export function localizeCourse(course: Course, lang: Locale): LocalizedCourse {
  const t = tableFor(lang)[course.id];
  return {
    title: t?.title ?? course.title,
    tagline: t?.tagline ?? course.tagline,
    description: t?.description ?? course.description,
    level: t?.level ?? course.level,
  };
}

export function localizeSection(
  courseId: CourseId,
  section: Section,
  lang: Locale
): { title: string; description: string } {
  const t = tableFor(lang)[courseId]?.sections?.[section.id];
  return {
    title: t?.title ?? section.title,
    description: t?.description ?? section.description,
  };
}

export function localizeLesson(
  courseId: CourseId,
  lesson: LessonMeta,
  lang: Locale
): { title: string; description: string } {
  const t = tableFor(lang)[courseId]?.lessons?.[lesson.slug];
  return {
    title: t?.title ?? lesson.title,
    description: t?.description ?? lesson.description,
  };
}

/** Localize a lesson title from its slug alone (for prev/next navigation). */
export function localizeLessonTitle(
  courseId: string,
  slug: string,
  fallback: string,
  lang: Locale
): string {
  return tableFor(lang)[courseId as CourseId]?.lessons?.[slug]?.title ?? fallback;
}

/**
 * Hook returning localizers bound to the active locale — the convenient way
 * to use the functions above inside components.
 */
export function useLocalize() {
  const { lang } = useI18n();
  return {
    lang,
    course: useCallback((c: Course) => localizeCourse(c, lang), [lang]),
    section: useCallback(
      (courseId: CourseId, s: Section) => localizeSection(courseId, s, lang),
      [lang]
    ),
    lesson: useCallback(
      (courseId: CourseId, l: LessonMeta) => localizeLesson(courseId, l, lang),
      [lang]
    ),
    lessonTitle: useCallback(
      (courseId: string, slug: string, fallback: string) =>
        localizeLessonTitle(courseId, slug, fallback, lang),
      [lang]
    ),
  };
}
