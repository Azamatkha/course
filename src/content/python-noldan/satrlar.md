## Bu darsda nimalarni o‘rganamiz

- Matn (satr) yaratish va birlashtirish.
- f-string bilan chiroyli formatlash.
- Foydali metodlar: `upper`, `lower`, `strip`, `split`, `replace`.
- Matn ichidan qism olish (indeks va slicing).

## Oldindan nima bilish kerak

[O‘zgaruvchilar va turlar](/courses/python-noldan/ozgaruvchilar-va-turlar) va [Ro‘yxatlar](/courses/python-noldan/royxatlar).

## Asosiy g‘oya — bir jumlada

> **Satr (`str`)** — bu harflar ketma-ketligi. Aslida u **harflardan iborat ro‘yxatga o‘xshaydi** — indeks, slicing va sikl unga ham ishlaydi.

**Hayotiy o‘xshatish — marvarid munchoq.** Satr — ipga tizilgan munchoqlar zanjiri; har bir munchoq — bitta harf. Zanjirning boshidan sanab (0 dan), istagan munchoqni olishingiz, bir qismini kesib olishingiz yoki zanjirlarni ulashingiz mumkin.

## Satr yaratish

```python
ism = "Ali"
gap = 'Salom dunyo'        # bir yoki ikki qo'shtirnoq — farqi yo'q
kop_qatorli = """Bu
bir necha qatorli
matn"""                    # uch qo'shtirnoq — ko'p qatorli
```

Uzunligini bilish:

```python
print(len("Salom"))    # 5
```

## Birlashtirish va takrorlash

```python
ism = "Ali"
familiya = "Valiyev"
print(ism + " " + familiya)   # Ali Valiyev
print("=" * 20)               # ==================== (20 marta)
```

Lekin eng qulay usul — **f-string**:

```python
yosh = 20
print(f"Mening ismim {ism}, yoshim {yosh}.")
```

## Indeks va slicing — qism olish

Satr ham 0 dan indekslanadi (xuddi ro‘yxat kabi):

```python
soz = "Python"
#      012345
print(soz[0])      # P  (birinchi harf)
print(soz[-1])     # n  (oxirgi harf)
print(soz[0:3])    # Pyt  (0 dan 3 gacha, 3 kirmaydi)
print(soz[:3])     # Pyt
print(soz[3:])     # hon
```

> [!NOTE]
> Satrlar **o‘zgarmas** — `soz[0] = "J"` xato beradi! O‘zgartirish uchun yangi satr yasaysiz: `"J" + soz[1:]`.

## Foydali metodlar

Satrlarda tayyor “metod”lar juda ko‘p — ular yangi satr qaytaradi (asl satr o‘zgarmaydi):

```python
matn = "  Salom Dunyo  "
print(matn.upper())        # "  SALOM DUNYO  "  — katta harf
print(matn.lower())        # "  salom dunyo  "  — kichik harf
print(matn.strip())        # "Salom Dunyo"      — chetdagi bo'shliqlarni olib tashlaydi
print(matn.replace("Dunyo", "Olam"))  # Salom -> Olam
print("Salom".startswith("Sa"))       # True
print("dunyo" in matn.lower())        # True — ichida bormi?
```

Eng ko‘p ishlatiladiganlari: `strip()` (foydalanuvchi kiritgan bo‘shliqlarni tozalash), `lower()` (taqqoslashdan oldin), `replace()`.

## `split` va `join` — matn ↔ ro‘yxat

```python
gap = "olma banan uzum"
sozlar = gap.split()        # ['olma', 'banan', 'uzum']  — bo'shliq bo'yicha bo'lish
print(len(sozlar))          # 3

sana = "2024-01-15"
qismlar = sana.split("-")   # ['2024', '01', '15']

# teskarisi — ro'yxatni matnga:
print(", ".join(sozlar))    # "olma, banan, uzum"
```

`split` — matndan ro‘yxat yasaydi (masalan, gapni so‘zlarga bo‘lish). `join` — teskarisi.

## Matnni son bilan bog‘lash

