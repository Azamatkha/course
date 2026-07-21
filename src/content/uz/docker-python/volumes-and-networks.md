## Bu darsda nimalarni o‘rganamiz

- Konteynerlar nega **vaqtinchalik** va **volume** ma’lumotni qanday saqlaydi.
- **Named volume** va **bind mount** farqi.
- Docker **tarmoqlari** va konteyner DNS bilan konteynerlarni ulash.
- Portlarni to‘g‘ri ochish va qachon *ochmaslik*.

## Oldindan nima bilish kerak

[Imijlar va Dockerfile](/courses/docker-python/images-and-dockerfile).

## Asosiy g‘oya — bir jumlada

> Konteyner fayl tizimi o‘chirilganda yo‘qoladi — **volume**lar ma’lumotni tirik saqlaydi, **tarmoq**lar esa konteynerlarga bir-birini nom orqali topib gaplashishga imkon beradi.

**Hayotiy o‘xshatish — mehmonxona xonasi va omborxona.** Konteyner — mehmonxona xonasi: qulay, lekin u yerda qoldirgan narsangiz chiqishda (konteyner o‘chirilganda) yo‘qoladi. **Volume** — alohida ijaraga olingan omborxona: uni istagan xonaga ulaysiz, narsangiz saqlanadi. **Tarmoq** — mehmonxonaning ichki telefoni: xonalar bir-birini nom bilan chaqiradi (“meni ma’lumotlar bazasi xonasiga ulang”).

## Konteynerlar nega vaqtinchalik

Konteynerning yozuv qatlami u o‘chirilganda o‘chadi. Konteyner ichida ma’lumotlar bazasi faylini yozib, `docker rm` qilsangiz — ma’lumot yo‘qoladi:

```bash
docker run --name db postgres:16      # ma'lumotni konteyner ichida yozadi
docker rm -f db                        # ma'lumot yo'q qilindi — real ma'lumotga hech qachon qilmang
```

Bu ataylab shunday: konteynerlar **bir martalik va statesiz** bo‘lishi kerak. Holat (state) volumelarda yashaydi.

## Volume: named va bind mount

```bash
# Named volume — Docker boshqaradi; ishlab chiqarishdagi baza uchun ideal
docker run -v pgdata:/var/lib/postgresql/data postgres:16

# Bind mount — xost papkasini konteynerga ulaydi; dev (jonli kod) uchun ideal
docker run -v "$PWD:/app" -w /app python:3.12-slim python app.py
```

| | Named volume | Bind mount |
|---|---|---|
| Joyi | Docker boshqaradi | Xostdagi tanlagan papkangiz |
| Uchun eng yaxshi | **Ishlab chiqarish ma’lumoti** (bazalar) | **Dev** (kodni jonli tahrirlash) |
| Ko‘chuvchanlik | Yuqori | Xost yo‘llariga bog‘liq |

> [!TIP]
> Qoida: **saqlanishi shart bo‘lgan ma’lumot uchun named volume** (bazalar), **dev’da tahrir qilayotgan kod uchun bind mount** — o‘zgarishlar qayta qurmasdan darrov ko‘rinadi.

## Tarmoq va konteyner DNS

Standart holatda bitta **foydalanuvchi tarmog‘i**dagi konteynerlar bir-biriga **nom orqali** yeta oladi:

```bash
docker network create appnet
docker run -d --name db --network appnet postgres:16
docker run -d --name api --network appnet myapi   # "db" xostiga ulanadi!
```

`api` ichida baza URL’i `postgresql://user:pass@db:5432/mydb` — Docker DNS `db` ni to‘g‘ri konteynerga hal qiladi. **Nom bilan ulanasiz, IP bilan emas.** (Docker Compose, keyingi dars, buni avtomatik sozlaydi.)

## Portlarni ochish

`-p xost:konteyner` konteyner portini *xostga* ochadi:

```bash
docker run -d -p 8000:8000 myapi     # xost:8000 → konteyner:8000
```

