## Bu darsda nimalarni o‘rganamiz

- Virtual muhit (venv) nima va nega kerak.
- Muhit yaratish, faollashtirish va paket o‘rnatish.
- `requirements.txt` bilan bog‘liqliklarni saqlash.
- Real loyihani fayllarga bo‘lib tashkil qilish.

## Oldindan nima bilish kerak

[Modullar va kutubxonalar](/courses/python-noldan/modullar-kutubxonalar) — `pip` bilan tanish bo‘lishingiz kerak.

## Asosiy g‘oya — bir jumlada

> **Virtual muhit** — har bir loyiha uchun alohida, mustaqil “kutubxonalar quti”. Shunda bir loyihaning paketlari boshqasiga xalaqit bermaydi.

**Hayotiy o‘xshatish — alohida oshxonalar.** Ikki oshpaz bir oshxonada ishlasa, biri tuzni almashtirsa, ikkinchisining taomi buziladi. Har biriga alohida oshxona (virtual muhit) bersangiz — hech kim bir-biriga xalaqit bermaydi. Loyihalar ham shunday: har biriga o‘z muhiti.

## Muammo: paketlar to‘qnashuvi

Tasavvur qiling, A loyiha `requests` ning eski versiyasini, B loyiha yangi versiyasini talab qiladi. Agar hammasini bitta joyga o‘rnatsangiz — ular to‘qnashadi. Virtual muhit har bir loyihaga o‘z paketlarini beradi.

## Virtual muhit yaratish

Loyiha papkasida terminal ochib:

```bash
# 1. Muhit yaratish (bir marta)
python -m venv venv

# 2. Faollashtirish
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

Faollashgach, terminal boshida `(venv)` ko‘rinadi — demak siz muhit ichidasiz. Endi o‘rnatilgan paketlar **faqat shu loyihaga** tegishli:

```bash
pip install requests
```

Muhitdan chiqish:

```bash
deactivate
```

> [!IMPORTANT]
> `venv` papkasini **git’ga qo‘shmang** (u katta va har kimda boshqacha). Uni `.gitignore` ga yozing. Buning o‘rniga `requirements.txt` ni saqlaysiz (pastda).

## `requirements.txt` — bog‘liqliklar ro‘yxati

Loyihangiz qaysi paketlarga bog‘liqligini bir faylda saqlaysiz:

```bash
# Hozirgi paketlarni faylga yozish:
pip freeze > requirements.txt
```

`requirements.txt` shunday ko‘rinadi:

```
requests==2.31.0
pandas==2.1.0
```

Boshqa odam (yoki server) loyihani olganda, bitta buyruq bilan hamma paketni o‘rnatadi:

```bash
pip install -r requirements.txt
```

Bu — loyihani boshqa joyda **aynan bir xil** ishlatishning kaliti.

## Loyihani fayllarga bo‘lish

Kichik dastur bitta faylda bo‘lishi mumkin. Lekin loyiha o‘sganda, uni mantiqiy bo‘laklarga bo‘lasiz:

```
mening_loyiham/
├── venv/                  (git'ga qo'shilmaydi)
├── main.py                (asosiy ishga tushirish nuqtasi)
├── hisoblar.py            (hisob-kitob funksiyalari)
├── fayllar.py             (fayl bilan ishlash)
├── requirements.txt       (bog'liqliklar)
└── README.md              (loyiha haqida)
```

Har bir fayl — bir “mas’uliyat”. Masalan:

```python
# fayl: hisoblar.py
def qoshish(a, b):
    return a + b
```

```python
# fayl: main.py
from hisoblar import qoshish     # boshqa fayldan import
print(qoshish(3, 5))             # 8
```

Bu — kodni tartibli, o‘qiladigan va kengaytiriladigan qiladi.

## `.gitignore` — nimani saqlamaslik

Git bilan ishlaganda (versiya nazorati), ba’zi narsalarni saqlamaysiz:

```
venv/
__pycache__/
*.pyc
.env
```

- `venv/` — har kimda boshqacha, `requirements.txt` yetarli.
- `__pycache__/` — Python avtomatik yaratadigan vaqtinchalik fayllar.
- `.env` — maxfiy kalitlar (parollar, API kalitlar) — hech qachon git’ga qo‘shilmaydi!

## Keng tarqalgan xatolar

1. **Muhitni faollashtirishni unutish** — paket global o‘rnatiladi, loyihaga tegishli bo‘lmaydi.
2. **`venv` ni git’ga qo‘shish** — katta va keraksiz; `requirements.txt` saqlang.
3. **`requirements.txt` ni yangilamaslik** — yangi paket o‘rnatgach `pip freeze` ni qayta ishlating.
4. **Maxfiy kalitlarni kodda yozish** — `.env` ishlating va uni `.gitignore` ga qo‘shing.
5. **Hamma narsani bitta faylga tiqish** — loyiha o‘sganda mantiqiy bo‘laklarga bo‘ling.

## Xulosa

- Virtual muhit (`python -m venv venv`) har loyihaga alohida paketlar beradi — to‘qnashuvlarni oldini oladi.
- Faollashtiring (`activate`), paketlarni o‘rnating, chiqing (`deactivate`).
- `requirements.txt` bog‘liqliklarni saqlaydi; `pip install -r` bilan tiklanadi.
- Loyihani mantiqiy fayllarga bo‘ling; `venv` va sirlarni git’ga qo‘shmang.

## Mashqlar

**Oson**

1. Yangi papka yarating, unda virtual muhit yasang va faollashtiring.
2. Muhit ichida `requests` ni o‘rnating va `pip freeze` bilan `requirements.txt` yasang.

**O‘rtacha**

3. Loyihani ikki faylga bo‘ling: `hisoblar.py` (funksiyalar) va `main.py` (ularni import qilib ishlatadi).
4. `.gitignore` fayl yozib, `venv/`, `__pycache__/` va `.env` ni unga qo‘shing.

**Fikrlash**

5. Nega har bir loyihaga alohida muhit kerak? To‘qnashuvga real misol keltiring.

**Xatoni top**

6. Bir hamkasbingiz loyihani oldi, lekin “ModuleNotFoundError: requests” chiqyapti. Sabab nima va uni qanday hal qiladi? (Maslahat: `requirements.txt`.)

**Mini loyiha**

Kichik loyihani to‘g‘ri tuzilma bilan yasang: virtual muhit, `main.py` + kamida bitta yordamchi modul, `requirements.txt` va `.gitignore`. Loyiha biror tashqi paketni (masalan `requests`) ishlatib, oddiy natija chiqarsin. README’ga ishga tushirish yo‘riqnomasini yozing.

## Test

<details>
<summary>1. Virtual muhit nima uchun kerak?</summary>
Har bir loyihaga alohida, mustaqil paketlar to‘plami berib, versiya to‘qnashuvlarining oldini olish uchun.
</details>

<details>
<summary>2. `requirements.txt` nima?</summary>
Loyiha bog‘liqliklari (paketlar va versiyalari) ro‘yxati; <code>pip install -r</code> bilan tiklanadi.
</details>

<details>
<summary>3. `venv` papkasini git’ga qo‘shish kerakmi?</summary>
Yo‘q — uni <code>.gitignore</code> ga qo‘shing; <code>requirements.txt</code> yetarli.
</details>

<details>
<summary>4. Maxfiy API kalitlar qayerda saqlanadi?</summary>
<code>.env</code> faylida — u <code>.gitignore</code> ga qo‘shiladi, kodga yozilmaydi.
</details>

## Keyingi dars

[Internetdan ma’lumot olish (API va requests)](/courses/python-noldan/api-va-requests) — dasturimizni tashqi dunyoga ulaymiz.
