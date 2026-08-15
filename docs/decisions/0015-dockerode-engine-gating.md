# 15. Docker daemon client via dockerode behind an injected engine; sandbox gated by env

- **Status:** Accepted
- **Date:** 2026-08-15

## Context

ADR 0013 deferred the real Docker client. Sprint 1 now ships it. There is still no Docker daemon in the dev environment, so the client had to be testable without one.

## Decision

`DockerodeClient` implements `DockerClient` using `dockerode`, but depends on an injected `DockerEngine` (a minimal `createContainer`/`getContainer` surface) instead of `dockerode` directly. The API enables it via `WUR_ENABLE_SANDBOX=1`; when off, `POST /sessions` returns 503. `index.ts` constructs `new Docker()` (dockerode auto-detects `DOCKER_HOST` or the unix socket).

### Options considered

- Raw Docker Engine HTTP over the unix socket.
- dockerode behind an injected engine (chosen).

### Rejected

- Raw HTTP — dockerode already handles unix sockets, TLS, and API version negotiation; reimplementing it is pure waste.

## Consequences

- `DockerodeClient` is unit-tested with a fake engine; only the daemon wiring remains to be verified on a Docker host.
- Sandbox spin-up is opt-in, so local dev without Docker still boots and `auth`/`sessions` behave predictably (503 on sessions).
- Port mapping is a Sprint 1 placeholder (single fixed host port); dynamic port allocation and preview proxying are follow-ups.
