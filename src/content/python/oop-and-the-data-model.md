## Learning objectives

- Use the data model (dunder methods) to make your classes behave like built-ins.
- Explain `__new__` vs `__init__`, attribute lookup order, and the MRO.
- Choose correctly between inheritance, composition, ABCs, and Protocols.
- Use `@property`, `__slots__`, dataclasses, and enums the way production codebases do.
- Handle the interview classics: MRO, `super()`, `classmethod` vs `staticmethod`.

## Prerequisites

The whole Foundations section — especially [names & references](/courses/python/variables-objects-references). Classes are objects too, and everything there applies.

## The data model: Python's real OOP story

Python doesn't have "operator overloading" bolted on — the *entire language* is defined in terms of special methods. `len(x)` calls `x.__len__()`; `a + b` tries `a.__add__(b)` (then `b.__radd__(a)`); `x in xs` → `__contains__`; `with` → `__enter__`/`__exit__`; `for` → `__iter__`. Implement the protocol, and every piece of Python that speaks it — builtins, stdlib, third-party code — works with your type.

```python
from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        self.parts = tuple(int(p) for p in text.split("."))

    def __repr__(self):                      # unambiguous, for developers
        return f"Version({'.'.join(map(str, self.parts))!r})"

    def __str__(self):                       # readable, for users
        return ".".join(map(str, self.parts))

    def __eq__(self, other):
        if not isinstance(other, Version):
            return NotImplemented            # let the other side try
        return self.parts == other.parts

    def __lt__(self, other):
        if not isinstance(other, Version):
            return NotImplemented
        return self.parts < other.parts

    def __hash__(self):                      # eq without hash = unhashable
        return hash(self.parts)

sorted([Version("1.10"), Version("1.2")])    # correct numeric ordering
```

Notes worth internalizing:

- **Return `NotImplemented`** (not raise!) from binary dunders for foreign types — Python then tries the reflected operation, and only raises `TypeError` if both sides decline.
- `__repr__` is for debugging (aim for "evaluable or unambiguous"); `__str__` falls back to `__repr__` — so implement `__repr__` first, always.
- Defining `__eq__` sets `__hash__ = None`; redefine it consistently ([hashability](/courses/python/mutability-and-copies)).
- `@total_ordering` derives the other four comparisons from `__eq__` + `__lt__`.

Container protocols (`__len__`, `__getitem__`, `__contains__`, `__iter__`) make your class sliceable, iterable, and `in`-testable. Implement `__getitem__` accepting ints and slices and you get iteration *and* `in` for free (the old protocol) — though explicit `__iter__` is cleaner.

## Construction: `__new__` vs `__init__`

`Class(...)` runs `__new__` (allocates and returns the instance) then `__init__` (initializes it). You override `__new__` only for: immutable subclasses (`int`, `str`, `tuple` — too late to change in `__init__`), singletons/interning, and returning cached instances. Everything else is `__init__`. If `__new__` returns something that isn't an instance of the class, `__init__` is skipped entirely.

## Attribute lookup, `@property`, and descriptors

Reading `obj.x` searches: data descriptors on the type → instance `__dict__` → non-data descriptors and class attributes → `__getattr__` fallback (only on *miss*). `@property` is a data descriptor — which is why it shadows instance dicts:

```python
class Account:
    def __init__(self, balance):
        self._balance = balance        # convention: _ = internal

    @property
    def balance(self):                 # computed attribute, read syntax
        return self._balance

    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("balance cannot be negative")
        self._balance = value
```

Properties let you **start with plain attributes and add validation later without breaking callers** — the reason Python doesn't need getters/setters culture. Keep properties cheap: no I/O in getters; an expensive computed value wants `functools.cached_property` or an explicit method.

`__slots__ = ("_balance",)` replaces the per-instance `__dict__` with fixed slots: ~50–60% memory savings per instance and slightly faster attribute access, at the cost of no dynamic attributes and some pickling/multiple-inheritance friction. Use for classes instantiated by the million (and note `@dataclass(slots=True)` does it declaratively).

## Inheritance, MRO, and `super()`

Attribute lookup on classes walks the **Method Resolution Order** — the C3 linearization of the class hierarchy:

```python
class A: ...
class B(A): ...
class C(A): ...
class D(B, C): ...
D.__mro__   # (D, B, C, A, object)
```

`super()` does **not** mean "my parent" — it means **"the next class in the MRO of the *instance's* type"**. That's what makes cooperative multiple inheritance (mixins) work: each class calls `super().__init__(**kwargs)` and the chain visits every class exactly once, in MRO order.

```python
class TimestampMixin:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)     # keep the chain going!
        self.created_at = datetime.now(timezone.utc)
```

**Design guidance — the part interviews really probe:**

