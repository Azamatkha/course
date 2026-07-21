## Bu darsda nimalarni o‘rganamiz

- **FastAPI** va **Django** uchun ishlab chiqarishga mos imijlar yozish.
- **Uvicorn/Gunicorn** worker’larini tanlash va sozlash.
- **Migratsiyalar**, **static fayllar** va entrypoint skript bilan ishga tushirishni boshqarish.
- Konteynerdagi WSGI va ASGI farqi.

## Oldindan nima bilish kerak

[Docker Compose](/courses/docker-python/docker-compose) va FastAPI/Django asoslari.

## Asosiy g‘oya — bir jumlada

> Veb freymvorkni konteynerlash = kesh-do‘st imij + to‘g‘ri server jarayoni + trafik kelishidan oldin migratsiyalarni bajaradigan ishga tushirish skripti.

**Hayotiy o‘xshatish — har kuni restoranni ochish.** Imij — to‘liq jihozlangan oshxona. Lekin mijozlarga xizmat qilishdan oldin ochilish ro‘yxatini bajarasiz: eshikni ochish (bazani yangilash — migratsiyalar), stollarni tayyorlash (static fayllar) va shundan keyingina “ochiq” belgisini qo‘yasiz (serverni ishga tushirish). **Entrypoint skript** — o‘sha ochilish ro‘yxati.

## FastAPI (ASGI)

FastAPI — **ASGI** (async). Uni Uvicorn bilan, ko‘p worker uchun Gunicorn boshqaruvida ishlating.

```dockerfile
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONUNBUFFERED=1              # loglar darrov oqadi, buferlanmaydi
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "app.main:app", "-k", "uvicorn.workers.UvicornWorker",
     "-w", "4", "-b", "0.0.0.0:8000"]
```

Muhim jihatlar:
- **`0.0.0.0` ga bog‘lang**, `127.0.0.1` ga emas — aks holda server konteynerdan tashqaridan yetib bo‘lmaydigan bo‘ladi.
- `PYTHONUNBUFFERED=1` — `docker logs` chiqishni real vaqtda ko‘rsatsin.
- `-w 4` — 4 worker jarayon (qoida: `2 × CPU + 1`, keyin o‘lchang).

## Django (WSGI)

Django an’anaviy **WSGI**; Gunicorn bilan xizmat qiling. Django ishga tushishda **migratsiyalar** va **static fayllar**ni ham talab qiladi.

```dockerfile
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONUNBUFFERED=1 DJANGO_SETTINGS_MODULE=myproject.settings
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn", "myproject.wsgi:application", "-w", "3", "-b", "0.0.0.0:8000"]
```

```bash
#!/bin/sh
# entrypoint.sh — har konteyner ishga tushganda, CMD serveridan OLDIN ishlaydi
set -e
python manage.py migrate --noinput          # baza migratsiyalarini qo'llash
python manage.py collectstatic --noinput    # static fayllarni yig'ish
exec "$@"                                    # keyin CMD (gunicorn) ni ishga tushirish
```

`exec "$@"` — sozlashdan keyin boshqaruvni `CMD` ga beradi va `exec` shell’ni almashtiradi, shunda signallar (`docker stop` dagi SIGTERM) Gunicorn’ga yetadi va toza to‘xtaydi.

## WSGI va ASGI

| | WSGI | ASGI |
|---|---|---|
| Model | Sinxron, worker/thread’da bitta so‘rov | Async, worker’da ko‘p konkurent |
| Serverlar | Gunicorn | Uvicorn (± Gunicorn) |
| Freymvorklar | Django (klassik), Flask | FastAPI, Django async |
| Uchun eng yaxshi | An’anaviy ilovalar | Yuqori konkurentlik / streaming |

## Compose bilan ishga tushirish

```yaml
services:
  web:
    build: .
    ports: ["8000:8000"]
    environment:
      DATABASE_URL: postgresql://app:secret@db:5432/app
    depends_on:
      db: { condition: service_healthy }
  db:
    image: postgres:16
    environment: { POSTGRES_USER: app, POSTGRES_PASSWORD: secret, POSTGRES_DB: app }
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5
volumes: { pgdata: {} }
```

