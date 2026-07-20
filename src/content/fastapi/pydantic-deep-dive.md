## Learning objectives

- Explain what Pydantic v2 does at the boundary: parse, coerce, validate, serialize — and why "parse, don't validate" is the design philosophy.
- Build models with constrained fields, custom validators, nested structures, and computed output.
- Separate input/output/DB schemas correctly in an API codebase.
- Manage configuration with `BaseSettings`.
- Know the performance characteristics (Rust core) and the traps (mutable defaults, over-validation on hot paths).

## Prerequisites

[Typing](/courses/python/typing-and-generics) — Pydantic is *runtime enforcement* of exactly those annotations. [ASGI lesson](/courses/fastapi/asgi-and-starlette) for where validation sits in the request path.

## Parse, don't validate

Type hints constrain your code; the outside world ignores them. Every byte arriving over HTTP is untrusted `bytes → json → Any`. Pydantic's job is to be the **boundary** that turns untrusted soup into trusted, typed objects — or a precise error:

```python
from pydantic import BaseModel, Field, EmailStr

class UserIn(BaseModel):
    email: EmailStr
    display_name: str = Field(min_length=2, max_length=50)
    age: int = Field(ge=13, le=130)
    tags: list[str] = Field(default_factory=list, max_length=10)

UserIn.model_validate({"email": "a@b.co", "display_name": "Aziza",
                       "age": "19", "tags": ["dev"]})
# age arrives as str "19" → coerced to int 19 — parsing, not just checking
```

Key ideas:

- **Coercion**: v2's default "smart mode" converts compatibles (`"19"` → 19, `"true"` → True) because wire formats (JSON, forms, env vars) are stringly-typed; `model_config = ConfigDict(strict=True)` (or `Strict*` types) turns it off where exactness matters.
- **Errors are data**: `ValidationError` carries a list of `{loc, msg, type}` — every invalid field, not just the first. FastAPI converts it to the 422 response verbatim; that error contract is why FastAPI clients get good messages for free.
- **After validation, downstream code needs no defensive checks** — `user.age` *is* an int in range. Validation once at the edge beats sprinkled `isinstance`/`if not x` checks everywhere ("parse, don't validate").
- v2's core is **Rust** (`pydantic-core`): validation runs 5–50× faster than v1 — fast enough to validate everything at the boundary without thinking twice.

## Validators and model shaping

```python
from pydantic import field_validator, model_validator

class Booking(BaseModel):
    start: datetime
    end: datetime
    guests: int = Field(gt=0, le=8)

    @field_validator("start", "end")
    @classmethod
    def must_be_utc(cls, v: datetime) -> datetime:
        if v.tzinfo is None:
            raise ValueError("timestamps must include timezone")
        return v.astimezone(timezone.utc)          # validators may NORMALIZE

    @model_validator(mode="after")                 # cross-field rules
    def check_range(self):
        if self.end <= self.start:
            raise ValueError("end must be after start")
        return self
```

- `field_validator` — per-field custom rules *and normalization* (strip, lowercase, tz-convert); `mode="before"` sees the raw value pre-coercion (for exotic input shapes).
- `model_validator(mode="after")` — invariants across fields; runs on the constructed model.
- Prefer **declarative constraints first** (`Field(ge=…)`, `EmailStr`, `HttpUrl`, `UUID4`, `Annotated[str, StringConstraints(pattern=…)]`); custom validators only for what declarations can't say. Declarations document themselves into OpenAPI; imperative code doesn't.
- Nested models validate recursively — a `list[OrderLine]` payload of 200 lines yields either a fully-typed object graph or a 422 naming the exact line and field (`loc: ["lines", 41, "qty"]`). Discriminated unions (`Field(discriminator="type")`) parse polymorphic payloads (`{"type": "card", …} | {"type": "cash", …}`) into the right subtype in O(1).

## The three-schema discipline

The most consequential Pydantic habit in API code — **never one model for everything**:

```python
class UserBase(BaseModel):
    email: EmailStr
    display_name: str

class UserCreate(UserBase):          # input: what clients may SEND
    password: str = Field(min_length=8)

class UserOut(UserBase):             # output: what clients may SEE
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)   # build from ORM objects
```

- **Input models** exclude server-controlled state (id, role, status, timestamps) — otherwise you've built mass assignment ([same vulnerability as DRF's](/courses/django/drf-apis) `__all__`).
- **Output models** exclude secrets (password hashes, internal flags) *by construction* — `response_model=UserOut` filters whatever the handler returns; leaks become impossible rather than remembered-against.
- `from_attributes=True` reads ORM objects' attributes ([SQLAlchemy lesson](/courses/fastapi/sqlalchemy-async-and-alembic)) — DB model → API schema in one call. The DB model itself is the third schema: **SQLAlchemy for persistence, Pydantic for the wire; never merge them** — persistence shape and API contract evolve at different speeds for different masters.

