## Bu darsda nimalarni o‘rganamiz

- JSON nima va nega hamma joyda ishlatiladi.
- `json` moduli bilan o‘qish va yozish.
- CSV (jadval) fayllar bilan ishlash.
- Real ma’lumotni xavfsiz saqlash va qayta o‘qish.

## Oldindan nima bilish kerak

[Xatoliklar va fayllar](/courses/python-noldan/xatoliklar-va-fayllar), [Lug‘atlar](/courses/python-noldan/lugat-tuple-set).

## Asosiy g‘oya — bir jumlada

> **JSON** va **CSV** — ma’lumotni faylda saqlashning ikki standart formati. JSON — lug‘at/ro‘yxatlar uchun, CSV — jadval (qatorlar va ustunlar) uchun.

**Hayotiy o‘xshatish — qadoqlash.** Python obyektlaringiz — uydagi mebel. Ularni saqlash yoki jo‘natish uchun standart qutiga (JSON/CSV) qadoqlaysiz. Qabul qiluvchi qutini ochib (o‘qib), mebelni qayta yig‘adi. Format standart bo‘lgani uchun boshqa dasturlar, saytlar va tillar ham tushunadi.

## JSON nima?

JSON (JavaScript Object Notation) — matn ko‘rinishidagi ma’lumot formati. U Python lug‘atiga juda o‘xshaydi:

```json
{
  "ism": "Ali",
  "yosh": 20,
  "tillar": ["python", "sql"],
  "faol": true
}
```

Deyarli barcha internet API’lari ma’lumotni JSON’da yuboradi. Shuning uchun JSON bilan ishlash — muhim ko‘nikma.

## Python obyektini JSON’ga yozish

```python
import json

talaba = {
    "ism": "Ali",
    "yosh": 20,
    "tillar": ["python", "sql"]
}

# Faylga yozish:
with open("talaba.json", "w", encoding="utf-8") as f:
    json.dump(talaba, f, indent=2, ensure_ascii=False)
```

- `json.dump(obyekt, fayl)` — lug‘atni JSON qilib faylga yozadi.
- `indent=2` — chiroyli, o‘qiladigan ko‘rinish (bo‘shliqlar bilan).
- `ensure_ascii=False` — o‘zbekcha harflar buzilmasligi uchun (muhim!).

## JSON’ni o‘qish

```python
import json

with open("talaba.json", encoding="utf-8") as f:
    talaba = json.load(f)         # JSON'dan Python lug'atiga

print(talaba["ism"])              # Ali
print(talaba["tillar"][0])        # python
```

`json.load` faylni o‘qib, uni **Python lug‘atiga** aylantiradi. Endi u bilan oddiy lug‘at kabi ishlaysiz.

## Matn ↔ obyekt (fayl emas)

Ba’zan fayl emas, matn ko‘rinishidagi JSON bilan ishlaysiz (masalan API javobi):

```python
matn = json.dumps(talaba)     # obyekt → JSON matn (s = string)
obyekt = json.loads(matn)     # JSON matn → obyekt
```

Eslab qoling: `dump`/`load` — **fayl** bilan; `dumps`/`loads` — **matn** bilan (`s` = string).

## Ma’lumot mosligi (Python ↔ JSON)

| Python | JSON |
|---|---|
| `dict` | object `{ }` |
| `list` | array `[ ]` |
| `str` | string |
| `int`/`float` | number |
| `True`/`False` | true/false |
| `None` | null |

> [!WARNING]
> Tuple JSON’da **massivga** (list) aylanadi va qaytib list bo‘ladi. `datetime` (sana) va `set` esa to‘g‘ridan-to‘g‘ri JSON’ga yozilmaydi — avval matnga (`str`) aylantiring.

## CSV — jadval fayllar

CSV (Comma-Separated Values) — Excel jadvaliga o‘xshash, vergul bilan ajratilgan ma’lumot:

```
ism,yosh,shahar
Ali,20,Toshkent
Vali,22,Samarqand
```

### CSV o‘qish

```python
import csv

with open("talabalar.csv", encoding="utf-8") as f:
    oquvchi = csv.DictReader(f)     # har qatorni lug'at qilib o'qiydi
    for qator in oquvchi:
        print(qator["ism"], "-", qator["yosh"])
```

`DictReader` har bir qatorni lug‘at qilib beradi (`{"ism": "Ali", "yosh": "20", ...}`) — birinchi qator (sarlavha) kalitlarga aylanadi.

