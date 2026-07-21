## Bu darsda nimalarni o‘rganamiz

- Xato (error) nima va nega u yomon emas.
- `try / except` bilan xatolarni ushlash.
- Fayldan o‘qish va faylga yozish.
- `with` bilan xavfsiz ishlash va UTF-8.

## Oldindan nima bilish kerak

[Funksiyalar](/courses/python-noldan/funksiyalar) va [Modullar](/courses/python-noldan/modullar-kutubxonalar).

## Asosiy g‘oya — bir jumlada

> **Xato** — dastur biror ishni bajara olmaganda beradigan signal. `try/except` bilan biz uni **ushlab**, dastur qulamasligini ta’minlaymiz. **Fayllar** esa ma’lumotni dastur yopilgach ham saqlab qolish imkonini beradi.

**Hayotiy o‘xshatish — mashinadagi lampochkalar.** Mashinada nimadir noto‘g‘ri bo‘lsa, panelda lampochka yonadi — bu foydali ogohlantirish, halokat emas. Xato ham shunday: “bu yerda muammo bor” deb aytadi. `try/except` — bu muammo bo‘lsa nima qilishni oldindan rejalashtirish (“benzin tugasa, zaxira idishdan quy”).

## Xato nima?

Kod noto‘g‘ri ish qilsa, Python **xato** (exception) beradi va dastur to‘xtaydi:

```python
son = int("salom")     # ValueError: matnni songa aylantirib bo'lmadi
print(10 / 0)          # ZeroDivisionError: nolga bo'lish
mevalar = ["olma"]
print(mevalar[5])      # IndexError: bunday indeks yo'q
```

Xatolar yomon emas — ular **muammoni aniq ko‘rsatadi**. Xato turini (masalan `ValueError`) o‘qib, sababini tushunish muhim.

## `try / except` — xatoni ushlash

Foydalanuvchi noto‘g‘ri ma’lumot kiritsa, dastur qulamasin:

```python
try:
    yosh = int(input("Yoshingiz: "))
    print(f"Kelgusi yili {yosh + 1} yoshga to'lasiz")
except ValueError:
    print("Iltimos, to'g'ri son kiriting!")
```

- `try:` — “xato bo‘lishi mumkin bo‘lgan kod”ni shu yerga yozamiz.
- `except ValueError:` — “agar shu xato chiqsa, mana buni qil”.

Agar foydalanuvchi “yigirma” deb yozsa, dastur qulamasdan xushmuomala xabar chiqaradi.

## `try / except / else / finally`

```python
try:
    son = int(input("Son: "))
except ValueError:
    print("Bu son emas!")
else:
    print(f"Rahmat, {son} ni oldim")   # xato bo'lmasa ishlaydi
finally:
    print("Dastur tugadi")             # DOIM ishlaydi
```

- `else` — xato **bo‘lmaganda** ishlaydi.
- `finally` — xato bor-yo‘qligidan qat’i nazar **doim** ishlaydi (masalan tozalash uchun).

> [!WARNING]
> `except:` ni bo‘sh (tur ko‘rsatmasdan) ishlatmang — u **hamma** xatoni yashiradi, hatto sizning kod xatoyingizni ham. Doim aniq turni yozing: `except ValueError:`. Aks holda haqiqiy muammoni topolmay qolasiz.

## Bir nechta xatoni ushlash

```python
try:
    a = int(input("Birinchi son: "))
    b = int(input("Ikkinchi son: "))
    print(a / b)
except ValueError:
    print("Faqat son kiriting")
except ZeroDivisionError:
    print("Nolga bo'lib bo'lmaydi")
```

Har bir xato turi uchun alohida javob berish mumkin.

## Fayllar — ma’lumotni saqlash

Dastur yopilsa, o‘zgaruvchilardagi ma’lumot yo‘qoladi. **Fayl**ga yozsak — saqlanib qoladi.

### Faylga yozish

```python
with open("hisobot.txt", "w", encoding="utf-8") as f:
    f.write("Salom, dunyo!\n")
    f.write("Ikkinchi qator\n")
```

- `open("nom", "w")` — faylni **yozish** (`w`) rejimida ochadi.
- `with ... as f:` — fayl bilan xavfsiz ishlash (o‘zi yopadi).
- `encoding="utf-8"` — o‘zbekcha/kirilcha harflar uchun **shart**.
- `\n` — yangi qator belgisi.

> [!IMPORTANT]
> `"w"` rejimi faylni **butunlay tozalab**, qaytadan yozadi! Mavjud matnga qo‘shish uchun `"a"` (append) ishlating. Adashib `"w"` yozib, ma’lumotni yo‘qotib qo‘ymang.

### Fayldan o‘qish

