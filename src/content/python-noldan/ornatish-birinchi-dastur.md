## Bu darsda nimalarni o‘rganamiz

- Python’ni kompyuterga o‘rnatamiz (yoki brauzerda ishlatamiz).
- Kod yozadigan muharrir (dastur) tanlaymiz.
- Birinchi dasturimizni yozamiz va ishga tushiramiz.
- `print` va izohlar (comment) bilan tanishamiz.

## Oldindan nima bilish kerak

[Python nima va nega kerak?](/courses/python-noldan/python-nima) darsi. Boshqa hech narsa shart emas.

## Asosiy g‘oya — bir jumlada

> Python kodini yozish uchun ikki narsa kerak: **Python dasturi** (kodni tushunadi) va **muharrir** (kodni yozasiz). So‘ng “Ishga tushir” tugmasini bosasiz — tamom.

**Hayotiy o‘xshatish — pianino.** Python — bu pianino (asbob), muharrir — bu notalar yozadigan daftar. Siz daftarga notalarni yozasiz (kod), pianino esa ularni chalib beradi (dasturni bajaradi). Boshida notalarni sekin yozasiz, keyin tez o‘rganib ketasiz.

## 1-usul: Hech narsa o‘rnatmasdan boshlash (eng oson)

Agar hozircha o‘rnatish bilan ovora bo‘lishni istamasangiz, brauzerda ishlaydigan bepul vositalardan foydalaning:

- **replit.com** yoki **Google Colab** — ro‘yxatdan o‘tasiz, “yangi Python fayl” ochasiz va darrov yozishni boshlaysiz.

Bu boshlash uchun eng tez yo‘l. Keyinroq o‘z kompyuteringizga o‘rnatasiz.

## 2-usul: Kompyuterga o‘rnatish

1. **python.org/downloads** saytiga kiring va Python’ning eng oxirgi versiyasini yuklab oling.
2. O‘rnatishda **“Add Python to PATH”** degan katakchani belgilang (juda muhim!) — keyin “Install”.
3. Muharrir sifatida **VS Code** (code.visualstudio.com) ni o‘rnating — bepul va eng ommabop.

O‘rnatilganini tekshirish uchun terminal (buyruq oynasi) ochib yozing:

```bash
python --version
```

Agar `Python 3.12.x` kabi yozuv chiqsa — hammasi joyida! (Ba’zi tizimlarda `python3 --version` yoziladi.)

> [!NOTE]
> “Add Python to PATH” ni belgilashni unutmang. Aks holda kompyuter Python’ni “topa olmayman” deb xato beradi. Agar unutgan bo‘lsangiz — o‘chirib, qayta o‘rnating va bu katakchani belgilang.

## Birinchi dastur

Yangi fayl yarating va nomini `salom.py` qo‘ying (`.py` — bu Python fayli degani). Ichiga yozing:

```python
print("Salom, dunyo!")
```

Ishga tushirish:
- Terminalda: `python salom.py`
- Yoki VS Code’da o‘ng yuqoridagi “▶ Run” tugmasini bosing.

Ekranda ko‘rasiz:

```
Salom, dunyo!
```

**Tabriklayman — siz birinchi dasturingizni yozdingiz!** 🎉

## `print` ni yaxshiroq tushunamiz

`print` — “ekranga chiqar” degani. Bir nechta narsani chiqarish mumkin:

```python
print("Mening ismim:")
print("Ali")
print(2 + 3)          # matematik amal ham bo'ladi → 5
print("Ali", "Vali")  # vergul bilan ajratib bir qatorda → Ali Vali
```

Har bir `print` **yangi qatordan** chiqadi. Yuqoridagi kod natijasi:

```
Mening ismim:
Ali
5
Ali Vali
```

## Izohlar (comment) — o‘zingizga eslatma

`#` belgisidan keyingi matn **bajarilmaydi** — u faqat odam o‘qishi uchun izoh:

```python
# Bu izoh — Python uni e'tiborsiz qoldiradi
print("Salom")   # qator oxirida ham izoh yozsa bo'ladi
```

Izohlar kodni tushunarli qilish uchun kerak. Boshida ko‘proq izoh yozing — keyin o‘zingizga rahmat aytasiz.

## Keng tarqalgan xatolar

1. **`.py` kengaytmasini unutish** — faylni `salom.txt` emas, `salom.py` deb saqlang.
2. **Qo‘shtirnoqni unutish** — `print(Salom)` xato beradi; to‘g‘risi `print("Salom")`.
3. **Qavsni yopmaslik** — `print("Salom"` xato; yopuvchi `)` shart.
4. **“PATH” ni belgilamaslik** — o‘rnatishda o‘tkazib yuborilsa, `python` buyrug‘i ishlamaydi.
5. **Katta-kichik harf** — `Print` emas, `print` (Python katta-kichik harfni farqlaydi).

## Xulosa

- Kod yozish uchun Python + muharrir kerak (yoki brauzerdagi replit/Colab).
- O‘rnatishda “Add to PATH” ni belgilang; `python --version` bilan tekshiring.
- Birinchi dastur: `print("Salom, dunyo!")`.
- `#` bilan izoh yoziladi; izohlar kodni tushunarli qiladi.

## Mashqlar

**Oson**

1. `print` yordamida o‘zingizning ism-familiyangizni ikki alohida qatorda chiqaring.
2. Yoshingizni son sifatida chiqaring (qo‘shtirnoqsiz): `print(20)`.

**O‘rtacha**

3. Uch qatorli “tashrif qog‘ozi” chiqaring: ism, kasb, shahar.
4. `print(10 * 5)` yozing va natijani taxmin qiling, keyin ishga tushirib tekshiring.

**Fikrlash**

5. `print("2 + 3")` va `print(2 + 3)` — natijalari nega har xil? (Qo‘shtirnoq nimani anglatadi?)

**Xatoni top**

6. Bu kodda 2 ta xato bor, toping va tuzating:
```python
print(Salom, dunyo!)
Print("Ishladi")
```

## Test

<details>
<summary>1. Python fayli qanday kengaytma bilan saqlanadi?</summary>
<code>.py</code>
</details>

<details>
<summary>2. `#` belgisi nima uchun?</summary>
Izoh (comment) yozish uchun — undan keyingi matn bajarilmaydi.
</details>

<details>
<summary>3. O‘rnatishda qaysi katakchani belgilash muhim?</summary>
"Add Python to PATH".
</details>

<details>
<summary>4. `print(2 + 3)` nima chiqaradi?</summary>
<code>5</code> — chunki qo‘shtirnoqsiz Python uni matematik amal deb hisoblaydi.
</details>

## Keyingi dars

[O‘zgaruvchilar va ma’lumot turlari](/courses/python-noldan/ozgaruvchilar-va-turlar) — endi ma’lumotni saqlashni o‘rganamiz.
