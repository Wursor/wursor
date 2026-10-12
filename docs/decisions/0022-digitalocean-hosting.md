# 22. Wursor and WeOwn Cloud run on DigitalOcean

- **Status:** Accepted for the platform choice. The service-level picks below are recommendations to confirm in the infrastructure spike (see Consequences).
- **Date:** 2026-10-12

## Context

[ADR 0020](0020-weown-cloud-provisioning.md) puts Cloud sites on WeOwn Cloud, and WeOwn uses DigitalOcean. Wursor itself will be hosted there too. The PRD describes three separate environments that must not share a network trust boundary: the control plane (Next.js app, Wursor API, Conductor, identity), the execution plane (sandboxes, verification workers, evidence store) and the hosting plane (Cloud sites). The existing infrastructure brief ([DEVOPS.md](../../infrastructure/DEVOPS.md)) assumes a single Docker VPS and a Vite static web build, and `infrastructure/terraform/` is empty.

## Decision

Host all three planes on **DigitalOcean**, each in its own VPC, defined as code with **Terraform** (DigitalOcean provider) in `infrastructure/terraform/`.

Recommended mapping:

| Need | DigitalOcean product | Why |
|---|---|---|
| Next.js app, Wursor API, Conductor | App Platform (containers) if its streaming and timeout limits fit the run stream; otherwise Droplets or DOKS | Managed TLS, deploys from the container registry, small ops load. |
| Wursor database | Managed PostgreSQL with point-in-time recovery | PRD section 21 requires PITR and 15-minute backups, and a quarterly restore drill. |
| Queue and cache | Managed Redis or Valkey | Event queue and short caches. |
| Evidence store, site archives, backups | Spaces (S3-compatible) with versioning, private by default | Signed expiring links for evidence and archive downloads. |
| Sandboxes (execution plane) | Droplets running Docker, in a separate VPC | Matches the existing `DockerodeClient`, warm pool and GC. |
| Cloud sites (hosting plane) | Droplets (or DOKS) in a separate VPC, one isolated container per site, own database credentials and file space | PRD SH-14 and the Cloud isolation rows in section 18.1. |
| Images | Container Registry | Base WordPress image and service images. |
| DNS, domains, certificates | DigitalOcean DNS plus automated certificates (for example Caddy with on-demand TLS) for customer domains | SH-12 needs certificates issued as customers connect domains. |
| Preview origin | Wildcard certificate on a separate registrable domain behind a load balancer | PRD requires previews on a different site from the app (SB-02). |

Network rules: the hosting plane has no inbound path to the Wursor API. Sandboxes have deny-by-default egress through a proxy (SB-03). Only the Conductor reaches the hosting plane, with a service token.

### Options considered

- **DigitalOcean (chosen).** WeOwn's existing provider, so no new vendor or contract, and the existing Docker and `dockerode` work carries over.
- **Another cloud for Wursor, DigitalOcean only for Cloud sites.** More capability, but two clouds to run for a small team.

### Rejected

- Another cloud for the control plane: adds a second provider with no stated need.

## Consequences

- [DEVOPS.md](../../infrastructure/DEVOPS.md) is out of date: it describes React + Vite and a single VPS. Update it after the spike.
- Confirm these before building on them, each as a short written result in `spikes/`:
  1. Whether App Platform supports the long-lived run stream (HTTP timeouts, resume after reconnect), or the Conductor needs Droplets or DOKS.
  2. The isolation level achievable for Cloud sites on Droplets. The PRD's open choice is container versus microVM. Do not assume a microVM runtime is available on Droplets; test it, and treat container hardening plus a cross-site isolation test in CI as the baseline.
  3. Customer-domain certificate issuance at the expected volume.
  4. Backup and restore: daily verified restores of Cloud sites, 30-day retention, a backup before every change (SH-04, SH-14).
  5. Cost per Cloud site and per sandbox, to inform plans and pricing (D-HL-8).
- WeOwn operations staffing (on-call, patching to the 72-hour target, abuse handling) is a readiness item from ADR 0020, not something DigitalOcean removes.
- Secrets live in the platform secret store and the Terraform state is stored in a private Spaces bucket with locking; never in the repo.
- Terraform plans run in CI against a staging project. Nothing is applied to production from a developer machine.
