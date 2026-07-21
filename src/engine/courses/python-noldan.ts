import type { Course } from "../types";

/**
 * "Python noldan" — an absolute-beginner course written natively in Uzbek.
 *
 * Base metadata here is English (so the platform default still reads in
 * English), but the lesson *bodies* live as Uzbek markdown in
 * content/python-noldan/, and the Uzbek titles/descriptions come from
 * engine/i18n/courses-uz.ts. Section ids and lesson slugs must stay in sync
 * with that translation map.
 */
export const pythonNoldanCourse: Course = {
  id: "python-noldan",
  title: "Python from Zero (Uzbek)",
  tagline: "Absolute beginner, in Uzbek — zero to advanced",
  description:
    "A complete beginner course taught entirely in Uzbek, for people who have never programmed. Every concept is explained in the simplest possible language with real-life analogies, from variables all the way to functions, data structures, error handling, files, and an intro to OOP — step by step, with lots of exercises.",
  level: "Zero → Intermediate",
  sections: [
    {
      id: "kirish",
      title: "Getting Started",
      description: "What Python is, why it matters, and how to run your first program.",
      lessons: [
        {
          slug: "python-nima",
          title: "What is Python and why learn it?",
          description:
            "What programming is, why Python is the easiest language to start with, and where it is used — in plain language.",
          difficulty: "beginner",
          tags: ["python", "kirish", "dasturlash", "boshlovchi", "nima uchun"],
        },
        {
          slug: "ornatish-birinchi-dastur",
          title: "Installing Python & your first program",
          description:
            "Install Python, pick an editor, and write and run your first 'Hello, world!' program.",
          difficulty: "beginner",
          tags: ["ornatish", "birinchi dastur", "print", "muharrir", "ishga tushirish"],
        },
      ],
    },
    {
      id: "asoslar",
      title: "The Basics",
      description: "Variables, conditions, and loops — the foundation of programming.",
      lessons: [
        {
          slug: "ozgaruvchilar-va-turlar",
          title: "Variables and data types",
          description:
            "What a variable is (the boxes analogy), numbers, text, booleans, input/print, and operators — your first real code.",
          difficulty: "beginner",
          tags: ["ozgaruvchi", "turlar", "son", "matn", "input", "print"],
        },
        {
          slug: "shartlar",
          title: "Conditionals (if / elif / else)",
          description:
            "Teaching the program to make decisions: if/elif/else, comparisons, and logical operators with real-life examples.",
          difficulty: "beginner",
          tags: ["if", "elif", "else", "shart", "mantiq", "taqqoslash"],
        },
        {
          slug: "sikllar",
          title: "Loops (for and while)",
          description:
            "Automating repetitive work: for and while loops, range, break/continue, and the infinite-loop danger.",
          difficulty: "beginner",
          tags: ["for", "while", "sikl", "range", "break", "continue"],
        },
      ],
    },
    {
      id: "malumotlar",
      title: "Working with Data",
      description: "Lists, dictionaries, and working with text (strings).",
      lessons: [
        {
          slug: "royxatlar",
          title: "Lists",
          description:
            "Storing many values together: creating lists, indexing, adding/removing, iterating, and common mistakes.",
          difficulty: "beginner",
          tags: ["list", "royxat", "indeks", "append", "iteratsiya"],
        },
        {
          slug: "lugat-tuple-set",
          title: "Dictionaries, tuples and sets",
          description:
            "Key-value pairs (dict), immutable lists (tuple), and unique collections (set) — when to use which.",
          difficulty: "beginner",
          tags: ["dict", "tuple", "set", "lugat", "kalit-qiymat"],
        },
        {
          slug: "satrlar",
          title: "Working with strings (text)",
          description:
            "Formatting, splitting, joining, and searching text; f-strings, useful methods, and a gentle note on Unicode.",
          difficulty: "beginner",
          tags: ["satr", "string", "matn", "f-string", "metod"],
        },
      ],
    },
    {
      id: "funksiyalar",
      title: "Functions and Modules",
      description: "Splitting code into reusable pieces and using libraries.",
      lessons: [
        {
          slug: "funksiyalar",
          title: "Functions",
          description:
            "Splitting code into reusable pieces: writing functions, arguments, return, and defaults — with the recipe analogy.",
          difficulty: "beginner",
          tags: ["funksiya", "def", "argument", "return", "qayta ishlatish"],
        },
        {
          slug: "modullar-kutubxonalar",
          title: "Modules and libraries",
          description:
            "Using code others wrote: import, the standard library, and installing third-party packages with pip.",
          difficulty: "beginner",
          tags: ["import", "modul", "kutubxona", "pip", "standart kutubxona"],
        },
      ],
    },
    {
      id: "keyingi",
      title: "The Next Step",
      description: "Errors, files, an intro to OOP, and the road to advanced.",
      lessons: [
        {
          slug: "xatoliklar-va-fayllar",
          title: "Errors and working with files",
          description:
            "Not fearing errors: catching them with try/except; reading and writing files (with), and UTF-8.",
          difficulty: "beginner",
          tags: ["xatolik", "try", "except", "fayl", "with"],
        },
        {
          slug: "oop-va-keyingi-qadamlar",
          title: "Intro to OOP and next steps",
          description:
            "What a class and object are (in a simple example), building your own type; then a 0 → advanced roadmap and a final project.",
          difficulty: "intermediate",
          tags: ["oop", "klass", "obyekt", "loyiha", "yol xaritasi"],
        },
      ],
    },
  ],
};
