## Bu darsda nimalarni o‘rganamiz

- O‘zgaruvchi nima va nega kerak (qutilar o‘xshatishi).
- Asosiy ma’lumot turlari: son, matn, mantiqiy qiymat.
- Foydalanuvchidan ma’lumot olish (`input`) va chiqarish (`print`).
- Operatorlar bilan hisob-kitob qilish.

## Oldindan nima bilish kerak

[Python o‘rnatish va birinchi dastur](/courses/python-noldan/ornatish-birinchi-dastur). `print` bilan tanish bo‘lsangiz — tayyor.

## Asosiy g‘oya — bir jumlada

> **O‘zgaruvchi** — bu ma’lumotni saqlab qo‘yadigan nomli “quti”. Unga qiymat solib qo‘yasiz, keyin nomi orqali ishlatasiz.

**Hayotiy o‘xshatish — belgilangan qutilar.** Uyda narsalaringizni qutilarga solib, ustiga yorliq yopishtirasiz: “Kitoblar”, “Kiyimlar”. Keyin biror narsa kerak bo‘lsa, butun uyni titmaysiz — to‘g‘ri yorliqdagi qutini olasiz. O‘zgaruvchi ham shunday: `ism = "Ali"` deganingiz — “ism” yorlig‘i yopishtirilgan qutiga “Ali” ni solib qo‘yish.

## O‘zgaruvchi yaratish

```python
ism = "Ali"        # matn qiymati
yosh = 20          # son qiymati
print(ism)         # Ali
print(yosh)        # 20
```

- `=` belgisi — “teng” emas, **“solib qo‘y”** degani. `yosh = 20` → “yosh qutisiga 20 ni solib qo‘y”.
- Qutini istagancha o‘zgartirasiz:

```python
yosh = 20
yosh = 21          # eski qiymat o'chib, yangisi solindi
print(yosh)        # 21
```

Shuning uchun “o‘zgaruvchi” deyiladi — qiymati **o‘zgarishi** mumkin.

## Asosiy ma’lumot turlari

Har bir qiymatning “turi” bor. Boshida uchtasini bilish yetarli:

| Tur | Nomi | Misol |
|---|---|---|
| Butun son | `int` | `20`, `-5`, `1000` |
| Kasrli son | `float` | `3.14`, `0.5` |
| Matn (satr) | `str` | `"Ali"`, `"Salom"` |
| Mantiqiy | `bool` | `True`, `False` |

```python
yosh = 20          # int (butun son)
boyi = 1.75        # float (kasrli son)
ism = "Ali"        # str (matn) — qo'shtirnoq ichida
talaba = True      # bool (ha/yo'q)
```

Turini bilmoqchi bo‘lsangiz, `type()` ishlatiladi:

```python
print(type(yosh))   # <class 'int'>
print(type(ism))    # <class 'str'>
```

> [!NOTE]
> Matn (`str`) **doim qo‘shtirnoq ichida** yoziladi: `"Ali"` yoki `'Ali'`. Son esa qo‘shtirnoqsiz: `20`. `"20"` — bu son emas, **matn**! Bu farq juda muhim (pastda ko‘ramiz).

## Foydalanuvchidan ma’lumot olish: `input`

`input` foydalanuvchi klaviaturadan yozgan matnni oladi:

```python
ism = input("Ismingizni kiriting: ")
print("Salom, " + ism + "!")
```

Ishga tushirsangiz, dastur to‘xtab, sizdan yozishni kutadi. Yozib Enter bosgach:

```
Ismingizni kiriting: Ali
Salom, Ali!
```

> [!WARNING]
> `input` **doim matn (`str`) qaytaradi** — hatto raqam kiritsangiz ham! Shuning uchun sonni olish uchun uni aylantirish kerak:
> ```python
> yosh = input("Yoshingiz: ")     # bu MATN, masalan "20"
> yosh = int(yosh)                # endi SON: 20
> print(yosh + 1)                 # 21
> ```
> Aylantirmasangiz, `"20" + 1` xato beradi (matnga sonni qo‘shib bo‘lmaydi).

## Turni aylantirish (konvertatsiya)

```python
int("20")      # matndan songa → 20
float("3.5")   # matndan kasrga → 3.5
str(20)        # sondan matnga → "20"
```

Amalda ko‘p uchraydi:

```python
son = int(input("Bir son kiriting: "))
print("Kvadrati:", son * son)
```

## Operatorlar — hisob-kitob

```python
a = 10
b = 3
print(a + b)    # 13  qo'shish
print(a - b)    # 7   ayirish
print(a * b)    # 30  ko'paytirish
print(a / b)    # 3.333...  bo'lish (doim float)
print(a // b)   # 3   butun bo'lish (qoldiqsiz)
print(a % b)    # 1   qoldiq (modul)
print(a ** b)   # 1000  daraja (10 ning 3-darajasi)
```

