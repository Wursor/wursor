# 12. In-memory user store behind a UserStore interface; Postgres deferred

- **Status:** Accepted
- **Date:** 2026-08-15

## Context

IMPLEMENTATION §1 names PostgreSQL for Wursor's own data. Sprint 1's first slice needed working sign-up/auth without standing up a database, migrations, or a connection pool on day one.

## Decision

Define a `UserStore` interface and ship `InMemoryUserStore` behind it. Passwords are hashed with `node:crypto` scrypt; session tokens are `crypto.randomBytes(32)` hex.

### Options considered

- Stand up Postgres now.
- In-memory store behind an interface (chosen).

### Rejected

- Postgres now — adds infrastructure friction to the first slice for no behavioral gain; the interface confines the swap to `services/user-store.ts`.

## Consequences

- Auth data is not durable until Postgres lands; restarting the API clears users and sessions.
- The Postgres swap is a drop-in replacement of `InMemoryUserStore` implementing the same `UserStore` contract.
