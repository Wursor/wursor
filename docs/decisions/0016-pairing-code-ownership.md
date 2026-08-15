# 16. Pairing-code TTL/lockout lives on the Wursor API; the plugin enforces token/HMAC/scope

- **Status:** Accepted
- **Date:** 2026-08-15

## Context

The pairing threat model (`spikes/pairing-threat-model.md`) mandates that **Wursor generates** the pairing code and **the plugin redeems** it — explicitly rejecting the plugin-local generate/redeem sketch in IMPLEMENTATION. Its "Sprint 2 tests" section, however, still labels the pairing-code TTL/lockout/single-use tests under `plugin/__tests__/test-auth.php`, a leftover from that rejected sketch.

## Decision

The pairing code lifecycle (issue, 5-minute TTL, 5-attempt lockout, single-use, `site_url` https check) is enforced in the API's `PairingService`. The plugin's `class-auth.php` enforces token hashing (SHA-256 + `hash_equals`), HMAC verification, `read` vs `deploy` scoping, and rotation.

### Options considered

- Follow the test-file labels literally (plugin enforces the pairing code).
- Follow the locked flow (chosen).

### Rejected

- Literal labels — they contradict the "Wursor generates, plugin redeems" flow the same note mandates; pairing state can only live where the code is issued.

## Consequences

- `api/__tests__/routes/sites-pair.test.ts` + `pairing-service.test.ts` cover TTL/lockout/single-use.
- `plugin/__tests__/test-auth.php` covers hashing, HMAC, scope, and rotation only.
