## Learning objectives

- Use classes, instances, and the difference between **inheritance** and **composition**.
- Implement key **dunder methods** to make objects feel native.
- Define contracts with **abstract base classes (ABCs)**.
- Use **Protocols** for structural typing (duck typing with a safety net).

## Prerequisites

[Dataclasses, Enums & Typing](/courses/python-foundations/dataclasses-enums-typing). Basic class syntax.

## The core idea in one line

> OOP bundles data with the behavior that operates on it; **inheritance** says "is-a", **composition** says "has-a", **ABCs** enforce a contract by inheritance, and **Protocols** enforce it by shape.

**Analogy — job descriptions vs actual skills.** An ABC is a formal job contract you must *sign* (inherit) and whose duties you must fulfill — HR checks the signature. A Protocol is "can you actually do the job?" — if you can `.read()` and `.write()`, you *are* a file-like, no paperwork required. Python supports both hiring styles.

## Classes and instances

```python
class Account:
    def __init__(self, owner: str, balance: float = 0):
        self.owner = owner          # instance attribute — per object
        self.balance = balance

    def deposit(self, amount: float) -> None:
        self.balance += amount      # `self` is the instance

a = Account("Ada", 100)
a.deposit(50); a.balance            # 150
```

- Instance attributes (`self.x`) are per-object; class attributes are shared by all instances.
- Methods take `self` (the instance) first, automatically bound when called as `a.deposit(...)`.

## Inheritance vs composition

```python
# Inheritance — SavingsAccount IS-A Account
class SavingsAccount(Account):
    def __init__(self, owner, balance=0, rate=0.02):
        super().__init__(owner, balance)   # call the parent initializer
        self.rate = rate
    def add_interest(self):
        self.deposit(self.balance * self.rate)

# Composition — a Bank HAS accounts
class Bank:
    def __init__(self):
        self.accounts: list[Account] = []
```

**Favor composition over inheritance.** Deep inheritance trees are rigid and fragile; composing small objects is flexible. Use inheritance only for genuine is-a relationships with shared behavior.

## Dunder methods — make objects feel native

Python's operators and built-ins dispatch to "dunder" (double-underscore) methods:

```python
class Money:
    def __init__(self, cents: int): self.cents = cents
    def __repr__(self): return f"Money({self.cents})"      # debugging
    def __str__(self): return f"${self.cents/100:.2f}"     # user-facing
    def __eq__(self, other): return self.cents == other.cents
    def __lt__(self, other): return self.cents < other.cents   # enables sorting
    def __add__(self, other): return Money(self.cents + other.cents)
    def __hash__(self): return hash(self.cents)            # usable in sets/dicts

Money(150) + Money(50)          # Money(200) — via __add__
sorted([Money(300), Money(100)])   # works — via __lt__
```

Implementing the right dunders makes your objects work with `+`, `==`, `sorted`, `print`, `in`, and more — they feel like built-ins.

## Abstract base classes (ABCs)

An ABC defines methods subclasses **must** implement; you can't instantiate it until they do:

```python
from abc import ABC, abstractmethod

class Storage(ABC):
    @abstractmethod
    def save(self, key: str, data: bytes) -> None: ...
    @abstractmethod
    def load(self, key: str) -> bytes: ...

class DiskStorage(Storage):
    def save(self, key, data): ...      # must implement both
    def load(self, key): ...

Storage()          # TypeError: can't instantiate abstract class
```

ABCs are explicit contracts — good when you want a clear "implement these" checklist enforced at instantiation.

## Protocols — structural typing

A Protocol says "anything with these methods qualifies" — no inheritance needed:

```python
from typing import Protocol

class Readable(Protocol):
    def read(self) -> str: ...

def dump(src: Readable) -> None:      # accepts ANYTHING with a read() method
    print(src.read())

# A file, a StringIO, or your own class all satisfy Readable
# with zero explicit inheritance — checked statically by mypy.
```

