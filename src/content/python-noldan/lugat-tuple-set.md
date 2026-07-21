## Bu darsda nimalarni o‘rganamiz

- Lug‘at (`dict`) — kalit-qiymat juftliklari.
- Tuple — o‘zgarmas ro‘yxat.
- Set (to‘plam) — takrorlanmas elementlar.
- Qaysi birini qachon ishlatish kerakligini.

## Oldindan nima bilish kerak

[Ro‘yxatlar (list)](/courses/python-noldan/royxatlar).

## Asosiy g‘oya — bir jumlada

> Ro‘yxatdan tashqari yana uch muhim tuzilma bor: **lug‘at** (nom bilan izlash), **tuple** (o‘zgармas ro‘yxat) va **set** (takrorsiz to‘plam).

**Hayotiy o‘xshatish — telefon kitobchasi.** Ro‘yxat — bu shunchaki ismlar qatori. Lug‘at esa telefon kitobchasi: har bir **ism** (kalit) yoniga uning **raqami** (qiymat) yozilgan. Raqamni topish uchun butun ro‘yxatni titmaysiz — ismni izlab, to‘g‘ridan-to‘g‘ri raqamni olasiz.

## Lug‘at (dict) — kalit va qiymat

```python
talaba = {
    "ism": "Ali",
    "yosh": 20,
    "shahar": "Toshkent"
}
print(talaba["ism"])     # Ali  — kalit orqali qiymatni olamiz
print(talaba["yosh"])    # 20
```

- Jingalak qavs `{ }` ichida `kalit: qiymat` juftliklari.
- Ro‘yxatda indeks (`[0]`) bilan olardik; lug‘atda **kalit** (`["ism"]`) bilan.

Qiymatni o‘zgartirish yoki yangi kalit qo‘shish:

```python
talaba["yosh"] = 21           # o'zgartirish
talaba["kasb"] = "dasturchi"  # yangi qo'shish
del talaba["shahar"]          # o'chirish
```

Lug‘at ustidan aylanish:

```python
for kalit in talaba:
    print(kalit, "->", talaba[kalit])

# yoki ikkalasini birga:
for kalit, qiymat in talaba.items():
    print(kalit, "->", qiymat)
```

Foydali metodlar:

```python
print(talaba.keys())          # barcha kalitlar
print(talaba.values())        # barcha qiymatlar
print("ism" in talaba)        # True — kalit bormi?
print(talaba.get("boyi", 0))  # kalit yo'q bo'lsa 0 qaytaradi (xato bermaydi)
```

> [!TIP]
> Kalit bor-yo‘qligiga ishonmasangiz, `talaba["boyi"]` xato beradi. `talaba.get("boyi", 0)` esa xavfsiz — yo‘q bo‘lsa standart qiymat (0) qaytaradi.

## Tuple — o‘zgarmas ro‘yxat

Tuple ro‘yxatga o‘xshaydi, lekin **o‘zgartirib bo‘lmaydi** (qat’iy):

```python
koordinata = (10, 20)
print(koordinata[0])    # 10
# koordinata[0] = 5     # XATO! tuple o'zgarmas
```

Qachon kerak? — Qiymatlar **o‘zgarmasligi kerak** bo‘lganda: koordinatalar, sana (kun, oy, yil), rang (R, G, B). O‘zgarmaslik xatolardan himoya qiladi.

## Set (to‘plam) — takrorlanmas elementlar

Set — takrorlanmaydigan elementlar to‘plami (tartibsiz):

```python
sonlar = {1, 2, 2, 3, 3, 3}
print(sonlar)           # {1, 2, 3}  — takrorlar avtomatik o'chdi!
```

Qachon kerak? — **Takrorlarni yo‘qotish** yoki “bor-yo‘qligini” tez tekshirish uchun:

```python
mehmonlar = ["Ali", "Vali", "Ali", "Guli"]
noyoblar = set(mehmonlar)      # {'Ali','Vali','Guli'}
print(len(noyoblar))           # 3 ta noyob mehmon
```

## Qaysi birini qachon ishlatish?

