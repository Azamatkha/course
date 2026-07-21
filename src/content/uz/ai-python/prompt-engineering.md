## Bu darsda nimalarni o‘rganamiz

- **System vs user vs assistant** xabarlarini ataylab ishlatish.
- Few-shot misollar, chain-of-thought va delimiterlar bilan chiqishni boshqarish.
- F-string chalkashligi o‘rniga qayta ishlatiladigan **prompt shablonlar**i qurish.
- Promptlarni kod kabi ko‘rish: versiyalash va baholash.

## Oldindan nima bilish kerak

[LLM’lar Aslida Qanday Ishlaydi](/courses/ai-python/llm-fundamentals).

## Asosiy g‘oya — bir jumlada

> Prompt muhandisligi — **ehtimolli funksiya uchun interfeys dizayni**: kirishni shakllantirib, chiqishlar taqsimotini xohlagan joyga tushirasiz.

**Hayotiy o‘xshatish — birinchi kunда yangi zo‘r xodimni yo‘riqlash.** U aqlli, lekin kontekstingizni bilmaydi. Noaniq ko‘rsatmalar (“chiptalarni bajar”) noaniq natija beradi. Aniq brief — rol, maqsad, cheklovlar, yaxshi natija misoli va noaniqlikда nima qilish — professional ish beradi. Prompt — o‘sha brief.

## Xabar rollari

```python
messages = [
    {"role": "system", "content": "Sen qisqa SQL yordamchisisan. Faqat SQL chiqar, izohsiz."},
    {"role": "user", "content": "O'tgan hafta ro'yxatdan o'tgan foydalanuvchilar."},
    {"role": "assistant", "content": "SELECT * FROM users WHERE created_at >= NOW() - INTERVAL '7 days';"},
    {"role": "user", "content": "Endi faqat emaillarini."},
]
```

- **system** — barqaror brief: rol, qoidalar, format, ohang. Bir marta o‘rnatiladi.
- **user** — shu qadam uchun so‘rov.
- **assistant** — modelning oldingi javoblari (va foydali tarzda, naqshni ko‘rsatish uchun ekilgan misollar).

## Usullar, oddiydan murakkabga

### 1. Aniq va tuzilmali bo‘ling

```text
YOMON:  "Buni umumlashtir."
YAXSHI: "Quyidagi matnni 3 punktда umumlashtir, har biri 15 so'zdan kam,
         harakat bandlariga qaratilgan. Matn: <<<{text}>>>"
```

Delimiterlar (`<<< >>>`, uch backtick, XML teglar) modelга ma’lumot qayerda boshlanib tugashini aniq aytadi — va ko‘p prompt-injection urinishini to‘mtoqlashtiradi.

### 2. Few-shot: aytmang, ko‘rsating

```text
Sentimentни POSITIVE/NEGATIVE/NEUTRAL deb tasnifla.
Review: "Tez yetkazib berish, yoqdi" -> POSITIVE
Review: "Bir kunda buzildi" -> NEGATIVE
Review: "{input}" ->
```

Ikki-uch misol ko‘pincha paragraf tasvirdan yaxshiroq.

### 3. Chain-of-thought (mulohaza kerak bo‘lganда)

Modelдан javobdan oldin qadamma-qadam ishlashini so‘rang. Bu ko‘p-qadamli mulohazani chindan yaxshilaydi — lekin token yeydi va doim foydalanuvchiga ko‘rsatilmasligi kerak.

> [!NOTE]
> Ajratish/tasniflash uchun *aksincha* — mulohazasiz, faqat yorliq, temperature 0 da. Chain-of-thought chindan ko‘p-qadamli muammolar uchun.

### 4. Rol va cheklovlar bering

“Sen katta Python reviewerisan. Faqat to‘g‘rilik xatolari va xavfsizlikни belgila. Uslubни e’tiborsiz qoldir.” Rollar + aniq *istisnolar* sifatni sifatlardan ko‘ra o‘tkirlashtiradi.

## Shablonlar, f-string chalkashligi emas

