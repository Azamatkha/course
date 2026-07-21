## Learning objectives

- Reason about **Big-O** in everyday Python code.
- Pick the **right data structure** for the job.
- Profile with `timeit` and `cProfile` instead of guessing.
- Cut memory with generators, `__slots__`, and awareness of object overhead.

## Prerequisites

The rest of this course. Performance work is most useful once code is correct and clean.

## The core idea in one line

> **Measure, then optimize.** Most performance wins come from a better algorithm or data structure, not micro-tweaks — and you can't fix what you haven't profiled.

**Analogy — traffic, not car tuning.** Slow code is usually a traffic problem (the wrong route, O(n²) instead of O(n)), not an engine problem (a slow line). Polishing the engine (micro-optimizations) on a car stuck in the wrong city won't help. Profile to find the jam, fix the route, *then* consider tuning.

## Big-O in practice

You don't need proofs — you need to recognize the expensive shapes:

```python
# O(n²) — a loop inside a loop over the same data (watch for this!)
for a in items:
    if a in other_list:        # `in` on a LIST is O(n) → overall O(n²)
        ...

# O(n) — use a set for membership
other = set(other_list)        # O(n) once
for a in items:
    if a in other:             # `in` on a SET is O(1) → overall O(n)
        ...
```

| Operation | list | set / dict |
|---|---|---|
| `x in c` | O(n) | **O(1)** |
| append / add | O(1) | O(1) |
| index `c[i]` | O(1) | n/a |
| ordered? | yes | dict yes (3.7+), set no |

The single most common real-world speedup: **replace `x in a_list` inside a loop with a set.** That's O(n²) → O(n).

## Choosing data structures

```python
from collections import defaultdict, Counter, deque

Counter(words)                 # count occurrences in one line
defaultdict(list)              # group without checking keys
deque(maxlen=1000)             # O(1) appends AND pops from both ends (queues)
```

- Need membership/uniqueness? **set/dict.**
- Need a queue/stack with fast ends? **deque** (a list's `pop(0)` is O(n)!).
- Counting/grouping? **Counter / defaultdict.**

Picking the right structure often beats any amount of loop tuning.

## Profiling — find the real bottleneck

```python
import timeit
timeit.timeit("sum(range(1000))", number=10000)   # micro-benchmark a snippet
```

```python
import cProfile
cProfile.run("main()")          # where does the time actually go?
# Sort by cumulative time to find the hot functions.
```

Never optimize on a hunch. Profilers routinely reveal the slow part is somewhere you'd never have guessed (often I/O or an accidental O(n²)).

## Memory

Python objects carry overhead. Two big levers:

```python
# Generators: O(1) memory over a stream (see the iterators lesson)
total = sum(x*x for x in range(10**7))     # never builds a 10M list

# __slots__: drop the per-instance __dict__ → less memory, faster attribute access
class Point:
    __slots__ = ("x", "y")     # can't add new attributes, but much lighter
    def __init__(self, x, y): self.x, self.y = x, y
```

For millions of small objects, `__slots__` can cut memory dramatically. For large data streams, generators keep memory flat.

```python
import sys
sys.getsizeof([1,2,3])         # inspect object sizes when it matters
```

## When NOT to optimize

- Before it's correct and clean — optimization obscures code; do it last.
- Without a measurement showing the code is actually a bottleneck.
- On code that runs rarely — a 10× speedup on a once-a-day script saves nothing meaningful.
- When a clearer O(n log n) is fast enough — don't chase O(n) at the cost of readability.

Premature optimization genuinely is a top source of complexity and bugs.

## Best-practices checklist

- Correct → tested → clean → *then* fast, in that order.
- Reach for the right data structure before writing clever loops.
- Profile before optimizing; measure after to confirm the win.
- Prefer built-ins and stdlib (they're C-optimized) over hand-rolled loops.
- Stream large data with generators; use `__slots__` for many small objects.
- Cache expensive pure computations (`functools.lru_cache`) — with a bounded size.

## Common mistakes

1. **`x in list` inside a loop** — accidental O(n²); use a set.
2. **`list.pop(0)` / `insert(0, ...)`** — O(n); use a `deque`.
3. **Optimizing without profiling** — effort on the wrong 90%.
4. **Building huge lists** where a generator would keep memory flat.
5. **Unbounded caches** — `lru_cache(maxsize=None)` grows forever.

## Performance & memory (recap)

- Algorithmic complexity dominates; a better structure usually beats micro-tuning by orders of magnitude.
- C-level built-ins (`sum`, `sorted`, comprehensions) outrun equivalent Python loops.
- Memory and speed often trade off (caching, materializing) — choose per constraint, measured.

## Interview questions

1. **"How do you speed up `x in list` in a loop?"** — Convert the list to a set: O(n) membership becomes O(1), turning O(n²) into O(n).
2. **"How do you find a bottleneck?"** — Profile with `cProfile`/`timeit`; optimize the measured hot path, not a guess.
3. **"What does `__slots__` do?"** — Removes the per-instance `__dict__`, lowering memory and speeding attribute access (at the cost of dynamic attributes).
4. **"When should you optimize?"** — Last: after correct, tested, clean, and only where profiling proves it matters.

## Summary

- Algorithm and data-structure choice dominate performance — recognize O(n²) shapes.
- Use sets/dicts for membership, deque for queues, Counter/defaultdict for tallies.
- Profile with `timeit`/`cProfile`; measure before and after.
- Save memory with generators and `__slots__`; optimize last and only where it counts.

## Exercises

**Easy**

1. Rewrite an O(n²) "common elements" function using sets; time both with `timeit`.
2. Replace a `list.pop(0)` queue with a `deque` and measure the difference on 100k items.

**Intermediate**

3. Use `Counter` and `defaultdict` to replace manual counting/grouping loops; compare readability and speed.
4. Profile a small program with `cProfile` and identify the top function by cumulative time.

**Advanced**

5. Take a memory-heavy script that builds large lists and refactor it to generators; measure peak memory before/after.

**Debugging**

6. A report that "worked on small data" hangs on large data. Given a nested loop with `in` on a list, diagnose the complexity and fix it.

**Mini project**

Build a `bench.py` harness that runs a function against small/medium/large inputs, prints timings, and flags likely super-linear growth. Use it to compare two implementations of the same task and pick the winner with data.

## Quiz

<details>
<summary>1. What's the complexity of `x in a_list`?</summary>
O(n). Use a set/dict for O(1) membership — the fix for accidental O(n²) loops.
</details>

<details>
<summary>2. Which structure for a fast double-ended queue?</summary>
`collections.deque` — O(1) appends and pops at both ends, unlike a list's O(n) `pop(0)`.
</details>

<details>
<summary>3. What does `__slots__` save?</summary>
Per-instance memory (no `__dict__`) and gives faster attribute access, at the cost of dynamic attributes.
</details>

<details>
<summary>4. When should you optimize?</summary>
Last — after correct, tested, and clean, and only where profiling shows a real bottleneck.
</details>

## Further reading

- Python docs: `timeit`, `cProfile`, `collections`
- The advanced course's [The GIL, Threads & Processes](/courses/python/concurrency-gil-threads-processes) for CPU-bound scaling
- You're ready for [Django](/courses/django/models-and-the-orm), [FastAPI](/courses/fastapi/pydantic-deep-dive), and [AI Engineering](/courses/ai-python/modern-ai-landscape)
