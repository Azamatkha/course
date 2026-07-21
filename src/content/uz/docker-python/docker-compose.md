## Bu darsda nimalarni o‘rganamiz

- Ko‘p konteynerli stekni bitta **`compose.yaml`** da aniqlash.
- `depends_on`, `environment`, `volumes` va `healthcheck` dan foydalanish.
- Kundalik Compose oqimi (`up`, `down`, `logs`, `exec`).
- Compose tarmoq va nomlashni qanday avtomatik sozlashi.

## Oldindan nima bilish kerak

[Volume va Tarmoqlar](/courses/docker-python/volumes-and-networks). Compose o‘sha ishni avtomatlashtiradi.

## Asosiy g‘oya — bir jumlada

> **Docker Compose** butun stekingizni — ilova, baza, kesh, proksi — bitta YAML faylda tasvirlaydi va hammasini bitta buyruq bilan ishga tushiradi, tarmoq va nomlarni avtomatik ulaydi.

**Hayotiy o‘xshatish — sahna guruhi bitta ssenariydan.** Konteynerlarni qo‘lda ishga tushirish — har bir aktyor, chiroq va rekvizitni jonli boshqarish. Compose — butun guruh amal qiladigan yagona ssenariy: “API bu yerga kiradi, baza allaqachon sahnada, ular ulangan, chiroqlar 8000-portda”. Bitta `docker compose up` — butun spektakl to‘g‘ri ishlaydi.

## Haqiqiy Compose fayli

```yaml
# compose.yaml
services:
  api:
    build: .                         # lokal Dockerfile'dan qurish
    ports:
      - "8000:8000"                  # API'ni xostga ochish
    environment:
      DATABASE_URL: postgresql://app:secret@db:5432/app   # 'db' = servis nomi!
    depends_on:
      db:
        condition: service_healthy   # baza tayyor bo'lguncha kutish
    volumes:
      - .:/app                       # jonli dev uchun bind mount

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data    # named volume: ma'lumotni saqlaydi
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5

volumes:
  pgdata:                            # named volume e'lon qilinadi
```

## Compose siz uchun nima qiladi

- `api` ni `db` ga nom orqali (`db:5432`) ulash uchun **umumiy tarmoq** yaratadi — qo‘lda `docker network create` shart emas.
- Konteynerlarni bashoratli nomlaydi (`project-api-1`).
- **Named volume**larni va ularning hayotiy siklini boshqaradi.
- `depends_on` (va `condition: service_healthy`) bilan ishga tushish tartibini boshqaradi.

## Kundalik oqim

```bash
docker compose up -d          # kerak bo'lsa qurib, hammasini fon rejimida ishga tushirish
docker compose ps             # barcha servislar holati
docker compose logs -f api    # bitta servis loglarini kuzatish
docker compose exec api bash  # api servisiga kirish
docker compose down           # konteyner + tarmoqni to'xtatib o'chirish
docker compose down -v        # ...va named volumelarni ham o'chirish (ma'lumotni yo'q qiladi!)
docker compose up --build     # majburiy qayta qurish
```

`up`/`down` — asosiy vositangiz. `down -v` volumelarni o‘chiradi — muhim ma’lumotга hech qachon qilmang.

## `depends_on` va tayyorlik

`depends_on` faqat konteynerning *ishga tushishini* kutadi, ichidagi ilovaning *tayyorligini* emas. Baza jarayoni ishlab tursa-da, Postgres hali ishga tushayotgan bo‘lishi mumkin. Shuning uchun **healthcheck** + `condition: service_healthy` ishlating — API hali tayyor bo‘lmagan bazaga ulanishga urinib qulab tushmasin.

## Sirlar va muhit

```yaml
    env_file:
      - .env                  # o'zgaruvchilarni fayldan yuklash (.gitignore ga qo'shing!)
```

Sirlarni commit qilingan YAML’dan tashqarida saqlang; dev’da `.env`, prod’da haqiqiy sir boshqaruvi. Parollarni hech qachon commit qilmang.

## Keng tarqalgan xatolar

1. **Healthchecksiz `depends_on`** — API baza bilan poyga qilib qulab tushadi.
2. **Odat bo‘yicha `down -v`** — bazangiz volume’ini o‘chiradi.
3. **`compose.yaml` da sirlarni qotirish** — `.env`/sir ishlating va gitignore qiling.
4. **Har servis portini ochish** — faqat chekka (edge) xost portlarini oladi; db/redis ichki qolsin.
5. **Ulash satrida `localhost`** — **servis nomi**ni (`db`) ishlating.

## Xulosa

- Compose butun stekni `compose.yaml` da e’lon qiladi va bitta buyruq bilan ishga tushiradi.
- Tarmoqni (servis-nom DNS), konteyner nomlarini va volumelarni avtomatik yaratadi.
- To‘g‘ri ishga tushish tartibi uchun `depends_on` bilan healthcheck ishlating.
- Sirlarni `.env` da saqlang; faqat chekka portlarni oching; `down -v` dan ehtiyot bo‘ling.

## Mashqlar

**Oson**

1. `api` (lokal qurilgan) va `db` (postgres) bilan Compose fayl yozing va `docker compose up` bilan ishga tushiring.
2. api loglarini kuzating va unga shell bilan kiring.

**O‘rtacha**

3. Postgres uchun named volume qo‘shing va `down` (`-v` siz) va `up` orqali ma’lumot saqlanishini isbotlang.
4. `db` ga healthcheck qo‘shib, `api` ni `service_healthy` gacha kutadigan qiling.

**Advanced**

5. Stekni Redis bilan kengaytiring; api’ni db va redis’ga nom orqali ulang, ularning portlarini ichki qoldiring.

**Xatoni top**

6. api ishga tushishda bazaga “connection refused” bilan qulaydi, garchi db konteyneri ishlayotgan bo‘lsa ham. Diagnoz (tayyorlik poygasi) va healthcheck bilan yechim.

**Mini loyiha**

FastAPI + Postgres + Redis uchun Compose stek quring: baza uchun named volume, healthcheck’lar, sirlar uchun `.env`, faqat API porti ochilgan. `make up`/`make down` yorliqlari va oqimni hujjatlashtiruvchi README qo‘shing.

## Test

<details>
<summary>1. Butun Compose stekni qanday ishga tushirasiz?</summary>
<code>docker compose up -d</code> — kerak bo‘lsa qurib, barcha servislarni fon rejimida ishga tushiradi.
</details>

<details>
<summary>2. Compose’da api db’ga qanday yetadi?</summary>
Avtomatik yaratilgan tarmoqda servis nomi orqali, masalan <code>db:5432</code>.
</details>

<details>
<summary>3. Nega `depends_on` yoniga healthcheck qo‘shiladi?</summary>
<code>depends_on</code> ishga tushishni kutadi, tayyorlikni emas; healthcheck + <code>service_healthy</code> ulanishlar qabul qilinguncha kutadi.
</details>

<details>
<summary>4. `down -v` `down` dan farqli nimani o‘chiradi?</summary>
Named volumelarni — saqlangan ma’lumotni. Ehtiyot bilan ishlating.
</details>

## Keyingi dars

[FastAPI va Django’ni Konteynerlash](/courses/docker-python/dockerizing-fastapi-django).