| Kerak | Ishlatiladi |
|---|---|
| Tartiblangan ko‘p qiymat, o‘zgaruvchan | **list** `[ ]` |
| Nom (kalit) bilan izlash | **dict** `{k: v}` |
| O‘zgarmas qiymatlar to‘plami | **tuple** `( )` |
| Takrorsiz, tez tekshirish | **set** `{ }` |

## Ichma-ich tuzilmalar

Real ma’lumot ko‘pincha bir-birining ichida bo‘ladi:

```python
talabalar = [
    {"ism": "Ali", "yosh": 20},
    {"ism": "Vali", "yosh": 22},
]
for t in talabalar:
    print(t["ism"], "-", t["yosh"], "yosh")
```

Bu — ro‘yxat ichida lug‘atlar. JSON ma’lumotlari aynan shunday ko‘rinadi (keyingi darslarda uchraysiz).

## Keng tarqalgan xatolar

1. **Lug‘atda yo‘q kalitga murojaat** — `KeyError`; `.get()` yoki `in` bilan himoyalaning.
2. **Tuple’ni o‘zgartirishga urinish** — xato; o‘zgaruvchan kerak bo‘lsa list ishlating.
3. **Set’da tartib bor deb o‘ylash** — set tartibsiz; tartib kerak bo‘lsa list.
4. **`{}` bo‘sh set emas** — bo‘sh `{}` bu **lug‘at**! Bo‘sh set uchun `set()` yozing.
5. **Kalit sifatida ro‘yxat ishlatish** — ro‘yxat kalit bo‘la olmaydi (o‘zgaruvchan); tuple bo‘ladi.

## Xulosa

- `dict` — kalit-qiymat juftliklari; kalit orqali tez izlaysiz.
- `tuple` — o‘zgarmas ro‘yxat; xavfsizlik uchun.
- `set` — takrorsiz to‘plam; takrorlarni yo‘qotish/tez tekshirish uchun.
- To‘g‘ri tuzilmani tanlash kodni sodda va tez qiladi.

## Mashqlar

**Oson**

1. O‘zingiz haqingizda lug‘at yarating (ism, yosh, shahar) va har bir kalit-qiymatni chiqaring.
2. Sonlar ro‘yxatidagi takrorlarni `set` bilan yo‘qoting.

**O‘rtacha**

3. So‘zlar ro‘yxatidan har bir so‘z necha marta uchraganini lug‘atda hisoblang (masalan `{"olma": 3, ...}`).
4. Talabalar ro‘yxatini (lug‘atlar) yarating va yoshi 21 dan katta bo‘lganlarni chiqaring.

**Fikrlash**

5. Nega telefon kitobchasi uchun `list` emas, `dict` qulayroq? Izohlang.

**Xatoni top**

6. Nega `KeyError` chiqadi va qanday xavfsiz qilasiz?
```python
talaba = {"ism": "Ali"}
print(talaba["yosh"])
```

**Mini loyiha**

Oddiy “lug‘at ilovasi”: foydalanuvchi so‘z va uning tarjimasini qo‘shsin (`dict`), keyin so‘zni izlab tarjimasini topsin. So‘z yo‘q bo‘lsa “topilmadi” deng (`.get`).

## Test

<details>
<summary>1. Lug‘atda qiymatga qanday murojaat qilinadi?</summary>
Kalit orqali: <code>lugat["kalit"]</code> (indeks emas).
</details>

<details>
<summary>2. Tuple’ning list’dan farqi?</summary>
Tuple o‘zgarmas — yaratilgach elementlarini o‘zgartirib bo‘lmaydi.
</details>

<details>
<summary>3. Set nima uchun qulay?</summary>
Takrorlanmas elementlar saqlaydi — takrorlarni yo‘qotish va tez "bor-yo‘q" tekshirish uchun.
</details>

<details>
<summary>4. Bo‘sh `{}` qaysi tur?</summary>
Bo‘sh <code>dict</code> (lug‘at). Bo‘sh set uchun <code>set()</code> yoziladi.
</details>

## Keyingi dars

[Satrlar (matn) bilan ishlash](/courses/python-noldan/satrlar) — matnni chuqurroq o‘rganamiz.
