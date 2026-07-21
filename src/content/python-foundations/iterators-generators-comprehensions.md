## Learning objectives

- Explain the **iterator protocol** (`__iter__`/`__next__`).
- Write **generators** and understand lazy evaluation (the factory analogy).
- Use **comprehensions** and generator expressions idiomatically.
- Stream large data with flat memory using `itertools`.

## Prerequisites

[Functions & Scope](/courses/python-foundations/functions-arguments-scope). Comfort with `for` loops and lists.

## The core idea in one line

> Iteration is a **protocol**: anything with `__iter__`/`__next__` can be looped. Generators are the easy way to build iterators, and they compute values **lazily** — one at a time, only when asked.

**Analogy — a factory production line vs a warehouse.** A list is a warehouse: every item built and stored up front, taking space. A generator is a production line: it makes the next item only when you ask for it, so at any moment just one item exists. To process a million orders you don't need a million-item warehouse — you need a line that produces each order on demand. That's the difference between `[x*x for x in range(10_000_000)]` (builds all 10M) and `(x*x for x in range(10_000_000))` (builds one at a time).

## The iterator protocol

```python
nums = [1, 2, 3]
it = iter(nums)        # calls nums.__iter__() → an iterator
next(it)               # 1  (calls it.__next__())
next(it)               # 2
next(it)               # 3
next(it)               # raises StopIteration  ← the "we're done" signal
```

A `for` loop is exactly this: get an iterator, call `next` until `StopIteration`. You can implement the protocol yourself:

```python
class Countdown:
    def __init__(self, n): self.n = n
    def __iter__(self): return self
    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

list(Countdown(3))     # [3, 2, 1]
```

## Generators — iterators without the boilerplate

A function with `yield` is a **generator**. Calling it returns a generator object; the body runs only as you consume it, pausing at each `yield`:

```python
def countdown(n):
    while n > 0:
        yield n            # pause here, hand out n, resume on next()
        n -= 1

for x in countdown(3):     # 3, 2, 1
    print(x)
```

Each `next()` runs the body until the next `yield`, then freezes local state until asked again. This is why generators use almost no memory regardless of how many values they produce.

```python
def read_large_file(path):
    with open(path) as f:
        for line in f:         # files are iterators too
            yield line.strip()  # process a 10 GB file with flat memory
```

`yield from` delegates to a sub-iterable:

```python
def chain(*iterables):
    for it in iterables:
        yield from it          # flatten without a manual inner loop
```

## Comprehensions and generator expressions

```python
squares   = [x*x for x in range(5)]            # list comprehension → builds a list
evens     = {x for x in range(10) if x % 2 == 0}   # set comprehension
lookup    = {c: ord(c) for c in "abc"}         # dict comprehension
lazy_sq   = (x*x for x in range(5))            # generator expression → lazy, no list
```

- Use a **list comprehension** when you need the whole collection.
- Use a **generator expression** (parentheses) when you'll consume it once and want flat memory: `sum(x*x for x in range(10**7))` never builds the list.
- Keep them readable — a comprehension with two `if`s and a nested loop is often clearer as a plain loop.

## itertools — the lazy toolbox

```python
import itertools as it
it.count(1)                 # 1, 2, 3, ... infinite
it.islice(it.count(), 5)    # first 5 of an infinite stream
it.chain([1,2], [3,4])      # 1,2,3,4
it.groupby(sorted(data), key=...)   # grouped runs
it.batched(range(10), 3)    # (0,1,2),(3,4,5),... (3.12+)
```

These compose into memory-flat pipelines: read → filter → transform → batch, all lazy, never materializing the whole stream.

## Comparison

| | List | Generator |
|---|---|---|
| Memory | All items at once | One item at a time |
| Reusable? | Yes (re-iterate) | No — exhausted after one pass |
| Random access | `lst[i]` | No indexing |
| Best for | Small data, need it all | Large/streamed data, single pass |

> [!WARNING]
> A generator is **single-use**. After you iterate it once, it's empty. If you need the data twice, either use a list or recreate the generator.

## Common mistakes

1. **Iterating a generator twice** and getting nothing the second time.
2. **Building a giant list** when a generator expression would keep memory flat.
3. **Forgetting `StopIteration`** when hand-writing `__next__`.
4. **Overly clever comprehensions** — unreadable one-liners; prefer a loop.
5. **`len()` on a generator** — no length; convert to a list first (defeating the point) or count differently.

## Performance & memory

- Generators keep memory **O(1)** regardless of stream size — the headline benefit.
- They add a small per-item overhead vs a tight C-level list operation; for small data a list can be marginally faster.
- Lazy pipelines also improve *latency to first result* — you can start processing before all data is read.

## Interview questions

1. **"List vs generator?"** — List materializes everything; generator yields lazily, one at a time, single-use, flat memory.
2. **"What does `yield` do?"** — Pauses the function, returns a value, and resumes on the next `next()` with local state intact.
3. **"What signals the end of iteration?"** — `StopIteration`, which `for` loops catch automatically.
4. **"When would you use a generator expression over a list comprehension?"** — Single-pass consumption of large data where you want flat memory (e.g. `sum(...)`).

## Summary

- Iteration is a protocol; `for` = repeated `next()` until `StopIteration`.
- Generators (`yield`) build iterators lazily with O(1) memory and are single-use.
- Comprehensions build collections; generator expressions stream them.
- `itertools` composes lazy, memory-flat pipelines.

## Exercises

**Easy**

1. Write a generator `evens(n)` yielding even numbers up to `n`. Sum them with `sum(evens(100))`.
2. Convert `result = []` + append loop into a single list comprehension.

**Intermediate**

3. Write `read_csv_lazily(path)` that yields parsed rows without loading the whole file.
4. Use `itertools.islice` to take the first 10 values from an infinite `count()`.

**Advanced**

5. Build a lazy pipeline: read lines → strip → skip blanks → parse ints → running sum, all with generators, and process a huge file with flat memory.

**Debugging**

6. Explain why this prints an empty list the second time and fix it:
```python
g = (x*x for x in range(5))
print(list(g)); print(list(g))
```

**Mini project**

Build a `log_pipeline.py` that streams a large log file through composable generator stages (filter by level, extract fields, aggregate counts) and prints a summary — while keeping memory flat. Support chaining stages easily.

## Quiz

<details>
<summary>1. Can you iterate a generator twice?</summary>
No — it's exhausted after one pass. Recreate it or use a list if you need multiple passes.
</details>

<details>
<summary>2. What memory does a generator use for a huge stream?</summary>
O(1) — it holds one item at a time regardless of total size.
</details>

<details>
<summary>3. Which builds a list: `[...]` or `(...)`?</summary>
`[...]` is a list comprehension; `(...)` is a lazy generator expression.
</details>

<details>
<summary>4. What does `yield from xs` do?</summary>
Delegates iteration to `xs`, yielding each of its items — flattening without a manual loop.
</details>

## Further reading

- Python docs: `itertools`, the iterator protocol
- The advanced course's [Iterators & Generators](/courses/python/iterators-and-generators)
- Next lesson: [Context Managers](/courses/python-foundations/context-managers)
