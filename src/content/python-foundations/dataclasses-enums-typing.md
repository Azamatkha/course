## Learning objectives

- Model data cleanly with **`@dataclass`**.
- Express fixed choices with **`Enum`**.
- Use **type hints**, `Optional`, `Union`, and generics to self-document code.
- Run **mypy** to catch type errors before runtime.

## Prerequisites

[OOP basics](/courses/python-foundations/oop-abc-protocols) help but aren't required. [Functions & Scope](/courses/python-foundations/functions-arguments-scope).

## The core idea in one line

> Dataclasses remove boilerplate for "objects that hold data," enums name fixed sets of choices, and type hints turn implicit assumptions into checkable documentation.

**Analogy — labeled containers with a packing list.** A plain class holding data is an unlabeled box you fill by hand. A dataclass is a box that comes pre-printed with labeled compartments (`__init__`, `__repr__`, `__eq__` generated for you). Type hints are the packing list taped to the lid — anyone (and mypy) can verify the right things are inside without opening it.

## Dataclasses

Before — tedious and error-prone:

```python
class Point:
    def __init__(self, x, y):
        self.x = x; self.y = y
    def __repr__(self):
        return f"Point(x={self.x}, y={self.y})"
    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)
```

After — the dataclass generates all of that:

```python
from dataclasses import dataclass, field

@dataclass
class Point:
    x: float
    y: float = 0.0                     # default

p = Point(1, 2)
p                                       # Point(x=1, y=2)  ← free __repr__
Point(1, 2) == Point(1, 2)              # True             ← free __eq__
```

Useful options:

```python
@dataclass(frozen=True)                 # immutable + hashable (usable as dict key / in sets)
class Config:
    host: str
    ports: list[int] = field(default_factory=list)   # mutable default → factory, not []!
```

- `frozen=True` → immutable, hashable value objects.
- `field(default_factory=list)` → the correct way to default a mutable field (same trap as function defaults).
- `__post_init__` → run validation after the generated `__init__`.

## Enums

Magic strings/ints are bug factories. Enums name a fixed set:

```python
from enum import Enum

class Status(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    CLOSED = "closed"

Status.ACTIVE          # <Status.ACTIVE: 'active'>
Status.ACTIVE.value    # 'active'
Status("active")       # lookup by value → Status.ACTIVE
list(Status)           # iterate all members
```

Enums are singletons (compare with `is`), self-documenting, and catch typos: `Status.ACITVE` is an immediate `AttributeError`, whereas `"acitve"` silently slips through.

## Type hints

Annotations document intent and enable static checking:

```python
def total(prices: list[float], tax: float = 0.0) -> float:
    return sum(prices) * (1 + tax)
```

Common tools from `typing` (modern syntax):

```python
from typing import Optional, Union

x: int | None            # may be int or None (a.k.a. Optional[int])
y: int | str             # a union of types
names: list[str]         # a list of strings
scores: dict[str, int]   # str keys, int values
```

- `X | None` (or `Optional[X]`) — the value might be missing.
- `A | B` — one of several types.
- Generics like `list[str]`, `dict[str, int]` describe container contents.

Type hints are **not enforced at runtime** — Python ignores them while running. Their value is in tooling: editors, autocomplete, and mypy.

## mypy — catch errors before running

```bash
pip install mypy
mypy myapp/
```

```python
def greet(name: str) -> str:
    return "Hi " + name

greet(42)      # mypy error: Argument 1 has incompatible type "int"; expected "str"
```

mypy reads your hints and flags mismatches statically — a whole class of bugs caught before the code ever runs. Run it in CI.

## Common mistakes

1. **Mutable default in a dataclass field** (`x: list = []`) — same shared-state trap; use `field(default_factory=list)`.
2. **Magic strings instead of enums** — typos slip through and refactors miss cases.
3. **Believing hints are enforced at runtime** — they aren't; use mypy or `pydantic` for enforcement.
4. **Over-annotating trivial locals** — hint public signatures; skip obvious locals.
5. **`Any` everywhere** — defeats the point; be specific.

## Performance & memory

- Dataclasses are regular classes; `@dataclass(slots=True)` (3.10+) adds `__slots__` for lower memory and faster attribute access.
- `frozen=True` dataclasses are hashable and cache-friendly as dict keys.
- Type hints have **zero runtime cost** in normal execution (they're just annotations).

## Interview questions

1. **"What does `@dataclass` generate?"** — `__init__`, `__repr__`, `__eq__` (and more with options) from the annotated fields.
2. **"How do you default a mutable dataclass field?"** — `field(default_factory=list)`, never `= []`.
3. **"Are type hints enforced at runtime?"** — No; they're for tooling like mypy and editors (unless a library like pydantic enforces them).
4. **"Why use an Enum over string constants?"** — Named, typo-safe, iterable, self-documenting singletons.

## Summary

- `@dataclass` removes boilerplate; use `frozen=True`, `default_factory`, and `__post_init__` as needed.
- `Enum` names fixed choices and prevents magic-string bugs.
- Type hints document and enable static checking; mypy catches type errors pre-runtime.
- Hints are free at runtime; their payoff is tooling.

## Exercises

**Easy**

1. Turn a hand-written data class into a `@dataclass`; confirm `repr` and `==` work for free.
2. Define a `Color(Enum)` and look a member up by value.

**Intermediate**

3. Make a `frozen=True` dataclass and use instances as dict keys / set members.
4. Add type hints to three functions and run mypy; fix any errors it reports.

**Advanced**

5. Model an `Order` with a `Status` enum field, a `list[LineItem]` (using `default_factory`), and `__post_init__` validation that totals must be positive.

**Debugging**

6. Explain the bug and fix it:
```python
@dataclass
class Cart:
    items: list = []
```

**Mini project**

Build a typed domain model for a small app (User, Order, Product) using dataclasses and enums, fully type-hinted, passing mypy in strict mode. Add a `to_dict`/`from_dict` round-trip and tests.

## Quiz

<details>
<summary>1. What three methods does a basic `@dataclass` generate?</summary>
`__init__`, `__repr__`, and `__eq__` (plus ordering/hash with options).
</details>

<details>
<summary>2. How do you give a dataclass field a mutable default?</summary>
`field(default_factory=list)` — never a bare `= []`, which is shared across instances.
</details>

<details>
<summary>3. Does Python enforce type hints while running?</summary>
No — they're ignored at runtime; static tools like mypy enforce them.
</details>

<details>
<summary>4. Why prefer an Enum to string constants?</summary>
Typo-safe, iterable, self-documenting singletons — a wrong member name errors immediately.
</details>

## Further reading

- Python docs: `dataclasses`, `enum`, `typing`; mypy docs
- The advanced course's [Type Hints, Generics & Protocols](/courses/python/typing-and-generics)
- Next lesson: [OOP, ABCs & Protocols](/courses/python-foundations/oop-abc-protocols)
