# Wursor — DevOps & Infrastructure Brief

This is the handoff document for the DevOps / infrastructure engineer. It bundles everything Docker and hosting-related in one place: what exists now, what must be built, and how the infrastructure interfaces with the application code (api / web / plugin).

---

## 1. The product in one paragraph

Wursor is an agentic WordPress management platform. A non-technical site owner describes a change in chat; Wursor spins up an **isolated cloud sandbox** (a copy of their WordPress site), has an AI agent make the change, shows a **live preview**, and on approval **deploys** the change to the real site through a WordPress plugin. The sandbox is the safety guarantee — the live site is never touched until explicit approval.

**Stack:** Node.js + TypeScript (api), React + Vite (web), PHP (plugin), PostgreSQL (Wursor data), Redis (SSE/queue), Docker (sandboxes).

---

## 2. Runtime topology

```
User browser
   │  HTTPS
   ▼
Web app (React/Vite static build) ──proxied──► API (Fastify, Node 22)
                                                    │
              ┌─────────────────────────────────────┼──────────────────────┐
              ▼                                     ▼                      ▼
      PostgreSQL (Wursor data)              Redis (SSE/queue/cache)   Docker host (VPS)
      users / sites / sessions / deploys                                │
                                                                        ├─ Pre-baked WordPress image (read-only)
                                                                        ├─ Warm pool (paused images + 1–2 hot spares)
                                                                        ├─ Active sandboxes (image + overlayfs site layer)
                                                                        ├─ Media proxy (nginx rewrites /wp-content/uploads → origin)
                                                                        └─ GC (idle → pause-to-disk, 24h hard timeout → destroy)
                                                                        
User's live WordPress site ◄──── deploy via plugin REST API (Sprint 2+)
```

Component ownership:

| Component | Language | Repo path | State today |
|---|---|---|---|
| API server | Node 22 + TypeScript (Fastify) | `api/` | auth + sessions routes live |
| Web app | React 19 + Vite | `web/` | sign-up + chat shell live |
| WordPress plugin | PHP | `plugin/` | empty until Sprint 2 |
| Sandbox services | TypeScript | `api/src/sandbox/`, `api/src/services/` | logic + Docker client live (see §3) |
| Docker assets | Dockerfile / compose | `infrastructure/docker/` | scaffold live |
| e2e | Playwright | `e2e/` | chat-flow test live |

---

## 3. What already exists (no DevOps work needed to understand the contract)

These are implemented and unit-tested (mocked at the Docker/Postgres boundary, since the dev machine has neither):

