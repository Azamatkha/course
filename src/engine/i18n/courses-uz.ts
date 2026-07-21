import type { CourseId } from "../types";
import type { CourseL10n } from "../localize";

/**
 * Uzbek translations for course / section / lesson metadata.
 *
 * Only titles and descriptions live here (lesson bodies are markdown files).
 * Any key omitted falls back to the English value in the course definition,
 * so this map can grow incrementally without breaking anything.
 */
export const coursesUz: Partial<Record<CourseId, CourseL10n>> = {
  "python-noldan": {
    title: "Python — Noldan Boshlab",
    tagline: "Mutlaqo noldan Advanced darajagacha",
    description:
      "Dasturlashni umuman bilmaydiganlar uchun to‘liq o‘zbek tilidagi kurs. Har bir tushuncha eng oddiy tilda, hayotiy misollar bilan tushuntiriladi. O‘zgaruvchilardan boshlab funksiyalar, ma’lumot tuzilmalari, xatoliklar, fayllar va OOP’gacha — bosqichma-bosqich, ko‘p mashqlar bilan. Ushbu kursni tugatib, Python asoslarini, keyingi kurslarni (Python Fundamentals, Django, FastAPI, AI) o‘zlashtirishga tayyor bo‘lasiz.",
    level: "Nol → O‘rta",
    sections: {
      kirish: {
        title: "Kirish",
        description: "Python nima, nega kerak va uni qanday ishga tushirish.",
      },
      asoslar: {
        title: "Asoslar",
        description: "O‘zgaruvchilar, shartlar va sikllar — dasturlashning poydevori.",
      },
      malumotlar: {
        title: "Ma’lumotlar bilan ishlash",
        description: "Ro‘yxatlar, lug‘atlar va matn (satr) bilan ishlash.",
      },
      funksiyalar: {
        title: "Funksiyalar va modullar",
        description: "Kodni qayta ishlatiladigan bo‘laklarga bo‘lish va kutubxonalardan foydalanish.",
      },
      keyingi: {
        title: "Keyingi bosqich",
        description: "Xatoliklar, fayllar va klasslarga (OOP) kirish.",
      },
      amaliy: {
        title: "Amaliy va o‘rta darajadagi mavzular",
        description: "Comprehension, JSON/CSV fayllar, virtual muhit, API va debugging.",
      },
      "ai-ml": {
        title: "Sun’iy intellekt sari (ML va LLM)",
        description: "Mashinaviy o‘qitish, LLM va Python bilan AI’ga sodda kirish.",
      },
    },
    lessons: {
      "python-nima": {
        title: "Python nima va nega kerak?",
        description:
          "Dasturlash nima, Python nima uchun eng qulay boshlash tili, u qayerda ishlatiladi — hammasi oddiy tilda.",
      },
      "ornatish-birinchi-dastur": {
        title: "Python o‘rnatish va birinchi dastur",
        description:
          "Python’ni kompyuterga o‘rnatish, muharrir tanlash, birinchi 'Salom, dunyo!' dasturini yozish va ishga tushirish.",
      },
      "ozgaruvchilar-va-turlar": {
        title: "O‘zgaruvchilar va ma’lumot turlari",
        description:
          "O‘zgaruvchi nima (qutilar analogiyasi), son, matn, mantiqiy qiymatlar, input/print va operatorlar — birinchi haqiqiy kod.",
      },
      shartlar: {
        title: "Shartli operatorlar (if / elif / else)",
        description:
          "Dasturga qaror qabul qilishni o‘rgatish: if/elif/else, taqqoslash va mantiqiy operatorlar, hayotiy misollar bilan.",
      },
      sikllar: {
        title: "Sikllar (for va while)",
        description:
          "Takrorlanadigan ishlarni avtomatlashtirish: for va while sikllari, range, break/continue va cheksiz sikl xavfi.",
      },
      royxatlar: {
        title: "Ro‘yxatlar (list)",
        description:
          "Ko‘p qiymatni bitta joyda saqlash: ro‘yxat yaratish, indeks, qo‘shish/o‘chirish, aylanib chiqish va keng tarqalgan xatolar.",
      },
      "lugat-tuple-set": {
        title: "Lug‘at, tuple va to‘plam (set)",
        description:
          "Kalit-qiymat juftliklari (dict), o‘zgarmas ro‘yxat (tuple) va takrorlanmas to‘plam (set) — qachon qaysi birini ishlatish.",
      },
      satrlar: {
        title: "Satrlar (matn) bilan ishlash",
        description:
          "Matnni formatlash, bo‘lish, birlashtirish, qidirish; f-string, foydali metodlar va Unicode haqida sodda tushuncha.",
      },
      funksiyalar: {
        title: "Funksiyalar",
        description:
          "Kodni qayta ishlatiladigan bo‘laklarga bo‘lish: funksiya yozish, argumentlar, return, standart qiymatlar — retsept analogiyasi bilan.",
      },
      "modullar-kutubxonalar": {
        title: "Modullar va kutubxonalar",
        description:
          "Boshqalar yozgan koddan foydalanish: import, standart kutubxona, pip bilan tashqi paketlar o‘rnatish.",
      },
      "xatoliklar-va-fayllar": {
        title: "Xatoliklar va fayllar bilan ishlash",
        description:
          "Xatoliklardan qo‘rqmaslik: try/except bilan ularni ushlash; fayllarni o‘qish va yozish (with), UTF-8.",
      },
      "oop-va-keyingi-qadamlar": {
        title: "Klasslarga kirish (OOP)",
        description:
          "Klass va obyekt nima (oddiy misolda), __init__ va metodlar bilan o‘z tipingizni yaratish — OOP poydevori.",
      },
      "klasslar-chuqurroq": {
        title: "Klasslar chuqurroq: meros va dunder metodlar",
        description:
          "Meros (klassni qayta ishlatish), super(), __str__ va inkapsulyatsiya — tabiiy his qildiradigan klasslar yozish.",
      },
      "comprehension-lambda": {
        title: "List comprehension va lambda",
        description:
          "Ro‘yxatni bir qatorda yasash (comprehension) va kichik anonim funksiyalar (lambda) — map/filter/sorted bilan.",
      },
      "json-csv-fayllar": {
        title: "JSON va CSV fayllar bilan ishlash",
        description:
          "Tuzilgan ma’lumotni o‘qish/yozish: json moduli, CSV fayllar va real ma’lumotni xavfsiz saqlash.",
      },
      "virtual-muhit-loyiha": {
        title: "Virtual muhit va loyihani tashkil qilish",
        description:
          "venv nega kerak, requirements.txt, loyihani fayllar bo‘yicha tashkil qilish va bog‘liqlik chalkashligidan qochish.",
      },
      "api-va-requests": {
        title: "Internetdan ma’lumot olish (API va requests)",
        description:
          "API nima, requests kutubxonasi bilan chaqirish, JSON javobni o‘qish va xatolarni boshqarish.",
      },
      "debugging-toza-kod": {
        title: "Xatolarni topish (debugging) va toza kod",
        description:
          "Xato xabarini (traceback) o‘qish, print va breakpoint bilan xato topish va o‘qilishi oson kod odatlari.",
      },
      "ml-kirish": {
        title: "Mashinaviy o‘qitish (ML) ga kirish",
        description:
          "Mashinaviy o‘qitish aslida nima (misollardan o‘rganish), asosiy turlari va qayerda ishlatiladi — og‘ir matematikasiz.",
      },
      "llm-kirish": {
        title: "LLM va ChatGPT qanday ishlaydi",
        description:
          "Katta til modeli nima, tokenlar va keyingi so‘zni bashorat qilish, nega ‘to‘qib chiqaradi’ — oddiy tilda.",
      },
      "python-ai-birinchi-qadam": {
        title: "Python bilan AI: birinchi amaliy qadam",
        description:
          "Python’dan AI modelini chaqirish (g‘oyasi), API kalit, oddiy misol va 0 → Advanced yo‘l xaritasi hamda yakuniy loyiha.",
      },
    },
  },

  "python-foundations": {
    title: "Python Asoslari",
    tagline: "Boshlang‘ichdan keyingi professional poydevor",
    description:
      "Asosiy sintaksisni allaqachon biladiganlar uchun o‘rta daraja kursi. Har bir backend, Django, FastAPI va AI dasturchisi bilishi shart bo‘lgan professional Python’ni o‘rgatadi: funksiyalar va argumentlar, closure va dekoratorlar, iteratorlar va generatorlar, kontekst menejerlar, paketlar, xatoliklarni boshqarish, dataclass va typing, OOP, SOLID, testlash va unumdorlik.",
    level: "Boshlang‘ich+ → O‘rta",
    sections: {
      functions: { title: "Funksiyalar va ko‘rinish sohasi", description: "Funksiya aslida nima: argumentlar, *args/**kwargs, scope va closure." },
      iteration: { title: "Iteratsiya va dangasa hisoblash", description: "Iteratorlar, generatorlar, comprehension — xotirani tejaydigan vositalar." },
      structure: { title: "Kodni tuzilishlash", description: "Modullar, paketlar, importlar va ishonchli xatoliklarni boshqarish." },
      data: { title: "Ma’lumotlar, fayllar va tiplar", description: "Fayllar, JSON, dataclass, enum va type hint — ma’lumotni toza modellashtirish." },
      oop: { title: "OOP va dizayn", description: "Klasslar, ABC, Protocol, SOLID, toza kod va muhim patternlar." },
      quality: { title: "Sifat va unumdorlik", description: "Logging, pytest bilan testlash va profillash — ishonchli va tez kod." },
    },
    lessons: {
      "functions-arguments-scope": { title: "Funksiyalar, argumentlar va scope", description: "Pozitsion va kalitli argumentlar, standart qiymatlar tuzog‘i, *args va **kwargs, unpacking va LEGB bo‘yicha nom aniqlash." },
      "closures-and-decorators": { title: "Closure va dekoratorlar", description: "Closure o‘zgaruvchilarni qanday saqlaydi, so‘ng dekoratorlar noldan — sovg‘a o‘rash analogiyasi, functools.wraps va amaliy dekoratorlar." },
      "iterators-generators-comprehensions": { title: "Iteratorlar, generatorlar va comprehension", description: "Iterator protokoli, generator funksiyalar (fabrika analogiyasi), comprehension va ma’lumotni oqim sifatida ishlash." },
      "context-managers": { title: "Kontekst menejerlar", description: "with operatori, __enter__/__exit__, contextlib va kafolatlangan tozalash — resurslar har doim yopiladi." },
      "modules-packages-imports": { title: "Modullar, paketlar va importlar", description: "import qanday ishlaydi, absolyut va nisbiy importlar, __init__.py, aylanma importlar va __name__ == '__main__'." },
      "error-handling": { title: "Xatoliklarni to‘g‘ri boshqarish", description: "Boshqaruv sifatida istisnolar, EAFP va LBYL, o‘z istisno ierarxiyangiz, try/except/else/finally va istisnolarni zanjirlash." },
      "files-and-json": { title: "Fayllar, JSON va serializatsiya", description: "pathlib bilan fayllarni o‘qish/yozish, kodlashlar, JSON moduli, katta fayllarni oqim sifatida ishlash." },
      "dataclasses-enums-typing": { title: "Dataclass, Enum va Typing", description: "@dataclass bilan ma’lumot modeli, Enum bilan tayin tanlovlar va type hint, Optional, Union, generics — mypy tekshiruvi." },
      "oop-abc-protocols": { title: "OOP, ABC va Protocol", description: "Klass va obyektlar, meros va kompozitsiya, dunder metodlar, abstrakt bazaviy klasslar va Protocol strukturaviy tipizatsiya." },
      "solid-clean-code-patterns": { title: "SOLID, Toza Kod va Dizayn Patternlar", description: "Beshta SOLID tamoyili Python misollarida, dependency injection (rozetka analogiyasi) va Python haqiqatan ishlatadigan patternlar." },
      "logging-and-testing": { title: "Logging va Pytest bilan testlash", description: "print() o‘rniga tizimli logging va pytest bilan haqiqiy testlar: fixture, parametrize, mock va coverage." },
      "performance-and-memory": { title: "Unumdorlik, Xotira va Eng Yaxshi Amaliyotlar", description: "Amaliyotda Big-O, to‘g‘ri ma’lumot tuzilmasi, cProfile va timeit bilan profillash, __slots__ bilan xotira." },
    },
  },

  "ai-python": {
    title: "Python bilan AI Muhandisligi",
    tagline: "Ishlab chiqarish uchun LLM ilovalari, RAG va agentlar",
    description:
      "Amaliy AI muhandisligi kursi — mashinaviy o‘qitish bo‘yicha nazariy kurs emas. Zamonaviy LLM ilovalari Python’da qanday qurilishini o‘rganasiz: tokenlar va embeddinglar, vektor bazalari va RAG, prompt muhandisligi, function calling va strukturaviy chiqishlar, OpenAI/Anthropic/Gemini API’lari, Ollama bilan lokal modellar, LangChain, LangGraph, MCP, agentlar, xotira, streaming, xavfsizlik, xarajat va ishlab chiqarishga joylashtirish.",
    level: "O‘rta → Murakkab",
    sections: {
      foundations: { title: "AI Muhandisligi Asoslari", description: "AI muhandisi aslida nima quradi va LLM matnni matnga qanday aylantiradi." },
      retrieval: { title: "Qidiruv va RAG", description: "Modelga o‘qitilmagan bilim berish: vektor bazalari va RAG." },
      prompting: { title: "Prompting va Strukturaviy I/O", description: "Model xatti-harakatini boshqarish: prompt muhandisligi, strukturaviy chiqishlar va tool calling." },
      providers: { title: "Provayderlar, Lokal Modellar va Streaming", description: "Barcha yirik provayderlar bilan ishlash, modellarni lokal ishlatish va async streaming." },
      orchestration: { title: "Orkestratsiya va Agentlar", description: "Modellar, vositalar va xotirani stateful ish oqimlari va avtonom agentlarga birlashtirish." },
      production: { title: "Ishlab chiqarishdagi AI", description: "Xavfsizlik, xarajat, baholash va joylashtirish — demo bilan haqiqiy tizim orasidagi hamma narsa." },
    },
    lessons: {
      "modern-ai-landscape": { title: "Zamonaviy AI Manzarasi va AI Muhandisi", description: "LLM’lar qayerga to‘g‘ri keladi, AI muhandisi ML muhandisidan farqi, model/provayder ekotizimi va real AI ilovasining tuzilishi." },
      "llm-fundamentals": { title: "LLM’lar Aslida Qanday Ishlaydi", description: "Keyingi tokenni bashorat qilish, kontekst oynasi, temperature, modellar nega 'to‘qib chiqaradi' va uning intuitsiyasi." },
      "tokens-and-embeddings": { title: "Tokenlar, Embeddinglar va Vektor Fazosi", description: "Tokenizatsiya va nega u xarajat/limitga ta’sir qiladi, embedding nima, kosinus o‘xshashlik va ma’no qanday geometriyaga aylanadi." },
      "vector-databases": { title: "Vektor Bazalari", description: "Embeddinglarni katta hajmda saqlash va qidirish: indekslar (HNSW, IVF), metadata filtri, chunking va bazani tanlash." },
      "rag-systems": { title: "Retrieval-Augmented Generation (RAG)", description: "To‘liq RAG quvuri: yuklash, chunk, embed, qidirish, rerank va generatsiya. Sodda RAG nega ishlamaydi va to‘g‘risini qurish." },
      "prompt-engineering": { title: "Prompt Muhandisligi", description: "System va user xabarlari, few-shot misollar, chain-of-thought, prompt shablonlari va promptlarni kod kabi baholash." },
      "structured-outputs-and-tools": { title: "Strukturaviy Chiqishlar va Function Calling", description: "Pydantic sxemalari bilan yaroqli JSON’ni majburlash, tool calling bilan modelga kodingizni chaqirtirish va tool-loop qurish." },
      "provider-apis": { title: "OpenAI, Anthropic va Gemini API’lari", description: "Uch yirik provayder SDK’si uchun yagona fikrlash modeli: xabarlar, rollar, parametrlar, xatolar va provayderdan mustaqil klient." },
      "local-llms-ollama": { title: "Ollama bilan Lokal LLM’lar", description: "Ochiq modellarni Ollama bilan o‘z mashinangizda ishlatish: kvantlash, OpenAI-mos endpoint, maxfiylik va qachon lokal afzal." },
      "streaming-and-async": { title: "Streaming va Async AI Ilovalari", description: "Async generatorlar bilan token streaming, SSE, asyncio.gather bilan konkurentlik va tez javob beruvchi AI backendlari." },
      "langchain-langgraph-mcp": { title: "LangChain, LangGraph va MCP", description: "Freymvorklar qachon foydali va qachon zararli: LCEL zanjirlari, LangGraph holat mashinalari va MCP protokoli." },
      "ai-agents": { title: "AI Agentlar va Ko‘p-Agentli Tizimlar", description: "Agent halqasi (fikrla → harakat → kuzat), tool use, xotira, rejalashtirish, ko‘p-agentli hamkorlik va cheklovlar." },
      "ai-in-production": { title: "Xavfsizlik, Xarajat va Ishlab Chiqarish", description: "Prompt injection va himoya, PII, keshlash va token byudjeti, baholash va kuzatuv, rate-limit va ishonchli joylashtirish." },
      "capstone-ai-assistant": { title: "Yakuniy Loyiha: Ishlab Chiqarish RAG Agenti", description: "Hammasini bitta tizimga jamlash: async, streaming, tool ishlatuvchi, xotirali RAG agenti — xarajat nazorati va testlar bilan." },
    },
  },

  "docker-python": {
    title: "Python Dasturchilari uchun Docker",
    tagline: "Python’ni to‘g‘ri konteynerlash va yetkazish",
    description:
      "Python’ga yo‘naltirilgan to‘liq Docker kursi. Konteynerlarni noldan o‘rganasiz — imijlar, qatlamlar, volume, tarmoqlar, Dockerfile va Docker Compose — so‘ng buni real Python ishiga qo‘llaysiz: FastAPI va Django’ni konteynerlash, PostgreSQL, Redis va Nginx, ko‘p bosqichli build, optimizatsiya, xavfsizlik, healthcheck, debug, dev va prod oqimlari va yakuniy loyiha.",
    level: "Boshlang‘ich → Murakkab",
    sections: {
      fundamentals: { title: "Docker Asoslari", description: "Fikrlash modeli: konteyner nima, imij va konteyner farqi, qatlamlar." },
      runtime: { title: "Ma’lumot va Tarmoq", description: "Volume bilan ma’lumotni saqlash va tarmoqlar bilan konteynerlarni ulash." },
      "python-apps": { title: "Python Ilovalarni Konteynerlash", description: "FastAPI va Django’ni ma’lumot bazasi va keshi bilan qadoqlash." },
      optimization: { title: "Optimizatsiya va Xavfsizlik", description: "Kichik, tez, xavfsiz imijlar: ko‘p bosqichli build va himoyalash." },
      operations: { title: "Operatsiya va Yetkazish", description: "Debug, healthcheck, dev va prod, hamda real joylashtirish." },
    },
    lessons: {
      "docker-fundamentals": { title: "Docker Asoslari: Imij, Konteyner va Qatlamlar", description: "Konteyner va virtual mashina farqi (yuk konteyneri analogiyasi), imij va konteyner, qatlamli fayl tizimi va birinchi Python konteyneri." },
      "images-and-dockerfile": { title: "Imijlar va Dockerfile", description: "Har bir muhim Dockerfile ko‘rsatmasi, bazaviy imij tanlash (slim va alpine), build kesh, .dockerignore." },
      "volumes-and-networks": { title: "Volume va Tarmoqlar", description: "Konteynerlar nega vaqtinchalik, named volume va bind mount, tarmoq va DNS, portlarni ochish." },
      "docker-compose": { title: "Docker Compose", description: "Butun stekni bitta YAML’da: servislar, depends_on, environment, healthcheck va kundalik Compose oqimi." },
      "dockerizing-fastapi-django": { title: "FastAPI va Django’ni Konteynerlash", description: "Ikkala freymvork uchun ishlab chiqarishga mos imijlar: Uvicorn/Gunicorn, migratsiyalar, static fayllar va entrypoint." },
      "postgres-redis-nginx": { title: "PostgreSQL, Redis va Nginx", description: "Haqiqiy baza, kesh/broker va teskari proksi: doimiy Postgres, Celery uchun Redis va oldida Nginx." },
      "multi-stage-and-optimization": { title: "Ko‘p Bosqichli Build va Optimizatsiya", description: "Ko‘p bosqichli build bilan imijni keskin kichraytirish, qatlamlarni kesh uchun tartiblash va BuildKit." },
      "security-and-best-practices": { title: "Xavfsizlik va Eng Yaxshi Amaliyotlar", description: "Non-root sifatida ishlatish, versiyalarni qotirish va CVE skanerlash, sirlarni imijdan chiqarish, huquqlarni cheklash." },
      "debugging-and-healthchecks": { title: "Debug, Logging va Healthcheck", description: "Loglarni o‘qish va konteynerga kirish, HEALTHCHECK va tayyorlik, resurs limitlari va restart siyosatlari." },
      "dev-vs-prod-and-capstone": { title: "Dev va Prod Oqimi va Yakuniy Joylashtirish", description: "Dev uchun hot-reload va prod uchun qotirilgan Compose override, CI build, teglash va registrylar." },
    },
  },

  python: {
    title: "Chuqur Python (Advanced)",
    tagline: "Sintaksisdan CPython ichki tuzilishigacha",
    description:
      "Backend muhandislari uchun ichki tuzilishga asoslangan chuqur Python kursi. CPython kodingizni qanday bajarishini, obyektlar xotirada qanday yashashini va funksiyalar, iteratorlar, typing hamda konkurentlikni professional darajada ishlatishni o‘rganasiz.",
    level: "O‘rta → Ekspert",
    sections: {
      foundations: { title: "Bajarilish Modeli va Xotira", description: "Python kodni ishga tushirganda aslida nima bo‘ladi: bytecode, obyektlar, havolalar va o‘zgaruvchanlik." },
      functions: { title: "Funksiyalar, Scope va Dekoratorlar", description: "Birinchi darajali obyekt sifatida funksiyalar: argumentlar, LEGB, closure va dekoratorlar." },
      iteration: { title: "Iteratorlar va Generatorlar", description: "Dangasa hisoblash: iterator protokoli, generatorlar va oqim quvurlari." },
      oop: { title: "OOP va Ma’lumot Modeli", description: "Sehrli metodlar, protokollar va Python klasslarini native his qildirish." },
      typing: { title: "Typing", description: "Katta kodbazalar uchun statik tipizatsiya: hintlar, generics va protokollar." },
      concurrency: { title: "Konkurentlik", description: "asyncio, oqimlar, jarayonlar va GIL — to‘g‘ri vositani tanlash." },
      production: { title: "Ishlab Chiqarish Python", description: "Xatolar, logging va kuzatuv — odamlar tayanadigan servislar uchun." },
    },
    lessons: {
      "python-execution-model": { title: "Python Kodni Qanday Bajaradi", description: "Manba → tokenlar → AST → bytecode → CPython baholash halqasi. 'Interpretatsiya' nega chalg‘ituvchi va bu unumdorlikka ta’siri." },
      "variables-objects-references": { title: "O‘zgaruvchilar, Obyektlar va Havolalar", description: "Nomlar qutilar emas. Reference counting, ayniyat va tenglik, interning va 'g‘alati' xatti-harakatni tushuntiruvchi obyekt modeli." },
      "mutability-and-copies": { title: "O‘zgaruvchanlik, Aliasing va Nusxalar", description: "O‘zgaruvchan va o‘zgarmas tiplar, aliasing xatolari, yuza va chuqur nusxa, hashlanuvchanlik va standart argument tuzog‘i." },
      "functions-deep-dive": { title: "Funksiyalar — Chuqur Tahlil", description: "Faqat-pozitsion, faqat-kalitli, *args/**kwargs, standart qiymatlarni baholash va funksiya obyektlari." },
      "closures-and-legb": { title: "Namespace’lar, LEGB va Closure’lar", description: "Nom aniqlash qanday ishlaydi, closure nega qiymat emas o‘zgaruvchini oladi, nonlocal/global va kech bog‘lanish tuzog‘i." },
      decorators: { title: "Dekoratorlar Noldan", description: "Dekoratorlarni noldan qurish: oddiy, parametrli, klass asosidagi, stacklangan. functools.wraps, keshlash, retry va real patternlar." },
      "iterators-and-generators": { title: "Iteratorlar, Generatorlar va Dangasa Quvurlar", description: "Iterator protokoli, generator funksiya va ifodalar, yield from, xotira-tejamkor quvurlar va itertools." },
      "oop-and-the-data-model": { title: "OOP va Python Ma’lumot Modeli", description: "Dunder metodlar, __init__ va __new__, property, dataclass, meros va kompozitsiya, protokollar va ABC." },
      "typing-and-generics": { title: "Type Hint, Generics va Protocol", description: "O‘zini oqlaydigan bosqichma-bosqich typing: Optional, union, TypeVar, generics, Protocol va CI’da mypy." },
      "asyncio-fundamentals": { title: "asyncio — Event Loop’dan Yuqoriga", description: "Korutinalar, event loop, tasklar, gather, timeout, bekor qilish — va blocking chaqiriqlar async servisni nega buzadi." },
      "concurrency-gil-threads-processes": { title: "GIL, Oqimlar va Jarayonlar", description: "GIL aslida nimani qulflaydi, oqimlar qachon yordam beradi, multiprocessing va I/O vs CPU yuklamalari uchun qaror doirasi." },
      "errors-logging-and-observability": { title: "Istisnolar, Logging va Kuzatuv", description: "Istisno dizayni, EAFP, maxsus ierarxiyalar, tizimli logging va skriptni servisdan ajratuvchi operatsion odatlar." },
    },
  },

  django: {
    title: "Professional Django",
    tagline: "'Batteries-included' freymvork — to‘g‘ri ishlatilgan",
    description:
      "Django’ni ichki tuzilishidan boshlab professional darajada o‘rgatadigan kurs: so‘rov hayotiy sikli, ORM va so‘rovlarni optimallashtirish, DRF bilan API’lar, autentifikatsiya va xavfsizlik, keshlash, Celery va joylashtirish.",
    level: "O‘rta → Murakkab",
    sections: {
      internals: { title: "Django Ichki Tuzilishi", description: "So‘rov/javob hayotiy sikli, middleware va qismlar qanday bog‘lanadi." },
      data: { title: "Modellar va ORM", description: "Ma’lumotni to‘g‘ri modellashtirish va kodingiz yaratadigan SQL’ni tushunish." },
      api: { title: "DRF bilan API’lar", description: "Django REST Framework bilan ishlab chiqarish REST API’lari." },
      security: { title: "Auth va Xavfsizlik", description: "Django’ning auth tizimi va foydalanuvchilarni himoya qiluvchi xavfsizlik modeli." },
      operations: { title: "Keshlash, Celery va Joylashtirish", description: "Django’ni tezlashtirish va uni real serverlarga chiqarish." },
    },
    lessons: {
      "request-lifecycle": { title: "So‘rov/Javob Hayotiy Sikli", description: "Bir HTTP so‘rovi Django orqali qanday o‘tadi: WSGI/ASGI, middleware, URL yo‘naltirish va view’gacha." },
      "models-and-the-orm": { title: "Modellar va ORM — Chuqur Tahlil", description: "Ma’lumotni to‘g‘ri modellashtirish, migratsiyalar va ORM yaratadigan SQL’ni tushunish." },
      "queryset-optimization": { title: "QuerySet’ni Katta Hajmda Optimallash", description: "N+1 muammosi, select_related/prefetch_related, indekslash va ORM’ni ishlab chiqarishda tezlashtirish." },
      "drf-apis": { title: "Django REST Framework Ishlab Chiqarishda", description: "Serializerlar, viewset’lar, autentifikatsiya, ruxsatlar va ishonchli REST API’lar qurish." },
      "auth-and-security": { title: "Autentifikatsiya, Ruxsatlar va Xavfsizlik", description: "Django auth tizimi, CSRF, XSS, SQL injection himoyasi va foydalanuvchi xavfsizligi modeli." },
      "caching-celery-and-deployment": { title: "Keshlash, Celery va Joylashtirish", description: "Kesh qatlamlari, Celery bilan fon vazifalari, idempotentlik va Django’ni ishlab chiqarishga chiqarish." },
    },
  },

  fastapi: {
    title: "FastAPI Muhandisligi",
    tagline: "Zamonaviy async API’lar: ASGI’dan toza arxitekturagacha",
    description:
      "FastAPI’ni ichki tuzilishidan boshlab o‘rgatadigan kurs: ASGI va Starlette, Pydantic, dependency injection, async SQLAlchemy va Alembic, OAuth2/JWT xavfsizligi va toza arxitektura, testlash hamda joylashtirish.",
    level: "O‘rta → Ekspert",
    sections: {
      foundations: { title: "Asoslar", description: "FastAPI aslida nima: ASGI, Starlette va Pydantic." },
      structure: { title: "Ilova Tuzilishi", description: "Dependency injection arxitektura sifatida va toza tashkil etish." },
      data: { title: "Ma’lumot Bazalari", description: "Async SQLAlchemy 2.0 va Alembic bilan migratsiyalar." },
      security: { title: "Xavfsizlik", description: "OAuth2, JWT va rolga asoslangan ruxsatlar." },
      production: { title: "Ishlab Chiqarish", description: "Toza arxitektura, testlash va joylashtirish." },
    },
    lessons: {
      "asgi-and-starlette": { title: "ASGI, Starlette va FastAPI Aslida Nima", description: "Async server protokoli ASGI, Starlette poydevori va FastAPI ularni qanday birlashtiradi." },
      "pydantic-deep-dive": { title: "Pydantic — Chuqur Tahlil", description: "Ma’lumotni tekshirish va serializatsiya: modellar, validatorlar, sozlamalar va ishlash." },
      "dependency-injection": { title: "Dependency Injection Arxitektura Sifatida", description: "Depends() har so‘rovda bog‘liqlik grafigini quradi — umumiy resurslar va oson testlash." },
      "sqlalchemy-async-and-alembic": { title: "Async SQLAlchemy 2.0 va Alembic", description: "Async ORM, sessiya boshqaruvi, connection pool va Alembic bilan migratsiyalar." },
      "auth-jwt-oauth2": { title: "Auth: OAuth2, JWT va RBAC", description: "Token asosidagi autentifikatsiya, JWT, oqimlar va rolga asoslangan kirish nazorati." },
      "architecture-testing-deployment": { title: "Toza Arxitektura, Testlash va Joylashtirish", description: "Qatlamli arxitektura, TestClient bilan testlash va FastAPI’ni ishlab chiqarishga chiqarish." },
    },
  },
};