```python
from string import Template

SUMMARIZE = Template(
    "Quyidagi $doc_type ni $audience uchun $n punktда umumlashtir.\n\n"
    "```\n$text\n```"
)

def build(text, *, doc_type="hujjat", n=3, audience="band rahbar"):
    return SUMMARIZE.substitute(doc_type=doc_type, n=n, audience=audience, text=text)
```

Endi promptlar testlanadigan, diff qilinadigan va qayta ishlatiladigan.

## Promptlar — kod; ularni baholang

Havaskor harakat — bitta misol yaxshi ko‘ringuncha promptni to‘g‘rilash. Professional harakat — kichik **eval to‘plami**:

```python
cases = [
    {"input": "Bir kunda buzildi", "expect": "NEGATIVE"},
    {"input": "O'rtacha", "expect": "NEUTRAL"},
]

def score(prompt_fn):
    ok = sum(prompt_fn(c["input"]).strip() == c["expect"] for c in cases)
    return ok / len(cases)
```

Promptni o‘zgartir → eval’ni qayta ishlat → ball yaxshilansagina saqla.

## Keng tarqalgan xatolar

1. **Noaniq so‘rovlar** — “yaxshiroq qil” nishonsiz.
2. **Chiqish formati yo‘q** — keyin chiqish o‘zgaruvchan deb shikoyat.
3. **Model bajarolmaydigan qoidalar** (“aynan 47 so‘zda javob ber”).
4. **Ishonchsiz foydalanuvchi matnini ko‘rsatmalar joyiga qo‘yish** — injection xavfi.
5. **Bitta misolда sozlash** — bir kirishга overfit.

## Xulosa

- Rollarni ataylab ishlating; system xabari har javobни ramkalaydi.
- Aniqlik, delimiterlar, few-shot va (kerak bo‘lganда) chain-of-thought chiqishni boshqaradi.
- Promptlarni shablon sifatida markazlashtiring — testlanadigan va versiyalanadigan.
- Prompt o‘zgarishlarini to‘plamga qarshi baholang — promptlarni kod deb qarang.

## Mashqlar

**Oson**

1. “bu maqolani umulashtir” ni aniq, format-cheklangan, delimiterli promptga qayta yozing.
2. Tasnif qoidalari paragrafini 3-misolli few-shot promptga aylantiring.

**O‘rtacha**

3. `PromptTemplate` yordamchisi qurib, xuddi shu prompt’ni ikki auditoriya uchun render qiling.
4. Tasnifchi uchun 5-holatli eval to‘plami va `score()` yozing; ikki system promptni sinang.

**Advanced**

5. Qo‘llab-quvvatlash agenti uchun mavzuda qoladigan, hech qachon to‘lov va’da qilmaydigan, siyosatni iqtibos qiladigan tizim promptini loyihalang. Uch adversarial kirish bilan sinang.

**Mini loyiha**

Prompt variantlarni fayllardan yuklab, har birini eval to‘plamiga qarshi ishlatib, leaderboard (aniqlik, o‘rtacha token) chop etadigan `prompt_lab.py` quring.

## Test

<details>
<summary>1. System xabariga nima kiradi?</summary>
Barqaror ramka: rol, qoidalar, chiqish formati va ohang — har qadamга tegishli bo‘lishi kerak bo‘lgan hamma narsa.
</details>

<details>
<summary>2. Nega kiritilgan ma’lumot atrofида delimiter ishlatiladi?</summary>
Ular ma’lumot qayerda boshlanib/tugashini belgilaydi, ishonchlilikni oshiradi va prompt injection’ni to‘mtoqlashtiradi.
</details>

<details>
<summary>3. Chain-of-thought’dan qachon qochish kerak?</summary>
Oddiy ajratish/tasniflash — faqat javob, temperature 0 da, token-qimmat mulohaza emas.
</details>

<details>
<summary>4. Prompt o‘zgarishini qanday tasdiqlaysiz?</summary>
Ikkala versiyani eval to‘plamiga qarshi ishlating va faqat o‘lchangan ball yaxshilansagina saqlang.
</details>

## Keyingi dars

[Strukturaviy Chiqishlar va Function Calling](/courses/ai-python/structured-outputs-and-tools).
