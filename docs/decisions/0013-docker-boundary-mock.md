# 13. Sandbox orchestration mocks the Docker boundary; real daemon client deferred

- **Status:** Accepted
- **Date:** 2026-08-15

## Context

The development machine has no Docker daemon (the Phase 0 spikes already hit this). Sprint 1 still had to build and test the sandbox services: DB subset, media proxy, manifest delta, GC, and orchestration.

## Decision

Implement the pure-logic sandbox services (`subset`, `media-proxy`, `manifest`, `gc`) and test them directly. Define a `DockerClient` interface and a `SandboxManager` orchestrator that depends on it, tested with a fake client. Defer the real Docker daemon HTTP client.

### Options considered

- Block on a Docker host.
- Mock at the boundary (chosen).

### Rejected

- Block on Docker — IMPLEMENTATION §7 already specifies "mocks at boundaries"; blocking would stall the slice for a reason that doesn't change the logic.

## Consequences

- `subset` and `media-proxy` logic is promoted from the golden harness (`e2e/golden/src/`) into `api/src/sandbox/`.
- The Docker wire-up (`DockerClient` daemon implementation, `image-manager`, `warm-pool`) is an explicit Sprint 1 follow-up and remains unverified until a Docker host exists.
