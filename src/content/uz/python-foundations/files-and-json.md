## Bu darsda nimalarni o‘rganamiz

- `pathlib` va `with` bilan fayllarni xavfsiz o‘qish/yozish.
- **Matn kodlashlari**ni to‘g‘ri boshqarish (va nega UTF-8 javob).
- **`json`** moduli bilan serializatsiya/deserializatsiya.
- Katta fayllarni xotiraga yuklamasdan oqim qilish.

## Oldindan nima bilish kerak

[Kontekst menejerlar](/courses/python-foundations/context-managers) va [Xatoliklarni boshqarish](/courses/python-foundations/error-handling).

## Asosiy g‘oya — bir jumlada

> Fayllar — **baytlar** oqimi; matn rejimi baytlarni `str` ga aylantirish uchun **kodlash** qo‘shadi. JSON — strukturaviy ma’lumot almashish uchun universal matn formati.

**Hayotiy o‘xshatish — yuk jo‘natish.** Python obyektlaringiz — xonadagi mebel. Jo‘natish uchun standart qutiga (JSON’ga serializatsiya) yig‘asiz, qabulda ochasiz (deserializatsiya). Kodlash — jo‘natish yorlig‘idagi til — jo‘natuvchi UTF-8 da yozsa, qabul qiluvchi boshqacha o‘qisa, yorliq axlatga aylanadi (mojibake).

## pathlib bilan o‘qish va yozish

```python
from pathlib import Path

p = Path("data") / "notes.txt"     # OS-to'g'ri yo'l birlashtirish
p.parent.mkdir(parents=True, exist_ok=True)

p.write_text("salom\n", encoding="utf-8")     # oddiy butun-fayl yozish
content = p.read_text(encoding="utf-8")        # oddiy butun-fayl o'qish
```

Oqim yoki qo‘shish uchun `with` bilan `open`:

```python
with open(p, "a", encoding="utf-8") as f:      # 'a' = qo'shish
    f.write("yana qator\n")

with open(p, encoding="utf-8") as f:
    for line in f:                              # qatorlarni dangasa aylanish — tekis xotira
        process(line.rstrip("\n"))
```

## Fayl rejimlari

| Rejim | Ma’nosi |
|---|---|
| `"r"` | O‘qish (standart), fayl mavjud bo‘lishi kerak |
| `"w"` | Yozish, **eski matnни o‘chiradi** |
| `"a"` | Oxiriga qo‘shish |
| `"x"` | Yaratish, mavjud bo‘lsa xato |
| `"b"` | Binar (baytlar, kodlashsiz) — masalan `"rb"` |

> [!WARNING]
> `"w"` ochilishда faylni darrov o‘chiradi. Qo‘shish uchun `"a"`, ustiga yozib yubormaslik uchun `"x"`. Matn uchun doim `encoding="utf-8"` bering — OS standarti farq qiladi va “mening mashinamda ishlaydi” xatosini beradi.

## Kodlashlar, qisqacha

- Matn fayllari **baytlar** saqlaydi; kodlash belgilarni ↔ baytlarga moslashtiradi.
- **UTF-8** har Unicode belgisини kodlaydi va veb/interop standarti — uni aniq standartingiz qiling.
- Noto‘g‘ri kodlash bilan o‘qish `UnicodeDecodeError` yoki axlat beradi. Shubhada `encoding="utf-8"` ni ko‘rsating.

## JSON

```python
import json

data = {"name": "Ada", "langs": ["python", "sql"], "active": True}

text = json.dumps(data, indent=2, ensure_ascii=False)   # obyekt → JSON matn
back = json.loads(text)                                   # JSON matn → obyekt

with open("out.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)      # faylga yozish
with open("out.json", encoding="utf-8") as f:
    obj = json.load(f)                                     # fayldan o'qish
```

Tur moslashuvi (Python ↔ JSON): `dict`↔object, `list`/`tuple`↔array, `str`↔string, `int`/`float`↔number, `True/False`↔true/false, `None`↔null.

