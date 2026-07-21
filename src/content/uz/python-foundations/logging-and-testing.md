## Bu darsda nimalarni o‘rganamiz

- `print` o‘rniga **`logging`** moduli va tizimli loglar.
- **pytest** bilan real testlar: assertion, fixture, parametrize.
- Tashqi bog‘liqliklarni **mock** qilish.
- **Coverage** ni 100% quvmasdan o‘lchash.

## Oldindan nima bilish kerak

[Xatoliklarni boshqarish](/courses/python-foundations/error-handling) va [SOLID / DI](/courses/python-foundations/solid-clean-code-patterns).

## Asosiy g‘oya — bir jumlada

> Logging ishlab chiqarishда nima bo‘lganini aytadi; testlar kod u yerga yetishdan *oldin* ishlashini aytadi — ikkalasi ham tinch uxlash usuli.

**Hayotiy o‘xshatish — qora quti va parvozdan oldingi ro‘yxat.** Testlar — parvozdan oldingi ro‘yxat: har tizimni yerda tekshirasiz, muvaffaqiyatsizliklar 10 000 metrda bo‘lmasin. Logging — qora quti: havoda nimadir noto‘g‘ri ketsa, unga olib kelgan narsaning batafsil yozuvi bor.

## print o‘rniga logging

`print` da darajalar, vaqt belgilari yo‘q. `logging` ishlating:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
log = logging.getLogger(__name__)      # har modul uchun bitta logger

log.debug("nozik detal")               # level=DEBUG bo'lmasa yashirin
log.info("foydalanuvchi %s kirdi", user_id) # dangasa %-formatlash
log.warning("timeout'dan keyin qayta urinish")
log.error("to'lov muvaffaqiyatsiz", exc_info=True)   # traceback bilan
```

| Daraja | Uchun |
|---|---|
| DEBUG | Ishlab chiquvchi detali |
| INFO | Oddiy hodisalar |
| WARNING | Tuzatiladigan g‘ayrioddiylik |
| ERROR | Muvaffaqiyatsiz amal |
| CRITICAL | Ilova davom eta olmaydi |

> [!TIP]
> `log.info("x=%s", x)` (dangasa) ishlating, f-string emas — %-shakl faqat xabar chindan chiqsa formatlaydi.

## pytest bilan testlash

```python
# kod: math_utils.py
def add(a, b): return a + b

# test: test_math_utils.py
from math_utils import add

def test_add_positives():
    assert add(2, 3) == 5
```

```bash
pytest -v            # test_*.py / *_test.py ni topib ishlatadi
```

### Parametrize — bir test, ko‘p holat

```python
import pytest

@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add(a, b, expected):
    assert add(a, b) == expected      # uch marta ishlaydi
```

### Fixture — qayta ishlatiladigan sozlash/tozalash

```python
@pytest.fixture
def db():
    conn = create_test_db()           # sozlash
    yield conn                        # testга ber
    conn.close()                      # tozalash (keyin ishlaydi)

def test_insert(db):                  # fixture'ni nom bo'yicha so'rash
    db.insert("x")
    assert db.count() == 1
```

### Istisnolarni testlash

```python
def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        1 / 0
```

## Tashqi bog‘liqliklarni mock qilish

Unit testlarда real tarmoqqa tegmang — ularni soxta bilan almashtiring. DI buni osonlashtiradi:

```python
from unittest.mock import Mock

def test_signup_sends_email():
    mailer = Mock()                    # soxta mailer
    Signup(mailer).register("a@b.com") # injektsiya
    mailer.send.assert_called_once()   # o'zaro ta'sirni tekshirish, real email yo'q
```

## Coverage — yo‘l ko‘rsatkich, maqsad emas

```bash
pip install pytest-cov
pytest --cov=myapp --cov-report=term-missing
```

Coverage qaysi qatorlar ishlaganini ko‘rsatadi. Uni **testlanmagan tarmoqlarni topish** uchun ishlating, maqsad sifatida emas — arzimas kodning 100% i kam narsani isbotlaydi, xavfli mantiqning 80% i esa oltin.

## Keng tarqalgan xatolar

1. **Ishlab chiqarishда `print` debugging** — darajalar/nazorat yo‘q.
2. **Real servislarга tegadigan testlar** — sekin, mo‘rt; mock qiling.
3. **O‘nta narsani tekshiradigan bitta ulkan test** — buzilsa qaysi biri bilinmaydi.
4. **Amalga oshirishни testlash, xatti-harakatni emas** — mo‘rt testlar.
5. **100% coverage quvish** — xavfli tarmoqni o‘tkazib, getter’larni qoplash.

## Xulosa

- Darajalar va dangasa formatlash bilan `print` o‘rniga `logging`.
- pytest testlarni oddiy funksiya + `assert` qiladi; holatlar uchun parametrize, sozlash uchun fixture.
- Tashqi bog‘liqliklarni mock qiling (DI bilan oson) — tez va izolyatsiyada test.
- Coverage’ni testlanmagan kod xaritasi sifatida ko‘ring, maksimallashtiriladigan ball emas.

## Mashqlar

**Oson**

1. Skript `print` debugging’ini mos darajalar bilan `logging` ga aylantiring.
2. `slugify` funksiyasi uchun ikki pytest test yozing va `pytest -v` ishlating.

**O‘rtacha**

3. Testni besh kirish/kutilgan juftlik bo‘yicha parametrize qiling.
4. Vaqtinchalik papka beradigan fixture va uni ishlatadigan test yozing.

**Advanced**

5. Foydalanuvchilarga email yuboradigan klassni mock mailer injektsiya qilib test qiling; to‘g‘ri argument bilan chaqirilganini va xato yo‘li logga yozilishini tasdiqlang.

**Xatoni top**

6. Test mo‘rt — goh o‘tadi, goh yo‘q. U real ob-havo API’sini chaqiradi. Nega va uni deterministik qilish uchun qanday qayta tuzasiz?

**Mini loyiha**

Ilgari yozgan kichik modulingizga qo‘shing: tizimli logging, to‘liq pytest to‘plami (fixture, parametrize, istisno testlari, tashqi bog‘liqlik uchun mock) va coverage hisoboti.

## Test

<details>
<summary>1. Nega f-string o‘rniga `log.info("x=%s", x)`?</summary>
%-shakl formatlashni xabar chindan chiqqunicha kechiktiradi — filtrlangan darajalar uchun ishni tejaydi.
</details>

<details>
<summary>2. pytest fixture nima beradi?</summary>
Qayta ishlatiladigan sozlash (va `yield` dan keyin tozalash) — testга parametr nomi bo‘yicha injektsiya qilinadi.
</details>

<details>
<summary>3. Tashqi API’larni unit testlardan qanday chetlab qolasiz?</summary>
Soxta/mock bog‘liqlik injektsiya qilib, real chaqiruv o‘rniga o‘zaro ta’sirni tekshirasiz.
</details>

<details>
<summary>4. 100% coverage’ga intilish kerakmi?</summary>
Yo‘q — coverage’ni testlanmagan tarmoqlarni topish uchun ishlating; xavfli xatti-harakatni test qiling.
</details>

## Keyingi dars

[Unumdorlik, Xotira va Eng Yaxshi Amaliyotlar](/courses/python-foundations/performance-and-memory).
