import type { Course } from "../types";

export const djangoCourse: Course = {
  id: "django",
  title: "Professional Django",
  tagline: "The batteries-included framework, used properly",
  description:
    "Django beyond the tutorial: how a request actually travels through the framework, how the ORM builds SQL, how to keep querysets fast at scale, and how to ship secure, cached, task-driven APIs with Django REST Framework.",
  level: "Intermediate → Advanced",
  sections: [
    {
      id: "internals",
      title: "Django Internals",
      description: "The request/response lifecycle, middleware, and how the pieces connect.",
      lessons: [
        {
          slug: "request-lifecycle",
          title: "The Request/Response Lifecycle",
          description:
            "From socket to view and back: WSGI/ASGI, URL resolution, middleware as an onion, and where each hook in the lifecycle fires.",
          difficulty: "intermediate",
          tags: ["django", "wsgi", "asgi", "middleware", "request", "lifecycle", "urls"],
        },
      ],
    },
    {
      id: "data",
      title: "Models & the ORM",
      description: "Modeling data correctly and understanding the SQL your code generates.",
      lessons: [
        {
          slug: "models-and-the-orm",
          title: "Models and the ORM Deep Dive",
          description:
            "Fields, relationships, Meta options, custom managers and querysets, migrations, signals — and the SQL behind each of them.",
          difficulty: "intermediate",
          tags: ["django", "orm", "models", "managers", "migrations", "signals", "relationships"],
        },
        {
          slug: "queryset-optimization",
          title: "QuerySet Optimization at Scale",
          description:
            "Laziness, the N+1 problem, select_related vs prefetch_related, only/defer, indexes, transactions, and how to profile real query load.",
          difficulty: "advanced",
          tags: ["django", "n+1", "select_related", "prefetch_related", "indexes", "transactions", "performance"],
        },
      ],
    },
    {
      id: "api",
      title: "APIs with DRF",
      description: "Building production REST APIs with Django REST Framework.",
      lessons: [
        {
          slug: "drf-apis",
          title: "Django REST Framework in Production",
          description:
            "Serializers, ViewSets, routers, pagination, filtering, JWT auth, throttling, and API schema docs — a complete production API layer.",
          difficulty: "advanced",
          tags: ["drf", "serializers", "viewsets", "jwt", "pagination", "api", "swagger"],
        },
      ],
    },
    {
      id: "security",
      title: "Auth & Security",
      description: "Django's auth system and the security model that protects your users.",
      lessons: [
        {
          slug: "auth-and-security",
          title: "Authentication, Permissions, and Security",
          description:
            "Custom user models, sessions vs tokens, the permission system, and Django's defenses against CSRF, XSS, SQL injection, and friends.",
          difficulty: "advanced",
          tags: ["auth", "permissions", "security", "csrf", "xss", "sessions", "custom user"],
        },
      ],
    },
    {
      id: "operations",
      title: "Caching, Celery & Deployment",
      description: "Making Django fast and shipping it to real servers.",
      lessons: [
        {
          slug: "caching-celery-and-deployment",
          title: "Caching, Celery, and Deployment",
          description:
            "Redis caching layers, cache invalidation strategy, Celery task queues, and a production deployment blueprint with Docker, Gunicorn, and Nginx.",
          difficulty: "advanced",
          tags: ["caching", "redis", "celery", "deployment", "docker", "gunicorn", "scaling"],
        },
      ],
    },
  ],
};
