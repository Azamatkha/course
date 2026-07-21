## Bu darsda nimalarni o‘rganamiz

- Takrorlanadigan ishlarni avtomatlashtirish: `for` va `while`.
- `range()` bilan sonlar bo‘yicha aylanish.
- `break` va `continue` bilan siklni boshqarish.
- Cheksiz sikl xavfi va undan qochish.

## Oldindan nima bilish kerak

[Shartli operatorlar](/courses/python-noldan/shartlar). Indentatsiya va `if` bilan tanish bo‘lishingiz kerak.

## Asosiy g‘oya — bir jumlada

> **Sikl** — bir xil ishni ko‘p marta takrorlash usuli. 100 marta “Salom” yozish uchun 100 qator emas, 2 qator yetadi.

**Hayotiy o‘xshatish — mashqlar.** Murabbiy “20 marta o‘tirib-turing” deydi — bu bitta ko‘rsatma, lekin 20 marta bajariladi. U 20 ta alohida jumla aytmaydi. Sikl ham shunday: bitta ko‘rsatma yozasiz, kompyuter uni kerakli marta takrorlaydi.

## `for` sikli — ma’lum marta takrorlash

```python
for i in range(5):
    print("Salom", i)
```

Natija:
```
Salom 0
Salom 1
Salom 2
Salom 3
Salom 4
```

- `range(5)` — 0 dan 4 gacha (5 ta son, **5 o‘zi kirmaydi**).
- `i` — har aylanishda navbatdagi qiymatni oladi (0, keyin 1, keyin 2...).
- Ichkaridagi (surilgan) qatorlar har safar bajariladi.

`range` ni turlicha ishlatish mumkin:

```python
range(5)         # 0,1,2,3,4
range(1, 6)      # 1,2,3,4,5  (boshi kiradi, oxiri kirmaydi)
range(0, 10, 2)  # 0,2,4,6,8  (2 lik qadam bilan)
```

## Ro‘yxat ustidan aylanish

`for` faqat sonlar emas, har qanday ro‘yxat ustidan yuradi (ro‘yxatlarni keyingi darsda batafsil ko‘ramiz):

```python
mevalar = ["olma", "banan", "uzum"]
for meva in mevalar:
    print("Men", meva, "yaxshi ko'raman")
```

Har aylanishda `meva` navbatdagi elementni oladi. Bu juda tabiiy — “har bir meva uchun...” degandek.

## `while` sikli — shart rost ekan takrorlash

`while` — “to‘xtamasdan, **toki** shart rost ekan” takrorlaydi:

```python
son = 1
while son <= 5:
    print(son)
    son = son + 1      # MUHIM: qiymatni o'zgartiramiz
```

Natija: 1, 2, 3, 4, 5.

- Har aylanishda shart (`son <= 5`) tekshiriladi.
- `son = son + 1` bo‘lmasa, shart hech qachon yolg‘on bo‘lmaydi → **cheksiz sikl!**

> [!WARNING]
> **Cheksiz sikl** — eng ko‘p uchraydigan xato. `while` ichida shartni o‘zgartiruvchi qatorni unutmang (masalan `son = son + 1`). Agar dastur “osilib qolsa”, to‘xtatish uchun terminalda **Ctrl + C** bosing.

## `for` va `while` — qaysi biri qachon?

| Vaziyat | Ishlatiladi |
|---|---|
| Necha marta takrorlashni **bilamiz** | `for` (masalan 10 marta) |
| Ro‘yxat/matn ustidan yuramiz | `for` |
| Shart bajarilguncha (necha marta noma’lum) | `while` |

```python
# for: aniq 3 marta
for i in range(3):
    print("Urinish", i)

# while: to'g'ri javob kelguncha (necha marta noma'lum)
javob = ""
while javob != "ha":
    javob = input("Davom etamizmi? (ha): ")
```

## `break` va `continue`

- **`break`** — siklni **butunlay to‘xtatadi**.
- **`continue`** — joriy aylanishni **tashlab**, keyingisiga o‘tadi.

```python
for son in range(1, 11):
    if son == 5:
        break          # 5 ga yetganda to'xtaydi → 1,2,3,4
    print(son)

for son in range(1, 6):
    if son == 3:
        continue       # 3 ni tashlab ketadi → 1,2,4,5
    print(son)
```

**O‘xshatish:** `break` — “taslim bo‘ldim, chiqdim”; `continue` — “bu birini o‘tkazib yuboraman, keyingisiga”.

