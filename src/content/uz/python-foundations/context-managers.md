## Bu darsda nimalarni o‘rganamiz

- **`with`** operatori nimani kafolatlaydi va nega.
- `__enter__`/`__exit__` orqali kontekst menejer yozish.
- `@contextlib.contextmanager` bilan tez qurish.
- Qulflar, tranzaksiyalar, timerlar va vaqtinchalik holat uchun ishlatish.

## Oldindan nima bilish kerak

[Iteratorlar va generatorlar](/courses/python-foundations/iterators-generators-comprehensions) va istisnolar haqida asosiy tushuncha.

## Asosiy g‘oya — bir jumlada

> Kontekst menejer blok atrofida **sozlash va tozalash**ni kafolatlaydi — tozalash blok xato ko‘tarsa ham ishlaydi, shuning uchun resurslar hech qachon oqib ketmaydi.

**Hayotiy o‘xshatish — mehmonxona kartasi.** Ro‘yxatdan o‘tish (`__enter__`) kartangizni faollashtiradi; chiqish (`__exit__`) uni o‘chiradi va bassейnga qaytaradi — va mehmonxona chiqish *shoshib ketsangiz ham* (istisno) sodir bo‘lishini ta’minlaydi. `with` — fayllar, qulflar va ulanishlar uchun o‘sha kafolat.

## U yechadigan muammo

```python
f = open("data.txt")
data = f.read()          # bu xato ko'tarsa, quyidagi f.close() hech qachon ishlamaydi → oqim
f.close()
```

```python
with open("data.txt") as f:
    data = f.read()      # f kafolatlangan yopiladi, xato bo'lsin yoki yo'q
# f.close() bu yerda avtomatik sodir bo'lgan
```

`with` bloki kirishда `__enter__`, chiqishда `__exit__` ni chaqiradi — oddiy yoki istisnoli.

## Protokolni amalga oshirish

```python
class Timer:
    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self                     # `as` ga bog'lanadigan qiymat
    def __exit__(self, exc_type, exc, tb):
        import time
        self.elapsed = time.perf_counter() - self.start
        print(f"{self.elapsed:.3f}s oldi")
        return False                    # False → istisnoni bostirmaydi

with Timer() as t:
    sum(range(10_000_000))
```

`__exit__` istisno ma’lumotini oladi (`exc_type, exc, tb`) — toza chiqishда hammasi `None`. **`True` qaytarish istisnoni bostiradi**; tarqalishi uchun `False` (yoki hech narsa) qaytaring.

## Oson yo‘l: `@contextmanager`

Generator yozing: `yield` gача hammasi sozlash, keyin hammasi tozalash:

```python
from contextlib import contextmanager

@contextmanager
def opened(path, mode="r"):
    f = open(path, mode)
    try:
        yield f                # resursni blokga ber
    finally:
        f.close()              # DOIM ishlaydi — tozalash kafolati

with opened("data.txt") as f:
    print(f.read())
```

`yield` atrofidagi `try/finally` — butun sir: `finally` blok muvaffaqiyatli bo‘lsin yoki xato ko‘tarsin ishlaydi.

## Real ishlatishlar

```python
# Baza tranzaksiyasi: muvaffaqiyatda commit, xatoda rollback
@contextmanager
def transaction(conn):
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()        # xato yo'lida tozalash
        raise

# Holatni vaqtincha o'zgartirib, tiklash
@contextmanager
def temp_setting(obj, attr, value):
    old = getattr(obj, attr)
    setattr(obj, attr, value)
    try:
        yield
    finally:
        setattr(obj, attr, old)   # nima bo'lsa ham tiklaydi
```

Qulflar (`with lock:`), test fixture’lar — hammasi kontekst menejer.

## Foydali stdlib yordamchilari

```python
from contextlib import suppress, ExitStack

with suppress(FileNotFoundError):     # muayyan xatoni toza e'tiborsiz qoldirish
    os.remove("maybe.txt")

with ExitStack() as stack:            # o'zgaruvchan sonli kontekst menejerni boshqarish
    files = [stack.enter_context(open(p)) for p in paths]
    # blok chiqishida barcha fayllar yopiladi, biror open() muvaffaqiyatsiz bo'lsa ham
```

## Keng tarqalgan xatolar

1. **Hamma joyda qo‘lda `try/finally`** — qayta ishlatiladigan kontekst menejer o‘rniga.
2. **`__exit__` dan tasodifan `True` qaytarish** — istisnolarni jimgina yutish.
3. **`yield` dan keyin `try/finally`siz tozalash** — blokdagi istisno tozalashni tashlab ketadi.
4. **`with`siz resurs ochish** — klassik oqim xatosi.

## Xulosa

- `with` blok atrofida sozlash/tozalashni kafolatlaydi, istisnoda ham.
- `__enter__`/`__exit__` yoki (osonroq) `try/finally` bilan `@contextmanager` generator orqali amalga oshiring.
- Chiqarilishi/tiklanishi shart bo‘lgan har resurs/holat uchun: fayllar, qulflar, tranzaksiyalar.
- `suppress` va `ExitStack` keng tarqalgan naqshlarni qoplaydi.

## Mashqlar

**Oson**

1. O‘tgan vaqtni chop etuvchi `Timer` kontekst menejerini yozing. Uni sekin sikl atrofida ishlating.
2. Qo‘lda `open`/`try`/`finally`/`close` ni `with` blokiga qayta yozing.

**O‘rtacha**

3. Ish papkasini o‘zgartirib tiklaydigan `@contextmanager def temp_cwd(path)` yozing.
4. Muvaffaqiyatda commit, xatoda rollback qiladigan `transaction(conn)` yozing.

**Advanced**

5. `ExitStack` bilan o‘zgaruvchan ro‘yxatdagi fayllarni oching va uchinchi `open()` muvaffaqiyatsiz bo‘lsa ham hammasi yopilishini kafolatlang.

**Xatoni top**

6. Bu kontekst menejer xatoda faylni oqizadi. Tuzating:
```python
@contextmanager
def bad(path):
    f = open(path)
    yield f
    f.close()
```

**Mini loyiha**

Qayta ishlatiladigan kontekst menejerlar bilan `managed.py` quring: `timer()`, `temp_env(**vars)` va `acquired(lock, timeout)`. Muvaffaqiyat va istisno yo‘llarida tozalash ishlashini isbotlovchi testlar qo‘shing.

## Test

<details>
<summary>1. Blok xato ko‘tarsa `__exit__` ishlaydimi?</summary>
Ha — butun maqsad shu; tozalash oddiy va istisnoli chiqishda ham ishlaydi.
</details>

<details>
<summary>2. `@contextmanager` tozalashini nima ishonchli qiladi?</summary>
`yield` atrofidagi `try/finally` — `finally` blok muvaffaqiyatli yoki xatoli bo‘lsin ishlaydi.
</details>

<details>
<summary>3. `__exit__` dan `True` qaytarish nima qiladi?</summary>
Blokda ko‘tarilgan istisnoni bostiradi — ehtiyotkorlik bilan ishlating.
</details>

<details>
<summary>4. `ExitStack` nima uchun?</summary>
O‘zgaruvchan sonli kontekst menejerni boshqarish — sozlash qisman muvaffaqiyatsiz bo‘lsa ham hammasi tozalanadi.
</details>

## Keyingi dars

[Modullar, paketlar va importlar](/courses/python-foundations/modules-packages-imports).
