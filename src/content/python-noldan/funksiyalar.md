## Bu darsda nimalarni o‘rganamiz

- Funksiya nima va nega kerak.
- Funksiya yozish (`def`), chaqirish va argumentlar.
- `return` bilan natija qaytarish.
- Standart qiymatlar va bir nechta argument.

## Oldindan nima bilish kerak

[Satrlar](/courses/python-noldan/satrlar), [Shartlar](/courses/python-noldan/shartlar) va [Sikllar](/courses/python-noldan/sikllar).

## Asosiy g‘oya — bir jumlada

> **Funksiya** — bir marta yozib, **ko‘p marta ishlatiladigan** kod bo‘lagi. Unga nom berasiz, keyin shu nom bilan chaqirasiz.

**Hayotiy o‘xshatish — retsept.** Bir marta “tort retsepti” ni yozib qo‘yasiz. Keyin har safar tort kerak bo‘lganda retseptni qaytadan yozmaysiz — shunchaki “tort retsepti” ni ishlatasiz. Funksiya ham shunday: kodni bir marta yozasiz, keyin nomi bilan istagancha chaqirasiz. Ba’zi retseptlarga masalliq berasiz (argument) va ular natija qaytaradi (tort).

## Nega funksiya kerak?

Tasavvur qiling, uch joyda salomlashish kerak:

```python
# Funksiyasiz — takror-takror yozamiz (yomon)
print("Salom! Xush kelibsiz.")
print("Salom! Xush kelibsiz.")
print("Salom! Xush kelibsiz.")
```

Funksiya bilan bir marta yozamiz:

```python
def salomlash():
    print("Salom! Xush kelibsiz.")

salomlash()      # chaqiramiz
salomlash()      # yana
salomlash()      # yana
```

