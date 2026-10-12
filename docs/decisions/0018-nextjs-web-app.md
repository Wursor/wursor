# 18. The web app is Next.js (App Router); Fastify stays as the Wursor API

- **Status:** Accepted
- **Date:** 2026-10-12
- **Supersedes:** the web half of [ADR 0011](0011-fastify-react-stack.md). The Fastify half stands.

## Context

PRD Headless revision 4 (HL-01, HL-04, HL-07, HL-08, HL-15) requires a web app with a server layer that holds access and refresh tokens, so the browser only ever sees an HttpOnly session cookie and, while watching a run, a two-minute stream token. It also requires dynamically rendered authenticated pages that are never shared-cached, CSRF protection on state-changing requests, static marketing pages, and an installable PWA. [ADR 0011](0011-fastify-react-stack.md) chose React + Vite, which is a client-only shell with no server layer. `web/` currently holds the Sprint 1 and Sprint 2 components and hooks (signup, chat, preview, approve, site connector).

## Decision

Build the web app on **Next.js (App Router, TypeScript)**. Keep **Fastify** for the Wursor API in `api/`. Keep vitest and Testing Library for unit and component tests, and Playwright for end to end.

The Next.js server is the backend for frontend: it owns the session, holds tokens, validates input against the OpenAPI contract and calls the Wursor API on the person's behalf. It makes no authorization decisions; the Wursor API rechecks every permission. Run streams go directly from the browser to the Conductor, never through Next.js.

Existing `web/` React components and hooks are kept and moved under the Next.js app. The Vite shell is retired once the Next.js app serves the same screens.

### Options considered

- **Next.js (chosen).** Matches the PRD as written. Server Components, server actions and route handlers give the token-holding layer, per-request rendering and static marketing pages in one framework, and the team already writes React and TypeScript.
- **Keep Vite and add a backend for frontend inside the Fastify API.** Smallest change to the repo, and one fewer framework. It puts session and cookie handling in the API, which the PRD wants kept separate from the control plane, and leaves marketing pages, SEO and PWA scope to be rebuilt by hand.
- **Vite plus a separate small BFF service.** Clean separation, but one more deployable for a small team, which the PRD's risk register already flags.

### Rejected

- Keeping Vite alone: it cannot satisfy HL-04 (no tokens in the browser).
- A separate BFF service: extra deployable with no benefit over the Next.js server layer.

## Consequences

- `web/` becomes a Next.js app. The migration is step C and H in [IMPLEMENTATION.md](../../IMPLEMENTATION.md) section 0.4; existing Sprint 1 and 2 screens move first, and the in-memory session token flow from Sprint 1 is replaced by server-held sessions.
- `web/package.json` changes its dev, build and start scripts. Tests stay on vitest.
- The 90% coverage floor for `web/` continues to apply. Server Components and server actions are tested at the unit level where possible and covered by Playwright otherwise.
- Hosting for the Next.js app must support server rendering and streaming responses (PRD section 21).
- No more Vite-specific code is added to `web/` from this point.
