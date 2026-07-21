export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface LessonMeta {
  /** Unique within the whole platform: `${courseId}/${slug}` */
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  /** Concept tags used by search and the glossary. */
  tags: string[];
}

export interface Section {
  id: string;
  title: string;
  description: string;
  lessons: LessonMeta[];
}

/**
 * Course identifiers. Kept as a widenable string union so new courses are a
 * pure additive change: append the id here and register the course object in
 * `engine/content.ts` — nothing else in the engine needs to change.
 */
export type CourseId =
  | "python"
  | "django"
  | "fastapi"
  | "ai-python"
  | "python-foundations"
  | "docker-python";

export interface Course {
  id: CourseId;
  title: string;
  tagline: string;
  description: string;
  level: string;
  sections: Section[];
}

export interface LessonRef {
  course: Course;
  section: Section;
  lesson: LessonMeta;
  /** Raw markdown body. */
  body: string;
  /** Estimated reading minutes. */
  minutes: number;
  /** Position across the whole course, 1-based. */
  index: number;
  total: number;
  prev: { courseId: string; slug: string; title: string } | null;
  next: { courseId: string; slug: string; title: string } | null;
}
