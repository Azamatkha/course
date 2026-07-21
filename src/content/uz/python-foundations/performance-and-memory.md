## Bu darsda nimalarni o‘rganamiz

- Kundalik Python kodida **Big-O** haqida fikrlash.
- Ish uchun **to‘g‘ri ma’lumot tuzilmasi**ni tanlash.
- `timeit` va `cProfile` bilan profillash, taxmin qilmasdan.
- Generatorlar, `__slots__` va obyekt ortiqchaligi bilan xotirani kamaytirish.

## Oldindan nima bilish kerak

Kursning qolgan qismi. Unumdorlik ishi kod to‘g‘ri va toza bo‘lgach eng foydali.

## Asosiy g‘oya — bir jumlada

> **Avval o‘lchang, keyin optimallang.** Ko‘p unumdorlik yutuqlari yaxshiroq algoritm yoki ma’lumot tuzilmasidan keladi, mikro-o‘zgarishlardan emas — profillamagan narsani tuzata olmaysiz.

**Hayotiy o‘xshatish — tirbandlik, mashina sozlash emas.** Sekin kod odatda tirbandlik muammosi (noto‘g‘ri yo‘l, O(n²) o‘rniga O(n)), dvigatel muammosi emas. Noto‘g‘ri shaharда tiqilib qolgan mashinaga dvigatelni sayqallash yordam bermaydi.

## Amaliyotда Big-O

Isbot kerak emas — qimmat shakllarni tanish kerak:

```python
# O(n²) — bir xil ma'lumot ustidan sikl ichida sikl (ehtiyot bo'ling!)
for a in items:
    if a in other_list:        # LIST'da `in` O(n) → umumiy O(n²)
        ...

# O(n) — a'zolik uchun set ishlating
other = set(other_list)        # bir marta O(n)
for a in items:
    if a in other:             # SET'da `in` O(1) → umumiy O(n)
        ...
```

| Amal | list | set / dict |
|---|---|---|
| `x in c` | O(n) | **O(1)** |
| append / add | O(1) | O(1) |
| indeks `c[i]` | O(1) | yo‘q |

Eng ko‘p uchraydigan real tezlashtirish: **sikl ichidagi `x in a_list` ni set bilan almashtirish** — O(n²) → O(n).

## Ma’lumot tuzilmalarini tanlash

```python
from collections import defaultdict, Counter, deque

Counter(words)                 # bir qatorda sanoq
defaultdict(list)              # kalit tekshirmasdan guruhlash
deque(maxlen=1000)             # ikki uchdan O(1) qo'shish VA olib tashlash
```

- A’zolik/noyoblik kerakmi? **set/dict.**
- Navbat/stek kerakmi? **deque** (list’ning `pop(0)` — O(n)!).
- Sanoq/guruhlash? **Counter / defaultdict.**

## Profillash — haqiqiy bo‘g‘ozni topish

```python
import timeit
timeit.timeit("sum(range(1000))", number=10000)   # bo'lakni mikro-benchmark
```

```python
import cProfile
cProfile.run("main()")          # vaqt aslida qayerga ketadi?
```

Hech qachon taxmin bo‘yicha optimallashtirmang. Profiller ko‘pincha sekin qism siz o‘ylamagan joyda (ko‘pincha I/O yoki tasodifiy O(n²)) ekanini ochadi.

## Xotira

Python obyektlari ortiqchalikка ega. Ikki katta richag:

```python
# Generatorlar: oqim ustidan O(1) xotira
total = sum(x*x for x in range(10**7))     # hech qachon 10M ro'yxat qurmaydi

# __slots__: nusxa __dict__ ini olib tashlaydi → kam xotira, tez atribut kirish
class Point:
    __slots__ = ("x", "y")     # yangi atribut qo'sha olmaysiz, lekin ancha yengil
    def __init__(self, x, y): self.x, self.y = x, y
```

Millionlab kichik obyektlar uchun `__slots__` xotirani keskin kamaytirishi mumkin.

## Qachon optimallashtirilMAYDI

- To‘g‘ri va toza bo‘lishidan oldin — optimallashtirish kodni xiralashtiradi; oxirida qiling.
- Kod chindan bo‘g‘oz ekanini ko‘rsatuvchi o‘lchovsiz.
- Kamdan-kam ishlaydigan kodda — kuniga bir marta ishlaydigan skriptda 10× tezlashtirish hech narsa tejamaydi.