| Prefer | Over | Because |
|---|---|---|
| Composition ("has-a") | Deep inheritance ("is-a") | Explicit dependencies, swappable parts, no fragile-base-class coupling |
| Small mixins with no state | Diamond hierarchies | MRO stays comprehensible |
| Protocols (structural) | ABC inheritance (nominal) | Third-party types conform without importing you |

Inheritance is the right tool when subtypes genuinely satisfy substitutability (LSP): anywhere a `Base` works, the subclass must work. If you're overriding methods to raise `NotImplementedError` or ignoring parent state — that's composition wearing a costume.

### ABCs and Protocols

```python
from abc import ABC, abstractmethod
from typing import Protocol

class PaymentGateway(ABC):                 # nominal: must inherit
    @abstractmethod
    def charge(self, amount_minor: int, currency: str) -> str: ...

class Chargeable(Protocol):                # structural: just match the shape
    def charge(self, amount_minor: int, currency: str) -> str: ...
```

ABCs give you enforced contracts (instantiation fails if abstract methods are missing) and shared helper code; Protocols give static duck typing checked by mypy with zero runtime coupling — ideal at architecture boundaries ([typing lesson](/courses/python/typing-and-generics)).

## Dataclasses and enums

```python
from dataclasses import dataclass, field
from enum import Enum

class OrderStatus(Enum):          # a closed set of named constants
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"

@dataclass(frozen=True, slots=True)
class OrderLine:
    sku: str
    qty: int
    unit_price: int                       # minor units
    tags: frozenset[str] = field(default_factory=frozenset)

    @property
    def total(self) -> int:
        return self.qty * self.unit_price
```

`@dataclass` generates `__init__`, `__repr__`, `__eq__` (and with flags: ordering, hash, slots) from annotations. Rules that matter: mutable defaults require `default_factory` (the decorator refuses `[]`, catching the trap for you); `frozen=True` gives immutability + hashability; use `kw_only=True` on big configs. Enums replace string/int constants with typo-proof, exhaustively-checkable values — `OrderStatus("paid")` parses, `list(OrderStatus)` enumerates, and `match` statements can cover all cases.

`classmethod` vs `staticmethod`, since it's on every interview list: a `@classmethod` receives the class (`cls`) — its canonical use is **alternative constructors** (`OrderLine.from_json(...)` — and it respects subclassing); a `@staticmethod` receives nothing — it's a namespaced plain function.

## Common mistakes

1. **Class attributes as instance state** — `class Basket: items = []` shares one list across every instance. Initialize mutable state in `__init__`.
2. **Forgetting `NotImplemented`** in comparisons — breaks mixed-type operations and reflected ops.
3. **Overriding `__eq__` without `__hash__`** — instances silently become unhashable.
4. **Hard-coding parent calls** (`B.__init__(self)`) in multiple inheritance — bypasses the MRO; some classes run twice or never. Use `super()`.
5. **`isinstance` ladders** instead of polymorphism — `if isinstance(x, Circle): ... elif isinstance(x, Square)` is a method waiting to be born.
6. **God objects** — a class named `Manager`/`Handler` with 40 methods is several classes; apply single responsibility.
7. **`__getattr__` typo black holes** — a permissive `__getattr__` returning defaults makes attribute typos silent forever.

## Best practices

- Implement `__repr__` on everything you'll ever see in a log or debugger. It pays for itself the first incident.
- Model **records** as frozen dataclasses, **closed choices** as Enums, **behavior contracts** as Protocols/ABCs, and reach for plain classes when there's real invariant-guarding logic.
- Validate invariants at construction (`__post_init__` in dataclasses) so invalid objects cannot exist.
- Keep inheritance trees ≤ 2 levels deep in application code; push shared behavior into composition or mixins with no state.
- Public attribute by default; property when logic appears; never Java-style `get_x()` methods.

## Performance & memory notes

- A plain instance carries a `__dict__` (~296 bytes empty in 3.12, plus entries); `__slots__` cuts a 3-field object from ~350 to ~150 bytes and speeds attribute access ~10–20%. It matters at 10⁶ instances, not 10².
- Attribute access is a dict lookup per dot — in hot loops, hoist (`total = order.total` outside the loop; bind methods to locals).
- Dunder dispatch is looked up **on the type, not the instance** — you cannot monkey-patch `obj.__len__` per-instance; and dunder calls bypass `__getattr__`.
- `cached_property` stores into the instance dict, so subsequent reads are plain attribute speed (it therefore requires a `__dict__` — incompatible with bare `__slots__`).

## Production tips

- Frozen dataclasses as DTOs between layers make services dramatically easier to reason about — no action at a distance across a request.
- Enum values in APIs/DBs: store `status.value` (stable string), not `.name`; parse inbound with `OrderStatus(raw)` and let `ValueError` become a 422.
- When two implementations of a Protocol exist (real gateway / fake gateway), production wiring and tests differ by *one constructor argument* — this is dependency injection without a framework.
- Beware `__eq__`/`__hash__` on ORM entities: identity-based semantics are usually correct there (two detached instances of the same row are already tricky enough).