- Faqat **tashqi dunyoga** kerak bo‘lganini oching (odatda faqat veb / teskari proksi).
- O‘zaro ichki tarmoqda gaplashadigan konteynerlarga ochilgan port **kerak emas** — ma’lumotlar bazasi ishlab chiqarishda xostdan yetib bo‘lmaydigan bo‘lishi kerak.

## Keng tarqalgan xatolar

1. **Baza ma’lumotini konteynerda saqlash** — `rm` da yo‘qoladi; named volume ishlating.
2. **Baza portini xostga ochish** (prod’da) — xavfsizlik xavfi; ichki qoldiring.
3. **Konteynerlar orasida `localhost` orqali ulanish** — `localhost` bu konteynerning o‘zi; boshqasining **nomi**ni ishlating.
4. **Bind mount o‘rnatilgan bog‘liqliklarni yashiradi** — tor ulang.
5. **Standart bridge’da nom hal bo‘lishini kutish** — DNS-by-name **foydalanuvchi** tarmog‘ini (yoki Compose) talab qiladi.

## Xulosa

- Konteynerlar vaqtinchalik; volumelar ma’lumotni o‘chirish va qayta qurishlarda saqlaydi.
- Named volume ishlab chiqarish ma’lumotiga, bind mount jonli dev kodiga mos.
- Foydalanuvchi tarmog‘idagi konteynerlar bir-biriga nom orqali yetadi (DNS).
- Faqat tashqi dunyoga kerak portlarni oching; bazalarni ichki qoldiring.

## Mashqlar

**Oson**

1. Postgres’ni named volume bilan ishga tushiring, qator qo‘shing, konteynerni o‘chiring, o‘sha volume bilan qayta ishga tushiring va qator saqlanganini tasdiqlang.
2. Joriy papkani Python konteyneriga bind mount qiling va xostda faylni tahrirlab, ichida o‘zgarishni ko‘ring.

**O‘rtacha**

3. Foydalanuvchi tarmog‘i yarating, `db` va `api` ni unda ishga tushiring va `api` dan `db` ga nom orqali ulaning (IP’siz).
4. Volumesiz konteyner o‘chirilganda ma’lumot yo‘qolishini, volume bilan saqlanishini ko‘rsating.

**Advanced**

5. Veb ilova + Postgres + Redis uchun volume va tarmoq tuzilishini loyihalang: qaysilari volume oladi, qaysi portlar ochiladi, nima ichki qoladi.

**Xatoni top**

6. Ilova konteyneri `localhost:5432` da bazaga yeta olmayapti, ikkalasi ham ishlayapti. Nega `localhost` xato va yechimi?

**Mini loyiha**

Qo‘lda ikki konteynerli sozlama (hali Compose’siz): umumiy tarmoqdagi Python API va Postgres bazasi, baza uchun named volume. API’ni bazaga nom orqali ulang, faqat API portini oching va baza konteyneri qayta ishga tushganda ma’lumot saqlanishini tekshiring.

## Test

<details>
<summary>1. Konteyner o‘chirilganda ichida yozilgan ma’lumotga nima bo‘ladi?</summary>
Yozuv qatlami bilan o‘chadi — saqlash uchun volume ishlating.
</details>

<details>
<summary>2. Dev’da jonli kod tahriri uchun qaysi volume turi?</summary>
Bind mount — xost papkasini ulaydi, tahrirlar darrov ko‘rinadi.
</details>

<details>
<summary>3. Bir konteyner boshqasiga qanday yetadi?</summary>
Umumiy foydalanuvchi tarmog‘ida boshqasining nom(servis)i orqali (Docker DNS hal qiladi).
</details>

<details>
<summary>4. Ishlab chiqarishda baza portini xostga ochish kerakmi?</summary>
Yo‘q — ichki tarmoqda qoldiring; faqat tashqi dunyoga kerak portni oching.
</details>

## Keyingi dars

[Docker Compose](/courses/docker-python/docker-compose) — butun stekni bitta faylda.
