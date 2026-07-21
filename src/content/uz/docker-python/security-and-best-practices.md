## Bu darsda nimalarni o‘rganamiz

- Konteynerlarni **non-root** foydalanuvchi sifatida ishlatish.
- **Sirlar**ni imijdan tashqarida tutish, versiyalarni qotirish va CVE skanerlash.
- Qattiqlashtirish: read-only fayl tizimi, huquqlarni tashlash, resurs limitlari.
- Ishlab chiqarish xavfsizlik ro‘yxati.

## Oldindan nima bilish kerak

[Ko‘p Bosqichli Build va Optimizatsiya](/courses/docker-python/multi-stage-and-optimization) va oldingi Docker darslari.

## Asosiy g‘oya — bir jumlada

> Konteyner — izolyatsiya, lekin **ichida beparvo bo‘lish mumkin bo‘lgan xavfsizlik chegarasi emas** — non-root ishlating, sir jo‘natmang, qotiring/skanerlang va ishlaydigan eng kam huquqni bering.

**Hayotiy o‘xshatish — faqat o‘z xonangizni ochadigan kalit.** Standart holatda konteyner jarayoni ko‘pincha **root** sifatida ishlaydi — qochib chiqsa hamma narsani ochadigan asosiy kalit. Yaxshi xavfsizlik — faqat kerak bo‘lgan bitta xonani ochadigan kalit berish (non-root), mini-barni qulflash (read-only fayl tizimi) va seyf kodini eshikka yopishtirmaslik (imijda sir yo‘q).

## Non-root sifatida ishlating

Standart holatda ko‘p imij root sifatida ishlaydi. Buzuvchi konteynerdan chiqsa, konteynerdagi root ancha xavfli. Imtiyozsiz foydalanuvchi yarating va unga o‘ting:

```dockerfile
FROM python:3.12-slim
RUN useradd --create-home --uid 1001 appuser   # non-root foydalanuvchi
WORKDIR /app
COPY --chown=appuser:appuser . .
RUN pip install --no-cache-dir -r requirements.txt
USER appuser                                   # ← imtiyozlarni tashlash
CMD ["gunicorn", "app.main:app", "-b", "0.0.0.0:8000"]
```

`USER appuser` — jarayon imtiyozsiz ishlaydi. Bu — eng katta ta’sirli, eng kam mehnatli qattiqlashtirish qadamlaridan biri.

## Sirlarni imijdan tashqarida tuting

Imijga qo‘yilgan sirlar uni tortib olgan har kimga ko‘rinadi — `docker history` build arg’larini ham ochishi mumkin.

```dockerfile
# ❌ HECH QACHON
ENV API_KEY=sk-secret123
# ❌ HECH QACHON
ARG DB_PASSWORD           # build tarixida ko'rinadi
```

Buning o‘rniga:
- Sirlarni **ishga tushishda** muhit orqali bering (`-e`, Compose `env_file`, orkestrator sirlari).
- Build vaqtidagi sirlar uchun Docker/BuildKit **sir mount**laridan foydalaning.
- `.env` ni hech qachon commit qilmang; `.gitignore` va `.dockerignore` ga qo‘shing.

## Versiyalarni qotiring va skanerlang

```dockerfile
FROM python:3.12-slim         # `python:latest` emas, versiyani qotiring
```

- Baza imij va bog‘liqliklarni **qotiring** — `latest` ko‘chuvchi nishon.
- **Skanerlang**:

```bash
docker scout cves myapp       # yoki: trivy image myapp
```

Qotirilgan imij ham vaqti-vaqti bilan yangilanishi kerak (xavfsizlik yangilanishlari).

## Ishga tushishda qattiqlashtirish

```bash
docker run \
  --read-only \                       # o'zgarmas fayl tizimi (faqat tmpfs/volume'ga yozish)
  --tmpfs /tmp \                       # yoziladigan vaqtinchalik papka
  --cap-drop ALL \                     # barcha Linux huquqlarini tashlash
  --security-opt no-new-privileges \   # jarayon ko'proq huquq ololmaydi
  --memory 512m --cpus 1 \             # resurs limitlari
  myapp
```

Eng kam imtiyoz: qulflangan holda boshlang va faqat ilova aslida kerak bo‘lganini oching.

