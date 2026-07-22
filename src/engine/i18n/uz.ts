import type { DictKey } from "./en";

/**
 * Uzbek (O‘zbekcha) translations.
 *
 * Typed as `Record<DictKey, string>` so a missing or misspelled key is a
 * TypeScript error — the compiler keeps every locale in lock-step with `en`.
 * Placeholders like {n}, {lessons}, {time} must be preserved verbatim.
 */
export const uz: Record<DictKey, string> = {
  // Brand / chrome
  "brand.name": "PyForge",
  "footer.line1": "PyForge — chuqur Python va AI muhandisligi, to‘liq oflayn ishlaydi.",
  "footer.line2": "Statik sayt sifatida qurilgan. Sizning natijalaringiz brauzeringizdan chiqmaydi.",

  // Navigation
  "nav.courses": "Kurslar",
  "nav.progress": "Natijalar",
  "nav.bookmarks": "Xatcho‘plar",
  "nav.glossary": "Lug‘at",
  "nav.about": "Loyiha haqida",
  "nav.search": "Qidiruv",
  "nav.menu": "Menyu",
  "nav.toggleTheme": "Mavzuni almashtirish",
  "nav.language": "Til",
  "nav.skipToContent": "Asosiy qismga o‘tish",

  // Difficulty labels
  "difficulty.beginner": "boshlang‘ich",
  "difficulty.intermediate": "o‘rta",
  "difficulty.advanced": "murakkab",
  "difficulty.expert": "ekspert",

  // Shared units
  "unit.read": "o‘qish",
  "unit.min": "{n} daqiqa",
  "unit.lessons": "dars",
  "unit.sections": "bo‘lim",
  "unit.ofReading": "o‘qish",
  "unit.complete": "bajarildi",
  "unit.day": "kun",
  "unit.days": "kun",
  "unit.step": "Bosqich",

  // Home
  "home.badge": "{lessons} ta chuqur dars · {time} o‘qish",
  "home.title.pre": "Yuqori darajali Python va AI",
  "home.title.accent": "muhandisi",
  "home.title.post": " bo‘ling.",
  "home.subtitle":
    "Python ichki tuzilishi, Django, FastAPI, AI muhandisligi va Docker bo‘yicha kitob sifatidagi kurslar. Videosiz, ortiqcha gapsiz — diagrammalar, haqiqiy kod, intervyu savollari va mashqlar bilan chuqur yozma darslar. Hammasi brauzeringizda ishlaydi va natijalaringiz qurilmangizda qoladi.",
  "home.continue": "Davom ettirish",
  "home.start": "Boshlash",
  "home.browse": "Kurslarni ko‘rish",
  "home.stat.completed": "Tugatilgan darslar",
  "home.stat.streak": "Kunlik seriya",
  "home.stat.streakHint": "Seriyani saqlab qolish uchun bugun istalgan darsni oching.",
  "home.stat.curriculum": "Umumiy dastur",
  "home.stat.curriculumHint": "Barcha kurslar bo‘yicha taxminiy chuqur o‘qish vaqti.",
  "home.continueHeading": "To‘xtagan joyingizdan davom eting",
  "home.roadmap": "O‘quv yo‘l xaritasi",
  "home.roadmapHint":
    "Butun platforma bo‘yicha tavsiya etilgan tartib — avval asoslar, keyin ularga tayanadigan yo‘nalishlar.",
  "home.featured": "Tanlangan darslar",
  "home.tipsHeading": "Bundan qanday maksimal foyda olish mumkin",
  "home.tip1":
    "Har bir kod misolini o‘zingiz yozing — kodni o‘qish uni yozish bilan bir xil mahorat emas.",
  "home.tip2":
    "Har bir darsdan so‘ng asosiy g‘oyani bir daqiqada ovoz chiqarib tushuntiring. Agar uddalay olmasangiz, xulosani qayta o‘qing.",
  "home.tip3":
    "Xatolarni tuzatish mashqlarini bajaring. Ishlab chiqarish muhandisligining 80% — mavjud kodni o‘qish va tuzatishdir.",
  "home.tip4":
    "Har bir darsdagi intervyu savollari haqiqiy. Materialga qayta qaramasdan javob berishni mashq qiling.",

  // Courses index
  "courses.title": "Kurslar",
  "courses.subtitle":
    "Zamonaviy Python backend va AI stekini birgalikda qamrab oladigan beshta yo‘nalish. Tartib bilan o‘ting yoki kerakli joyga o‘ting.",
  "courses.progress": "Natija",
  "courses.open": "Kursni ochish",

  // Course page
  "course.completeSuffix": "bajarildi",
  "course.lessonRead": "o‘qish",
  "course.start": "Kursni boshlash",
  "course.resume": "Davom etish",
  "course.upNext": "Keyingi",

  // Lesson page
  "lesson.breadcrumbCourses": "Kurslar",
  "lesson.of": "{index}-dars / {total} tadan",
  "lesson.bookmark": "Xatcho‘p",
  "lesson.bookmarked": "Saqlandi",
  "lesson.markComplete": "Bajarildi deb belgilash",
  "lesson.completed": "Bajarildi",
  "lesson.previous": "Oldingi",
  "lesson.next": "Keyingi",
  "lesson.onThisPage": "Ushbu sahifada",
  "lesson.markIncomplete": "O‘qilmagan deb belgilash",
  "lesson.pager": "Darslar bo‘ylab harakat",
  "lesson.finishTitle": "Darsni tugatdingizmi?",
  "lesson.finishHint": "Natijangiz saqlanishi va ketma-ketlik uzilmasligi uchun belgilab qo‘ying.",
  "lesson.doneTitle": "Dars tugallandi",
  "lesson.doneHint": "Barakalla — bu dars kurs natijangizga qo‘shildi.",

  // Progress page
  "progress.title": "Sizning natijalaringiz",
  "progress.subtitle": "Ushbu brauzerda mahalliy saqlanadi — hech narsa qurilmangizdan chiqmaydi.",
  "progress.reset": "Natijalarni tozalash",
  "progress.resetConfirm": "Barcha natijalar tozalansinmi? Buni qaytarib bo‘lmaydi.",
  "progress.overall": "Umumiy bajarilish",
  "progress.completedOf": "{total} tadan {done} ta dars tugatildi",
  "progress.activeDays":
    "Jami {n} ta faol o‘quv kuni. Bugunni belgilash uchun istalgan darsni oching.",
  "progress.activeDay":
    "Jami {n} ta faol o‘quv kuni. Bugunni belgilash uchun istalgan darsni oching.",
  "progress.byCourse": "Kurslar bo‘yicha",
  "progress.recentlyCompleted": "So‘nggi tugatilganlar",
  "progress.nothingCompleted":
    "Hali hech narsa tugatilmagan. Darsni oching va tugatgach “Bajarildi deb belgilash”ni bosing.",

  // Bookmarks page
  "bookmarks.title": "Xatcho‘plar",
  "bookmarks.subtitle": "Qayta ko‘rish uchun saqlangan darslar. Ushbu brauzerda saqlanadi.",
  "bookmarks.empty": "Hali xatcho‘plar yo‘q",
  "bookmarks.emptyHint":
    "Uni bu yerga saqlash uchun istalgan darsning yuqorisidagi “Xatcho‘p” tugmasidan foydalaning.",

  // Search page
  "search.title": "Qidiruv",
  "search.subtitle": "Har bir darsni qidiring — sarlavhalar, tushunchalar, bo‘limlar va to‘liq matn.",
  "search.placeholder": "“decorator”, “RAG”, “Dockerfile”, “event loop” ni sinab ko‘ring…",
  "search.noResults": "“{query}” bo‘yicha darslar topilmadi. Kengroq so‘z sinab ko‘ring.",

  // Glossary page
  "glossary.title": "Lug‘at",
  "glossary.subtitle":
    "{count} ta asosiy muhandislik atamasi, har biri uni chuqur yorituvchi darsga bog‘langan.",
  "glossary.filter": "Atamalarni filtrlash…",
  "glossary.readLesson": "Darsni o‘qish",
  "glossary.noMatch": "“{query}” bo‘yicha atamalar topilmadi.",

  // About page
  "about.title": "PyForge haqida",
  "about.intro":
    "PyForge — “Python yoza olaman”dan “Python nima qilayotganini tushunaman”ga o‘tishni, so‘ngra haqiqiy AI tizimlarini qurib, ularni konteynerlarda ishga tushirishni istagan muhandislar uchun yozma o‘quv platformasi. Dastur Python ichki tuzilishi, Python asoslari, Django, FastAPI, AI muhandisligi va Docker’ni qamrab oladi.",
  "about.principlesHeading": "Tamoyillar",
  "about.p1.title": "Kenglikdan ko‘ra chuqurlik",
  "about.p1.body":
    "Har bir dars jiddiy muhandislik kitobining bobiga o‘xshaydi: ichki tuzilma, murosalar, xatolik holatlari va ishlab chiqarish konteksti — sintaksis shpargalkasi emas.",
  "about.p2.title": "Nafaqat qanday, balki nima uchunligini tushuntirish",
  "about.p2.body":
    "Vositaning mavjudligini bilish — bu shunchaki ma’lumot. U qachon ishlamay qolishini va nima uchunligini bilish — bu muhandislik. Har bir tushuncha intuitsiya va hayotiy o‘xshatish bilan keladi.",
  "about.p3.title": "Intervyu va ishlab chiqarishga tayyor",
  "about.p3.body":
    "Har bir dars haqiqiy intervyu savollari va ishlab chiqarish stsenariylari bilan yakunlanadi, chunki bu bilim aynan shu yerda sinovdan o‘tadi.",
  "about.p4.title": "To‘liq mahalliy va ko‘p tilli",
  "about.p4.body":
    "Butun platforma ingliz va o‘zbek tillarida mavjud statik saytdir. Darslar to‘plamda markdown sifatida keladi; natijalar va xatcho‘plar localStorage’da saqlanadi. Hisoblar yo‘q, kuzatuv yo‘q, server yo‘q.",
  "about.structureHeading": "Darslar qanday tuzilgan",
  "about.structureBody":
    "Har bir dars bir xil tuzilmaga ega: o‘quv maqsadlari va oldingi bilimlar, diagrammalar va o‘xshatishlar bilan chuqur nazariya, oddiydan ishlab chiqarishgacha izohlangan kod, keng tarqalgan xatolar, eng yaxshi amaliyotlar, unumdorlik va xotira eslatmalari, ishlab chiqarish maslahatlari, intervyu savollari, xulosa va to‘liq mashqlar bloki — oson darajadan qiyingacha, xatolarni tuzatish, qayta yozish, mini loyiha va javoblari bilan test.",
  "about.techHeading": "Texnologiyalar",
  "about.techBody":
    "React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Markdown, Prism va Mermaid yordamida qurilgan. To‘liq xalqarolashtirilgan (i18n) va tez tilni almashtirish bilan. Istalgan xostga statik to‘plam sifatida joylashtiriladi — Vercel hech qanday sozlashsiz ishlaydi.",

  // Not found
  "notfound.code": "404",
  "notfound.title": "Sahifa topilmadi",
  "notfound.body": "Siz izlayotgan sahifa mavjud emas yoki ko‘chirilgan.",
  "notfound.back": "Bosh sahifaga qaytish",
};
