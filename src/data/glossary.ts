export interface GlossaryTerm {
  term: string;
  definition: string;
  /** Optional lesson id (`course/slug`) to read more. */
  lesson?: string;
}

export const glossary: GlossaryTerm[] = [
  {
    term: "ASGI",
    definition:
      "Asynchronous Server Gateway Interface — the async successor to WSGI. A protocol between web servers (Uvicorn) and Python apps (FastAPI, Django async views) built around an async callable receiving scope, receive, and send.",
    lesson: "fastapi/asgi-and-starlette",
  },
  {
    term: "Bytecode",
    definition:
      "The intermediate instruction set CPython compiles your source into (LOAD_FAST, CALL, RETURN_VALUE…). The interpreter's evaluation loop executes bytecode, not your source text. Inspect it with the dis module.",
    lesson: "python/python-execution-model",
  },
  {
    term: "Closure",
    definition:
      "A function that captures variables from the enclosing scope in cell objects, keeping them alive after the outer function returns. Closures capture variables, not values — the root of the late-binding loop trap.",
    lesson: "python/closures-and-legb",
  },
  {
    term: "Connection pool",
    definition:
      "A cache of open database connections reused across requests. Opening a connection costs a TCP+auth round trip; pools (SQLAlchemy's QueuePool, pgbouncer) amortize it and cap concurrent connections.",
    lesson: "fastapi/sqlalchemy-async-and-alembic",
  },
  {
    term: "Coroutine",
    definition:
      "The object returned by calling an async def function. It runs only when awaited or wrapped in a Task, and can suspend at await points so the event loop can run other work.",
    lesson: "python/asyncio-fundamentals",
  },
  {
    term: "CSRF",
    definition:
      "Cross-Site Request Forgery — tricking a logged-in browser into sending a state-changing request. Django defends with a per-session token that must accompany unsafe methods (POST/PUT/DELETE).",
    lesson: "django/auth-and-security",
  },
  {
    term: "Decorator",
    definition:
      "A callable that takes a function (or class) and returns a replacement. @deco above a def is pure syntax sugar for f = deco(f). Used for cross-cutting concerns: caching, retries, auth, logging.",
    lesson: "python/decorators",
  },
  {
    term: "Dependency injection",
    definition:
      "Passing a component its collaborators from outside instead of letting it construct them. FastAPI's Depends() builds a dependency graph per request, enabling shared resources and easy test overrides.",
    lesson: "fastapi/dependency-injection",
  },
  {
    term: "EAFP",
    definition:
      "“Easier to Ask Forgiveness than Permission” — the Pythonic style of trying an operation and catching the exception, instead of pre-checking (LBYL). Avoids TOCTOU races and matches how CPython itself works.",
    lesson: "python/errors-logging-and-observability",
  },
  {
    term: "Event loop",
    definition:
      "The single-threaded scheduler at the heart of asyncio. It runs ready callbacks/coroutines and uses OS-level I/O multiplexing (epoll/kqueue/IOCP) to wake tasks when their I/O completes.",
    lesson: "python/asyncio-fundamentals",
  },
  {
    term: "GIL",
    definition:
      "Global Interpreter Lock — a mutex allowing only one thread to execute Python bytecode at a time in CPython. Threads still help for I/O (the GIL is released during blocking I/O) but not for pure-Python CPU work.",
    lesson: "python/concurrency-gil-threads-processes",
  },
  {
    term: "Generator",
    definition:
      "A function containing yield. Calling it returns a lazy iterator; each next() runs to the following yield and suspends, preserving all local state. The backbone of memory-efficient pipelines.",
    lesson: "python/iterators-and-generators",
  },
  {
    term: "Idempotency",
    definition:
      "An operation that can be applied multiple times with the same result as once. Essential for retried Celery tasks, payment endpoints, and migrations — retries happen whether you plan for them or not.",
    lesson: "django/caching-celery-and-deployment",
  },
  {
    term: "Interning",
    definition:
      "CPython's reuse of single objects for small ints (-5..256) and many strings. It's why `a is b` can be True for equal immutables — and why you must compare values with ==, not is.",
    lesson: "python/variables-objects-references",
  },
  {
    term: "JWT",
    definition:
      "JSON Web Token — a signed (not encrypted) token carrying claims like user id and expiry. The server verifies the signature instead of hitting a session store; revocation before expiry requires extra machinery.",
    lesson: "fastapi/auth-jwt-oauth2",
  },
  {
    term: "LEGB",
    definition:
      "Python's name-resolution order: Local → Enclosing → Global → Builtins. Assignment inside a function makes a name local for the whole function body — the cause of UnboundLocalError surprises.",
    lesson: "python/closures-and-legb",
  },
  {
    term: "Middleware",
    definition:
      "Code wrapped around request handling like onion layers: each sees the request on the way in and the response on the way out. Both Django and Starlette use this model for auth, logging, CORS, and sessions.",
    lesson: "django/request-lifecycle",
  },
  {
    term: "MRO",
    definition:
      "Method Resolution Order — the linearized class hierarchy (C3 algorithm) Python walks to find attributes with multiple inheritance. super() follows the MRO, not simply 'the parent'.",
    lesson: "python/oop-and-the-data-model",
  },
  {
    term: "N+1 problem",
    definition:
      "Fetching a list with one query, then triggering one extra query per row while accessing a relationship. Fixed with select_related/prefetch_related (Django) or selectinload/joinedload (SQLAlchemy).",
    lesson: "django/queryset-optimization",
  },
  {
    term: "ORM",
    definition:
      "Object-Relational Mapper — maps classes to tables and objects to rows, generating SQL for you. Productivity tool and foot-gun: you must still understand the SQL it generates.",
    lesson: "django/models-and-the-orm",
  },
  {
    term: "Protocol (typing)",
    definition:
      "Structural typing for Python: a class satisfies a Protocol by having the right methods, no inheritance required. Static duck typing, checked by mypy/pyright.",
    lesson: "python/typing-and-generics",
  },
  {
    term: "Pydantic",
    definition:
      "Validation and serialization library powering FastAPI's request/response models. V2 has a Rust core; models parse and coerce external data at the boundary so the rest of your code trusts its types.",
    lesson: "fastapi/pydantic-deep-dive",
  },
  {
    term: "QuerySet",
    definition:
      "Django's lazy representation of a database query. Building one runs no SQL; iteration, len(), list(), or slicing with a step triggers evaluation. Chaining returns new querysets.",
    lesson: "django/queryset-optimization",
  },
  {
    term: "Race condition",
    definition:
      "A bug whose outcome depends on timing between concurrent operations — e.g. two requests both reading a counter before either writes. Fixed with atomic operations, locks, or database-level constraints.",
    lesson: "python/concurrency-gil-threads-processes",
  },
  {
    term: "Reference counting",
    definition:
      "CPython's primary memory management: every object tracks how many references point to it and is freed the instant the count hits zero. A cyclic garbage collector handles reference cycles.",
    lesson: "python/variables-objects-references",
  },
  {
    term: "Serializer (DRF)",
    definition:
      "DRF component converting model instances to JSON-compatible data and validating incoming payloads back into objects — the API's contract layer, analogous to Pydantic schemas in FastAPI.",
    lesson: "django/drf-apis",
  },
  {
    term: "Structural sharing / shallow copy",
    definition:
      "A shallow copy duplicates the outer container but shares inner objects; mutating a shared inner object is visible through both copies. deepcopy recursively duplicates everything.",
    lesson: "python/mutability-and-copies",
  },
  {
    term: "Task (asyncio)",
    definition:
      "A coroutine scheduled on the event loop via asyncio.create_task, running concurrently with other tasks. Keep a reference to it — the loop holds tasks weakly and unreferenced tasks can be garbage-collected mid-flight.",
    lesson: "python/asyncio-fundamentals",
  },
  {
    term: "Transaction",
    definition:
      "A group of database statements that commit or roll back atomically. Django: transaction.atomic(); SQLAlchemy: session.begin(). Keep them short — long transactions hold locks and bloat undo logs.",
    lesson: "django/queryset-optimization",
  },
  {
    term: "Unit of Work",
    definition:
      "A pattern (implemented by the SQLAlchemy Session) that records changes to objects during a business operation and flushes them as one transaction at commit time.",
    lesson: "fastapi/sqlalchemy-async-and-alembic",
  },
  {
    term: "WSGI",
    definition:
      "Web Server Gateway Interface — the classic synchronous protocol between servers (Gunicorn) and Python apps (Django, Flask). One worker handles one request at a time; concurrency comes from processes/threads.",
    lesson: "django/request-lifecycle",
  },
];
