## Learning objectives

- Use `try/except/else/finally` correctly and precisely.
- Choose **EAFP** vs LBYL and know why Python prefers EAFP.
- Design **custom exception hierarchies**.
- Chain exceptions and never silently swallow errors.

## Prerequisites

[Functions & Scope](/courses/python-foundations/functions-arguments-scope). You've seen `try/except`; now you'll use it like a professional.

## The core idea in one line

> Exceptions are **structured error signals** that travel up the call stack until something handles them — a clean channel separating the happy path from error handling.

**Analogy — a fire alarm, not a maze of checkpoints.** LBYL ("look before you leap") checks every door is unlocked before walking through — but a door can be locked *between* the check and the walk. EAFP ("easier to ask forgiveness than permission") just walks through and, if a door is locked, the alarm (exception) sounds and the right responder handles it. Python is built for EAFP: try the operation, catch the specific failure.

## The full statement

```python
try:
    data = parse(raw)          # code that might fail
except ValueError as e:        # handle a SPECIFIC exception
    log.warning("bad input: %s", e)
    data = default
else:
    save(data)                 # runs ONLY if no exception — keep the try minimal
finally:
    cleanup()                  # ALWAYS runs — release resources
```

- **`except`** — catch specific types; order from most to least specific.
- **`else`** — the success-only branch; keeps the `try` block tight (only the risky line).
- **`finally`** — cleanup that must run regardless (though `with` is usually better for that).

## EAFP vs LBYL

```python
# LBYL — racy and verbose
if "key" in d and d["key"] is not None:
    use(d["key"])

# EAFP — Pythonic
try:
    use(d["key"])
except KeyError:
    handle_missing()
```

EAFP avoids **TOCTOU** (time-of-check to time-of-use) races and matches how CPython works internally. Prefer it — but catch the *specific* exception, not a blanket `except`.

## Catch narrowly

```python
try:
    risky()
except Exception:          # ⚠️ too broad — hides bugs, catches KeyboardInterrupt's cousins
    pass                   # ⚠️ and swallowing is the worst sin

# Better:
try:
    risky()
except (TimeoutError, ConnectionError) as e:
    retry_later(e)         # handle exactly what you expect; let the rest propagate
```

Rules:
- Catch the **narrowest** exception you can actually handle.
- **Never** `except: pass` — a silent failure is a bug you'll debug at 3 a.m.
- Let unexpected exceptions **propagate** to a top-level handler that logs them.

## Custom exception hierarchies

Model your domain's errors so callers can catch at the right granularity:

```python
class AppError(Exception):
    """Base for all our errors — callers can catch this to get 'any app error'."""

class ValidationError(AppError): ...
class NotFoundError(AppError): ...
class PaymentError(AppError): ...

# Caller chooses granularity:
try:
    process(order)
except ValidationError:
    return 400
except AppError:              # catches NotFound, Payment, etc.
    return 500
```

A base class lets callers catch broadly *or* specifically, and cleanly separates *your* errors from library errors.

## Exception chaining

Preserve the original cause when re-raising:

```python
try:
    value = int(raw)
except ValueError as e:
    raise ValidationError(f"expected a number, got {raw!r}") from e   # keeps the cause
```

`from e` records the original in `__cause__`, so the traceback shows both. Losing the cause (`raise ValidationError(...)` alone) makes debugging much harder.

## Common mistakes

1. **Bare `except:` / `except Exception: pass`** — swallows everything, hides bugs.
2. **Catching too broadly** — masks unexpected errors you should have seen.
3. **Using exceptions for normal control flow** at scale (though EAFP for expected misses is fine).
4. **Losing the traceback** by re-raising without `from`.
5. **Cleanup in `except` instead of `finally`/`with`** — leaks on the success path.

## Performance & memory

- `try` is nearly free when no exception is raised — cheap to wrap risky code.
- Raising/handling an exception is comparatively expensive; don't use exceptions in a hot inner loop for expected, frequent conditions.
- Tracebacks hold references to local frames; catching and storing exceptions long-term can pin memory (`del` them or extract what you need).

## Interview questions

1. **"EAFP vs LBYL?"** — EAFP tries then catches (Pythonic, avoids races); LBYL checks first (racy, verbose). Prefer EAFP with specific excepts.
2. **"What does `else` in try/except do?"** — Runs only if no exception occurred; keeps the `try` minimal.
3. **"Why `raise ... from e`?"** — Preserves the original cause in the traceback for debugging.
4. **"Why is `except: pass` bad?"** — It silently swallows all errors, including bugs and interrupts, making failures invisible.

## Summary

- `try/except/else/finally`: risky code, specific handlers, success-only branch, guaranteed cleanup.
- Prefer EAFP with narrow excepts; never swallow errors silently.
- Design a custom exception hierarchy so callers catch at the right level.
- Chain with `from e` to keep the root cause.

## Exercises

**Easy**

1. Wrap `int(input())` in `try/except ValueError` and re-prompt on bad input.
2. Rewrite an LBYL dict-access into EAFP with `except KeyError`.

**Intermediate**

3. Define an `AppError` base and two subclasses; write a handler that returns different codes per type.
4. Convert a low-level `ValueError` into a domain `ValidationError` using `raise ... from e` and inspect `__cause__`.

**Advanced**

5. Write a `safe_divide` that raises a custom `MathError` on division by zero, chains the original, and is unit-tested for both success and failure.

**Debugging**

6. This hides real bugs. Explain what's wrong and fix it:
```python
try:
    result = compute()
except Exception:
    result = None
```

**Mini project**

Build a small validation library: an `AppError` hierarchy, a `validate(data, schema)` that raises specific errors, and a top-level handler that logs the full chained traceback and returns a user-friendly message. Test every error path.

## Quiz

<details>
<summary>1. When does the `finally` block run?</summary>
Always — after the try/except/else, whether or not an exception occurred (even if one propagates).
</details>

<details>
<summary>2. Why prefer EAFP in Python?</summary>
It avoids check/use race conditions and matches how the interpreter works; catch the specific exception you expect.
</details>

<details>
<summary>3. What does `raise NewError(...) from e` preserve?</summary>
The original exception as the cause (`__cause__`), keeping the full traceback.
</details>

<details>
<summary>4. What's wrong with `except Exception: pass`?</summary>
It silently swallows all errors — bugs become invisible and undebuggable.
</details>

## Further reading

- Python docs: Errors and Exceptions; the exception hierarchy
- The advanced course's [Exceptions, Logging & Observability](/courses/python/errors-logging-and-observability)
- Next lesson: [Files, JSON & Serialization](/courses/python-foundations/files-and-json)