## Ishlab chiqarish xavfsizlik ro‘yxati

- [ ] **Non-root** foydalanuvchi (`USER`)
- [ ] Imij/build arg/tarixda **sir yo‘q**
- [ ] Baza va bog‘liqliklar **qotirilgan**
- [ ] CI’da CVE **skaneri**; yangilanishda qayta qurish
- [ ] `--read-only` root FS + aniq yoziladigan mount/tmpfs
- [ ] `--cap-drop ALL` + `no-new-privileges`
- [ ] **Resurs limitlari** (xotira/CPU)
- [ ] Minimal imij (ko‘p bosqichli, slim) → kichik hujum yuzasi
- [ ] Baza/kesh portlari xostga **ochilmagan**
- [ ] `.dockerignore` `.env`, `.git`, kalitlarni chetlaydi

## Keng tarqalgan xatolar

1. **Root sifatida ishlash** — standart; non-root’ga o‘ting.
2. **`ENV`/`ARG`/imijda sirlar** — imijga ega har kimga ochiq.
3. **`FROM ...:latest`** — qotirilmagan, takrorlanmas, jimgina o‘zgaruvchi.
4. **Hech qachon skanerlamaslik** — ma’lum CVE’larni jo‘natish.
5. **Resurs limitisiz** — bitta konteyner xostni ochlantirishi mumkin.

## Xulosa

- Izolyatsiya — beparvolik uchun litsenziya emas: non-root ishlating, sir jo‘natmang, qotiring va skanerlang.
- Ishga tushishda qattiqlashtiring: read-only FS, huquqlarni tashlash, yangi imtiyozsiz, resurs limitlari.
- Kichik imijlar va ichki-only ma’lumot portlari hujum yuzasini kamaytiradi.
- Har bir jo‘natadigan imij uchun xavfsizlik ro‘yxatini bajaring.

## Mashqlar

**Oson**

1. Dockerfile’ga non-root `USER` qo‘shing va konteyner ichida `whoami` root emasligini tasdiqlang.
2. Baza imijni aniq versiyaga qotiring va nega `latest` dan afzalligini tushuntiring.

**O‘rtacha**

3. Sirni `ENV` dan ishga tushish `env_file` (gitignore qilingan) ga ko‘chiring va u `docker history` da yo‘qligini tekshiring.
4. Imijni `docker scout`/`trivy` bilan skanerlang va bitta topilmani hal qiling.

**Advanced**

5. Ilovani `--read-only`, `--cap-drop ALL`, `no-new-privileges` va xotira/CPU limitlari bilan ishga tushiring; buzilganini tuzating (masalan vaqtinchalik yozish uchun tmpfs qo‘shing).

**Xatoni top**

6. `/tmp` ga yozadigan ilova `--read-only` ostida qulaydi. Nega va read-only’ni olib tashlamasdan qanday tuzatasiz?

**Mini loyiha**

Real ilova imijini to‘liq ro‘yxatga qarshi qattiqlashtiring: non-root, sir yo‘q, qotirilgan+skanerlangan baza, aniq yoziladigan mount’li read-only FS, tashlangan huquqlar va resurs limitlari. Har bir nazoratni va ilovani ishlatish uchun moslashtirgan bitta narsani hujjatlang.

## Test

<details>
<summary>1. Eng katta ta’sirli, eng kam mehnatli qattiqlashtirish qadami?</summary>
Non-root foydalanuvchi sifatida ishlatish (<code>USER appuser</code>).
</details>

<details>
<summary>2. Sirlar qayerda yashashi kerak?</summary>
Ishga tushishda beriladi (muhit/sir mount/orkestrator sirlari) — imij, ENV yoki build arg’ga hech qachon qo‘shilmaydi.
</details>

<details>
<summary>3. Nega `FROM python:latest` dan qochiladi?</summary>
Qotirilmagan va vaqt o‘tishi bilan o‘zgaradi — takrorlanmas buildlar, jim yangi xatolar/CVE’lar.
</details>

<details>
<summary>4. `--cap-drop ALL` nima qiladi?</summary>
Konteyner jarayonidan barcha Linux huquqlarini olib tashlaydi (eng kam imtiyoz).
</details>

## Keyingi dars

[Debug, Logging va Healthcheck](/courses/docker-python/debugging-and-healthchecks).
