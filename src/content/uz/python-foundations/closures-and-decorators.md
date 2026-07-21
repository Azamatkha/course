## Bu darsda nimalarni o‘rganamiz

- **Closure** nima va u o‘zgaruvchilarni qanday “eslab qoladi”.
- **Dekorator**larni noldan qurish (sovg‘a o‘rash o‘xshatishi).
- `functools.wraps` va usiz nima buziladi.
- Parametrli dekoratorlar va dekorator qachon noto‘g‘ri vosita ekanini.

## Oldindan nima bilish kerak

[Funksiyalar, argumentlar va scope](/courses/python-foundations/functions-arguments-scope) — ayniqsa `*args/**kwargs` va LEGB.

## Asosiy g‘oya — bir jumlada

> **Closure** — yaratilgan joyidagi o‘zgaruvchilarni eslab qoladigan funksiya; **dekorator** — boshqa funksiyani o‘rab, unga xatti-harakat qo‘shadigan funksiya — `@d` ustidagi `def f` shunchaki `f = d(f)` degani.

**Hayotiy o‘xshatish — sovg‘a o‘rash.** Dekorator sizning sovg‘angizni (funksiyani) chiroyliroq qog‘ozga (qo‘shimcha xatti-harakat) o‘raydi, ichidagini o‘zgartirmasdan. Oluvchi baribir sovg‘ani oladi — lekin endi bant (logging), chek (vaqt o‘lchash) yoki “ehtiyot bo‘l” yorlig‘i (retry) ham bor.

## Avval closure

```python
def multiplier(factor):
    def multiply(n):
        return n * factor        # `factor` tashqi scope'dan olinadi
    return multiply

double = multiplier(2)
double(10)                       # 20 — `double` factor=2 ni eslab qoladi
```

`multiply` — closure: `multiplier` qaytgach ham `factor` ga tirik havolani saqlaydi. Closure’lar qiymat emas, **o‘zgaruvchi**ni oladi — mashhur sikl xatosining ildizi:

```python
funcs = [lambda: i for i in range(3)]
[f() for f in funcs]             # [2, 2, 2] — hammasi bir xil `i` ni oladi
# Yechim: har iteratsiyada standart argument bilan olish
funcs = [lambda i=i: i for i in range(3)]   # [0, 1, 2]
```

## Dekoratorni noldan qurish

`@d` = `f = d(f)` bo‘lgani uchun, dekorator — funksiyani olib, (odatda o‘rovchi) funksiya qaytaradigan funksiya:

```python
import functools, time

def timed(fn):
    @functools.wraps(fn)                    # fn identifikatorini saqlash (pastda)
    def wrapper(*args, **kwargs):           # HAR QANDAY argument qabul qilish
        start = time.perf_counter()
        try:
            return fn(*args, **kwargs)      # haqiqiy funksiyani chaqirish
        finally:
            ms = (time.perf_counter() - start) * 1000
            print(f"{fn.__name__} took {ms:.1f}ms")
    return wrapper

@timed
def work(n):
    return sum(range(n))
```

Qatorma-qator:
- `def timed(fn)` — funksiya obyektini dekoratsiya vaqtida (odatda import) oladi.
- `wrapper(*args, **kwargs)` — wrapper asl kabi chaqirilishi uchun universal uzatish.
- `try/finally` — `fn` xato ko‘tarsa ham vaqt yoziladi; istisno baribir tarqaladi.
- `return wrapper` — **almashtirilganni qaytaring**, aks holda `work` `None` bo‘ladi.

## Nega `functools.wraps` muhim

Usiz wrapper asl identifikatorni *almashtiradi*:

```python
def bad(fn):
    def wrapper(*a, **k): return fn(*a, **k)
    return wrapper

@bad
def greet(): "docstring"
greet.__name__      # 'wrapper'  ← noto'g'ri! docs, help(), traceback yolg'on
```

`@functools.wraps(fn)` `__name__`, `__doc__`, imzo va `__wrapped__` ni ko‘chiradi. Doim ishlating — ba’zi freymvorklar (veb yo‘nalishlar, vazifa navbatlari) to‘g‘ri nomsiz buziladi.

## Parametrli dekoratorlar (uch qatlam)

