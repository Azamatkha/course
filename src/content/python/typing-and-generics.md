## Learning objectives

- Annotate real code with modern syntax (3.10+): unions with `|`, builtin generics, `Optional` done right.
- Explain what type hints do and don't do at runtime — and why that design was chosen.
- Write generic functions and classes with `TypeVar` / PEP 695 syntax, and constrain them properly.
- Use `Protocol` for structural typing at architecture boundaries.
- Run mypy/pyright in CI with a strictness profile that helps instead of hurts.

## Prerequisites

[OOP and the Data Model](/courses/python/oop-and-the-data-model) — Protocols build on the duck-typing story there.

## What type hints actually are

Python's typing is **gradual and (mostly) erased**: annotations are metadata stored on functions/classes (`__annotations__`), and CPython **does not check them at runtime**:

```python
def double(x: int) -> int:
    return x * 2

double("ab")     # 'abab' — runs fine; hints are not enforcement
```

The value comes from three consumers:

1. **Static checkers** (mypy, pyright) — find whole classes of bugs before running: wrong arguments, `None` leaks, impossible branches, misspelled attributes.
2. **IDEs** — autocomplete, refactoring, inline docs. This alone repays the effort.
3. **Runtime frameworks** — FastAPI, Pydantic, dataclasses, Typer *read* annotations to generate validation, serialization, and CLIs. Same syntax, different consumer.

The economics: on a 500-line script, types are optional polish. On a 100k-line codebase with ten engineers, they're the difference between refactoring confidently and refactoring by prayer. Type hints are **machine-checked documentation that cannot go stale**.

## The modern essentials

```python
def find_user(user_id: int) -> User | None: ...          # 3.10+ union syntax

def tag_all(items: list[str], sep: str = ",") -> dict[str, int]: ...  # builtin generics (3.9+)

from collections.abc import Sequence, Mapping, Iterable, Callable

def total(prices: Sequence[float]) -> float: ...          # accept ANY sequence
def apply(fn: Callable[[int, str], bool], n: int) -> bool: ...
```

**Guidance that separates juniors from seniors:**

- **Accept abstract, return concrete.** Take `Iterable[str]`/`Mapping[str, int]` (callers can pass anything conforming); return `list[str]`/`dict[str, int]` (callers know exactly what they get).
- **`X | None` must be handled.** The checker forces a narrow before use — this is the single biggest bug-catcher in the system:

```python
user = find_user(42)
user.name             # ✗ mypy: item "None" has no attribute "name"
if user is not None:
    user.name         # ✓ narrowed
```

- **Narrowing** happens via `if x is None`, `isinstance`, `assert`, `match`, and early `return`/`raise` — write code the checker can follow and it usually reads naturally for humans too.
- Other daily tools: `Literal["asc", "desc"]` (closed string sets), `TypedDict` (shape-typed dicts for JSON), `NewType("UserId", int)` (distinct ids that don't mix), `Annotated[int, Field(gt=0)]` (attach metadata — Pydantic/FastAPI's foundation), `Self` (fluent APIs), `TypeAlias`/`type X = ...` for readable signatures.

## Generics: preserving type relationships

The problem `Any` can't solve: `def first(xs: list[Any]) -> Any` *loses* the connection between input and output. Generics preserve it:

```python
from typing import TypeVar
T = TypeVar("T")

def first(xs: list[T]) -> T | None:
    return xs[0] if xs else None

first([1, 2, 3])        # inferred: int | None
first(["a", "b"])       # inferred: str | None
```

Python 3.12 (PEP 695) makes this first-class syntax:

```python
def first[T](xs: list[T]) -> T | None: ...

class Repository[M]:                      # generic class
    def __init__(self, model: type[M]) -> None:
        self.model = model
    def get(self, id: int) -> M | None: ...
    def add(self, obj: M) -> M: ...

user_repo = Repository(User)              # Repository[User]
user_repo.get(1)                          # → User | None, statically known
```

**Constraining type variables:**

```python
def clamp[N: (int, float)](x: N, lo: N, hi: N) -> N: ...       # constraints: exactly these
def largest[C: SupportsLessThan](items: list[C]) -> C: ...     # bound: anything comparable
```

A **bound** (`T: SomeBase`) means "any subtype of"; **constraints** (`T: (int, float)`) mean "exactly one of these". Use a plain `T` when types just flow through; add bounds only when the body needs operations on the values.

## Protocols: structural typing, statically checked

