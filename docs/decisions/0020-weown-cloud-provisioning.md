# 20. Cloud sites are provisioned on WeOwn Cloud

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

PRD decision D-HL-7 asked whether Wursor Cloud sites are provisioned on WeOwn Cloud infrastructure or through a partner (WordPress.com, InstaWP, a managed host API) behind the same interface. The hosting plane (steps F and G in [IMPLEMENTATION.md](../../IMPLEMENTATION.md) section 0.4) was blocked on this answer. The PRD recommended WeOwn Cloud only if on-call, security patching and abuse handling are staffed from the first customer.

## Decision

Provision Cloud sites on **WeOwn Cloud**. The hosting plane is a separate environment from the execution plane and is reached only through the platform interface's `provision` operation (SH-16), so the choice is replaceable.

### Options considered

- **WeOwn Cloud (chosen).** Most control and the cleanest story for customers who care about owning their stack. Largest operational load.
- **Partner provisioning first.** Fastest start and least operational risk, with less control over price and behavior. Not chosen.

### Rejected

- Partner provisioning for the first release: Wursor is working with WeOwn Cloud.

## Consequences

- The hosting plane work (SH-04, SH-12, SH-14) is unblocked and can be planned. It is the largest new commitment, and the PRD's rollout plan puts hardening at about 46 weeks.
- The staffing condition in the PRD still stands and is now an open readiness item, not a reason to delay the decision: on-call, patching to the 72-hour target, abuse handling, backups verified by restore tests and a support path must exist before the first Cloud customer (PRD 5.3 and risk "Hosting makes Wursor an operations business").
- The `provision` operation stays behind the interface, so a partner backend can be added later without changing the product (SH-16, V2).
- Cap the number of Cloud sites per plan during beta, as the PRD risk register proposes.
