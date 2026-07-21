## Learning objectives

- Explain what the **`with`** statement guarantees and why.
- Implement a context manager via `__enter__`/`__exit__`.
- Build one quickly with `@contextlib.contextmanager`.
- Use context managers for locks, transactions, timers, and temporary state.

## Prerequisites

[Iterators & Generators](/courses/python-foundations/iterators-generators-comprehensions) (for the `@contextmanager` generator trick) and basic exception awareness.

## The core idea in one line

> A context manager guarantees **setup and cleanup** around a block — the cleanup runs even if the block raises, so resources are never leaked.

**Analogy — a hotel keycard.** Checking in (`__enter__`) activates your card and gives you the room; checking out (`__exit__`) deactivates it and returns it to the pool — and the hotel makes sure checkout happens *even if you leave in a hurry* (an exception). You never have to remember to hand the card back; the system guarantees it. `with` is that guarantee for files, locks, and connections.

## The problem it solves

```python
f = open("data.txt")
data = f.read()          # if this raises, f.close() below never runs → leaked file handle
f.close()
```

```python
with open("data.txt") as f:
    data = f.read()      # f is guaranteed closed, exception or not
# f.close() already happened here, automatically
```

The `with` block calls `__enter__` on entry and `__exit__` on exit — normal or exceptional. Leaked file handles, unclosed connections, and stuck locks vanish.

## Implementing the protocol

```python
class Timer:
    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self                     # value bound to `as`
    def __exit__(self, exc_type, exc, tb):
        import time
        self.elapsed = time.perf_counter() - self.start
        print(f"took {self.elapsed:.3f}s")
        return False                    # False → don't suppress exceptions

with Timer() as t:
    sum(range(10_000_000))
```

`__exit__` receives exception info (`exc_type, exc, tb`) — all `None` on a clean exit. **Returning `True` suppresses** the exception; return `False` (or nothing) to let it propagate. Suppressing should be rare and deliberate.

## The easy way: `@contextmanager`

Write a generator: everything before `yield` is setup, everything after is cleanup:

```python
from contextlib import contextmanager

@contextmanager
def opened(path, mode="r"):
    f = open(path, mode)
    try:
        yield f                # hand the resource to the block
    finally:
        f.close()              # ALWAYS runs — the cleanup guarantee

with opened("data.txt") as f:
    print(f.read())
```

The `try/finally` around `yield` is the whole trick: `finally` runs whether the block succeeds or raises. This is the most common way to write context managers.

## Real-world uses

```python
# Database transaction: commit on success, rollback on error
@contextmanager
def transaction(conn):
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()        # cleanup path on failure
        raise

# Temporarily change state and restore it
@contextmanager
def temp_setting(obj, attr, value):
    old = getattr(obj, attr)
    setattr(obj, attr, value)
    try:
        yield
    finally:
        setattr(obj, attr, old)   # restore no matter what
```

Locks (`with lock:`), thread pools, `decimal.localcontext`, and test fixtures are all context managers — a sign of how central the pattern is.

## Handy stdlib helpers

```python
from contextlib import suppress, ExitStack

with suppress(FileNotFoundError):     # ignore a specific error cleanly
    os.remove("maybe.txt")

with ExitStack() as stack:            # manage a dynamic number of context managers
    files = [stack.enter_context(open(p)) for p in paths]
    # all files closed on block exit, even if one open() fails
```

## Common mistakes

1. **Manual `try/finally` everywhere** instead of a reusable context manager.
2. **Returning `True` from `__exit__` by accident** — silently swallowing exceptions.
3. **Putting cleanup after `yield` without `try/finally`** — an exception in the block skips your cleanup.
4. **Opening resources without `with`** — the classic leaked-handle bug.

## Performance & memory

- Context managers add negligible overhead but prevent resource *leaks*, which are far costlier (exhausted file descriptors, connection-pool starvation).
- `ExitStack` is the clean way to manage a variable number of resources without deep nesting.
- For hot loops opening/closing the same resource, hoist the `with` outside the loop.

## Interview questions

1. **"What does `with` guarantee?"** — `__enter__` on entry and `__exit__` on exit, including when the block raises — so cleanup always runs.
2. **"How do you write a context manager two ways?"** — A class with `__enter__`/`__exit__`, or a generator decorated with `@contextmanager` using `try/finally`.
3. **"How does `__exit__` handle exceptions?"** — It receives exc info; returning `True` suppresses the exception, `False`/None lets it propagate.
4. **"Give real uses."** — Files, locks, DB transactions, timers, temporary state, test setup/teardown.

## Summary

- `with` guarantees setup/cleanup around a block, even on exceptions.
- Implement via `__enter__`/`__exit__` or, more easily, a `@contextmanager` generator with `try/finally`.
- Use it for any resource or state that must be released/restored: files, locks, transactions.
- `suppress` and `ExitStack` cover common patterns.

## Exercises

**Easy**

1. Write a `Timer` context manager that prints elapsed time. Use it around a slow loop.
2. Rewrite a manual `open`/`try`/`finally`/`close` as a `with` block.

**Intermediate**

3. Write `@contextmanager def temp_cwd(path)` that changes the working directory and restores it afterward.
4. Write a `transaction(conn)` context manager that commits on success and rolls back on error.

**Advanced**

5. Use `ExitStack` to open a dynamic list of files and guarantee all are closed even if the third `open()` fails. Prove it with a test.

**Debugging**

6. This context manager leaks the file on error. Fix it:
```python
@contextmanager
def bad(path):
    f = open(path)
    yield f
    f.close()
```

**Mini project**

Build a `managed.py` with reusable context managers: `timer()`, `temp_env(**vars)` (temporarily set env vars), and `acquired(lock, timeout)`. Add tests proving cleanup runs on both success and exception paths.

## Quiz

<details>
<summary>1. Does `__exit__` run if the block raises?</summary>
Yes — that's the whole point; cleanup runs on both normal and exceptional exit.
</details>

<details>
<summary>2. What makes `@contextmanager` cleanup reliable?</summary>
The `try/finally` around `yield` — `finally` runs whether the block succeeds or raises.
</details>

<details>
<summary>3. What does returning `True` from `__exit__` do?</summary>
Suppresses the exception raised in the block — use sparingly and deliberately.
</details>

<details>
<summary>4. What is `ExitStack` for?</summary>
Managing a dynamic number of context managers, ensuring all are cleaned up even if setup partially fails.
</details>

## Further reading

- Python docs: `contextlib`, the `with` statement
- Next lesson: [Modules, Packages & Imports](/courses/python-foundations/modules-packages-imports)
