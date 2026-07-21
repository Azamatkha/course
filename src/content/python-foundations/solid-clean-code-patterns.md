## Learning objectives

- Apply the five **SOLID** principles in Python.
- Use **dependency injection** (the electrical-socket analogy) for testable code.
- Recognize the handful of **design patterns** Python actually uses.
- Write clean, readable code that other engineers can change safely.

## Prerequisites

[OOP, ABCs & Protocols](/courses/python-foundations/oop-abc-protocols). Some real code you've had to maintain helps the lessons land.

## The core idea in one line

> SOLID and clean code are **habits that keep software changeable** — the real cost of code is not writing it once, but modifying it for years.

**Analogy — a well-organized workshop.** Bad code is a workshop where every tool is welded to the bench: to change one thing you must cut through five others. SOLID is keeping tools on labeled, swappable racks: each does one job, you can replace a tool without rebuilding the bench, and a new worker finds things instantly. Clean code is that workshop; a change that took a day now takes an hour.

## SOLID

### S — Single Responsibility

A class/function should have **one reason to change**.

```python
# BAD: does everything → changes for report format, DB, and email reasons
class Report:
    def generate(self): ...
    def save_to_db(self): ...
    def email(self): ...

# GOOD: split responsibilities
class Report: ...            # the data
class ReportRepository: ...  # persistence
class ReportMailer: ...      # delivery
```

### O — Open/Closed

Open for extension, closed for modification — add behavior without editing existing code.

```python
# Add a new shape by writing a new class, not by editing an if/elif chain.
class Shape(Protocol):
    def area(self) -> float: ...
def total_area(shapes: list[Shape]) -> float:
    return sum(s.area() for s in shapes)     # never changes when you add a shape
```

### L — Liskov Substitution

A subtype must be usable anywhere its base is, without surprises. A `Square(Rectangle)` that breaks `set_width` violates it — the subclass changed expected behavior.

### I — Interface Segregation

Prefer small, focused interfaces over one fat one. Don't force a class to implement methods it doesn't need — split `Readable` and `Writable` rather than one `File` protocol.

### D — Dependency Inversion

Depend on **abstractions**, not concrete implementations.

```python
class Notifier(Protocol):
    def send(self, msg: str) -> None: ...

class OrderService:
    def __init__(self, notifier: Notifier):   # depends on the abstraction
        self.notifier = notifier
    def place(self, order):
        self.notifier.send("order placed")    # doesn't care if it's email/SMS/mock
```

## Dependency injection

**Analogy — electrical sockets.** Your laptop doesn't hardwire into the building's wiring — it plugs into a standard socket. You can plug it in at home, the office, or a test bench. DI is giving a class its collaborators through a "socket" (its constructor) instead of hardwiring them:

```python
# Hardwired — untestable (always hits the real email server)
class Signup:
    def __init__(self):
        self.mailer = SmtpMailer()          # welded in

# Injected — swap a fake in tests, real in prod
class Signup:
    def __init__(self, mailer: Notifier):   # plugged in from outside
        self.mailer = mailer

Signup(SmtpMailer())        # production
Signup(FakeMailer())        # tests — no network, assert on the fake
```

DI is the single biggest lever for testability. FastAPI's `Depends`, and most frameworks, are built on it.

## Design patterns Python actually uses

| Pattern | Python form |
|---|---|
| **Strategy** | Pass a function/callable to vary behavior |
| **Factory** | A function that builds and returns configured objects |
| **Adapter** | Wrap a foreign interface behind your own (your LLM client!) |
| **Decorator** | Language-level `@decorator` |
| **Singleton** | A module (imported once) — no class needed |
| **Observer** | Callbacks / pub-sub |

Python's first-class functions mean many "patterns" collapse to "pass a function." Don't cargo-cult Java patterns — reach for the Pythonic form.

```python
# Strategy in Python is just a callable parameter:
def sort_by(items, key):        # `key` is the strategy
    return sorted(items, key=key)
```

## Clean code habits

- **Names reveal intent** — `days_until_expiry`, not `d`.
- **Small functions** doing one thing; if you need "and" to describe it, split it.
- **Avoid deep nesting** — use early returns / guard clauses.
- **Don't repeat yourself** — but don't over-abstract two coincidentally-similar lines.
- **Comments explain *why*, not *what*** — the code says what.

## Common mistakes

1. **God classes** doing everything — violate SRP; painful to change/test.
2. **Hardwired dependencies** — untestable; inject instead.
3. **if/elif chains on type** — violate OCP; use polymorphism/dispatch.
4. **Pattern cargo-culting** — a Java-style Singleton class where a module suffices.
5. **Premature abstraction** — layers "for flexibility" nobody needs (YAGNI).

## Performance & readability tradeoffs

- Abstractions add indirection; usually negligible, occasionally matters in hot loops — measure before optimizing.
- Clean code's payoff is *maintenance* speed, not runtime speed — it's an investment in future change.
- DI has essentially zero runtime cost and large testability upside.

## Interview questions

1. **"Explain SOLID."** — SRP (one reason to change), OCP (extend not modify), LSP (substitutable subtypes), ISP (small interfaces), DIP (depend on abstractions).
2. **"What is dependency injection and why?"** — Passing collaborators from outside; enables swapping real/fake for testability and flexibility.
3. **"Which patterns are common in Python?"** — Strategy, factory, adapter, decorator; often just "pass a function" or "use a module."
4. **"How does DIP improve testing?"** — Depending on an abstraction lets you inject a fake implementation in tests.

## Summary

- SOLID keeps code changeable: single responsibility, extend-don't-modify, safe substitution, small interfaces, depend on abstractions.
- Dependency injection (the socket) is the key to testable code.
- Use Pythonic pattern forms — first-class functions replace much ceremony.
- Clean names, small functions, and early returns compound over a codebase's life.

## Exercises

**Easy**

1. Split a class that generates, saves, and emails a report into three single-responsibility classes.
2. Rewrite an `if shape_type == ...` area calculator using polymorphism (OCP).

**Intermediate**

3. Refactor a class with a hardwired dependency to accept it via the constructor; write a test using a fake.
4. Implement "strategy" as a callable parameter for a `discount(price, strategy)` function.

**Advanced**

5. Design a small order-processing module applying all five SOLID principles; justify each choice and note where you deliberately kept it simple (YAGNI).

**Debugging**

6. A test can't run without hitting a real payment API. Identify the design flaw and refactor it so a fake can be injected.

**Mini project**

Take a messy 200-line "does everything" script and refactor it into clean, SOLID modules with dependency injection and tests. Write a short before/after note on what got easier to change.

## Quiz

<details>
<summary>1. What does the "S" in SOLID mean?</summary>
Single Responsibility — a class/function should have one reason to change.
</details>

<details>
<summary>2. What problem does dependency injection solve?</summary>
Hardwired collaborators make code rigid and untestable; injecting them lets you swap real/fake implementations.
</details>

<details>
<summary>3. What's the Pythonic form of the Strategy pattern?</summary>
Passing a function/callable as a parameter to vary behavior.
</details>

<details>
<summary>4. Why avoid if/elif-on-type chains?</summary>
They violate Open/Closed — every new case edits existing code; polymorphism/dispatch extends without modifying.
</details>

## Further reading

- "Clean Code" (Martin) and "Refactoring" (Fowler) — read critically for Python
- "Architecture Patterns with Python" (Percival & Gregory)
- Next lesson: [Logging & Testing with Pytest](/courses/python-foundations/logging-and-testing)
