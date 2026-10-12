# Hosting on DigitalOcean: spike plan

**Status:** planned. Nothing here has been run.
**Decision it supports:** [ADR 0022](../docs/decisions/0022-digitalocean-hosting.md) (service picks), [ADR 0020](../docs/decisions/0020-weown-cloud-provisioning.md) (WeOwn Cloud).
**Gates:** IMPLEMENTATION.md section 0.4 steps F and G (hosting plane, moves) and the deployment of the Conductor. It does not gate step A, B, C or D, which need no cloud account.

Throwaway scripts and a staging DigitalOcean project are allowed. Product code and production credentials are not. Each spike ends in a short written result added to this folder and a row in [README.md](./README.md). A spike that cannot pass its criteria says so, names the fallback, and updates ADR 0022.

Time-boxes are proposals, not measurements. Dollar figures are not estimated here; spike 5 produces them.

## Setup (once, before any spike)

- A separate DigitalOcean project named for staging, with a spend alert, and no link to production or to any customer site.
- Three VPCs, one per plane (control, execution, hosting), as in ADR 0022.
- Terraform for the above in `infrastructure/terraform/`, plan-only in CI, applied by hand to staging. State in a private Spaces bucket.
- Everything created is tagged `spike` and torn down at the end of each spike. List what was left running in the result.

## Spike 1. Can the run stream live on App Platform?

**Question.** Does App Platform hold a long-lived streaming response (a run can last tens of minutes, PRD AG-05) and let the browser resume from the last event number (HL-06), or does the Conductor need Droplets or DOKS?

**Method.**
1. Deploy a throwaway service that emits one event per second with a sequence number, as a streaming `fetch` endpoint, behind App Platform. Deploy the same service on a Droplet behind a load balancer.
2. Hold a connection for 60 minutes on each. Record when and how it drops (platform timeout, load balancer, idle timeout).
3. Force 50 disconnects mid-stream with a client that resumes from the last sequence number.
4. Deploy a new version of the service during an open stream and record what the client sees.

**Pass.** The chosen host keeps a stream open for a full 60 minutes (or the platform limit is known and the client reconnects inside it), across 50 forced disconnects no event is lost or duplicated (HL-06), and a deploy during a stream loses nothing after resume.

**Result decides.** App Platform for the Conductor, or Droplets/DOKS. Also whether the Next.js server can sit on App Platform (it does not hold the stream, ADR 0018, so it likely can).

**Time-box.** 2 days.

## Spike 2. What isolation can Cloud sites get on a Droplet?

**Question.** PRD 5.3 leaves container versus microVM open. Which isolation level is actually available on DigitalOcean, and does it hold up to a hostile neighbor (SH-14)?

**Method.**
1. Check whether nested virtualization or a microVM runtime (for example Firecracker or Kata) works on the Droplet types in use. Record yes or no per type; do not assume.
2. Build the baseline: one container per site on a shared Droplet, with its own database user, its own file volume, a read-only root filesystem, dropped capabilities, a seccomp profile, resource limits and egress limits.
3. Run a deliberately malicious "site" as a neighbor and try: reading another site's files and database, reaching the Docker socket, reaching the DigitalOcean metadata service, reaching the control-plane VPC, fork bombs and memory exhaustion, and outbound spam to a test sink.
4. Repeat with a microVM runtime if step 1 found one.

**Pass.** Every attack in step 3 fails and is logged, a noisy neighbor cannot starve another site beyond the stated limits, and the test is scripted so it can run in CI on every release (SH-14).

**Result decides.** The Cloud site isolation level, the density per Droplet (feeds spike 5), and whether Cloud beta is capped to fewer sites per plan.

**Time-box.** 4 days. This is the riskiest spike; do it first or in parallel with spike 1.

## Spike 3. Can we issue certificates for customer domains at volume?

**Question.** Can certificates be issued and renewed automatically for customer domains (SH-12) and for the wildcard preview origin (SB-02), without manual steps?

