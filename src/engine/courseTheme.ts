import type { CourseId } from "./types";

/**
 * Per-course visual identity.
 *
 * Each course gets a stable hue and a glyph so learners can recognise a course
 * at a glance in cards, breadcrumbs, and the sidebar — the colour is decoration
 * layered on top of the label, never the only signal.
 *
 * `hue` is an HSL hue angle; the surrounding CSS derives tint/ink from it so
 * both themes stay balanced from a single number.
 */
export interface CourseTheme {
  hue: number;
  /** Two-character monogram used in avatars and list markers. */
  monogram: string;
}

const themes: Record<CourseId, CourseTheme> = {
  "python-noldan": { hue: 158, monogram: "N0" },
  "python-foundations": { hue: 199, monogram: "Py" },
  python: { hue: 221, monogram: "Px" },
  django: { hue: 152, monogram: "Dj" },
  fastapi: { hue: 174, monogram: "Fa" },
  "ai-python": { hue: 276, monogram: "AI" },
  "docker-python": { hue: 205, monogram: "Dk" },
};

const fallback: CourseTheme = { hue: 200, monogram: "··" };

export function courseTheme(id: string): CourseTheme {
  return themes[id as CourseId] ?? fallback;
}

/**
 * CSS custom properties for a course-tinted region.
 *
 * Lightness/saturation differ per theme so the tint stays legible in both:
 * the `dark:` variants are applied by the consuming component via `.dark &`
 * rules in Tailwind arbitrary properties, so we expose both up front.
 */
export function courseVars(id: string): React.CSSProperties {
  const { hue } = courseTheme(id);
  return {
    ["--c-hue" as string]: String(hue),
  };
}
