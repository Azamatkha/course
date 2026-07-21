## Learning objectives

- Recognize the **common shape** shared by OpenAI, Anthropic, and Gemini APIs.
- Handle auth, parameters, errors, retries, and rate limits robustly.
- Write a thin **provider-agnostic client** so switching models is a one-line change.

## Prerequisites

[Structured Outputs & Tools](/courses/ai-python/structured-outputs-and-tools). Basic `async` awareness helps for the next lesson.

## The core idea in one line

> Every chat API is the same underneath: send a list of role-tagged messages + parameters, get back a message + token usage. Learn the shape once; the SDKs are dialects.

**Analogy — three airlines, one trip.** OpenAI, Anthropic, and Gemini are different airlines with slightly different booking sites, but the journey is identical: you provide passengers (messages) and preferences (temperature, max tokens), and you receive a flight (response) and a receipt (usage). Wrap them behind one "book a trip" function and your app stops caring which airline it flew.

## The three, side by side

```python
# OpenAI
from openai import OpenAI
r = OpenAI().chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hi"}],
    temperature=0.7,
)
print(r.choices[0].message.content, r.usage.total_tokens)

# Anthropic
from anthropic import Anthropic
r = Anthropic().messages.create(
    model="claude-sonnet-4-5",          # system is a separate arg, not a message
    system="You are concise.",
    messages=[{"role": "user", "content": "Hi"}],
    max_tokens=1024,                     # required
)
print(r.content[0].text, r.usage.input_tokens + r.usage.output_tokens)

# Gemini
from google import genai
r = genai.Client().models.generate_content(
    model="gemini-2.0-flash", contents="Hi",
)
print(r.text)
```

Differences that trip people up:

| | OpenAI | Anthropic | Gemini |
|---|---|---|---|
| System prompt | a message | separate `system` arg | `system_instruction` |
| `max_tokens` | optional | **required** | optional |
| Response text | `choices[0].message.content` | `content[0].text` | `.text` |
| Usage field | `usage.total_tokens` | `input`/`output_tokens` | `usage_metadata` |

## Auth and configuration

Keys come from environment variables — **never hardcode them**:

```python
import os
# OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY read automatically by SDKs
assert os.getenv("OPENAI_API_KEY"), "set your key in the environment / .env"
```

Load from a `.env` in dev (`python-dotenv`), from a secrets manager in prod. A leaked key is a real financial incident — rotate immediately if exposed.

## Errors, retries, and rate limits

APIs fail transiently: rate limits (429), timeouts, and 5xx. Retry with **exponential backoff** on *transient* errors only:

```python
import time, random

def with_retry(fn, *, attempts=5):
    for i in range(attempts):
        try:
            return fn()
        except RateLimitError:                 # provider-specific class
            if i == attempts - 1:
                raise
            sleep = min(2 ** i + random.random(), 30)   # backoff + jitter
            time.sleep(sleep)
        # Do NOT retry 4xx like invalid_request — that's a bug, not a blip.
```

Most SDKs have built-in retries (`max_retries=`) — configure them rather than reinventing, but understand what they do.

## A thin provider-agnostic client

Hide the dialect behind one interface so the rest of your app is portable:

```python
from dataclasses import dataclass

@dataclass
class Reply:
    text: str
    input_tokens: int
    output_tokens: int

class LLM:
    def __init__(self, provider: str = "openai", model: str | None = None):
        self.provider, self.model = provider, model

    def chat(self, messages: list[dict], **kw) -> Reply:
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

Now `LLM("anthropic").chat(...)` and `LLM("openai").chat(...)` are interchangeable — you can switch for cost or quality without touching business logic. This is the client the rest of the course assumes.

## Common mistakes

1. **Hardcoding keys** — leaks into git and logs. Use env vars.
2. **Retrying non-transient errors** — a 400 invalid request will fail forever; fix the request.
3. **No timeout** — a hung request can stall your whole service. Always set one.
4. **Ignoring `usage`** — you can't control cost you don't measure.
5. **Coupling business logic to one SDK's response shape** — wrap it.

## Performance & cost

- Reuse a single client instance (connection pooling) rather than constructing per call.
- Set sensible `max_tokens` and `timeout`; unbounded outputs are unbounded bills.
- Log `usage` per call and aggregate — it's the raw material for the cost lesson.

## Interview questions

1. **"What's common across chat APIs?"** — Role-tagged messages + params in; a message + token usage out.
2. **"How do you handle rate limits?"** — Exponential backoff with jitter on transient errors (429/5xx/timeouts), not on 4xx bugs.
3. **"How do you keep an app provider-agnostic?"** — A thin adapter interface returning a normalized reply; business code depends on the interface, not the SDK.
4. **"Where do API keys live?"** — Environment variables / secrets manager, never in code or logs.

## Summary

- The big three share one mental model; differences are mostly where the system prompt and usage fields live.
- Auth via env vars; retry transient errors with backoff; always set timeouts.
- Wrap providers behind a thin client so switching models is trivial and cost is measurable.

## Exercises

**Easy**

1. Call two providers with the same prompt and print each reply plus token usage.
2. Move a hardcoded key into a `.env` and load it; confirm the key never appears in code.

**Intermediate**

3. Implement `with_retry` and prove it retries a simulated 429 but not a simulated 400.
4. Extend the `LLM` adapter to a third provider (Gemini), keeping the `Reply` shape identical.

**Advanced / architecture**

5. Design a "model router" that picks a cheap model for simple prompts and a strong one for hard prompts, all behind the `LLM` interface. What signal decides?

**Debugging**

6. An app intermittently crashes with `KeyError` reading responses after switching from OpenAI to Anthropic. Explain the root cause and how the adapter prevents it.

**Mini project**

Build `llm_client.py`: a production-ready adapter supporting ≥2 providers, retries, timeouts, and per-call cost logging (tokens × configured rates). Export a single `chat()` the rest of your projects import.

## Quiz

<details>
<summary>1. Where does Anthropic's system prompt go?</summary>
In a separate `system` argument, not inside the messages list.
</details>

<details>
<summary>2. Which errors should you retry?</summary>
Transient ones — 429, timeouts, 5xx — with backoff. Not 4xx request errors.
</details>

<details>
<summary>3. Why wrap providers behind an interface?</summary>
So switching models for cost/quality is a config change, not a rewrite, and cost logging lives in one place.
</details>

<details>
<summary>4. Where do API keys belong?</summary>
Environment variables or a secrets manager — never hardcoded.
</details>

## Further reading

- OpenAI, Anthropic, and Google GenAI Python SDK docs
- Your SDK's built-in retry/timeout options
- Next lesson: [Local LLMs with Ollama](/courses/ai-python/local-llms-ollama)
