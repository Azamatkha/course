import type { Course } from "../types";

export const pythonFoundationsCourse: Course = {
  id: "python-foundations",
  title: "Python Fundamentals",
  tagline: "The professional foundation, past the basics",
  description:
    "An intermediate foundation course that starts where the tutorials stop. It assumes you already know basic syntax and takes you through the professional Python every backend, Django, FastAPI, and AI developer is expected to know: functions and argument machinery, closures and decorators, iterators and generators, context managers, packaging, error handling, dataclasses and typing, OOP with ABCs and Protocols, SOLID and clean code, logging, testing with pytest, and performance.",
  level: "Beginner+ → Intermediate",
  sections: [
    {
      id: "functions",
      title: "Functions & Scope",
      description:
        "Everything a function really is: arguments, *args/**kwargs, scope, and closures.",
      lessons: [
        {
          slug: "functions-arguments-scope",
          title: "Functions, Arguments & Scope",
          description:
            "Positional vs keyword arguments, defaults and the mutable-default trap, *args and **kwargs, unpacking, and how Python resolves names with LEGB.",
          difficulty: "beginner",
          tags: ["functions", "args", "kwargs", "defaults", "scope", "legb"],
        },
        {
          slug: "closures-and-decorators",
          title: "Closures & Decorators",
          description:
            "How closures capture variables, then decorators built from first principles — the gift-wrapping analogy, functools.wraps, and practical decorators you will reuse.",
          difficulty: "intermediate",
          tags: ["closures", "decorators", "functools", "wraps", "higher-order", "metaprogramming"],
        },
      ],
    },
    {
      id: "iteration",
      title: "Iteration & Lazy Evaluation",
      description:
        "Iterators, generators, comprehensions — the lazy tools that keep memory flat.",
      lessons: [
        {
          slug: "iterators-generators-comprehensions",
          title: "Iterators, Generators & Comprehensions",
          description:
            "The iterator protocol, generator functions and expressions (the factory analogy), comprehensions vs loops, and streaming data without loading it all.",
          difficulty: "intermediate",
          tags: ["iterators", "generators", "yield", "comprehensions", "itertools", "lazy"],
        },
        {
          slug: "context-managers",
          title: "Context Managers",
          description:
            "The with statement, __enter__/__exit__, contextlib.contextmanager, and guaranteed cleanup — resources that always close even when things blow up.",
          difficulty: "intermediate",
          tags: ["context manager", "with", "contextlib", "cleanup", "resources", "raii"],
        },
      ],
    },
    {
      id: "structure",
      title: "Structuring Code",
      description:
        "Modules, packages, imports, and robust error handling — organizing real projects.",
      lessons: [
        {
          slug: "modules-packages-imports",
          title: "Modules, Packages & Imports",
          description:
            "How import really works, absolute vs relative imports, __init__.py, packaging layout, circular imports, and __name__ == '__main__'.",
          difficulty: "beginner",
          tags: ["modules", "packages", "imports", "__init__", "circular imports", "packaging"],
        },
        {
          slug: "error-handling",
          title: "Error Handling Done Right",
          description:
            "Exceptions as control flow, EAFP vs LBYL, custom exception hierarchies, try/except/else/finally, exception chaining, and never swallowing errors.",
          difficulty: "intermediate",
          tags: ["exceptions", "error handling", "eafp", "custom exceptions", "raise", "finally"],
        },
      ],
    },
    {
      id: "data",
      title: "Data, Files & Types",
      description:
        "Files, JSON, dataclasses, enums, and type hints — modeling data cleanly.",
      lessons: [
        {
          slug: "files-and-json",
          title: "Files, JSON & Serialization",
          description:
            "Reading and writing files with pathlib, encodings, the JSON module, streaming large files, and safely round-tripping data.",
          difficulty: "beginner",
          tags: ["files", "pathlib", "json", "encoding", "serialization", "io"],
        },
        {
          slug: "dataclasses-enums-typing",
          title: "Dataclasses, Enums & Typing",
          description:
            "Model data with @dataclass, express fixed choices with Enum, and use type hints, Optional, Union, and generics to make code self-documenting and mypy-checked.",
          difficulty: "intermediate",
          tags: ["dataclasses", "enum", "typing", "type hints", "mypy", "generics"],
        },
      ],
    },
    {
      id: "oop",
      title: "OOP & Design",
      description:
        "Classes, ABCs, Protocols, SOLID, clean code, and the patterns that matter.",
      lessons: [
        {
          slug: "oop-abc-protocols",
          title: "OOP, ABCs & Protocols",
          description:
            "Classes and instances, inheritance vs composition, dunder methods, abstract base classes, and Protocol-based structural typing (duck typing with a safety net).",
          difficulty: "intermediate",
          tags: ["oop", "inheritance", "composition", "abc", "protocol", "dunder"],
        },
        {
          slug: "solid-clean-code-patterns",
          title: "SOLID, Clean Code & Design Patterns",
          description:
            "The five SOLID principles with Python examples, dependency injection (the electrical-socket analogy), and the handful of design patterns Python actually uses.",
          difficulty: "advanced",
          tags: ["solid", "clean code", "design patterns", "dependency injection", "strategy", "factory"],
        },
      ],
    },
    {
      id: "quality",
      title: "Quality & Performance",
      description:
        "Logging, testing with pytest, and profiling — code that is trustworthy and fast.",
      lessons: [
        {
          slug: "logging-and-testing",
          title: "Logging & Testing with Pytest",
          description:
            "Structured logging instead of print(), the logging module, and writing real tests with pytest: fixtures, parametrize, mocking, and coverage.",
          difficulty: "intermediate",
          tags: ["logging", "testing", "pytest", "fixtures", "mocking", "coverage"],
        },
        {
          slug: "performance-and-memory",
          title: "Performance, Memory & Best Practices",
          description:
            "Big-O in practice, choosing the right data structure, profiling with cProfile and timeit, memory with generators and __slots__, and a professional-habits checklist.",
          difficulty: "advanced",
          tags: ["performance", "memory", "profiling", "cprofile", "slots", "best practices"],
        },
      ],
    },
  ],
};