Serialization is the mirror image: `model_dump()` (python objects) / `model_dump_json()` (JSON string, Rust-fast); `exclude_none`, field `serialization_alias` (snake_case ↔ camelCase via `alias_generator`), `@computed_field` for derived output, custom `field_serializer` for special formats.

## Settings: config as a validated model

```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="APP_")

    database_url: PostgresDsn
    redis_url: RedisDsn
    secret_key: SecretStr                 # repr-masked; .get_secret_value()
    debug: bool = False
    request_timeout_s: float = 10.0

@lru_cache
def get_settings() -> Settings:           # one parse per process
    return Settings()
```

Configuration is boundary input too (env vars are strings typed by hope) — `BaseSettings` validates it **at startup**, so a missing `DATABASE_URL` or a typo'd port fails the deploy in one obvious traceback instead of failing the first request at 3 a.m. `SecretStr` keeps credentials out of logs/reprs; the `lru_cache` factory makes settings injectable and test-overridable ([DI lesson](/courses/fastapi/dependency-injection)).

## Common mistakes

1. **One model for input, output, and DB** — leaks (hash in responses), mass assignment (client sets `role`), and coupled migrations. The three-schema split is the fix.
2. **Validating deep inside the app** — re-validating the same data in every layer wastes cycles and muddles ownership; validate at boundaries, trust types inside.
3. **`def f(x: Model = Model())`-style shared defaults** — same [mutable-default trap](/courses/python/mutability-and-copies); use `default_factory`.
4. **Business rules in validators** — "user may book max 3 rooms *per month*" needs the DB; validators must stay pure/fast (shape and invariants of *this payload* only). DB-dependent rules live in services.
5. **Ignoring the 422 contract** — hand-rolling error responses that differ per endpoint; let ValidationError map uniformly, customize once at the exception-handler level if needed.
6. **`.dict()`/v1 idioms in v2 code** — `model_dump`, `model_validate`, `field_validator`; the v1→v2 rename table is worth 10 minutes.
7. **Round-tripping through JSON needlessly** (`json.loads(m.model_dump_json())`) — `model_dump(mode="json")` exists.

## Best practices

- Constrain **at declaration**: `Annotated[int, Field(gt=0)]` type aliases (`PositiveId = Annotated[int, Field(gt=0)]`) reused across models keep rules consistent and DRY.
- Normalize early (trim, casefold emails, UTC-ize datetimes) in validators so the rest of the system sees canonical data.
- `frozen=True` for value-object models ([immutability lesson](/courses/python/mutability-and-copies)); hashable, safely shareable.
- Version schemas like APIs: additive is free; breaking shape changes get new models under `/v2`.
- Test models directly: validation rules are pure functions — table-driven tests of accept/reject cases are cheap and document the contract.

## Performance & memory notes

- pydantic-core validates in Rust: simple models run ~µs-scale per instance; still, in a 10k-item batch endpoint the model layer is measurable — validate the *collection* once (`list[Item]` in one model) rather than per-item in a Python loop, and use `TypeAdapter(list[Item])` for bare collections (build the adapter once at module level — construction is the expensive part).
- `model_dump_json()` (Rust serializer) beats `json.dumps(model_dump())` — use the direct path for hot endpoints.
- Model *class* creation is heavyweight (schema compilation) — never define models inside functions on hot paths.
- Each instance stores its fields as normal attributes (`__dict__`-backed by default); very large object graphs cost accordingly.

## Production tips

- Add a global exception handler enriching 422s with a request-id and logging the offending fields (not the values — [PII in logs](/courses/python/errors-logging-and-observability)).
- Strict-mode critical financial fields (`StrictInt` for amounts in minor units) — silent `"100.5"` → coercion surprises hurt exactly here.
- Contract testing: dump `app.openapi()` in CI and diff against the committed snapshot — schema drift becomes a review artifact ([same practice as DRF](/courses/django/drf-apis)).
- For inter-service messaging, share Pydantic models via a small internal package — one schema source for producer and consumer, versioned.

## Interview questions