- **`DockerClient` contract** (`api/src/sandbox/docker-client.ts`): `createSandbox(image)`, `destroySandbox(id)`, `status(id)`.
- **`DockerodeClient`** (`api/src/sandbox/dockerode-client.ts`): real implementation using [dockerode](https://github.com/apocas/dockerode). Auto-detects `DOCKER_HOST` or the local unix socket.
- **`SandboxManager`** (`api/src/services/sandbox-manager.ts`): `start()` → `{ sandboxId, previewUrl }`, `destroy(id)`.
- **`ImageManager`** (`api/src/sandbox/image-manager.ts`): owns the base image ref (`WUR_IMAGE`) and the container spec (port 80 → host `WUR_WEB_PORT`, label `wursor.managed=true`).
- **`WarmPool`** (`api/src/services/warm-pool.ts`): tops the pool up to `WARM_POOL_HOT_SPARES`.
- **`gc.ts`** (`api/src/sandbox/gc.ts`): pure decision function — running + idle → `pause`; any sandbox past hard timeout → `destroy`.
- **`subset.ts` / `media-proxy.ts` / `manifest.ts`**: DB subset, media proxying, path→sha256 delta (logic only; not yet wired to a live DB/daemon).
- **`POST /sessions`** (`api/src/routes/sessions.ts`): spins up a sandbox and returns `{ sessionId, sandboxId, previewUrl }`; returns `503 { error: "sandbox_not_configured" }` when sandboxing is off.
- **`POST /auth/signup`** + `GET /health`.
- **Postgres store** (`api/src/services/postgres-user-store.ts`) + migration `api/migrations/001_init.sql`; selected when `DATABASE_URL` is set, otherwise in-memory.

**The API ↔ Docker interface is already defined.** DevOps owns making the daemon side of that interface real and reliable, not redesigning it.

---

## 4. Environment contract (single source of truth: `.env.example`)

| Variable | Purpose | Notes |
|---|---|---|
| `PORT` | API listen port | default `3000` |
| `DATABASE_URL` | Wursor PostgreSQL DSN | set → Postgres store; unset → in-memory (dev only) |
| `REDIS_URL` | Redis DSN | used from Sprint 3 (SSE/queue) |
| `SESSION_SECRET` | session signing | must be a real secret in prod |
| `LLM_PROVIDER` | `grok` \| `openrouter` | model provider |
| `XAI_API_KEY` / `OPENROUTER_API_KEY` | model keys | `OPENROUTER_MODEL` selects the model |
| `DOCKER_HOST` | Docker daemon (dockerode) | optional; auto-detected locally |
| `WUR_ENABLE_SANDBOX` | `1` → enable sandbox spin-up | unset → `/sessions` returns 503 |
| `WUR_IMAGE` | pre-baked image tag | default `wursor-base:latest` |
| `WUR_WEB_PORT` | host port for sandbox HTTP | default `8080` |
| `PREVIEW_BASE_URL` | base URL for preview links | default `http://localhost:8080` |
| `WARM_POOL_HOT_SPARES` | hot-spare count | default `2` |

Secrets are read from `.env` (gitignored) or the environment; never committed.

---

## 5. DevOps work items

Ordered by dependency. Each has an acceptance criterion.

### A. Docker host
- Provision a VPS (or managed Docker runtime) running a Docker daemon reachable by the API.
- Set `DOCKER_HOST` (or use the local unix socket when co-located) and `WUR_ENABLE_SANDBOX=1`.
- **Accept:** `docker info` succeeds from the API host; `POST /sessions` returns `201` with a `sandboxId`.

### B. Pre-baked WordPress image (finalize)
- The scaffold `infrastructure/docker/Dockerfile.wordpress` uses the Apache-based `wordpress:6.7-php8.2` image + WP-CLI. This is a **placeholder**.
- The target base image (PRD §6.2) is: **WordPress + nginx + PHP 8.x + MySQL 8.x + WP-CLI + Redis**, with the WordPress install on a **read-only base layer** and site-specific changes on an **overlayfs layer**.
- Build and tag `wursor-base:latest`; wire into CI image builds.
- **Accept:** `docker build` succeeds; a container boots and serves WordPress on port 80; `wp` CLI works in-container.

### C. Sandbox runtime: warm pool + GC + overlayfs
- **Warm pool:** maintain `WARM_POOL_HOT_SPARES` hot spares plus paused images. Pause-to-disk on idle; resume in ~2s (PRD R8).
- **GC:** implement the container-level effect of `gc.ts` decisions — 15-min idle → pause/checkpoint; 24h hard timeout → destroy, no exceptions.
- **Overlayfs:** site layers as overlayfs on the shared read-only image so sandboxes are cheap and fast.
- **Accept:** a sandbox boots in ≤10s from the warm pool; an idle sandbox pauses and resumes; a 24h sandbox is destroyed automatically.

### D. Media proxy
- Sandbox nginx rewrites `/wp-content/uploads/*` to the live origin (or a signed Wursor proxy). Media is **never bulk-copied**; a file is copied only when the agent replaces it (ADR 0007).
- **Accept:** a sandbox page renders live-site images without downloading the uploads directory.

### E. Preview routing + TLS
- Map each sandbox to a reachable preview URL (subdomain or per-sandbox port) with HTTPS.
- Note: the current code emits `PREVIEW_BASE_URL/<sandboxId>` with a single fixed `WUR_WEB_PORT` — a Sprint 1 placeholder. DevOps must provide **dynamic per-sandbox routing** so concurrent sandboxes don't collide.
- **Accept:** two concurrent sandboxes each resolve to distinct, working preview URLs.

### F. Data services
- **PostgreSQL** for Wursor data. Apply `api/migrations/001_init.sql` on first deploy; add a migration mechanism for future changes.
- **Redis** for SSE streaming and queues (required from Sprint 3).
- **Accept:** `DATABASE_URL` set → sign-up persists across API restarts; `redis-cli ping` succeeds.

### G. CI/CD (finish)
- `ci.yml` exists but is minimal (install + test + lint). Complete it per IMPLEMENTATION §8: split api/web/plugin jobs, add coverage gates (api/web ≥ 90%, plugin ≥ 80%), add an e2e job running the Playwright suite against a Docker service.
- **Accept:** a green CI run on PR, including the Playwright e2e suite.

### H. Secrets management
- Store `SESSION_SECRET`, `DATABASE_URL`, `REDIS_URL`, `DOCKER_HOST`, and LLM keys in the deployment secret store (not `.env`), injected as environment variables.
- **Accept:** no secret value appears in the repo or logs.

### I. Observability
- Minimal telemetry (sign-up, connect, task start/approve/reject, deploy) — Sprint 8. Logs for API + sandbox lifecycle; GC and warm-pool metrics.
- **Accept:** sandbox create/destroy and GC actions are observable.

---

## 6. How DevOps works with the codebase

**Contracts, not re-implementation.** The app calls into infrastructure through three stable seams:

1. **`DockerClient`** — the API already codes against `createSandbox` / `destroySandbox` / `status`. DevOps makes the daemon side behave, not change the interface.
2. **Environment variables** — the only runtime configuration. There is no config file to maintain; changing behavior is changing env vars (§4).
3. **`/health` and `/sessions`** — the integration smoke tests. `/health` proves the app is up; `/sessions` proves the Docker path end-to-end.

**Testing boundaries (TDD rule 3):** unit tests mock Docker and Postgres, so CI runs without a daemon. Only the e2e/integration layer talks to real Docker — the e2e job must run on a Docker-enabled runner (`services: docker` with `--privileged`).

**The plugin (Sprint 2+) is not DevOps-owned** but is part of the same deploy path: it runs on the *user's* WordPress site and exposes REST endpoints for site-info and deploy. DevOps provides the cloud side (snapshot storage for rollback — the last 3 deploy snapshots live in Wursor's cloud, PRD R3) and the media proxy origin.