Protocols formalize duck typing: you get the flexibility of "if it quacks, it's a duck" *and* static verification. Prefer Protocols for interfaces you don't own or want loosely coupled; ABCs when you want an enforced base class.

## Comparison

| | ABC | Protocol |
|---|---|---|
| Relationship | Explicit (inherit) | Structural (shape) |
| Enforced | At instantiation (runtime) | By mypy (static) |
| Good for | Frameworks, "implement these" | Duck typing, third-party types |

## Common mistakes

1. **Deep inheritance** where composition fits — rigidity and fragile base classes.
2. **Forgetting `super().__init__()`** — parent state uninitialized.
3. **Only `__str__`, no `__repr__`** — debugging shows unhelpful `<object at 0x...>`.
4. **`__eq__` without `__hash__`** — object becomes unhashable (can't go in a set/dict).
5. **Overusing ABCs** where a simple Protocol or function would do.

## Performance & memory

- Attribute access goes through the instance `__dict__`; `__slots__` removes the dict for lower memory and faster access on many-instance classes.
- Method resolution follows the MRO (method resolution order); deep hierarchies add lookup steps.
- Protocols are erased at runtime (typing-only) — zero runtime cost.

## Interview questions

1. **"Inheritance vs composition?"** — Is-a vs has-a; favor composition for flexibility, inheritance for genuine shared-behavior is-a.
2. **"What's an ABC?"** — A class with abstract methods that subclasses must implement; can't be instantiated until they do.
3. **"ABC vs Protocol?"** — ABC is explicit/inherited and runtime-enforced; Protocol is structural and mypy-checked — duck typing with static safety.
4. **"Why implement `__repr__`?"** — Useful debugging output; `repr` is what you see in tracebacks and the REPL.

## Summary

- Classes bundle data + behavior; `self` is the instance.
- Favor composition; use inheritance for real is-a with `super()`.
- Dunders make objects work with operators and built-ins.
- ABCs enforce contracts by inheritance; Protocols by shape (structural typing).

## Exercises

**Easy**

1. Write a `Vector2D` with `__add__`, `__eq__`, and `__repr__`; add two vectors.
2. Give a class both `__str__` (user) and `__repr__` (debug) and observe where each is used.

**Intermediate**

3. Define a `Shape` ABC with an abstract `area()`; implement `Circle` and `Rectangle`.
4. Define a `Comparable` Protocol and write a `max_of(items)` that accepts anything supporting `<`.

**Advanced**

5. Refactor a deep inheritance chain (`Animal → Dog → GuideDog`) into composition (a `Dog` that *has* a `Job`), and argue why it's more flexible.

**Debugging**

6. Instances of a class can't be added to a set. Given it defines `__eq__` but not `__hash__`, explain and fix.

**Mini project**

Build a plugin system two ways: (a) an ABC `Plugin` base with `run()`, and (b) a `Plugin` Protocol. Register and execute plugins for each, and write up the tradeoffs you observed.

## Quiz

<details>
<summary>1. What does `super().__init__()` do?</summary>
Calls the parent class's initializer so inherited state is set up.
</details>

<details>
<summary>2. Which dunder enables sorting?</summary>
`__lt__` (less-than) — `sorted`/`min`/`max` use it (with `functools.total_ordering` to derive the rest).
</details>

<details>
<summary>3. Can you instantiate a class with an unimplemented `@abstractmethod`?</summary>
No — it raises `TypeError` until all abstract methods are implemented.
</details>

<details>
<summary>4. How does a Protocol differ from an ABC?</summary>
A Protocol matches by structure (having the methods), checked statically; an ABC requires explicit inheritance, enforced at instantiation.
</details>

## Further reading

- Python docs: `abc`, `typing.Protocol`, the data model (dunders)
- The advanced course's [OOP and the Python Data Model](/courses/python/oop-and-the-data-model)
- Next lesson: [SOLID, Clean Code & Design Patterns](/courses/python-foundations/solid-clean-code-patterns)