1. **"What does Pydantic add over type hints?"** — Runtime parsing/coercion/validation of untrusted data at boundaries + serialization + JSON Schema; hints alone are static-only ([recap](/courses/python/typing-and-generics)).
2. **"Explain 'parse, don't validate'."** — Convert untrusted input into rich typed objects once at the edge; interior code trusts types instead of re-checking; illegal states unrepresentable.
3. **"Why separate In/Out/DB schemas?"** — Mass assignment prevention, secret-leak prevention by construction, independent evolution of contract vs persistence.
4. **"Where do business rules that need the DB go?"** — Services, not validators; validators are pure per-payload invariants; discuss the layering.
5. **"What made Pydantic v2 fast?"** — pydantic-core in Rust: compiled per-model validators/serializers, avoiding Python-level per-field dispatch.

## Summary

- Pydantic is the runtime boundary: coerce + validate + normalize once, produce precise 422s, and let the interior trust its types.
- Declarative constraints → self-documenting OpenAPI; validators for normalization and cross-field invariants; discriminated unions for polymorphic payloads.
- Three schemas (In / Out / DB) is the security- and evolution-critical discipline; `BaseSettings` applies the same rigor to config at startup.
- v2 is Rust-fast; keep model classes module-level, use TypeAdapters for bare collections, and dump JSON via the direct path.

## Exercises

**Easy**

1. Model a `Product` (name 2–80 chars, price int > 0 in minor units, currency `Literal["USD","UZS"]`, tags ≤5) and table-test six invalid payloads, asserting on `loc`/`type` of each error.
2. Build `Settings` with two DSNs and a `SecretStr`; demonstrate startup failure on a missing var and masked repr for the secret.

**Medium**

3. Implement the three-schema split for a `Note` resource over a fake ORM class; prove with tests that (a) client-sent `id`/`owner_id` are ignored, (b) `secret_flag` never appears in output even when the handler returns the raw ORM object.
4. Parse a polymorphic webhook payload with a discriminated union (`payment.succeeded` / `payment.failed` / `refund.created`), each variant with distinct required fields; reject unknown types with a clean 422.

**Hard**

5. Build `TypeAdapter(list[Event])`-based batch ingestion for 100k events: benchmark adapter-reuse vs per-call construction vs per-item model validation; then add `mode="before"` normalization (epoch-ms ints → datetimes) and measure its cost.

**Debugging exercise**

6. Three distinct schema bugs ship in this snippet — name them:

```python
class User(BaseModel):
    id: int | None = None
    email: str                              # no format validation
    password_hash: str
    role: str = "user"
    friends: list[int] = []                 # shared mutable default

@app.post("/users")
async def create(u: User) -> User:          # same model in and out
    return await save(u)
```

**Refactoring exercise**

7. A handler receives `payload: dict`, does 30 lines of `if "x" not in payload` checks with ad-hoc error strings, then passes the dict onward (further `.get()` checks downstream). Refactor to a model + validators; delete every downstream check; compare error-response quality before/after.

**Mini project**

Build a config-driven data validator CLI: given a JSON Schema-ish spec, generate Pydantic models dynamically (`create_model`), validate an NDJSON file streaming line-by-line ([generator pipeline](/courses/python/iterators-and-generators)), and emit a report of error counts by `loc`/`type` plus the first 10 samples of each. Bonus: `--strict` flag toggling coercion.

## Quiz

<details>
<summary>1. Why does <code>{"age": "19"}</code> validate against <code>age: int</code> by default, and how do you forbid it?</summary>
Smart coercion — wire formats carry strings, so compatible conversions apply. Forbid with strict mode (<code>ConfigDict(strict=True)</code> or <code>StrictInt</code>).
</details>

<details>
<summary>2. What exactly does <code>response_model=UserOut</code> guarantee?</summary>
The response is filtered and shaped to UserOut's fields regardless of what the handler returns — extra attributes (secrets) are dropped by construction, and the schema is documented.
</details>

<details>
<summary>3. Field validator vs model validator — split of duties?</summary>
Field: single-value rules and normalization (may see pre-coercion input with mode="before"). Model (after): cross-field invariants on the built instance.
</details>

<details>
<summary>4. Why is defining a Pydantic model inside a request handler a performance bug?</summary>
Class creation compiles the Rust validator/serializer schema — heavyweight work meant to happen once at import, not per request.
</details>

<details>
<summary>5. Where's the line between a validator rule and a service rule?</summary>
Validators: facts about the payload alone (pure, fast, no I/O). Services: rules needing external state (DB uniqueness, quotas, permissions).
</details>

## Further reading

- Pydantic v2 docs — Models, Validators, Serialization, Settings (and the v1→v2 migration page)
- Alexis King — "Parse, don't validate" (the essay behind the philosophy)
- FastAPI docs — "Response Model", "Handling Errors"
