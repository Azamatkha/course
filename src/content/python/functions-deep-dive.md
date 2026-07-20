## Learning objectives

- Use every part of Python's argument machinery: positional-only, keyword-only, `*args`, `**kwargs`, and defaults — and know what happens at call time.
- Treat functions as first-class objects: attributes, `__code__`, `__defaults__`, and why that matters for decorators.
- Design function signatures the way library authors do.
- Inspect any callable with `inspect.signature` and build tools on top of it.
- Answer the interview staples about `*args/**kwargs` and argument binding.

## Prerequisites

The [execution model](/courses/python/python-execution-model) and [names & references](/courses/python/variables-objects-references) lessons — you should already know that parameters are names bound to the caller's objects and that defaults evaluate at `def` time.

## A function is an object

`def` is an executable statement. When it runs, CPython builds a **function object** wrapping a compiled **code object**, and binds the function's name in the current namespace:

```python
def greet(name, punctuation="!"):
    """Return a greeting."""
    return f"Hello, {name}{punctuation}"

greet.__name__        # 'greet'
greet.__doc__         # 'Return a greeting.'
greet.__defaults__    # ('!',)          ← evaluated once, stored here
greet.__code__.co_varnames  # ('name', 'punctuation')
greet.__module__      # where it was defined
```

Because functions are ordinary objects you can: store them in dicts (dispatch tables), pass them as arguments (callbacks, `sorted(key=...)`), return them (closures, decorators), and attach attributes to them. This is the foundation of half of Python's idioms.

```python
handlers = {
    "created": handle_created,
    "deleted": handle_deleted,
}
handlers[event.type](event)      # dispatch table — no if/elif ladder
```

## The full signature grammar

Python 3.8+ signatures have five parameter kinds, in fixed order:

```python
def f(pos_only, /, normal, *args, kw_only, **kwargs):
    ...
```

| Kind | Syntax | Callable as |
|---|---|---|
| Positional-only | before `/` | `f(1)` only |
| Positional-or-keyword | between `/` and `*` | `f(2)` or `f(normal=2)` |
| Var-positional | `*args` | collects extra positionals into a tuple |
| Keyword-only | after `*` or `*args` | `f(kw_only=3)` only |
| Var-keyword | `**kwargs` | collects extra keywords into a dict |

**Why positional-only (`/`)?** It frees you to rename parameters without breaking callers, and prevents nonsense like `len(obj=xs)`. Most of the C-implemented stdlib is positional-only.

**Why keyword-only (`*`)?** It makes call sites self-documenting and future-proof. Compare `copy_file(src, dst, True, False)` with `copy_file(src, dst, follow_symlinks=True, overwrite=False)`. Library convention: **boolean flags should be keyword-only.**

```python
def copy_file(src, dst, *, overwrite=False, follow_symlinks=True): ...
```

### `*args` and `**kwargs`

At **definition**, they *collect*; at a **call site**, `*`/`**` *unpack*:

```python
def log_call(fn, *args, **kwargs):        # collect anything
    print(f"calling {fn.__name__}")
    return fn(*args, **kwargs)            # unpack, pass through unchanged

log_call(pow, 2, 10)                       # calling pow → 1024
log_call(dict, a=1, b=2)                   # calling dict → {'a': 1, 'b': 2}
```

This pass-through pattern is the skeleton of every decorator. Two details worth knowing:

- `kwargs` is a regular dict preserving insertion order.
- Unpacking works in literals too: `merged = {**base, **overrides}`, `wide = [*xs, *ys]`.

### How argument binding actually works

At call time CPython matches arguments to parameters: positionals fill left-to-right (stopping at `*`), keywords match by name, missing values fall back to defaults, leftovers go to `*args`/`**kwargs`, and anything unmatched raises `TypeError`. The `inspect` module exposes the same algorithm:

