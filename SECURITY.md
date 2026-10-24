# Security Policy

Wursor connects to people's live WordPress sites and runs an agent that can change them, so we treat security reports as the highest-priority work in this repository. Thank you for helping keep it safe.

## Project status

Wursor is early. The web app is a tested prototype running on stand-in data, and the API, sandbox runtime, hosting plane and WordPress plugin are partly built or not built. The WordPress plugin (version 0.1.0) **has not completed its security review and should not be connected to a site you care about.** The scope of the review under way is listed in [docs/security/review-inventory.md](docs/security/review-inventory.md).

## Supported versions

There are no stable releases yet. Security fixes go into `main`. Once releases exist, this section will list which versions receive fixes.

## How to report a vulnerability

**Please do not open a public issue, pull request or discussion for a security problem.**

Report it privately using GitHub's private vulnerability reporting: open the **Security** tab of this repository and choose **Report a vulnerability**.

Please include:

- What the problem is and which part is affected (`api`, `web`, `plugin`, `infrastructure`, or the sandbox).
- Steps to reproduce, or a short proof of concept.
- The impact as you understand it, and any conditions it depends on (for example, "needs a paired site" or "needs a signed-in user").
- The commit or version you tested.
- How you would like to be credited, if at all.

## What to expect

These are targets, not guarantees, while the project is small:

| Step | Target |
|---|---|
| Acknowledge your report | Within 3 business days |
| First assessment (accepted, needs more information, or not a vulnerability) | Within 10 business days |
| Fix or mitigation for a critical or high issue | As soon as possible, with updates at least every 14 days |
| Public disclosure | After a fix is available, coordinated with you, and no later than 90 days after your report unless we agree otherwise |

We will credit you in the release notes or advisory unless you ask us not to.

## What is in scope

- Authentication, sessions, sign-up and sign-in, and the pairing of a WordPress site with Wursor.
- The WordPress connector plugin, including its routes, its token handling and anything that could let someone other than the paired Wursor account act on a site.
- The agent and tool layer: anything that lets a prompt or a site's content make the agent act outside the scope the owner approved.
- The sandbox boundary: escape from a sandbox, reaching another sandbox, or reaching the network when egress should be denied.
- Approval and publish logic: any way to release a change without a matching approval, or to alter evidence after approval.
- Tenant isolation: one account reading or changing another account's data, sites or previews.
- Secrets exposed in the code, the git history, build output or logs.
- The infrastructure and deployment code in this repository.

## What is out of scope

- Findings that need physical access to a device, or social engineering of our people.
- Denial-of-service by sheer volume of traffic, and automated scanner output without a demonstrated impact.
- Missing hardening headers or best-practice suggestions with no practical attack.
- Vulnerabilities in third-party software or services themselves (report those to the vendor), unless Wursor uses them unsafely.
- Problems in a self-hosted deployment that come from its own configuration.
- The front-end prototype's stand-in data: it is not real customer data.

## Safe harbor

If you act in good faith and follow this policy, we will not pursue legal action against you or ask others to. Good faith means:

- Test only against your own installation, your own accounts, and sites you own. **Never test against a customer's site or anyone else's account.**
- Do not read, change, copy or delete data that is not yours. If you reach some by accident, stop and tell us.
- Do not degrade the service for others, and do not publish details before a fix or the disclosure date above.

## Bounties

There is no paid bounty program yet. We will say so here when that changes.
