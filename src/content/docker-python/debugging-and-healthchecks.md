## Learning objectives

- Diagnose containers with `logs`, `exec`, `inspect`, and `stats`.
- Add **HEALTHCHECK** and understand readiness vs liveness.
- Configure **restart policies** and resource limits.
- Fix the mistakes every Docker beginner hits.

## Prerequisites

The earlier Docker lessons. This one is your field guide for when things go wrong.

## The core idea in one line

> When a container misbehaves, you don't guess — you **read its logs, step inside it, and inspect its config**; and you teach Docker to know when your app is actually healthy.

**Analogy — a doctor's toolkit.** `logs` is listening to the patient describe symptoms. `exec` is stepping into the room to examine directly. `inspect` is the medical chart (config, mounts, env). `stats` is the vital-signs monitor (CPU, memory). A **healthcheck** is the patient's own "I'm fine / I'm not" signal so the system reacts before a full collapse.

## The debugging toolkit

```bash
docker logs -f --tail 100 web      # app output (stdout/stderr) — start here
docker exec -it web sh             # step inside a RUNNING container
docker inspect web                 # full config: env, mounts, network, entrypoint
docker stats                       # live CPU/memory per container
docker events                      # stream of daemon events (starts, dies, OOMs)
docker ps -a                       # is it even running? what exit code?
```

### Container exits immediately — the #1 problem

```bash
docker ps -a          # STATUS shows "Exited (1) 3 seconds ago"
docker logs web       # the traceback/reason is almost always here
```

Common causes: an exception on startup, the main process finished (containers live only as long as PID 1 runs), a wrong `CMD`, or a missing env var. **The logs almost always tell you.**

### Can't debug because it won't stay up?

Override the entrypoint to get a shell:

```bash
docker run -it --entrypoint sh myimage    # poke around the filesystem
```

## Logs: make them container-friendly

- Log to **stdout/stderr**, not files — Docker captures streams; files get lost in the ephemeral FS.
- Set `PYTHONUNBUFFERED=1` (or `python -u`) so output isn't buffered and appears live.
- Use structured logging (from the Python logging lesson) so a log aggregator can parse it.

## HEALTHCHECK — is it actually ready?

A running container isn't necessarily a *working* one. `HEALTHCHECK` runs a command periodically; the container is marked `healthy`/`unhealthy`.

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1
```

- `--start-period` — grace time during slow startup (no failures counted yet).
- `--retries` — consecutive failures before `unhealthy`.
- Compose's `depends_on: condition: service_healthy` relies on this — so the API waits for a *ready* database, not just a started one.

### Liveness vs readiness

| | Liveness | Readiness |
|---|---|---|
| Question | Is the process alive? | Can it serve traffic now? |
| Failure action | Restart it | Stop sending traffic |
| Example | Process responds at all | DB connection established |

Docker's HEALTHCHECK is closest to readiness; orchestrators (Kubernetes) separate the two.

## Restart policies

```bash
docker run --restart=unless-stopped myapp
```

| Policy | Behavior |
|---|---|
| `no` (default) | Never restart |
| `on-failure[:N]` | Restart on non-zero exit, up to N times |
| `unless-stopped` | Always restart unless you explicitly stopped it |
| `always` | Always restart (even after daemon reboot) |

Use `unless-stopped` for long-running services so a crash or host reboot brings them back.

## Resource limits (and OOM)

```bash
docker run --memory=512m --cpus=1 myapp
```

If a container exceeds its memory limit, the kernel **OOM-kills** it — you'll see exit code 137 and `docker inspect` shows `OOMKilled: true`. Limits prevent one container from starving the host.

## Common mistakes (the beginner gauntlet)

1. **Container exits instantly** — the main process ended or crashed; read `docker logs` and `docker ps -a`.
2. **Logs empty** — output buffered; set `PYTHONUNBUFFERED=1`, log to stdout.
3. **"Works then dies under load"** — OOM-killed (exit 137); raise the memory limit or fix the leak.
4. **`depends_on` didn't wait** — no healthcheck; add one with `service_healthy`.
5. **Editing files inside a container to "fix" it** — lost on restart; fix the image/Dockerfile.

## Performance & operations

- `docker stats` quickly reveals a memory leak (steadily climbing usage) or a CPU hog.
- Healthchecks add tiny overhead but enable self-healing and correct startup ordering.
- Restart policies + healthchecks together give basic resilience without an orchestrator.

## Interview questions

1. **"A container exits immediately — how do you debug?"** — `docker ps -a` for the exit code, `docker logs` for the reason, override the entrypoint with a shell if needed.
2. **"What does HEALTHCHECK give you?"** — Periodic readiness signal driving `healthy`/`unhealthy`, used by Compose `service_healthy` and load balancers.
3. **"What is exit code 137?"** — The container was OOM-killed (SIGKILL from exceeding its memory limit).
4. **"Which restart policy for a web service?"** — `unless-stopped` (or `always`) so it recovers from crashes and reboots.

## Summary

- Debug with `logs`, `exec`, `inspect`, `stats`, and `ps -a` — read, don't guess.
- Log to stdout with `PYTHONUNBUFFERED=1`; the reason a container died is usually in the logs.
- Add HEALTHCHECKs for readiness and startup ordering; know liveness vs readiness.
- Set restart policies and resource limits for resilience; exit 137 = OOM.

## Exercises

**Easy**

1. Make a container that crashes on startup; find the cause using `docker ps -a` and `docker logs`.
2. Add `PYTHONUNBUFFERED=1` to a container whose logs were empty and confirm output now streams.

**Intermediate**

3. Add a HEALTHCHECK hitting a `/health` endpoint; watch it go `healthy` and simulate a failure to see `unhealthy`.
4. Set `--restart=on-failure:3` and prove it restarts a crashing container three times then stops.

**Advanced**

5. Run a memory-hungry container with `--memory=256m`, trigger an OOM kill, and confirm exit code 137 / `OOMKilled: true` via `inspect`.

**Debugging**

6. A service in Compose crashes because the DB "isn't ready," yet `depends_on` is set. Explain the gap and fix it with a healthcheck.

**Mini project**

Add operational robustness to your app stack: stdout structured logging, a `/health` endpoint + HEALTHCHECK, `restart: unless-stopped`, memory/CPU limits, and a short runbook documenting how to diagnose the five common failures using the toolkit above.

## Quiz

<details>
<summary>1. Where do you look first when a container exits immediately?</summary>
`docker ps -a` (exit code/status) and `docker logs` (the actual reason).
</details>

<details>
<summary>2. Why might a container's logs be empty?</summary>
Output is buffered — set `PYTHONUNBUFFERED=1` (or `python -u`) and log to stdout/stderr.
</details>

<details>
<summary>3. What does HEALTHCHECK enable in Compose?</summary>
`depends_on: condition: service_healthy`, so dependents wait until a service is actually ready.
</details>

<details>
<summary>4. What does exit code 137 usually mean?</summary>
The container was OOM-killed for exceeding its memory limit.
</details>

## Further reading

- Docker docs: `logs`, `exec`, `inspect`, HEALTHCHECK, restart policies
- Next lesson: [Dev vs Prod Workflow & Capstone Deployment](/courses/docker-python/dev-vs-prod-and-capstone)