### CSV yozish

```python
import csv

talabalar = [
    {"ism": "Ali", "yosh": 20},
    {"ism": "Vali", "yosh": 22},
]

with open("chiqish.csv", "w", newline="", encoding="utf-8") as f:
    yozuvchi = csv.DictWriter(f, fieldnames=["ism", "yosh"])
    yozuvchi.writeheader()          # sarlavha qatori
    yozuvchi.writerows(talabalar)   # barcha qatorlar
```

`newline=""` — CSV yozishda qo‘shimcha bo‘sh qatorlar chiqmasligi uchun (odat).

## JSON yoki CSV — qaysi biri?

| Ma’lumot | Format |
|---|---|
| Ichma-ich, murakkab (ro‘yxat ichida lug‘at) | **JSON** |
| Oddiy jadval (qatorlar/ustunlar) | **CSV** (Excel ochadi) |
| API bilan almashish | **JSON** (standart) |

## Keng tarqalgan xatolar

1. **`ensure_ascii=False` ni unutish** — o‘zbekcha harflar `\u...` bo‘lib buziladi.
2. **`dump` va `dumps` ni chalkashtirish** — `dump` faylga, `dumps` matnga.
3. **Buzilgan JSON’ni o‘qish** — `json.JSONDecodeError`; `try/except` bilan himoyalaning.
4. **CSV’da hamma qiymat matn** — `yosh` `"20"` bo‘lib keladi; kerak bo‘lsa `int()` qiling.
5. **`newline=""` ni unutish** — CSV’da qo‘sh bo‘sh qatorlar paydo bo‘ladi.

## Xulosa

- JSON — lug‘at/ro‘yxatlar uchun standart matn formati; API’lar shuni ishlatadi.
- `json.dump/load` — fayl bilan; `json.dumps/loads` — matn bilan.
- CSV — jadval ma’lumoti; `csv.DictReader/DictWriter` qulay.
- Doim `encoding="utf-8"` (va JSON’da `ensure_ascii=False`).

## Mashqlar

**Oson**

1. O‘zingiz haqingizda lug‘at yasang va uni `talaba.json` fayliga yozing, so‘ng o‘qib chiqaring.
2. `json.dumps` bilan lug‘atni matnga aylantiring va chop eting.

**O‘rtacha**

3. Bir nechta talaba (lug‘atlar ro‘yxati) ni JSON faylga saqlang va qayta o‘qib, har birini chiqaring.
4. CSV faylni `DictReader` bilan o‘qing va yoshi 21 dan kattalarni ajrating.

**Fikrlash**

5. Qachon JSON, qachon CSV ishlatasiz? Har biriga bittadan real misol keltiring.

**Xatoni top**

6. Nega o‘zbekcha harflar buziladi va qanday tuzatasiz?
```python
import json
with open("t.json", "w") as f:
    json.dump({"shahar": "Toshkent"}, f)
```

**Mini loyiha**

“Kontaktlar kitobi”: foydalanuvchi kontakt (ism, telefon) qo‘shsin — hammasi JSON faylga saqlansin. Dastur qayta ishga tushganda faylni o‘qib, eski kontaktlarni ko‘rsatsin. Izlash imkoniyatini ham qo‘shing. `try/except` bilan fayl yo‘qligini boshqaring.

## Test

<details>
<summary>1. `json.dump` va `json.dumps` farqi?</summary>
<code>dump</code> obyektni faylga yozadi; <code>dumps</code> obyektni JSON matnga aylantiradi (fayl emas).
</details>

<details>
<summary>2. O‘zbekcha harflar uchun JSON’da nima kerak?</summary>
<code>ensure_ascii=False</code> (va <code>encoding="utf-8"</code>).
</details>

<details>
<summary>3. `csv.DictReader` har qatorni nima qilib beradi?</summary>
Lug‘at qilib — sarlavha ustunlari kalit bo‘ladi.
</details>

<details>
<summary>4. JSON’dan o‘qilgan `dict` bilan qanday ishlaysiz?</summary>
Oddiy Python lug‘ati kabi — kalit orqali qiymat olasiz.
</details>

## Keyingi dars

[Virtual muhit va loyihani tashkil qilish](/courses/python-noldan/virtual-muhit-loyiha) — real loyihalarni tartibga solamiz.
