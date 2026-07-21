## Bu darsda nimalarni o‘rganamiz

- **Iterator protokoli** (`__iter__`/`__next__`).
- **Generator**lar va dangasa hisoblash (fabrika o‘xshatishi).
- **Comprehension**larni idiomatik ishlatish.
- `itertools` bilan katta ma’lumotni tekis xotirada oqim qilish.

## Oldindan nima bilish kerak

[Funksiyalar va scope](/courses/python-foundations/functions-arguments-scope). `for` sikllari bilan qulaylik.

## Asosiy g‘oya — bir jumlada

> Iteratsiya — **protokol**: `__iter__`/`__next__` bo‘lgan har narsani aylanish mumkin. Generatorlar iterator qurishning oson yo‘li va ular qiymatlarni **dangasa** — birma-bir, faqat so‘ralganda — hisoblaydi.

**Hayotiy o‘xshatish — konveyer vs ombor.** Ro‘yxat — ombor: har element oldindan qurilib saqlanadi, joy egallaydi. Generator — konveyer: keyingi elementni faqat so‘raganingizda yasaydi, shuning uchun bir vaqtda faqat bitta element mavjud. Million buyurtmani qayta ishlash uchun million-elementli ombor emas — har buyurtmani talab bo‘yicha yasaydigan liniya kerak.

## Iterator protokoli

```python
nums = [1, 2, 3]
it = iter(nums)        # nums.__iter__() ni chaqiradi → iterator
next(it)               # 1
next(it)               # 2
next(it)               # 3
next(it)               # StopIteration ko'taradi  ← "tugadi" signali
```

`for` sikli aynan shu: iterator ol, `StopIteration` gача `next` chaqir. Protokolni o‘zingiz ham amalga oshirishingiz mumkin:

```python
class Countdown:
    def __init__(self, n): self.n = n
    def __iter__(self): return self
    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

list(Countdown(3))     # [3, 2, 1]
```

## Generatorlar

`yield` bo‘lgan funksiya — **generator**. Uni chaqirish generator obyekti qaytaradi; tanasi siz uni iste’mol qilganingizda ishlaydi, har `yield` da to‘xtaydi:

```python
def countdown(n):
    while n > 0:
        yield n            # bu yerda to'xta, n ni ber, keyingi next() da davom et
        n -= 1

for x in countdown(3):     # 3, 2, 1
    print(x)
```

Shuning uchun generatorlar necha qiymat ishlab chiqarishidan qat’i nazar deyarli xotira ishlatmaydi.

```python
def read_large_file(path):
    with open(path) as f:
        for line in f:         # fayllar ham iterator
            yield line.strip()  # 10 GB faylni tekis xotirada
```

`yield from` sub-iterable’ga delegatsiya qiladi:

```python
def chain(*iterables):
    for it in iterables:
        yield from it
```

## Comprehension va generator ifodalari

```python
squares   = [x*x for x in range(5)]            # list comprehension → ro'yxat quradi
evens     = {x for x in range(10) if x % 2 == 0}   # set comprehension
lookup    = {c: ord(c) for c in "abc"}         # dict comprehension
lazy_sq   = (x*x for x in range(5))            # generator ifodasi → dangasa, ro'yxatsiz
```

- Butun to‘plam kerak bo‘lsa — **list comprehension**.
- Bir marta iste’mol qilib, tekis xotira xohlasangiz — **generator ifodasi**: `sum(x*x for x in range(10**7))` hech qachon ro‘yxat qurmaydi.
- O‘qilishini saqlang — ikki `if` va ichma-ich sikllik comprehension ko‘pincha oddiy sikl bo‘lgani yaxshi.

## itertools — dangasa asboblar

```python
import itertools as it
it.count(1)                 # 1, 2, 3, ... cheksiz
it.islice(it.count(), 5)    # cheksiz oqimning birinchi 5 tasi
it.chain([1,2], [3,4])      # 1,2,3,4
it.groupby(sorted(data), key=...)   # guruhlangan
```

Ular tekis-xotira quvurlarga birlashadi: o‘qi → filtrla → o‘zgartir → to‘pla, hammasi dangasa.

## Solishtirish

| | Ro‘yxat | Generator |
|---|---|---|
| Xotira | Hammasi birga | Bir vaqtda bitta |
| Qayta ishlatiladimi? | Ha | Yo‘q — bir o‘tishdan keyin tugaydi |
| Indeks | `lst[i]` | Yo‘q |
| Uchun eng yaxshi | Kichik ma’lumot | Katta/oqimli, bir o‘tish |

> [!WARNING]
> Generator **bir martalik**. Bir marta aylangach, u bo‘sh. Ikki marta kerak bo‘lsa — ro‘yxat ishlating yoki generatorni qayta yarating.

## Keng tarqalgan xatolar

1. **Generatorni ikki marta aylanish** va ikkinchisida hech narsa olish.
2. **Ulkan ro‘yxat qurish** — generator ifodasi xotirani tekis saqlagan bo‘lardi.
3. **`StopIteration` ni unutish** qo‘lda `__next__` yozganda.
4. **Ortiqcha ayyor comprehension** — o‘qib bo‘lmaydigan bir qatorlar.
5. **Generatorда `len()`** — uzunlik yo‘q.

## Xulosa

- Iteratsiya — protokol; `for` = `StopIteration` gача takroriy `next()`.
- Generatorlar (`yield`) iteratorlarni dangasa quradi, O(1) xotira, bir martalik.
- Comprehension’lar to‘plam quradi; generator ifodalari oqim qiladi.
- `itertools` dangasa, tekis-xotira quvurlarni birlashtiradi.

## Mashqlar

**Oson**

1. `n` gача juft sonlarni beruvchi `evens(n)` generatorini yozing. `sum(evens(100))` bilan yig‘ing.
2. `result = []` + append siklini bitta list comprehension’ga aylantiring.

**O‘rtacha**

3. Butun faylni yuklamasdan qatorlarni yield qiladigan `read_csv_lazily(path)` yozing.
4. `itertools.islice` bilan cheksiz `count()` dan birinchi 10 tasini oling.

**Advanced**

5. Dangasa quvur quring: qatorlarni o‘qi → strip → bo‘shlarni tashla → intga aylantir → yugurib yig‘indi, hammasi generatorlar bilan.

**Xatoni top**

6. Nega ikkinchisi bo‘sh ro‘yxat chiqaradi va tuzating:
```python
g = (x*x for x in range(5))
print(list(g)); print(list(g))
```

**Mini loyiha**

Katta log faylni birlashtiriluvchi generator bosqichlari (daraja bo‘yicha filtr, maydon ajratish, sanoq) orqali oqim qiluvchi `log_pipeline.py` quring — xotira tekis qolsin.

## Test

<details>
<summary>1. Generatorni ikki marta aylanish mumkinmi?</summary>
Yo‘q — bir o‘tishdan keyin tugaydi. Qayta yarating yoki ro‘yxat ishlating.
</details>

<details>
<summary>2. Katta oqim uchun generator qancha xotira ishlatadi?</summary>
O(1) — umumiy hajmdan qat’i nazar bir vaqtda bitta element.
</details>

<details>
<summary>3. `[...]` va `(...)` dan qaysi biri ro‘yxat quradi?</summary>
`[...]` — list comprehension; `(...)` — dangasa generator ifodasi.
</details>

<details>
<summary>4. `yield from xs` nima qiladi?</summary>
Iteratsiyani `xs` ga delegatsiya qiladi, uning har elementini yield qiladi.
</details>

## Keyingi dars

[Kontekst menejerlar](/courses/python-foundations/context-managers).
