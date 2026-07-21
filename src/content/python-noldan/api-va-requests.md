## Bu darsda nimalarni o‘rganamiz

- API nima va nega kerak.
- `requests` kutubxonasi bilan internetdan ma’lumot olish.
- JSON javobni o‘qish va ishlatish.
- Xatolar va status kodlarni boshqarish.

## Oldindan nima bilish kerak

[Modullar](/courses/python-noldan/modullar-kutubxonalar), [JSON](/courses/python-noldan/json-csv-fayllar) va [Xatoliklar](/courses/python-noldan/xatoliklar-va-fayllar).

## Asosiy g‘oya — bir jumlada

> **API** — bir dastur boshqasidan ma’lumot **so‘rab olish** yo‘li. Python’dan `requests` bilan API’ga so‘rov yuborasiz va javob (odatda JSON) olasiz.

**Hayotiy o‘xshatish — restoran ofitsianti.** Siz oshxonaga to‘g‘ridan-to‘g‘ri kirmaysiz — ofitsantga buyurtma berasiz, u oshxonadan taomni olib keladi. **API — o‘sha ofitsiant**: siz “ob-havoni ber” deb so‘raysiz, API serverdan ma’lumotni olib, sizga qaytaradi. Siz server ichida nima bo‘layotganini bilishingiz shart emas.

## API nima?

Ko‘p saytlar o‘z ma’lumotini API orqali beradi: ob-havo, valyuta kursi, xaritalar, ChatGPT... Siz maxsus manzilga (URL) so‘rov yuborasiz, ular ma’lumotni JSON’da qaytaradi.

```mermaid
flowchart LR
    P["Sizning dasturingiz"] -->|so'rov (URL)| A["API server"]
    A -->|javob (JSON)| P
```

## `requests` bilan birinchi so‘rov

Avval o‘rnatamiz (terminalda):

```bash
pip install requests
```

So‘ng ma’lumot olamiz:

```python
import requests

javob = requests.get("https://api.github.com")
print(javob.status_code)     # 200 — muvaffaqiyat
print(javob.json())          # JSON javobni Python lug'atiga aylantiradi
```

- `requests.get(URL)` — ma’lumot **olish** so‘rovi (GET).
- `.status_code` — natija kodi (200 = OK).
- `.json()` — javobni Python lug‘atiga aylantiradi (o‘zingiz `json.loads` qilishingiz shart emas).

## Status kodlar — javob nimani anglatadi

| Kod | Ma’nosi |
|---|---|
| **200** | OK — hammasi joyida |
| **404** | Topilmadi (noto‘g‘ri URL) |
| **401 / 403** | Ruxsat yo‘q (kalit kerak yoki noto‘g‘ri) |
| **500** | Server xatosi (ularning muammosi) |

Doim `status_code` ni tekshirish yaxshi odat:

```python
javob = requests.get("https://api.github.com/users/torvalds")
if javob.status_code == 200:
    data = javob.json()
    print(data["name"])          # Linus Torvalds
else:
    print("Xato:", javob.status_code)
```

## Amaliy misol — foydalanuvchi ma’lumoti

```python
import requests

nom = input("GitHub foydalanuvchi nomi: ")
javob = requests.get(f"https://api.github.com/users/{nom}")

if javob.status_code == 200:
    data = javob.json()
    print(f"Ism: {data.get('name')}")
    print(f"Repolar: {data.get('public_repos')}")
else:
    print("Foydalanuvchi topilmadi")
```

`data.get('name')` — kalit yo‘q bo‘lsa xato bermaydi (`None` qaytaradi) — API javoblarida xavfsiz usul.

## So‘rovga parametr qo‘shish

Ko‘p API’lar qo‘shimcha ma’lumot (parametr) so‘raydi:

```python
javob = requests.get(
    "https://api.example.com/search",
    params={"q": "python", "limit": 5}
)
# URL avtomatik: .../search?q=python&limit=5 bo'ladi
```

## API kalitlari (API keys)

Ko‘p API sizni tanishi uchun **kalit** talab qiladi (parolga o‘xshash):

```python
import requests

kalit = "SIZNING_KALITINGIZ"     # aslida .env dan olinadi!
javob = requests.get(
    "https://api.example.com/data",
    headers={"Authorization": f"Bearer {kalit}"}
)
```

