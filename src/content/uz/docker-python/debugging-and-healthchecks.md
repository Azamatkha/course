## Bu darsda nimalarni o‘rganamiz

- Konteynerlarni `logs`, `exec`, `inspect`, `stats` bilan tashxislash.
- **HEALTHCHECK** qo‘shish va tayyorlik/tiriklik farqi.
- **Restart siyosatlari** va resurs limitlari.
- Har bir boshlovchi uchraydigan xatolarni tuzatish.

## Oldindan nima bilish kerak

Oldingi Docker darslari. Bu dars — nimadir noto‘g‘ri ketganda dala qo‘llanmangiz.

## Asosiy g‘oya — bir jumlada

> Konteyner noto‘g‘ri ishlaganda taxmin qilmaysiz — **loglarini o‘qiysiz, ichiga kirasiz va sozlamasini tekshirasiz**; hamda Docker’ga ilovangiz aslida sog‘lom ekanini bilishni o‘rgatasiz.

**Hayotiy o‘xshatish — shifokor asboblari.** `logs` — bemor simptomlarini tinglash. `exec` — xonaga kirib bevosita tekshirish. `inspect` — tibbiy karta (sozlama, mount, env). `stats` — hayotiy ko‘rsatkichlar monitori (CPU, xotira). **Healthcheck** — bemorning “yaxshiman / yomonman” signali, tizim to‘liq qulashdan oldin reaksiya bersin.

## Debug asboblari

```bash
docker logs -f --tail 100 web      # ilova chiqishi — shu yerdan boshlang
docker exec -it web sh             # ISHLAB TURGAN konteyner ichiga kirish
docker inspect web                 # to'liq sozlama: env, mount, tarmoq, entrypoint
docker stats                       # konteyner bo'yicha jonli CPU/xotira
docker ps -a                       # umuman ishlayaptimi? chiqish kodi qanday?
```

### Konteyner darrov chiqib ketadi — 1-muammo

```bash
docker ps -a          # STATUS: "Exited (1) 3 seconds ago"
docker logs web       # traceback/sabab deyarli doim shu yerda
```

Keng tarqalgan sabablar: ishga tushishda istisno, asosiy jarayon tugagani (konteyner PID 1 ishlaguncha yashaydi), noto‘g‘ri `CMD` yoki yetishmagan env o‘zgaruvchi. **Loglar deyarli doim aytadi.**

### Ishga tushmayotgani uchun debug qila olmayapsizmi?

Shell olish uchun entrypoint’ni almashtiring:

```bash
docker run -it --entrypoint sh myimage    # fayl tizimini titkilash
```

## Loglar: konteyner-do‘st qiling

- **stdout/stderr** ga log yozing, faylga emas — Docker oqimlarni oladi; fayllar vaqtinchalik FS’da yo‘qoladi.
- `PYTHONUNBUFFERED=1` (yoki `python -u`) o‘rnating — chiqish buferlanmasin va jonli chiqsin.
- Tizimli logging ishlating (Python logging darsidan) — log yig‘uvchi tahlil qila olsin.

## HEALTHCHECK — aslida tayyormi?

