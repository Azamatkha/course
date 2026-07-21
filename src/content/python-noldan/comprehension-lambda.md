## Bu darsda nimalarni o‘rganamiz

- List comprehension — ro‘yxatni bir qatorda yasash.
- Shart bilan filtrlash.
- Lambda — kichik anonim funksiyalar.
- `map`, `filter`, `sorted` bilan ishlash.

## Oldindan nima bilish kerak

[Sikllar](/courses/python-noldan/sikllar), [Ro‘yxatlar](/courses/python-noldan/royxatlar) va [Funksiyalar](/courses/python-noldan/funksiyalar).

## Asosiy g‘oya — bir jumlada

> **List comprehension** — `for` sikli bilan ro‘yxat yasashning **qisqa va chiroyli** usuli. **Lambda** — bir qatorlik kichik funksiya.

**Hayotiy o‘xshatish — konveyer.** Oddiy sikl — har bir mahsulotni qo‘lda olib, ishlab, qutiga solish. Comprehension — konveyer tasmasi: “har bir mahsulotni ishlab, to‘g‘ridan-to‘g‘ri qutiga” degan bitta ixcham ko‘rsatma. Natija bir xil, lekin ancha ixcham.

## Oddiy sikldan comprehension’ga

Avval bilganimiz (sikl bilan):

```python
kvadratlar = []
for son in range(1, 6):
    kvadratlar.append(son * son)
print(kvadratlar)      # [1, 4, 9, 16, 25]
```

Xuddi shu narsa comprehension bilan — **bir qatorda**:

```python
kvadratlar = [son * son for son in range(1, 6)]
print(kvadratlar)      # [1, 4, 9, 16, 25]
```

Tuzilishi: `[natija for element in ketma-ketlik]`. “Har bir `son` uchun `son*son` ni ro‘yxatga sol” deb o‘qiladi.

## Shart bilan filtrlash

Oxiriga `if` qo‘shib, faqat mos elementlarni olamiz:

```python
juftlar = [son for son in range(1, 11) if son % 2 == 0]
print(juftlar)         # [2, 4, 6, 8, 10]
```

“Har bir `son` uchun, **agar** juft bo‘lsa, ro‘yxatga sol”. Sikl bilan yozsak 3-4 qator bo‘lardi.

Yana misollar:

```python
sozlar = ["olma", "banan", "uzum", "nok"]
uzunlar = [s.upper() for s in sozlar if len(s) > 3]
print(uzunlar)         # ['OLMA', 'BANAN', 'UZUM']
```

> [!TIP]
> Comprehension chiroyli, lekin **soddaligini saqlang**. Agar ichida ikkita `if` va `for` bo‘lsa va o‘qish qiyinlashsa — oddiy sikl yaxshiroq. Maqsad — qisqalik emas, tushunarlilik.

## Lug‘at va set comprehension

Faqat ro‘yxat emas, lug‘at va set ham shunday yasaladi:

```python
kvadrat_lugat = {son: son*son for son in range(1, 4)}
print(kvadrat_lugat)   # {1: 1, 2: 4, 3: 9}

noyob = {harf for harf in "salom"}
print(noyob)           # {'s','a','l','o','m'}
```

## Lambda — kichik anonim funksiya

Ba’zan juda oddiy funksiya kerak bo‘ladi. Uni `def` bilan yozish ortiqcha. **Lambda** — bir qatorlik funksiya:

```python
# oddiy funksiya:
def qosh(x):
    return x + 10

# xuddi shu, lambda bilan:
qosh = lambda x: x + 10
print(qosh(5))         # 15
```

Tuzilishi: `lambda argumentlar: natija`. `return` yozilmaydi — natija avtomatik qaytadi. Lambda odatda **boshqa funksiyaga argument** sifatida ishlatiladi (pastda ko‘ramiz).

## `sorted`, `map`, `filter` bilan lambda

### `sorted` — maxsus tartiblash

