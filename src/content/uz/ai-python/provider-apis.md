## Bu darsda nimalarni o‘rganamiz

- OpenAI, Anthropic va Gemini API’lari **umumiy shakli**ni tanish.
- Auth, parametrlar, xatolar, retry va rate-limitlarni ishonchli boshqarish.
- Model almashtirish bir qatorlik o‘zgarish bo‘lishi uchun **provayderdan mustaqil klient** yozish.

## Oldindan nima bilish kerak

[Strukturaviy Chiqishlar va Asboblar](/courses/ai-python/structured-outputs-and-tools).

## Asosiy g‘oya — bir jumlada

> Har chat API ostda bir xil: rol-teglangan xabarlar ro‘yxati + parametrlarni yuboring, xabar + token sarfini oling. Shaklni bir marta o‘rganing; SDK’lar — dialektlar.

**Hayotiy o‘xshatish — uch aviakompaniya, bitta safar.** OpenAI, Anthropic va Gemini — biroz boshqacha bron saytlariga ega turli aviakompaniyalar, lekin safar bir xil: yo‘lovchilarni (xabarlar) va afzalliklarni (temperature, max tokens) berasiz, parvoz (javob) va chek (usage) olasiz. Ularni bitta “safar bron qil” funksiyasi ortiga o‘rang.

## Uchtasi yonma-yon

```python
# OpenAI
from openai import OpenAI
r = OpenAI().chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Salom"}],
    temperature=0.7,
)
print(r.choices[0].message.content, r.usage.total_tokens)

# Anthropic
from anthropic import Anthropic
r = Anthropic().messages.create(
    model="claude-sonnet-4-5",          # system alohida arg, xabar emas
    system="Sen qisqasan.",
    messages=[{"role": "user", "content": "Salom"}],
    max_tokens=1024,                     # majburiy
)
print(r.content[0].text)

# Gemini
from google import genai
r = genai.Client().models.generate_content(model="gemini-2.0-flash", contents="Salom")
print(r.text)
```

Odamlarni chalkashtiradigan farqlar:

| | OpenAI | Anthropic | Gemini |
|---|---|---|---|
| System prompt | xabar | alohida `system` arg | `system_instruction` |
| `max_tokens` | ixtiyoriy | **majburiy** | ixtiyoriy |
| Javob matni | `choices[0].message.content` | `content[0].text` | `.text` |

## Auth va sozlash

Kalitlar muhit o‘zgaruvchilaridан keladi — **hech qachon kodга yozmang**:

```python
import os
assert os.getenv("OPENAI_API_KEY"), "kalitni muhit / .env da o'rnating"
```

Dev’da `.env` (`python-dotenv`), prod’da sir boshqaruvidan yuklang. Sizib chiqqan kalit — real moliyaviy hodisa; oshkor bo‘lsa darrov almashtiring.

## Xatolar, retry va rate-limitlar

API’lar vaqtinchalik ishlamaydi: rate-limit (429), timeout, 5xx. *Vaqtinchalik* xatolarда eksponensial backoff bilan retry qiling:

```python
import time, random
def with_retry(fn, *, attempts=5):
    for i in range(attempts):
        try:
            return fn()
        except RateLimitError:                 # provayder-maxsus klass
            if i == attempts - 1:
                raise
            time.sleep(min(2 ** i + random.random(), 30))   # backoff + jitter
        # 4xx (invalid_request) ni RETRY QILMANG — bu xato, blip emas.
```

Ko‘p SDK’da o‘rnatilgan retry bor (`max_retries=`) — qайta ixtiro qilmang.

## Provayderdan mustaqil klient

Dialektni bir interfeys ortiga yashiring:

```python
from dataclasses import dataclass

@dataclass
class Reply:
    text: str
    input_tokens: int
    output_tokens: int

class LLM:
    def __init__(self, provider="openai", model=None):
        self.provider, self.model = provider, model

    def chat(self, messages, **kw) -> Reply:
        if self.provider == "openai":
            r = OpenAI().chat.completions.create(
                model=self.model or "gpt-4o-mini", messages=messages, **kw)
            return Reply(r.choices[0].message.content,
                         r.usage.prompt_tokens, r.usage.completion_tokens)
        if self.provider == "anthropic":
            system = next((m["content"] for m in messages if m["role"] == "system"), None)
            user_msgs = [m for m in messages if m["role"] != "system"]
            r = Anthropic().messages.create(
                model=self.model or "claude-sonnet-4-5",
                system=system, messages=user_msgs, max_tokens=kw.get("max_tokens", 1024))
            return Reply(r.content[0].text, r.usage.input_tokens, r.usage.output_tokens)
        raise ValueError(self.provider)
```

Endi `LLM("anthropic").chat(...)` va `LLM("openai").chat(...)` almashtiriladigan.

## Keng tarqalgan xatolar

1. **Kalitlarni qotirish** — git va loglarга sizadi. Muhit o‘zgaruvchilari.
2. **Vaqtinchalik bo‘lmagan xatolarни retry** — 400 abadiy muvaffaqiyatsiz.
3. **Timeout yo‘q** — osilib qolgan so‘rov butun servisni to‘xtatadi.
4. **`usage` ni e’tiborsiz qoldirish** — o‘lchamagan xarajatni boshqarolmaysiz.
5. **Biznes mantiqni bitta SDK javob shakliga bog‘lash** — o‘rang.

## Xulosa

- Uchtasi bir fikrlash modelini bo‘lishadi; farqlar asosan system prompt va usage joyida.
- Auth muhit o‘zgaruvchilari orqali; vaqtinchalik xatolarни backoff bilan retry; doim timeout.
- Provayderlarni ingichka klient ortiga o‘rab, model almashtirishни arzon va xarajatni o‘lchanadigan qiling.

## Mashqlar

**Oson**

1. Ikki provayderни bir xil prompt bilan chaqirib, har javob va token sarfini chop eting.
2. Qotirilgan kalitni `.env` ga ko‘chirib yuklang; kalit kodда hech qachon ko‘rinmasligini tasdiqlang.

**O‘rtacha**

3. `with_retry` ni amalga oshirib, u simulyatsiya 429 ni retry, 400 ни yo‘q qilishini isbotlang.
4. `LLM` adapterini uchinchi provayderга (Gemini) kengaytiring, `Reply` shakli bir xil qolsin.

**Advanced**

5. Oddiy promptларга arzon, qiyinларга kuchli model tanlaydigan “model router” loyihalang.

**Mini loyiha**

≥2 provayder, retry, timeout va har chaqiruv xarajat logi bilan ishlab chiqarishга tayyor adapter `llm_client.py` quring.

## Test

<details>
<summary>1. Anthropic’ning system prompti qayerga boradi?</summary>
Xabarlar ro‘yxati ichida emas, alohida `system` argumentга.
</details>

<details>
<summary>2. Qaysi xatolarни retry qilish kerak?</summary>
Vaqtinchalik — 429, timeout, 5xx — backoff bilan. 4xx so‘rov xatolarини emas.
</details>

<details>
<summary>3. Nega provayderlarни interfeys ortига o‘raysiz?</summary>
Model almashtirish qayta yozish emas, konfiguratsiya o‘zgarishi bo‘lsin va xarajat logi bir joyда yashasin.
</details>

<details>
<summary>4. API kalitlari qayerga tegishli?</summary>
Muhit o‘zgaruvchilari yoki sir boshqaruvi — hech qachon kodда qotirilmaydi.
</details>

## Keyingi dars

[Lokal LLM’lar Ollama bilan](/courses/ai-python/local-llms-ollama).