Ishlab turgan konteyner *ishlaydigan* degani emas. `HEALTHCHECK` buyruqni davriy ishlatadi; konteyner `healthy`/`unhealthy` deb belgilanadi.

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1
```

- `--start-period` — sekin ishga tushish uchun imtiyozli vaqt (xatolar hisoblanmaydi).
- `--retries` — `unhealthy` bo‘lishdan oldin ketma-ket muvaffaqiyatsizliklar.
- Compose’ning `depends_on: condition: service_healthy` shunga tayanadi — API *tayyor* bazani kutadi, faqat ishga tushganini emas.

### Tiriklik va tayyorlik

| | Tiriklik (liveness) | Tayyorlik (readiness) |
|---|---|---|
| Savol | Jarayon tirikmi? | Hozir trafik xizmat qila oladimi? |
| Muvaffaqiyatsizlik | Qayta ishga tushirish | Trafik yubormaslik |
| Misol | Jarayon javob beradimi | Baza ulanishi o‘rnatilganmi |

## Restart siyosatlari

```bash
docker run --restart=unless-stopped myapp
```

| Siyosat | Xatti-harakat |
|---|---|
| `no` (standart) | Hech qachon qayta ishga tushmaydi |
| `on-failure[:N]` | Nol bo‘lmagan chiqishda, N martagacha |
| `unless-stopped` | Siz aniq to‘xtatmasangiz doim |
| `always` | Doim (daemon qayta yuklangach ham) |

Uzoq ishlaydigan servislar uchun `unless-stopped` — qulash yoki xost qayta yuklanishidan keyin qaytaradi.

## Resurs limitlari (va OOM)

```bash
docker run --memory=512m --cpus=1 myapp
```

Konteyner xotira limitidan oshsa, yadro uni **OOM-kill** qiladi — 137 chiqish kodi va `docker inspect` da `OOMKilled: true`. Limitlar bitta konteyner xostni ochlantirishining oldini oladi.

## Keng tarqalgan xatolar (boshlovchi sinovi)

1. **Konteyner darrov chiqadi** — asosiy jarayon tugagan/qulagan; `docker logs` va `docker ps -a` o‘qing.
2. **Loglar bo‘sh** — chiqish buferlangan; `PYTHONUNBUFFERED=1` o‘rnating, stdout’ga log yozing.
3. **“Ishladi keyin yuk ostida o‘ldi”** — OOM-kill (137); xotira limitini oshiring yoki oqishni tuzating.
4. **`depends_on` kutmadi** — healthcheck yo‘q; `service_healthy` bilan qo‘shing.
5. **Konteyner ichida fayllarni “tuzatish”** — qayta ishga tushishda yo‘qoladi; imij/Dockerfile’ni tuzating.

## Xulosa

- `logs`, `exec`, `inspect`, `stats`, `ps -a` bilan debug qiling — o‘qing, taxmin qilmang.
- `PYTHONUNBUFFERED=1` bilan stdout’ga log yozing; konteyner o‘lgan sabab odatda loglarda.
- Tayyorlik va ishga tushish tartibi uchun HEALTHCHECK qo‘shing; tiriklik va tayyorlikni biling.
- Chidamlilik uchun restart siyosati va resurs limitlarini o‘rnating; 137 = OOM.

## Mashqlar

**Oson**

1. Ishga tushishda qulaydigan konteyner yasang; sababini `docker ps -a` va `docker logs` bilan toping.
2. Loglari bo‘sh konteynerga `PYTHONUNBUFFERED=1` qo‘shing va chiqish endi oqishini tasdiqlang.

**O‘rtacha**

3. `/health` endpointга tegadigan HEALTHCHECK qo‘shing; `healthy` ga o‘tishini kuzating va `unhealthy` ni simulyatsiya qiling.
4. `--restart=on-failure:3` o‘rnating va qulaydigan konteynerni uch marta qayta ishga tushirib keyin to‘xtashini isbotlang.

**Advanced**

5. `--memory=256m` bilan xotira och konteyner ishga tushirib OOM-kill’ni chaqiring; `inspect` orqali 137 / `OOMKilled: true` ni tasdiqlang.

**Xatoni top**

6. Compose’dagi servis baza “tayyor emas” deb qulaydi, garchi `depends_on` o‘rnatilgan bo‘lsa ham. Bo‘shliqni tushuntiring va healthcheck bilan tuzating.

**Mini loyiha**

Ilova stekingizga operatsion chidamlilik qo‘shing: stdout tizimli logging, `/health` endpoint + HEALTHCHECK, `restart: unless-stopped`, xotira/CPU limitlari va yuqoridagi asboblar bilan beshta keng tarqalgan muvaffaqiyatsizlikni tashxislash bo‘yicha qisqa runbook.

## Test

<details>
<summary>1. Konteyner darrov chiqsa, birinchi qayerga qaraysiz?</summary>
<code>docker ps -a</code> (chiqish kodi/holat) va <code>docker logs</code> (haqiqiy sabab).
</details>

<details>
<summary>2. Nega konteyner loglari bo‘sh bo‘lishi mumkin?</summary>
Chiqish buferlangan — <code>PYTHONUNBUFFERED=1</code> o‘rnating va stdout/stderr’ga log yozing.
</details>

<details>
<summary>3. HEALTHCHECK Compose’da nimani yoqadi?</summary>
<code>depends_on: condition: service_healthy</code> — bog‘liqlar servis aslida tayyor bo‘lguncha kutadi.
</details>

<details>
<summary>4. 137 chiqish kodi odatda nimani anglatadi?</summary>
Konteyner xotira limitidan oshgani uchun OOM-kill qilingan.
</details>

## Keyingi dars

[Dev va Prod Oqimi va Yakuniy Joylashtirish](/courses/docker-python/dev-vs-prod-and-capstone).
