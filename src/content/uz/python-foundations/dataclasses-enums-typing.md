## Bu darsda nimalarni o‘rganamiz

- **`@dataclass`** bilan ma’lumotni toza modellashtirish.
- **`Enum`** bilan tayin tanlovlarни ifodalash.
- **Type hint**lar, `Optional`, `Union` va generics.
- Runtime’dan oldin xatolarni ushlash uchun **mypy** ishlatish.

## Oldindan nima bilish kerak

[Funksiyalar va scope](/courses/python-foundations/functions-arguments-scope). Oddiy klass sintaksisi.

## Asosiy g‘oya — bir jumlada

> Dataclass’lar “ma’lumot saqlaydigan obyektlar” uchun shablonni olib tashlaydi, enum’lar tayin tanlovlar to‘plamini nomlaydi, type hint’lar esa yashirin taxminlarni tekshiriladigan hujjatga aylantiradi.

**Hayotiy o‘xshatish — yorliqli qadoq ro‘yxati bilan idishlar.** Ma’lumot saqlovchi oddiy klass — qo‘lda to‘ldiriladigan yorliqsiz quti. Dataclass — bo‘limlari yorliqlangan quti (`__init__`, `__repr__`, `__eq__` siz uchun yaratiladi). Type hint’lar — qopqoqqa yopishtirilgan qadoq ro‘yxati.

## Dataclass’lar

Oldin — zerikarli va xatolarga moyil:

```python
class Point:
    def __init__(self, x, y):
        self.x = x; self.y = y
    def __repr__(self):
        return f"Point(x={self.x}, y={self.y})"
    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)
```

Keyin — dataclass hammasini yaratadi:

```python
from dataclasses import dataclass, field

@dataclass
class Point:
    x: float
    y: float = 0.0                     # standart

p = Point(1, 2)
p                                       # Point(x=1, y=2)  ← bepul __repr__
Point(1, 2) == Point(1, 2)              # True             ← bepul __eq__
```

Foydali opsiyalar:

```python
@dataclass(frozen=True)                 # o'zgarmas + hashlanuvchi
class Config:
    host: str
    ports: list[int] = field(default_factory=list)   # o'zgaruvchan standart → factory, [] emas!
```

- `frozen=True` → o‘zgarmas, hashlanuvchi qiymat obyektlari.
- `field(default_factory=list)` → o‘zgaruvchan maydonni standartlashtirishning to‘g‘ri yo‘li.
- `__post_init__` → yaratilgan `__init__` dan keyin validatsiya.

## Enum’lar

Sehrli matn/sonlar — xato manbai. Enum tayin to‘plamni nomlaydi:

```python
from enum import Enum

class Status(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    CLOSED = "closed"

Status.ACTIVE          # <Status.ACTIVE: 'active'>
Status.ACTIVE.value    # 'active'
Status("active")       # qiymat bo'yicha izlash → Status.ACTIVE
```

Enum’lar singleton, o‘z-o‘zini hujjatlaydi va xatolarni ushlaydi: `Status.ACITVE` darrov `AttributeError`, `"acitve"` esa jimgina o‘tib ketadi.

## Type hint’lar

```python
def total(prices: list[float], tax: float = 0.0) -> float:
    return sum(prices) * (1 + tax)
```

Zamonaviy sintaksis:

```python
x: int | None            # int yoki None (Optional[int])
y: int | str             # bir nechta tur birligi
names: list[str]         # str ro'yxati
scores: dict[str, int]   # str kalit, int qiymat
```

Type hint’lar runtime’da **majburlanmaydi** — Python ularni ishlatishда e’tiborsiz qoldiradi. Ularning qiymati muharrirlar, avtoto‘ldirish va mypy’da.

## mypy — ishga tushishdan oldin xatolarни ushlash

```bash
pip install mypy
mypy myapp/
```

```python
def greet(name: str) -> str:
    return "Hi " + name

greet(42)      # mypy xatosi: "int" turi mos emas; "str" kutilgan
```

mypy hint’laringizni o‘qib nomuvofiqliklarni statik belgilaydi — kod ishlashidan oldin ushlanadigan xatolar sinfi.

## Keng tarqalgan xatolar

1. **Dataclass maydonida o‘zgaruvchan standart** (`x: list = []`) — `field(default_factory=list)` ishlating.
2. **Enum o‘rniga sehrli matnlar** — xatolar o‘tib ketadi.
3. **Hint’lar runtime’da majburlanadi deb ishonish** — yo‘q; mypy yoki `pydantic`.
4. **Arzimas lokallarni ortiqcha izohlash** — ommaviy imzolarni hint qiling.
5. **Hamma joyda `Any`** — maqsadni yo‘qqa chiqaradi.

## Xulosa

- `@dataclass` shablonni olib tashlaydi; `frozen=True`, `default_factory`, `__post_init__` ni kerak bo‘lganда ishlating.
- `Enum` tayin tanlovlarni nomlaydi va sehrli-matn xatolarini oldini oladi.
- Type hint’lar hujjatlaydi va statik tekshirishга imkon beradi; mypy xatolarни oldin ushlaydi.
- Hint’lar runtime’da bepul; foyda — asboblar.

## Mashqlar

**Oson**

1. Qo‘lda yozilgan ma’lumot klassini `@dataclass` ga aylantiring; `repr` va `==` bepul ishlashini tasdiqlang.
2. `Color(Enum)` aniqlang va a’zoni qiymat bo‘yicha izlang.

**O‘rtacha**

3. `frozen=True` dataclass yasang va nusxalarini lug‘at kaliti / set a’zosi sifatida ishlating.
4. Uch funksiyaga type hint qo‘shing va mypy ishlating; xatolarни tuzating.

**Advanced**

5. `Status` enum maydoni, `list[LineItem]` (`default_factory` bilan) va `__post_init__` validatsiyasi bilan `Order` modellang.

**Xatoni top**

6. Xatoni tushuntiring va tuzating:
```python
@dataclass
class Cart:
    items: list = []
```

**Mini loyiha**

Kichik ilova uchun (User, Order, Product) dataclass va enum bilan tipli domen modeli quring, to‘liq hint qilingan, strict rejimda mypy’dan o‘tadigan.

## Test

<details>
<summary>1. Oddiy `@dataclass` qaysi uch metodni yaratadi?</summary>
`__init__`, `__repr__` va `__eq__` (opsiyalar bilan tartiblash/hash ham).
</details>

<details>
<summary>2. Dataclass maydoniga o‘zgaruvchan standartni qanday berasiz?</summary>
`field(default_factory=list)` — hech qachon yalang‘och `= []`.
</details>

<details>
<summary>3. Python ishlashda type hint’larni majburlaydimi?</summary>
Yo‘q — runtime’da e’tiborsiz qoldiriladi; mypy kabi statik asboblar majburlaydi.
</details>

<details>
<summary>4. Nega Enum matn konstantalaridan afzal?</summary>
Xato-xavfsiz, aylanuvchi, o‘z-o‘zini hujjatlaydigan singletonlar — noto‘g‘ri a’zo nomi darrov xato beradi.
</details>

## Keyingi dars

[OOP, ABC va Protocol](/courses/python-foundations/oop-abc-protocols).