```python
talabalar = [("Ali", 85), ("Vali", 70), ("Guli", 92)]
# ballga qarab tartiblash (ikkinchi element bo'yicha):
tartib = sorted(talabalar, key=lambda t: t[1], reverse=True)
print(tartib)   # [('Guli', 92), ('Ali', 85), ('Vali', 70)]
```

`key=lambda t: t[1]` — “har bir elementni ikkinchi qiymati bo‘yicha tartibla”.

### `map` — har biriga amal qo‘llash

```python
sonlar = [1, 2, 3, 4]
kvadratlar = list(map(lambda x: x*x, sonlar))
print(kvadratlar)      # [1, 4, 9, 16]
```

### `filter` — shart bo‘yicha ajratish

```python
juftlar = list(filter(lambda x: x % 2 == 0, sonlar))
print(juftlar)         # [2, 4]
```

> [!NOTE]
> `map` va `filter` ko‘pincha comprehension bilan ham yozilishi mumkin va comprehension odatda **o‘qishga osonroq**. Masalan `[x*x for x in sonlar]` — `map(lambda...)` dan tushunarliroq. Ikkalasini ham bilib, qulayrog‘ini tanlang.

## Keng tarqalgan xatolar

1. **Ortiqcha murakkab comprehension** — o‘qib bo‘lmaydigan bir qatorlar; oddiy sikl yaxshiroq.
2. **Lambda ichida `return` yozish** — kerak emas, natija o‘zi qaytadi.
3. **`map`/`filter` natijasini to‘g‘ridan-to‘g‘ri ishlatish** — ular “iterator” qaytaradi; `list(...)` bilan o‘rang.
4. **`key=` ni unutish** — `sorted(talabalar, lambda...)` xato; `key=lambda...` bo‘lishi kerak.

## Xulosa

- List comprehension — `for` bilan ro‘yxat yasashning ixcham usuli; `if` bilan filtrlaydi.
- Lug‘at va set uchun ham comprehension bor.
- Lambda — bir qatorlik anonim funksiya, ko‘pincha `sorted/map/filter` bilan.
- Qisqalikdan ko‘ra tushunarlilikni ustun qo‘ying.

## Mashqlar

**Oson**

1. 1 dan 10 gacha sonlarning kublari ro‘yxatini comprehension bilan yasang.
2. So‘zlar ro‘yxatidan faqat 4 harfdan uzunlarini ajratib oling.

**O‘rtacha**

3. Comprehension bilan 1–100 orasidagi 3 ga bo‘linadigan sonlar ro‘yxatini yasang.
4. `("Ali", 20)` kabi juftliklar ro‘yxatini yoshga qarab `sorted` + `lambda` bilan tartiblang.

**Fikrlash**

5. Qachon comprehension, qachon oddiy sikl ishlatasiz? O‘z mezoningizni yozing.

**Xatoni top**

6. Nega bu `<map object ...>` chiqaradi va qanday tuzatasiz?
```python
sonlar = [1, 2, 3]
print(map(lambda x: x*2, sonlar))
```

**Mini loyiha**

Talabalar ro‘yxatini (ism, ball) oling. Comprehension bilan o‘tganlarni (ball ≥ 60) ajrating, `sorted` + `lambda` bilan ballga qarab tartiblang va eng yaxshi 3 tasini chiqaring.

## Test

<details>
<summary>1. `[x*2 for x in [1,2,3]]` nima beradi?</summary>
<code>[2, 4, 6]</code>.
</details>

<details>
<summary>2. Comprehension’da shart qanday qo‘shiladi?</summary>
Oxiriga <code>if shart</code> — masalan <code>[x for x in nums if x > 0]</code>.
</details>

<details>
<summary>3. Lambda nima?</summary>
Bir qatorlik anonim funksiya: <code>lambda arg: natija</code> (return yozilmaydi).
</details>

<details>
<summary>4. `sorted` da maxsus tartib qanday beriladi?</summary>
<code>key=lambda ...</code> orqali — nima bo‘yicha tartiblashni ko‘rsatadi.
</details>

## Keyingi dars

[JSON va CSV fayllar bilan ishlash](/courses/python-noldan/json-csv-fayllar) — real ma’lumotni saqlashni o‘rganamiz.
