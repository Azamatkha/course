## Bu darsda nimalarni o‘rganamiz

- Modul va kutubxona nima.
- `import` bilan tayyor koddan foydalanish.
- Foydali standart modullar: `random`, `math`, `datetime`.
- `pip` bilan tashqi kutubxona o‘rnatish.

## Oldindan nima bilish kerak

[Funksiyalar](/courses/python-noldan/funksiyalar).

## Asosiy g‘oya — bir jumlada

> **Modul/kutubxona** — boshqalar yozib qo‘ygan tayyor kod. `import` bilan uni olib, o‘zingiz yozmasdan ishlatasiz.

**Hayotiy o‘xshatish — asboblar do‘koni.** Mix kerak bo‘lsa, o‘zingiz temir eritib yasamaysiz — do‘kondan tayyorini olasiz. Dasturlashda ham: tasodifiy son, sana, matematik hisob kerak bo‘lsa — o‘zingiz noldan yozmaysiz, tayyor **kutubxona**ni `import` qilasiz. “G‘ildirakni qayta ixtiro qilmang.”

## `import` — modulni olib kelish

Python bilan birga **standart kutubxona** keladi — ko‘plab tayyor modullar. Ularni `import` bilan olasiz:

```python
import random

son = random.randint(1, 6)      # 1 dan 6 gacha tasodifiy son (zar)
print(son)
```

- `import random` — “random modulini olib kel”.
- `random.randint(...)` — modul nomi, nuqta, funksiya nomi.

## Import qilishning uch usuli

```python
# 1) Butun modulni
import math
print(math.sqrt(16))        # 4.0

# 2) Modul nomiga qisqa nom (alias)
import random as r
print(r.randint(1, 10))

# 3) Modulning faqat kerakli qismini
from math import sqrt, pi
print(sqrt(25))             # 5.0  (math. yozish shart emas)
print(pi)                   # 3.14159...
```

Birinchi usul (`import math`) eng tushunarli — funksiya qayerdan kelganini ko‘rsatib turadi.

## Foydali standart modullar

### `random` — tasodifiy qiymatlar

```python
import random
print(random.randint(1, 100))          # 1..100 orasida son
print(random.choice(["ha", "yo'q"]))   # ro'yxatdan tasodifiy tanlash
mevalar = ["olma", "banan", "uzum"]
random.shuffle(mevalar)                # ro'yxatni aralashtiradi
```

### `math` — matematika

```python
import math
print(math.sqrt(144))    # 12.0  (kvadrat ildiz)
print(math.ceil(4.1))    # 5     (yuqoriga yaxlitlash)
print(math.floor(4.9))   # 4     (pastga yaxlitlash)
print(math.pi)           # 3.14159...
```

### `datetime` — sana va vaqt

```python
from datetime import datetime
hozir = datetime.now()
print(hozir)                        # 2024-01-15 14:30:00
print(hozir.year, hozir.month)      # 2024 1
print(hozir.strftime("%d-%m-%Y"))   # 15-01-2024 (formatlash)
```

## `pip` — tashqi kutubxona o‘rnatish

Standart kutubxonada yo‘q narsalar uchun **tashqi kutubxona**larni `pip` bilan o‘rnatasiz. Terminalda (kod ichida emas):

```bash
pip install requests
```

Keyin kodda ishlatasiz:

```python
import requests
javob = requests.get("https://api.github.com")
print(javob.status_code)      # 200
```

`requests` — internetdan ma’lumot olish uchun mashhur kutubxona. `pip` bilan minglab kutubxona bor: `pandas` (ma’lumot tahlili), `numpy` (matematika), `django`/`fastapi` (veb) va h.k.

> [!NOTE]
> `pip install` — bu **terminal** buyrug‘i, Python kodi emas. Uni `.py` fayl ichiga yozmang. Kutubxona bir marta o‘rnatiladi, keyin kodda `import` qilasiz.

## O‘z modulingizni yaratish

Har bir `.py` fayl — bu modul! Boshqa fayldan uni import qilishingiz mumkin:

```python
# fayl: yordamchi.py
def salomlash(ism):
    return f"Salom, {ism}!"
```

```python
# fayl: main.py
import yordamchi
print(yordamchi.salomlash("Ali"))    # Salom, Ali!
```

Shunday qilib katta dasturni bir necha faylga bo‘lasiz — har biri o‘z ishini qiladi.

## Keng tarqalgan xatolar

1. **`pip install` ni kod ichiga yozish** — u terminal buyrug‘i.
2. **O‘rnatmasdan `import` qilish** — `ModuleNotFoundError`; avval `pip install` qiling.
3. **Modul nomini fayl nomi bilan chalkashtirish** — faylni `random.py` deb nomlamang, `import random` buziladi.
4. **`math.` prefiksini unutish** — `import math` qilsangiz, `sqrt(16)` emas, `math.sqrt(16)` yozing.
5. **Katta-kichik harf** — `import Random` xato; to‘g‘risi `import random`.

## Xulosa

- Modul/kutubxona — tayyor kod; `import` bilan olasiz.
- Standart kutubxonada `random`, `math`, `datetime` kabi foydali modullar bor.
- Tashqi kutubxonalar `pip install` bilan (terminalda) o‘rnatiladi.
- Har bir `.py` fayl modul — o‘z kodingizni ham import qilasiz.

## Mashqlar

**Oson**

1. `random` bilan 1–6 orasida “zar” tashlaydigan dastur yozing.
2. `math` bilan foydalanuvchi bergan sonning kvadrat ildizini chiqaring.

**O‘rtacha**

3. Ro‘yxatdan `random.choice` bilan tasodifiy “bugungi maslahat” chiqaring.
4. `datetime` bilan foydalanuvchining tug‘ilgan yilini so‘rab, hozirgi yoshini hisoblang.

**Fikrlash**

5. Nega tayyor kutubxonadan foydalanish o‘zi yozishdan afzal? Qachon o‘zingiz yozgan ma’qul?

**Xatoni top**

6. Nega `ModuleNotFoundError` chiqishi mumkin va qanday tuzatasiz?
```python
import requests
```

**Mini loyiha**

“Tosh-qaychi-qog‘oz” o‘yini: kompyuter `random.choice` bilan tanlaydi, foydalanuvchi tanlaydi, g‘olibni aniqlaysiz. `while` bilan qayta-qayta o‘ynash va hisobni yuritishni qo‘shing.

## Test

<details>
<summary>1. `import` nima uchun?</summary>
Boshqalar (yoki o‘zingiz) yozgan tayyor kodni (modul/kutubxona) o‘z dasturingizga olib kelish uchun.
</details>

<details>
<summary>2. `pip install` qayerda ishlatiladi?</summary>
Terminalda (kod ichida emas) — tashqi kutubxonani o‘rnatish uchun.
</details>

<details>
<summary>3. `random.randint(1, 6)` nima qaytaradi?</summary>
1 dan 6 gacha (ikkalasi ham kiradi) tasodifiy butun son.
</details>

<details>
<summary>4. Har bir `.py` fayl nima?</summary>
Bir modul — uni boshqa fayldan <code>import</code> qilish mumkin.
</details>

## Keyingi dars

[Xatoliklar va fayllar bilan ishlash](/courses/python-noldan/xatoliklar-va-fayllar) — xatolardan qo‘rqmaslikni va ma’lumotni saqlashni o‘rganamiz.
