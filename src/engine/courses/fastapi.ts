import type { Course } from "../types";

export const fastapiCourse: Course = {
  id: "fastapi",
  title: "FastAPI Engineering",
  tagline: "Modern async APIs, from ASGI to clean architecture",
  description:
    "FastAPI as senior engineers use it: the ASGI/Starlette foundation underneath, Pydantic validation in depth, dependency injection as an architecture tool, async SQLAlchemy with Alembic, OAuth2/JWT security, and testable clean architecture.",
  level: "Intermediate → Expert",
  sections: [
    {
      id: "foundations",
      title: "Foundations",
      description: "What FastAPI is made of: ASGI, Starlette, and Pydantic.",
      lessons: [
        {
          slug: "asgi-and-starlette",
          title: "ASGI, Starlette, and What FastAPI Really Is",
          description:
            "The ASGI protocol, the Starlette toolkit, Uvicorn, and the layered anatomy of a FastAPI application — including when async actually helps.",
          difficulty: "intermediate",
          tags: ["fastapi", "asgi", "starlette", "uvicorn", "async", "middleware"],
        },
        {
          slug: "pydantic-deep-dive",
          title: "Pydantic Deep Dive",
          description:
            "Validation and serialization with Pydantic v2: field constraints, custom validators, nested models, settings management, and performance notes.",
          difficulty: "intermediate",
          tags: ["pydantic", "validation", "serialization", "schemas", "settings", "basemodel"],
        },
      ],
    },
    {
      id: "structure",
      title: "Application Structure",
      description: "Dependency injection and project layout that scales past main.py.",
      lessons: [
        {
          slug: "dependency-injection",
          title: "Dependency Injection as Architecture",
          description:
            "Depends() in depth: sub-dependencies, yield dependencies for resources, caching, overrides for testing, and structuring routers/services/repositories.",
          difficulty: "advanced",
          tags: ["dependency injection", "depends", "architecture", "services", "repositories", "testing"],
        },
      ],
    },
    {
      id: "data",
      title: "Databases",
      description: "Async SQLAlchemy 2.0 and Alembic migrations done right.",
      lessons: [
        {
          slug: "sqlalchemy-async-and-alembic",
          title: "Async SQLAlchemy 2.0 and Alembic",
          description:
            "Engines, sessions, the unit-of-work pattern, SQLAlchemy 2.0 style models and queries, connection pooling, and safe Alembic migrations.",
          difficulty: "advanced",
          tags: ["sqlalchemy", "alembic", "async", "sessions", "migrations", "connection pool"],
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      description: "OAuth2, JWT, password hashing, and role-based access control.",
      lessons: [
        {
          slug: "auth-jwt-oauth2",
          title: "Auth: OAuth2, JWT, and RBAC",
          description:
            "The OAuth2 password flow, access and refresh tokens, bcrypt hashing, current-user dependencies, and role-based permissions — implemented end to end.",
          difficulty: "advanced",
          tags: ["jwt", "oauth2", "authentication", "rbac", "bcrypt", "refresh tokens", "security"],
        },
      ],
    },
    {
      id: "realtime",
      title: "Real-Time & Streaming",
      description: "WebSockets, server-sent events, and streaming large payloads.",
      lessons: [
        {
          slug: "websockets-and-streaming",
          title: "WebSockets, SSE, and Streaming",
          description:
            "Choosing between WebSockets and SSE, connection lifecycle and authorization, Redis pub/sub fan-out across processes, and streaming large exports and uploads at constant memory.",
          difficulty: "advanced",
          tags: ["websockets", "sse", "streaming", "redis", "pubsub", "realtime", "uploads"],
        },
      ],
    },
    {
      id: "scaling",
      title: "Scaling & Traffic",
      description: "Background work, caching, and surviving more load than you planned for.",
      lessons: [
        {
          slug: "background-tasks-and-workers",
          title: "Background Tasks and Worker Queues",
          description:
            "BackgroundTasks vs Celery vs arq, idempotency under at-least-once delivery, the transactional outbox, dead-letter queues, and sizing workers.",
          difficulty: "advanced",
          tags: ["celery", "arq", "background tasks", "queues", "idempotency", "outbox", "retries"],
        },
        {
          slug: "caching-and-rate-limiting",
          title: "Caching, Rate Limiting, and Backpressure",
          description:
            "HTTP/CDN/Redis cache layers, key design and invalidation, stampede protection, token-bucket rate limiting in atomic Lua, and load shedding under overload.",
          difficulty: "advanced",
          tags: ["caching", "redis", "etag", "rate limiting", "token bucket", "backpressure", "cdn"],
        },
      ],
    },
    {
      id: "operations",
      title: "Observability",
      description: "Knowing what your service is doing in production.",
      lessons: [
        {
          slug: "middleware-and-observability",
          title: "Middleware, Logging, and Observability",
          description:
            "ASGI vs BaseHTTPMiddleware, request-id propagation with ContextVar, structured JSON logs, OpenTelemetry tracing, and Prometheus metrics without cardinality explosions.",
          difficulty: "advanced",
          tags: ["middleware", "logging", "opentelemetry", "prometheus", "tracing", "metrics", "contextvar"],
        },
      ],
    },
    {
      id: "production",
      title: "Production",
      description: "Clean architecture, testing, and deployment.",
      lessons: [
        {
          slug: "architecture-testing-deployment",
          title: "Clean Architecture, Testing, and Deployment",
          description:
            "Layered project structure, pytest with dependency overrides and test databases, Docker images, Uvicorn workers, and a production readiness checklist.",
          difficulty: "expert",
          tags: ["clean architecture", "pytest", "docker", "deployment", "testing", "production"],
        },
      ],
    },
  ],
};