```python
import inspect

sig = inspect.signature(copy_file)
bound = sig.bind("a.txt", "b.txt", overwrite=True)
bound.apply_defaults()
bound.arguments   # {'src': 'a.txt', 'dst': 'b.txt', 'overwrite': True, 'follow_symlinks': True}
```

`signature.bind` is how frameworks validate calls without making them — FastAPI, pytest fixtures, and CLI libraries are built on exactly this.

## Lambdas — the honest guidance

`lambda args: expr` builds an anonymous function limited to a single expression. Legitimate uses are short, inline, single-use: `sorted(users, key=lambda u: u.created_at)`, simple `defaultdict` factories. Prefer named functions when the logic has a name worth writing, and prefer `operator.itemgetter("price")` / `attrgetter("created_at")` — they're faster and clearer. Never `f = lambda x: ...` — that's just `def` without a real name in tracebacks (PEP 8 flags it).

## Common mistakes

1. **Mutable defaults** — `def f(x, acc=[])`. Covered in depth [here](/courses/python/mutability-and-copies); it belongs on this list forever.
2. **Silently swallowing typos via `**kwargs`.** `def create(**kwargs)` accepts `emial="x"` without error. Take explicit keyword-only params unless you truly forward blindly.
3. **Late-binding lambda in loops.** `[lambda: i for i in range(3)]` — all return 2. Fix with a default: `lambda i=i: i` (full story in the [closures lesson](/courses/python/closures-and-legb)).
4. **Ordering violations.** Parameters must go positional → `*args` → keyword-only → `**kwargs`; a default-less parameter can't follow one with a default (except across the `*` boundary).
5. **Calling with unpacked huge generators** — `f(*huge_gen)` materializes the whole thing into a tuple first.
6. **Shadowing builtins as parameter names** (`def f(list, id):`) — legal, and a reliable source of confusing bugs three lines later.

## Best practices

- **Small signatures.** More than ~4 meaningful parameters usually means a dataclass/config object wants to exist.
- **Keyword-only for flags and rarely-used options**; positional for the 1–3 obvious core arguments.
- Type-hint public functions — hints document binding *and* enable tooling ([typing lesson](/courses/python/typing-and-generics)).
- Docstring the contract, not the mechanics: what it returns, what it raises, whether it mutates arguments.
- **Pure by default**: take inputs, return outputs, avoid hidden state. Pure functions are trivially testable and parallelizable; impure ones should look impure (`save_user`, `send_email`).

## Performance & memory notes

- Each call creates a **frame object** (locals, stack) — calls cost ~50–100ns. Python 3.11+ made frames cheaper and inlined many calls; still, don't split nanosecond-hot loops into micro-functions.
- `*args`/`**kwargs` allocate a fresh tuple/dict per call — negligible per call, measurable in tight loops versus fixed-arity calls.
- Default values live on the function object — a heavyweight default (big dict, compiled regex) is built once, which is *good*; exploit it deliberately (`pattern=re.compile(...)` as a module constant, referenced in the signature).
- Closures and functions keep their module alive; a function stored in a long-lived registry pins everything it references.

## Production tips

- Public API functions of a library/service client should use `/` and `*` deliberately — they are your compatibility contract. Renaming a positional-or-keyword parameter is a breaking change; renaming a positional-only one is not.
- Log function boundaries at DEBUG with `functools.wraps`-preserving decorators, not by hand-editing every function.
- For config-taking entry points, accept a frozen dataclass instead of ten parameters: versionable, validatable, testable.

## Interview questions

1. **"Explain `*args` and `**kwargs`."** — Collect extra positional/keyword arguments at definition; unpack sequences/mappings at call sites; the pass-through pattern powers decorators.
2. **"What does `/` mean in a signature?"** — Everything before it is positional-only (PEP 570); protects parameter names from becoming API.
3. **"Why is `def f(a=[])` dangerous?"** — Single default object evaluated at def time, shared across calls.
4. **"How would you write a function accepting any callable and calling it with logged arguments?"** — `def wrapper(fn, *a, **kw): log(a, kw); return fn(*a, **kw)`; mention `inspect.signature` for named binding.
5. **"What's the difference between a parameter and an argument?"** — Parameter: the name in the def; argument: the object passed at call time and bound to it.