## Yig‘indi hisoblash — klassik namuna

Sikl ko‘pincha “yig‘ib borish” uchun ishlatiladi:

```python
yigindi = 0
for son in range(1, 101):     # 1 dan 100 gacha
    yigindi = yigindi + son   # har safar qo'shib boramiz
print("1 dan 100 gacha yig'indi:", yigindi)   # 5050
```

Bu naqsh (bo‘sh o‘zgaruvchi + sikl ichida to‘ldirish) juda ko‘p uchraydi — yaxshilab yodda tuting.

## Ichma-ich sikllar

Sikl ichida sikl bo‘lishi mumkin (masalan jadval chizish):

```python
for i in range(1, 4):
    for j in range(1, 4):
        print(i * j, end=" ")   # end=" " → yangi qatorga o'tmaydi
    print()                     # bo'sh print → yangi qator
```

Natija — 3×3 ko‘paytmalar jadvali. Ichki sikl har tashqi aylanishda to‘liq aylanadi.

## Keng tarqalgan xatolar

1. **Cheksiz sikl** — `while` ichida shartni o‘zgartirishni unutish.
2. **`range` chegarasi** — `range(5)` oxiri 4, 5 emas. `range(1,6)` → 1..5.
3. **Indentatsiya** — sikl ichidagi qatorlar surilishi shart.
4. **O‘zgaruvchini sikldan tashqarida yig‘ish** — `yigindi = 0` ni sikldan **oldin** yozing, ichida emas.
5. **`for` da o‘zgaruvchini qo‘lda oshirishga urinish** — `for i in range(...)` o‘zi oshiradi; qo‘shimcha `i = i + 1` kerak emas.

## Xulosa

- Sikl bir ishni ko‘p marta takrorlaydi: aniq marta bo‘lsa `for`, shartga bog‘liq bo‘lsa `while`.
- `range` bilan sonlar bo‘yicha yuriladi; `for` ro‘yxat ustidan ham aylanadi.
- `break` to‘xtatadi, `continue` bir aylanishni tashlaydi.
- `while` da shartni o‘zgartirishni unutmang — aks holda cheksiz sikl.

## Mashqlar

**Oson**

1. `for` bilan 1 dan 10 gacha sonlarni chiqaring.
2. `for` bilan “Men Python o‘rganyapman” jumlasini 3 marta chiqaring.

**O‘rtacha**

3. 1 dan 50 gacha bo‘lgan **juft** sonlarni chiqaring (`% 2 == 0` yoki `range(2,51,2)`).
4. Foydalanuvchidan son so‘rang va uning **faktorialini** hisoblang (`1*2*3*...*n`).

**Fikrlash**

5. `break` va `continue` farqini hayotiy misol bilan tushuntiring.

**Xatoni top**

6. Nega bu dastur hech qachon to‘xtamaydi? Tuzating:
```python
son = 1
while son <= 5:
    print(son)
```

**Mini loyiha**

“Sonni top” o‘yini: dasturga yashirin son bering (masalan 7). Foydalanuvchidan `while` bilan takror-takror son so‘rang; agar katta bo‘lsa “kichikroq”, kichik bo‘lsa “kattaroq” deng, to‘g‘ri topsa “Tabriklaymiz!” deb chiqing va to‘xtang (`break`). Qo‘shimcha: nechinchi urinishda topganini ham chiqaring.

## Test

<details>
<summary>1. `range(3)` qaysi sonlarni beradi?</summary>
0, 1, 2 — oxirgi son (3) kirmaydi.
</details>

<details>
<summary>2. `for` va `while` orasidagi asosiy farq?</summary>
`for` — takrorlash soni ma’lum bo‘lganda; `while` — shart rost ekan takrorlaydi (soni noma’lum).
</details>

<details>
<summary>3. `break` nima qiladi?</summary>
Siklni butunlay to‘xtatadi va undan chiqadi.
</details>

<details>
<summary>4. Cheksiz sikldan qanday qochasiz?</summary>
`while` ichida shartni oxir-oqibat yolg‘on qiladigan o‘zgarishni qo‘shing (masalan hisoblagichni oshiring).
</details>

## Keyingi dars

[Ro‘yxatlar (list)](/courses/python-noldan/royxatlar) — ko‘p qiymatni bir joyda saqlashni o‘rganamiz.
