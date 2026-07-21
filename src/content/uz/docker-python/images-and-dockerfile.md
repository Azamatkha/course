## Bu darsda nimalarni o‘rganamiz

- Python ilovasi uchun toza **Dockerfile** yozish.
- Har bir muhim ko‘rsatma (`FROM`, `RUN`, `COPY`, `CMD`…).
- **Build keshi**dan to‘g‘ri ko‘rsatma tartibi bilan foydalanish.
- Baza imij tanlash va **.dockerignore**.

## Oldindan nima bilish kerak

[Docker Asoslari](/courses/docker-python/docker-fundamentals). Konteyner ishga tushira olasiz; endi o‘z imijingizni quramiz.

## Asosiy g‘oya — bir jumlada

> **Dockerfile** — retsept: har bir ko‘rsatma keshlanadigan qatlam qo‘shadi va ko‘rsatmalar **tartibi** qayta qurish qanchalik tez bo‘lishini belgilaydi.

**Hayotiy o‘xshatish — retsept kartochkasi.** Dockerfile yuqoridan pastga o‘qiladigan retsept: bazadan boshlang (tayyor tort aralashmasi = `FROM`), masalliq qo‘shing (`RUN pip install`), xamirni quying (`COPY` kodingiz), va xizmat ko‘rsatish ko‘rsatmasini bering (`CMD`). Aqlli oshpaz kabi, sekin va kam o‘zgaradigan qismlarni oldin tayyorlang.

## Birinchi Dockerfile

```dockerfile
FROM python:3.12-slim              # baza imij
WORKDIR /app                       # ish papkasini o'rnatish + yaratish
COPY requirements.txt .            # avval bog'liqliklar manifestini (kesh!)
RUN pip install --no-cache-dir -r requirements.txt
COPY . .                           # qolgan kodni ko'chirish
EXPOSE 8000                        # portni hujjatlashtirish (ma'lumot uchun)
CMD ["python", "app.py"]           # konteyner ishga tushganda standart buyruq
```

Qurish va ishga tushirish:

```bash
docker build -t myapp .            # joriy papkadan 'myapp' teglangan imij
docker run --rm -p 8000:8000 myapp
```

## Muhim ko‘rsatmalar

| Ko‘rsatma | Maqsadi |
|---|---|
| `FROM` | Ustiga quriladigan baza imij |
| `WORKDIR` | Ish papkasini o‘rnatish (va yaratish) |
| `COPY` | Fayllarni ichkariga ko‘chirish |
| `RUN` | **Qurish** vaqtida buyruq bajarish (o‘rnatishlar) — qatlam yaratadi |
| `ENV` | Muhit o‘zgaruvchilarini o‘rnatish |
| `EXPOSE` | Portni hujjatlashtirish (`-p` ochadi, bu emas) |
| `CMD` | **Ishga tushish** vaqtidagi standart buyruq (bittasi; almashtiriladi) |

`RUN` va `CMD` — klassik chalkashlik: **`RUN` imij qurilayotganda; `CMD` konteyner ishga tushganda** bajariladi.

## Build keshi — tezlik uchun tartib

Docker har qatlamni keshlaydi va ko‘rsatma (yoki uning kirishlari) o‘zgarmaguncha qayta ishlatadi; **o‘zgargan qatlamdan keyingi hamma narsa** qayta quriladi. Shuning uchun barqaror narsani oldin, o‘zgaruvchan narsani keyin qo‘ying:

```dockerfile
# YAXSHI — kod o'zgarsa ham bog'liqliklar keshda qoladi
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt   # faqat bog'liqlik o'zgarsa qayta quriladi
COPY . .                                              # kod o'zgarishi bog'liqlikni buzmaydi

# YOMON — har kod o'zgarishi barcha bog'liqlikni qayta o'rnatadi (sekin!)
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
```

Bu bitta tartib fokusi daqiqalik qayta qurishni soniyalarga aylantiradi — eng muhim Dockerfile ko‘nikmasi.

## Baza imij tanlash

| Baza | Hajmi | Izoh |
|---|---|---|
| `python:3.12` | ~1 GB | To‘liq asboblar; kamdan-kam kerak |
| `python:3.12-slim` | ~150 MB | Ko‘pchilik ilovalar uchun **oqilona standart** |
| `python:3.12-alpine` | ~50 MB | Juda kichik, lekin musl libc paketlarni buzishi/sekinlashtirishi mumkin |

