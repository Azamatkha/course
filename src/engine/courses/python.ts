import type { Course } from "../types";

export const pythonCourse: Course = {
  id: "python",
  title: "Advanced Python",
  tagline: "From syntax to CPython internals",
  description:
    "A deep, internals-first Python course for backend engineers. You will learn how CPython actually executes your code, how objects live in memory, and how to use functions, iterators, typing, and concurrency the way senior engineers do in production.",
  level: "Intermediate → Expert",
  sections: [
    {
      id: "foundations",
      title: "Execution Model & Memory",
      description:
        "What really happens when Python runs your code: bytecode, objects, references, and mutability.",
      lessons: [
        {
          slug: "python-execution-model",
          title: "How Python Executes Your Code",
          description:
            "Source → tokens → AST → bytecode → the CPython evaluation loop. Why 'interpreted' is misleading, what .pyc files are, and what this means for performance.",
          difficulty: "intermediate",
          tags: ["cpython", "bytecode", "interpreter", "compilation", "dis", "performance"],
        },
        {
          slug: "variables-objects-references",
          title: "Variables, Objects, and References",
          description:
            "Names are not boxes. Reference counting, identity vs equality, interning, and the object model that explains 90% of 'weird' Python behavior.",
          difficulty: "intermediate",
          tags: ["references", "memory", "id", "is", "interning", "garbage collection"],
        },
        {
          slug: "mutability-and-copies",
          title: "Mutability, Aliasing, and Copies",
          description:
            "Mutable vs immutable types, aliasing bugs, shallow vs deep copy, hashability, and the mutable default argument trap.",
          difficulty: "intermediate",
          tags: ["mutability", "copy", "deepcopy", "aliasing", "hashable", "tuple"],
        },
      ],
    },
    {
      id: "functions",
      title: "Functions, Scopes & Decorators",
      description:
        "Functions as first-class objects: argument machinery, LEGB scoping, closures, and decorators.",
      lessons: [
        {
          slug: "functions-deep-dive",
          title: "Functions Deep Dive",
          description:
            "Positional-only, keyword-only, *args/**kwargs, default-value evaluation, function objects and their attributes — everything a function really is.",
          difficulty: "intermediate",
          tags: ["functions", "args", "kwargs", "defaults", "signature", "callable"],
        },
        {
          slug: "closures-and-legb",
          title: "Namespaces, LEGB, and Closures",
          description:
            "How name resolution works, why closures capture variables (not values), nonlocal/global, and the late-binding loop trap.",
          difficulty: "advanced",
          tags: ["scope", "legb", "closures", "nonlocal", "cell", "late binding"],
        },
        {
          slug: "decorators",
          title: "Decorators from First Principles",
          description:
            "Build decorators from scratch: plain, parameterized, class-based, stacked. functools.wraps, caching, retries, and real production patterns.",
          difficulty: "advanced",
          tags: ["decorators", "functools", "wraps", "lru_cache", "retry", "metaprogramming"],
        },
      ],
    },
    {
      id: "iteration",
      title: "Iterators & Generators",
      description: "Lazy computation: the iterator protocol, generators, and streaming pipelines.",
      lessons: [
        {
          slug: "iterators-and-generators",
          title: "Iterators, Generators, and Lazy Pipelines",
          description:
            "The iterator protocol, generator functions and expressions, yield from, memory-efficient data pipelines, and itertools patterns.",
          difficulty: "advanced",
          tags: ["iterators", "generators", "yield", "itertools", "lazy evaluation", "pipelines"],
        },
      ],
    },
    {
      id: "oop",
      title: "OOP & the Data Model",
      description: "Magic methods, protocols, and designing Python classes that feel native.",
      lessons: [
        {
          slug: "oop-and-the-data-model",
          title: "OOP and the Python Data Model",
          description:
            "Dunder methods, __init__ vs __new__, properties, dataclasses, inheritance vs composition, protocols and ABCs — designing classes the Pythonic way.",
          difficulty: "advanced",
          tags: ["oop", "magic methods", "dunder", "dataclasses", "abc", "protocols", "inheritance"],
        },
      ],
    },
    {
      id: "typing",
      title: "Typing",
      description: "Static typing for large codebases: hints, generics, and protocols.",
      lessons: [
        {
          slug: "typing-and-generics",
          title: "Type Hints, Generics, and Protocols",
          description:
            "Gradual typing that pays for itself: Optional, unions, TypeVar, generics, Protocol-based structural typing, and mypy in CI.",
          difficulty: "advanced",
          tags: ["typing", "mypy", "generics", "typevar", "protocol", "annotations"],
        },
      ],
    },
    {
      id: "concurrency",
      title: "Concurrency",
      description: "asyncio, threads, processes, and the GIL — choosing the right tool.",
      lessons: [
        {
          slug: "asyncio-fundamentals",
          title: "asyncio from the Event Loop Up",
          description:
            "Coroutines, the event loop, tasks, gather, timeouts, cancellation — and why blocking calls silently destroy async services.",
          difficulty: "advanced",
          tags: ["asyncio", "coroutines", "event loop", "await", "tasks", "concurrency"],
        },
        {
          slug: "concurrency-gil-threads-processes",
          title: "The GIL, Threads, and Processes",
          description:
            "What the GIL actually locks, when threads help despite it, multiprocessing, executors, and a decision framework for I/O vs CPU workloads.",
          difficulty: "expert",
          tags: ["gil", "threading", "multiprocessing", "executor", "parallelism", "cpu-bound"],
        },
      ],
    },
    {
      id: "production",
      title: "Production Python",
      description: "Errors, logging, and observability for services people depend on.",
      lessons: [
        {
          slug: "errors-logging-and-observability",
          title: "Exceptions, Logging, and Observability",
          description:
            "Exception design, EAFP, custom hierarchies, structured logging, and the operational habits that separate scripts from services.",
          difficulty: "advanced",
          tags: ["exceptions", "logging", "observability", "eafp", "error handling", "monitoring"],
        },
      ],
    },
  ],
};