Eslatma: tuple’lar array’ga aylanadi (ro‘yxat qaytadi), lug‘at kalitlari matn bo‘ladi. JSON-bo‘lmagan turlar (`datetime`, `set`) maxsus enkoder talab qiladi:

```python
from datetime import datetime
def default(o):
    if isinstance(o, datetime):
        return o.isoformat()
    raise TypeError(type(o))
json.dumps({"when": datetime.now()}, default=default)
```

## Katta ma’lumotni oqim qilish

5 GB faylni `json.load` qilmang. Katta qatorli JSON (JSONL) uchun qatorma-qator:

```python
with open("events.jsonl", encoding="utf-8") as f:
    for line in f:                     # bir yozuv bir vaqtda
        event = json.loads(line)
        handle(event)                  # hajmdan qat'i nazar tekis xotira
```

## Keng tarqalgan xatolar

1. **`encoding="utf-8"` ni unutish** — platformaga bog‘liq xatolar.
2. **`"a"` o‘rniga `"w"`** — faylni jimgina o‘chiradi.
3. **`with`siz ishlash** — oqib ketgan fayl handle’lari.
4. **Ulkan faylni `json.load` qilish** — xotira portlashi; JSONL oqim qiling.
5. **Tuple/set JSON’dan o‘tadi deb o‘ylash** — o‘tmaydi; ro‘yxat / `TypeError`.

## Xulosa

- Yo‘llar uchun `pathlib`, kafolatlangan yopish uchun `with`.
- Matn uchun doim `encoding="utf-8"`; fayl rejimlarini biling.
- `json.dump/load` ma’lumotni ma’lum tur moslashuvi bilan aylantiradi; maxsus turlar enkoder talab qiladi.
- Xotirani tekis saqlash uchun katta fayllarni qatorma-qator oqim qiling.

## Mashqlar

**Oson**

1. Lug‘atni `config.json` ga yozing va qayta o‘qing; tenglikni tasdiqlang.
2. `"a"` rejimi va UTF-8 bilan log fayliga uch qator qo‘shing, keyin o‘qing.

**O‘rtacha**

3. JSON’ni xavfsiz yuklaydigan (fayl yo‘q/buzuq bo‘lsa standart qaytaradigan) funksiya yozing.
4. `datetime` bo‘lgan obyektni maxsus `default` enkoder bilan serializatsiya qiling va qayta o‘qing.

**Advanced**

5. 1M qatorli JSONL faylni tekis xotirada kategoriya bo‘yicha sanoq uchun qayta ishlang; vaqtini o‘lchang.

**Xatoni top**

6. Hamkasbingiz skripti har ishga tushirishda ma’lumot faylini o‘chiradi. Ular yuqorida `open(path, "w")` ishlatadi. Tushuntiring va tuzating.

**Mini loyiha**

Kichik JSON-asosli kalit-qiymat do‘koni `store.py` quring: `get`, `set`, `delete`, atomik yozish (vaqtinchalik faylga yozib keyin qayta nomlash) va hamma joyda UTF-8. Buzuq-fayl tiklash yo‘lini test qiling.

## Test

<details>
<summary>1. `open(path, "w")` mavjud kontentга nima qiladi?</summary>
O‘chiradi — fayl ochilishda bo‘shatiladi. Qo‘shish uchun `"a"`.
</details>

<details>
<summary>2. Nega `encoding="utf-8"` ni aniq berish kerak?</summary>
Platforma standarti farq qiladi; aniq UTF-8 kross-platforma dekodlash/buzilish xatolaridan qochadi.
</details>

<details>
<summary>3. JSON orqali tuple’ga nima bo‘ladi?</summary>
Array sifatida serializatsiyalanadi va ro‘yxat bo‘lib qaytadi — tuple saqlanmaydi.
</details>

<details>
<summary>4. Ulkan faylni o‘qishда xotirani qanday tekis saqlaysiz?</summary>
Faylni qatorma-qator aylaning, hammasini birdan yuklamang.
</details>

## Keyingi dars

[Dataclass, Enum va Typing](/courses/python-foundations/dataclasses-enums-typing).