**Slim** dan boshlang. Alpine hajm uchun jozibali, lekin uning boshqa C kutubxonasi (`musl`) ko‘pincha paketlarni manbadan sekin qurishga majbur qiladi.

## .dockerignore

Keraksiz narsalarni qurish kontekstidan (va imijdan) chetda tuting: bu qurishni tezlashtiradi va sirlarni sizib chiqishdan saqlaydi.

```gitignore
__pycache__/
*.pyc
.git
.env
venv/
```

Busiz `COPY . .` sizning `.git`, virtual muhit va ehtimol sirlar to‘la `.env` faylni imijga tortadi. Doim qo‘shing.

## Keng tarqalgan xatolar

1. **Bog‘liqliklardan oldin `COPY . .`** — har kod o‘zgarishida keshni buzadi.
2. **`.dockerignore` yo‘qligi** — shishgan kontekst, sizib chiqqan `.env`, sekin qurish.
3. **Refleks bilan alpine** — musl wheel’siz paketlar uchun buzuq/sekin qurish.
4. **`--no-cache-dir` siz `pip install`** — imijda ortiqcha megabaytlar.
5. **Ko‘p `CMD`** — faqat oxirgisi ishlaydi; chalkashlik.

## Xulosa

- Dockerfile — qatlamli ko‘rsatmalar; `FROM`, `WORKDIR`, `COPY`, `RUN`, `CMD` — asosiy.
- Kesh uchun tartib: barqaror bog‘liqliklar oldin, o‘zgaruvchan kod keyin.
- `python:3.12-slim` ni afzal ko‘ring; alpine’ning musl ajablanmalaridan ehtiyot bo‘ling.
- Doim `.dockerignore` qo‘shing.

## Mashqlar

**Oson**

1. Bir faylли Python skript uchun Dockerfile yozing va qurib ishga tushiring.
2. `__pycache__`, `.git`, `.env` ni chetlaydigan `.dockerignore` qo‘shing va tezroq kontekstni kuzating.

**O‘rtacha**

3. “Yomon” Dockerfile’ni (kod bog‘liqliklardan oldin) kesh-do‘st tartibga o‘zgartiring; kod o‘zgarishidan keyin ikkala qayta qurishni o‘lchang.
4. `ENV` va `EXPOSE` qo‘shing va `CMD` ni exec shakliga o‘tkazing; farqini tushuntiring.

**Advanced**

5. Xuddi shu ilova uchun `python:3.12`, `-slim` va `-alpine` da imij hajmlarini solishtiring.

**Xatoni top**

6. Hamkasbingizning qayta qurishlari sekin: har kod o‘zgarishi barcha bog‘liqlikni qayta o‘rnatadi. Uning Dockerfile’si `COPY . .` keyin `RUN pip install` qiladi. Diagnoz va yechim.

**Mini loyiha**

Kichik Flask/FastAPI ilovasini konteynerlang: kesh-do‘st Dockerfile, slim baza, `.dockerignore`, `EXPOSE` va to‘g‘ri `CMD`. Bir qatorli kod o‘zgarishi keshlash tufayli soniyalarda qayta qurilishini tasdiqlang.

## Test

<details>
<summary>1. Qaysi ko‘rsatma qurishda emas, konteyner ishga tushganda ishlaydi?</summary>
<code>CMD</code> (va/yoki <code>ENTRYPOINT</code>) — <code>RUN</code> qurish vaqtida ishlaydi.
</details>

<details>
<summary>2. Nega kodni bog‘liqliklardan keyin ko‘chiriladi?</summary>
Bog‘liqlik o‘rnatish qatlamini kod o‘zgarishlari orasida keshda saqlash uchun — qayta qurish tez bo‘ladi.
</details>

<details>
<summary>3. Python ilovalari uchun oqilona standart baza?</summary>
<code>python:3.12-slim</code> — kichik, lekin glibc asosli, alpine’ning musl muammolaridan xoli.
</details>

<details>
<summary>4. `.dockerignore` ga nima kiradi?</summary>
Qurish keraksizi va sirlar: <code>__pycache__</code>, <code>.git</code>, <code>.env</code>, virtual muhitlar.
</details>

## Keyingi dars

[Volume va Tarmoqlar](/courses/docker-python/volumes-and-networks) — ma’lumotni saqlash va konteynerlarni ulash.
