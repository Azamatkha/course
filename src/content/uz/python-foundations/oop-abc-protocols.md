## Bu darsda nimalarni o‘rganamiz

- Klasslar, nusxalar va **meros vs kompozitsiya** farqi.
- Muhim **dunder metod**larni amalga oshirish.
- **Abstrakt bazaviy klasslar (ABC)** bilan shartnoma belgilash.
- **Protocol**lar bilan strukturaviy tipizatsiya (xavfsizlik to‘riga ega duck typing).

## Oldindan nima bilish kerak

[Dataclass, Enum va Typing](/courses/python-foundations/dataclasses-enums-typing). Oddiy klass sintaksisi.

## Asosiy g‘oya — bir jumlada

> OOP ma’lumotni u bilan ishlaydigan xatti-harakat bilan birlashtiradi; **meros** “is-a” deydi, **kompozitsiya** “has-a”, **ABC** shartnomani meros bilan majburlaydi, **Protocol** esa shakl bilan.

**Hayotiy o‘xshatish — ish tavsifi vs haqiqiy ko‘nikma.** ABC — imzolashingiz (meros olishingiz) kerak bo‘lgan rasmiy shartnoma va vazifalarini bajarishingiz shart. Protocol — “aslida bu ishni qila olasizmi?” — `.read()` va `.write()` qila olsangiz, siz *fayl-simon*siz, qog‘ozsiz.

## Klasslar va nusxalar

```python
class Account:
    def __init__(self, owner: str, balance: float = 0):
        self.owner = owner          # nusxa atributi — har obyektда
        self.balance = balance

    def deposit(self, amount: float) -> None:
        self.balance += amount      # `self` — nusxa

a = Account("Ada", 100)
a.deposit(50); a.balance            # 150
```

## Meros vs kompozitsiya

```python
# Meros — SavingsAccount IS-A Account
class SavingsAccount(Account):
    def __init__(self, owner, balance=0, rate=0.02):
        super().__init__(owner, balance)   # ota initsializatorini chaqirish
        self.rate = rate

# Kompozitsiya — Bank HAS accounts
class Bank:
    def __init__(self):
        self.accounts: list[Account] = []
```

**Meros ustidan kompozitsiyani afzal ko‘ring.** Chuqur meros daraxtlari qattiq va mo‘rt; kichik obyektlarni birlashtirish moslashuvchan. Merosni faqat haqiqiy is-a uchun ishlating.

## Dunder metodlar

Python operatorlari va built-in’lari “dunder” metodlarga dispatch qiladi:

```python
class Money:
    def __init__(self, cents: int): self.cents = cents
    def __repr__(self): return f"Money({self.cents})"      # debug
    def __eq__(self, other): return self.cents == other.cents
    def __lt__(self, other): return self.cents < other.cents   # tartiblashni yoqadi
    def __add__(self, other): return Money(self.cents + other.cents)
    def __hash__(self): return hash(self.cents)            # set/dict'da ishlatsa bo'ladi

Money(150) + Money(50)          # Money(200) — __add__ orqali
sorted([Money(300), Money(100)])   # ishlaydi — __lt__ orqali
```

## Abstrakt bazaviy klasslar (ABC)

ABC subklasslar **amalga oshirishi shart** bo‘lgan metodlarni belgilaydi; ular bajarilmaguncha nusxa yaratib bo‘lmaydi:

```python
from abc import ABC, abstractmethod

class Storage(ABC):
    @abstractmethod
    def save(self, key: str, data: bytes) -> None: ...
    @abstractmethod
    def load(self, key: str) -> bytes: ...

class DiskStorage(Storage):
    def save(self, key, data): ...      # ikkalasini amalga oshirish shart
    def load(self, key): ...

Storage()          # TypeError: abstrakt klass nusxasini yaratib bo'lmaydi
```

## Protocol’lar — strukturaviy tipizatsiya

Protocol “bu metodlarga ega har narsa mos keladi” deydi — meros kerak emas:

```python
from typing import Protocol

class Readable(Protocol):
    def read(self) -> str: ...

def dump(src: Readable) -> None:      # read() metodi bo'lgan HAR NARSANI qabul qiladi
    print(src.read())
```

Protocol’lar duck typing’ni rasmiylashtiradi: “agar g‘aqillasa — o‘rdak” moslashuvchanligi *va* statik tekshiruvi.

| | ABC | Protocol |
|---|---|---|
| Munosabat | Aniq (meros) | Strukturaviy (shakl) |
| Majburlanadi | Nusxa yaratishда (runtime) | mypy bilan (statik) |
| Uchun eng yaxshi | Freymvorklar | Duck typing, uchinchi-tomon turlari |

## Keng tarqalgan xatolar

1. **Chuqur meros** kompozitsiya mos bo‘lganda — qattiqlik va mo‘rt baza klasslari.
2. **`super().__init__()` ni unutish** — ota holati initsializatsiyalanmaydi.
3. **Faqat `__str__`, `__repr__` yo‘q** — debug foydasiz `<object at ...>` ko‘rsatadi.
4. **`__hash__`siz `__eq__`** — obyekt hashlanmaydigan bo‘ladi.
5. **ABC ni ortiqcha ishlatish** — oddiy Protocol yoki funksiya yetganда.

## Xulosa

- Klasslar ma’lumot + xatti-harakatni birlashtiradi; `self` — nusxa.
- Kompozitsiyani afzal ko‘ring; haqiqiy is-a uchun `super()` bilan meros.
- Dunder’lar obyektlarni operatorlar va built-in’lar bilan ishlashga majbur qiladi.
- ABC meros bilan shartnomani, Protocol shakl bilan (strukturaviy tipizatsiya) majburlaydi.

## Mashqlar

**Oson**

1. `__add__`, `__eq__` va `__repr__` bilan `Vector2D` yozing; ikki vektorni qo‘shing.
2. Klassga ham `__str__` (foydalanuvchi) ham `__repr__` (debug) bering va har biri qayerda ishlatilishini kuzating.

**O‘rtacha**

3. Abstrakt `area()` li `Shape` ABC aniqlang; `Circle` va `Rectangle` amalga oshiring.
4. `Comparable` Protocol aniqlang va `<` ni qo‘llab-quvvatlaydigan har narsani qabul qiladigan `max_of(items)` yozing.

**Advanced**

5. Chuqur meros zanjirini (`Animal → Dog → GuideDog`) kompozitsiyaga (Dog *has* a Job) qayta tuzing va nega moslashuvchanroq ekanini asoslang.

**Xatoni top**

6. Klass nusxalarini set’ga qo‘shib bo‘lmaydi. U `__eq__` aniqlaydi lekin `__hash__` emas. Tushuntiring va tuzating.

**Mini loyiha**

Plugin tizimini ikki usulda quring: (a) `run()` li ABC `Plugin` bazasi, (b) `Plugin` Protocol. Har biri uchun plagin’larni ro‘yxatga oling va bajaring; kuzatgan murosalaringizni yozing.

## Test

<details>
<summary>1. `super().__init__()` nima qiladi?</summary>
Ota klass initsializatorini chaqiradi, meros holatini sozlaydi.
</details>

<details>
<summary>2. Qaysi dunder tartiblashni yoqadi?</summary>
`__lt__` (kichik) — `sorted`/`min`/`max` uni ishlatadi.
</details>

<details>
<summary>3. Amalga oshirilmagan `@abstractmethod` li klass nusxasini yaratib bo‘ladimi?</summary>
Yo‘q — barcha abstrakt metodlar amalga oshirilmaguncha `TypeError` beradi.
</details>

<details>
<summary>4. Protocol ABC dan qanday farq qiladi?</summary>
Protocol shakl bo‘yicha (metodlarga ega bo‘lish) mos keladi, statik tekshiriladi; ABC aniq meros talab qiladi.
</details>

## Keyingi dars

[SOLID, Toza Kod va Dizayn Patternlar](/courses/python-foundations/solid-clean-code-patterns).
