## Learning objectives

- Run containers as a **non-root** user.
- Keep **secrets** out of images and pin/scan for vulnerabilities.
- Apply hardening: read-only filesystems, dropped capabilities, resource limits.
- Follow a production container security checklist.

## Prerequisites

[Multi-Stage & Optimization](/courses/docker-python/multi-stage-and-optimization) and the earlier Docker lessons.

## The core idea in one line

> A container is isolation, **not a security boundary you can be careless inside** — run as non-root, ship no secrets, pin and scan, and grant the least privilege that works.

**Analogy — a hotel room key that only opens your room.** By default a container process often runs as **root** — a master key that opens everything if it escapes. Good security is issuing a key that opens *only* the one room the guest needs (non-root, minimal capabilities), locking the minibar (read-only filesystem), and never taping the safe combination to the door (no secrets in the image).

## Run as non-root

By default many images run as root. If an attacker breaks out, root in the container is far more dangerous. Create and switch to an unprivileged user:

```dockerfile
FROM python:3.12-slim
RUN useradd --create-home --uid 1001 appuser   # a non-root user
WORKDIR /app
COPY --chown=appuser:appuser . .
RUN pip install --no-cache-dir -r requirements.txt
USER appuser                                   # ← drop privileges
CMD ["gunicorn", "app.main:app", "-b", "0.0.0.0:8000"]
```

`USER appuser` means the process runs unprivileged. This is one of the highest-impact, lowest-effort hardening steps.

## Keep secrets out of images

Secrets baked into an image are visible to anyone who pulls it — and `docker history` can reveal build args.

```dockerfile
# ❌ NEVER
ENV API_KEY=sk-secret123
# ❌ NEVER
ARG DB_PASSWORD           # visible in build history
```

Instead:
- Pass secrets at **runtime** via environment (`-e`, Compose `env_file`, orchestrator secrets).
- Use Docker/BuildKit **secret mounts** for build-time secrets that must not persist.
- Never commit `.env`; add it to `.gitignore` and `.dockerignore`.

## Pin versions and scan

```dockerfile
FROM python:3.12-slim         # pin the version, not `python:latest`
```

- **Pin** base images and dependencies — `latest` is a moving target that breaks builds and hides regressions.
- **Scan** for CVEs regularly:

```bash
docker scout cves myapp       # or: trivy image myapp
```

Rebuild on base-image security updates; a pinned image still needs periodic refreshing.

## Hardening at runtime

```bash
docker run \
  --read-only \                       # immutable filesystem (write only to tmpfs/volumes)
  --tmpfs /tmp \                       # a writable temp dir
  --cap-drop ALL \                     # drop all Linux capabilities
  --security-opt no-new-privileges \   # process can't gain more privileges
  --memory 512m --cpus 1 \             # resource limits (prevent noisy-neighbor DoS)
  myapp
```

Or in Compose:

```yaml
  web:
    read_only: true
    tmpfs: ["/tmp"]
    cap_drop: ["ALL"]
    security_opt: ["no-new-privileges:true"]
    deploy:
      resources:
        limits: { cpus: "1", memory: 512M }
```

Least privilege: start locked-down and open only what the app actually needs.

## Production security checklist

- [ ] Runs as a **non-root** user (`USER`)
- [ ] **No secrets** in the image, build args, or history
- [ ] Base image and dependencies **pinned**
- [ ] Image **scanned** for CVEs in CI; rebuilt on updates
- [ ] `--read-only` root FS with explicit writable mounts/tmpfs
- [ ] `--cap-drop ALL` + `no-new-privileges`
- [ ] **Resource limits** (memory/CPU) set
- [ ] Minimal image (multi-stage, slim) → smaller attack surface
- [ ] Database/cache ports **not published** to the host
- [ ] `.dockerignore` excludes `.env`, `.git`, keys

## Common mistakes

1. **Running as root** — the default; drop to a non-root user.
2. **Secrets in `ENV`/`ARG`/image** — exposed to anyone with the image.
3. **`FROM ...:latest`** — unpinned, unreproducible, silently changing.
4. **Never scanning** — shipping known CVEs.
5. **No resource limits** — one container can starve the host.

## Performance & operations

- Non-root and dropped capabilities have **no meaningful performance cost** — pure upside.
- Resource limits protect co-located services and make scheduling predictable.
- Smaller, scanned images pull faster and carry fewer vulnerabilities.

## Interview questions

1. **"Why run containers as non-root?"** — Limits blast radius if the process or a breakout is compromised; root-in-container is dangerous.
2. **"How do you handle secrets in Docker?"** — Inject at runtime (env/secret mounts/orchestrator secrets); never bake into image/build args; gitignore `.env`.
3. **"Why pin base images?"** — Reproducible builds and controlled updates; `latest` changes underfoot and hides regressions/CVEs.
4. **"Name three runtime hardening flags."** — `--read-only`, `--cap-drop ALL`, `--security-opt no-new-privileges` (plus resource limits).

## Summary

- Isolation isn't a license to be careless: run non-root, ship no secrets, pin and scan.
- Harden at runtime: read-only FS, drop capabilities, no new privileges, resource limits.
- Smaller images and internal-only data ports reduce attack surface.
- Work the production security checklist for every image you ship.

## Exercises

**Easy**

1. Add a non-root `USER` to a Dockerfile and confirm `whoami` inside the container isn't root.
2. Pin a base image to an explicit version and explain why over `latest`.

**Intermediate**

3. Move a secret out of `ENV` into a runtime `env_file` (gitignored) and verify it's not in `docker history`.
4. Scan an image with `docker scout`/`trivy` and address one finding.

**Advanced**

5. Run an app with `--read-only`, `--cap-drop ALL`, `no-new-privileges`, and memory/CPU limits; fix whatever breaks (e.g. add a tmpfs for temp writes).

**Debugging**

6. An app that writes to `/tmp` crashes under `--read-only`. Explain why and fix it without removing read-only.

**Mini project**

Harden a real app image against the full checklist: non-root user, no secrets, pinned+scanned base, read-only FS with explicit writable mounts, dropped capabilities, and resource limits. Document each control and the one thing you had to adjust to keep the app working.

## Quiz

<details>
<summary>1. What's the single highest-impact, lowest-effort hardening step?</summary>
Running as a non-root user (`USER appuser`).
</details>

<details>
<summary>2. Where should secrets live?</summary>
Injected at runtime (env/secret mounts/orchestrator secrets) — never baked into the image, ENV, or build args.
</details>

<details>
<summary>3. Why avoid `FROM python:latest`?</summary>
It's unpinned and changes over time — non-reproducible builds that can silently pull new bugs/CVEs.
</details>

<details>
<summary>4. What does `--cap-drop ALL` do?</summary>
Removes all Linux capabilities from the container process, granting least privilege (add back only what's needed).
</details>

## Further reading

- Docker security docs; CIS Docker Benchmark; OWASP Docker Top 10
- `docker scout`, Trivy, Grype scanners
- Next lesson: [Debugging, Logging & Health Checks](/courses/docker-python/debugging-and-healthchecks)
