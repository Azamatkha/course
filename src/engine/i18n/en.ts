/**
 * English strings — the source-of-truth dictionary.
 *
 * Every other locale is validated against the *shape* of this object
 * (see `Dict` in ../i18n.tsx), so adding a key here is a compile-time
 * reminder to translate it everywhere.
 *
 * Keys are dot-namespaced by area (nav.*, home.*, lesson.*) purely as a
 * naming convention — lookups are flat.
 */
export const en = {
  // Brand / chrome
  "brand.name": "PyForge",
  "footer.line1": "PyForge — advanced Python & AI engineering, fully offline-friendly.",
  "footer.line2": "Built as a static site. Your progress never leaves this browser.",

  // Navigation
  "nav.courses": "Courses",
  "nav.progress": "Progress",
  "nav.bookmarks": "Bookmarks",
  "nav.glossary": "Glossary",
  "nav.about": "About",
  "nav.search": "Search",
  "nav.menu": "Menu",
  "nav.toggleTheme": "Toggle theme",
  "nav.language": "Language",
  "nav.skipToContent": "Skip to content",

  // Difficulty labels
  "difficulty.beginner": "beginner",
  "difficulty.intermediate": "intermediate",
  "difficulty.advanced": "advanced",
  "difficulty.expert": "expert",

  // Shared units
  "unit.read": "read",
  "unit.min": "{n} min",
  "unit.lessons": "lessons",
  "unit.sections": "sections",
  "unit.ofReading": "of reading",
  "unit.complete": "complete",
  "unit.day": "day",
  "unit.days": "days",
  "unit.step": "Step",

  // Home
  "home.badge": "{lessons} in-depth lessons · {time} of reading",
  "home.title.pre": "Become an advanced Python & AI",
  "home.title.accent": "engineer",
  "home.title.post": ".",
  "home.subtitle":
    "Book-quality courses on Python internals, Django, FastAPI, AI engineering, and Docker. No videos, no fluff — deep written lessons with diagrams, real code, interview questions, and exercises. Everything runs in your browser and your progress stays on your device.",
  "home.continue": "Continue learning",
  "home.start": "Start learning",
  "home.browse": "Browse courses",
  "home.stat.completed": "Lessons completed",
  "home.stat.streak": "Daily streak",
  "home.stat.streakHint": "Open any lesson today to keep it going.",
  "home.stat.curriculum": "Total curriculum",
  "home.stat.curriculumHint": "Estimated deep-reading time across all courses.",
  "home.continueHeading": "Continue where you left off",
  "home.roadmap": "Learning roadmap",
  "home.roadmapHint":
    "A recommended order across the whole platform — foundations first, then the specialisations that build on them.",
  "home.featured": "Featured lessons",
  "home.tipsHeading": "How to get the most out of this",
  "home.tip1":
    "Type every code example yourself — reading code is not the same skill as writing it.",
  "home.tip2":
    "After each lesson, explain the core idea out loud in one minute. If you can't, re-read the summary.",
  "home.tip3":
    "Do the debugging exercises. Production engineering is 80% reading and fixing existing code.",
  "home.tip4":
    "Interview questions in each lesson are real. Practice answering them before peeking at the material again.",

  // Courses index
  "courses.title": "Courses",
  "courses.subtitle":
    "Five tracks that together cover the modern Python backend and AI stack. Work through them in order, or jump to what you need.",
  "courses.progress": "Progress",
  "courses.open": "Open course",

  // Course page
  "course.completeSuffix": "complete",
  "course.lessonRead": "read",
  "course.start": "Start course",
  "course.resume": "Resume",
  "course.upNext": "Up next",

  // Lesson page
  "lesson.breadcrumbCourses": "Courses",
  "lesson.of": "Lesson {index} of {total}",
  "lesson.bookmark": "Bookmark",
  "lesson.bookmarked": "Bookmarked",
  "lesson.markComplete": "Mark complete",
  "lesson.completed": "Completed",
  "lesson.previous": "Previous",
  "lesson.next": "Next",
  "lesson.onThisPage": "On this page",
  "lesson.markIncomplete": "Mark as unread",
  "lesson.pager": "Lesson navigation",
  "lesson.finishTitle": "Finished this lesson?",
  "lesson.finishHint": "Mark it complete to track your progress and keep your streak.",
  "lesson.doneTitle": "Lesson complete",
  "lesson.doneHint": "Nice work — this one counts towards your course progress.",

  // Progress page
  "progress.title": "Your progress",
  "progress.subtitle": "Stored locally in this browser — nothing leaves your device.",
  "progress.reset": "Reset progress",
  "progress.resetConfirm": "Reset all progress? This cannot be undone.",
  "progress.overall": "Overall completion",
  "progress.completedOf": "{done} of {total} lessons completed",
  "progress.activeDays":
    "{n} active learning days total. Open any lesson to log today.",
  "progress.activeDay":
    "{n} active learning day total. Open any lesson to log today.",
  "progress.byCourse": "By course",
  "progress.recentlyCompleted": "Recently completed",
  "progress.nothingCompleted":
    "Nothing completed yet. Open a lesson and hit “Mark complete” when you're done.",

  // Bookmarks page
  "bookmarks.title": "Bookmarks",
  "bookmarks.subtitle": "Lessons you saved to revisit. Stored locally in this browser.",
  "bookmarks.empty": "No bookmarks yet",
  "bookmarks.emptyHint":
    "Use the “Bookmark” button at the top of any lesson to save it here.",

  // Search page
  "search.title": "Search",
  "search.subtitle": "Search every lesson — titles, concepts, headings, and full text.",
  "search.placeholder": "Try “decorator”, “RAG”, “Dockerfile”, “event loop”…",
  "search.noResults": "No lessons match “{query}”. Try a broader term.",

  // Glossary page
  "glossary.title": "Glossary",
  "glossary.subtitle":
    "{count} core engineering terms, each linked to the lesson that covers it in depth.",
  "glossary.filter": "Filter terms…",
  "glossary.readLesson": "Read the lesson",
  "glossary.noMatch": "No terms match “{query}”.",

  // About page
  "about.title": "About PyForge",
  "about.intro":
    "PyForge is a written-first learning platform for engineers who want to go from “I can write Python” to “I understand what Python is doing” — and then build real AI systems and ship them in containers. The curriculum spans Python internals, Python foundations, Django, FastAPI, AI engineering, and Docker.",
  "about.principlesHeading": "Principles",
  "about.p1.title": "Depth over coverage",
  "about.p1.body":
    "Each lesson reads like a chapter of a serious engineering book: internals, tradeoffs, failure modes, and production context — not a syntax cheat sheet.",
  "about.p2.title": "Explain why, not just how",
  "about.p2.body":
    "Knowing that a tool exists is trivia. Knowing when it fails — and why — is engineering. Every concept comes with intuition and a real-life analogy.",
  "about.p3.title": "Interview- and production-ready",
  "about.p3.body":
    "Every lesson ends with real interview questions and production scenarios, because that is where this knowledge is actually tested.",
  "about.p4.title": "Fully local & multilingual",
  "about.p4.body":
    "The whole platform is a static site available in English and Uzbek. Lessons ship as markdown in the bundle; progress and bookmarks live in localStorage. No accounts, no tracking, no server.",
  "about.structureHeading": "How lessons are structured",
  "about.structureBody":
    "Every lesson follows the same spine: learning objectives and prerequisites, deep theory with diagrams and analogies, annotated code from basic to production, common mistakes, best practices, performance and memory notes, production tips, interview questions, a summary, and a full exercise block — easy through hard, debugging, refactoring, a mini project, and a quiz with answers.",
  "about.techHeading": "Tech",
  "about.techBody":
    "Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Markdown, Prism, and Mermaid. Fully internationalised (i18n) with instant language switching. Deploys as a static bundle to any host — Vercel works with zero configuration.",

  // Not found
  "notfound.code": "404",
  "notfound.title": "Page not found",
  "notfound.body": "The page you're looking for doesn't exist or was moved.",
  "notfound.back": "Back to home",
} as const;

export type DictKey = keyof typeof en;
