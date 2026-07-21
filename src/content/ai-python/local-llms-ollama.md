## Learning objectives

- Run open-weight models locally with **Ollama**.
- Understand **quantization** and the quality/size/speed tradeoff.
- Use Ollama's **OpenAI-compatible** endpoint to reuse existing code.
- Decide when local beats cloud — and when it doesn't.

## Prerequisites

[Provider APIs](/courses/ai-python/provider-apis). A machine with a few GB of RAM (a GPU helps but isn't required for small models).

## The core idea in one line

> Ollama is "Docker for LLMs": `ollama run llama3.2` downloads a model and serves it on your machine behind a local HTTP API — no keys, no per-token bill, no data leaving your computer.

**Analogy — owning a car vs taking taxis.** Cloud APIs are taxis: zero upfront cost, you pay per ride, someone else maintains the vehicle, and the driver sees where you go. A local model is your own car: a fixed cost, unlimited private trips, but you buy the hardware and it's not a Formula-1 car. High-mileage or privacy-sensitive routes favor owning; occasional trips to the best restaurant favor the taxi.

## Getting started

```bash
# Install Ollama (ollama.com), then:
ollama pull llama3.2          # download the model once
ollama run llama3.2           # interactive chat in the terminal
ollama list                   # what you have locally
```

Ollama serves an HTTP API on `localhost:11434`:

```python
import requests
r = requests.post("http://localhost:11434/api/generate",
    json={"model": "llama3.2", "prompt": "Explain RAG in one sentence.", "stream": False})
print(r.json()["response"])
```

## Reuse your existing code: the OpenAI-compatible endpoint

The killer feature: Ollama exposes an **OpenAI-compatible** API, so your provider-agnostic client from the last lesson works unchanged — just point the base URL at Ollama.

```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")  # key ignored
r = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "Hello"}],
)
print(r.choices[0].message.content)
```

This means you can develop against a free local model and swap to a frontier cloud model for production by changing the base URL and model — same code.

## Quantization — the size/quality dial

Open models ship in **quantized** forms: weights stored at lower precision (e.g. 4-bit `Q4`) to shrink memory and speed up inference, trading a little quality.

| Quant | Rough size (7B) | Quality | Use |
|---|---|---|---|
| `Q8` | ~8 GB | Highest | You have the RAM/VRAM |
| `Q4` | ~4 GB | Very good | The common default |
| `Q2` | ~3 GB | Noticeably degraded | Last resort |

Rule of thumb: pick the largest model and highest quant that fits comfortably in memory; leave headroom for the context window (which also costs RAM).

## When local beats cloud — and when it doesn't

| Favor **local** | Favor **cloud** |
|---|---|
| Sensitive data (health, legal) must not leave | Need the absolute best quality |
| High, steady volume (per-token cost > hardware) | Spiky/low volume |
| Offline / air-gapped environments | Small team, no infra appetite |
| Full control / no vendor lock-in | Fastest time to market |

> [!NOTE]
> A common production pattern is **hybrid**: run a small local model for cheap, high-volume, privacy-sensitive steps (classification, PII redaction, embeddings) and call a frontier cloud model only for the hard final answer.

## Common mistakes

1. **Expecting frontier quality from a 7B local model** — it's good, not GPT-class. Match the model to the task.
2. **Ignoring RAM/VRAM limits** — an oversized model swaps to disk and crawls, or OOMs.
3. **Forgetting the context window costs memory too** — long prompts + a big model can exceed what small models handle.
4. **Shipping local as prod without load-testing** — one machine has a throughput ceiling; measure it.

## Performance & cost

- Local cost is **fixed** (electricity + hardware), not per token — attractive at volume, wasteful if idle.
- Throughput is bounded by your hardware; concurrency needs batching or multiple workers (e.g. vLLM for serving).
- First token latency includes model load if it was unloaded; keep hot models resident.

## Interview questions

1. **"What is Ollama?"** — A local runtime that downloads and serves open models behind a local (and OpenAI-compatible) API.
2. **"What is quantization?"** — Lower-precision weights that shrink memory and speed inference at a small quality cost.
3. **"When would you run models locally?"** — Data privacy, high sustained volume, offline needs, or avoiding lock-in.
4. **"How do you reuse cloud code with Ollama?"** — Point the OpenAI SDK's `base_url` at Ollama's `/v1` endpoint.

## Summary

- Ollama makes running open models locally as easy as `ollama run`.
- Its OpenAI-compatible endpoint lets your existing client work unchanged.
- Quantization trades size/speed for a little quality — pick the biggest that fits.
- Choose local for privacy/volume/offline; cloud for peak quality and zero ops; hybrid often wins.

## Exercises

**Easy**

1. Pull a small model and chat via the terminal, then via the raw HTTP API from Python.
2. Point your OpenAI client's `base_url` at Ollama and run the same code you used for a cloud provider.

**Intermediate**

3. Extend your `LLM` adapter with an `"ollama"` provider using the OpenAI-compatible endpoint.
4. Compare a `Q4` vs `Q8` model on the same 5 prompts; note quality and speed differences.

**Advanced / architecture**

5. Design a hybrid pipeline: local model redacts PII and classifies, cloud model answers. Where's the trust boundary, and what never leaves the machine?

**Debugging**

6. A local model is extremely slow and the machine thrashes. Diagnose likely causes (model too big for RAM, quant too high, context too long) and the fix for each.

**Mini project**

Build `local_chat.py`: a small CLI that runs entirely offline against Ollama, keeps conversation history, and lets you `/model <name>` to switch models mid-session. Reuse your provider adapter so the same file can also talk to a cloud model with a flag.

## Quiz

<details>
<summary>1. What port does Ollama serve on by default?</summary>
localhost:11434, with an OpenAI-compatible API under /v1.
</details>

<details>
<summary>2. What does quantization trade?</summary>
Memory and speed for a small loss in quality (lower-precision weights).
</details>

<details>
<summary>3. Why is the OpenAI-compatible endpoint useful?</summary>
Existing OpenAI-SDK code runs against local models by only changing base_url and model.
</details>

<details>
<summary>4. Give one reason to choose local over cloud.</summary>
Data privacy — nothing leaves your machine; also high-volume cost or offline operation.
</details>

## Further reading

- ollama.com model library and docs
- vLLM for higher-throughput local serving
- Next lesson: [Streaming & Async AI Applications](/courses/ai-python/streaming-and-async)