Entrypoint’dagi `migrate` `db` ga qarshi ishlaydi — shuning uchun healthcheck muhim: migratsiyalar baza tayyor bo‘lmasidan oldin ishlamasligi kerak.

## Keng tarqalgan xatolar

1. **`127.0.0.1` ga bog‘lash** — server xostdan/boshqa konteynerdan yetib bo‘lmaydi; `0.0.0.0` ishlating.
2. **Prod’da dev serverni (`runserver`/`--reload`) ishlatish** — bir oqimli, xavfsiz emas; Gunicorn/Uvicorn worker’lari.
3. **Migratsiyalarni imij qurishga qo‘shish** — ular *ishga tushish* (entrypoint) da, baza mavjud bo‘lganda bo‘lishi kerak.
4. **`collectstatic` ni unutish** — Django’da CSS/JS 404 bo‘ladi.
5. **`exec "$@"` ni ishlatmaslik** — signallar serverga yetmaydi, `docker stop` osilib qoladi.

## Xulosa

- Kesh-do‘st imij quring; `0.0.0.0` ga bog‘lang; `PYTHONUNBUFFERED=1`.
- FastAPI → Uvicorn (± Gunicorn) ASGI; Django → Gunicorn WSGI.
- Migratsiya va `collectstatic` ni ishga tushishda (entrypoint) bajaring, keyin serverni `exec` qiling.
- Uni Compose orqali sog‘lom bazaga ulang.

## Mashqlar

**Oson**

1. Minimal FastAPI ilovasini Uvicorn bilan `0.0.0.0:8000` da konteynerlang; xostdan curl qiling.
2. `PYTHONUNBUFFERED=1` qo‘shing va loglar `docker logs` da darrov chiqishini tasdiqlang.

**O‘rtacha**

3. Django entrypoint yozing: `migrate` va `collectstatic`, keyin Gunicorn’ni `exec` qiling; migratsiyalar ishga tushishda qo‘llanishini tekshiring.
4. FastAPI’ni Gunicorn + Uvicorn worker’lari (`-w 4`) bilan xizmat qiling va bir nechta worker PID’ini ko‘ring.

**Advanced**

5. Migratsiyalar faqat baza healthcheck o‘tgach ishlaydigan Django + Postgres stekini Compose bilan quring; tartibni loglar bilan isbotlang.

**Xatoni top**

6. FastAPI konteyneri toza ishga tushadi, lekin xostdan `curl localhost:8000` rad etiladi. `127.0.0.1` ga bog‘langan. Sabab va yechim.

**Mini loyiha**

FastAPI yoki Django’ni Postgres bilan Compose orqali to‘liq konteynerlang: kesh-do‘st Dockerfile, migratsiyalarni boshqaradigan entrypoint (Django uchun static ham), healthcheckли baza va toza to‘xtash. Ishga tushirish yo‘riqnomasini hujjatlang.

## Test

<details>
<summary>1. Konteyner ichida server qaysi manzilga bog‘lanishi kerak?</summary>
<code>0.0.0.0</code> — konteynerdan tashqaridan ulanishlarni qabul qilish uchun.
</details>

<details>
<summary>2. Baza migratsiyalari qachon ishlashi kerak?</summary>
Konteyner ishga tushishida (entrypoint), baza tayyor bo‘lgach — imij qurishida emas.
</details>

<details>
<summary>3. FastAPI va klassik Django uchun qaysi server?</summary>
FastAPI uchun Uvicorn (ASGI); klassik Django uchun Gunicorn (WSGI).
</details>

<details>
<summary>4. Nega entrypoint `exec "$@"` bilan tugaydi?</summary>
Server shell jarayonini almashtirsin va signallarni (toza to‘xtash uchun) qabul qilsin.
</details>

## Keyingi dars

[PostgreSQL, Redis va Nginx](/courses/docker-python/postgres-redis-nginx).