Agar matnni o‘zgartirmoqchi bo‘lsangiz — **bitta** joyda o‘zgartirasiz, hamma joyda yangilanadi. Bu **DRY** (Don't Repeat Yourself — takrorlamang) tamoyili.

## Funksiya yozish (`def`)

```python
def funksiya_nomi():
    # ichkaridagi kod (indentatsiya bilan)
    print("Ishladi")
```

- `def` — “funksiya aniqlayman” degani.
- `funksiya_nomi()` — nom va qavs.
- `:` va ichkariga surilgan kod.

Funksiyani **yozish** (`def`) uni **ishga tushirmaydi** — u faqat “retseptni saqlaydi”. Ishlashi uchun **chaqirish** kerak: `funksiya_nomi()`.

## Argumentlar — funksiyaga ma’lumot berish

Ko‘pincha funksiyaga qiymat berish kerak:

```python
def salomlash(ism):
    print(f"Salom, {ism}!")

salomlash("Ali")     # Salom, Ali!
salomlash("Vali")    # Salom, Vali!
```

`ism` — bu **parametr** (qutiga o‘xshaydi). `"Ali"` — chaqirishda beriladigan **argument**. Bir nechta bo‘lishi mumkin:

```python
def tanishtir(ism, yosh):
    print(f"{ism}, {yosh} yosh")

tanishtir("Ali", 20)     # Ali, 20 yosh
```

Tartib muhim — birinchi argument birinchi parametrga tushadi.

## `return` — natija qaytarish

`print` ekranga chiqaradi. `return` esa natijani **qaytaradi**, keyin uni ishlatishingiz mumkin:

```python
def qoshish(a, b):
    return a + b

natija = qoshish(3, 5)     # natija = 8
print(natija * 2)          # 16 — natijani ishlatamiz
```

> [!IMPORTANT]
> `print` va `return` — bu **ikki xil narsa!** `print` faqat ekranga ko‘rsatadi. `return` qiymatni chaqirgan joyga qaytaradi, uni saqlab, keyin ishlatasiz. Hisob-kitob funksiyalari deyarli doim `return` ishlatadi.

`return` bajarilishi bilan funksiya **tugaydi**:

```python
def tekshir(yosh):
    if yosh >= 18:
        return "Katta"
    return "Kichik"        # faqat yuqoridagi return ishlamasa

print(tekshir(20))         # Katta
```

## Standart qiymatlar

Parametrga standart qiymat berish mumkin — chaqirishda berilmasa, o‘sha ishlatiladi:

```python
def salomlash(ism, gap="Salom"):
    print(f"{gap}, {ism}!")

salomlash("Ali")               # Salom, Ali!
salomlash("Vali", "Xayrli tong")  # Xayrli tong, Vali!
```

## Funksiya ichida o‘zgaruvchilar (scope)

Funksiya ichida yaratilgan o‘zgaruvchi faqat **shu funksiya ichida** yashaydi:

```python
def hisobla():
    x = 10          # faqat funksiya ichida mavjud
    return x

hisobla()
# print(x)          # XATO! x tashqarida yo'q
```

Bu yaxshi narsa — har bir funksiya o‘z “xonasi”da ishlaydi, bir-biriga xalaqit bermaydi.

## To‘liq misol

```python
def salom_hisobot(ism, xaridlar):
    """Foydalanuvchiga xaridlar hisobotini qaytaradi."""   # izoh (docstring)
    jami = sum(xaridlar)
    return f"{ism}, jami xaridingiz: {jami} so'm"

xabar = salom_hisobot("Ali", [1000, 2500, 3000])
print(xabar)     # Ali, jami xaridingiz: 6500 so'm
```

Uch qo‘shtirnoqli izoh (`"""..."""`) — **docstring**, funksiya nima qilishini tushuntiradi. Yaxshi odat.

## Keng tarqalgan xatolar

1. **Funksiyani chaqirishni unutish** — `def` yozib, `salomlash()` ni yozmaslik → hech narsa bo‘lmaydi.
2. **`return` o‘rniga `print`** — natijani keyin ishlatolmaysiz; hisob-kitobda `return` ishlating.
3. **`return` dan keyingi kod** — `return` funksiyani tugatadi, undan keyingi qatorlar ishlamaydi.
4. **Argument tartibini chalkashtirish** — `tanishtir(20, "Ali")` noto‘g‘ri natija beradi.
5. **Funksiya ichidagi o‘zgaruvchiga tashqaridan murojaat** — u faqat ichida mavjud.

## Xulosa

- Funksiya — bir marta yoziladigan, ko‘p marta chaqiriladigan kod bo‘lagi (DRY).
- `def nom(parametrlar):` bilan yoziladi, `nom(argumentlar)` bilan chaqiriladi.
- `return` natijani qaytaradi (≠ `print`), uni keyin ishlatasiz.
- Standart qiymatlar va scope funksiyani kuchli va xavfsiz qiladi.

## Mashqlar

**Oson**

1. `salomlash(ism)` funksiyasini yozing va uni uch xil ism bilan chaqiring.
2. `kvadrat(son)` funksiyasini yozing — sonning kvadratini **qaytarsin** (`return`) va natijani chiqaring.

**O‘rtacha**

3. `katta_kichik(a, b)` funksiyasi ikki sondan kattasini qaytarsin.
4. `o'rtacha(sonlar)` funksiyasi ro‘yxatning o‘rtacha qiymatini qaytarsin.

**Fikrlash**

5. `return` va `print` farqini o‘z so‘zingiz bilan tushuntiring. Qaysi biri natijani keyin ishlatishga imkon beradi?

**Xatoni top**

6. Nega bu hech narsa chiqarmaydi? Tuzating:
```python
def salom():
    print("Salom")
```

**Mini loyiha**

Oddiy “kalkulyator” funksiyalari yozing: `qoshish`, `ayirish`, `kopaytirish`, `bolish` — har biri `return` bilan natija qaytarsin. So‘ng foydalanuvchidan ikki son va amal so‘rab, mos funksiyani chaqiring va natijani chiqaring. Nolga bo‘lishni tekshiring.

## Test

<details>
<summary>1. Funksiyani qanday yozamiz va qanday chaqiramiz?</summary>
Yozish: <code>def nom():</code>. Chaqirish: <code>nom()</code>.
</details>

<details>
<summary>2. `return` va `print` farqi?</summary>
<code>print</code> ekranga ko‘rsatadi; <code>return</code> qiymatni qaytaradi, uni keyin saqlab ishlatasiz.
</details>

<details>
<summary>3. Parametr va argument nima?</summary>
Parametr — funksiya ta’rifidagi "quti" nomi; argument — chaqirishda beriladigan haqiqiy qiymat.
</details>

<details>
<summary>4. Standart qiymat nima uchun?</summary>
Argument berilmasa ishlatiladigan qiymat — funksiyani moslashuvchan qiladi.
</details>

## Keyingi dars

[Modullar va kutubxonalar](/courses/python-noldan/modullar-kutubxonalar) — boshqalar yozgan koddan foydalanamiz.