`@retry(times=3)` avval `retry(times=3)` ni *chaqirishi*, keyin natijasini dekorator sifatida ishlatishi kerak:

```python
def retry(times=3):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return fn(*args, **kwargs)
                except Exception:
                    if attempt == times:
                        raise
        return wrapper
    return decorator

@retry(times=5)
def flaky(): ...
```

Uch qatlam: `retry(times)` → `decorator(fn)` → `wrapper(*a, **k)`.

## Dekorator qachon KERAK EMAS

- Xatti-harakat har chaqiruvda murakkab o‘zgarsa — parametr yoki aniq chaqiruv aniqroq.
- Muhim boshqaruv oqimini yashirsa (idempotent bo‘lmagan amalda jimgina retry = takroriy to‘lov).
- Faqat bitta funksiyaga kerak bo‘lsa — inline qiling; dekorator ko‘p joyda qo‘llanadigan **kesishuvchi** masalalar uchun.

## Keng tarqalgan xatolar

1. **`return wrapper` ni unutish** — dekoratsiyalangan funksiya `None` bo‘ladi.
2. **`functools.wraps` ni tashlab qo‘yish** — buzuq introspeksiya.
3. **`@retry` va `@retry()`** — parametrli dekorator chaqirilishi shart.
4. **Wrapper’da istisnolarni yutish** — dekoratorlar standart holatda shaffof bo‘lsin.
5. **Sikllardagi kech-bog‘lanish closure xatosi** — standart argument bilan oling.

## Xulosa

- Closure’lar tashqi o‘zgaruvchilarni eslab qoladi (qiymat emas, o‘zgaruvchi).
- Dekorator funksiyani o‘rab xatti-harakat qo‘shadi; `@d` ≡ `f = d(f)`.
- Doim `functools.wraps` va `*args/**kwargs` uzating.
- Parametrli dekorator uch qatlam; dekoratorni kesishuvchi masalalarga ishlating.

## Mashqlar

**Oson**

1. `n` ni qo‘shadigan closure qaytaruvchi `make_adder(n)` yozing. Ikki adder aralashmasligini ko‘rsating.
2. Argument va natijani chop etuvchi `@log_calls` yozing; istisnolar baribir tarqalishini tekshiring.

**O‘rtacha**

3. Argumentlar bo‘yicha lug‘atda memoizatsiya qiladigan `@cache_simple` yozing; `__name__` saqlanganini tasdiqlang.
4. Funksiyani `n` marta chaqiruvchi parametrli `@repeat(n)` yozing.

**Advanced**

5. `functools.wraps` bilan eksponensial backoff’li `@retry(times, exceptions, delay)` quring. Nega faqat idempotent amalni retry qilish kerakligini tushuntiring.

**Xatoni top**

6. Nega `[3, 3, 3]` chiqadi va tuzating:
```python
callbacks = []
for i in range(3):
    callbacks.append(lambda: i)
print([c() for c in callbacks])
```

**Mini loyiha**

Kichik dekorator kutubxonasi: `@timed`, `@retry(...)` va `@memoize` — har biri `functools.wraps` va testlar bilan. So‘ng uchalasini (stacked) qulaydigan, sekin funksiyaga qo‘llang va bajarilish tartibini kuzating.

## Test

<details>
<summary>1. Closure nimani oladi?</summary>
Tashqi scope’dagi o‘zgaruvchini (tirik havola), yaratilish vaqtidagi qiymat nusxasini emas.
</details>

<details>
<summary>2. `@d` ustidagi `def f` nimani anglatadi?</summary>
`f = d(f)` — funksiya dekoratorga uzatiladi va uning qaytgan qiymatiga qayta bog‘lanadi.
</details>

<details>
<summary>3. `functools.wraps` siz nima buziladi?</summary>
`__name__`, `__doc__`, imzo va `__wrapped__` — introspeksiya, `help()`, traceback va ba’zi freymvork registratsiyasi.
</details>

<details>
<summary>4. `@retry(3)` necha qatlam talab qiladi?</summary>
Uch: fabrika (argumentlarni oladi), dekorator (funksiyani oladi) va wrapper (chaqiruv argumentlarini oladi).
</details>

## Keyingi dars

[Iteratorlar, generatorlar va comprehension](/courses/python-foundations/iterators-generators-comprehensions).
