## Learning objectives

- Stream tokens as they're generated with **async generators**.
- Serve streams to a browser with **Server-Sent Events (SSE)**.
- Run many model calls concurrently with `asyncio.gather`.
- Handle cancellation, backpressure, and errors in streaming code.

## Prerequisites

[Provider APIs](/courses/ai-python/provider-apis) and Python [asyncio fundamentals](/courses/python/asyncio-fundamentals).

## The core idea in one line

> Because generation is token-by-token, you can **push each token to the user the moment it's produced** instead of waiting for the whole answer — the difference between a blank screen and ChatGPT's live typing.

**Analogy — a restaurant that serves courses.** A non-streaming API is a kitchen that cooks your entire multi-course meal and brings it all at once — you stare at an empty table for 20 minutes. Streaming serves each course as it's ready: you start eating immediately, the perceived wait collapses, and the kitchen (model) works exactly as hard. Async is having *one* waiter serve many tables by never standing idle while a dish cooks.

## Why streaming matters

A 500-token answer might take 5 seconds. Non-streaming = 5 seconds of blank UI. Streaming = first word in ~300 ms, then a steady flow. Same total time, vastly better experience — and it lets users bail early on a wrong direction.

## Streaming from the provider

```python
from openai import OpenAI
client = OpenAI()

def stream(prompt: str):
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        stream=True,                      # ← the switch
    )
    for chunk in resp:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta                   # hand each token to the caller
```

```python
for token in stream("Write a haiku about async."):
    print(token, end="", flush=True)      # live typing effect
```

## Async streaming — serve many users at once

Blocking on one request while others wait wastes a server. `async` lets one process handle many concurrent streams:

```python
from openai import AsyncOpenAI
aclient = AsyncOpenAI()

async def astream(prompt: str):
    resp = await aclient.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
    )
    async for chunk in resp:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
```

## Serving a stream to the browser with SSE (FastAPI)

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.get("/chat")
async def chat(q: str):
    async def event_stream():
        async for token in astream(q):
            yield f"data: {token}\n\n"          # SSE frame
        yield "data: [DONE]\n\n"
    return StreamingResponse(event_stream(), media_type="text/event-stream")
```

The browser reads it with `EventSource` and appends tokens live. SSE is simpler than WebSockets for one-directional server→client streaming and is the standard choice for LLM UIs.

## Concurrency — run calls in parallel

To summarize 20 documents, don't `await` them one at a time (20× latency). Fan out:

```python
import asyncio

async def summarize(doc: str) -> str:
    r = await aclient.chat.completions.create(
        model="gpt-4o-mini", max_tokens=100,
        messages=[{"role": "user", "content": f"Summarize: {doc}"}])
    return r.choices[0].message.content

async def summarize_all(docs: list[str]) -> list[str]:
    sem = asyncio.Semaphore(5)                    # cap concurrency (rate limits!)
    async def guarded(d):
        async with sem:
            return await summarize(d)
    return await asyncio.gather(*(guarded(d) for d in docs))
```

The **semaphore** is essential: unbounded `gather` will blow your rate limit and hammer the provider. Cap concurrency deliberately.

## Cancellation & backpressure

- If the user closes the tab, the request is cancelled — your `async for` loop should stop and you should close the provider stream (async context managers / try/finally). Don't keep paying for tokens nobody will read.
- **Backpressure**: if the client reads slower than the model produces, the framework handles buffering, but very long streams need limits (`max_tokens`) so a runaway generation can't stall a worker.

```python
async def safe_stream(q: str):
    try:
        async for token in astream(q):
            yield token
    except asyncio.CancelledError:
        # client went away — clean up and stop billing
        raise
```

## Common mistakes

1. **Blocking calls inside async code** (`time.sleep`, sync SDK) — freezes the event loop; use async SDK + `asyncio.sleep`.
2. **Unbounded `gather`** — instant rate-limit storm; use a semaphore.
3. **Forgetting the `[DONE]` sentinel** — the client never knows the stream ended.
4. **Not handling cancellation** — you keep generating for a user who left.
5. **Streaming when you need to validate JSON** — you can't validate a partial object; buffer structured outputs, stream prose.

## Performance & cost

- Streaming doesn't reduce total tokens or cost — it improves *perceived* latency.
- Concurrency improves throughput but multiplies cost per unit time; the semaphore also protects your budget.
- Cancelling promptly on disconnect saves real tokens on abandoned requests.

## Interview questions

1. **"Why stream LLM responses?"** — Same total time, dramatically better perceived latency; users see output immediately and can bail early.
2. **"SSE vs WebSockets for LLM output?"** — SSE is simpler for one-way server→client token streams and is the common choice.
3. **"How do you run 100 model calls efficiently and safely?"** — Async + `gather` with a semaphore to cap concurrency under rate limits.
4. **"What happens on client disconnect mid-stream?"** — The task is cancelled; handle `CancelledError`, close the stream, stop generating.

## Summary

- Token-by-token generation enables streaming: push tokens as they arrive.
- Async lets one server handle many concurrent streams; SSE delivers them to browsers.
- `asyncio.gather` + a semaphore fans out work without tripping rate limits.
- Handle cancellation and don't stream things you must validate whole.

## Exercises

**Easy**

1. Convert a non-streaming call into a streaming generator and print the live typing effect.
2. Add a `[DONE]` sentinel to an SSE endpoint and consume it from a tiny JS `EventSource` (or `curl -N`).

**Intermediate**

3. Write `summarize_all` with a semaphore; measure wall-clock time vs a sequential loop over 10 docs.
4. Add cancellation handling that logs "client disconnected" when a stream is aborted.

**Advanced / architecture**

5. Design a streaming chat endpoint that also supports tool calls: how do you stream prose but pause to run a tool and resume? Sketch the message flow.

**Debugging**

6. An async endpoint serves fine solo but stalls under load. You find a `requests.get()` inside the handler. Explain why it freezes the event loop and give the fix.

**Mini project**

Build `stream_server.py`: a FastAPI SSE chat endpoint backed by your async provider adapter, with concurrency limits, cancellation handling, and a minimal HTML page that shows live typing. Bonus: a `/batch` route that summarizes many inputs concurrently.

## Quiz

<details>
<summary>1. Does streaming make the model finish faster?</summary>
No — same total time; it improves perceived latency by showing tokens as they're produced.
</details>

<details>
<summary>2. Why cap concurrency with a semaphore?</summary>
Unbounded parallel calls trip provider rate limits and can exhaust your budget instantly.
</details>

<details>
<summary>3. Which is simpler for one-way token streaming to a browser?</summary>
Server-Sent Events (SSE) — one-directional and easy to consume with EventSource.
</details>

<details>
<summary>4. Can you stream a JSON structured output and validate it live?</summary>
Not reliably — validate whole objects; stream free-form prose, buffer structured data.
</details>

## Further reading

- FastAPI `StreamingResponse` and SSE docs; MDN `EventSource`
- Python asyncio: `gather`, `Semaphore`, task cancellation
- Next lesson: [LangChain, LangGraph & MCP](/courses/ai-python/langchain-langgraph-mcp)