```python
with open("hisobot.txt", "r", encoding="utf-8") as f:
    matn = f.read()        # butun faylni o'qiydi
print(matn)

# yoki qatorma-qator:
with open("hisobot.txt", encoding="utf-8") as f:
    for qator in f:
        print(qator.strip())   # strip() — ortiqcha \n ni olib tashlaydi
```

### Fayl rejimlari

| Rejim | Ma’nosi |
|---|---|
| `"r"` | O‘qish (standart) — fayl mavjud bo‘lishi kerak |
| `"w"` | Yozish — **eski matnni o‘chiradi** |
| `"a"` | Qo‘shish (append) — oxiriga qo‘shadi |

## Nega `with` ishlatamiz?

`with` fayl bilan ishlashda uni **avtomatik yopadi** — hatto xato chiqsa ham. Bu resurslarni behuda band qilmaydi. `open` ni `with`siz ishlatib, `close()` ni unutish — keng tarqalgan xato. Doim `with` ishlating.

## Amaliy misol — xavfsiz o‘qish

```python
try:
    with open("malumot.txt", encoding="utf-8") as f:
        print(f.read())
except FileNotFoundError:
    print("Fayl topilmadi — avval uni yarating")
```

Fayl yo‘q bo‘lsa dastur qulamaydi — xushmuomala xabar chiqaradi. Bu xatolar bilan fayllarni birlashtirgan real kod.

## Keng tarqalgan xatolar

1. **Bo‘sh `except:`** — hamma xatoni yashiradi; aniq tur yozing.
2. **`"w"` bilan ma’lumotni yo‘qotish** — qo‘shish kerak bo‘lsa `"a"`.
3. **`encoding="utf-8"` ni unutish** — o‘zbekcha harflar buziladi.
4. **`with`siz ochib, yopishni unutish** — doim `with` ishlating.
5. **Mavjud bo‘lmagan faylni `"r"` bilan ochish** — `FileNotFoundError`; `try/except` bilan himoyalaning.

## Xulosa

- Xato — muammoni ko‘rsatuvchi signal; `try/except` bilan uni ushlab, dastur qulamasligini ta’minlaysiz.
- Aniq xato turini yozing (`except ValueError:`), bo‘sh `except` dan qoching.
- Fayllar ma’lumotni doimiy saqlaydi: `open` + `with`, `"r"/"w"/"a"` rejimlari.
- Doim `encoding="utf-8"` va `with` ishlating.

## Mashqlar

**Oson**

1. Foydalanuvchidan son so‘rang; noto‘g‘ri kiritsa, `try/except` bilan xushmuomala xabar bering.
2. `salom.txt` fayliga uch qator matn yozing, so‘ng o‘qib chiqaring.

**O‘rtacha**

3. Foydalanuvchidan bir nechta ism so‘rab (`while`), har birini faylga `"a"` rejimida qo‘shib boring.
4. Faylda saqlangan sonlarni o‘qib, ularning yig‘indisini hisoblang (xato bo‘lsa ushlang).

**Fikrlash**

5. Nega bo‘sh `except:` yomon? Real misol bilan tushuntiring.

**Xatoni top**

6. Nega bu dasturda o‘zbekcha harflar buzilishi mumkin? Tuzating:
```python
with open("test.txt", "w") as f:
    f.write("Salom, o'zbek tili")
```

**Mini loyiha**

“Kundalik” (diary) ilovasi: foydalanuvchi yozuv qo‘shsin (sana bilan, `datetime` dan foydalaning) — har bir yozuv faylga `"a"` rejimida qo‘shilsin. Alohida rejim barcha yozuvlarni o‘qib chiqsin. Fayl yo‘q bo‘lsa `try/except` bilan ushlang.

## Test

<details>
<summary>1. `try/except` nima uchun kerak?</summary>
Xato chiqishi mumkin bo‘lgan kodni ishlatib, xato bo‘lsa dastur qulamasligini ta’minlash uchun.
</details>

<details>
<summary>2. `"w"` rejimi mavjud faylga nima qiladi?</summary>
Uni butunlay tozalab, qaytadan yozadi. Qo‘shish uchun <code>"a"</code> ishlating.
</details>

<details>
<summary>3. Nega `with open(...)` afzal?</summary>
Fayl avtomatik (xato bo‘lsa ham) yopiladi — <code>close()</code> ni unutish xavfi yo‘q.
</details>

<details>
<summary>4. O‘zbekcha matn uchun nima qo‘shish kerak?</summary>
<code>encoding="utf-8"</code>.
</details>

## Keyingi dars

[OOP asoslari va keyingi qadamlar](/courses/python-noldan/oop-va-keyingi-qadamlar) — kursning yakuni va yo‘l xaritasi.
