## Bu darsda nimalarni o‘rganamiz

- Ro‘yxat (`list`) nima va nega kerak.
- Element qo‘shish, o‘chirish va o‘zgartirish.
- Indeks orqali elementga murojaat qilish.
- Ro‘yxat ustidan sikl bilan yurish va foydali metodlar.

## Oldindan nima bilish kerak

[Sikllar (for va while)](/courses/python-noldan/sikllar) va [O‘zgaruvchilar](/courses/python-noldan/ozgaruvchilar-va-turlar).

## Asosiy g‘oya — bir jumlada

> **Ro‘yxat** — bitta o‘zgaruvchida **ko‘p qiymatni tartib bilan** saqlash usuli.

**Hayotiy o‘xshatish — xarid ro‘yxati.** Do‘konga borishdan oldin bitta qog‘ozga hamma kerakli narsani yozasiz: non, sut, tuxum... Har biriga alohida qog‘oz ishlatmaysiz — bitta ro‘yxat. Python’dagi `list` ham shunday: ko‘p qiymatni bitta nomli “ro‘yxat”da saqlaydi, tartibini eslab qoladi.

## Ro‘yxat yaratish

```python
mevalar = ["olma", "banan", "uzum"]
sonlar = [10, 20, 30, 40]
aralash = ["Ali", 20, True]      # turli tur ham bo'ladi
bosh = []                        # bo'sh ro'yxat
```

Kvadrat qavs `[ ]` ichida, vergul bilan ajratiladi. Ro‘yxatda nechta element borligini bilish:

```python
print(len(mevalar))   # 3
```

## Indeks — elementga murojaat

Har bir elementning **o‘rin raqami (indeks)** bor. **Muhim: sanoq 0 dan boshlanadi!**

```python
mevalar = ["olma", "banan", "uzum"]
#            0        1        2
print(mevalar[0])    # olma  (birinchi element!)
print(mevalar[1])    # banan
print(mevalar[2])    # uzum
print(mevalar[-1])   # uzum  (oxirgi element — manfiy indeks)
```

> [!IMPORTANT]
> Birinchi element `[0]`, ikkinchisi `[1]`... Bu boshlovchilar uchun eng g‘alati narsa, lekin barcha dasturlashda shunday. `[-1]` esa oxirgisini beradi — juda qulay.

Mavjud bo‘lmagan indeks xato beradi:

```python
print(mevalar[5])   # IndexError: list index out of range
```

## Elementni o‘zgartirish

Ro‘yxat **o‘zgaruvchan** — indeks orqali qiymatni almashtirasiz:

```python
mevalar = ["olma", "banan", "uzum"]
mevalar[1] = "shaftoli"
print(mevalar)    # ['olma', 'shaftoli', 'uzum']
```

## Qo‘shish va o‘chirish

```python
mevalar = ["olma", "banan"]
mevalar.append("uzum")        # oxiriga qo'shish → ['olma','banan','uzum']
mevalar.insert(1, "nok")      # 1-o'ringa qo'yish → ['olma','nok','banan','uzum']

mevalar.remove("banan")       # qiymat bo'yicha o'chirish
oxirgi = mevalar.pop()        # oxirgisini olib tashlaydi va qaytaradi
del mevalar[0]                # indeks bo'yicha o'chirish
```

- `.append(x)` — eng ko‘p ishlatiladigan: oxiriga qo‘shadi.
- `.remove(x)` — **qiymat** bo‘yicha; `del ro'yxat[i]` — **indeks** bo‘yicha.

## Ro‘yxat ustidan aylanish

```python
mevalar = ["olma", "banan", "uzum"]
for meva in mevalar:
    print("Men", meva, "yaxshi ko'raman")
```

Indeks ham kerak bo‘lsa, `enumerate`:

```python
for i, meva in enumerate(mevalar):
    print(i, "-", meva)      # 0 - olma, 1 - banan, ...
```

## Foydali metod va amallar

```python
sonlar = [3, 1, 4, 1, 5]
print(len(sonlar))      # 5   — nechta element
print(sum(sonlar))      # 14  — yig'indi
print(max(sonlar))      # 5   — eng katta
print(min(sonlar))      # 1   — eng kichik
sonlar.sort()           # tartiblaydi → [1,1,3,4,5]
print("olma" in mevalar)  # True — ro'yxatda bormi?
```

