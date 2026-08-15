# 11. Fastify is the API server; React + Vite is the web shell

- **Status:** Accepted
- **Date:** 2026-08-15

## Context

IMPLEMENTATION §1 names "Express/Fastify" for the backend and "React + TypeScript" for the frontend. Sprint 1 required committing to one server framework before the first route and test.

## Decision

Use **Fastify** for `api/`, and **React 19 + Vite + vitest + @testing-library/react** for `web/`.

### Options considered

- Express (matches the plan's pseudocode).
- Fastify (chosen).

### Rejected

- Express — the plan allows either; Fastify ships built-in JSON-schema validation, native async handlers, and first-class TypeScript, which removes glue the plan would otherwise write by hand.

## Consequences

- Route handlers return via Fastify's `reply` object and validate payloads schema-first (the signup route enforces email format and password length).
- Future routes should keep using Fastify schema validation at the boundary rather than hand-rolled checks.
