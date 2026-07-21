## Learning objectives

- Explain what a **closure** is and how it captures variables.
- Build **decorators** from first principles (the gift-wrapping analogy).
- Use `functools.wraps` and know what breaks without it.
- Write parameterized decorators and recognize when a decorator is the wrong tool.

## Prerequisites

[Functions, Arguments & Scope](/courses/python-foundations/functions-arguments-scope) — especially `*args/**kwargs` and LEGB.

## The core idea in one line

> A **closure** is a function that remembers variables from the scope where it was created; a **decorator** is a function that wraps another function to add behavior — `@d` above `def f` just means `f = d(f)`.

**Analogy — gift wrapping.** A decorator takes your present (the function) and wraps it in nicer paper (extra behavior) without changing what's inside. The recipient still gets the gift — but now it also has a bow (logging), a gift receipt (timing), or a "handle with care" sticker (retries). Unwrap it and the original is untouched.

## Closures first

```python
def multiplier(factor):
    def multiply(n):
        return n * factor        # `factor` is captured from the enclosing scope
    return multiply

double = multiplier(2)
double(10)                       # 20 — `double` remembers factor=2
```

`multiply` is a **closure**: even after `multiplier` returns, `multiply` keeps a live reference to `factor`. Closures capture the *variable*, not a snapshot of its value — the root of a famous loop bug:

```python
funcs = [lambda: i for i in range(3)]
[f() for f in funcs]             # [2, 2, 2] — all share the same `i`, which ended at 2
# Fix: capture per-iteration with a default arg
funcs = [lambda i=i: i for i in range(3)]   # [0, 1, 2]
```

## Building a decorator from scratch

Since `@d` means `f = d(f)`, a decorator is just a function that takes a function and returns a (usually wrapping) function:

```python
import functools, time

def timed(fn):
    @functools.wraps(fn)                    # preserve fn's identity (below)
    def wrapper(*args, **kwargs):           # accept ANY arguments
        start = time.perf_counter()
        try:
            return fn(*args, **kwargs)      # call the real function
        finally:
            ms = (time.perf_counter() - start) * 1000
            print(f"{fn.__name__} took {ms:.1f}ms")
    return wrapper

@timed
def work(n):
    return sum(range(n))
```

Line by line:
- `def timed(fn)` — receives the function object at decoration time (usually import).
- `wrapper(*args, **kwargs)` — the universal pass-through so the wrapper is callable like the original.
- `try/finally` — timing is recorded even if `fn` raises; the exception still propagates.
- `return wrapper` — **you must return the replacement**, or `work` becomes `None`.

## Why `functools.wraps` matters

Without it, the wrapper *replaces* the original's identity:

```python
def bad(fn):
    def wrapper(*a, **k): return fn(*a, **k)
    return wrapper

@bad
def greet(): "docstring here"
greet.__name__      # 'wrapper'  ← wrong! docs, help(), tracebacks all lie
```

`@functools.wraps(fn)` copies `__name__`, `__doc__`, the signature, and sets `__wrapped__`. Always use it — some frameworks (web routes, task queues) break without correct function names.

## Parameterized decorators (three layers)

`@retry(times=3)` must *call* `retry(times=3)` first, then use its result as the decorator:

```python
def retry(times=3):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return fn(*args, **kwargs)
                except Exception:
                    if attempt == times:
                        raise
        return wrapper
    return decorator

@retry(times=5)
def flaky(): ...
```

Three layers: `retry(times)` → `decorator(fn)` → `wrapper(*a, **k)`. Keep the timeline in mind and parameterized decorators stop being confusing.

## When NOT to use a decorator

- When the behavior needs to vary per call in complex ways — a parameter or explicit call is clearer.
- When it hides critical control flow (silent retries on non-idempotent operations = duplicate payments).
- When one function needs it — inline the logic; a decorator is for **cross-cutting** concerns (logging, caching, auth) applied in many places.

## Common mistakes

1. **Forgetting `return wrapper`** — the decorated function becomes `None`.
2. **Omitting `functools.wraps`** — broken introspection and framework registration.
3. **`@retry` vs `@retry()`** — a parameterized decorator must be called.
4. **Swallowing exceptions** in the wrapper — decorators should be transparent by default.
5. **Late-binding closure bug** in loops — capture with a default arg or a factory.

## Performance & memory

- Each wrapper adds one function call (~tens of ns) — negligible for I/O, measurable in tight hot loops.
- `functools.lru_cache` is a decorator that trades memory for speed; bound it with `maxsize` and beware caching methods (keeps `self` alive).
- Closures hold their captured variables alive; a closure capturing a big object pins it in memory.

## Interview questions

1. **"What is a closure?"** — A nested function that captures and remembers variables from its enclosing scope, even after that scope returns.
2. **"What does `@decorator` desugar to?"** — `f = decorator(f)`.
3. **"Why `functools.wraps`?"** — Preserves the wrapped function's name/docs/signature and enables `inspect.unwrap`; without it introspection and framework registration break.
4. **"How do decorators with arguments work?"** — Three layers: `factory(args)` returns a decorator, which returns a wrapper.

## Summary

- Closures remember enclosing variables (the variable, not a snapshot).
- A decorator wraps a function to add behavior; `@d` ≡ `f = d(f)`.
- Always `functools.wraps` and pass through `*args/**kwargs`.
- Parameterized decorators are three layers; use decorators for cross-cutting concerns, not one-offs.

## Exercises

**Easy**

1. Write `make_adder(n)` returning a closure that adds `n`. Show two adders don't interfere.
2. Write a `@log_calls` decorator that prints arguments and result; verify exceptions still propagate.

**Intermediate**

3. Write `@cache_simple` that memoizes by arguments in a dict (handle only hashable args) and confirm `__name__` is preserved.
4. Write parameterized `@repeat(n)` that calls the function `n` times and returns the last result.

**Advanced**

5. Build `@retry(times, exceptions, delay)` with exponential backoff, using `functools.wraps`. Explain why it should only retry idempotent operations.

**Debugging**

6. Explain why this prints `[3, 3, 3]` and fix it:
```python
callbacks = []
for i in range(3):
    callbacks.append(lambda: i)
print([c() for c in callbacks])
```

**Mini project**

Build a small decorator library: `@timed`, `@retry(...)`, and `@memoize` in one module, each with `functools.wraps` and tests. Then apply all three (stacked) to a flaky, slow function and observe the order of execution.

## Quiz

<details>
<summary>1. What does a closure capture?</summary>
The variable from its enclosing scope (a live reference), not a copy of the value at creation time.
</details>

<details>
<summary>2. What does `@d` above `def f` mean?</summary>
`f = d(f)` — the function is passed to the decorator and rebound to its return value.
</details>

<details>
<summary>3. What breaks without `functools.wraps`?</summary>
`__name__`, `__doc__`, the signature, and `__wrapped__` — introspection, `help()`, tracebacks, and some framework registration.
</details>

<details>
<summary>4. How many layers does `@retry(3)` need?</summary>
Three: the factory (takes args), the decorator (takes the function), and the wrapper (takes call args).
</details>

## Further reading

- Python docs: `functools` (`wraps`, `lru_cache`)
- The advanced course's [Decorators from First Principles](/courses/python/decorators) for the deep dive
- Next lesson: [Iterators, Generators & Comprehensions](/courses/python-foundations/iterators-generators-comprehensions)
