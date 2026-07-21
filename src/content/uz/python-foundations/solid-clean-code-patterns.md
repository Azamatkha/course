## Bu darsda nimalarni o‘rganamiz

- **SOLID** ning beshta tamoyilini Python’da qo‘llash.
- Testlanadigan kod uchun **dependency injection** (rozetka o‘xshatishi).
- Python aslida ishlatadigan bir necha **dizayn pattern**.
- Boshqalar xavfsiz o‘zgartira oladigan toza, o‘qiladigan kod yozish.

## Oldindan nima bilish kerak

[OOP, ABC va Protocol](/courses/python-foundations/oop-abc-protocols).

## Asosiy g‘oya — bir jumlada

> SOLID va toza kod — **dasturiy ta’minotni o‘zgartiriladigan tutadigan odatlar** — kodning haqiqiy narxi uni bir marta yozish emas, uni yillar davomida o‘zgartirish.

**Hayotiy o‘xshatish — yaxshi tashkil qilingan ustaxona.** Yomon kod — har asbob stolgа payvandlangan ustaxona: bitta narsani o‘zgartirish uchun beshtasini kesib o‘tishingiz kerak. SOLID — asboblarni yorliqli, almashtiriladigan javonlarda tutish: har biri bitta ish qiladi, stolni qayta qurmasdan asbobni almashtira olasiz.

## SOLID

### S — Yagona mas’uliyat (Single Responsibility)

Klass/funksiya **o‘zgarishi uchun bitta sabab** bo‘lishi kerak.

```python
# YOMON: hammasini qiladi
class Report:
    def generate(self): ...
    def save_to_db(self): ...
    def email(self): ...

# YAXSHI: mas'uliyatlarni bo'ling
class Report: ...            # ma'lumot
class ReportRepository: ...  # saqlash
class ReportMailer: ...      # yetkazish
```

### O — Ochiq/Yopiq (Open/Closed)

Kengaytirish uchun ochiq, o‘zgartirish uchun yopiq.

```python
class Shape(Protocol):
    def area(self) -> float: ...
def total_area(shapes: list[Shape]) -> float:
    return sum(s.area() for s in shapes)     # yangi shakl qo'shganда o'zgarmaydi
```

### L — Liskov almashtiruvchanligi

Subtip bazasi ishlatilgan har joyda ajablanmasdan ishlatilishi kerak.

### I — Interfeys ajratish

Bitta semiz interfeys o‘rniga kichik, fokuslanganlarini afzal ko‘ring.

### D — Bog‘liqlikni teskari qilish (Dependency Inversion)

Konkret amalga oshirishга emas, **abstraksiya**ga bog‘laning.

```python
class Notifier(Protocol):
    def send(self, msg: str) -> None: ...

class OrderService:
    def __init__(self, notifier: Notifier):   # abstraksiyaga bog'lanadi
        self.notifier = notifier
    def place(self, order):
        self.notifier.send("buyurtma joylashtirildi")   # email/SMS/mock — farqi yo'q
```

## Dependency injection

**Hayotiy o‘xshatish — elektr rozetkalari.** Noutbukingiz bino simiga qattiq ulanmaydi — standart rozetkaga ulanadi. Uni uyda, ofisda yoki test stolida ulaysiz. DI — klassга hamkorlarini “rozetka” (konstruktori) orqali berish:

```python
# Qattiq ulangan — testlab bo'lmaydi
class Signup:
    def __init__(self):
        self.mailer = SmtpMailer()          # payvandlangan

# Injektsiya qilingan — testda soxta, prod'da real
class Signup:
    def __init__(self, mailer: Notifier):   # tashqaridan ulanadi
        self.mailer = mailer

Signup(SmtpMailer())        # ishlab chiqarish
Signup(FakeMailer())        # testlar — tarmoqsiz, soxtada tekshiriladi
```

DI — testlanuvchanlik uchun eng katta richag.

## Python aslida ishlatadigan patternlar

| Pattern | Python shakli |
|---|---|
| **Strategy** | Xatti-harakatni o‘zgartirish uchun funksiya/callable uzatish |
| **Factory** | Sozlangan obyektlarni quradigan funksiya |
| **Adapter** | Begona interfeysni o‘zingiznikiga o‘rash (masalan LLM klienti!) |
| **Decorator** | Til darajasidagi `@decorator` |
| **Singleton** | Modul (bir marta import) — klass kerak emas |