## Interview questions

1. **"Explain the MRO and what `super()` really does."** — C3 linearization; `super()` dispatches to the next class in the *instance's* MRO, enabling cooperative multiple inheritance.
2. **"`__new__` vs `__init__`?"** — Creation (returns instance, static-ish) vs initialization (mutates it); override `__new__` only for immutables/singletons.
3. **"`classmethod` vs `staticmethod`?"** — `cls`-receiving alternative constructors vs namespaced plain functions.
4. **"How would you make a class work with `len()`, `in`, and `for`?"** — `__len__`, `__contains__`, `__iter__` — the container protocols.
5. **"Composition vs inheritance — how do you choose?"** — Substitutability test (LSP), coupling costs, mixins vs has-a; give a concrete refactor example.

## Summary

- Python OOP = protocols: implement dunders and the language works with you.
- Construction is `__new__` → `__init__`; attributes resolve descriptors → instance → class → `__getattr__`; comparisons return `NotImplemented` for strangers.
- MRO + `super()` make mixins safe; deep hierarchies are still a trap — compose by default.
- Dataclasses, enums, properties, slots, Protocols: the modern toolkit that removes 80% of classic OOP boilerplate.

## Exercises

**Easy**

1. Build a `Temperature` class with `__repr__`, `__eq__`, `__lt__`, `__hash__` and verify sorting and set membership.
2. Convert a dict-slinging function (`{"sku":…, "qty":…}`) to a frozen dataclass; add `__post_init__` validation for `qty > 0`.

**Medium**

3. Implement `Playlist` supporting `len`, indexing **with slices** (returning a `Playlist`), `in`, iteration, and `+` (returning a new merged `Playlist`).
4. Create `AuditMixin` (records method-call log) and `RetryMixin` (retries failing methods) and compose them onto a fake `ApiClient` — make `__init__` chains cooperative via `super()` and print the MRO.

**Hard**

5. Write a descriptor `Validated(min=None, max=None, type_=None)` usable as `price = Validated(min=0, type_=int)` on any class — implement `__set_name__`, `__get__`, `__set__`, storing values in the instance dict under a private key.

**Debugging exercise**

6. Users of this class report "all carts share items" *and* "carts disappear from sets after edits." Identify both design bugs:

```python
class Cart:
    items = []
    def __init__(self, owner): self.owner = owner
    def __eq__(self, other): return self.owner == other.owner
    def __hash__(self): return hash((self.owner, tuple(self.items)))
```

**Refactoring exercise**

7. Refactor a `ReportGenerator(BaseGenerator)` that overrides 5 of 6 parent methods into composition: a `Report` class taking `formatter`, `datasource`, `writer` collaborators. List the coupling you removed.

**Mini project**

Design a small plugin system: a `Storage` Protocol (`save`, `load`, `list_keys`), two implementations (`MemoryStorage`, `JsonFileStorage`), a registry populated by a class decorator `@register("memory")`, and a factory `make_storage(name, **cfg)`. Add a third backend without touching existing files — that's the open-closed principle, demonstrated.

## Quiz

<details>
<summary>1. Why does <code>class C: tags = []</code> bite, while <code>class C: LIMIT = 10</code> is fine?</summary>
Both are class attributes shared by all instances — but mutating the list through any instance is visible everywhere, while the int can only be rebound (which creates an instance attribute shadowing the class one).
</details>

<details>
<summary>2. <code>a + b</code>: exact resolution order?</summary>
<code>type(a).__add__(a, b)</code>; if missing or returns NotImplemented → <code>type(b).__radd__(b, a)</code> (tried first if type(b) is a subclass of type(a)); if both decline → TypeError.
</details>

<details>
<summary>3. When is <code>__getattr__</code> called — and <code>__getattribute__</code>?</summary>
<code>__getattr__</code>: only after normal lookup fails. <code>__getattribute__</code>: on <em>every</em> attribute access (override with extreme care, always delegating to <code>super().__getattribute__</code>).
</details>

<details>
<summary>4. What breaks if a mixin's <code>__init__</code> doesn't call <code>super().__init__()</code>?</summary>
The MRO chain stops there — classes after it in the MRO never initialize, with symptoms far from the cause.
</details>

<details>
<summary>5. Why prefer <code>Enum</code> over module-level string constants?</summary>
Typos become errors (<code>OrderStatus("paid ")</code> raises), values are enumerable and exhaustively checkable, types document intent, and IDEs autocomplete them.
</details>

## Further reading

- Python docs — Data Model chapter (read it fully once a year; it pays)
- *Fluent Python* (Ramalho) — Part IV on protocols and inheritance
- Hettinger — "Super considered super!" (the MRO talk)
- `dataclasses`, `enum`, `abc`, `typing.Protocol` docs
