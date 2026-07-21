## Bu darsda nimalarni o‘rganamiz

- **Ollama** bilan ochiq modellarni lokal ishlatish.
- **Kvantlash** va sifat/hajm/tezlik murosasi.
- Ollama’ning **OpenAI-mos** endpointi bilan mavjud kodni qayta ishlatish.
- Qachon lokal bulutdan afzal — va qachon emas.

## Oldindan nima bilish kerak

[Provayder API’lari](/courses/ai-python/provider-apis). Bir necha GB RAM’li mashina (GPU yordam beradi, lekin kichik modellar uchun shart emas).

## Asosiy g‘oya — bir jumlada

> Ollama — “LLM’lar uchun Docker”: `ollama run llama3.2` modelni yuklab, uni mashinangizда lokal HTTP API ortida xizmat qiladi — kalitsiz, token bo‘yicha to‘lovsiz, ma’lumot chiqmasdan.

**Hayotiy o‘xshatish — mashina egasi vs taksi.** Bulut API’lari — taksi: nol boshlang‘ich narx, har safar to‘laysiz, mashinani boshqa kimdir saqlaydi va haydovchi qayerга borishingizni ko‘radi. Lokal model — o‘z mashinangiz: qat’iy narx, cheksiz maxfiy safarlar, lekin apparatni sotib olasiz va u Formula-1 emas.

## Boshlash

```bash
ollama pull llama3.2          # modelni bir marta yuklab olish
ollama run llama3.2           # terminalда interaktiv chat
ollama list                   # lokal nima bor
```

Ollama `localhost:11434` da HTTP API xizmat qiladi:

```python
import requests
r = requests.post("http://localhost:11434/api/generate",
    json={"model": "llama3.2", "prompt": "RAG'ни bir jumlada tushuntir.", "stream": False})
print(r.json()["response"])
```

## Mavjud kodни qayta ishlatish: OpenAI-mos endpoint

Asosiy imkoniyat: Ollama **OpenAI-mos** API ochadi, shuning uchun o‘tgan darsdagi provayderdan mustaqil klientingiz o‘zgarmasdan ishlaydi — faqat baza URL’ini Ollama’ga qarating.

```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")  # kalit e'tiborsiz
r = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "Salom"}],
)
print(r.choices[0].message.content)
```

Ya’ni bepul lokal modelга qarshi ishlab chiqib, prod uchun bulut modelга baza URL va modelни o‘zgartirib o‘tishingiz mumkin — bir xil kod.

## Kvantlash — hajm/sifat tugmasi

Ochiq modellar **kvantlangan** shakllarда keladi: og‘irliklar past aniqlikда (masalan 4-bit `Q4`) saqlanadi, xotira va tezlikни yaxshilaydi, biroz sifat evaziga.

| Kvant | Taxminiy hajm (7B) | Sifat | Uchun |
|---|---|---|---|
| `Q8` | ~8 GB | Eng yuqori | RAM/VRAM bor |
| `Q4` | ~4 GB | Juda yaxshi | Keng tarqalgan standart |
| `Q2` | ~3 GB | Sezilarli pasaygan | Oxirgi chora |

Qoida: xotiraга qulay sig‘adigan eng katta model va eng yuqori kvantni tanlang.

## Qachon lokal bulutdan afzal — va qachon emas

| **Lokalni** afzal ko‘ring | **Bulutни** afzal ko‘ring |
|---|---|
| Maxfiy ma’lumot chiqmasligi kerak | Eng yaxshi sifat kerak |
| Yuqori, barqaror hajm | Notekis/kam hajm |
| Oflayn / izolyatsiyalangan muhit | Kichik jamoa, infra istagi yo‘q |

> [!NOTE]
> Keng tarqalgan ishlab chiqarish naqshi — **gibrid**: arzon, yuqori-hajmli, maxfiy qadamlar (tasnif, PII tozalash, embedding) uchun kichik lokal model, qiyin yakuniy javob uchungina bulut modeli.

## Keng tarqalgan xatolar

1. **7B lokal modeldan cho‘qqi sifatни kutish** — u yaxshi, GPT darajasida emas.
2. **RAM/VRAM chegaralarини e’tiborsiz qoldirish** — katta model diskga swap qilib sudraladi.
3. **Kontekst oynasi ham xotira yeyishini unutish.**
4. **Yuk-testsiz lokalni prod deb jo‘natish** — bitta mashinaning o‘tkazuvchanlik cheki bor.

## Xulosa

- Ollama ochiq modellarni lokal ishlatishни `ollama run` kabi oson qiladi.
- Uning OpenAI-mos endpointi mavjud klientingizни o‘zgarmasdan ishlatadi.
- Kvantlash hajm/tezlikни biroz sifatга almashtiradi — sig‘adigan eng kattasini tanlang.
- Maxfiylik/hajm/oflayn uchun lokal; cho‘qqi sifat va nol-ops uchun bulut; gibrid ko‘pincha yutadi.

## Mashqlar

**Oson**

1. Kichik model yuklab, terminalда, keyin Python’dagi HTTP API orqali chat qiling.
2. OpenAI klientingizning `base_url` ini Ollama’ga qaratib, bulut provayder uchun ishlatgan kodni ishga tushiring.

**O‘rtacha**

3. `LLM` adapteringizni OpenAI-mos endpoint bilan `"ollama"` provayderi bilan kengaytiring.
4. `Q4` vs `Q8` modelni bir xil 5 promptда solishtiring.

**Advanced**

5. Gibrid quvurни loyihalang: lokal model PII tozalab tasniflaydi, bulut model javob beradi.

**Mini loyiha**

Ollama’ga qarshi to‘liq oflayn ishlaydigan, suhbat tarixini saqlaydigan va `/model <nom>` bilan model almashtirishга imkon beradigan `local_chat.py` CLI quring.

## Test

<details>
<summary>1. Ollama standart qaysi portда xizmat qiladi?</summary>
localhost:11434, /v1 ostida OpenAI-mos API bilan.
</details>

<details>
<summary>2. Kvantlash nimani almashtiradi?</summary>
Xotira va tezlikні biroz sifat yo‘qotishига (past aniqlikli og‘irliklar).
</details>

<details>
<summary>3. Nega OpenAI-mos endpoint foydali?</summary>
Mavjud OpenAI-SDK kodi faqat base_url va modelни o‘zgartirib lokal modellarда ishlaydi.
</details>

<details>
<summary>4. Lokalni bulutdan afzal ko‘rishning bir sababi?</summary>
Ma’lumot maxfiyligi — hech narsa mashinangizdan chiqmaydi; shuningdek yuqori hajm yoki oflayn.
</details>

## Keyingi dars

[Streaming va Async AI Ilovalari](/courses/ai-python/streaming-and-async).