## Summary

- Functions are first-class objects carrying their code, defaults, and metadata — the basis for dispatch tables, callbacks, and decorators.
- The five parameter kinds (`/`, normal, `*args`, keyword-only, `**kwargs`) let you design precise, evolvable signatures.
- `*`/`**` collect in definitions and unpack at call sites; `inspect.signature` exposes the binding algorithm to your own tools.
- Keyword-only flags, small signatures, and purity are the habits that make codebases pleasant at scale.

## Exercises

**Easy**

1. Write `clamp(value, /, lo=0.0, hi=1.0)` with `value` positional-only. Verify `clamp(value=2)` raises `TypeError`.
2. Using unpacking only (no loops), merge three dicts where later ones win, and build `[0, *middle, 9]` from `middle = range(1, 9)`.

**Medium**

3. Write `partial_right(fn, *fixed)` returning a function that appends `fixed` to the call's positionals (like `functools.partial` but from the right). Preserve `__name__` manually.
4. Using `inspect.signature`, write `validate_call(fn, *args, **kwargs)` that returns the bound-arguments dict or raises a friendly error listing missing/unexpected parameters — without calling `fn`.

**Hard**

5. Build a `@dispatch_on_type` decorator implementing single dispatch by the first argument's type with an explicit registry (`fn.register(int)`), then compare your design with `functools.singledispatch`.

**Debugging exercise**

6. This retry helper breaks for some functions. Find both bugs (mutable default; kwargs collision when `fn` itself takes `attempts`):

```python
def retry(fn, args=[], attempts=3, **kwargs):
    for i in range(attempts):
        try:
            return fn(*args, **kwargs)
        except Exception:
            continue
```

**Refactoring exercise**

7. Refactor to keyword-only flags and a sane signature: `def export(data, fmt, pretty, sort, ascii_only, path): ...` currently called as `export(rows, "json", True, False, True, "/tmp/x")`.

**Mini project**

Write a mini CLI framework: a `@command` decorator that reads a function's signature via `inspect` and generates an `argparse` parser — positional params become positional CLI args, keyword-only params with defaults become `--flags`, annotations drive `type=`. One function + one decorator = a working CLI.

## Quiz

<details>
<summary>1. In <code>def f(a, *, b=1, **kw)</code>, how can <code>b</code> be passed?</summary>
Only as a keyword: <code>f(1, b=2)</code>. It sits after <code>*</code>, so positionally it's unreachable; <code>f(1, 2)</code> is a TypeError.
</details>

<details>
<summary>2. What exactly does <code>fn(*data)</code> do if <code>data</code> is a generator?</summary>
Fully consumes the generator into a tuple, then binds elements as positional arguments — dangerous for large/infinite generators.
</details>

<details>
<summary>3. Where are default values stored, and when are they created?</summary>
On the function object (<code>__defaults__</code> / <code>__kwdefaults__</code>), created once when <code>def</code> executes.
</details>

<details>
<summary>4. Why prefer <code>operator.attrgetter("x")</code> over <code>lambda o: o.x</code> for sort keys?</summary>
It's implemented in C (faster in hot sorts), pickles cleanly (multiprocessing), and states intent directly.
</details>

<details>
<summary>5. What error do you get for <code>def f(a=1, b)</code> and why?</summary>
<code>SyntaxError</code> — after a defaulted parameter, non-default positional parameters are ambiguous to bind, so the grammar forbids them (keyword-only params after <code>*</code> are exempt).
</details>

## Further reading

- PEP 570 (positional-only), PEP 3102 (keyword-only)
- `inspect` module docs — `signature`, `BoundArguments`
- `functools.partial`, `operator` module
