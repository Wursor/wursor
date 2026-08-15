# 14. Postgres user store via a Queryable boundary; schema in SQL migrations

- **Status:** Accepted
- **Date:** 2026-08-15

## Context

ADR 0012 deferred Postgres behind the `UserStore` interface. Sprint 1 now ships the real implementation. Postgres is not available in the dev environment, so the store had to be testable without a database.

## Decision

`PostgresUserStore` uses `node-postgres` (`pg`) but depends on a minimal `Queryable` interface (`query(text, values)`) instead of `pg.Pool` directly. `UserStore` methods became async. The `users` table lives in `api/migrations/001_init.sql`. `index.ts` selects Postgres when `DATABASE_URL` is set, else the in-memory store.

### Options considered

- ORM (Prisma/Drizzle) with migrations.
- Raw `pg` behind a `Queryable` interface (chosen).

### Rejected

- ORM — adds tooling and a codegen step for a two-statement surface; the raw SQL is reviewable and the interface keeps tests database-free.

## Consequences

- `InMemoryUserStore` and `PostgresUserStore` share the same async `UserStore` contract; swapping is env-driven.
- Auth data is durable when `DATABASE_URL` is configured; the migration must be applied before first use.
