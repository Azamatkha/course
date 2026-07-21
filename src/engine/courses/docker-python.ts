import type { Course } from "../types";

export const dockerPythonCourse: Course = {
  id: "docker-python",
  title: "Docker for Python Developers",
  tagline: "Containerize and ship Python the right way",
  description:
    "A complete, Python-focused Docker course. You will learn containers from the ground up — images, layers, volumes, networks, Dockerfiles, and Docker Compose — and then apply them to real Python work: dockerizing FastAPI and Django, wiring up PostgreSQL, Redis, and Nginx, multi-stage builds, image optimization, security hardening, health checks, debugging, development vs production workflows, common mistakes, interview questions, and a capstone deployment.",
  level: "Beginner → Advanced",
  sections: [
    {
      id: "fundamentals",
      title: "Docker Fundamentals",
      description:
        "The mental model: what containers are, images vs containers, and layers.",
      lessons: [
        {
          slug: "docker-fundamentals",
          title: "Docker Fundamentals: Images, Containers & Layers",
          description:
            "Containers vs virtual machines (the shipping-container analogy), images vs containers, the layered filesystem, and your first Python container in ten commands.",
          difficulty: "beginner",
          tags: ["docker", "containers", "images", "layers", "virtual machines", "cli"],
        },
        {
          slug: "images-and-dockerfile",
          title: "Images & the Dockerfile",
          description:
            "Every important Dockerfile instruction, base image choice (slim vs alpine), the build cache, .dockerignore, and writing a clean image for a Python app.",
          difficulty: "beginner",
          tags: ["dockerfile", "build cache", "base image", "slim", "alpine", "dockerignore"],
        },
      ],
    },
    {
      id: "runtime",
      title: "Data & Networking",
      description:
        "Persist data with volumes and connect containers with networks.",
      lessons: [
        {
          slug: "volumes-and-networks",
          title: "Volumes & Networks",
          description:
            "Why containers are ephemeral, named volumes vs bind mounts, container networking and DNS, port publishing, and how services find each other.",
          difficulty: "intermediate",
          tags: ["volumes", "bind mounts", "networks", "dns", "ports", "persistence"],
        },
        {
          slug: "docker-compose",
          title: "Docker Compose",
          description:
            "Define a whole stack in one YAML file: services, depends_on, environment, healthchecks, profiles, and the everyday compose workflow for Python projects.",
          difficulty: "intermediate",
          tags: ["docker compose", "yaml", "services", "depends_on", "environment", "multi-container"],
        },
      ],
    },
    {
      id: "python-apps",
      title: "Dockerizing Python Apps",
      description:
        "Package FastAPI and Django with their databases and caches.",
      lessons: [
        {
          slug: "dockerizing-fastapi-django",
          title: "Dockerizing FastAPI & Django",
          description:
            "Production-shaped images for both frameworks: Uvicorn/Gunicorn workers, migrations, static files, entrypoint scripts, and a WSGI/ASGI-aware setup.",
          difficulty: "intermediate",
          tags: ["fastapi", "django", "uvicorn", "gunicorn", "migrations", "entrypoint"],
        },
        {
          slug: "postgres-redis-nginx",
          title: "PostgreSQL, Redis & Nginx",
          description:
            "Add a real database, a cache/broker, and a reverse proxy: persistent Postgres, Redis for caching and Celery, and Nginx in front of your app with compose.",
          difficulty: "advanced",
          tags: ["postgresql", "redis", "nginx", "reverse proxy", "celery", "compose"],
        },
      ],
    },
    {
      id: "optimization",
      title: "Optimization & Security",
      description:
        "Small, fast, safe images: multi-stage builds and hardening.",
      lessons: [
        {
          slug: "multi-stage-and-optimization",
          title: "Multi-Stage Builds & Optimization",
          description:
            "Shrink images dramatically with multi-stage builds, order layers for cache hits, use build args and BuildKit, and measure what actually bloats an image.",
          difficulty: "advanced",
          tags: ["multi-stage", "optimization", "buildkit", "cache", "image size", "wheels"],
        },
        {
          slug: "security-and-best-practices",
          title: "Security & Container Best Practices",
          description:
            "Run as non-root, pin versions and scan for CVEs, keep secrets out of images, drop capabilities, use read-only filesystems, and the production checklist.",
          difficulty: "advanced",
          tags: ["security", "non-root", "secrets", "scanning", "cve", "best practices"],
        },
      ],
    },
    {
      id: "operations",
      title: "Operations & Delivery",
      description:
        "Debugging, health checks, dev vs prod, and shipping a real deployment.",
      lessons: [
        {
          slug: "debugging-and-healthchecks",
          title: "Debugging, Logging & Health Checks",
          description:
            "Read logs and exec into containers, HEALTHCHECK and readiness, resource limits, restart policies, and diagnosing the mistakes everyone hits first.",
          difficulty: "intermediate",
          tags: ["debugging", "logs", "healthcheck", "exec", "restart policy", "troubleshooting"],
        },
        {
          slug: "dev-vs-prod-and-capstone",
          title: "Dev vs Prod Workflow & Capstone Deployment",
          description:
            "Compose overrides for hot-reload dev vs hardened prod, CI image builds, tagging and registries, and a capstone: deploy a Dockerized FastAPI + Postgres + Nginx stack.",
          difficulty: "expert",
          tags: ["workflow", "compose override", "ci", "registry", "deployment", "capstone"],
        },
      ],
    },
  ],
};