`%` (qoldiq) juda foydali — masalan, son juftmi tekshirish uchun (`son % 2 == 0`). Buni shartlar darsida ishlatamiz.

Matn bilan ham ba’zi operatorlar ishlaydi:

```python
print("Ali" + " " + "Vali")   # birlashtirish → Ali Vali
print("ha" * 3)               # takrorlash → hahaha
```

## f-string — matnni chiroyli birlashtirish

`+` bilan birlashtirish charchatadi. Zamonaviy usul — **f-string** (`f"..."`):

```python
ism = "Ali"
yosh = 20
print(f"Mening ismim {ism}, yoshim {yosh}.")
# Mening ismim Ali, yoshim 20.
```

`f"..."` ichida `{ }` qavslar orasiga o‘zgaruvchi yozasiz — Python uni avtomatik qo‘yadi. Va e’tibor bering: f-string ichida sonni matnga aylantirish **shart emas** — u o‘zi joylaydi. Bu eng qulay usul, doim shuni ishlating.

## O‘zgaruvchi nomlash qoidalari

- Faqat harf, raqam va `_` (pastki chiziq); raqam bilan **boshlanmaydi**.
- Ma’noli nom bering: `y` emas, `yosh`; `x` emas, `narx`.
- Katta-kichik harf farqlanadi: `Yosh` va `yosh` — ikki xil quti.

```python
foydalanuvchi_yoshi = 20   # yaxshi nom
fy = 20                    # yomon nom (nimaligini keyin tushunmaysiz)
```

## Keng tarqalgan xatolar

1. **`input` natijasini son deb o‘ylash** — u doim matn; `int()` bilan aylantiring.
2. **Matnni qo‘shtirnoqsiz yozish** — `ism = Ali` xato; to‘g‘risi `ism = "Ali"`.
3. **`"20" + 5`** — matnga son qo‘shib bo‘lmaydi (xato beradi).
4. **`=` va `==` ni chalkashtirish** — `=` solib qo‘yadi, `==` taqqoslaydi (keyingi darsda).
5. **Raqamdan boshlangan nom** — `2yosh` xato; `yosh2` to‘g‘ri.

## Xulosa

- O‘zgaruvchi — ma’lumotni saqlaydigan nomli quti; `=` bilan qiymat solinadi.
- Asosiy turlar: `int`, `float`, `str` (qo‘shtirnoqli), `bool`.
- `input` doim matn qaytaradi — sonni `int()` bilan aylantiring.
- Operatorlar bilan hisoblaysiz; matnni birlashtirish uchun **f-string** eng qulay.

## Mashqlar

**Oson**

1. `ism` va `shahar` o‘zgaruvchilarini yarating va f-string bilan “Men Aliman, Toshkentdanman.” kabi jumla chiqaring.
2. Ikki sonni o‘zgaruvchiga solib, ularning yig‘indisi, ayirmasi va ko‘paytmasini chiqaring.

**O‘rtacha**

3. Foydalanuvchidan ikkita son so‘rang (`input` + `int`), ularning o‘rtachasini hisoblab chiqaring.
4. Foydalanuvchidan ism va yosh so‘rang, so‘ng “Salom Ali, kelgusi yili 21 yoshga to‘lasiz.” kabi jumla chiqaring.

**Fikrlash**

5. `10 / 3` va `10 // 3` natijalari nega har xil? Har birini tushuntiring.

**Xatoni top**

6. Nega bu xato beradi va qanday tuzatasiz?
```python
yosh = input("Yosh: ")
print(yosh + 5)
```

**Mini loyiha**

Oddiy “tanishuv” dasturi: ism, yosh va sevimli rangni so‘rab, chiroyli jumla bilan foydalanuvchini tanishtiruvchi matn chiqaring. Yoshni songa aylantirib, “10 yildan keyin necha yoshda bo‘lasiz” ni ham hisoblang.

## Test

<details>
<summary>1. `=` belgisi nima qiladi?</summary>
O‘ng tomondagi qiymatni chap tomondagi o‘zgaruvchiga (qutiga) solib qo‘yadi.
</details>

<details>
<summary>2. `input` qanday turdagi qiymat qaytaradi?</summary>
Doim matn (<code>str</code>) — hatto raqam kiritilsa ham. Songa aylantirish uchun <code>int()</code>/<code>float()</code>.
</details>

<details>
<summary>3. `"5" + "3"` nima beradi?</summary>
<code>"53"</code> — matnlar birlashtiriladi, qo‘shilmaydi. Son qo‘shish uchun avval <code>int()</code> qiling.
</details>

<details>
<summary>4. f-string nima uchun qulay?</summary>
Matn va o‘zgaruvchilarni <code>{ }</code> orqali osongina birlashtiradi, aylantirish shart emas.
</details>

## Keyingi dars

[Shartli operatorlar (if / elif / else)](/courses/python-noldan/shartlar) — dasturga qaror qabul qilishni o‘rgatamiz.