**Method.**
1. Put a TLS-terminating proxy with on-demand issuance in front of two test Cloud sites. Point five test domains at it, using real DNS records on a domain we own.
2. Time issuance from "record correct" to "Secure", and check the error text when the record is wrong, missing, or points somewhere else.
3. Issue a wildcard certificate for the preview origin using DNS validation through DigitalOcean DNS.
4. Check issuer rate limits against the target volume. Run a bulk test of issuances against the issuer's staging environment, not production, and work out how many new domains per week the limits allow.
5. Force a renewal early and confirm no downtime.

**Pass.** Issuance completes without a human, the error states map to the plain-language messages in SH-12, renewal causes no downtime, and the rate-limit headroom is stated as a number against the expected growth.

**Result decides.** The certificate approach, whether a second issuer is needed, and how the "waiting for DNS" screen polls.

**Time-box.** 2 days.

## Spike 4. Backups and restores that we have actually proven

**Question.** Can Cloud sites be backed up daily, kept 30 days, backed up before every change, and restored within the time the product promises (SH-04, SH-14, RL-03)?

**Method.**
1. Back up a test WordPress site (database plus uploads plus configuration) to Spaces with versioning, using the mechanism the WordPress target will call.
2. Restore to a clean Droplet and run the smoke test. Time it, for a small site, a 2 GB site and a 10 GB site.
3. Take a backup before a simulated change, make the change fail, and restore. Time to restored site must be under 10 minutes (section 16).
4. Verify retention: age out day 31 and confirm it is removed, and that day 30 is still restorable.
5. Corrupt a backup on purpose and confirm the restore test notices.
6. Restore the control-plane PostgreSQL to a point in time on a separate instance and record the data-loss window (PRD section 7 target: 15 minutes).

**Pass.** All restores pass the smoke test, the pre-change backup restores in under 10 minutes for the small and 2 GB sites, the corrupted backup is caught, and the database restore meets the 4-hour recovery and 15-minute loss targets.

**Result decides.** Backup mechanism for the WordPress target (D-HL-5), retention beyond 30 days as a paid option (D-HL-8), and which sizes need a different method.

**Time-box.** 3 days.

## Spike 5. What does a Cloud site and a sandbox cost?

**Question.** What do we pay per Cloud site and per sandbox, so that plans and prices (D-HL-8, D-HL-14) are not guesses?

**Method.**
1. Using the density from spike 2, run N sites of different sizes (small brochure, WooCommerce-style, media-heavy) for 7 days on a shared Droplet. Record CPU, memory, disk, bandwidth and backup storage per site.
2. Run sandboxes through the existing warm pool and garbage collection (DEVOPS.md items B and C) and record the cost of a warm spare, a paused sandbox and an active one over a day.
3. Add the managed services (PostgreSQL, Redis or Valkey, Spaces, load balancers) pro rata.
4. Report cost per Cloud site per month and per verified change, as ranges with the assumptions that produce them, from DigitalOcean's current price list at the time of the test.

**Pass.** A table of cost per Cloud site by site type, cost per sandbox-hour, and a statement of what density the figures assume.

**Result decides.** Plan structure and the Cloud-sites-per-plan cap during beta; whether partner provisioning should be reconsidered (SH-16) if the numbers are out of reach.

**Time-box.** 1 day of setup plus a 7-day run.

## Order and dependencies

1. Setup.
2. Spikes 1 and 2 in parallel. Spike 2 is the one most likely to change the plan.
3. Spike 3, then spike 4. Spike 4 needs a running Cloud-style site from spike 2.
4. Spike 5 last, since it uses spike 2's density.

Total about 12 working days plus the 7-day cost run, on one engineer, less if two work in parallel.

## What a failure changes

- Spike 2 fails (no acceptable isolation on Droplets): cap Cloud sites per plan, add a hardened runtime, or move provisioning to a partner behind the same interface (SH-16, ADR 0020 alternative). Leadership decision.
- Spike 1 fails on App Platform: Conductor goes on Droplets or DOKS. No product change.
- Spike 4 misses the restore targets: restore time becomes a published promise only after it is met; the "under 10 minutes" copy in section 16 changes.

## Out of scope

Model provider choice, sandbox provider alternatives (SB-08), domain purchase, email hosting, and the identity provider decision (D-HL-1).