Muddatidan oldingi optimallashtirish — murakkablik va xatolarning yuqori manbai.

## Eng yaxshi amaliyotlar ro‘yxati

- To‘g‘ri → testlangan → toza → *keyin* tez, shu tartibда.
- Ayyor sikldan oldin to‘g‘ri ma’lumot tuzilmasiga murojaat qiling.
- Optimallashtirishdan oldin profillang; yutuqni tasdiqlash uchun keyin o‘lchang.
- Built-in va stdlib’ni afzal ko‘ring (ular C-optimallashgan).
- Katta ma’lumotni generatorlar bilan oqim qiling; ko‘p kichik obyekt uchun `__slots__`.
- Qimmat toza hisoblarni keshlang (`functools.lru_cache`) — chegaralangan hajm bilan.

## Keng tarqalgan xatolar

1. **Sikl ichida `x in list`** — tasodifiy O(n²); set ishlating.
2. **`list.pop(0)` / `insert(0, ...)`** — O(n); `deque` ishlating.
3. **Profillamasdan optimallashtirish** — noto‘g‘ri 90% ga kuch.
4. **Generator tekis xotira saqlagan joyda ulkan ro‘yxat qurish.**
5. **Chegarasiz keshlar** — `lru_cache(maxsize=None)` cheksiz o‘sadi.

## Xulosa

- Algoritm va ma’lumot tuzilmasi tanlovi unumdorlikда hukmron — O(n²) shakllarni taning.
- A’zolik uchun set/dict, navbat uchun deque, sanoq uchun Counter/defaultdict.
- `timeit`/`cProfile` bilan profillang; oldin va keyin o‘lchang.
- Generatorlar va `__slots__` bilan xotira tejang; oxirida va faqat kerak joyда optimallang.

## Mashqlar

**Oson**

1. O(n²) “umumiy elementlar” funksiyasini setlar bilan qayta yozing; ikkalasini `timeit` bilan o‘lchang.
2. `list.pop(0)` navbatini `deque` bilan almashtiring va 100k elementda farqni o‘lchang.

**O‘rtacha**

3. Qo‘lда sanoq/guruhlash sikllarini `Counter` va `defaultdict` bilan almashtiring; o‘qilishi va tezlikni solishtiring.
4. Kichik dasturni `cProfile` bilan profillang va jamlangan vaqt bo‘yicha eng yuqori funksiyani aniqlang.

**Advanced**

5. Ulkan ro‘yxatlar quradigan xotira-og‘ir skriptni generatorlarga qayta tuzing; oldin/keyin cho‘qqi xotirani o‘lchang.

**Xatoni top**

6. “Kichik ma’lumotда ishlagan” hisobot katta ma’lumotда osilib qoladi. List’da `in` bo‘lgan ichma-ich siklni ko‘rib, murakkablikni tashxislang va tuzating.

**Mini loyiha**

Funksiyani kichik/o‘rta/katta kirishlarга qarshi ishlatib, vaqtlarni chop etadigan va super-chiziqli o‘sishni belgilaydigan `bench.py` harness quring. Uni bir vazifaning ikki amalga oshirishini solishtirib, ma’lumot bilan g‘olibni tanlash uchun ishlating.

## Test

<details>
<summary>1. `x in a_list` ning murakkabligi qanday?</summary>
O(n). O(1) a’zolik uchun set/dict ishlating — tasodifiy O(n²) sikllarni tuzatadi.
</details>

<details>
<summary>2. Tez ikki-uchli navbat uchun qaysi tuzilma?</summary>
`collections.deque` — ikki uchdan O(1) qo‘shish/olib tashlash (list’ning O(n) `pop(0)` idan farqli).
</details>

<details>
<summary>3. `__slots__` nimani tejaydi?</summary>
Nusxa xotirasini (`__dict__` yo‘q) va tez atribut kirish beradi (dinamik atributlar hisobiga).
</details>

<details>
<summary>4. Qachon optimallashtirish kerak?</summary>
Oxirida — to‘g‘ri, testlangan va toza bo‘lgach, faqat profillash real bo‘g‘ozni ko‘rsatганда.
</details>

## Tabriklaymiz!

Python Asoslari kursini tugatdingiz. Endi [Django](/courses/django/models-and-the-orm), [FastAPI](/courses/fastapi/pydantic-deep-dive) yoki [AI Muhandisligi](/courses/ai-python/modern-ai-landscape) ga tayyorsiz.
