# Infrastructure and security review: inventory

Step 1 of the review. This lists **what is in scope and how it will be covered**. It contains no findings. Every row starts as `Not reviewed`; the review updates the status and the report links each finding to a row here.

- Prepared: 2026-10-24, on branch `frontend/figma-build-and-verify` at the commit that added this file.
- Method: `git ls-files`, so only tracked files are listed. Tests, docs and Figma assets are left out unless noted. Line counts are from the working tree.
- Statuses: `Not reviewed` · `Skimmed` · `Reviewed` · `Tool only` (covered by a scanner, not read line by line).

## 1. Files to read in full

### API (`api/`, 36 files, about 1,000 lines)

| Area | Files | Lines | Status |
|---|---|---|---|
| Entry and app wiring | `src/index.ts`, `src/app.ts` | 55, 37 | Not reviewed |
| Auth middleware and routes | `src/middleware/auth.ts`, `src/routes/auth.ts` | 25, 36 | Not reviewed |
| Other routes | `src/routes/chat.ts`, `sessions.ts`, `sites.ts` | 38, 16, 67 | Not reviewed |
| Crypto and codes | `src/lib/crypto.ts`, `src/lib/codes.ts` | 24, 28 | Not reviewed |
| Users and sessions | `src/services/user-store.ts`, `postgres-user-store.ts`, `session-store.ts` | 23, 32, 26 | Not reviewed |
| Pairing | `src/services/pairing-service.ts` | 78 | Not reviewed |
| Talking to WordPress sites | `src/services/plugin-client.ts`, `site-store.ts`, `src/agents/wp-executor.ts` | 70, 35, 90 | Not reviewed |
| Agent and model calls | `src/agents/agent-loop.ts`, `llm-client.ts`, `openrouter-client.ts`, `tool-executor.ts`, `tool-schemas.ts`, `system-prompt.ts`, `circuit-breaker.ts` | 48, 23, 32, 7, 97, 5, 21 | Not reviewed |
| Sandbox (runs untrusted site code) | `src/sandbox/*` (8 files), `src/services/sandbox-manager.ts`, `warm-pool.ts` | 189 total, 22, 25 | Not reviewed |
| Database | `migrations/001_init.sql` | 6 | Not reviewed |

### WordPress plugin (`plugin/`, 5 PHP files, about 340 lines)

| File | Lines | Status |
|---|---|---|
| `wursor.php` | 19 | Not reviewed |
| `src/class-auth.php` | 79 | Not reviewed |
| `src/class-api.php` | 74 | Not reviewed |
| `src/class-site-info.php` | 105 | Not reviewed |
| `src/class-admin.php` | 65 | Not reviewed |

This runs on other people's live WordPress sites, so it is the part with the most exposure outside our control.

### Infrastructure and delivery

| Area | Files | Status |
|---|---|---|
| Container images and compose | `infrastructure/docker/Dockerfile.wordpress` (4 lines), `docker-compose.yml` (30) | Not reviewed |
| Terraform | `infrastructure/terraform/` contains only `.gitkeep`. ADR 0022 describes it; nothing is written yet | Nothing to review. Gap noted |
| Deploy scripts | `infrastructure/scripts/` contains only `.gitkeep` | Nothing to review. Gap noted |
| CI | `.github/workflows/ci.yml` (27) | Not reviewed |
| Repository mirroring | `.github/workflows/mirror.yml` (25), `.gitea/workflows/mirror.yml` (25), `scripts/mirror.sh` (22) | Not reviewed (these handle credentials) |
| Dev tooling | `scripts/figma-diff/*` (fd.swift, run.py) | Skimmed only; local dev tool, not shipped |

### Web (`web/`, 316 files, almost all UI)

Only the files that touch trust boundaries are in scope for reading. The rest is UI.

| Area | Files | Status |
|---|---|---|
| Server config, rewrites to the API, headers | `next.config.ts` | Not reviewed |
| Sign-in and token handling in the browser | `src/onboarding/auth-client.ts`, `src/LegacyApp.tsx` (sends email and password) | Not reviewed |
| Where user input is rendered or put in a URL | Search of `src/` for `dangerouslySetInnerHTML`, `innerHTML`, `window.location`, `href={`, query-string handling | Tool and search |
| Everything else in `web/src` and `web/app` | UI components | Tool only |

### Repository-level

| Item | Status |
|---|---|
| Secrets in the working tree: `.env.example`, `.gitignore` (confirms `.env` is ignored) | Not reviewed |
| Secrets in git history (all branches) | Needs a scanner (see section 3) |
| Dependencies: `package.json` files, `pnpm-lock.yaml`, `pnpm-workspace.yaml` overrides | `pnpm audit` reported nothing on 2026-10-24. Not otherwise reviewed |
| `e2e/` (test harness, `run-agent-spike.ts` calls a model API) | Skimmed only |

## 2. Checklist the review runs against

Each line ends the review as one of: `Issue (file:line)`, `Checked, no issue`, `Not applicable`, or `Could not check`. A line left blank counts as a gap.

**Application (OWASP ASVS / Top 10)**
1. Authentication: sign-up, sign-in codes and links, password handling, lockout, enumeration
2. Session management: token creation, storage, expiry, revocation, cookie flags
3. Access control: every route checks who is asking and whose data it is
4. Input validation and injection: SQL, command, prompt, path, SSRF (the API fetches site URLs)
5. Cryptography: randomness, hashing, comparison timing, key handling
6. Secrets: none in code or history, none in logs, safe example files
7. Error handling and logging: no secrets or stack traces to clients
8. Rate limiting and abuse: sign-in, code requests, chat (costs money), pairing
9. Security headers, CORS, CSRF, cookies (web and API)
10. Dependencies and supply chain: known issues, install scripts, lockfile, CI permissions

**WordPress plugin**
11. Capability checks and nonces on every action; REST permission callbacks
12. Token storage and comparison; what a stolen token can do (scopes `read` / `deploy`)
13. Output escaping, input sanitising, direct file access guards

**Sandbox and containers (CIS Docker)**
14. Container user, capabilities, privileged flags, mounts, resource limits, network reachability
15. Image provenance, pinned versions, secrets baked into images
16. Cleanup and isolation between sandboxes and between users

**Delivery and cloud**
17. CI: token permissions, secrets exposure, third-party actions pinned, fork behaviour
18. Mirroring: which credentials, where they are stored, what the mirror can push
19. Terraform and hosting (ADR 0022): network layout, firewall, access, backups. **Not written yet**
20. Backups, recovery, logging and monitoring: **not present in the repo**

## 3. Tools

| Tool | Purpose | Installed here? |
|---|---|---|
| `pnpm audit` | Dependency advisories | Yes (run: clean) |
| Secret scanner (gitleaks) | Secrets in history | No |
| Semgrep | Code patterns (injection, unsafe APIs, PHP) | No |
| Trivy | Dockerfile, compose, Terraform, image CVEs | No |
| Hadolint, Checkov | Dockerfile and IaC rules | No |
| Docker | Build and inspect images | No |
| Terraform CLI | `validate` and `plan` | No |

Nothing is installed yet. Installing means downloading these tools; that waits for your go-ahead.

## 4. What this review cannot cover (so far)

- The live cloud account, DNS, production secrets and anything running on real infrastructure
- Attacking the running sandbox (escape attempts). That needs hands-on testing by a person
- Terraform and deploy scripts that do not exist yet
- Anything outside this repository, such as GitHub and Gitea organisation settings