> [!WARNING]
> API kalitni **hech qachon** kodga to‘g‘ridan-to‘g‘ri yozmang va git’ga qo‘ymang! Uni `.env` faylida saqlang (virtual muhit darsida ko‘rdik). Kalit sizib chiqsa, boshqalar sizning nomingizdan (va hisobingizdan) foydalanadi.

## Xatolarni boshqarish

Internet ishonchsiz — server javob bermasligi mumkin. Doim himoyalang:

```python
import requests

try:
    javob = requests.get("https://api.github.com", timeout=5)
    javob.raise_for_status()      # 4xx/5xx bo'lsa xato ko'taradi
    print(javob.json())
except requests.exceptions.RequestException as e:
    print("So'rov muvaffaqiyatsiz:", e)
```

- `timeout=5` — 5 soniyada javob kelmasa, kutmaydi (osilib qolmaslik uchun).
- `raise_for_status()` — yomon javobda (404, 500) xato ko‘taradi.

## Keng tarqalgan xatolar

1. **Status kodni tekshirmaslik** — 404/500 bo‘lsa `.json()` xato beradi.
2. **API kalitni kodga yozish** — xavfsizlik xatosi; `.env` ishlating.
3. **`timeout` ni unutish** — server javob bermasa, dastur osilib qoladi.
4. **`.json()` ni matn deb o‘ylash** — u Python lug‘ati/ro‘yxati qaytaradi.
5. **Internetга ishonch** — tarmoq xatolarini `try/except` bilan ushlang.

## Xulosa

- API — dasturlar o‘rtasida ma’lumot almashish yo‘li; `requests` bilan chaqiriladi.
- `requests.get(URL)` → `.status_code` (tekshiring!) va `.json()` (Python obyekti).
- Status kodlar javob holatini bildiradi (200 OK, 404, 500...).
- Kalitlarni `.env` da saqlang; `timeout` va `try/except` bilan himoyalaning.

## Mashqlar

**Oson**

1. `https://api.github.com` ga so‘rov yuborib, `status_code` ni chiqaring.
2. `https://api.github.com/users/octocat` dan foydalanuvchi ismini oling.

**O‘rtacha**

3. Foydalanuvchidan GitHub nomini so‘rab, uning repolar sonini chiqaring; foydalanuvchi topilmasa xushmuomala xabar bering.
4. Bepul ochiq API tanlang (masalan tasodifiy hazil yoki iqtibos) va undagi bitta maydonni chiqaring.

**Fikrlash**

5. Nega API kalitni kodga yozish xavfli? Real oqibatini tushuntiring.

**Xatoni top**

6. Nega bu dastur ba’zan qulab tushadi va qanday mustahkamlaysiz?
```python
import requests
data = requests.get("https://api.github.com/users/xatolik_nom").json()
print(data["name"])
```

**Mini loyiha**

“Ob-havo ilovasi” (bepul ob-havo API bilan): foydalanuvchidan shahar so‘rang, API’dan harorat va ob-havoni oling va chiroyli chiqaring. Kalitni `.env` dan oling, `timeout` va `try/except` bilan xatolarni boshqaring, noto‘g‘ri shahar uchun xabar bering.

## Test

<details>
<summary>1. API nima?</summary>
Bir dastur boshqasidan ma’lumot so‘rab oladigan interfeys/yo‘l — "raqamli ofitsiant".
</details>

<details>
<summary>2. `requests.get(...).json()` nima qaytaradi?</summary>
JSON javobni Python obyektiga (odatda lug‘at/ro‘yxat) aylantirib qaytaradi.
</details>

<details>
<summary>3. Status kod 200 nimani anglatadi?</summary>
So‘rov muvaffaqiyatli bajarildi (OK).
</details>

<details>
<summary>4. API kalitni qayerda saqlash kerak?</summary>
<code>.env</code> faylida — kodga yozilmaydi va git’ga qo‘shilmaydi.
</details>

## Keyingi dars

[Xatolarni topish (debugging) va toza kod](/courses/python-noldan/debugging-toza-kod) — kodni mustahkam va o‘qiladigan qilamiz.