```python
# Python'da Strategy shunchaki callable parametr:
def sort_by(items, key):        # `key` — strategiya
    return sorted(items, key=key)
```

## Toza kod odatlari

- **Nomlar niyatni ochsin** — `days_until_expiry`, `d` emas.
- **Kichik funksiyalar** bitta ish qilsin; “va” bilan tasvirlansa — bo‘ling.
- **Chuqur ichma-ichlikdan qoching** — erta return / guard qatorlar.
- **Takrorlamang** — lekin ortiqcha abstraksiya qilmang.
- **Izohlar *nima uchun* ni tushuntirsin**, *nima* ni emas.

## Keng tarqalgan xatolar

1. **Xudo klasslari** — hammasini qiladi; SRP’ni buzadi.
2. **Qattiq ulangan bog‘liqliklar** — testlab bo‘lmaydi; injektsiya qiling.
3. **Turga if/elif zanjirlari** — OCP’ni buzadi; polimorfizm.
4. **Pattern cargo-culting** — modul yetganда Java-uslub Singleton klass.
5. **Muddatidan oldin abstraksiya** — hech kimga kerak bo‘lmagan qatlamlar (YAGNI).

## Xulosa

- SOLID kodni o‘zgartiriladigan tutadi: yagona mas’uliyat, kengaytir-o‘zgartirma, xavfsiz almashtirish, kichik interfeyslar, abstraksiyaga bog‘lanish.
- Dependency injection (rozetka) — testlanadigan kodning kaliti.
- Pythonik pattern shakllarini ishlating — birinchi-darajali funksiyalar ko‘p marosimni almashtiradi.
- Toza nomlar, kichik funksiyalar va erta return kodbaza umri davomida to‘planadi.

## Mashqlar

**Oson**

1. Hisobot yaratadigan, saqlaydigan va emaylaydigan klassni uch yagona-mas’uliyat klassiga bo‘ling.
2. `if shape_type == ...` yuza hisoblagichini polimorfizm bilan qayta yozing (OCP).

**O‘rtacha**

3. Qattiq ulangan bog‘liqlikli klassni konstruktor orqali qabul qiladigan qilib qayta tuzing; soxta bilan test yozing.
4. `discount(price, strategy)` funksiyasi uchun “strategiya”ni callable parametr sifatida amalga oshiring.

**Advanced**

5. Beshta SOLID tamoyilini qo‘llagan kichik buyurtma-qayta ishlash modulini loyihalang; har tanlovni asoslang va YAGNI’ni saqlagan joyni belgilang.

**Xatoni top**

6. Test real to‘lov API’siga tegmasdan ishlay olmaydi. Dizayn nuqsonini aniqlang va soxtани injektsiya qilish uchun qayta tuzing.

**Mini loyiha**

Iflos 200 qatorli “hammasini qiladigan” skriptni toza, SOLID modullar va dependency injection hamda testlar bilan qayta tuzing. Nima o‘zgartirish osonlashganini oldin/keyin izohida yozing.

## Test

<details>
<summary>1. SOLID’dagi “S” nimani anglatadi?</summary>
Yagona mas’uliyat — klass/funksiya o‘zgarishi uchun bitta sabab bo‘lishi kerak.
</details>

<details>
<summary>2. Dependency injection qanday muammoni yechadi?</summary>
Qattiq ulangan hamkorlar kodni qattiq va testlab bo‘lmaydigan qiladi; ularni injektsiya qilish real/soxta almashtirishga imkon beradi.
</details>

<details>
<summary>3. Strategy patternining Pythonik shakli?</summary>
Xatti-harakatni o‘zgartirish uchun funksiya/callable ni parametr sifatida uzatish.
</details>

<details>
<summary>4. Nega turga if/elif zanjirlaridan qochiladi?</summary>
Ular Ochiq/Yopiqni buzadi — har yangi holat mavjud kodni tahrirlaydi; polimorfizm o‘zgartirmasdan kengaytiradi.
</details>

## Keyingi dars

[Logging va Pytest bilan testlash](/courses/python-foundations/logging-and-testing).