`in` operatori juda qulay — biror narsa ro‘yxatda bor-yo‘qligini tekshiradi.

## Kesib olish (slicing) — qism ro‘yxat

```python
sonlar = [10, 20, 30, 40, 50]
print(sonlar[1:4])    # [20, 30, 40]  (1-indeksdan 4-gacha, 4 kirmaydi)
print(sonlar[:3])     # [10, 20, 30]  (boshidan)
print(sonlar[2:])     # [30, 40, 50]  (2-dan oxirigacha)
```

## Ro‘yxatni to‘ldirish — klassik naqsh

Ko‘pincha bo‘sh ro‘yxatdan boshlab, sikl ichida to‘ldiramiz:

```python
kvadratlar = []
for son in range(1, 6):
    kvadratlar.append(son * son)
print(kvadratlar)     # [1, 4, 9, 16, 25]
```

Bu naqsh (bo‘sh `[]` + `for` + `.append`) juda muhim — ko‘p ishlatiladi.

## Keng tarqalgan xatolar

1. **Indeks 0 dan boshlanishini unutish** — birinchi element `[0]`, `[1]` emas.
2. **`IndexError`** — mavjud bo‘lmagan indeksga murojaat (`len` dan katta).
3. **`.remove` yo‘q qiymatni o‘chirishga urinish** — xato beradi; avval `in` bilan tekshiring.
4. **`.append` natijasini o‘zgaruvchiga solish** — `x = ro'yxat.append(...)` `None` qaytaradi! `.append` ro‘yxatni **joyida** o‘zgartiradi.
5. **Sikl ichida ro‘yxatni o‘chirish** — element o‘chirilsa indekslar siljiydi, chalkashlik chiqadi.

## Xulosa

- Ro‘yxat (`list`) — ko‘p qiymatni tartib bilan saqlaydi; `[ ]` bilan yaratiladi.
- Indeks 0 dan boshlanadi; `[-1]` oxirgisi.
- `.append`, `.insert`, `.remove`, `.pop`, `del` bilan boshqariladi.
- `for` bilan aylaniladi; `len/sum/max/min/sort/in` foydali.

## Mashqlar

**Oson**

1. 5 ta sevimli filmingizni ro‘yxatga soling va har birini `for` bilan chiqaring.
2. Sonlar ro‘yxatini yarating; yig‘indisi, eng kattasi va o‘rtachasini hisoblang.

**O‘rtacha**

3. Foydalanuvchidan `while` bilan takror so‘z so‘rab, ro‘yxatga qo‘shib boring; “tamom” yozsa to‘xtang va ro‘yxatni chiqaring.
4. Sonlar ro‘yxatidan faqat **juft** sonlarni yangi ro‘yxatga ajratib oling.

**Fikrlash**

5. `.remove("x")` va `del ro'yxat[2]` farqini tushuntiring.

**Xatoni top**

6. Nega `IndexError` chiqadi? Tuzating:
```python
mevalar = ["olma", "banan", "uzum"]
print(mevalar[3])
```

**Mini loyiha**

Oddiy “vazifalar ro‘yxati” (to-do): foydalanuvchi vazifa qo‘shishi, ro‘yxatni ko‘rishi va vazifani o‘chirishi mumkin bo‘lsin. `while` sikli va menyu (`1-qo‘shish, 2-ko‘rish, 3-o‘chirish, 4-chiqish`) bilan qiling.

## Test

<details>
<summary>1. Ro‘yxatning birinchi elementiga qanday murojaat qilinadi?</summary>
<code>ro'yxat[0]</code> — indeks 0 dan boshlanadi.
</details>

<details>
<summary>2. Oxirgi elementni qanday olasiz?</summary>
<code>ro'yxat[-1]</code>.
</details>

<details>
<summary>3. `.append(x)` nima qiladi?</summary>
Ro‘yxat oxiriga <code>x</code> ni qo‘shadi (ro‘yxatni joyida o‘zgartiradi, <code>None</code> qaytaradi).
</details>

<details>
<summary>4. `5 in [1,2,3]` nima beradi?</summary>
<code>False</code> — 5 ro‘yxatda yo‘q.
</details>

## Keyingi dars

[Lug‘at, tuple va to‘plam](/courses/python-noldan/lugat-tuple-set) — boshqa muhim ma’lumot tuzilmalari.
