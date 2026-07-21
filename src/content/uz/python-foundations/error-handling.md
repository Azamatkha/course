## Bu darsda nimalarni o‘rganamiz

- `try/except/else/finally` ni to‘g‘ri va aniq ishlatish.
- **EAFP** va LBYL ni tanlash va Python nega EAFP ni afzal ko‘rishini.
- **Maxsus istisno ierarxiyalari** tuzish.
- Istisnolarni zanjirlash va xatolarni jimgina yutmaslik.

## Oldindan nima bilish kerak

[Funksiyalar va scope](/courses/python-foundations/functions-arguments-scope). `try/except` ni ko‘rgansiz; endi uni professionaldek ishlatasiz.

## Asosiy g‘oya — bir jumlada

> Istisnolar — **strukturaviy xato signallari** bo‘lib, ular biror narsa ushlaguncha chaqiruv stekidan yuqoriga ko‘tariladi — baxtli yo‘lni xato boshqaruvdan ajratuvchi toza kanal.

**Hayotiy o‘xshatish — yong‘in signali, tekshiruvlar labirinti emas.** LBYL (“sakrashdan oldin qara”) har eshik ochiqligini oldindan tekshiradi — lekin eshik tekshiruv bilan o‘tish orasida qulflanishi mumkin. EAFP (“ruxsatdan ko‘ra kechirim so‘rash oson”) shunchaki o‘tadi va eshik qulf bo‘lsa signal (istisno) ishlaydi. Python EAFP uchun qurilgan.

## To‘liq operator

```python
try:
    data = parse(raw)          # xato bo'lishi mumkin bo'lgan kod
except ValueError as e:        # MUAYYAN istisnoni boshqarish
    log.warning("yomon kirish: %s", e)
    data = default
else:
    save(data)                 # FAQAT istisno bo'lmasa ishlaydi
finally:
    cleanup()                  # DOIM ishlaydi — resurslarni bo'shatish
```

- **`except`** — muayyan turlarni ushla; eng aniqdan eng umumiygacha.
- **`else`** — faqat-muvaffaqiyat tarmog‘i; `try` blokini qisqa tutadi.
- **`finally`** — nima bo‘lsa ham ishlaydigan tozalash.

## EAFP va LBYL

```python
# LBYL — poyga va batafsil
if "key" in d and d["key"] is not None:
    use(d["key"])

# EAFP — Pythonik
try:
    use(d["key"])
except KeyError:
    handle_missing()
```

EAFP **TOCTOU** (tekshiruv-dan-ishlatishgacha) poygalaridan qochadi. Uni afzal ko‘ring — lekin blanket emas, *muayyan* istisnoni ushlang.

## Tor ushlang

```python
try:
    risky()
except Exception:          # ⚠️ juda keng — xatolarni yashiradi
    pass                   # ⚠️ va yutish — eng yomon gunoh

# Yaxshiroq:
try:
    risky()
except (TimeoutError, ConnectionError) as e:
    retry_later(e)         # aynan kutganingizni boshqar; qolganini tarqat
```

Qoidalar:
- Amalда boshqara oladigan **eng tor** istisnoni ushlang.
- **Hech qachon** `except: pass` — jim muvaffaqiyatsizlik — bu 3 kechada debug qiladigan xato.
- Kutilmagan istisnolarни yuqori darajali handlerga **tarqating**.

## Maxsus istisno ierarxiyalari

```python
class AppError(Exception):
    """Barcha xatolarimiz uchun baza."""

class ValidationError(AppError): ...
class NotFoundError(AppError): ...
class PaymentError(AppError): ...

# Chaqiruvchi granularlikni tanlaydi:
try:
    process(order)
except ValidationError:
    return 400
except AppError:              # NotFound, Payment va h.k. ni ushlaydi
    return 500
```

Baza klass chaqiruvchilarga keng *yoki* aniq ushlashga imkon beradi va *sizning* xatolaringizni kutubxona xatolaridan ajratadi.

## Istisnolarni zanjirlash

Qayta ko‘targanda asl sababни saqlang:

```python
try:
    value = int(raw)
except ValueError as e:
    raise ValidationError(f"son kutildi, {raw!r} olindi") from e   # sababни saqlaydi
```

`from e` aslni `__cause__` da yozadi, shuning uchun traceback ikkalasini ko‘rsatadi.

## Keng tarqalgan xatolar

1. **Yalang‘och `except:` / `except Exception: pass`** — hamma narsani yutadi, xatolarni yashiradi.
2. **Juda keng ushlash** — ko‘rishingiz kerak bo‘lgan kutilmagan xatolarni niqoblaydi.
3. **Katta hajmda oddiy boshqaruv uchun istisnolar** (kutilgan tez holatlar uchun EAFP mayli).
4. **Traceback’ni yo‘qotish** — `from`siz qayta ko‘tarish.
5. **`except` da tozalash** — `finally`/`with` o‘rniga; muvaffaqiyat yo‘lida oqadi.

## Xulosa

- `try/except/else/finally`: xavfli kod, muayyan handlerlar, faqat-muvaffaqiyat tarmog‘i, kafolatlangan tozalash.
- Tor `except` bilan EAFP ni afzal ko‘ring; xatolarni jimgina yutmang.
- Chaqiruvchilar to‘g‘ri darajada ushlashi uchun maxsus istisno ierarxiyasini tuzing.
- Ildiz sababni saqlash uchun `from e` bilan zanjirlang.

## Mashqlar

**Oson**

1. `int(input())` ni `try/except ValueError` ga o‘rang va yomon kirishda qayta so‘rang.
2. LBYL lug‘at kirishini `except KeyError` bilan EAFP ga qayta yozing.

**O‘rtacha**

3. `AppError` bazasi va ikki subklass aniqlang; har tur uchun boshqa kod qaytaruvchi handler yozing.
4. Past darajali `ValueError` ni `raise ... from e` bilan domen `ValidationError` ga aylantiring va `__cause__` ni tekshiring.

**Advanced**

5. Nolga bo‘lishда maxsus `MathError` ko‘taradigan, aslni zanjirlaydigan va muvaffaqiyat/xato uchun test qilingan `safe_divide` yozing.

**Xatoni top**

6. Bu real xatolarni yashiradi. Nima noto‘g‘ri va tuzating:
```python
try:
    result = compute()
except Exception:
    result = None
```

**Mini loyiha**

Kichik validatsiya kutubxonasi quring: `AppError` ierarxiyasi, muayyan xatolar ko‘taradigan `validate(data, schema)` va to‘liq zanjirlangan traceback’ni loglaydigan yuqori darajali handler.

## Test

<details>
<summary>1. `finally` bloki qachon ishlaydi?</summary>
Doim — try/except/else’dan keyin, istisno bo‘lsin yoki yo‘q (hatto tarqalsa ham).
</details>

<details>
<summary>2. Nega Python’da EAFP afzal?</summary>
Tekshiruv/ishlatish poyga holatlaridan qochadi; kutgan muayyan istisnoni ushlang.
</details>

<details>
<summary>3. `raise NewError(...) from e` nimani saqlaydi?</summary>
Asl istisnoni sabab (`__cause__`) sifatida, to‘liq traceback’ni.
</details>

<details>
<summary>4. `except Exception: pass` nima uchun yomon?</summary>
Barcha xatolarni jimgina yutadi — xatolar ko‘rinmas va debug qilib bo‘lmaydigan bo‘ladi.
</details>

## Keyingi dars

[Fayllar, JSON va serializatsiya](/courses/python-foundations/files-and-json).
