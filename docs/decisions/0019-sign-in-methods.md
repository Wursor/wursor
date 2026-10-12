# 19. Sign-in supports an emailed code, an emailed link and passkeys

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

The PRD text (HL-03) says people sign in with a passkey or an emailed link. The finished design (PX-01, PX-02) uses an emailed 8-character code with separate empty, filled, wrong, expired and resent states, and Google sign-in on both paths. Open decision D-HL-13 asked which to use.

## Decision

Support all three methods, behind one identity service and one authorization code flow with PKCE:

1. **Emailed 8-character code.** The designed default. Single use, expires, rate limited, ten wrong attempts lock the attempt (PX-02).
2. **Emailed link.** The same one-time secret delivered as a link. Offered as the fallback, especially on mobile where opening the mail app and typing a code is awkward.
3. **Passkeys.** Offered after a first successful sign-in, and required for roles that approve once enrolled (ID-02).

Google sign-in stays as designed (PX-01). No method depends on a WordPress account.

Build order: code first because it matches the screens, then the link, then passkeys. Each method is complete and tested before the next starts.

### Options considered

- **All three (chosen).** Covers the designed screens, a mobile fallback and the stronger credential, at the cost of three flows to test and maintain.
- **Code only.** Matches the design exactly and is the smallest build, but gives no phishing-resistant option.
- **Passkey or link only, as HL-03 was written.** Contradicts the screens already designed.

### Rejected

- Passwords: not in the PRD and not wanted for non-technical owners.

## Consequences

- PRD HL-03 and D-HL-13 are updated to match; PRD 26.4 no longer lists the sign-in method as a gap.
- Whether the identity service is bought or built (D-HL-1) is still open. The recommendation in the PRD is to buy a managed provider that supports all three; confirm that it supports an 8-character code with the designed states before choosing, or build that part.
- The unknown-email state must never reveal whether an account exists (PX-01), for every method.
- Tests must cover wrong, expired, reused and rate-limited codes, a replayed authorization code and a wrong PKCE verifier, for each method.