Eslatma (o‘zgaruvchilar darsidan): `input` matn qaytaradi. Sonni matnga yoki matnni songa aylantirish:

```python
yosh = 20
xabar = "Yoshim: " + str(yosh)     # str() bilan songa matn qo'shamiz
# yoki oddiyroq:
xabar = f"Yoshim: {yosh}"          # f-string o'zi joylaydi
```

## Amaliy misol — ismni chiroyli qilish

```python
ism = input("Ismingiz: ").strip().title()
# .strip() — chetdagi bo'shliqlarni olib tashlaydi
# .title()  — har so'zning bosh harfini katta qiladi
print(f"Salom, {ism}!")
# Kiritish: "   ali valiyev  " -> "Salom, Ali Valiyev!"
```

Metodlarni **zanjir** qilib ulash mumkin: `.strip().title()` — avval tozalaydi, keyin bosh harflarni kattalashtiradi.

## Keng tarqalgan xatolar

1. **Satrni o‘zgartirishga urinish** — `soz[0] = "x"` xato; satr o‘zgarmas.
2. **Metod natijasini olishni unutish** — `matn.upper()` asl `matn`ni o‘zgartirmaydi, yangi satr **qaytaradi**; uni saqlang: `matn = matn.upper()`.
3. **Katta-kichik harf taqqoslash** — `"Ali" == "ali"` → `False`. Avval `.lower()` qiling.
4. **`strip` ni unutish** — foydalanuvchi kiritgan bo‘shliqlar taqqoslashni buzadi.
5. **Son va matnni `+` bilan qo‘shish** — `"Yosh: " + 20` xato; `str(20)` yoki f-string.

## Xulosa

- Satr — harflar ketma-ketligi; indeks va slicing ishlaydi, lekin u **o‘zgarmas**.
- Birlashtirish uchun `+` yoki (yaxshirog‘i) f-string.
- Metodlar: `upper/lower/strip/replace/split/join` — yangi satr qaytaradi.
- `split` matndan ro‘yxat, `join` ro‘yxatdan matn yasaydi.

## Mashqlar

**Oson**

1. Ism so‘rang, uni katta harflarda va harflar sonini chiqaring.
2. Gap so‘rang va uni `split` bilan so‘zlarga bo‘lib, nechta so‘z borligini ayting.

**O‘rtacha**

3. To‘liq ism (ism + familiya) so‘rang va faqat bosh harflarni chiqaring (masalan “Ali Valiyev” → “A.V.”).
4. `"2024-01-15"` sanasini `split("-")` bilan bo‘lib, “15-01-2024” ko‘rinishida chiqaring.

**Fikrlash**

5. Nega `matn.upper()` dan keyin `matn` o‘zgarmaydi? Metod qanday ishlaydi?

**Xatoni top**

6. Nega bu xato beradi va qanday tuzatasiz?
```python
yosh = 20
print("Yosh: " + yosh)
```

**Mini loyiha**

Oddiy “parol tekshirgich”: foydalanuvchidan parol so‘rang va uzunligi 8+ mi, katta harf bor mi, raqam bor mi tekshiring (`len`, `.isupper()`, `.isdigit()` yoki har bir harfni tekshirish bilan) va “kuchli/zaif” deb baho bering.

## Test

<details>
<summary>1. Satrning uzunligini qanday bilasiz?</summary>
<code>len(satr)</code>.
</details>

<details>
<summary>2. `"Salom"[1]` nima beradi?</summary>
<code>"a"</code> — indeks 0 dan boshlanadi, demak [1] ikkinchi harf.
</details>

<details>
<summary>3. `.split()` nima qiladi?</summary>
Matnni (standart holatda bo‘shliq bo‘yicha) so‘zlar ro‘yxatiga bo‘ladi.
</details>

<details>
<summary>4. `matn.upper()` asl matnni o‘zgartiradimi?</summary>
Yo‘q — satr o‘zgarmas; u yangi satr qaytaradi, uni saqlab olish kerak.
</details>

## Keyingi dars

[Funksiyalar](/courses/python-noldan/funksiyalar) — kodni qayta ishlatiladigan bo‘laklarga bo‘lamiz.
