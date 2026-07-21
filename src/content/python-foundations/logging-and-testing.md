## Learning objectives

- Replace `print` with the **`logging`** module and structured logs.
- Write real tests with **pytest**: assertions, fixtures, parametrize.
- **Mock** external dependencies to test in isolation.
- Measure and reason about **coverage** without chasing 100%.

## Prerequisites

[Error Handling](/courses/python-foundations/error-handling) and [SOLID / DI](/courses/python-foundations/solid-clean-code-patterns) (injection makes testing easy).

## The core idea in one line

> Logging tells you what happened in production; tests tell you the code works *before* it gets there — both are how you sleep at night.

**Analogy — a flight recorder and a pre-flight checklist.** Tests are the pre-flight checklist: you verify every system on the ground so failures don't happen at 30,000 feet. Logging is the black box: when something *does* go wrong in the air, you have a detailed record of what led to it. Skip the checklist and you're gambling; skip the recorder and you can't learn from crashes.

## Logging instead of print

`print` has no levels, no timestamps, no routing, and can't be silenced per module. Use `logging`:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
log = logging.getLogger(__name__)      # one logger per module

log.debug("fine-grained detail")       # hidden unless level=DEBUG
log.info("user %s logged in", user_id) # lazy %-formatting — cheap if filtered out
log.warning("retrying after timeout")
log.error("payment failed", exc_info=True)   # include the traceback
```

Levels let you turn verbosity up/down without code changes:

| Level | Use for |
|---|---|
| DEBUG | Developer detail |
| INFO | Normal events (startup, requests) |
| WARNING | Recoverable oddities |
| ERROR | A failed operation |
| CRITICAL | The app can't continue |

> [!TIP]
> Use `log.info("value is %s", x)` (lazy) not `log.info(f"value is {x}")` — the %-form only formats the string if the message is actually emitted, saving work for filtered-out levels.

## Testing with pytest

pytest turns plain functions and `assert` into tests:

```python
# code: math_utils.py
def add(a, b): return a + b

# test: test_math_utils.py
from math_utils import add

def test_add_positives():
    assert add(2, 3) == 5

def test_add_negatives():
    assert add(-1, -1) == -2
```

```bash
pytest -v            # discover and run test_*.py / *_test.py
```

### Parametrize — one test, many cases

```python
import pytest

@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add(a, b, expected):
    assert add(a, b) == expected      # runs three times, reported separately
```

### Fixtures — reusable setup/teardown

```python
@pytest.fixture
def db():
    conn = create_test_db()           # setup
    yield conn                        # hand it to the test
    conn.close()                      # teardown (runs after)

def test_insert(db):                  # ask for the fixture by name
    db.insert("x")
    assert db.count() == 1
```

Fixtures are the clean way to provide test dependencies — and they compose (a fixture can use another).

### Testing exceptions

```python
def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        1 / 0
```

## Mocking external dependencies

Don't hit real networks/APIs in unit tests — replace them with fakes. Dependency injection makes this trivial; `unittest.mock` handles the rest:

```python
from unittest.mock import Mock

def test_signup_sends_email():
    mailer = Mock()                    # a fake mailer
    Signup(mailer).register("a@b.com") # inject it
    mailer.send.assert_called_once()   # assert interaction, no real email
```

For code that constructs its own dependency, `monkeypatch` (a pytest fixture) or `mock.patch` can replace it — but injected dependencies (previous lesson) are cleaner to test.

## Coverage — a guide, not a goal

```bash
pip install pytest-cov
pytest --cov=myapp --cov-report=term-missing
```

Coverage shows which lines ran during tests. Use it to **find untested branches**, not as a target — 100% coverage of trivial code proves little, while 80% covering the risky logic is gold. Cover behavior and edge cases, not lines for their own sake.

## Common mistakes

1. **`print` debugging in production** — no levels, no control; use logging.
2. **Tests that hit real services** — slow, flaky, and can have side effects; mock them.
3. **One giant test** asserting ten things — when it fails you don't know which; split them.
4. **Testing implementation, not behavior** — brittle tests that break on harmless refactors.
5. **Chasing 100% coverage** — covering getters while missing the risky branch.

## Performance & reliability

- Logging at a filtered level is cheap with lazy `%` args; heavy f-strings in hot logs cost even when suppressed.
- Fast unit tests (mocked, no I/O) run in milliseconds — you'll actually run them. Slow tests get skipped.
- Parametrization keeps tests DRY and makes edge cases explicit and countable.

## Interview questions

1. **"Why logging over print?"** — Levels, timestamps, per-module control, routing to files/services, and no code changes to adjust verbosity.
2. **"What's a pytest fixture?"** — Reusable setup/teardown provided to tests by name; composable and clean.
3. **"How do you test code that calls an API?"** — Mock the dependency (inject a fake) and assert behavior/interactions without real calls.
4. **"Is 100% coverage the goal?"** — No — coverage finds gaps; aim to test risky behavior and edge cases, not every trivial line.

## Summary

- Use `logging` with levels and lazy formatting instead of `print`.
- pytest makes tests plain functions with `assert`; parametrize for cases, fixtures for setup.
- Mock external dependencies (easy with DI) to test fast and in isolation.
- Treat coverage as a map of untested code, not a score to max out.

## Exercises

**Easy**

1. Convert a script's `print` debugging to `logging` with appropriate levels.
2. Write two pytest tests for a `slugify` function and run `pytest -v`.

**Intermediate**

3. Parametrize a test over five input/expected pairs.
4. Write a fixture that provides a temporary directory and a test that uses it.

**Advanced**

5. Test a class that emails users by injecting a mock mailer; assert it's called with the right arguments and that a failure path logs an error.

**Debugging**

6. A test is flaky — sometimes it passes, sometimes not. It calls a real weather API. Explain why and refactor it to be deterministic.

**Mini project**

Take a small module you wrote earlier (e.g. the JSON store) and add: structured logging, a full pytest suite (fixtures, parametrize, exception tests, a mock for any external dependency), and a coverage report. Get the risky branches to 100% and note what you deliberately left uncovered.

## Quiz

<details>
<summary>1. Why prefer `log.info("x=%s", x)` over an f-string?</summary>
The %-form defers formatting until the message is actually emitted, saving work for filtered-out levels.
</details>

<details>
<summary>2. What does a pytest fixture provide?</summary>
Reusable setup (and teardown after `yield`) injected into tests by parameter name.
</details>

<details>
<summary>3. How do you keep external APIs out of unit tests?</summary>
Inject a fake/mock dependency and assert on interactions instead of making real calls.
</details>

<details>
<summary>4. Should you aim for 100% coverage?</summary>
No — use coverage to find untested branches; prioritize testing risky behavior and edge cases.
</details>

## Further reading

- Python docs: `logging`, `unittest.mock`; pytest and pytest-cov docs
- The advanced course's [Exceptions, Logging & Observability](/courses/python/errors-logging-and-observability)
- Next lesson: [Performance, Memory & Best Practices](/courses/python-foundations/performance-and-memory)