---

## 7. Key risks DevOps must honor (from PRD §13)

- **R4 (large sites):** task-scoped mirror + media proxy, never a full clone. The sandbox must not pull the user's entire media library.
- **R8 (cost):** no large fleet of always-running WP+MySQL boxes. Warm pool = paused images + 1–2 hot spares. Idle sandboxes pause to disk.
- **R1 (agent breaks sandbox):** overlayfs copy-on-write checkpoints; sandboxes are disposable.
- **R3 (undo when site is down):** last 3 deploy snapshots stored in Wursor's cloud.

---

## 8. Definition of done for the DevOps handoff

- [ ] Docker host reachable; `WUR_ENABLE_SANDBOX=1` and `/sessions` returns `201`.
- [ ] Final `wursor-base:latest` image built (nginx + PHP 8 + MySQL 8 + WP-CLI + Redis) and built in CI.
- [ ] Warm pool + GC + overlayfs running; sandbox boot ≤10s, resume ≤2s, 24h hard destroy.
- [ ] Media proxy live (uploads proxied, not copied).
- [ ] Dynamic preview routing + TLS.
- [ ] PostgreSQL (with migration) and Redis provisioned and wired via env.
- [ ] CI green including Playwright e2e on a Docker runner; coverage gates enforced.
- [ ] Secrets injected, never committed.

---

## 9. References

- `IMPLEMENTATION.md` — §1 architecture, §8 CI/CD pipeline.
- `PRD.md` — §6.2 sandbox, §13 risk register (R1/R3/R4/R8/R14).
- `docs/decisions/` — ADRs 0007 (media proxy), 0013–0015 (Docker boundary, Postgres, dockerode gating).
- `api/src/sandbox/`, `api/src/services/` — the interfaces DevOps integrates against.
