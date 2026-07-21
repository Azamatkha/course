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
      description: "Errors, files, and an intro to classes (OOP).",
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
          title: "Intro to classes (OOP)",
          description:
            "What a class and object are, building your own type with __init__ and methods — the foundation of OOP.",
          difficulty: "intermediate",
          tags: ["oop", "klass", "obyekt", "init", "metod"],
        },
        {
          slug: "klasslar-chuqurroq",
          title: "Classes deeper: inheritance and dunder methods",
          description:
            "Inheritance (reusing a class), super(), __str__, and encapsulation — writing classes that feel natural.",
          difficulty: "intermediate",
          tags: ["meros", "inheritance", "super", "__str__", "klass"],
        },
      ],
    },
    {
      id: "amaliy",
      title: "Practical & Intermediate Topics",
      description: "Comprehensions, JSON/CSV files, virtual environments, APIs, and debugging.",
      lessons: [
        {
          slug: "comprehension-lambda",
          title: "List comprehension and lambda",
          description:
            "Building lists in one line with comprehensions, and tiny anonymous functions (lambda) with map/filter/sorted.",
          difficulty: "intermediate",
          tags: ["comprehension", "lambda", "map", "filter", "sorted"],
        },
        {
          slug: "json-csv-fayllar",
          title: "Working with JSON and CSV files",
          description:
            "Reading and writing structured data: the json module, CSV files, and safely round-tripping real data.",
          difficulty: "intermediate",
          tags: ["json", "csv", "fayl", "malumot", "serializatsiya"],
        },
        {
          slug: "virtual-muhit-loyiha",
          title: "Virtual environments and project structure",
          description:
            "Why venv exists, requirements.txt, organizing a real project into files, and avoiding dependency chaos.",
          difficulty: "intermediate",
          tags: ["venv", "virtual muhit", "pip", "requirements", "loyiha"],
        },
        {
          slug: "api-va-requests",
          title: "Getting data from the internet (APIs & requests)",
          description:
            "What an API is, calling one with the requests library, reading JSON responses, and handling errors.",
          difficulty: "intermediate",
          tags: ["api", "requests", "internet", "json", "http"],
        },
        {
          slug: "debugging-toza-kod",
          title: "Finding bugs (debugging) and clean code",
          description:
            "Reading error messages (traceback), debugging with print and breakpoints, and habits for readable code.",
          difficulty: "intermediate",
          tags: ["debugging", "traceback", "toza kod", "print", "xato"],
        },
      ],
    },
    {
      id: "ai-ml",
      title: "Toward AI (ML & LLMs)",
      description: "Gentle, beginner-friendly intros to machine learning, LLMs, and AI with Python.",
      lessons: [
        {
          slug: "ml-kirish",
          title: "Intro to Machine Learning (ML)",
          description:
            "What machine learning really is (learning from examples), the main types, and where it fits — no heavy math.",
          difficulty: "intermediate",
          tags: ["ml", "mashinaviy oqitish", "sun'iy intellekt", "model", "data"],
        },
        {
          slug: "llm-kirish",
          title: "How LLMs and ChatGPT work",
          description:
            "What a large language model is, tokens and next-word prediction, why they hallucinate — in plain language.",
          difficulty: "intermediate",
          tags: ["llm", "chatgpt", "token", "ai", "bashorat"],
        },
        {
          slug: "python-ai-birinchi-qadam",
          title: "Python + AI: your first practical step",
          description:
            "Calling an AI model from Python (the idea), API keys, a simple example, and a 0 → advanced roadmap and final project.",
          difficulty: "intermediate",
          tags: ["ai", "python", "api", "openai", "yol xaritasi"],
        },
      ],
    },
  ],
};