Nominal typing asks "do you inherit X?"; structural typing asks "do you have the right methods?" — duck typing, verified by the checker:

```python
from typing import Protocol

class EventSink(Protocol):
    def emit(self, name: str, payload: dict[str, object]) -> None: ...

def checkout(cart: Cart, sink: EventSink) -> Receipt:
    ...
    sink.emit("order.placed", {"total": receipt.total})
```

Any class with a matching `emit` satisfies `EventSink` — a Kafka producer, a stdout logger, a test spy — **without importing or inheriting anything from your module**. This is the typed version of Python's soul, and the cleanest way to express ports/adapters boundaries ([clean architecture lesson](/courses/fastapi/architecture-testing-deployment)). Add `@runtime_checkable` only if you need `isinstance` checks (it verifies method *names* only, not signatures).

Related: **variance** in one paragraph. `list[Dog]` is *not* a `list[Animal]` (you could `.append(Cat())` through the alias) — mutable containers are invariant. Read-only types are covariant: `Sequence[Dog]` *is* acceptable where `Sequence[Animal]` is wanted. Callables are contravariant in arguments. Practical takeaway: **annotate parameters with read-only ABCs** and variance problems mostly disappear.

## Running a checker for real

```toml
# pyproject.toml
[tool.mypy]
python_version = "3.12"
strict = true                       # aspire to this
warn_unused_ignores = true

[[tool.mypy.overrides]]
module = "legacy.*"
ignore_errors = true                # ratchet: shrink this list over time
```

Adoption strategy for existing codebases: turn on basic checking everywhere; enforce `strict` for **new** modules; keep a shrinking exclusion list for legacy; add mypy/pyright to CI so the ratchet only tightens. Escape hatches — use precisely: `cast(X, val)` ("trust me", zero runtime effect), `# type: ignore[code]` (always with the error code), `Any` (infectious — quarantine it at I/O boundaries).

## Common mistakes

1. **`Any` everywhere** — it silences the checker transitively; every operation on `Any` is `Any`. Prefer `object` when you mean "anything, and I'll narrow before use".
2. **Forgetting `-> None`** on procedures — an unannotated return means *untyped function* to mypy (checks off inside!), not "returns None".
3. **`Optional` without handling** at call sites — if you find yourself sprinkling `assert x`, reconsider whether the function should raise instead of returning `None`.
4. **Over-precise parameters** — demanding `list[int]` where `Iterable[int]` works rejects tuples, sets, and generators for no reason.
5. **Mutable default + annotation confusion** — `def f(x: list[int] = [])` is still the shared-default trap; typing doesn't fix runtime semantics.
6. **Annotating locals everywhere** — inference handles locals; annotate signatures and non-obvious/empty collections (`users: dict[int, User] = {}`).
7. **Trusting hints as validation** — external input needs runtime validation (Pydantic); hints only constrain your own code.

## Best practices

- Type all **public signatures**; let inference do the rest.
- Model with types: `Literal` for closed sets, `Enum` for domain choices, `NewType` for ids, `TypedDict` for wire shapes, frozen dataclasses for records — make illegal states unrepresentable.
- Put `Protocol`s at layer boundaries (storage, gateways, notifiers) — tests then need no mocking framework, just conforming fakes.
- Prefer `collections.abc` imports over `typing` equivalents (the `typing` aliases are deprecated).
- Run the checker in CI at the same strictness locally — a checker you can ignore is decoration.

## Performance & memory notes

- Hints have ~zero runtime cost: evaluated once at definition (and PEP 563/649 make even that lazy). `from __future__ import annotations` defers evaluation entirely — also fixing forward references.
- `typing.get_type_hints()` resolution is what costs — frameworks (Pydantic, FastAPI) do it once at startup, which is the right pattern for your own annotation-reading code too.
- `cast()` is an identity function at runtime; `isinstance` checks are real work — narrowing design affects hot paths.
- Checker runtime scales with codebase; use mypy's daemon (`dmypy`) or pyright's watch mode for sub-second feedback.

## Production tips

- **Ban unchecked `Any` at the boundary**: parse JSON into TypedDicts/Pydantic models immediately; the interior of the service then operates on trustworthy types.
- Publish libraries with a `py.typed` marker file so downstream checkers see your hints.
- `reveal_type(expr)` (checker-only pseudo-function) is your printf for types — use it while debugging inference.
- Type stubs (`.pyi`, `types-*` packages on PyPI) cover untyped dependencies; missing stubs → `ignore_missing_imports` per-module, never globally.

