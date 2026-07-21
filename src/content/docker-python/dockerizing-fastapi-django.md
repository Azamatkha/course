## Learning objectives

- Write production-shaped images for **FastAPI** and **Django**.
- Choose and configure **Uvicorn/Gunicorn** workers.
- Handle **migrations**, **static files**, and startup with an entrypoint script.
- Understand the WSGI vs ASGI distinction in a container.

## Prerequisites

[Docker Compose](/courses/docker-python/docker-compose) and basic FastAPI/Django familiarity.

## The core idea in one line

> Dockerizing a web framework = a cache-friendly image + the right server process + a startup script that runs migrations before serving traffic.

**Analogy — opening a restaurant each morning.** The image is the fully-equipped kitchen. But before you serve customers you run the opening checklist: unlock (migrations to update the DB), set the tables (collect static files), and only then flip the sign to "open" (start the server). The **entrypoint script** is that opening checklist — it runs every time the container starts.

## FastAPI (ASGI)

FastAPI is **ASGI** (async). Serve it with Uvicorn, optionally managed by Gunicorn for multiple workers.

```dockerfile
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONUNBUFFERED=1              # logs stream immediately, not buffered
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
# Multiple Uvicorn workers via Gunicorn:
CMD ["gunicorn", "app.main:app", "-k", "uvicorn.workers.UvicornWorker",
     "-w", "4", "-b", "0.0.0.0:8000"]
```

Key points:
- **Bind to `0.0.0.0`**, not `127.0.0.1` — otherwise the server is unreachable from outside the container.
- `PYTHONUNBUFFERED=1` so `docker logs` shows output in real time.
- `-w 4` runs 4 worker processes (rule of thumb: `2 × CPU cores + 1`, then measure).

## Django (WSGI, or ASGI)

Django is traditionally **WSGI**; serve with Gunicorn. Django also needs **migrations** and **static files** handled at startup.

```dockerfile
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONUNBUFFERED=1 DJANGO_SETTINGS_MODULE=myproject.settings
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn", "myproject.wsgi:application", "-w", "3", "-b", "0.0.0.0:8000"]
```

```bash
#!/bin/sh
# entrypoint.sh — runs on every container start, BEFORE the CMD server
set -e
python manage.py migrate --noinput          # apply DB migrations
python manage.py collectstatic --noinput    # gather static files
exec "$@"                                    # then run the CMD (gunicorn)
```

`exec "$@"` hands control to the `CMD` after setup — and `exec` replaces the shell so signals (SIGTERM on `docker stop`) reach Gunicorn for a clean shutdown.

## WSGI vs ASGI in one glance

| | WSGI | ASGI |
|---|---|---|
| Model | Sync, one request per worker thread | Async, many concurrent per worker |
| Servers | Gunicorn | Uvicorn (± Gunicorn) |
| Frameworks | Django (classic), Flask | FastAPI, Django async, Starlette |
| Best for | Traditional apps | High-concurrency / streaming |

## Running it with Compose

```yaml
services:
  web:
    build: .
    ports: ["8000:8000"]
    environment:
      DATABASE_URL: postgresql://app:secret@db:5432/app
    depends_on:
      db: { condition: service_healthy }
  db:
    image: postgres:16
    environment: { POSTGRES_USER: app, POSTGRES_PASSWORD: secret, POSTGRES_DB: app }
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5
volumes: { pgdata: {} }
```

The entrypoint's `migrate` runs against `db` — which is why the healthcheck matters: migrations must not run before the database is ready.

## Common mistakes

1. **Binding to `127.0.0.1`** — server unreachable from the host/other containers; use `0.0.0.0`.
2. **Running the dev server (`runserver`/`--reload`) in production** — single-threaded, insecure; use Gunicorn/Uvicorn workers.
3. **Migrations baked into the image build** — they belong at *runtime* (entrypoint), when the DB exists, not at build time.
4. **Forgetting `collectstatic`** — CSS/JS 404s in Django.
5. **Not using `exec "$@"`** — signals don't reach the server, so `docker stop` hangs then kills it.

## Performance & reliability

- Worker count balances throughput vs memory; each worker is a process with its own memory — measure, don't guess.
- `PYTHONUNBUFFERED=1` (or `-u`) is essential for real-time logs in containers.
- Keep the image cache-friendly (deps before code) — you'll rebuild often during development.

## Interview questions

1. **"Why bind to 0.0.0.0 in a container?"** — `127.0.0.1` only listens inside the container; `0.0.0.0` accepts external connections mapped via `-p`.
2. **"Where do migrations run?"** — At container startup (entrypoint), after the DB is ready — not during the image build.
3. **"WSGI vs ASGI?"** — Sync one-per-worker (Gunicorn/Django-classic) vs async high-concurrency (Uvicorn/FastAPI).
4. **"Why `exec \"$@\"` in the entrypoint?"** — It replaces the shell so OS signals reach the server for graceful shutdown.

## Summary

- Build cache-friendly images; bind to `0.0.0.0`; set `PYTHONUNBUFFERED=1`.
- FastAPI → Uvicorn (± Gunicorn) ASGI workers; Django → Gunicorn WSGI.
- Run migrations and `collectstatic` in an entrypoint at startup, then `exec` the server.
- Wire it to a healthy database via Compose.

## Exercises

**Easy**

1. Dockerize a minimal FastAPI app served by Uvicorn on `0.0.0.0:8000`; curl it from the host.
2. Add `PYTHONUNBUFFERED=1` and confirm logs appear immediately in `docker logs`.

**Intermediate**

3. Write a Django entrypoint that runs `migrate` and `collectstatic` then `exec`s Gunicorn; verify migrations apply on startup.
4. Serve FastAPI with Gunicorn + Uvicorn workers (`-w 4`) and confirm multiple worker PIDs.

**Advanced**

5. Compose a Django + Postgres stack where migrations only run once the DB healthcheck passes; prove the ordering with logs.

**Debugging**

6. A FastAPI container starts cleanly but `curl localhost:8000` from the host refuses. Given it binds `127.0.0.1`, explain and fix.

**Mini project**

Fully dockerize either FastAPI or Django with Postgres via Compose: cache-friendly Dockerfile, entrypoint handling migrations (and static for Django), healthchecked DB, and graceful shutdown. Document how to run it and how startup ordering is guaranteed.

## Quiz

<details>
<summary>1. What address must the server bind to inside a container?</summary>
`0.0.0.0` — so it accepts connections from outside the container (via published ports).
</details>

<details>
<summary>2. When should database migrations run?</summary>
At container startup (entrypoint), after the DB is ready — not during the image build.
</details>

<details>
<summary>3. Which server for FastAPI vs classic Django?</summary>
Uvicorn (ASGI) for FastAPI; Gunicorn (WSGI) for classic Django (often Gunicorn managing Uvicorn workers for async).
</details>

<details>
<summary>4. Why end the entrypoint with `exec "$@"`?</summary>
So the server replaces the shell process and receives signals for graceful shutdown.
</details>

## Further reading

- Uvicorn/Gunicorn deployment docs; Django "Deploying static files"
- Next lesson: [PostgreSQL, Redis & Nginx](/courses/docker-python/postgres-redis-nginx)