## Interview questions

1. **"Do type hints affect runtime behavior?"** — No enforcement; stored metadata consumed by checkers/IDEs/frameworks; mention Pydantic as the runtime-consumer exception.
2. **"`Any` vs `object`?"** — `Any` disables checking bidirectionally; `object` is the honest top type requiring narrowing before use.
3. **"What problem do generics solve?"** — Preserving type relationships through functions/classes (input list of T → return T), enabling precise reusable containers/repositories.
4. **"Protocol vs ABC?"** — Structural vs nominal; Protocols need no inheritance/import — ideal for third-party conformance and decoupled boundaries; ABCs add runtime enforcement and shared implementation.
5. **"Why is `list` invariant but `Sequence` covariant?"** — Mutability: writing through an up-cast alias would break soundness; read-only interfaces can't be abused that way.

## Summary

- Hints are erased at runtime; their power is static checking, IDE intelligence, and annotation-driven frameworks.
- Daily kit: `X | None` + narrowing, abstract-in/concrete-out, `Literal`, `TypedDict`, `NewType`, `Annotated`.
- Generics preserve type flow; bounds/constraints control what the body may do; PEP 695 makes syntax clean.
- Protocols = statically-checked duck typing = the typed form of dependency inversion.
- Strict checker in CI + `Any` quarantined at the boundary = refactoring with confidence.

## Exercises

**Easy**

1. Annotate an untyped 5-function module (given: string utils and a dict-shuffling helper), then make `mypy --strict` pass.
2. Write `parse_port(raw: str) -> int | None` and a caller that mypy forces to handle `None`; then a raising variant `parse_port_strict` and compare call sites.

**Medium**

3. Implement `Stack[T]` with `push`, `pop() -> T`, `peek() -> T | None`; verify inference: `Stack[int]().pop()` is `int`.
4. Define a `Cache(Protocol)` with `get`/`set`; implement `RedisLikeCache` and `DictCache` (no shared base); write `memoize(cache: Cache)` and type-check both wirings.

**Hard**

5. Type a `pipeline(*fns)` composition helper for the 2-function and 3-function cases with `@overload`, so `pipeline(str.strip, len)("  hi ")` reveals `int`.

**Debugging exercise**

6. mypy reports nothing wrong with this buggy function — explain why, and fix the *annotations* so the bug becomes a type error:

```python
def merge(a, b):
    return {**a, **b}

merge({"x": 1}, [("y", 2)])   # runtime TypeError
```

**Refactoring exercise**

7. Refactor a function taking `data: dict` (raw JSON order payload, accessed with string keys throughout) into a `TypedDict` + a parse function; count how many latent KeyError/typo sites the checker now covers.

**Mini project**

Build a typed, minimal DI container: `container.register(EventSink, KafkaSink(...))`, `container.resolve(EventSink) -> EventSink` — with `resolve` typed via `type[T] -> T` so resolving returns precisely typed objects. Use it to wire a small service with a Protocol boundary and swap in a fake for tests.

## Quiz

<details>
<summary>1. What does mypy check inside a function with unannotated signature?</summary>
By default, nothing — untyped defs are skipped. (<code>--check-untyped-defs</code>/strict changes this.) Annotating the signature turns checking on.
</details>

<details>
<summary>2. <code>def f(xs: list[Animal])</code> — can you pass <code>list[Dog]</code>? And <code>Sequence[Animal]</code> vs <code>list[Dog]</code>?</summary>
No — list is invariant (f could append a Cat). Yes for <code>Sequence[Animal]</code> — read-only, hence covariant.
</details>

<details>
<summary>3. Runtime effect of <code>cast(User, obj)</code>?</summary>
None — it returns obj unchanged. It's purely an instruction to the checker (and a lie if you're wrong).
</details>

<details>
<summary>4. When do you need <code>TypeVar</code> bounds?</summary>
When the generic body uses operations on the values (comparison, arithmetic, specific methods) — the bound proves those operations exist.
</details>

<details>
<summary>5. Why must FastAPI-style frameworks still validate at runtime if everything is typed?</summary>
Hints constrain your code, not the outside world — an HTTP client can send anything; runtime validation (Pydantic) enforces the contract at the boundary.
</details>

## Further reading

- mypy docs — "Type hints cheat sheet" and "Common issues"
- PEP 484, 544 (Protocols), 585, 604, 695
- pyright's typing guidance (excellent on variance and narrowing)
